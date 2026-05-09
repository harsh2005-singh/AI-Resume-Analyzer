# ATS Pro 🎯

An AI-powered resume analyzer that scores your resume against job descriptions using Google's Gemini AI, providing detailed ATS compatibility analysis and improvement suggestions.

## 🌐 Live Demo
[https://ai-resume-analyzer-ecru-omega.vercel.app](https://ai-resume-analyzer-ecru-omega.vercel.app)

## ✨ Features

- 📄 **PDF Resume Upload** — Upload your resume as a PDF
- 🤖 **AI-Powered Analysis** — Gemini AI analyzes your resume against job descriptions
- 📊 **ATS Score** — Get an overall compatibility score out of 100
- 🔍 **Section Breakdown** — Detailed scores for Skills, Experience, Education, Keywords and Formatting
- 💡 **Smart Suggestions** — Top 5 actionable improvement tips
- 📥 **Download Report** — Download your analysis as a PDF report
- 📁 **History** — View all your past analyses
- 🔐 **Authentication** — Secure login and registration with JWT

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

### AI & Tools
![Google Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/harsh2005-singh/AI-Resume-Analyzer.git
cd AI-Resume-Analyzer
```

2. **Setup Backend**
```bash
cd server
npm install
```

3. **Create `server/.env` file**

PORT=5000

MONGODB_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

4. **Start Backend**
```bash
npm run dev
```

5. **Setup Frontend**
```bash
cd client
npm install
npm run dev
```

6. **Open in browser**
http://localhost:5173

## 📸 Screenshots
> Coming soon

## 📁 Project Structure
AI-Resume-Analyzer/
├── client/                  # React Frontend
│   └── src/
│       ├── components/      # Navbar, ScoreCard etc
│       ├── pages/           # Login, Register, Upload, Results, History
│       └── context/         # Auth Context
├── server/                  # Node + Express Backend
│   ├── config/              # MongoDB connection
│   ├── models/              # User, Analysis schemas
│   ├── routes/              # Auth, Resume routes
│   └── middleware/          # JWT middleware
└── README.md

## 👨‍💻 Author

**Harshit Singh**
- GitHub: [@harsh2005-singh](https://github.com/harsh2005-singh)

## 📄 License
MIT License