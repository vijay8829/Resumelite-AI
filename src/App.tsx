import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ResumeBuilder from './components/ResumeBuilder';
import JobAnalyzer from './components/JobAnalyzer';
import CareerCoach from './components/CareerCoach';
import CoverLetterGenerator from './components/CoverLetterGenerator';
import Profile from './components/Profile';
import Landing from './components/Landing';
import { useFirebase } from './components/FirebaseProvider';

export default function App() {
  const { user, loading, login } = useFirebase();
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [started, setStarted] = React.useState(false);
  const [selectedResumeId, setSelectedResumeId] = React.useState<string | null>(null);

  const handleEditResume = (id: string) => {
    setSelectedResumeId(id);
    setActiveTab('builder');
  };

  const handleCreateNew = () => {
    setSelectedResumeId(null);
    setActiveTab('builder');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!started && !user) {
    return <Landing onStart={login} />;
  }

  // If user is logged in but hasn't "started" (clicked the button on landing), 
  // we can either show landing or go straight to dashboard. 
  // Let's go straight to dashboard if logged in.
  if (!user) {
    return <Landing onStart={login} />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
          {activeTab === 'dashboard' && <Dashboard onEdit={handleEditResume} onNew={handleCreateNew} />}
          {activeTab === 'builder' && <ResumeBuilder resumeId={selectedResumeId} onSaved={() => setActiveTab('dashboard')} />}
          {activeTab === 'analyzer' && <JobAnalyzer />}
          {activeTab === 'letter' && <CoverLetterGenerator />}
          {activeTab === 'coach' && <CareerCoach />}
          {activeTab === 'profile' && <Profile />}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

