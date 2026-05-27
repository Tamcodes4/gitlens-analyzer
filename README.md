# GitLens: Developer Profile Analyzer & AI Outreach Agent

GitLens is a full-stack Flask application that simplifies developer recruitment. Enter any GitHub username to instantly analyze their public metrics, view their primary programming languages, pinpoint their top repository, and generate a personalized cold outreach email using high-speed Groq AI.

## 🚀 Features
- **GitHub REST API Integration:** Fetches live user data, bios, and repository metrics.
- **Dynamic Tech Stack Parser:** Breaks down programming language use by percentage.
- **Groq AI Acceleration:** Uses the `Llama-3.3-70b-versatile` model to write customized outreach emails instantly.
- **Database Tracking:** Saves all analysis history to a local SQLite database.
- **Excel Export:** Download data directly to a clean `.xlsx` file.

## 🛠️ Tech Stack
- Python, Flask, SQLite3, Groq SDK, OpenPyXL, HTML, CSS, JavaScript

## 🔑 Quick Setup
Create a `.env` file in the root folder and add your keys:
```env
GITHUB_TOKEN=your_github_token
GROQ_API_KEY=your_groq_api_key

# Run python app.py to start!