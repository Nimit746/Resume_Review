# Production Readiness TODO: Resume Reviewer AI

This document outlines the detailed tasks required to move the current prototype to a production-ready state.

## 1. Infrastructure & Backend Core
- [ ] **Migrate Vector DB**:
    - [ ] Replace `langchain-chroma` with `langchain-pinecone` or `qdrant-client`.
    - [ ] Update `Store` class in `modules/rag/vector_store.py` to use the new provider.
    - [ ] Set up environment variables for API Keys and Host URLs.
- [ ] **Add Redis Integration**:
    - [ ] Set up a Redis instance (e.g., Upstash or AWS ElastiCache).
    - [ ] Integrate `redis-py` for caching and rate limiting state.
- [ ] **Implement Rate Limiting**:
    - [ ] Install `slowapi`.
    - [ ] Configure a global rate limit (e.g., 10 requests per minute per IP).
    - [ ] Add specific limits to the `/query` and `/build` endpoints.

## 2. API Enhancements
- [ ] **Refactor File Upload Logic**:
    - [ ] Install `cloudinary` SDK.
    - [ ] Change `/build` endpoint to accept `UploadFile` via FastAPI's `File(...)`.
    - [ ] Implement a file validation layer (limit size to <5MB, allow only `.pdf`, `.docx`, `.txt`).
    - [ ] **Cloudinary Integration**:
        - [ ] Create a utility to upload to Cloudinary and return the secure URL.
        - [ ] Modify `Loader` to handle remote URLs (download to temp or stream).
    - [ ] Add logic to save Cloudinary asset metadata to your database for persistence.
- [ ] **Implement Context-Aware Querying**:
    - [ ] Modify `RAGPipeline.query` logic:
        - [ ] Check if a `resume_id` or `session_id` exists in the request.
        - [ ] **If Resume Exists**: Perform similarity search in Vector DB -> Augment Prompt -> LLM.
        - [ ] **If No Resume**: Skip retrieval -> Use base system prompt -> LLM.
- [ ] **Add Caching Layer**:
    - [ ] Implement a "Semantic Cache" using Redis.
    - [ ] Before calling LLM, check if a similar question for the same `resume_id` was answered recently.

## 3. Reliability & Monitoring
- [ ] **Structured Logging**:
    - [ ] Replace standard prints with `loguru` or Python's `logging` module.
    - [ ] Log request IDs, LLM latency, and retrieval scores.
- [ ] **Error Handling**:
    - [ ] Add specific exception handlers for LLM API timeouts and Vector DB connection issues.
    - [ ] Implement a fallback mechanism (e.g., if RAG fails, try answering with plain LLM).
- [ ] **Environment Security**:
    - [ ] Move secrets from `.env` to a secure manager (e.g., AWS Secrets Manager or HashiCorp Vault) for the production environment.

## 4. Deployment
- [ ] **Dockerization**:
    - [ ] Create a multi-stage `Dockerfile` to optimize image size.
    - [ ] Create a `docker-compose.yml` for local production testing (App + Redis).
- [ ] **Production Server Config**:
    - [ ] Configure Gunicorn with `-k uvicorn.workers.UvicornWorker` for multi-process handling.
