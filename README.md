# One Stop J&K - Career & Education Advisor

A comprehensive full-stack platform designed to guide students in Jammu & Kashmir through their educational and career journeys. This application provides personalized recommendations, college discovery, scholarship tracking, and a centralized admin dashboard for content management.

## Tech Stack

*   **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Lucide React
*   **Backend**: Node.js 24, Express, JSON Web Tokens (JWT)
*   **Database**: SQLite (`node:sqlite` built-in Node 24 module)
*   **PWA**: `vite-plugin-pwa` for offline capabilities and app-shell caching
*   **i18n**: `react-i18next` for English, Hindi, Urdu, and Kashmiri localizations

## Features

*   **Student Portal**:
    *   Interest and aptitude assessment.
    *   Personalized recommendations (courses, careers, colleges) based on a rule-based engine.
    *   Dynamic, interactive roadmap tracking 10 steps to admission success.
    *   Browse and compare government colleges across J&K.
    *   Scholarship eligibility checker.
    *   Interactive admission timeline.
    *   Free learning resources (videos, e-books, mock tests).
*   **Admin Dashboard**:
    *   Centralized data management for courses, careers, colleges, scholarships, timeline events, and learning resources.
    *   Student progress and analytics tracking.
    *   Streamlined interfaces to verify and publish data.
*   **Offline First**: PWA support ensures the app shell loads even without an internet connection, and critical data like assessment answers are saved locally.

## Getting Started

### Prerequisites
*   Node.js v24.19.0+

### Setup

1.  **Clone the repository**.
2.  **Install dependencies**:
    ```bash
    # Install backend dependencies
    cd backend
    npm install

    # Install frontend dependencies
    cd ../frontend
    npm install
    ```
3.  **Database Setup**:
    The backend uses `node:sqlite` and includes an automated seed script for J&K specific data.
    ```bash
    cd backend
    npm run setup
    ```

### Running the Application

The application requires both the frontend and backend servers to be running simultaneously.

1.  **Start the Backend** (Runs on port 3001):
    ```bash
    cd backend
    npm start
    ```
    *(Note: The start script uses the `--experimental-sqlite` flag required for Node 24).*

2.  **Start the Frontend** (Runs on port 5173):
    ```bash
    cd frontend
    npm run dev
    ```

### Demo Accounts

*   **Student Demo**:
    *   Email: `student@onestop.jk`
    *   Password: `Student@123`
*   **Admin Demo**:
    *   Email: `admin@onestop.jk`
    *   Password: `Admin@123`

## Project Structure

*   `/frontend` - React Vite application containing all UI components, pages, and hooks.
*   `/backend` - Express API server.
    *   `/db` - SQLite initialization, schema, and J&K seed data.
    *   `/routes` - RESTful API endpoints for all application modules.
    *   `/middleware` - JWT authentication and error handling.
    *   `/services` - Business logic (e.g., recommendation engine).
