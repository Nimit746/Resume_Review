from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

class Splitter:
    def __init__(self, docs: list[Document], chunk_size: int, chunk_overlap: int):
        self.docs = docs
        self.cs = chunk_size
        self.co = chunk_overlap

    def doc_splitter(self):
        splitter = RecursiveCharacterTextSplitter(
            chunk_size = self.cs,
            chunk_overlap = self.co
        )
        
        result = splitter.split_documents(self.docs)
        return result
