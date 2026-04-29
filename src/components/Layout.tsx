import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LayoutDashboard, FileText, Target, BrainCircuit, LogOut, Search, Mail, Sun, Moon, Menu, X, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { useFirebase } from './FirebaseProvider';
import { useTheme } from './ThemeProvider';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const { user, logout } = useFirebase();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  React.useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) setIsSidebarOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'builder', icon: FileText, label: 'Resume Builder' },
    { id: 'analyzer', icon: Target, label: 'Job Analyzer' },
    { id: 'letter', icon: Mail, label: 'Cover Letter' },
    { id: 'coach', icon: BrainCircuit, label: 'AI Career Coach' },
    { id: 'profile', icon: User, label: 'My Profile' },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setIsSidebarOpen(false);
  };

  return (
    <div className={cn(
      "min-h-screen flex overflow-hidden selection:bg-blue-500/30 transition-colors duration-500",
      theme === 'dark' ? "bg-slate-950 text-slate-200" : "bg-slate-50 text-slate-900"
    )}>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          x: isDesktop || isSidebarOpen ? 0 : -300,
          opacity: 1
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={cn(
          "fixed lg:relative inset-y-0 left-0 w-72 border-r flex flex-col z-40 transition-colors duration-500",
          theme === 'dark' ? "border-slate-800 bg-slate-950/95 lg:bg-slate-950/50 backdrop-blur-xl" : "border-slate-200 bg-white"
        )}
      >
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="font-bold text-white text-lg">A</span>
            </div>
            <h1 className={cn("font-bold text-xl tracking-tight", theme === 'dark' ? "text-white" : "text-slate-900")}>
              ASTRA<span className="text-blue-500">AI</span>
            </h1>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-4 mb-4">
            Navigation
          </div>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 border",
                activeTab === tab.id 
                  ? theme === 'dark' ? "bg-slate-800 border-slate-700 text-white shadow-lg shadow-black/20" : "bg-slate-100 border-slate-200 text-slate-900 shadow-sm"
                  : theme === 'dark' ? "text-slate-500 hover:text-slate-200 hover:bg-slate-900 border-transparent" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50 border-transparent"
              )}
            >
              <tab.icon size={20} className={activeTab === tab.id ? "text-blue-500" : ""} />
              <span className="font-semibold text-xs tracking-tight">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabBadge"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" 
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className={cn(
            "border rounded-2xl p-5 shadow-xl overflow-hidden relative group transition-colors duration-500",
            theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          )}>
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <BrainCircuit size={40} />
            </div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Status</h3>
            <p className={cn("text-xs font-bold", theme === 'dark' ? "text-blue-400" : "text-blue-600")}>Spark Plan</p>
            <div className="mt-3 flex items-center gap-2">
              <div className={cn("h-1.5 rounded-full flex-1 overflow-hidden", theme === 'dark' ? "bg-slate-800" : "bg-slate-100")}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '45%' }}
                  className="h-full bg-blue-500 rounded-full" 
                />
              </div>
              <span className="text-[10px] font-mono text-slate-500 font-bold">45%</span>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-4 text-slate-500 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all font-bold text-xs uppercase tracking-widest"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto scrollbar-hide">
        <div className={cn(
          "sticky top-0 z-10 px-4 md:px-8 py-4 backdrop-blur-md flex items-center justify-between border-b transition-colors duration-500",
          theme === 'dark' ? "bg-slate-950/70 border-slate-800" : "bg-white/70 border-slate-200 shadow-sm shadow-slate-100"
        )}>
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className={cn(
                "p-2 rounded-lg border lg:hidden",
                theme === 'dark' ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-100 text-slate-500"
              )}
            >
              <Menu size={20} />
            </button>
            <div className="relative group max-w-md w-full hidden sm:block">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search resumes..." 
                className={cn(
                  "w-full border py-2 pl-10 pr-4 rounded-xl text-[10px] md:text-xs font-medium focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600",
                  theme === 'dark' ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-900"
                )}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <button 
              onClick={toggleTheme}
              className={cn(
                "p-2 md:p-2.5 rounded-xl border transition-all",
                theme === 'dark' ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-blue-400" : "bg-slate-50 border-slate-100 text-slate-500 hover:text-blue-600"
              )}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="flex items-center gap-2 md:gap-3">
              <div className="text-right hidden xs:block">
                <p className={cn("text-[10px] md:text-sm font-bold leading-none", theme === 'dark' ? "text-white" : "text-slate-900")}>
                  {user?.displayName || 'Kiran Kiran bv'}
                </p>
                <p className="text-[8px] md:text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Premium Member</p>
              </div>
              <div 
                onClick={() => handleTabChange('profile')}
                className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-px shadow-lg shadow-blue-500/10 hover:scale-105 transition-transform cursor-pointer"
              >
                <div className={cn(
                  "w-full h-full rounded-[10px] flex items-center justify-center overflow-hidden",
                  theme === 'dark' ? "bg-slate-900" : "bg-white"
                )}>
                   <img src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'Kiran'}`} alt="profile" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8 max-w-7xl mx-auto relative z-10">
          {children}
        </div>
      </main>

      {/* Decorative Atmosphere */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className={cn(
          "absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-colors duration-1000",
          theme === 'dark' ? "bg-blue-600/10" : "bg-blue-200/20"
        )} />
        <div className={cn(
          "absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-colors duration-1000",
          theme === 'dark' ? "bg-indigo-600/10" : "bg-indigo-200/20"
        )} />
        <div className={cn(
          "absolute top-[20%] right-[10%] w-[20%] h-[20%] rounded-full blur-[100px] transition-colors duration-1000",
          theme === 'dark' ? "bg-blue-400/5" : "bg-blue-100/15"
        )} />
      </div>
    </div>
  );
}
