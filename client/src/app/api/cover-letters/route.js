import dbConnect from "@/lib/mongodb";
import { CoverLetter } from "@/lib/models";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    await dbConnect();
    
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const body = await request.json();
    const { id, title, content, jobDescription, resumeId } = body;

    let coverLetter = null;
    if (id) {
      coverLetter = await CoverLetter.findOne({ _id: id, userId: new mongoose.Types.ObjectId(userId) });
    }

    if (coverLetter) {
      coverLetter.title = title || coverLetter.title;
      coverLetter.content = content !== undefined ? content : coverLetter.content;
      coverLetter.jobDescription = jobDescription !== undefined ? jobDescription : coverLetter.jobDescription;
      coverLetter.resumeId = resumeId || coverLetter.resumeId;
      coverLetter.updatedAt = Date.now();
    } else {
      coverLetter = new CoverLetter({
        userId: new mongoose.Types.ObjectId(userId),
        title: title || "Untitled Cover Letter",
        content: content || "",
        jobDescription: jobDescription || "",
        resumeId: resumeId ? new mongoose.Types.ObjectId(resumeId) : null
      });
    }

    await coverLetter.save();

    return NextResponse.json({ message: "Cover letter saved successfully", coverLetter }, { status: 200 });
  } catch (error) {
    console.error("Error saving cover letter:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await dbConnect();
    
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const coverLetter = await CoverLetter.findOne({ _id: id, userId: new mongoose.Types.ObjectId(userId) });
      if (!coverLetter) {
        return NextResponse.json({ error: "Cover letter not found" }, { status: 404 });
      }
      return NextResponse.json({ coverLetter }, { status: 200 });
    }

    const coverLetters = await CoverLetter.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ updatedAt: -1 });

    return NextResponse.json({ coverLetters }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Cover letter ID is required" }, { status: 400 });
    }

    const result = await CoverLetter.findOneAndDelete({ _id: id, userId: new mongoose.Types.ObjectId(userId) });

    if (!result) {
      return NextResponse.json({ error: "Cover letter not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Cover letter deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
