import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import { User } from "@/lib/models";

export async function getServerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await dbConnect();
    const user = await User.findById(decoded.userId).select("-password").lean();
    if (!user) return null;
    
    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      }
    };
  } catch (error) {
    return null;
  }
}
