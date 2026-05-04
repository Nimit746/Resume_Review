import os
import tempfile
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, UploadFile, File, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from rag_pipeline import RAGPipeline
from modules.storage import CloudinaryStorage

# ---------- Logging Configuration ----------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

# ---------- Configuration & Security ----------

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="Resume Reviewer AI",
    description="Production-ready RAG API with Cloudinary, Pinecone, and Rate Limiting",
    version="1.1.0",
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception caught: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again later."},
    )

# Add Rate Limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Schemas ----------

class QueryRequest(BaseModel):
    question: str
    use_rag: bool = True


class QueryResponse(BaseModel):
    question: str
    answer: str
    mode: str           # "rag" or "llm"
    sources: list[str]


# ---------- Global State ----------

pipeline: RAGPipeline | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global pipeline
    # Initialize pipeline without a file for immediate LLM availability
    pipeline = RAGPipeline()
    yield
    pipeline = None


app.router.lifespan_context = lifespan


# ---------- Routes ----------

@app.get("/health")
@limiter.limit("5/minute")
async def health(request: Request):
    return {
        "status": "ok",
        "rag_ready": pipeline is not None and pipeline.store is not None,
    }


@app.post("/build")
@limiter.limit("3/minute")
async def build(request: Request, file: UploadFile = File(...)):
    """
    Accepts a file upload, sends it to Cloudinary, and builds the RAG index in Pinecone.
    """
    global pipeline
    
    # 1. Validate File Type
    ext = file.filename.rsplit('.', 1)[-1].lower()
    if ext not in ["pdf", "txt"]:
        raise HTTPException(status_code=400, detail="Only PDF and TXT files are supported.")

    try:
        # 2. Save locally to a temp file for Cloudinary upload
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        # 3. Upload to Cloudinary
        logger.info(f"Uploading {file.filename} to Cloudinary...")
        storage = CloudinaryStorage()
        upload_result = storage.upload_file(tmp_path)
        file_url = upload_result["secure_url"]

        # 4. Clean up local temp file
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

        # 5. Build/Update Pipeline with the new URL (Async)
        logger.info(f"Building RAG index for {file.filename} in Pinecone...")
        pipeline = RAGPipeline(file=file_url)
        await pipeline.build()

        return {
            "message": "Resume uploaded and indexed successfully",
            "file_url": file_url,
            "public_id": upload_result["public_id"]
        }
    except Exception as e:
        logger.error(f"Error in /build: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


@app.post("/query", response_model=QueryResponse)
@limiter.limit("10/minute")
async def query(request: Request, query_req: QueryRequest):
    """
    Hybrid query endpoint.
    Automatically uses RAG if a resume has been indexed, otherwise falls back to LLM.
    """
    if pipeline is None:
        raise HTTPException(status_code=500, detail="Pipeline state error.")

    # Determine mode based on whether the store is built
    actual_use_rag = query_req.use_rag and pipeline.store is not None
    
    try:
        # Async query
        result = await pipeline.query(question=query_req.question, use_rag=actual_use_rag)
        return result
    except Exception as e:
        logger.error(f"Error in /query: {e}")
        raise HTTPException(status_code=500, detail=str(e))