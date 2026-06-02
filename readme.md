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

