/* ================================================
   NAGARIK — Frontend App Logic
   Connects to Node.js backend at /api/analyze
   ================================================ */

const API_URL = window.location.protocol === 'file:' 
  ? 'http://localhost:3001/api/analyze' 
  : '/api/analyze';

// Session state
let sessionHistory = [];
let totalTokensSaved = 0;
let currentResult = null;

// Sample documents for demo
const SAMPLES = {
  dpdp: `DIGITAL PERSONAL DATA PROTECTION ACT, 2023
THE DIGITAL PERSONAL DATA PROTECTION ACT, 2023

An Act to provide for the processing of digital personal data in a manner that recognises both the right of individuals to protect their personal data and the need to process such personal data for lawful purposes and for matters connected therewith or incidental thereto.

BE it enacted by Parliament in the Seventy-fourth Year of the Republic of India as follows:—

CHAPTER I — PRELIMINARY

1. Short title, extent, commencement and application.—(1) This Act may be called the Digital Personal Data Protection Act, 2023. (2) It extends to the whole of India and also applies to processing of digital personal data outside the territory of India, if such processing is in connection with any activity related to offering of goods or services to Data Principals within the territory of India.

2. Definitions.—In this Act, unless the context otherwise requires,—(a) "Appellate Tribunal" means the Appellate Tribunal established under section 29; (b) "Board" means the Data Protection Board of India established under section 18; (c) "child" means a person who has not completed the age of eighteen years; (d) "consent manager" means a person registered with the Board, who acts as a single point of contact to enable a Data Principal to give, manage, review and withdraw her consent through an accessible, transparent and interoperable platform; (e) "Data Fiduciary" means any person who alone or in conjunction with other persons determines the purpose and means of processing of personal data; (f) "Data Principal" means the individual to whom the personal data relates and where such individual is — (i) a child, includes the parents or lawful guardian of such child; (ii) a person with disability, includes her lawful guardian, acting on her behalf; (g) "Data Processor" means any person who processes personal data on behalf of a Data Fiduciary; (h) "data protection officer" means an individual appointed by a Significant Data Fiduciary under clause (b) of sub-section (2) of section 10; (i) "personal data" means any data about an individual who is identifiable by or in relation to such data.

CHAPTER II — OBLIGATIONS OF DATA FIDUCIARY

3. Grounds for processing personal data.—A Data Fiduciary may process the personal data of a Data Principal only in accordance with the provisions of this Act and for a lawful purpose—(a) for which the Data Principal has given her consent; or (b) for certain legitimate uses specified in this Act.

4. Notice.—(1) Every request for consent shall be accompanied or preceded by a notice given by the Data Fiduciary to the Data Principal, informing her— (a) the personal data and the purpose for which the same is proposed to be processed; (b) the manner in which she may exercise her rights under the provisions of this Act; and (c) the manner in which the Data Principal may make a complaint to the Board.

5. Consent.—(1) Consent given by the Data Principal shall be free, specific, informed, unconditional and unambiguous with a clear affirmative action, and shall signify an agreement to the processing of her personal data for the specified purpose and be limited to such personal data as is necessary for such specified purpose.

PENALTIES: Any person who breaches the provisions of this Act shall be liable to a penalty not exceeding two hundred and fifty crore rupees for breach of the obligation to take reasonable security safeguards to prevent personal data breach.`,

  budget: `UNION BUDGET 2024-25 — KEY HIGHLIGHTS AND FISCAL POLICY DOCUMENT

The Union Budget presented by the Finance Minister outlines the Government of India's revenue and expenditure for the fiscal year 2024-25. Total expenditure is estimated at Rs. 47,65,768 crore. The fiscal deficit is pegged at 5.1% of GDP.

KEY ANNOUNCEMENTS:

INFRASTRUCTURE: Capital expenditure for infrastructure development has been increased to Rs. 11,11,111 crore which is 11.1% of GDP. This marks a significant increase aimed at stimulating economic growth and employment.

TAXATION: 
- Income Tax slabs revised under new tax regime: 0-3 lakh: Nil; 3-7 lakh: 5%; 7-10 lakh: 10%; 10-12 lakh: 15%; 12-15 lakh: 20%; Above 15 lakh: 30%
- Standard deduction increased from Rs. 50,000 to Rs. 75,000 for salaried individuals
- Corporate tax rate maintained at 22% for domestic companies and 15% for new manufacturing companies
- Securities Transaction Tax on futures increased to 0.02% and on options to 0.1%

AGRICULTURE: Rs. 1.52 lakh crore allocated for agriculture and allied sectors. Natural farming will be promoted across the country. New 109 high-yielding varieties of 32 field and horticulture crops will be released.

EMPLOYMENT: The government will implement 5 schemes and initiatives to facilitate employment, skilling and other opportunities for 4.1 crore youth over the next 5 years with central outlay of Rs. 2 lakh crore.

MSME: Term loans up to Rs. 100 crore will be provided through credit guarantee scheme for MSMEs without collateral or third-party guarantee. A new assessment model for MSME credit will be developed.

ENERGY: Energy security is a priority. Rs. 35,000 crore allocated for energy transition and net zero objectives. PM Surya Ghar Muft Bijli Yojana to install rooftop solar plants, providing free electricity up to 300 units per month.

DIGITAL INFRASTRUCTURE: Rs. 1000 crore allocated for digital public infrastructure. BharatNet project will be expanded to provide broadband connectivity in all government secondary schools and primary health centres.`,

  labour: `THE CODE ON WAGES, 2019 — SUMMARY FOR IMPLEMENTATION

THE CODE ON WAGES, 2019 consolidates and amends the laws relating to wages and bonus to all employees. This Code subsumes four existing laws: The Payment of Wages Act, 1936; The Minimum Wages Act, 1948; The Payment of Bonus Act, 1965; and The Equal Remuneration Act, 1976.

MINIMUM WAGES:
The Central Government shall fix the floor wage, taking into account minimum living standards of a worker. The floor wage may be fixed differently for different geographical areas. No state government shall fix minimum wage below the floor wage.

Minimum wages shall be revised and reviewed at intervals not exceeding five years. The appropriate government may fix minimum wages for different scheduled employments; different classes of work; adults, adolescents, children and apprentices.

PAYMENT OF WAGES:
(1) Every employer shall fix a wage period for his employees. No wage period shall exceed one month. (2) Wages shall be paid on a working day. (3) For establishments with less than 1000 employees, wages shall be paid before the 7th day of the following month. (4) Wages shall be paid in current coin or currency notes or by cheque or by crediting in the bank account of the employee.

DEDUCTIONS:
Deductions from wages shall be made only in accordance with the provisions of this Code. Permissible deductions include: fines; absence from duty; damage or loss; housing accommodation; tools and implements; advances; income tax; contributions to provident fund and ESI; recovery of loans; subscriptions to co-operative societies. Total deductions shall not exceed 50% of wages (75% for co-operative societies).

BONUS:
Every employer shall pay a minimum bonus to every employee who has worked for at least 30 working days at a rate of 8.33% of wages earned or Rs. 100, whichever is higher. Maximum bonus shall not exceed 20% of wages. Bonus shall be paid within 8 months from close of accounting year.

PENALTIES: Any employer who contravenes any provision shall be punishable with fine up to Rs. 50,000 (first offence) and Rs. 1,00,000 with possible imprisonment up to 3 months (repeat offence).`
};

/* ══════════════════════════════════════
   INITIALIZATION
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  setupFileUpload();
  setupTokenCounter();
});

function setupFileUpload() {
  const zone = document.getElementById('uploadZone');
  const input = document.getElementById('fileInput');

  zone.addEventListener('dragover', e => {
    e.preventDefault();
    zone.classList.add('dragover');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  input.addEventListener('change', e => {
    if (e.target.files[0]) handleFile(e.target.files[0]);
  });
}

function setupTokenCounter() {
  const textarea = document.getElementById('documentText');
  textarea.addEventListener('input', updateTokenCount);
}

function handleFile(file) {
  if (file.type === 'application/pdf') {
    // For PDF we just read as text (basic extraction)
    const reader = new FileReader();
    reader.onload = e => {
      // Basic: show raw text (PDF binary). In production, use pdf.js
      document.getElementById('documentText').value =
        `[PDF file loaded: ${file.name}]\n\nPlease use the paste method or ensure the server handles PDF parsing.`;
      updateTokenCount();
    };
    reader.readAsText(file);
  } else {
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById('documentText').value = e.target.result;
      updateTokenCount();
    };
    reader.readAsText(file);
  }
}

function updateTokenCount() {
  const text = document.getElementById('documentText').value;
  const estimated = Math.round(text.length / 4);
  const max = 100000;
  const pct = Math.min((estimated / max) * 100, 100);

  document.getElementById('tokenCount').textContent =
    `${(estimated / 1000).toFixed(1)}K / 100K`;
  document.getElementById('tokenBar').style.width = pct + '%';

  // Color change at high usage
  const bar = document.getElementById('tokenBar');
  if (pct > 85) bar.style.background = '#e86d6d';
  else if (pct > 60) bar.style.background = '#e8a86d';
  else bar.style.background = 'var(--accent)';
}

/* ══════════════════════════════════════
   SAMPLE LOADER
══════════════════════════════════════ */
function loadSample(key) {
  const text = SAMPLES[key];
  if (!text) return;
  document.getElementById('documentText').value = text;
  updateTokenCount();

  // Animate textarea
  const ta = document.getElementById('documentText');
  ta.style.borderColor = 'var(--accent)';
  setTimeout(() => { ta.style.borderColor = ''; }, 800);
}

/* ══════════════════════════════════════
   MAIN ANALYSIS
══════════════════════════════════════ */
async function analyzeDocument() {
  const text = document.getElementById('documentText').value.trim();
  const depth = document.getElementById('summaryDepth').value;
  const language = document.getElementById('language').value;

  if (!text) {
    showError('Please paste or upload a document first.');
    return;
  }
  if (text.length < 50) {
    showError('Document is too short. Please provide a meaningful legal text.');
    return;
  }

  // UI: switch to loading
  showLoading();

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, depth, language })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Server error' }));
      throw new Error(err.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    showResult(data, text);

  } catch (err) {
    showError(`Analysis failed: ${err.message}`);
    showEmpty();
  }
}

/* ══════════════════════════════════════
   UI STATE MANAGERS
══════════════════════════════════════ */
function showLoading() {
  document.getElementById('emptyState').style.display = 'none';
  document.getElementById('resultState').style.display = 'none';
  document.getElementById('loadingState').style.display = 'flex';
  document.getElementById('analyzeBtn').disabled = true;

  // Animate progress steps
  const steps = [
    'Applying Token Compression...',
    'Extracting legal structure...',
    'Identifying key provisions...',
    'Generating citizen brief...',
    'Calculating information density...'
  ];
  let step = 0;
  let progress = 0;

  const stepEl = document.getElementById('loadingStep');
  const progressEl = document.getElementById('progressFill');

  window._loadInterval = setInterval(() => {
    if (step < steps.length) {
      stepEl.textContent = steps[step];
      progress = ((step + 1) / steps.length) * 90;
      progressEl.style.width = progress + '%';
      step++;
    }
  }, 1200);
}

function showEmpty() {
  clearInterval(window._loadInterval);
  document.getElementById('loadingState').style.display = 'none';
  document.getElementById('resultState').style.display = 'none';
  document.getElementById('emptyState').style.display = 'flex';
  document.getElementById('analyzeBtn').disabled = false;
}

function showResult(data, originalText) {
  clearInterval(window._loadInterval);
  document.getElementById('progressFill').style.width = '100%';

  setTimeout(() => {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('resultState').style.display = 'block';
    document.getElementById('analyzeBtn').disabled = false;

    populateResult(data, originalText);
  }, 500);
}

function showError(msg) {
  clearInterval(window._loadInterval);
  document.getElementById('loadingState').style.display = 'none';
  document.getElementById('analyzeBtn').disabled = false;

  // Show error toast
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed; bottom:50px; left:50%; transform:translateX(-50%);
    background:#e86d6d; color:#0c0c0f; padding:10px 20px;
    font-family:var(--font-mono); font-size:0.7rem; letter-spacing:0.08em;
    border-radius:4px; z-index:999; animation: fadeUp 0.3s ease;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

/* ══════════════════════════════════════
   POPULATE RESULT
══════════════════════════════════════ */
function populateResult(data, originalText) {
  currentResult = data;

  // Doc type chip
  document.getElementById('docTypeChip').textContent = data.documentType || 'LEGAL DOCUMENT';

  // Compression ratio
  const inputTokens = Math.round(originalText.length / 4);
  const outputTokens = data.outputTokens || Math.round(JSON.stringify(data).length / 4);
  const savedPct = Math.round((1 - outputTokens / inputTokens) * 100);
  document.getElementById('compressionChip').textContent =
    `COMPRESSED ↓ ${Math.max(0, savedPct)}%`;

  // Summary
  document.getElementById('resultSummary').textContent = data.summary || '';

  // Key points
  const kpEl = document.getElementById('keyPoints');
  kpEl.innerHTML = '';
  (data.keyPoints || []).forEach(point => {
    const li = document.createElement('li');
    li.textContent = point;
    kpEl.appendChild(li);
  });

  // Impact grid
  const igEl = document.getElementById('impactGrid');
  igEl.innerHTML = '';
  (data.citizenImpact || []).forEach(impact => {
    const card = document.createElement('div');
    card.className = 'impact-card';
    card.innerHTML = `
      <div class="impact-card-title">${escapeHtml(impact.group || 'GENERAL')}</div>
      <div class="impact-card-body">${escapeHtml(impact.description || '')}</div>
    `;
    igEl.appendChild(card);
  });

  // Concerns
  const conEl = document.getElementById('concernsList');
  conEl.innerHTML = '';
  (data.concerns || []).forEach(concern => {
    const div = document.createElement('div');
    div.className = 'concern-item';
    div.textContent = concern;
    conEl.appendChild(div);
  });

  if (!data.concerns || data.concerns.length === 0) {
    document.getElementById('concernsSection').style.display = 'none';
  } else {
    document.getElementById('concernsSection').style.display = 'block';
  }

  // Stats
  document.getElementById('statOriginal').textContent = formatNum(inputTokens);
  document.getElementById('statCompressed').textContent = formatNum(outputTokens);
  const densityScore = Math.min(99, Math.round((inputTokens / Math.max(outputTokens, 1)) * 10));
  document.getElementById('statDensity').textContent = densityScore + '/100';

  // Update session history
  addToHistory(data, originalText, inputTokens, outputTokens);
}

/* ══════════════════════════════════════
   SESSION HISTORY
══════════════════════════════════════ */
function addToHistory(data, text, inputTokens, outputTokens) {
  const saved = Math.max(0, inputTokens - outputTokens);
  totalTokensSaved += saved;

  const entry = {
    title: (data.documentType || 'Document') + ' — ' + new Date().toLocaleTimeString(),
    compression: Math.max(0, Math.round((1 - outputTokens / inputTokens) * 100)),
    inputTokens,
    outputTokens,
    data,
    text
  };
  sessionHistory.unshift(entry);

  // Update total saved display
  document.getElementById('totalSaved').textContent = formatNum(totalTokensSaved);
  const maxSaved = 200000;
  document.getElementById('efficiencyBar').style.width =
    Math.min((totalTokensSaved / maxSaved) * 100, 100) + '%';

  // Render history list
  const histEl = document.getElementById('historyList');
  histEl.innerHTML = '';
  sessionHistory.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
      <div class="history-item-title">${escapeHtml(item.title)}</div>
      <div class="history-item-meta">${formatNum(item.inputTokens)} tokens
        <span class="history-item-compression">↓${item.compression}% compressed</span>
      </div>
    `;
    div.onclick = () => loadHistoryItem(idx);
    histEl.appendChild(div);
  });
}

function loadHistoryItem(idx) {
  const item = sessionHistory[idx];
  if (!item) return;
  document.getElementById('documentText').value = item.text;
  updateTokenCount();
  showResult(item.data, item.text);
}

/* ══════════════════════════════════════
   ACTIONS
══════════════════════════════════════ */
function copyResult() {
  if (!currentResult) return;
  const text = formatResultAsText(currentResult);
  navigator.clipboard.writeText(text).then(() => showError('✓ Copied to clipboard'));
}

function downloadResult() {
  if (!currentResult) return;
  const text = formatResultAsText(currentResult);
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'nagarik-brief-' + Date.now() + '.txt';
  a.click();
}

function formatResultAsText(data) {
  let out = `NAGARIK — CITIZEN'S POLICY BRIEF\n`;
  out += `${'='.repeat(50)}\n\n`;
  out += `DOCUMENT TYPE: ${data.documentType || 'Legal Document'}\n\n`;
  out += `EXECUTIVE SUMMARY\n${'-'.repeat(30)}\n${data.summary}\n\n`;
  out += `KEY PROVISIONS\n${'-'.repeat(30)}\n`;
  (data.keyPoints || []).forEach((p, i) => { out += `${i + 1}. ${p}\n`; });
  out += `\nCITIZEN IMPACT\n${'-'.repeat(30)}\n`;
  (data.citizenImpact || []).forEach(c => { out += `[${c.group}] ${c.description}\n`; });
  if (data.concerns && data.concerns.length > 0) {
    out += `\nNOTABLE CONCERNS\n${'-'.repeat(30)}\n`;
    data.concerns.forEach(c => { out += `⚠ ${c}\n`; });
  }
  out += `\nGenerated by NAGARIK — Token Compression Technology\n`;
  return out;
}

function resetDashboard() {
  document.getElementById('documentText').value = '';
  updateTokenCount();
  showEmpty();
  currentResult = null;
}

/* ══════════════════════════════════════
   UTILITIES
══════════════════════════════════════ */
function formatNum(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
