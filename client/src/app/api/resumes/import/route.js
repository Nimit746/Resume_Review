import dbConnect from "@/lib/mongodb";
import { Resume } from "@/lib/models";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import axios from "axios";

export async function POST(request) {
  try {
    await dbConnect();
    
    // Get token from cookie
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Prepare for Python backend
    const pythonFormData = new FormData();
    pythonFormData.append("file", file);

    // Forward to Python backend (adjust URL if needed)
    const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || "http://localhost:8000";
    
    const pythonResponse = await axios.post(`${PYTHON_BACKEND_URL}/parse-resume`, pythonFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const parsedData = pythonResponse.data;

    if (!parsedData || typeof parsedData !== 'object') {
      throw new Error("Invalid response from parsing service");
    }

    // Create new resume
    const newResume = new Resume({
      userId: new mongoose.Types.ObjectId(userId),
      title: `Imported - ${file.name.replace(/\.[^/.]+$/, "")}`,
      data: parsedData,
      publicId: Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 11)
    });

    await newResume.save();

    return NextResponse.json({ 
      message: "Resume imported successfully", 
      resume: {
        _id: newResume._id.toString(),
        title: newResume.title,
        updatedAt: newResume.updatedAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Import failed:", error);
    const errorMessage = error.response?.data?.detail || error.message || "Failed to import resume";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
