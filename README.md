# 🚀 Quiz.AI  
### AI-Powered Quiz Platform with Authentication, Smart Timers & Analytics

**Quiz.AI** is a modern, full-stack quiz application built with **Next.js**, **Supabase**, and **Google Gemini AI**.  
It enables users to generate intelligent quizzes on any topic, attempt them with per-question timers, track performance, and view personalized analytics — all with secure authentication and Google OAuth.

🌐 **Live Demo**  
<<<<<<< HEAD
👉
=======
👉 
>>>>>>> d731b4c (Use OpenRouter and clean next config)

📦 **GitHub Repository**  
👉 https://github.com/SaurabhKP28/Quiz.AI.git

---

## ✨ Why Quiz.AI?

- 🤖 AI-generated quizzes on **any topic**
- 🔐 Secure **user management + Google OAuth**
- ⏱️ Smart **per-question timer system**
- 📊 **Accuracy & performance analytics**
- 📖 Detailed explanations for learning
- 📱 Fully responsive, modern UI

Designed for **learning, assessment, and growth**.

---

## 🌟 Key Features

### 🤖 AI-Powered Quiz Generation
- Powered by **Google Gemini AI**
- Generates structured MCQs with:
  - Four options
  - Correct answer
  - Clear explanation

### 🎯 Adaptive Quiz Setup
- Choose:
  - Topic
  - Difficulty (Easy / Medium / Hard)
  - Number of questions

### ⏱️ Smart Timer System
- **1 minute per question**
- Timer **resets automatically** for every question
- Auto-moves to the next question on timeout
- Total quiz time calculated dynamically and shown in results

### 🔐 User Management & OAuth
- Email & password authentication
- **Google OAuth login**
- Secure JWT-based sessions
- User-specific quiz history with full data isolation

### 📊 Performance Analytics
- Final score (correct answers)
- Accuracy percentage
- Performance label (Excellent / Good / Needs Improvement)
- Overall progress:
  - Quizzes taken
  - Average score
  - Best score
  - Overall accuracy

### 📖 Detailed Results & Review
- Review every question
- See correct vs selected answer
- Read AI-generated explanations

### 🎨 Modern UI / UX
- Built with **Tailwind CSS**
- Clean, minimal, and responsive
- Works seamlessly on desktop & mobile

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14 (App Router)**
- **React + TypeScript**
- **Tailwind CSS**
- **Lucide Icons**

### Backend
- **Supabase (PostgreSQL)**
- **Supabase Auth (JWT + OAuth)**

### AI
<<<<<<< HEAD
- **Open Router**
=======
- **Google OpenRouter API**
>>>>>>> d731b4c (Use OpenRouter and clean next config)

### Deployment
- **Vercel**

---

## 🔐 Authentication & Security

- Supabase Authentication
- Google OAuth integration
- JWT-based sessions
- Row Level Security (RLS)
- User-isolated database access
- Secure environment variables

---

## 📁 Project Structure

Quiz.AI/
├── app/
│ ├── page.tsx # Landing page
│ ├── setup/ # Quiz setup
│ ├── quiz/ # Quiz flow
│ ├── result/ # Results & analytics
│ ├── profile/ # User profile & history
│ └── auth/ # Login / Signup
├── components/
│ ├── QuizQuestion.tsx
│ ├── Timer.tsx
│ └── Layout.tsx
├── lib/
│ ├── supabaseClient.ts
<<<<<<< HEAD
=======
│ ├── timeUtils.ts
>>>>>>> d731b4c (Use OpenRouter and clean next config)
│ ├── openRouterClient.ts
│ ├── timeUtils.ts
│ └── types.ts
├── public/
└── docs/


---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js **18+**
- Supabase account
- Google Cloud account (Oauth)
<<<<<<< HEAD

---

=======
- Open Router
---

>>>>>>> d731b4c (Use OpenRouter and clean next config)
### 1️⃣ Clone the Repository

```bash
git clone https://github.com/SaurabhKP28/Quiz.AI.git
cd Quiz.AI
<<<<<<< HEAD
2️⃣ Install Dependencies
npm install
3️⃣ Environment Variables
Create a .env.local file:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

openRouter

4️⃣ Database Setup (Supabase)
Run this in the Supabase SQL Editor:

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  topic TEXT,
  difficulty TEXT,
  questions JSONB,
  score INTEGER,
  total_questions INTEGER,
  time_taken INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can access own quizzes"
ON quizzes
FOR ALL
USING (auth.uid() = user_id);
5️⃣ Configure Google OAuth
Supabase → Authentication → Providers → Google

Enable Google provider

Add redirect URL:

https://your-project.supabase.co/auth/v1/callback
6️⃣ Run Locally
npm run dev
Open: http://localhost:3000

🚀 Deployment
Push to GitHub

Connect repository to Vercel

Add environment variables in Vercel

Deploy 🚀

📈 Performance & Optimization
Automatic code splitting (Next.js)

Optimized images

Edge caching via Vercel

Efficient Supabase queries

🧪 Testing Checklist
✅ Email & Google login

✅ Quiz generation

✅ Timer reset per question

✅ Result accuracy

✅ Profile & quiz history

✅ Mobile responsiveness

🗺️ Roadmap
🌙 Dark mode

🏆 Leaderboards

📊 Advanced analytics

🔔 Time-based scoring

📱 Mobile app

🎯 Topic recommendations

📜 License
MIT License © 2024 — Saurabh KP

⭐ Support & Feedback
If you like this project:

⭐ Star the repository

🐛 Report issues

💬 Share feedback


❤️ Built With Passion
Quiz.AI showcases real-world full-stack engineering:

Authentication • AI integration • Timers • Analytics • Clean UI

Happy learning! 🚀


---

If you want next:
- README badges (stars, tech stack, license)
- GIF demo section
- Resume-ready project summary
- GitHub profile pin description

=======





If you want next:
- README badges (stars, tech stack, license)
- GIF demo section
- Resume-ready project summary
- GitHub profile pin description

>>>>>>> d731b4c (Use OpenRouter and clean next config)
Just tell me 👍
