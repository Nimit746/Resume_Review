import os
from langchain_pinecone import PineconeVectorStore
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings
from pinecone import Pinecone

class Embed:
    def __init__(self, model_name:str = 'sentence-transformers/all-MiniLM-L6-v2'):
        self.embeddings = HuggingFaceEmbeddings(
            model_name = model_name
        )
    


class Store:
    def __init__(self, embeddings:Embed, index_name:str = None):
        """
        Initializes Pinecone Vector Store.
        :param index_name: Name of the Pinecone index (defaults to env PINECONE_INDEX_NAME)
        """
        self.api_key = os.getenv("PINECONE_API_KEY")
        self.index_name = index_name or os.getenv("PINECONE_INDEX_NAME")
        self.environment = os.getenv("PINECONE_ENVIRONMENT")
        
        if not self.api_key or not self.index_name:
            raise ValueError("Pinecone API Key and Index Name must be set in environment.")

        # Initialize Pinecone client
        # In newer SDKs, environment is often inferred, but we store it for completeness
        self.pc = Pinecone(api_key=self.api_key)
        
        self.store = PineconeVectorStore(
            index_name=self.index_name,
            embedding=embeddings.embeddings,
            pinecone_api_key=self.api_key
        )
        
    def add_docs(self, docs:list[Document]) -> None:
        self.store.add_documents(docs)

    def retrieve(self, query: str, k: int = 3) -> list[Document]:
        return self.store.similarity_search(query, k=k)
