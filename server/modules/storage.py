import os
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

load_dotenv()

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

class CloudinaryStorage:
    @staticmethod
    def upload_file(file_path: str, folder: str = "resumes"):
        """
        Uploads a file to Cloudinary.
        :param file_path: Path to the local file to upload.
        :param folder: Cloudinary folder to store the file.
        :return: Dictionary with secure_url and public_id.
        """
        try:
            response = cloudinary.uploader.upload(
                file_path,
                folder=folder,
                resource_type="auto"  # Automatically detect if it's a PDF, raw text, etc.
            )
            return {
                "secure_url": response.get("secure_url"),
                "public_id": response.get("public_id")
            }
        except Exception as e:
            print(f"Cloudinary upload failed: {e}")
            raise e

    @staticmethod
    def delete_file(public_id: str):
        """
        Deletes a file from Cloudinary.
        """
        try:
            cloudinary.uploader.destroy(public_id)
        except Exception as e:
            print(f"Cloudinary deletion failed: {e}")
