import dbConnect from "@/lib/mongodb";
import { User } from "@/lib/models";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    await dbConnect();
    
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      // User was deleted from DB
      return NextResponse.json({ error: "User no longer exists" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token or session expired" }, { status: 401 });
  }
}
