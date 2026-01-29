# ML Hub

A full-stack machine learning application that provides interactive access to various ML models including color analysis, edge detection, and color detection. The platform features a modern web interface with real-time camera input support for compatible models.

## 🌐 Live Demo

- **Frontend:** https://mlearning-hub.vercel.app

## 🏗️ Architecture

### Frontend
- **Framework:** Next.js 16 with TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **Features:** Dynamic model pages, real-time camera input, live preview

### Backend
- **Framework:** FastAPI with Python
- **Deployment:** Render
- **Models:** Color Analyzer, Edge Detector, Color Detector, Image Classifier
- **Libraries:** OpenCV, Scikit-learn, NumPy, Pillow

## 🚀 Local Development Setup

### Prerequisites
- Node.js 16+ and npm
- Python 3.9+
- Git

### Backend Setup

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # macOS/Linux
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

5. **Start the FastAPI server:**
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend will run on `http://localhost:8000`

### Frontend Setup

1. **Open a new terminal and navigate to the client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` file:**
   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

## 📝 Environment Variables

### Server (.env)
```env
ALLOWED_ORIGINS=http://localhost:3000, https://mlearning-hub.vercel.app, https://mlearning-a6pxl865c-saiimonns-projects.vercel.app
```

### Client (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## 🎯 Available Models

### Color Analyzer
- **Input Type:** Image
- **Output:** Color distribution analysis and dominant colors
- **Use Case:** Analyze color composition of images

### Edge Detector
- **Input Type:** Image
- **Output:** Edge-detected image
- **Use Case:** Computer vision preprocessing

### Color Detector
- **Input Type:** Image + Color
- **Output:** Color detection with live camera support
- **Use Case:** Real-time color detection in video streams

### Image Classifier
- **Input Type:** Image
- **Output:** Classification results
- **Use Case:** General image classification tasks

## 🔧 Building for Production

### Frontend Build
```bash
cd client
npm run build
npm start
```

### Backend Deployment
The backend is configured for Render deployment via `render.yaml`:
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## 📂 Project Structure

```
ml-hub/
├── client/                  # Next.js frontend
│   ├── app/
│   │   ├── (pages)/        # Route segments
│   │   ├── components/     # Shared components
│   │   ├── config/         # API configuration
│   │   └── features/       # Feature modules
│   └── public/             # Static assets
├── server/                  # FastAPI backend
│   ├── app/
│   │   ├── ml/             # ML models
│   │   ├── routes/         # API routes
│   │   ├── schemas/        # Data schemas
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utilities
│   └── requirements.txt    # Python dependencies
└── README.md
```


## 📦 Technologies Used

- Next.js 16
- TypeScript
- Tailwind CSS
- FastAPI
- OpenCV
- Scikit-learn
- NumPy
- Pydantic

## 📄 License

MIT License

## 👨‍💻 Author

Simon Gabriel
