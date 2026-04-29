import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Briefcase, GraduationCap, Code, Trophy, 
  ChevronRight, Save, Sparkles, AlertCircle, ChevronLeft,
  Plus, Trash2, Wand2, CheckCircle2
} from 'lucide-react';
import { ResumeData, Experience, Education, Project } from '../types';
import { cn } from '../lib/utils';
import { aiService } from '../services/aiService';
import { useFirebase } from './FirebaseProvider';
import { db, handleFirestoreError } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useTheme } from './ThemeProvider';

interface ResumeBuilderProps {
  resumeId: string | null;
  onSaved: () => void;
}

export default function ResumeBuilder({ resumeId, onSaved }: ResumeBuilderProps) {
  const { user } = useFirebase();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = React.useState('personal');
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [loading, setLoading] = React.useState(!!resumeId);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [resumeData, setResumeData] = React.useState<ResumeData>({
    id: resumeId || Math.random().toString(36).substr(2, 9),
    userId: user?.uid || '',
    title: 'Untitled Resume',
    updatedAt: Date.now(),
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    projects: []
  });

  React.useEffect(() => {
    const loadResume = async () => {
      if (!user || !resumeId) return;
      try {
        const docRef = doc(db, 'users', user.uid, 'resumes', resumeId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setResumeData(docSnap.data() as ResumeData);
        }
      } catch (error) {
        console.error("Error loading resume", error);
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, [user, resumeId]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const updatedData = {
        ...resumeData,
        userId: user.uid,
        updatedAt: serverTimestamp()
      };
      const docRef = doc(db, 'users', user.uid, 'resumes', resumeData.id);
      await setDoc(docRef, updatedData);
      onSaved();
    } catch (error) {
      handleFirestoreError(error, 'write', `users/${user.uid}/resumes/${resumeData.id}`);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'projects', label: 'Projects', icon: Trophy },
  ];

  const handleUpdatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getAISuggestions = async () => {
    setIsAnalyzing(true);
    const result = await aiService.getResumeSuggestions(activeTab, resumeData);
    setSuggestions(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-[calc(100vh-160px)]">
      {/* Navigation / Progress */}
      <div className="xl:col-span-3 space-y-6">
        <div className={cn(
          "border rounded-3xl p-6 shadow-xl transition-colors duration-500",
          theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        )}>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-8 px-2">Development Roadmap</h2>
          <nav className="space-y-4">
            {tabs.map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-4 group transition-all p-2 rounded-2xl border",
                  activeTab === tab.id 
                    ? theme === 'dark' ? "bg-slate-800 border-slate-700 shadow-lg text-white" : "bg-slate-50 border-slate-200 shadow-sm text-slate-900"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 border-transparent"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center border transition-all",
                  activeTab === tab.id 
                    ? "bg-blue-600 border-blue-400 rotate-0 shadow-lg shadow-blue-600/30" 
                    : theme === 'dark' ? "bg-slate-950 border-slate-800 -rotate-3 group-hover:rotate-0" : "bg-slate-100 border-slate-200 -rotate-3 group-hover:rotate-0"
                )}>
                  <tab.icon size={18} className={activeTab === tab.id ? "text-white" : "group-hover:text-blue-500 transition-colors"} />
                </div>
                <div className="flex-1 text-left">
                  <p className={cn("text-[8px] font-black uppercase tracking-widest mb-1", activeTab === tab.id ? "text-blue-500" : "text-slate-600 group-hover:text-slate-500")}>Module 0{idx + 1}</p>
                  <p className="text-xs font-bold uppercase tracking-wider">{tab.label}</p>
                </div>
                {activeTab === tab.id && <ChevronRight size={14} className="text-blue-500" />}
              </button>
            ))}
          </nav>

          <div className={cn("mt-12 pt-8 border-t", theme === 'dark' ? "border-slate-800" : "border-slate-100")}>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all text-xs uppercase tracking-widest"
            >
              <Save size={16} strokeWidth={3} />
              <span>{isSaving ? "Syncing..." : "Sync Progress"}</span>
            </button>
          </div>
        </div>
        
        {/* Real-time AI Feedback Mini-widget */}
        <div className={cn(
          "border rounded-3xl p-6 relative overflow-hidden group shadow-inner transition-colors duration-500",
          theme === 'dark' ? "bg-slate-900/50 border-slate-800" : "bg-slate-50/50 border-slate-100"
        )}>
          <div className="flex items-start gap-3 mb-4">
             <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Sparkles className="text-blue-400" size={16} />
             </div>
             <div>
                <h3 className={cn("text-xs font-bold uppercase tracking-widest", theme === 'dark' ? "text-slate-200" : "text-slate-900")}>AI Intelligence</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Analysis</p>
             </div>
          </div>
          <div className={cn(
            "p-4 border rounded-xl mb-4 italic transition-colors duration-500",
            theme === 'dark' ? "bg-slate-950/50 border-slate-800" : "bg-white border-slate-200"
          )}>
            <p className={cn("text-xs leading-relaxed font-medium transition-colors", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
              "Incorporating <strong>strategic deployment</strong> metrics could elevate your technical impact score by 25%."
            </p>
          </div>
          <button 
            onClick={getAISuggestions}
            disabled={isAnalyzing}
            className={cn(
              "w-full py-3 border rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2",
              theme === 'dark' ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-500"
            )}
          >
            {isAnalyzing ? "Processing..." : "Refresh Engine"}
          </button>
        </div>
      </div>

      {/* Form / Editor Area */}
      <div className="xl:col-span-4 max-h-[calc(100vh-160px)] overflow-y-auto pr-4 scrollbar-hide">
        <AnimatePresence mode="wait">
          {activeTab === 'personal' && (
            <motion.div
              key="personal"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Resume Workspace</h3>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">● Core Identity Module</p>
                </div>
                <div className="px-3 py-1.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                  Ready for Sync
                </div>
              </div>

              <div className="space-y-6">
                <InputField 
                    label="Project ID / Version Name" 
                    value={resumeData.title} 
                    onChange={v => setResumeData(prev => ({ ...prev, title: v }))} 
                    placeholder="e.g. Senior_Engineer_V2.pdf"
                />
                <InputField 
                    label="Full Name" 
                    value={resumeData.personalInfo.fullName} 
                    onChange={v => handleUpdatePersonalInfo('fullName', v)} 
                    placeholder="Enter your full name"
                />
                <div className="grid grid-cols-2 gap-4">
                    <InputField 
                        label="Email Address" 
                        value={resumeData.personalInfo.email} 
                        onChange={v => handleUpdatePersonalInfo('email', v)} 
                        placeholder="kiran@astra.ai"
                    />
                    <InputField 
                        label="Phone Number" 
                        value={resumeData.personalInfo.phone} 
                        onChange={v => handleUpdatePersonalInfo('phone', v)} 
                        placeholder="+1 (555) 000-0000"
                    />
                </div>
                <InputField 
                    label="Location" 
                    value={resumeData.personalInfo.location} 
                    onChange={v => handleUpdatePersonalInfo('location', v)} 
                    placeholder="City, State / Remote"
                />
                <InputField 
                    label="LinkedIn Profile URL" 
                    value={resumeData.personalInfo.linkedin} 
                    onChange={v => handleUpdatePersonalInfo('linkedin', v)} 
                    placeholder="linkedin.com/in/username"
                />
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-2">Professional Narrative</label>
                    <textarea 
                        value={resumeData.personalInfo.summary}
                        onChange={e => handleUpdatePersonalInfo('summary', e.target.value)}
                        placeholder="Distill your professional essence into a high-impact narrative..."
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-5 text-sm min-h-[160px] focus:outline-none focus:border-blue-500/30 transition-all resize-none font-medium placeholder:text-slate-600"
                    />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'experience' && (
            <motion.div
              key="experience"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Experience Grid</h3>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">● Professional Journey Timeline</p>
                </div>
                <button 
                  onClick={() => {
                    const newExp: Experience = {
                        id: Math.random().toString(36).substr(2, 9),
                        company: '',
                        role: '',
                        location: '',
                        startDate: '',
                        endDate: '',
                        current: false,
                        achievements: ['']
                    };
                    setResumeData(prev => ({ ...prev, experience: [newExp, ...prev.experience] }));
                  }}
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center font-bold"
                >
                    <Plus size={20} strokeWidth={3} />
                </button>
              </div>

              <div className="space-y-8">
                {resumeData.experience.map((exp, idx) => (
                  <div key={exp.id} className={cn(
                    "relative border rounded-3xl p-8 group shadow-xl transition-colors duration-500",
                    theme === 'dark' ? "bg-slate-900 border-slate-800 shadow-black/20" : "bg-white border-slate-200 shadow-slate-200/50"
                  )}>
                    <button 
                      onClick={() => {
                        setResumeData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== exp.id) }));
                      }}
                      className="absolute top-6 right-6 p-2 text-slate-500 hover:text-red-500 transition-all"
                    >
                        <Trash2 size={16} />
                    </button>
                    
                    <div className="space-y-6">
                        <input 
                            placeholder="Role Title (e.g. Lead Technical Architect)" 
                            className={cn(
                              "bg-transparent text-2xl font-bold w-full focus:outline-none tracking-tight transition-colors duration-500",
                              theme === 'dark' ? "text-white placeholder:text-slate-800" : "text-slate-900 placeholder:text-slate-200"
                            )}
                            value={exp.role}
                            onChange={e => {
                                const newExp = [...resumeData.experience];
                                newExp[idx].role = e.target.value;
                                setResumeData(prev => ({ ...prev, experience: newExp }));
                            }}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input 
                                placeholder="Organization" 
                                className={cn(
                                  "border px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-widest transition-colors duration-500",
                                  theme === 'dark' ? "bg-slate-950/50 border-slate-800 text-slate-300 placeholder:text-slate-800" : "bg-slate-50 border-slate-200 text-slate-600 placeholder:text-slate-300"
                                )}
                                value={exp.company}
                                onChange={e => {
                                    const newExp = [...resumeData.experience];
                                    newExp[idx].company = e.target.value;
                                    setResumeData(prev => ({ ...prev, experience: newExp }));
                                }}
                            />
                             <input 
                                placeholder="Location" 
                                className={cn(
                                  "border px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-widest transition-colors duration-500",
                                  theme === 'dark' ? "bg-slate-950/50 border-slate-800 text-slate-300 placeholder:text-slate-800" : "bg-slate-50 border-slate-200 text-slate-600 placeholder:text-slate-300"
                                )}
                                value={exp.location}
                                onChange={e => {
                                    const newExp = [...resumeData.experience];
                                    newExp[idx].location = e.target.value;
                                    setResumeData(prev => ({ ...prev, experience: newExp }));
                                }}
                            />
                        </div>

                        <div className="space-y-4 pt-4">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Strategic Impact & Achievements</h4>
                            {exp.achievements.map((ach, aidx) => (
                                <div key={aidx} className={cn(
                                  "flex gap-4 p-4 border rounded-2xl relative group/ach transition-colors duration-500",
                                  theme === 'dark' ? "bg-slate-950/30 border-slate-800" : "bg-slate-50/50 border-slate-100"
                                )}>
                                    <div className="w-1.5 h-full bg-blue-500/20 absolute left-0 top-0 rounded-l-2xl group-hover/ach:bg-blue-500 transition-colors" />
                                    <textarea 
                                        value={ach}
                                        onChange={e => {
                                            const newExp = [...resumeData.experience];
                                            newExp[idx].achievements[aidx] = e.target.value;
                                            setResumeData(prev => ({ ...prev, experience: newExp }));
                                        }}
                                        className={cn(
                                          "flex-1 bg-transparent text-xs min-h-[50px] resize-none focus:outline-none transition-colors",
                                          theme === 'dark' ? "text-slate-300 placeholder:text-slate-800" : "text-slate-600 placeholder:text-slate-300"
                                        )}
                                        placeholder="Start with a strong action verb (e.g. Orchestrated, Optimized, Architected)..."
                                    />
                                    <button 
                                        onClick={() => {
                                            const newExp = [...resumeData.experience];
                                            newExp[idx].achievements = newExp[idx].achievements.filter((_, i) => i !== aidx);
                                            setResumeData(prev => ({ ...prev, experience: newExp }));
                                        }}
                                        className="p-2 text-slate-500 hover:text-red-500 transition-colors self-start"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                            <button 
                                onClick={() => {
                                    const newExp = [...resumeData.experience];
                                    newExp[idx].achievements.push('');
                                    setResumeData(prev => ({ ...prev, experience: newExp }));
                                }}
                                className="flex items-center gap-2 text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors px-2"
                            >
                                <Plus size={12} />
                                <span>Inject Achievement</span>
                            </button>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'skills' && (
             <motion.div
                key="skills"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="space-y-1">
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Technical Arsenal</h3>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">● Skill Inventory Module</p>
                </div>
                
                <div className="flex gap-4">
                    <input 
                        id="skill-input"
                        placeholder="Add a high-impact skill (e.g. AWS Lambda, System Design)" 
                        className={cn(
                          "flex-1 border rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-blue-500/30 font-medium transition-all duration-500",
                          theme === 'dark' ? "bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-700" : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-300"
                        )}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                const val = (e.target as HTMLInputElement).value;
                                if (val) {
                                    setResumeData(prev => ({ ...prev, skills: [...prev.skills, val] }));
                                    (e.target as HTMLInputElement).value = '';
                                }
                            }
                        }}
                    />
                    <button className={cn(
                      "border px-8 rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
                      theme === 'dark' ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50"
                    )}>Add</button>
                </div>

                <div className="flex flex-wrap gap-3">
                    {resumeData.skills.length === 0 && (
                        <div className={cn(
                          "flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl w-full gap-4 transition-colors duration-500",
                          theme === 'dark' ? "border-slate-800 bg-slate-900/10" : "border-slate-100 bg-slate-50/50"
                        )}>
                            <Code className={theme === 'dark' ? "text-slate-800" : "text-slate-200"} size={40} />
                            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">No Inventory Items</p>
                        </div>
                    )}
                    {resumeData.skills.map((skill, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={cn(
                              "border px-5 py-2.5 rounded-xl flex items-center gap-4 group/skill shadow-sm transition-all",
                              theme === 'dark' ? "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 shadow-slate-100"
                            )}
                        >
                            <span className="text-[11px] font-bold uppercase tracking-widest">{skill}</span>
                            <button 
                                onClick={() => setResumeData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }))}
                                className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <Plus className="rotate-45" size={14} />
                            </button>
                        </motion.div>
                    ))}
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Live Preview Area */}
      <div className="xl:col-span-5 h-[calc(100vh-160px)] flex flex-col gap-6">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
             Real-Time Virtualization
           </h3>
           <div className="flex gap-3">
             <button className={cn(
               "p-2.5 border rounded-xl transition-all",
               theme === 'dark' ? "bg-slate-900 border-slate-800 text-slate-500 hover:bg-slate-800" : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
             )}>
                <ChevronLeft size={16} />
             </button>
             <button className={cn(
               "p-2.5 border rounded-xl transition-all",
               theme === 'dark' ? "bg-slate-900 border-slate-800 text-slate-500 hover:bg-slate-800" : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
             )}>
                <ChevronRight size={16} />
             </button>
           </div>
        </div>

        <div className={cn(
          "border border-b-0 p-8 pt-10 shadow-2xl rounded-t-[3rem] overflow-hidden flex flex-col relative transition-colors duration-500",
          theme === 'dark' ? "bg-slate-900/30 border-slate-800 shadow-black/40" : "bg-slate-50 border-slate-100 shadow-slate-200/50"
        )}>
           <div className={cn(
             "absolute inset-0 backdrop-blur-[2px] pointer-events-none transition-colors",
             theme === 'dark' ? "bg-slate-950/20" : "bg-slate-200/10"
           )} />
           <div className="flex-1 bg-white text-slate-950 p-12 pr-10 shadow-2xl rounded-t-xl overflow-y-auto scrollbar-hide origin-top z-10 border border-neutral-100">
           <div className="max-w-2xl mx-auto space-y-10">
              <div className="border-b-2 border-black pb-8 space-y-2">
                <h1 className="text-4xl font-extrabold uppercase tracking-tighter">
                  {resumeData.personalInfo.fullName || "Your Name"}
                </h1>
                <div className="flex flex-wrap gap-x-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                  <span>{resumeData.personalInfo.email || "Email"}</span>
                  <span className="text-neutral-300">•</span>
                  <span>{resumeData.personalInfo.phone || "Phone"}</span>
                  <span className="text-neutral-300">•</span>
                  <span>{resumeData.personalInfo.location || "Location"}</span>
                </div>
              </div>

              {resumeData.personalInfo.summary && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest border-b border-neutral-200 pb-2">Profile</h4>
                  <p className="text-sm leading-relaxed font-medium text-neutral-700">
                    {resumeData.personalInfo.summary}
                  </p>
                </div>
              )}

              {resumeData.experience.length > 0 && (
                <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-widest border-b border-neutral-200 pb-2">Professional Experience</h4>
                  {resumeData.experience.map((exp) => (
                    <div key={exp.id} className="space-y-2">
                      <div className="flex justify-between items-baseline">
                        <h5 className="font-bold text-lg">{exp.role || "Job Role"}</h5>
                        <span className="text-[10px] font-bold text-neutral-400">2021 — PRESENT</span>
                      </div>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">{exp.company || "Company Name"}</p>
                      <ul className="space-y-1.5 pt-2">
                        {exp.achievements.map((ach, idx) => (
                          <li key={idx} className="text-xs leading-relaxed text-neutral-600 flex gap-3">
                            <span className="text-blue-500 font-bold">•</span>
                            <span>{ach || "Dynamic accomplishment with quantified impact..."}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {resumeData.skills.length > 0 && (
                <div className="space-y-4">
                   <h4 className="text-xs font-black uppercase tracking-widest border-b border-neutral-200 pb-2">Technical Arsenal</h4>
                   <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest">
                     {resumeData.skills.map((skill, idx) => (
                       <span key={idx} className="bg-neutral-100 px-3 py-1.5 rounded-full">{skill}</span>
                     ))}
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* AI Assistant Floating Suggestion Panel */}
        <AnimatePresence>
            {suggestions.length > 0 && (
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-20"
                >
                    <div className="bg-slate-950 border border-blue-500/50 rounded-[2.5rem] p-8 shadow-[0_-20px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <Wand2 className="text-blue-400" size={16} />
                                </div>
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Strategic Optimizer</h4>
                            </div>
                            <button onClick={() => setSuggestions([])} className="text-slate-600 hover:text-white transition-colors">
                                <Plus className="rotate-45" size={24} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {suggestions.map((s, i) => (
                                <div key={i} className="flex gap-4 text-xs leading-relaxed text-slate-300 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                                    <CheckCircle2 className="text-blue-500 shrink-0" size={16} />
                                    <span className="font-medium">{s}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder: string }) {
    const { theme } = useTheme();
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">{label}</label>
            <input 
                type="text" 
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className={cn(
                  "w-full border rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-blue-500/30 transition-all font-medium duration-500",
                  theme === 'dark' ? "bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-700" : "bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-300"
                )}
            />
        </div>
    );
}
