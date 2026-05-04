import dbConnect from "@/lib/mongodb";
import { Resume } from "@/lib/models";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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

    const { title, data } = await request.json();

    // Upsert resume (Update if exists, or create new)
    // For simplicity, we'll just create a new one or update the one with the same title
    const resume = await Resume.findOneAndUpdate(
      { userId, title },
      { data, updatedAt: Date.now() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: "Resume saved successfully", resume }, { status: 200 });
  } catch (error) {
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

    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 });

    return NextResponse.json({ resumes }, { status: 200 });
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
    const resumeId = searchParams.get("id");

    if (!resumeId) {
      return NextResponse.json({ error: "Resume ID is required" }, { status: 400 });
    }

    const result = await Resume.findOneAndDelete({ _id: resumeId, userId });

    if (!result) {
      return NextResponse.json({ error: "Resume not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Resume deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
