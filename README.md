# NAGARIK — Citizen's Policy Intelligence Dashboard

## Project Structure

```
nagarik/
├── index.html       ← Main UI (open in browser)
├── styles.css       ← All styles
├── app.js           ← Frontend logic
├── server.js        ← Node.js backend
├── .env             ← Your API key (create this)
└── package.json     ← (auto-created by npm init)
```

---

## Setup Instructions

### 1. Install Node.js
Download from https://nodejs.org (v18+)

### 2. Create project folder & install dependencies
```bash
mkdir nagarik && cd nagarik
# Copy all 4 files into this folder
npm init -y
npm install express cors dotenv @google/generative-ai
```

### 3. Create `.env` file
Create a file named `.env` in the folder:
```
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```
Get your free Gemini API key from: https://aistudio.google.com

### 4. Start the backend
```bash
node server.js
```
You should see the NAGARIK banner and "Server running at http://localhost:3001"

### 5. Open the frontend
Open `index.html` in your browser (double-click or use Live Server extension in VS Code).

---

## How It Works

1. **Upload / Paste** a legal document (Indian law, parliamentary bill, budget)
2. **Token Compression** strips legal boilerplate, abbreviates standard terms, and extracts a structural skeleton — reducing token usage by up to 80%
3. **Gemini API** analyzes the compressed prompt and returns a structured JSON brief
4. **Dashboard** renders the brief as: Executive Summary, Key Provisions, Citizen Impact cards, Concerns

---

## Features

- ✅ Handles 100K+ token documents via Token Compression
- ✅ 3 summary depth levels: Brief, Standard, Detailed
- ✅ Multilingual: English, Hindi, Simple English
- ✅ Session history with token savings tracker
- ✅ Sample documents: DPDP Act, Union Budget, Labour Code
- ✅ Copy & Download results
- ✅ Information Density scoring

---

## Token Compression Technique

The backend (`server.js`) implements Token Compression in these steps:
1. **Boilerplate removal** — strips common legal filler phrases
2. **Abbreviation substitution** — "Data Principal" → "DP", "crore" → "Cr", etc.
3. **Structural skeleton extraction** — preserves section headers, amounts, penalty clauses
4. **Depth-based truncation** — Brief mode takes top 20% of content
5. **Schema-guided prompting** — forces JSON output for minimal response tokens

This means even a 100K token document gets processed efficiently.
