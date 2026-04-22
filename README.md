# VentureRAG - Startup Idea Evaluation System

A full-stack RAG (Retrieval-Augmented Generation) application to evaluate startup ideas using market data.

## Project Structure
- `backend/`: FastAPI backend with FAISS vector search and sentence-transformers.
- `frontend/`: Vite + React frontend with modern Tailwind CSS styling.

## Prerequisites
- Node.js (v18+)
- Python (3.9+)

## Setup Instructions

### 1. Backend Setup
Navigate to the `backend` directory and set up the Python environment:
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Frontend Setup
Navigate to the `frontend` directory and install dependencies:
```bash
cd frontend
npm install
```

## Running the Application

### Start the Backend
From the `backend` directory with your virtual environment activated:
```bash
uvicorn main:app --reload
```
The API will run at `http://localhost:8000`.

### Start the Frontend
From the `frontend` directory:
```bash
npm run dev
```
The UI will run at `http://localhost:5173`.

## Example Usage

1. Open the frontend URL in your browser.
2. Enter a startup idea, for example: `"A marketplace for renting out idle GPU compute power"`
3. Click **Evaluate Idea**.
4. The system will retrieve relevant similar startup models and generate an executive verdict, success factors, failure patterns, and market gaps.

## Example API Request (Backend only)
```bash
curl -X 'POST' \
  'http://localhost:8000/analyze-idea' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "idea": "Uber for pet sitting"
}'
```
