# AI Code Reviewer (Backend + React UI)

This project now includes:
- A Python Flask backend API for code review
- A React frontend with a clean, modern interface

## 1) Backend setup

From the project root:

```powershell
pip install -r requirements.txt
python ai_code_reviewer.py
```

Backend runs on:
- `http://localhost:5000`
- Health check: `GET /api/health`
- Review endpoint: `POST /api/review`

## 2) Frontend setup

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend runs on:
- `http://localhost:5173`

## 3) How to use

1. Open the frontend in your browser.
2. Paste Python code.
3. Click **Run AI Review**.
4. View AI insights, pylint report, and bandit report.
