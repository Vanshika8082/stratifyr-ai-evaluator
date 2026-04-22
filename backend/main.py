from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import StartupIdea, EvaluationResult
from rag_pipeline import RAGPipeline
import os

# Trigger reload for JSON update
app = FastAPI(title="Startup Idea Evaluator API")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG Pipeline at startup
# Resolve path to sample_data
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "sample_data", "startups.json")

try:
    rag = RAGPipeline(data_path=DATA_PATH)
except Exception as e:
    print(f"Warning: Could not initialize RAG Pipeline: {e}")
    rag = None

@app.post("/analyze-idea", response_model=EvaluationResult)
async def analyze_idea(startup: StartupIdea):
    if not rag:
        raise HTTPException(status_code=500, detail="RAG Pipeline not initialized. Check server logs.")
    
    try:
        # 1. Retrieve similar startups/patterns
        retrieved_docs = rag.search(startup.idea, top_k=2)
        
        # 2. Generate evaluation
        evaluation = rag.generate_evaluation(startup.idea, retrieved_docs)
        
        return evaluation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
