import asyncio
from modules import Loader, Splitter, Embed, Store, Model, Prompt, Chain
from modules.utils import extract_text
import json

class RAGPipeline:
    def __init__(
        self,
        file: str | None = None,
        collection_name: str = "Database",
        persist_dir: str = "chroma_db",
        chunk_size: int = 300,
        chunk_overlap: int = 60,
        model_name: str = "llama-3.1-8b-instant",
        temperature: float = 0.3,
        top_k: int = 3,
    ):
        self.file = file
        self.collection_name = collection_name
        self.persist_dir = persist_dir
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.model_name = model_name
        self.temperature = temperature
        self.top_k = top_k

        self.store = None
        self._model = None
        self._rag_chain = None
        self._plain_chain = None

    async def build(self) -> None:
        """Load, split, embed and store documents. Call before querying with RAG."""
        if self.file is None:
            raise ValueError("No file provided. Pass a file source (path or URL) to build the RAG store.")

        # Load using the refactored Loader (supports URLs)
        loader = Loader(self.file)
        docs = await loader.load_data()

        # Split
        splitter = Splitter(
            docs=docs,
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
        )
        split = splitter.doc_splitter()

        # Embed & Store
        embed = Embed()
        self.store = Store(
            embeddings=embed,
            index_name=self.collection_name
        )
        # add_docs is sync in LangChain, wrap in thread
        await asyncio.to_thread(self.store.add_docs, split)

        # RAG chain — uses retrieved context
        rag_template = (
            "SYSTEM: You are ResumeForge AI. You must ALWAYS respond in valid JSON format. "
            "Do not include any text outside the JSON object.\n\n"
            "RESUME CONTEXT:\n{context}\n\n"
            "USER QUESTION: {question}\n\n"
            "RESPONSE FORMAT:\n"
            "{{\n"
            "  \"answer\": \"your markdown-formatted response here\"\n"
            "}}\n\n"
            "Expert Response (JSON ONLY):"
        )
        rag_prompt = Prompt(
            template=rag_template,
            input_variables=["context", "question"],
        ).create_prompt()

        self._model = Model(model=self.model_name, temp=self.temperature).create_model()
        self._rag_chain = Chain(prompt=rag_prompt, model=self._model)

    def _get_plain_chain(self) -> Chain:
        """Lazily build the plain chain (no context) only when needed."""
        if self._plain_chain is None:
            plain_template = (
                "SYSTEM: You are ResumeForge AI. You must ALWAYS respond in valid JSON format. "
                "Do not include any text outside the JSON object.\n\n"
                "USER QUESTION: {question}\n\n"
                "RESPONSE FORMAT:\n"
                "{{\n"
                "  \"answer\": \"your markdown-formatted response here\"\n"
                "}}\n\n"
                "Expert Response (JSON ONLY):"
            )
            plain_prompt = Prompt(
                template=plain_template,
                input_variables=["question"],
            ).create_prompt()

            model = self._model or Model(
                model=self.model_name, temp=self.temperature
            ).create_model()

            self._plain_chain = Chain(prompt=plain_prompt, model=model)

        return self._plain_chain


    async def query(self, question: str, use_rag: bool = True) -> dict:
        """
        Query the pipeline.
        """

        if use_rag:
            if self.store is None or self._rag_chain is None:
                raise RuntimeError(
                    "RAG pipeline not built. Call .build() first or set use_rag=False."
                )

            # similarity_search is sync, wrap in thread
            results = await asyncio.to_thread(self.store.retrieve, question, k=self.top_k)
            context = "\n\n".join([doc.page_content for doc in results])
            
            # Chain run is sync, wrap in thread
            result_dict = await asyncio.to_thread(self._rag_chain.run, {"context": context, "question": question})
            answer = extract_text(result_dict, "answer")

            return {
                "question": question,
                "answer": answer,
                "mode": "rag",
                "sources": [doc.page_content for doc in results],
            }

        else:
            plain_chain = self._get_plain_chain()
            result_dict = await asyncio.to_thread(plain_chain.run, {"question": question})
            answer = extract_text(result_dict, "answer")

            return {
                "question": question,
                "answer": answer,
                "mode": "llm",
                "sources": [],
            }
