import React from 'react';
import { motion } from 'motion/react';
import { Plus, FileText, MoreVertical, Calendar, Download, Eye, ExternalLink } from 'lucide-react';
import { ResumeData } from '../types';
import { pdfService } from '../services/pdfService';
import { useFirebase } from './FirebaseProvider';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useTheme } from './ThemeProvider';
import { cn } from '../lib/utils';

interface DashboardProps {
  onEdit: (id: string) => void;
  onNew: () => void;
}

export default function Dashboard({ onEdit, onNew }: DashboardProps) {
  const { user } = useFirebase();
  const { theme } = useTheme();
  const [resumes, setResumes] = React.useState<ResumeData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'users', user.uid, 'resumes'),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ResumeData));
      setResumes(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={cn("text-5xl font-extrabold tracking-tight mb-2", theme === 'dark' ? "text-white" : "text-slate-900")}
            >
              Your <span className="text-blue-500">Resumes</span>
            </motion.h2>
            <p className="text-slate-500 font-semibold text-xs uppercase tracking-[0.2em]">Manage and optimize with professional precision.</p>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNew}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Plus size={20} strokeWidth={3} />
            <span>New Resume Version</span>
          </motion.button>
        </div>
      </section>

      {/* Resumes Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resumes.map((resume, idx) => (
          <ResumeCard key={resume.id} resume={resume} delay={idx * 0.1} onEdit={() => onEdit(resume.id)} />
        ))}
        
        {/* Placeholder for Empty State */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          onClick={onNew}
          className={cn(
            "border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all group cursor-pointer h-[320px]",
            theme === 'dark' ? "border-slate-800 bg-slate-900/20 hover:border-slate-700" : "border-slate-200 bg-slate-100/50 hover:border-slate-300"
          )}
        >
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-colors border",
            theme === 'dark' ? "bg-slate-900 border-slate-800 group-hover:bg-slate-800" : "bg-white border-slate-200 group-hover:bg-slate-50"
          )}>
            <Plus className="text-slate-500 group-hover:text-blue-500 transition-colors" size={32} />
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] group-hover:text-slate-700 transition-colors">Start New Project</p>
        </motion.div>
      </section>

      {/* Tips & Coaching Banner */}
      <section>
        <div className={cn(
          "border rounded-3xl p-8 relative overflow-hidden group shadow-2xl transition-colors duration-500",
          theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        )}>
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
             <FileText size={120} />
          </div>
          <div className="max-w-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Expert Insight</h3>
            <p className={cn(
              "text-lg font-medium leading-relaxed italic transition-colors duration-500",
              theme === 'dark' ? "text-slate-300" : "text-slate-600"
            )}>
              "Quantify your impact. Instead of saying 'Managed a team', lead with: 'Architected scalable systems that reduced latency by 45%'."
            </p>
            <button className="flex items-center gap-2 text-blue-500 font-bold hover:gap-3 transition-all text-sm">
              <span>View Strategic Library</span>
              <ExternalLink size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ResumeCard({ resume, delay, onEdit }: { resume: ResumeData, delay: number, onEdit: () => void }) {
  const { theme } = useTheme();
  const handleExport = () => {
    pdfService.exportToPDF(resume);
  };

  const updatedAt = resume.updatedAt?.seconds 
    ? new Date(resume.updatedAt.seconds * 1000) 
    : (resume.updatedAt ? new Date(resume.updatedAt) : new Date());

  return (
    <motion.div 
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      whileHover={{ y: -8 }}
      onClick={onEdit}
      className={cn(
        "group relative border rounded-3xl h-[320px] overflow-hidden flex flex-col cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500",
        theme === 'dark' ? "bg-slate-900 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:border-slate-300"
      )}
    >
      <div className="p-6 flex-1 space-y-6">
        <div className="flex items-start justify-between">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors border",
            theme === 'dark' ? "bg-slate-800 border-slate-700 group-hover:bg-blue-600/20" : "bg-slate-50 border-slate-200 group-hover:bg-blue-50"
          )}>
            <FileText className={theme === 'dark' ? "text-slate-400 group-hover:text-blue-400" : "text-slate-600 group-hover:text-blue-500"} size={24} />
          </div>
          <button className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>

        <div className="space-y-1">
          <h3 className={cn("text-xl font-bold tracking-tight", theme === 'dark' ? "text-white" : "text-slate-900")}>{resume.title}</h3>
          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            <Calendar size={12} />
            <span>Updated {updatedAt.toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {resume.skills.slice(0, 3).map(skill => (
            <span key={skill} className={cn(
              "px-2.5 py-1 border rounded-lg text-[10px] font-bold uppercase tracking-widest",
              theme === 'dark' ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"
            )}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className={cn(
        "p-4 backdrop-blur-sm border-t flex items-center gap-3",
        theme === 'dark' ? "bg-slate-900/50 border-slate-800" : "bg-slate-50/80 border-slate-200"
      )}>
        <button className={cn(
          "flex-1 border py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2",
          theme === 'dark' ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
        )}>
          <Eye size={14} />
          <span>Review</span>
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleExport(); }}
          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
        >
          <Download size={14} />
          <span>Export</span>
        </button>
      </div>

      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/0 via-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}

