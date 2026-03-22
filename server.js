/*
 * NAGARIK — Backend Server (Switched to Gemini API)
 * Node.js + Express
 * 
 * SETUP:
 *   npm install express cors dotenv @google/generative-ai
 * 
 * Create a .env file:
 *   GEMINI_API_KEY=your_api_key_here
 *   PORT=3001
 * 
 * Run:
 *   node server.js
 */

const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const app    = express();
const PORT   = process.env.PORT || 3001;
const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static frontend files (index.html, styles.css, app.js)
app.use(express.static(__dirname));

/* ══════════════════════════════════════════════════════
   TOKEN COMPRESSION ENGINE
   
   This is the core technique:
   We compress the raw legal text into a structured
   skeleton BEFORE sending to the LLM — dramatically
   reducing token usage while preserving legal meaning.
══════════════════════════════════════════════════════ */

function compressDocument(text, depth) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Step 1: Remove boilerplate legal filler phrases
  const fillerPhrases = [
    /\bhereinafter referred to as\b/gi,
    /\bnotwithstanding anything contained in\b/gi,
    /\bin accordance with the provisions of\b/gi,
    /\bsubject to the provisions of\b/gi,
    /\bfor the purposes of this (section|act|clause)\b/gi,
    /\bthe provisions of this (section|act) shall apply\b/gi,
    /\bunder the provisions of\b/gi,
    /\bBe it enacted by Parliament/gi,
    /\bIN THE SEVENTY-\w+ YEAR OF THE REPUBLIC\b/gi,
    /\bwhere the context so requires\b/gi,
    /\bshall be construed accordingly\b/gi,
  ];

  // Step 2: Abbreviation map for common legal terms
  const abbreviations = {
    'Data Principal': 'DP',
    'Data Fiduciary': 'DF',
    'Data Processor': 'DProc',
    'Government of India': 'GoI',
    'Finance Minister': 'FM',
    'rupees': '₹',
    'crore': 'Cr',
    'lakh': 'L',
    'section': 'sec',
    'subsection': 'sub-sec',
    'clause': 'cl',
    'namely': ':',
    'that is to say': 'i.e.',
    'and/or': '/',
    'any person who': 'whoever',
  };

  let compressed = lines.join(' ');

  // Apply filler removal
  fillerPhrases.forEach(pattern => {
    compressed = compressed.replace(pattern, '');
  });

  // Apply abbreviations
  Object.entries(abbreviations).forEach(([full, abbr]) => {
    const regex = new RegExp(full, 'gi');
    compressed = compressed.replace(regex, abbr);
  });

  // Step 3: Remove excessive whitespace
  compressed = compressed.replace(/\s{2,}/g, ' ').trim();

  // Step 4: For brief mode, extract only numbered/lettered provisions
  if (depth === 'brief') {
    const sentences = compressed.split(/[.;]/).filter(s => s.trim().length > 20);
    // Take first 20% of sentences
    const take = Math.max(10, Math.floor(sentences.length * 0.2));
    compressed = sentences.slice(0, take).join('. ');
  }

  // Step 5: Structural extraction — build a schema-like skeleton
  const skeleton = buildSkeleton(compressed, depth);

  return skeleton;
}

function buildSkeleton(text, depth) {
  // Extract sections using Roman/Arabic numerals and common patterns
  const sectionRegex = /(?:CHAPTER|PART|SECTION|SEC|Article)\s+[IVXivx\d]+[.\s—-]+([^.]{5,80})/gi;
  const penaltyRegex = /penalt(?:y|ies)[^.]{0,200}/gi;
  const definitionRegex = /(?:means?|includes?|refers? to)[^.]{5,120}/gi;
  const amountRegex = /(?:₹|Rs\.?|rupees?)\s*[\d,]+(?:\s*(?:crore|lakh|thousand|Cr|L))?/gi;

  const sections = [];
  let m;
  while ((m = sectionRegex.exec(text)) !== null) sections.push(m[1].trim());

  const amounts   = (text.match(amountRegex)  || []).slice(0, 10);
  const penalties = (text.match(penaltyRegex) || []).slice(0, 3);

  // Build compressed prompt skeleton
  let skeleton = `DOC_TEXT_COMPRESSED:\n${text.substring(0, depth === 'detailed' ? 12000 : depth === 'standard' ? 7000 : 3000)}`;

  if (sections.length > 0) {
    skeleton += `\n\nSECTION_HEADERS:[${sections.slice(0, 15).join(' | ')}]`;
  }
  if (amounts.length > 0) {
    skeleton += `\n\nFINANCIAL_REFS:[${amounts.join(' | ')}]`;
  }
  if (penalties.length > 0) {
    skeleton += `\n\nPENALTY_CLAUSES:[${penalties.map(p => p.substring(0, 100)).join(' | ')}]`;
  }

  return skeleton;
}

/* ══════════════════════════════════════════════════════
   PROMPT BUILDER
══════════════════════════════════════════════════════ */

function buildSystemPrompt(depth, language) {
  const langInstructions = {
    english: 'Respond in clear, formal English.',
    hindi: 'Respond in Hindi (हिंदी में उत्तर दें). All fields must be in Hindi.',
    simple: 'Respond in very simple English. Use short sentences. Avoid all legal jargon. Write as if explaining to a 14-year-old student.'
  };

  return `You are NAGARIK, an expert Indian legal analyst and citizen education AI.
Your job is to analyze government documents, parliamentary bills, and legal texts and produce
clear, accurate, citizen-friendly intelligence briefs using Token Compression output format.

CRITICAL RULES:
- Be accurate. Never fabricate legal provisions.
- Be concise. Every word must deliver maximum information value.
- Use plain language. Avoid jargon that common citizens won't understand.
- ${langInstructions[language] || langInstructions.english}

OUTPUT FORMAT: You MUST respond with a valid JSON object and nothing else.
No preamble, no markdown fences, just raw JSON.

{
  "documentType": "string — e.g. CENTRAL ACT, UNION BUDGET, STATE POLICY, etc.",
  "summary": "string — 2-4 sentence executive summary in plain language",
  "keyPoints": ["array of 5-8 key provisions or facts as plain strings"],
  "citizenImpact": [
    {"group": "GROUP NAME", "description": "how this affects them"},
    ...3-6 groups like: Common Citizens, Businesses, Students, Women, Farmers, Digital Users
  ],
  "concerns": ["array of 2-4 notable concerns, controversies, or watch items — or empty array if none"],
  "outputTokens": number_estimate_of_this_response_in_tokens
}

Depth level: ${depth.toUpperCase()} — ${
    depth === 'brief'    ? 'TL;DR only. Be extremely concise.' :
    depth === 'detailed' ? 'Be thorough and cover all important provisions.' :
                           'Balanced coverage of the most important points.'
  }`;
}

/* ══════════════════════════════════════════════════════
   API ENDPOINT
══════════════════════════════════════════════════════ */

app.post('/api/analyze', async (req, res) => {
  const { text, depth = 'standard', language = 'english' } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid text field.' });
  }

  if (text.length < 50) {
    return res.status(400).json({ error: 'Document too short for meaningful analysis.' });
  }

  if (text.length > 500000) {
    return res.status(400).json({ error: 'Document exceeds maximum supported size (500K characters).' });
  }

  try {
    // ── TOKEN COMPRESSION ──
    console.log(`[NAGARIK] Received document: ${text.length} chars (~${Math.round(text.length/4)} tokens)`);
    
    const compressedDoc = compressDocument(text, depth);
    const compressedTokens = Math.round(compressedDoc.length / 4);
    const originalTokens   = Math.round(text.length / 4);
    const compressionRatio = ((1 - compressedTokens / originalTokens) * 100).toFixed(1);

    console.log(`[NAGARIK] After compression: ~${compressedTokens} tokens (saved ${compressionRatio}%)`);

    // ── CALL GEMINI ──
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: buildSystemPrompt(depth, language)
    });

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: `Analyze this compressed Indian legal/government document and produce the JSON brief:\n\n${compressedDoc}` }]
        }
      ],
      generationConfig: {
        maxOutputTokens: 8192
      }
    });

    const rawContent = result.response.text();
    
    // Robust JSON extraction
    let cleaned = rawContent;
    const startIdx = cleaned.indexOf('{');
    const endIdx = cleaned.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1) {
      cleaned = cleaned.substring(startIdx, endIdx + 1);
    }
    
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error('[NAGARIK] JSON parse error:', err.message);
      console.error('[NAGARIK] Raw response:', rawContent ? rawContent.substring(0, 500) : 'none');
      return res.status(500).json({
        error: 'Failed to extract valid JSON from the AI response. Please try again.',
        raw: rawContent ? rawContent.substring(0, 300) : ''
      });
    }

    // Attach metadata
    parsed.originalTokens   = originalTokens;
    parsed.compressedTokens = compressedTokens;
    parsed.compressionRatio = parseFloat(compressionRatio);
    parsed.outputTokens     = Math.round(rawContent.length / 4);

    console.log(`[NAGARIK] Success. Output: ~${parsed.outputTokens} tokens.`);

    return res.json(parsed);

  } catch (err) {
    console.error('[NAGARIK] API error:', err.message || err);

    if (err.status === 401 || err.message.includes('API key')) {
      return res.status(500).json({ error: 'Invalid API key. Please check your GEMINI_API_KEY in .env. Go to aistudio.google.com to get a free key.' });
    }
    if (err.status === 429) {
      return res.status(429).json({ error: 'Rate limit reached. Please wait a moment and try again.' });
    }

    return res.status(500).json({ error: `Server error: ${err.message || 'Unknown error'}` });
  }
});

/* ══════════════════════════════════════════════════════
   HEALTH CHECK
══════════════════════════════════════════════════════ */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'NAGARIK — Citizen Policy Intelligence',
    tokenCompression: 'active',
    timestamp: new Date().toISOString()
  });
});

/* ══════════════════════════════════════════════════════
   START
══════════════════════════════════════════════════════ */
app.listen(PORT, () => {
  console.log('');
  console.log('  ███╗   ██╗ █████╗  ██████╗  █████╗ ██████╗ ██╗██╗  ██╗');
  console.log('  ████╗  ██║██╔══██╗██╔════╝ ██╔══██╗██╔══██╗██║██║ ██╔╝');
  console.log('  ██╔██╗ ██║███████║██║  ███╗███████║██████╔╝██║█████╔╝ ');
  console.log('  ██║╚██╗██║██╔══██║██║   ██║██╔══██║██╔══██╗██║██╔═██╗ ');
  console.log('  ██║ ╚████║██║  ██║╚██████╔╝██║  ██║██║  ██║██║██║  ██╗');
  console.log('  ╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝');
  console.log('');
  console.log(`  🏛  Citizen's Policy Intelligence`);
  console.log(`  🔄  Token Compression Engine: ACTIVE`);
  console.log(`  🚀  Server running at http://localhost:${PORT}`);
  console.log(`  📋  Health: http://localhost:${PORT}/api/health`);
  console.log('');
  
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('your_')) {
    console.warn('  ⚠️  WARNING: GEMINI_API_KEY not set or is invalid in .env file!');
    console.warn('  Create a .env file: GEMINI_API_KEY=your_key_here\n  (Get it from https://aistudio.google.com)\n');
  }
});
