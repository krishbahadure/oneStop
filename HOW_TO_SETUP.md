# How to Set Up & Run One Stop J&K

This document provides step-by-step instructions to install dependencies, initialize the database, and run the **One Stop J&K - Career & Education Advisor** platform locally.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed on your machine:
* **Node.js**: `v22.5.0` or higher (Required for built-in SQLite: `node:sqlite`).
* **npm**: Installed automatically with Node.js.

You can verify your Node.js and npm versions by running:
```powershell
node -v
npm -v
```

---

## 🚀 Step-by-Step Setup Guide

The application consists of two main parts: the **Backend API (Express + SQLite)** and the **Frontend Web App (React + Vite)**.

### Step 1: Set Up & Start the Backend

1. Open your terminal / PowerShell.
2. Navigate to the backend directory:
   ```powershell
   cd career-advisor-jk/backend
   ```
3. Install backend dependencies:
   ```powershell
   npm install
   ```
4. Seed the database with J&K courses, colleges, scholarships, and default accounts:
   ```powershell
   npm run seed
   ```
5. Start the backend server:
   ```powershell
   # Standard start (runs on http://localhost:3001)
   npm start

   # Or development mode with auto-reload:
   npm run dev
   ```

---

### Step 2: Set Up & Start the Frontend

1. Open a **new / second terminal window** (leave the backend running).
2. Navigate to the frontend directory:
   ```powershell
   cd career-advisor-jk/frontend
   ```
3. Install frontend dependencies:
   ```powershell
   npm install
   ```
4. Start the Vite development server:
   ```powershell
   npm run dev
   ```

---

## 🌐 Accessing the Application

Once both servers are running:

* **Frontend Web App**: [http://localhost:5173](http://localhost:5173)
* **Backend API Health Check**: [http://localhost:3001/api/health](http://localhost:3001/api/health)

---

## 🔑 Demo Login Accounts

Pre-configured accounts are ready to use for testing different user experiences:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Student** | `student@onestop.jk` | `Student@123` | Student portal, recommendations, assessment, tracking |
| **Admin** | `admin@onestop.jk` | `Admin@123` | Management of courses, colleges, scholarships & analytics |

---

## 🛠️ Project Structure Overview

```text
career-advisor-jk/
├── backend/
│   ├── db/              # SQLite database schema, connection, and seed scripts
│   ├── routes/          # REST API endpoints (auth, assessment, colleges, etc.)
│   ├── services/        # Recommendation engine & business logic
│   └── index.js         # Backend server entry point
├── frontend/
│   ├── src/             # React application (pages, components, context, UI)
│   ├── public/          # Static assets & PWA manifest
│   └── vite.config.js   # Vite build configuration
├── database/            # Database assets and documentation
└── README.md            # Project overview
```

---

## ❓ Troubleshooting & FAQs

- **Port already in use**:
  - If port `3001` or `5173` is busy, ensure any previous instances of Node are closed or terminated.
- **SQLite experimental warning**:
  - The warning `ExperimentalWarning: SQLite is an experimental feature` is normal when running Node.js with built-in SQLite.
