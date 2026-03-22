# 🏛️ NAGARIK — Citizen's Policy Intelligence Dashboard

> **Turning dense Indian legal documents into plain-language briefs for every citizen — powered by Token Compression.**


## 🧠 The Problem

Indian law and parliamentary bills are **dense, verbose, and inaccessible** to the average citizen. Running LLMs to summarize these documents constantly is:

- 🌍 **Environmentally costly** — high token consumption = high energy use
- 💸 **Expensive** — large documents exceed context limits and inflate API costs
- 🚫 **Inaccessible** — legal jargon shuts out the very citizens these laws affect

---

## 💡 The Solution

**NAGARIK** (meaning *Citizen* in Hindi) is a real-time policy intelligence dashboard that:

1. **Compresses** legal documents using Token Compression before sending to any LLM
2. **Analyzes** the compressed prompt to extract maximum insight per token
3. **Delivers** a plain-language brief that every Indian citizen can read and act on

---

## 🌐 Live Demo

🔗 **[NAGARIK - Citizen's Policy Intelligence Dashboard](https://genz-genai.netlify.app/)** 

---
## ⚡ Token Compression — The Core Technique

This project is built around **Token Compression** as the primary technique for reducing energy and carbon cost.

Instead of sending raw legal text (100K+ tokens) to the LLM, we pre-process it into a high-density skeleton:

```
Raw Legal Text (100,000 tokens)
        ↓
  Token Compression Engine
        ↓
Compressed Skeleton (~15,000 tokens)
        ↓
     Gemini API
        ↓
  Citizen Brief (800 tokens)
```

### 🔧 Compression Steps

| Step | Technique | Token Saving |
|------|-----------|-------------|
| 1️⃣ | **Boilerplate removal** — strips filler phrases like *"notwithstanding anything contained in"* | ~15% |
| 2️⃣ | **Abbreviation substitution** — `Data Principal → DP`, `crore → Cr`, `rupees → ₹` | ~10% |
| 3️⃣ | **Skeleton extraction** — preserves section headers, financial amounts, penalty clauses only | ~40% |
| 4️⃣ | **Depth-based truncation** — Brief mode takes top 20% of sentences | ~15% |
| 5️⃣ | **Schema-guided prompting** — forces JSON output to minimize response tokens | ~10% |

**Result: Up to 80% token reduction before the LLM sees a single word.**

---

## 🖥️ Features

- ✅ Handles documents exceeding **100,000 tokens** via Token Compression
- ✅ **3 summary depth levels** — Brief (TL;DR), Standard, Detailed
- ✅ **Multilingual output** — English, Hindi (हिंदी), Simple English
- ✅ **Session history** with cumulative token savings tracker
- ✅ **3 built-in sample documents** — DPDP Act, Union Budget 2024-25, Labour Code
- ✅ **Information Density Score** — measures value delivered per token consumed
- ✅ **Copy & Download** results as plain text
- ✅ Drag-and-drop **file upload** (.txt, .pdf)
- ✅ Real-time **token estimation meter**

---

## 📁 Project Structure

```
GenAI/
├── 📄 index.html       ← Main dashboard UI (3-column layout)
├── 🎨 styles.css       ← Editorial dark theme, animations, responsive design
├── ⚙️  app.js           ← Frontend logic: upload, token counting, API calls, history
├── 🖥️  server.js        ← Node.js backend: Token Compression engine + Gemini API
├── 🔐 .env             ← Your API key (you create this — never commit it!)
├── 📦 package.json     ← Dependencies (auto-created by npm init)
└── 📖 README.md        ← You are here
```

---

## 🚀 Setup & Installation

### Prerequisites
- [Node.js v18+](https://nodejs.org) installed on your machine
- A free [Gemini API key](https://aistudio.google.com)

---

### Step 1 — Clone or Download the Project

```bash
git clone https://github.com/YOUR_USERNAME/GenAI.git
cd GenAI
```

---

### Step 2 — Install Dependencies

```bash
npm init -y
npm install express cors dotenv @google/generative-ai
```

---

### Step 3 — Create Your `.env` File

Create a file named `.env` in the root of the project folder:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

🔑 Get your **free** Gemini API key from: [https://aistudio.google.com](https://aistudio.google.com)

> ⚠️ **Never commit your `.env` file to GitHub.** Add it to `.gitignore`.

---

### Step 4 — Start the Backend Server

```bash
node server.js
```

You should see:

```
  🏛  Citizen's Policy Intelligence
  🔄  Token Compression Engine: ACTIVE
  🚀  Server running at http://localhost:3001
```

---

### Step 5 — Open the Frontend

You need to serve the frontend (not just double-click) to avoid browser security errors.

**Option A — VS Code Live Server (recommended):**
1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code
2. Right-click `index.html` → **Open with Live Server**

**Option B — Terminal:**
```bash
npx serve .
```
Then open the URL shown (e.g. `http://localhost:3000`)

> 💡 You need **two terminals open** — one running `node server.js`, one running `npx serve .`

---

## 🎮 How to Use

1. **Load a Sample** — click `DPDP Act`, `Union Budget`, or `Labour Code` chips in the left panel
2. **Or paste any legal text** — copy from [indiacode.nic.in](https://indiacode.nic.in) or [prsindia.org](https://prsindia.org)
3. **Choose depth & language** — Brief / Standard / Detailed + English / Hindi / Simple English
4. **Click ANALYZE DOCUMENT** — watch Token Compression run in real time
5. **Read your brief** — Executive Summary, Key Provisions, Citizen Impact cards, Concerns
6. **Copy or Download** the result for sharing

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   BROWSER (Frontend)                 │
│  index.html + styles.css + app.js                   │
│                                                      │
│  [Upload Zone] → [Token Meter] → [Analyze Button]   │
│  [Summary] → [Key Points] → [Impact Grid]           │
└────────────────────┬────────────────────────────────┘
                     │ HTTP POST /api/analyze
                     ▼
┌─────────────────────────────────────────────────────┐
│              NODE.JS BACKEND (server.js)             │
│                                                      │
│  1. Receive raw document text                        │
│  2. Run Token Compression Engine                     │
│     ├─ Strip boilerplate phrases                     │
│     ├─ Apply abbreviation map                        │
│     ├─ Extract structural skeleton                   │
│     └─ Truncate by depth level                       │
│  3. Send compressed prompt to Gemini API             │
│  4. Parse JSON response                              │
│  5. Return enriched result to frontend               │
└────────────────────┬────────────────────────────────┘
                     │ Gemini API call
                     ▼
┌─────────────────────────────────────────────────────┐
│                  GEMINI API                          │
│  Receives ~15K tokens instead of 100K tokens        │
│  Returns structured JSON brief                       │
│  80% less energy consumed per request               │
└─────────────────────────────────────────────────────┘
```

---

## 📊 Information Density Score

The dashboard calculates an **Information Density Score** for every analysis:

```
Density Score = (Input Tokens / Output Tokens) × 10
```

A score of **85/100** means the brief delivers 85% of the document's informational value in a fraction of the tokens — directly measuring environmental efficiency.

---

## 🌍 Supported Document Types

| Document | Example |
|----------|---------|
| 🏛️ Central Acts | DPDP Act 2023, RTI Act, IT Act |
| 💰 Union Budget | Annual budget highlights and allocations |
| 👷 Labour Laws | Code on Wages, Industrial Relations Code |
| 🌾 Agricultural Policy | PM-KISAN, MSP circulars |
| 🏥 Health Schemes | Ayushman Bharat, NHM guidelines |
| 🎓 Education Policy | NEP 2020, UGC regulations |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| AI Model | Google Gemini API |
| Compression | Custom Token Compression Engine |
| Styling | CSS Variables, Google Fonts, CSS Animations |
| Environment | dotenv |

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | ✅ Yes |
| `PORT` | Port for the backend server (default: 3001) | ❌ Optional |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- [Google Gemini API](https://aistudio.google.com) — for powering the AI analysis
- [India Code](https://indiacode.nic.in) — official source of Indian legislation
- [PRS Legislative Research](https://prsindia.org) — for legislative research inspiration
- Built with ❤️ for Indian citizens

---

<div align="center">
  <strong>NAGARIK — नागरिक</strong><br/>
  <em>Because every citizen deserves to understand the laws that govern them.</em>
</div>
