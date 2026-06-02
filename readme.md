# 👁️ BioTrack-YOLO: AI-Powered Full-Stack Biometric Attendance Suite

An enterprise-grade, full-stack biometric attendance management platform situated in the AI/ML domain. The application replaces conventional logging methods with an automated computer vision pipeline, deploying a custom **YOLO (You Only Look Once)** detection model to process camera frames, extract facial blueprints, and synchronize analytical presence tracking telemetry inside an interactive user dashboard.

## 🧠 AI/ML & Computer Vision Architecture
Unlike standard rule-based tracking systems, this suite leverages modern deep learning methodologies to handle real-time spatial telemetry:
- **YOLO Detection Engine:** Implements the YOLO model framework to perform high-speed, single-forward-pass object localization and facial bounding-box anchoring directly on incoming browser frames.
- **Biometric Processing Pipeline:** Utilizes Python computational libraries alongside YOLO to isolate structural landmarks, normalizing matrix inputs before executing matching sequences against stored relational biometric profiles.

## 🚀 Key Features
- **Real-Time Stream Inference:** Captures and feeds live frames from a target-aligned React browser interface directly into the backend deep learning pipeline.
- **Dynamic Relational Reporting:** Implements custom data routing mechanisms allowing users to fetch read-only monthly attendance sheets, while administrators retain full CRUD authority to modify logs via a secure backend portal.
- **Granular Session Filtering:** Includes interactive time-based validation rules, applying strict date-locks preventing data modifications for future scheduling blocks.

## 🛠️ Tech Stack
- **AI/ML Layer:** YOLO Architecture, Python OpenCV, NumPy
- **Frontend Framework:** React, React Router DOM, Axios, Custom Modern CSS
- **Backend Infrastructure:** Django, Django CORS Headers, REST API Architecture
- **Database Engine:** MySQL (Structured Relational Storage)

## 📁 Repository Map
```text
├── frontend/             # React (Vite) single-page application structure and UI components
│   ├── src/
│   │   ├── components/   # UI Layout panels
│   │   ├── config.js     # Centralized API network settings
│   │   └── App.jsx       # Client entry point & routing
│   ├── package.json      # Node.js dependency tracking blueprint
│   └── .gitignore        # Frontend version control file exclusions
│
├── backend/              # Django core architecture & machine learning engines
│   ├── backend/          # Project configuration center (settings.py, urls.py)
│   ├── attendance/       # Main app application logic (views.py, models.py, urls.py)
│   ├── requirements.txt  # Python pip environment dependency manifest
│   ├── manage.py         # Django administrative orchestration entry point
│   └── .env              # Hidden environment credential storage
│
└── README.md             # Project documentation centerpiece

## 📦 Complete Installation & Local Setup Guide
Follow this definitive walkthrough to configure your local machine completely from scratch, link your database engine, install deep learning dependencies, and spin up the full-stack system locally.

## 📋 Prerequisites
Ensure you have the following baseline environments installed on your machine before beginning setup:

Python (v3.10 or higher) -> Download Python (Crucial: Ensure you check the box to "Add Python to PATH" during installation)

Node.js (v18 or higher) -> Download Node.js

MySQL Community Server -> Download MySQL Installer

Step 1: Clone the Repository
Open your preferred terminal application (Command Prompt, PowerShell, or Git Bash) and run the following commands to pull the project code and enter the root directory:

B## 📦 Complete Installation & Local Setup Guide

Follow this definitive walkthrough to configure your local machine completely from scratch, link your database engine, install deep learning dependencies, and spin up the full-stack system locally.

### 📋 Prerequisites
Ensure you have the following baseline environments installed on your machine before beginning setup:
1. **Python (v3.10 or higher)** -> [Download Python](https://www.python.org/downloads/) *(Crucial: Ensure you check the box to "Add Python to PATH" during installation)*
2. **Node.js (v18 or higher)** -> [Download Node.js](https://nodejs.org/)
3. **MySQL Community Server** -> [Download MySQL Installer](https://dev.mysql.com/downloads/installer/)

---

### Step 1: Clone the Repository
Open your preferred terminal application (Command Prompt, PowerShell, or Git Bash) and run the following commands to pull the project code and enter the root directory:
```bash
git clone [https://github.com/OutsideIron123/Vision-Attendance.git](https://github.com/OutsideIron123/Vision-Attendance.git)
cd Vision-Attendance

### Step 2: Initialize the MySQL Database
1. Open your **MySQL Command Line Client** or database management GUI (like MySQL Workbench).
2. Log into your root user account and execute the following SQL command to spin up an empty structural schema for the app:
   ```sql
   CREATE DATABASE facerecogsql;

### Step 3: Configure the Django Backend Environment

1. Navigate into the `backend` directory from your terminal:
   ```bash
   cd backend
2. Create a clean Python Virtual Environment to keep the system dependencies isolated:

**Windows (Command Prompt):**
```cmd
python -m venv env
env\Scripts\activate

**Windows (PowerShell):**
```powershell
python -m venv env
.\env\Scripts\Activate.ps1

**MacOS/Linux : **
python3 -m venv env
source env/bin/activate

3. Install the required deep learning packages, computer vision modules, and server-database connectors:

```bash
pip install --upgrade pip
pip install -r requirements.txt

4. **Setup Environment Variables:**

Create a brand new file named `.env` directly inside your `backend/` root directory (alongside `manage.py`). Open the file in a text editor and add the following configuration lines, swapping out the database values to match your local setup:

```text
DEBUG=True
SECRET_KEY=django-insecure-local-development-token-replace-this-string
DB_NAME=attendancedb
DB_USER=your_mysql_username_here
DB_PASSWORD=your_mysql_password_here

5. **Load YOLO Architecture Weights:**

Ensure your custom trained YOLO neural network weight configurations or file objects (e.g., `.pt`, `.weights`) are placed inside your specified models or configurations directory within your backend app layout.

6. **Execute Database Migrations:**

Run Django's migration engine to automatically construct all necessary tables, constraints, and relationships inside your empty MySQL database schema:

```bash
python manage.py makemigrations
python manage.py migrate

7. **Launch the Backend Dev Server:**

Boot up the live backend server. We lock it to an accessible local IP address to allow streaming video handshakes:

```bash
python manage.py runserver YOUR_IP:8000

### Step 4: Configure the React Frontend Client

1. Open a brand new terminal window, navigate to the project's main root folder, and enter the frontend application workspace:

```bash
cd frontend

2. Install all required React ecosystem node packages and Vite build tools:

```bash
npm install

3. **Verify API Networking Configuration:**

Open the file `src/config.js` in a text editor and double-check that the `API_BASE_URL` matches the target network string where your backend Django app is listening:

```javascript
const API_BASE_URL = "[http://192.168.1.6:8000](http://192.168.1.6:8000)";
export default API_BASE_URL;

4. **Launch the Frontend Client Development Server:**

Launch the high-performance Vite server:

```bash
npm run dev

5. **Access the Application Suite:**

Vite will display a local address link in your terminal window (usually `http://localhost:5173`). Copy and paste that link into your web browser.