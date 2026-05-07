import dbConnect from "@/lib/mongodb";
import { Resume, CoverLetter } from "@/lib/models";
import mongoose from "mongoose";

export async function getUserResumes(userId) {
  await dbConnect();
  const resumes = await Resume.find({ userId: new mongoose.Types.ObjectId(userId) })
    .sort({ updatedAt: -1 })
    .lean();
  
  // Convert _id to string for serialization
  return resumes.map(r => ({
    ...r,
    _id: r._id.toString(),
    userId: r.userId.toString(),
    updatedAt: r.updatedAt.toISOString(),
  }));
}

export async function getResumeById(userId, resumeId) {
  await dbConnect();
  const resume = await Resume.findOne({ 
    _id: resumeId, 
    userId: new mongoose.Types.ObjectId(userId) 
  }).lean();
  
  if (!resume) return null;
  
  return {
    ...resume,
    _id: resume._id.toString(),
    userId: resume.userId.toString(),
    updatedAt: resume.updatedAt.toISOString(),
  };
}

export async function getDashboardStats(userId) {
  await dbConnect();
  const userObjectId = new mongoose.Types.ObjectId(userId);
  
  const resumes = await Resume.find({ userId: userObjectId }).lean();
  const coverLettersCount = await CoverLetter.countDocuments({ userId: userObjectId });
  
  let totalAtsScore = 0;
  let resumesWithScore = 0;
  let totalViews = 0;
  
  resumes.forEach(resume => {
    totalViews += (resume.views || 0);
    if (resume.atsScore && resume.atsScore > 0) {
      totalAtsScore += resume.atsScore;
      resumesWithScore++;
    } else {
      // Calculate a "completeness" score if no ATS score exists
      let completeness = 0;
      const data = resume.data || {};
      if (data.personalInfo && Object.keys(data.personalInfo).length > 2) completeness += 20;
      if (data.experience && data.experience.length > 0) completeness += 30;
      if (data.education && data.education.length > 0) completeness += 20;
      if (data.skills && data.skills.length > 0) completeness += 20;
      if (data.projects && data.projects.length > 0) completeness += 10;
      
      totalAtsScore += completeness;
      resumesWithScore++;
    }
  });
  
  const avgPerformance = resumes.length > 0 ? Math.round(totalAtsScore / resumesWithScore) : 0;
  
  return [
    { label: "Performance", value: `${avgPerformance}/100`, trend: "+0%", id: "performance" },
    { label: "Resume Views", value: totalViews.toString(), trend: "+0%", id: "views" },
    { label: "Job Matches", value: coverLettersCount.toString(), trend: "+0%", id: "matches" }
  ];
}

