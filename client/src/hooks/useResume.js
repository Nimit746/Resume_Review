import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { DEFAULT_RESUME_DATA } from "@/constants/editor";

export function useResume(initialResume) {
  const [resumeData, setResumeData] = useState(initialResume?.data || DEFAULT_RESUME_DATA);
  const [resumeTitle, setResumeTitle] = useState(initialResume?.title || "My Resume");
  const [resumeId, setResumeId] = useState(initialResume?._id || null);
  const [saving, setSaving] = useState(false);

  const updateSection = (section) => (value) => {
    setResumeData((prev) => ({ ...prev, [section]: value }));
  };

  const saveResume = async () => {
    setSaving(true);
    const toastId = toast.loading("Saving resume...");
    try {
      const res = await axios.post("/api/resumes", {
        id: resumeId,
        title: resumeTitle,
        data: resumeData,
      });
      
      if (!resumeId && res.data.resume._id) {
        setResumeId(res.data.resume._id);
        window.history.replaceState(null, "", `/editor?id=${res.data.resume._id}`);
      }
      
      toast.success("Resume saved successfully!", { id: toastId });
      return res.data.resume;
    } catch (error) {
      toast.error("Failed to save. Please try again.", { id: toastId });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return {
    resumeData,
    setResumeData,
    resumeTitle,
    setResumeTitle,
    resumeId,
    saving,
    updateSection,
    saveResume,
  };
}
