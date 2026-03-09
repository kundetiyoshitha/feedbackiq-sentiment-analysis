# FeedbackIQ — Customer Feedback Management System with NLP Sentiment Analysis

A full-stack web application that collects customer feedback and automatically analyzes sentiment using the **VADER (Valence Aware Dictionary and sEntiment Reasoner)** NLP algorithm.

---

## 📁 Project Structure

```
feedback-system/
├── backend/
│   ├── config/
│   │   └── db.js                  # MySQL connection pool
│   ├── controllers/
│   │   └── feedbackController.js  # Request handlers
│   ├── middleware/
│   │   └── errorHandler.js        # Global error handler
│   ├── models/
│   │   └── feedbackModel.js       # Database queries
│   ├── routes/
│   │   └── feedbackRoutes.js      # API route definitions
│   ├── utils/
│   │   └── sentimentAnalyzer.js   # VADER sentiment wrapper
│   ├── .env                       # Environment variables
│   ├── package.json
│   └── server.js                  # Express app entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx      # Analytics + feedback table
│   │   │   └── FeedbackList.jsx   # Filterable feedback table
│   │   ├── pages/
│   │   │   └── Home.jsx           # Landing page + form
│   │   ├── services/
│   │   │   └── api.js             # Axios API service
│   │   ├── App.jsx                # Routes + navbar
│   │   ├── index.css              # Global styles
│   │   └── main.jsx               # React entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── database/
│   └── schema.sql                 # MySQL schema + seed data
│
└── documentation/
    └── README.md                  # This file
```

---

## 🛠 Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Vite, React Router, Axios |
| Backend   | Node.js, Express.js                 |
| Database  | MySQL 8+                            |
| NLP/AI    | VADER Sentiment (vader-sentiment)   |
| Styling   | Custom CSS (no frameworks)          |

---

## ⚙️ Prerequisites

- **Node.js** v18 or higher — https://nodejs.org
- **MySQL** 8.0 or higher — https://dev.mysql.com/downloads/
- **npm** (comes with Node.js)
- **VS Code** (recommended)

---

## 🚀 Setup Instructions

### Step 1 — Clone / Download the Project

Place the `feedback-system` folder wherever you like.

---

### Step 2 — Set Up the MySQL Database

Open your MySQL client (MySQL Workbench, TablePlus, or terminal) and run:

```bash
mysql -u root -p < database/schema.sql
```

Or paste the contents of `database/schema.sql` into MySQL Workbench and execute it.

This will:
- Create the `feedback_db` database
- Create the `feedbacks` table
- Insert 5 sample feedback rows

---

### Step 3 — Configure Backend Environment

Edit `backend/.env` with your MySQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=feedback_db
NODE_ENV=development
```

---

### Step 4 — Install Backend Dependencies

```bash
cd feedback-system/backend
npm install
```

---

### Step 5 — Start the Backend Server

```bash
# Development mode (auto-restart on file changes)
npm run dev

# OR production mode
npm start
```

You should see:
```
🚀 Server running on http://localhost:5000
📡 Health check: http://localhost:5000/api/health
✅ MySQL database connected successfully
```

---

### Step 6 — Install Frontend Dependencies

Open a **new terminal window**:

```bash
cd feedback-system/frontend
npm install
```

---

### Step 7 — Start the Frontend

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

---

### Step 8 — Open the Application

Open your browser and navigate to: **http://localhost:5173**

---

## 🌐 API Endpoints

| Method | Endpoint                   | Description                    |
|--------|----------------------------|--------------------------------|
| GET    | /api/health                | Health check                   |
| POST   | /api/feedback              | Submit feedback (runs VADER)   |
| GET    | /api/feedback              | Get all feedback entries       |
| GET    | /api/feedback/analytics    | Get sentiment counts/analytics |
| DELETE | /api/feedback/:id          | Delete a feedback entry        |

### POST /api/feedback — Request Body

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "message": "The product is absolutely fantastic! I love it."
}
```

### POST /api/feedback — Response

```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "data": {
    "feedback": { "id": 6, "name": "Jane Smith", ... },
    "sentiment": {
      "label": "Positive",
      "compound": 0.7506,
      "positive": 0.571,
      "negative": 0.0,
      "neutral": 0.429
    }
  }
}
```

---

## 🧠 Sentiment Analysis — VADER Algorithm

VADER uses a rule-based approach combining:
- A lexicon of 7,500+ words with sentiment ratings
- Grammar and syntax rules
- Special handling for punctuation, capitalization, emojis

### Score Ranges

| Score Type | Range     | Meaning                         |
|------------|-----------|---------------------------------|
| positive   | 0.0 – 1.0 | Proportion of positive sentiment|
| negative   | 0.0 – 1.0 | Proportion of negative sentiment|
| neutral    | 0.0 – 1.0 | Proportion of neutral text      |
| compound   | -1.0 – 1.0| Overall normalized sentiment    |

### Classification Rules

```
compound ≥  0.05  →  Positive
compound ≤ -0.05  →  Negative
otherwise         →  Neutral
```

---

## 🎨 Color Palette

| Name       | Hex       | Usage                     |
|------------|-----------|---------------------------|
| Primary    | #2563EB   | Buttons, links, accents   |
| Secondary  | #1E293B   | Headings, navbar, hero bg |
| Accent     | #10B981   | Positive indicator, CTAs  |
| Background | #F8FAFC   | Page background           |
| Card       | #FFFFFF   | Card backgrounds          |

---

## 📦 Key Dependencies

### Backend
- `express` — Web framework
- `mysql2` — MySQL driver with Promise support
- `vader-sentiment` — VADER NLP sentiment analysis
- `cors` — Cross-Origin Resource Sharing
- `dotenv` — Environment variable management
- `nodemon` (dev) — Auto-restart on file changes

### Frontend
- `react` + `react-dom` — UI framework
- `react-router-dom` — Client-side routing
- `axios` — HTTP client
- `vite` — Build tool and dev server

---

## 🔧 VS Code Recommended Extensions

- **ESLint** — JavaScript linting
- **Prettier** — Code formatting
- **MySQL** (by cweijan) — Database explorer
- **Thunder Client** — API testing (alternative to Postman)
- **GitLens** — Git integration

---

## 📝 Common Issues

**MySQL connection refused:**
- Make sure MySQL service is running: `sudo systemctl start mysql` (Linux) or start from MySQL Workbench
- Verify credentials in `backend/.env`

**Port already in use:**
- Change `PORT=5001` in `backend/.env` and update the proxy in `frontend/vite.config.js`

**CORS errors:**
- The backend CORS is configured for `http://localhost:5173` — ensure your frontend runs on this port

**vader-sentiment not found:**
- Run `npm install` inside the `backend/` directory

---

## 📄 License

MIT — Free to use and modify.
