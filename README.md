# Sakshya (साक्ष्य)

**AI-Powered Investigation & Decision Support Platform**

> "AI Only Assists — The Decision Is Human's. Justice Prevails."

Sakshya helps investigators upload case evidence — CCTV logs, documents, witness statements, call records, and notes — into one secure case vault, then uses Google's Gemini API to cross-correlate that evidence and generate multiple ranked hypotheses, each with a confidence score and exact evidence citations. The human investigator always reviews, can override or annotate any hypothesis, and logs the final verdict. Every action is written to a tamper-evident, SHA-256-hashed audit trail.

---

## ✨ Key Features

- **Secure Evidence Vault** — upload CCTV footage, photos, audio, PDFs, witness statements, FIR/case reports, call records, vehicle info, and investigator notes into a single case file, with SHA-256 hashing on every file.
- **AI Hypothesis Engine** — Gemini analyzes all evidence in a case and always returns three distinct hypotheses:
  - **Primary** — the most likely explanation directly supported by evidence
  - **Supporting** — a second angle that also fits the evidence
  - **Alternative Viewpoint** — a mandatory contrarian hypothesis (misidentification, coincidence, planted evidence, etc.) designed to guard against tunnel vision and wrongful conclusions
- **Human-in-the-Loop Review** — every hypothesis can be accepted, rejected, or annotated by the investigator; nothing is ever treated as a final decision by the AI itself.
- **Tamper-Evident Audit Trail** — every upload, AI analysis run, and human review action is logged with a SHA-256 hash.
- **Official Report Generation** — compiles accepted hypotheses, evidence, and audit history into a case report.
- **Cloud or Local Storage** — works with Supabase + Cloudinary if configured, and automatically falls back to a local JSON database and local file storage if not — so it runs fully offline for development/demos.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS 4, Framer Motion, Lucide Icons |
| Backend | Express (via `server.ts`, run through `tsx`) |
| AI | Google Gemini API (`@google/genai`) |
| Database | Supabase (Postgres) — with automatic local JSON fallback |
| File Storage | Cloudinary — with automatic local `/uploads` fallback |
| File Uploads | Multer |

---

## 📂 Project Structure

```
sakshya_nit/
├── server.ts              # Express API — cases, evidence, AI analysis, audit log
├── src/
│   ├── App.tsx             # Top-level routing between screens
│   ├── main.tsx
│   ├── types.ts             # Shared TypeScript types (CaseItem, EvidenceItem, Hypothesis, etc.)
│   ├── supabaseClient.js
│   └── components/
│       ├── SplashScreen.tsx
│       ├── LandingPage.tsx
│       ├── AuthScreen.tsx / SignIn.tsx / SignUp.tsx
│       ├── DashboardScreen.tsx
│       └── CaseWorkspace.tsx   # Evidence vault, AI Hypotheses, Evidence Graph,
│                                # Cross-Evidence Links, Human Review, Official
│                                # Report, and Audit Trail tabs
├── data/database.json      # Local fallback database (auto-created)
├── uploads/                 # Local fallback file storage (auto-created)
└── .env.example             # Template for required environment variables
```

---

## 🚀 Getting Started

**Prerequisites:** Node.js 18+

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/jatin-codehub/sakshya_nit.git
   cd sakshya_nit
   npm install
   ```

2. **Configure environment variables**

   Copy the example file and fill in your own values — never commit real keys:
   ```bash
   cp .env.example .env
   ```
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here

   # Optional — omit these to run on the local JSON/file-storage fallback
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

3. **Run the app**
   ```bash
   npm run dev
   ```
   This starts Express with Vite in middleware mode on a single port — the frontend and API are served together.

4. **Build for production**
   ```bash
   npm run build
   npm start
   ```

---

## 🔌 API Overview

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check + Supabase/Cloudinary connection status |
| GET | `/api/cases` | List all cases (optionally filter by `userId`) |
| POST | `/api/cases` | Create a new case |
| GET | `/api/cases/:id/evidence` | List evidence for a case |
| POST | `/api/cases/:id/evidence` | Upload a new evidence item (file or text) |
| DELETE | `/api/cases/:caseId/evidence/:evId` | Delete an evidence item |
| GET | `/api/cases/:id/analyses` | Get analysis version history for a case |
| POST | `/api/cases/:id/ai-analyze` | Run Gemini AI analysis and generate a new hypothesis set |
| POST | `/api/cases/:id/hypotheses/:hypId/review` | Accept/reject/annotate a hypothesis |
| GET | `/api/audit` | Fetch the audit trail |

---

## 🔒 Security Notes

- `.env` files (except `.env.example`) are git-ignored — **never commit real API keys or secrets**. Keep `.env.example` filled with placeholder values only.
- If any real credentials are ever accidentally committed, rotate them immediately in the relevant dashboard (Supabase / Cloudinary / Google AI Studio) — editing the file afterward does not remove the exposed values from git history.
- Evidence files are hashed with SHA-256 on upload so any tampering after the fact is detectable.

---

## 🗺️ Roadmap

- [ ] Populate Cross-Evidence Links from AI-detected relationships between evidence items
- [ ] Real Evidence Graph visualization (node-link diagram driven by cross-links data)
- [ ] OCR / text extraction for uploaded documents and photos
- [ ] Hindi / code-mixed witness statement transcription and translation
- [ ] Downloadable PDF export for the Official Report tab

---

## ⚖️ Design Principle

Every AI-generated hypothesis in Sakshya is explicitly labeled with a confidence score and traced back to the evidence that produced it — but the system is intentionally designed so **no hypothesis is ever presented as a final determination of guilt or fact**. The investigator's review, override, and sign-off are mandatory steps in every case, and are permanently recorded in the audit trail alongside the AI's original output.