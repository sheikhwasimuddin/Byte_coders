# 🐞 BugSense AI – Smart AI Code Reviewer & Secure Coding Learning Platform

> An intelligent AI-powered code review and cybersecurity learning platform built for the **RSOC Hackathon**, designed to help developers analyze source code, identify vulnerabilities, improve code quality, and practice real-world secure coding challenges.

![GitHub Repo](https://img.shields.io/badge/Project-BugSense%20AI-blueviolet?style=for-the-badge)
![Python](https://img.shields.io/badge/Backend-Python%20Flask-yellow?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge)
![Hackathon](https://img.shields.io/badge/Built%20For-RSOC%20Hackathon-success?style=for-the-badge)

---

## 🚀 Overview

**BugSense AI** is a full-stack **AI Code Review + Secure Coding Learning Platform** that helps users:

- 🔍 Analyze code for bugs and quality issues
- 🛡️ Detect security vulnerabilities
- ⚡ Identify performance bottlenecks
- 📚 Learn cybersecurity concepts
- 🎯 Practice real-world vulnerability-fixing challenges

Unlike a traditional code reviewer, **BugSense AI** combines:
- **AI-powered code analysis**
- **Interactive coding challenges**
- **Learning modules for secure coding awareness**

This makes it ideal for:
- Students
- Developers
- Hackathon demos
- Security education
- Coding practice environments

---

## ✨ Core Features

### 🔍 1. AI Code Review
Analyze code and get intelligent feedback for:
- Bugs and logic flaws
- Code smells
- Refactoring suggestions
- Readability improvements
- Best practice recommendations

### 🛡️ 2. Security Scanning
Detect insecure coding patterns such as:
- `eval()` misuse
- Shell / OS command injection
- Unsafe system calls
- Dangerous subprocess usage
- Insecure input handling

### ⚡ 3. Static Analysis Integration
Supports analysis with:
- **Pylint** → code quality checks
- **Bandit** → Python security scanning
- AI-assisted explanations and suggestions

### 💻 4. Multi-Language Demo Support
Includes sample buggy code examples for:
- Python
- C
- C++
- Java

This improves demo quality and showcases the platform’s extensibility.

---

# 🎯 Interactive Pages

## 🧩 Challenges Page
The **Challenges Page** is an interactive hands-on practice section where users can solve **real-world security vulnerability fixing tasks**.

### What it offers:
- Predefined cybersecurity coding challenges
- Secure coding missions based on real vulnerabilities
- Buggy code snippets to analyze and fix
- Practical exposure to:
  - `eval()` vulnerabilities
  - Shell Injection / OS Command Injection
  - Unsafe parsing
  - Insecure subprocess/system usage
  - Input validation issues

### Why it is valuable:
- Makes the project **interactive and educational**
- Helps users **practice secure coding**, not just read about it
- Demonstrates a **CTF-style / lab-style learning approach**
- Adds strong hackathon value beyond a normal AI reviewer

---

## 📘 Learn Page
The **Learn Page** is a built-in educational module designed to teach users about **secure coding, vulnerability awareness, and code review best practices**.

### What it includes:
- Security concepts explained in simple terms
- Vulnerability categories and examples
- Best practices for writing safer code
- Explanations of common risks like:
  - Remote Code Execution (RCE)
  - Shell Injection
  - Unsafe `eval()`
  - Insecure command execution
  - Poor validation patterns
  - Static analysis fundamentals

### Why it is valuable:
- Converts the project from a tool into a **learning platform**
- Helps beginners understand **why vulnerabilities matter**
- Improves project usability for:
  - Students
  - Beginners in cybersecurity
  - Secure coding learners
  - Educational demonstrations

---

## 🎨 Modern Frontend Experience
The platform includes a polished frontend UI with:
- Modern navigation bar
- Responsive layout
- Clean code input/review interface
- Dedicated **Challenges** and **Learn** pages
- Improved project structure for better UX
- Hackathon/demo-ready interface

---

## 🏗️ Tech Stack

### Frontend
- **React**
- **Vite**
- **JavaScript**
- **Modern CSS / UI Styling**

### Backend
- **Python**
- **Flask**
- **Pylint**
- **Bandit**

---

## 📂 Project Structure

```bash
Byte_coders/
│── frontend/                         # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalyzerPage.jsx
│   │   │   ├── ChallengesPage.jsx   # Interactive secure coding challenges
│   │   │   ├── LearnPage.jsx        # Security learning and awareness page
│   │   │   ├── HomePage.jsx
│   │   │   └── Navbar.jsx
│   │   ├── challengesData.js        # Challenge definitions and scenarios
│   │   └── App.jsx
│
│── ai_code_reviewer.py              # Flask backend API
│── requirements.txt                 # Python dependencies
│── README.md                        # Project documentation
│── RSOC-2026.pdf                    # Project report/document
│── RSOC-2026.pptx                   # Project presentation
```
⚙️ Installation & Setup
1️⃣ Backend Setup

From the project root:

pip install -r requirements.txt
python ai_code_reviewer.py
Backend runs on:
http://localhost:5000
API Endpoints:
GET /api/health
POST /api/review
2️⃣ Frontend Setup

Open a second terminal:

cd frontend
npm install
npm run dev
Frontend runs on:
http://localhost:5173
🧪 How to Use
AI Review Flow
Start the backend server
Start the frontend
Open the app in browser
Paste or select sample code
Run AI Review
View:
AI feedback
Static analysis
Security findings
Suggestions
Challenges Flow
Open the Challenges page
Choose a coding/security mission
Review the vulnerable code
Fix the issue
Test your solution mentally or through the platform’s logic
Learn Flow
Open the Learn page
Read about secure coding concepts
Explore vulnerability examples
Understand how to avoid common coding mistakes
🧠 Educational Value

BugSense AI is not just a tool — it is a practical learning ecosystem for secure coding.

It helps users:

Learn secure coding concepts
Understand real-world vulnerabilities
Practice fixing vulnerable code
Improve software engineering habits
Build awareness of secure development lifecycle
🛡️ Example Vulnerabilities Covered
Arbitrary code execution via eval()
Shell / OS command injection
Unsafe command construction
Insecure subprocess usage
Improper input validation
Risky code execution patterns
Weak security hygiene in scripts
🔮 Future Improvements
🌐 Support more languages (JS, TS, Go, C#)
🧩 Monaco Editor integration
🧠 Better AI reasoning and explanations
📊 Code quality scoring dashboard
📁 File upload for source code review
☁️ Deploy frontend + backend (Vercel + Render)
🏆 Challenge scoring / progress tracking
🔐 Difficulty levels for secure coding labs
📚 Expanded learning modules
🏆 Hackathon Value Proposition

This project stands out because it combines three powerful layers in one platform:

AI Code Review Tool
Interactive Security Challenges
Built-in Learning & Awareness Modules

This makes BugSense AI more impactful than a standard code analyzer, because it not only detects issues — it also teaches and trains users to fix them.

👨‍💻 Author

Sheikh Wasimuddin
B.Tech (CSE-IoT) – Yeshwantrao Chavan College of Engineering (YCCE), Nagpur

GitHub: @sheikhwasimuddin
