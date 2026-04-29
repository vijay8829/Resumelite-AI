import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { User, Shield, CreditCard, Bell, MapPin, Briefcase, Globe, Mail, Phone, Calendar, X, Save, Loader2, Edit3, Target as TargetIcon } from 'lucide-react';
import { useFirebase } from './FirebaseProvider';
import { useTheme } from './ThemeProvider';
import { cn } from '../lib/utils';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from '../lib/firebase';

interface ProfileData {
  phone: string;
  targetRole: string;
  industries: string;
  location: string;
  marketTier: string;
}

export default function Profile() {
  const { user } = useFirebase();
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [profileData, setProfileData] = React.useState<ProfileData>({
    phone: '+1 (555) 000-0000',
    targetRole: 'CTO / VP Engineering',
    industries: 'AI, FinTech, Web3',
    location: 'Global / Remote',
    marketTier: 'Global Fortune 500',
  });
  const [displayName, setDisplayName] = React.useState(user?.displayName || 'Kiran Kiran bv');

  // Load profile data from Firestore
  React.useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      try {
        const docRef = doc(db, 'userProfiles', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data() as ProfileData);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    }
    loadProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);
    try {
      // Update Firebase Auth Display Name
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }

      // Update Firestore Profile Data
      await setDoc(doc(db, 'userProfiles', user.uid), {
        ...profileData,
        displayName,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const userDisplayName = user?.displayName || 'Kiran Kiran bv';
  const userEmail = user?.email || 'kiran.bv@elite-sync.ai';

  const stats = [
    { label: 'Neural Sync', value: '98.4%', icon: Globe },
    { label: 'Career Alignment', value: 'Tier 1', icon: TargetIcon },
    { label: 'Architecture Ready', value: 'Verified', icon: Shield },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Profile Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "relative overflow-hidden rounded-[2.5rem] border p-8 md:p-12",
          theme === 'dark' ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-xl shadow-slate-200/50"
        )}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-gradient-to-br from-blue-500 to-indigo-600 p-1 shadow-2xl shadow-blue-500/20">
              <div className={cn(
                "w-full h-full rounded-[1.8rem] overflow-hidden",
                theme === 'dark' ? "bg-slate-950" : "bg-white"
              )}>
                <img 
                  src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'Kiran'}`} 
                  alt="profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg border-4 border-slate-900">
              <Shield size={16} />
            </div>
          </div>

          <div className="text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold uppercase tracking-widest">
              <Shield size={12} />
              Premium Member
            </div>
            <h1 className={cn("text-3xl md:text-5xl font-black tracking-tight", theme === 'dark' ? "text-white" : "text-slate-900")}>
              {user?.displayName || displayName}
            </h1>
            <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
              <Mail size={16} className="text-blue-500" />
              {userEmail}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <MapPin size={14} />
                {profileData.location}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <Briefcase size={14} />
                {profileData.targetRole}
              </div>
            </div>
          </div>

          <div className="md:ml-auto w-full md:w-auto grid grid-cols-1 sm:grid-cols-3 md:flex md:flex-col gap-4">
            {stats.map((stat, i) => (
              <div key={i} className={cn(
                "p-4 rounded-2xl border text-center md:text-left transition-all hover:scale-105",
                theme === 'dark' ? "bg-slate-950/50 border-slate-800" : "bg-slate-50 border-slate-100"
              )}>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <stat.icon size={12} className="text-blue-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</span>
                </div>
                <p className={cn("text-lg font-black", theme === 'dark' ? "text-white" : "text-slate-900")}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Identity & Settings */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "md:col-span-1 rounded-[2.5rem] border p-8 space-y-8",
            theme === 'dark' ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-xl shadow-slate-200/50"
          )}
        >
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-500">Account Ecosystem</h3>
            <div className="space-y-2">
              {[
                { label: 'Subscription', value: 'Elite Yearly', icon: CreditCard },
                { label: 'Neural Alerts', value: 'High Priority', icon: Bell },
                { label: 'Global Visibility', value: 'Encrypted', icon: Globe },
                { label: 'Join Date', value: 'April 2026', icon: Calendar },
                { label: 'Phone', value: profileData.phone, icon: Phone },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                  <div className="flex items-center gap-3">
                    <item.icon size={16} className="text-slate-500 group-hover:text-blue-500 transition-colors" />
                    <span className="text-xs font-bold text-slate-500">{item.label}</span>
                  </div>
                  <span className={cn("text-xs font-black", theme === 'dark' ? "text-slate-200" : "text-slate-900")}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: theme === 'dark' ? '#3b82f6' : '#2563eb' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setIsEditing(true);
            }}
            className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3"
          >
            <Edit3 size={16} />
            <span>Edit Neural Profile</span>
          </motion.button>
        </motion.div>

        {/* Career Trajectory */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "md:col-span-2 rounded-[2.5rem] border p-8 space-y-8 relative overflow-hidden",
            theme === 'dark' ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-xl shadow-slate-200/50"
          )}
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] -mr-32 -mt-32" />
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-indigo-500">Current Synchronization</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Sync</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Target Role', value: profileData.targetRole, color: 'blue' },
                { title: 'Industries', value: profileData.industries, color: 'indigo' },
                { title: 'Salary Delta', value: '+45% Projected', color: 'emerald' },
                { title: 'Market Tier', value: profileData.marketTier, color: 'cyan' },
              ].map((pill, i) => (
                <div key={i} className={cn(
                  "p-6 rounded-3xl border transition-all hover:scale-[1.02]",
                  theme === 'dark' ? "bg-slate-950/50 border-slate-800" : "bg-slate-50 border-slate-100"
                )}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">{pill.title}</p>
                  <p className={cn("text-lg font-black", theme === 'dark' ? "text-white" : "text-slate-900")}>{pill.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500">Trajectory Progress</span>
                <span className="text-xs font-black text-blue-500">82% Optimization</span>
              </div>
              <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden p-1">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '82%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                />
              </div>
              <p className="text-[10px] text-slate-500 font-medium italic">
                * Based on current market volatility and neural alignment with elite institutions.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={cn(
                "relative w-full max-w-xl rounded-[2.5rem] border p-8 md:p-12 shadow-2xl overflow-hidden",
                theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
              )}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
              
              <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className={cn("text-2xl font-black italic tracking-tighter", theme === 'dark' ? "text-white" : "text-slate-900")}>
                      IDENTITY MODIFICATION
                    </h2>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Neural Override Active</p>
                  </div>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="p-3 rounded-xl hover:bg-white/10 transition-colors text-slate-500"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Full Identity Name</label>
                      <input 
                        type="text" 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className={cn(
                          "w-full px-5 py-4 rounded-2xl border text-sm font-bold focus:outline-none focus:border-blue-500 transition-all",
                          theme === 'dark' ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Neural Contact (Phone)</label>
                      <input 
                        type="text" 
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        className={cn(
                          "w-full px-5 py-4 rounded-2xl border text-sm font-bold focus:outline-none focus:border-blue-500 transition-all",
                          theme === 'dark' ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Target Trajectory (Role)</label>
                      <input 
                        type="text" 
                        value={profileData.targetRole}
                        onChange={(e) => setProfileData(prev => ({ ...prev, targetRole: e.target.value }))}
                        className={cn(
                          "w-full px-5 py-4 rounded-2xl border text-sm font-bold focus:outline-none focus:border-blue-500 transition-all",
                          theme === 'dark' ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Global Displacement (Location)</label>
                      <input 
                        type="text" 
                        value={profileData.location}
                        onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                        className={cn(
                          "w-full px-5 py-4 rounded-2xl border text-sm font-bold focus:outline-none focus:border-blue-500 transition-all",
                          theme === 'dark' ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                        )}
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Sector Alignment (Industries)</label>
                      <input 
                        type="text" 
                        value={profileData.industries}
                        onChange={(e) => setProfileData(prev => ({ ...prev, industries: e.target.value }))}
                        className={cn(
                          "w-full px-5 py-4 rounded-2xl border text-sm font-bold focus:outline-none focus:border-blue-500 transition-all",
                          theme === 'dark' ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                        )}
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-5 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      {isLoading ? 'Synchronizing...' : 'Update Neural Core'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
