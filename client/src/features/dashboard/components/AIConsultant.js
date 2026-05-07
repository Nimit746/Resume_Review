"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Bot, User, Paperclip, X, Loader2, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AIConsultant() {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hi! I'm your ResumeForge AI Consultant. How can I help you with your career journey today?" }
  ]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [activeResumeContext, setActiveResumeContext] = useState(null); // Stores text of last uploaded resume
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && !file) return;

    const userMessage = { 
      role: "user", 
      content: input, 
      fileName: file?.name || (activeResumeContext ? "Using active resume context" : null) 
    };
    
    // Include last 50 messages for context
    const chatHistory = messages.slice(-50);

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("question", input || "Please analyze the attached resume.");
      formData.append("history", JSON.stringify(chatHistory));
      
      if (file) {
        formData.append("file", file);
      } else if (activeResumeContext) {
        formData.append("resume_text", activeResumeContext);
      }

      const pythonBackendUrl = process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL || "http://localhost:8000";
      const response = await axios.post(`${pythonBackendUrl}/chat`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessages((prev) => [...prev, { role: "bot", content: response.data.answer }]);
      
      // Persist context if returned by backend
      if (response.data.extracted_context) {
        setActiveResumeContext(response.data.extracted_context);
        toast.success("Resume context saved for this conversation");
      }
      
      setFile(null);
    } catch (err) {
      console.error("Chat failed", err);
      toast.error("AI Consultant is currently unavailable. Please ensure the backend is running.");
      setMessages((prev) => [...prev, { role: "bot", content: "Sorry, I encountered an error. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };


  const formatMessage = (content) => {
    if (typeof content !== "string") return content;
    
    const stripped = content.trim();
    if (stripped.startsWith('{') && stripped.includes('"answer"')) {
      try {
        const parsed = JSON.parse(stripped);
        if (parsed.answer) return parsed.answer;
      } catch (e) {
        // Fallback: Regex extraction for broken JSON (common with Llama)
        const match = stripped.match(/"answer"\s*:\s*"(.*?)"(?=\s*[,}])/s);
        if (match && match[1]) {
          return match[1]
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/\\'/g, "'");
        }
      }
    }
    return content;
  };

  return (
    <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm flex flex-col h-[600px] overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 text-primary rounded-2xl flex items-center justify-center shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">AI Consultant</h3>
            <p className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Online • Ready to help</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            {activeResumeContext && (
                <div className="px-3 py-1 bg-green-50 rounded-full flex items-center gap-1.5 border border-green-100">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Resume Active</span>
                </div>
            )}
            <div className="px-3 py-1 bg-gray-50 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Turbo v3.1</span>
            </div>
        </div>

      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#FAFBFC]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center shadow-sm transition-all hover:scale-110
                ${msg.role === "user" ? "bg-gray-900 text-white" : "bg-white text-primary border border-gray-100"}`}>
                {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className="space-y-2">
                <div className={`p-5 rounded-[2rem] text-sm font-medium leading-relaxed shadow-[0_4px_20px_rgba(0,0,0,0.03)] backdrop-blur-sm
                  ${msg.role === "user" 
                    ? "bg-gray-900 text-white rounded-tr-none shadow-gray-200" 
                    : "bg-white/80 border border-white text-gray-700 rounded-tl-none"}`}>
                  {msg.role === "bot" ? (
                    <div className="prose prose-sm prose-gray max-w-none 
                        prose-p:leading-relaxed prose-p:mb-4 last:prose-p:mb-0
                        prose-ul:list-disc prose-ul:ml-5 prose-ul:mb-4
                        prose-li:mb-2 prose-strong:font-black prose-strong:text-gray-900
                        prose-headings:font-black prose-headings:text-gray-900 prose-headings:mb-3
                        prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-primary">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {formatMessage(msg.content)}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
                {msg.fileName && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md border border-white rounded-2xl text-[10px] font-black text-gray-400 w-fit shadow-sm uppercase tracking-widest">
                    <Paperclip className="w-3.5 h-3.5 text-primary" />
                    {msg.fileName}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-pulse">
             <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">AI Consultant</span>
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">Analyzing your request...</span>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-gray-50">
        {file && (
          <div className="mb-4 flex items-center justify-between px-4 py-2 bg-primary/5 border border-primary/10 rounded-xl">
            <div className="flex items-center gap-2">
              <Paperclip className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-primary truncate max-w-[200px]">{file.name}</span>
            </div>
            <button onClick={() => setFile(null)} className="text-primary hover:bg-primary/10 p-1 rounded-lg transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
            accept=".pdf,.docx,.txt"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-4 bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"
            title="Upload Resume for context"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask for resume feedback, interview tips..."
              className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-6 pr-14 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
            <button
              onClick={handleSend}
              disabled={loading || (!input.trim() && !file)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-primary text-white rounded-xl shadow-lg shadow-orange-100 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:shadow-none"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
