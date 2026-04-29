import React from 'react';
import { motion } from 'motion/react';
import { Target, Search, CheckCircle2, AlertCircle, Sparkles, BarChart3, Zap } from 'lucide-react';
import { AnalysisResult } from '../types';
import { aiService } from '../services/aiService';
import { cn } from '../lib/utils';
import { useTheme } from './ThemeProvider';

import { useFirebase } from './FirebaseProvider';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export default function JobAnalyzer() {
  const { user } = useFirebase();
  const { theme } = useTheme();
  const [jd, setJd] = React.useState('');
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [result, setResult] = React.useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!jd || !user) return;
    setIsAnalyzing(true);
    
    try {
      // Try to fetch the latest resume
      const q = query(
        collection(db, 'users', user.uid, 'resumes'),
        orderBy('updatedAt', 'desc'),
        limit(1)
      );
      const snapshot = await getDocs(q);
      
      let resumeData: any = null;
      if (!snapshot.empty) {
        resumeData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
      } else {
        // Fallback to minimal data if no resume exists
        resumeData = {
          personalInfo: { fullName: user.displayName || 'Kiran Kiran bv', summary: '' },
          experience: [],
          skills: [],
          projects: []
        };
      }

      const analysisResult = await aiService.analyzeMatch(resumeData, jd);
      setResult(analysisResult);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-12 mb-20">
      <section className="max-w-4xl">
        <div className="space-y-4">
          <h2 className={cn("text-5xl font-extrabold tracking-tight mb-2", theme === 'dark' ? "text-white" : "text-slate-900")}>Job <span className="text-blue-500">Scanner</span></h2>
          <p className="text-slate-500 font-semibold text-xs uppercase tracking-[0.2em]">High-precision ATS compatibility and alignment testing.</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Pane */}
        <div className="lg:col-span-12">
            <div className={cn(
              "border rounded-[3rem] p-10 space-y-8 relative overflow-hidden shadow-2xl transition-colors duration-500",
              theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            )}>
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-slate-500">
                    <Target size={200} />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-2">Target Job Description</label>
                    <textarea 
                        value={jd}
                        onChange={e => setJd(e.target.value)}
                        placeholder="Paste the target job description here to initiate technical alignment analysis..."
                        className={cn(
                          "w-full border rounded-3xl p-8 text-sm min-h-[250px] focus:outline-none focus:border-blue-500/30 transition-all resize-none leading-relaxed font-medium",
                          theme === 'dark' ? "bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-300"
                        )}
                    />
                </div>
                <button 
                   onClick={handleAnalyze}
                   disabled={isAnalyzing || !jd}
                   className="group relative w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-[2rem] font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-xl shadow-blue-600/20 text-xs uppercase tracking-widest"
                >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                    {isAnalyzing ? (
                        <>
                            <Zap className="animate-spin" size={16} />
                            <span>Calibrating Engine...</span>
                        </>
                    ) : (
                        <>
                            <Target size={16} strokeWidth={3} />
                            <span>Execute Deep Alignment Analysis</span>
                        </>
                    )}
                </button>
            </div>
        </div>

        {/* Results Pane */}
        {result && (
          <motion.div 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Main Score Card */}
            <div className={cn(
              "md:col-span-1 border rounded-[3rem] p-10 flex flex-col justify-center items-center gap-8 relative overflow-hidden group shadow-2xl transition-colors duration-500",
              theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            )}>
                 <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
                 <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Alignment Quotient</h3>
                 <div className="relative">
                    <svg className="w-48 h-48 transform -rotate-90">
                        <circle
                            cx="96" cy="96" r="88"
                            className={theme === 'dark' ? "stroke-slate-950 fill-none" : "stroke-slate-100 fill-none"}
                            strokeWidth="10"
                        />
                        <motion.circle
                            initial={{ strokeDasharray: "0, 553" }}
                            animate={{ strokeDasharray: `${(result.score / 100) * 553}, 553` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            cx="96" cy="96" r="88"
                            className="stroke-blue-500 fill-none shadow-lg"
                            strokeWidth="10"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={cn("text-6xl font-black", theme === 'dark' ? "text-white" : "text-slate-900")}>{result.score}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Score</span>
                    </div>
                 </div>
                 <div className="text-center space-y-2">
                    <p className={cn("text-xs font-bold uppercase tracking-widest", theme === 'dark' ? "text-white" : "text-slate-900")}>Highly Compatible</p>
                    <p className="text-[11px] text-slate-500 font-medium px-4 leading-relaxed">
                        Top 5% alignment for Senior Engineering roles at Tier-1 tech organizations.
                    </p>
                 </div>
            </div>

            {/* Keyword Analysis */}
            <div className={cn(
              "md:col-span-2 border rounded-[3rem] p-10 space-y-10 shadow-2xl transition-colors duration-500",
              theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            )}>
                 <div className="grid grid-cols-2 gap-12">
                     <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                             <CheckCircle2 size={12} className="text-green-400" />
                           </div>
                           <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Keyword Hits</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {result.keywordMatch.map(k => (
                               <span key={k} className={cn(
                                 "px-3 py-1.5 border rounded text-[10px] font-bold uppercase tracking-widest transition-colors duration-500",
                                 theme === 'dark' ? "bg-slate-950/50 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-100 text-slate-600"
                               )}>{k}</span>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                             <AlertCircle size={12} className="text-red-400" />
                           </div>
                           <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Critical Gaps</h4>
                        </div>
                        <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest">
                           {result.missingKeywords.map(k => (
                               <span key={k} className={cn(
                                 "px-3 py-1.5 border text-red-500/80 rounded underline decoration-red-500/30 underline-offset-4 transition-colors duration-500",
                                 theme === 'dark' ? "bg-slate-950/50 border-slate-800" : "bg-red-50/30 border-red-100"
                               )}>{k}</span>
                           ))}
                        </div>
                     </div>
                 </div>

                 <div className={cn("pt-10 border-t transition-colors duration-500", theme === 'dark' ? "border-slate-800" : "border-slate-100")}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                           <Sparkles size={12} className="text-blue-400" />
                        </div>
                        <h4 className={cn("text-[10px] font-bold uppercase tracking-widest", theme === 'dark' ? "text-white" : "text-slate-900")}>Strategic Mitigation Modules</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.suggestions.map((s, i) => (
                            <div key={i} className={cn(
                              "p-5 border rounded-2xl flex gap-4 transition-all duration-500",
                              theme === 'dark' ? "bg-slate-950/50 border-slate-800 hover:bg-slate-950" : "bg-slate-50 border-slate-100 hover:bg-slate-100/50"
                            )}>
                                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest pt-0.5">0{i+1}</div>
                                <p className={cn(
                                  "text-[11px] leading-relaxed font-semibold",
                                  theme === 'dark' ? "text-slate-400" : "text-slate-600"
                                )}>{s}</p>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
