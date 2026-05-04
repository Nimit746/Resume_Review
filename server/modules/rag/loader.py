import httpx
import tempfile
import os
import asyncio
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_core.documents import Document


class Loader:
    def __init__(self, file_source: str, encoding: str = "utf-8"):
        """
        :param file_source: Can be a local path or a URL.
        """
        self.file_source = file_source
        self.encoding = encoding
        self.temp_file = None

    def _is_url(self) -> bool:
        return self.file_source.startswith(("http://", "https://"))

    async def _get_local_path(self) -> str:
        if self._is_url():
            # Download to a temporary file asynchronously
            suffix = "." + self.file_source.rsplit('.', 1)[-1].lower() if '.' in self.file_source else ""
            
            async with httpx.AsyncClient() as client:
                response = await client.get(self.file_source)
                response.raise_for_status()
            
            # Use a thread-safe way to write the file or just standard write in this context
            temp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
            temp.write(response.content)
            temp.close()
            self.temp_file = temp.name
            return self.temp_file
        return self.file_source

    async def load_data(self) -> list[Document]:
        path = await self._get_local_path()
        ext = path.rsplit('.', 1)[-1].lower()
        
        try:
            # LangChain loaders are synchronous, so we run them in a thread pool to avoid blocking
            if ext == 'pdf':
                loader = PyPDFLoader(path)
            else:
                loader = TextLoader(path, encoding=self.encoding)
            
            # Run the synchronous load() in a separate thread
            docs = await asyncio.to_thread(loader.load)
            return docs
        finally:
            # Clean up temporary file if created
            if self.temp_file and os.path.exists(self.temp_file):
                os.remove(self.temp_file)

