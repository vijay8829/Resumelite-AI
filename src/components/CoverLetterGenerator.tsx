import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Sparkles, Wand2, Copy, Download, CheckCircle2, RotateCcw } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { cn } from '../lib/utils';
import { pdfService } from '../services/pdfService';
import { useTheme } from './ThemeProvider';

import { useFirebase } from './FirebaseProvider';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export default function CoverLetterGenerator() {
  const { user } = useFirebase();
  const { theme } = useTheme();
  const [jd, setJd] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [content, setContent] = React.useState('');

  const generateLetter = async () => {
    if (!jd || !user) return;
    setIsGenerating(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        // Fetch latest resume
        const q = query(
          collection(db, 'users', user.uid, 'resumes'),
          orderBy('updatedAt', 'desc'),
          limit(1)
        );
        const snapshot = await getDocs(q);
        
        let profileContext = "";
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          profileContext = `Name: ${data.personalInfo.fullName}. Summary: ${data.personalInfo.summary}. Skills: ${data.skills.join(', ')}.`;
        } else {
          profileContext = `User Name: ${user.displayName || 'Kiran Kiran bv'}. Currently seeking new opportunities.`;
        }
        
        const prompt = `Generate a professional, compelling, and highly targeted cover letter based on this user profile and job description. 
            
            User Profile: ${profileContext}
            Target Job Description: ${jd}
            
            Format as a professional letter. Use actual names from the profile if available. Keep it under 400 words.`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt
        });

        setContent(response.text || '');
    } catch (error) {
        console.error("Letter generation failed", error);
        setContent("Dear Hiring Manager,\n\nI am writing to express my interest in the position...");
    } finally {
        setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
      <div className="lg:col-span-12 space-y-4 mb-4">
        <h2 className={cn("text-5xl font-extrabold tracking-tight mb-2", theme === 'dark' ? "text-white" : "text-slate-900")}>Letter <span className="text-indigo-500">Generator</span></h2>
        <p className="text-slate-500 font-semibold text-xs uppercase tracking-[0.2em] max-w-2xl">
          Mathematically optimized narratives designed to bypass ATS scrutiny and engage strategic recruiters.
        </p>
      </div>

      {/* Input */}
      <div className="lg:col-span-4 space-y-6">
        <div className={cn(
          "border rounded-[3rem] p-10 space-y-8 shadow-2xl transition-colors duration-500",
          theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        )}>
            <div className="space-y-4 px-2">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <Sparkles size={16} className="text-indigo-400" />
                    </div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Strategic Alignment</h4>
                </div>
                <textarea 
                    value={jd}
                    onChange={e => setJd(e.target.value)}
                    placeholder="Paste the Job Description to calibrate the linguistic engine..."
                    className={cn(
                      "w-full border rounded-3xl p-8 text-sm min-h-[300px] focus:outline-none focus:border-indigo-500/30 transition-all resize-none font-medium leading-relaxed",
                      theme === 'dark' ? "bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-300"
                    )}
                />
            </div>
            <button 
                onClick={generateLetter}
                disabled={isGenerating || !jd}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-[2rem] font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50 text-[10px] uppercase tracking-[0.2em]"
            >
                {isGenerating ? <RotateCcw className="animate-spin" size={16} /> : <Wand2 size={16} />}
                <span>{isGenerating ? "Processing..." : "Generate Narrative"}</span>
            </button>
        </div>
      </div>

      {/* Output */}
      <div className="lg:col-span-8">
        <div className={cn(
          "border h-full min-h-[600px] rounded-[3rem] shadow-2xl relative flex flex-col group overflow-hidden transition-colors duration-500",
          theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        )}>
            <div className="absolute inset-0 bg-white/5 pointer-events-none group-hover:bg-transparent transition-all" />
            
            <div className="p-12 pr-10 flex-1 relative z-10 flex flex-col">
              <div className={cn(
                "flex-1 rounded-2xl p-12 pr-10 shadow-inner overflow-y-auto scrollbar-hide border",
                theme === 'dark' ? "bg-white text-slate-900" : "bg-white text-slate-900 border-slate-100"
              )}>
                {content ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-800 font-medium"
                    >
                        {content}
                    </motion.div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-6 opacity-30">
                        <Mail size={100} strokeWidth={0.5} className={theme === 'dark' ? "text-slate-200" : "text-slate-400"} />
                        <p className={cn("font-bold text-[10px] tracking-[0.3em] uppercase", theme === 'dark' ? "text-slate-200" : "text-slate-500")}>Input Calibration Required</p>
                    </div>
                )}
              </div>
            </div>

            <AnimatePresence>
                {content && (
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="absolute bottom-16 right-16 flex gap-4 z-20"
                    >
                         <button 
                            onClick={copyToClipboard}
                            className={cn(
                              "border p-5 rounded-2xl transition-all shadow-2xl",
                              theme === 'dark' ? "bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-600" : "bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300"
                            )}
                        >
                            <Copy size={20} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
