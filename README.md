# 🚀 ResumeForge - AI-Powered Career Optimization Suite

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://resumeforage7.netlify.app)
[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20FastAPI%20%7C%20Gemini-blue?style=for-the-badge)](https://github.com/Nimit746/Resume_Review)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**ResumeForge** is a production-ready, full-stack AI platform designed to empower job seekers. By leveraging advanced RAG (Retrieval-Augmented Generation) pipelines and state-of-the-art LLMs, ResumeForge provides personalized resume analysis, ATS optimization, and career consulting.

---

## ✨ Key Features

- **📄 AI Resume Builder & Editor**: Create and refine your resume with real-time AI suggestions.
- **🎯 ATS Optimization Engine**: Analyze your resume against specific job descriptions to get an ATS score and actionable improvement tips.
- **🤖 AI Career Consultant**: A dedicated chat assistant (RAG-powered) that "reads" your resume and provides tailored career advice.
- **✉️ Cover Letter Generator**: Instantly generate professional, personalized cover letters tailored to any job role.
- **📦 Cloud-Powered Persistence**: Securely store your resumes and cover letters using MongoDB and Cloudinary.
- **⚡ High-Performance RAG**: Uses Pinecone vector database for lightning-fast retrieval of relevant resume sections.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Hooks & Context API

### Backend (AI Engine)
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **AI Orchestration**: [LangChain](https://www.langchain.com/)
- **Vector Database**: [Pinecone](https://www.pinecone.io/)
- **Models**: Google Gemini / Groq (Llama 3.1)
- **Rate Limiting**: Slowapi

### Infrastructure & DevOps
- **Database**: [MongoDB](https://www.mongodb.com/) (Atlas)
- **Storage**: [Cloudinary](https://cloudinary.com/) (for PDF/Image hosting)
- **Deployment**: Netlify (Frontend) & Render/Railway (Backend)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- MongoDB Atlas Account
- Pinecone Account & API Key
- Google AI (Gemini) or Groq API Key
- Cloudinary Account

### 1. Clone the Repository
```bash
git clone https://github.com/Nimit746/Resume_Review.git
cd Resume_Review
```

### 2. Setup Backend (Server)
```bash
cd server
# Install dependencies (using uv for speed)
uv sync
# Or using pip
pip install -r requirements.txt

# Configure .env
cp .env.example .env
# Fill in your PINECONE_API_KEY, GOOGLE_API_KEY, CLOUDINARY_URL, etc.
```

### 3. Setup Frontend (Client)
```bash
cd ../client
npm install

# Configure .env.local
cp .env.example .env.local
# Fill in NEXT_PUBLIC_API_URL (points to FastAPI) and MONGODB_URI
```

### 4. Run Locally
From the root directory:
```bash
npm run dev
```
This will concurrently start the Next.js frontend (port 3000) and the FastAPI backend (port 8000).

---

## 📁 Project Structure

```text
├── client/              # Next.js Frontend
│   ├── src/app/         # Routes (ATS, Cover Letter, Editor, etc.)
│   ├── src/components/  # Reusable UI Components
│   └── src/features/    # Core business logic
├── server/              # FastAPI Backend
│   ├── modules/         # AI Modules (Model, Prompt, Chain, Loader)
│   ├── main.py          # FastAPI Entry Point
│   └── rag_pipeline.py  # Pinecone/RAG Logic
└── package.json         # Root scripts for concurrent execution
```

---

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👤 Author

**Nimit Gupta**
- GitHub: [@Nimit746](https://github.com/Nimit746)
- Portfolio: [My Portfolio](https://thegrowthengineer.netlify.app)
- LinkedIn: [Nimit Gupta](https://linkedin.com/in/nimit746)

---

*Made with ❤️ for job seekers everywhere.*
