import os
import asyncio
import json
import tempfile
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, UploadFile, File, Request, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from rag_pipeline import RAGPipeline
from modules.storage import CloudinaryStorage
from modules import Loader, Model, Prompt, Chain
from modules.utils import extract_text

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
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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


@app.post("/parse-resume")
@limiter.limit("5/minute")
async def parse_resume(request: Request, file: UploadFile = File(...)):
    """
    Extracts text from a resume file and converts it to a structured JSON format.
    """
    # 1. Validate File Type
    ext = file.filename.rsplit('.', 1)[-1].lower()
    if ext not in ["pdf", "docx", "txt"]:
        raise HTTPException(status_code=400, detail="Only PDF, DOCX and TXT files are supported.")

    try:
        # 2. Save locally to a temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        # 3. Extract Text
        loader = Loader(tmp_path)
        docs = await loader.load_data()
        resume_text = "\n".join([doc.page_content for doc in docs])

        if not resume_text.strip():
             raise ValueError("Could not extract text from file.")

        # 4. Clean up
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

        # 5. Build Extraction Prompt
        extraction_template = (
            "SYSTEM: You are a specialized resume parser. Convert the Resume text into the specified JSON structure.\n\n"
            "RESUME TEXT:\n{resume_text}\n\n"
            "REQUIRED JSON STRUCTURE:\n"
            "{{\n"
            "  \"personal\": {{\n"
            "    \"name\": \"\", \"title\": \"\", \"email\": \"\", \"phone\": \"\", \"location\": \"\", \"linkedin\": \"\", \"github\": \"\", \"website\": \"\"\n"
            "  }},\n"
            "  \"summary\": \"\",\n"
            "  \"experience\": [\n"
            "    {{ \"role\": \"\", \"company\": \"\", \"startDate\": \"\", \"endDate\": \"\", \"description\": \"\" }}\n"
            "  ],\n"
            "  \"education\": [\n"
            "    {{ \"degree\": \"\", \"field\": \"\", \"institution\": \"\", \"gpa\": \"\", \"startDate\": \"\", \"endDate\": \"\" }}\n"
            "  ],\n"
            "  \"skills\": [\n"
            "    {{ \"category\": \"\", \"items\": \"\" }}\n"
            "  ],\n"
            "  \"projects\": [\n"
            "    {{ \"name\": \"\", \"url\": \"\", \"tech\": \"\", \"description\": \"\" }}\n"
            "  ],\n"
            "  \"certifications\": [\n"
            "    {{ \"name\": \"\", \"issuer\": \"\", \"date\": \"\" }}\n"
            "  ]\n"
            "}}\n\n"
            "INSTRUCTIONS: Output ONLY the JSON object. If a field is missing, use empty string/array."
        )
        
        prompt = Prompt(template=extraction_template, input_variables=["resume_text"]).create_prompt()
        model_name = os.getenv("AI_MODEL", "llama-3.1-8b-instant")
        model = Model(model=model_name, temp=0.1).create_model()
        chain = Chain(prompt=prompt, model=model)

        # 6. Run Extraction
        result_dict = await asyncio.to_thread(chain.run, {"resume_text": resume_text})
        return result_dict

    except Exception as e:
        logger.error(f"Error in /parse-resume: {e}")
        raise HTTPException(status_code=500, detail=f"Parsing failed: {str(e)}")


@app.post("/ats-analyze")
@limiter.limit("5/minute")
async def ats_analyze(
    request: Request, 
    file: UploadFile = File(...), 
    job_description: str = Form(...)
):
    """
    Analyzes a resume against a job description for ATS compatibility.
    """
    # 1. Validate File Type
    ext = file.filename.rsplit('.', 1)[-1].lower()
    if ext not in ["pdf", "docx", "txt"]:
        raise HTTPException(status_code=400, detail="Only PDF, DOCX and TXT files are supported.")

    try:
        # 2. Save locally to a temp file for extraction
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        # 3. Extract Text
        loader = Loader(tmp_path)
        docs = await loader.load_data()
        resume_text = "\n".join([doc.page_content for doc in docs])

        if not resume_text.strip():
             raise ValueError("Could not extract any text from the resume. Please make sure the file is not empty or corrupted.")

        # 4. Clean up local temp file
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

        # 5. Build Analysis Prompt
        ats_template = (
            "You are an expert ATS (Applicant Tracking System) optimizer. "
            "Analyze the following Resume against the Job Description.\n\n"
            "Resume:\n{resume_text}\n\n"
            "Job Description:\n{job_description}\n\n"
            "Provide a JSON response with the following structure:\n"
            "{{\n"
            "  \"score\": (0-100),\n"
            "  \"matching_keywords\": [],\n"
            "  \"missing_keywords\": [],\n"
            "  \"improvements\": []\n"
            "}}\n\n"
            "Output ONLY the JSON."
        )
        
        ats_prompt = Prompt(
            template=ats_template,
            input_variables=["resume_text", "job_description"],
        ).create_prompt()

        model_name = os.getenv("AI_MODEL", "llama-3.1-8b-instant")
        model = Model(model=model_name, temp=0.2).create_model()
        chain = Chain(prompt=ats_prompt, model=model)

        # 6. Run Analysis
        result_dict = await asyncio.to_thread(chain.run, {"resume_text": resume_text, "job_description": job_description})
        return result_dict

    except Exception as e:
        logger.error(f"Error in /ats-analyze: {e}")
        raise HTTPException(status_code=500, detail=f"Error analyzing ATS: {str(e)}")


@app.post("/generate-cover-letter")
@limiter.limit("5/minute")
async def generate_cover_letter(
    request: Request, 
    resume_text: str = Form(None), 
    file: UploadFile = File(None), 
    job_description: str = Form(...)
):
    """
    Generates a cover letter based on a resume (text or file) and job description.
    """
    try:
        # 1. Extract Text if file provided
        if file:
            ext = file.filename.rsplit('.', 1)[-1].lower()
            if ext not in ["pdf", "docx", "txt"]:
                raise HTTPException(status_code=400, detail="Only PDF, DOCX and TXT files are supported.")
            
            with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
                tmp.write(await file.read())
                tmp_path = tmp.name
            
            loader = Loader(tmp_path)
            docs = await loader.load_data()
            resume_text = "\n".join([doc.page_content for doc in docs])
            
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
        
        if not resume_text:
            raise HTTPException(status_code=400, detail="Either resume_text or file must be provided.")

        # 2. Build Cover Letter Prompt
        cl_template = (
            "SYSTEM: You are a professional career coach. You must ALWAYS respond in valid JSON format.\n\n"
            "RESUME:\n{resume_text}\n\n"
            "JOB DESCRIPTION:\n{job_description}\n\n"
            "RESPONSE FORMAT:\n"
            "{{\n"
            "  \"cover_letter\": \"your professional cover letter content here\"\n"
            "}}\n\n"
            "Expert Response (JSON ONLY):"
        )
        
        cl_prompt = Prompt(
            template=cl_template,
            input_variables=["resume_text", "job_description"],
        ).create_prompt()

        model_name = os.getenv("AI_MODEL", "llama-3.1-8b-instant")
        model = Model(model=model_name, temp=0.7).create_model()
        chain = Chain(prompt=cl_prompt, model=model)

        # 3. Run Generation
        result_dict = await asyncio.to_thread(chain.run, {"resume_text": resume_text, "job_description": job_description})
        
        # Robust extraction
        cover_letter = extract_text(result_dict, "cover_letter")
            
        return {"cover_letter": cover_letter.strip()}

    except Exception as e:
        logger.error(f"Error in /generate-cover-letter: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating cover letter: {str(e)}")


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


@app.post("/chat")
@limiter.limit("10/minute")
async def chat(
    request: Request,
    question: str = Form(...),
    file: UploadFile = File(None),
    resume_text: str = Form(None),
    history: str = Form(None)
):
    """
    Instant AI Consultant Chat with context window support.
    Optionally extracts text from a file to use as context for the query.
    Uses past chat history for continuous conversation context.
    Falls back to RAG pipeline if a resume was previously indexed.
    """
    try:
        context = resume_text or ""
        
        # 1. Extract from File if provided
        if file and file.filename:
            ext = file.filename.rsplit('.', 1)[-1].lower()
            if ext not in ["pdf", "docx", "txt"]:
                raise HTTPException(status_code=400, detail="Only PDF, DOCX and TXT files are supported.")
            
            with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
                tmp.write(await file.read())
                tmp_path = tmp.name
            
            try:
                loader = Loader(tmp_path)
                docs = await loader.load_data()
                file_context = "\n".join([doc.page_content for doc in docs])
                if file_context.strip():
                    context = file_context
            finally:
                if os.path.exists(tmp_path):
                    os.remove(tmp_path)

        # 2. Fallback to RAG Pipeline if no explicit context provided but store is built
        is_rag_context = False
        if not context and pipeline and pipeline.store:
            logger.info("Using RAG pipeline for chat context fallback")
            results = await asyncio.to_thread(pipeline.store.retrieve, question, k=3)
            context = "\n\n".join([doc.page_content for doc in results])
            is_rag_context = True

        # Process chat history
        formatted_history = "No previous context."
        if history:
            try:
                history_list = json.loads(history)
                if history_list:
                    # Only take last 15 messages for history to keep context window manageable
                    history_list = history_list[-15:]
                    formatted_history = "\n".join([
                        f"{'AI' if msg.get('role') == 'bot' else 'User'}: {msg.get('content')}"
                        for msg in history_list
                    ])
            except Exception as e:
                logger.warning(f"Failed to parse chat history: {e}")

        # 3. Build Prompt
        if context:
            template = (
                "SYSTEM: You are ResumeForge AI, a premium career consultant. "
                "You must ALWAYS respond in valid JSON format with an 'answer' key. "
                "Do not include any text outside the JSON object.\n\n"
                "RESUME CONTENT:\n{context}\n\n"
                "RECENT CHAT HISTORY:\n{history}\n\n"
                "USER QUESTION: {question}\n\n"
                "INSTRUCTIONS: Use the provided Resume Content to answer the user's question. "
                "If the question is general, use the resume as a reference for tailored advice. "
                "Provide detailed, actionable, and professional feedback.\n\n"
                "RESPONSE FORMAT:\n"
                "{{\n"
                "  \"answer\": \"your markdown-formatted response here\"\n"
                "}}\n\n"
                "Expert Response (JSON ONLY):"
            )
            input_vars = {"context": context, "question": question, "history": formatted_history}
            prompt_vars = ["context", "question", "history"]
        else:
            template = (
                "SYSTEM: You are ResumeForge AI. You must ALWAYS respond in valid JSON format. "
                "Do not include any text outside the JSON object.\n\n"
                "RECENT CHAT HISTORY:\n{history}\n\n"
                "USER QUESTION: {question}\n\n"
                "RESPONSE FORMAT:\n"
                "{{\n"
                "  \"answer\": \"your markdown-formatted response here\"\n"
                "}}\n\n"
                "Expert Response (JSON ONLY):"
            )
            input_vars = {"question": question, "history": formatted_history}
            prompt_vars = ["question", "history"]

        prompt = Prompt(template=template, input_variables=prompt_vars).create_prompt()
        model_name = os.getenv("AI_MODEL", "llama-3.1-8b-instant")
        model = Model(model=model_name, temp=0.4).create_model()
        chain = Chain(prompt=prompt, model=model)

        result_dict = await asyncio.to_thread(chain.run, input_vars)
        
        # Robust extraction
        answer = extract_text(result_dict, "answer")
            
        return {
            "answer": answer, 
            "has_context": bool(context), 
            "extracted_context": context if file and not is_rag_context else None,
            "is_rag": is_rag_context,
            "has_history": bool(history)
        }


    except Exception as e:
        logger.error(f"Error in /chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))