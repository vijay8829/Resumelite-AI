import React from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ArrowRight, Shield, Rocket, Globe, UserCheck, 
  Zap, BarChart, ChevronDown, Github, Twitter, Linkedin,
  Layers, Cpu, Database, Network, Star, Quote, Mail,
  ExternalLink, ArrowUpRight, CheckCircle2, Menu, X
} from 'lucide-react';
import { cn } from '../lib/utils';

// Image paths from generator
const IMAGES = {
  platform: '/src/assets/images/platform_3d_engine_1776928113093.png',
  solutions: '/src/assets/images/solutions_3d_network_1776928133350.png',
  architecture: '/src/assets/images/architecture_3d_structure_1776928151432.png',
  enterprise: '/src/assets/images/enterprise_3d_globe_1776928172930.png',
};

interface LandingProps {
    onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [email, setEmail] = React.useState('');
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(mousePos.y * -20, springConfig);
  const rotateY = useSpring(mousePos.x * 20, springConfig);

  const pillars = [
    { 
      id: 'platform', 
      title: 'Platform', 
      desc: 'Next-gen infrastructure built for scale and sub-millisecond latent career processing.', 
      image: IMAGES.platform,
      icon: Cpu,
      color: 'blue',
      video: 'https://cdn.pixabay.com/video/2023/10/24/186350-877717468_large.mp4'
    },
    { 
      id: 'solutions', 
      title: 'Solutions', 
      desc: 'Tailored career paths engineered through advanced algorithmic alignment.', 
      image: IMAGES.solutions,
      icon: Network,
      color: 'indigo',
      video: 'https://cdn.pixabay.com/video/2022/05/25/118182-714092403_large.mp4'
    },
    { 
      id: 'architecture', 
      title: 'Architecture', 
      desc: 'A robust, multi-layered framework designed to bypass recruiter skepticism.', 
      image: IMAGES.architecture,
      icon: Database,
      color: 'cyan',
      video: 'https://cdn.pixabay.com/video/2016/09/06/4962-181512497_large.mp4'
    },
    { 
      id: 'enterprise', 
      title: 'Enterprise', 
      desc: 'Full-spectrum workforce intelligence for global elite institutions.', 
      image: IMAGES.enterprise,
      icon: Globe,
      color: 'emerald',
      video: 'https://cdn.pixabay.com/video/2021/04/12/70860-537446559_large.mp4'
    }
  ];

  const testimonials = [
    {
      name: "Alex Thorne",
      role: "Lead Cloud Architect @ Google",
      quote: "The computational precision of AstraAI transformed my trajectory. It's not a resume tool; it's a strategic weapon.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
    },
    {
      name: "Sarah Chen",
      role: "VP Engineering @ Fintech Pro",
      quote: "Bypassed ATS filters at every Tier 1 firm. The neural optimization is simply unparalleled in today's market.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    },
    {
      name: "Marcus Vane",
      role: "Senior Quant Analyst @ Citadel",
      quote: "Finally, a system that understands high-impact value. The 3D virtualization of my career was the core differentiator.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus"
    }
  ];

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#020202] text-slate-200 overflow-x-hidden selection:bg-blue-600/30 font-sans"
    >
      {/* Dynamic 3D Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 w-full z-100 px-4 md:px-8 py-6 flex items-center justify-between backdrop-blur-md bg-black/40 border-b border-white/5"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-xl flex items-center justify-center rotate-12 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Rocket className="text-white -rotate-12" size={18} />
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tighter text-white">ASTRA<span className="text-blue-500">AI</span></span>
        </div>
        
        <nav className="hidden lg:flex items-center gap-8">
          {['Platform', 'Solutions', 'Architecture', 'Enterprise'].map(item => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[9px] font-black uppercase tracking-[0.35em] text-slate-500 hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-6 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">Neural Link: Stable</span>
          </div>
          <div className="w-[1px] h-3 bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Latency: 14ms</span>
          </div>
          <div className="w-[1px] h-3 bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Sync: Tier 1</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onStart}
            className="hidden sm:block bg-white text-black px-5 md:px-6 py-2 md:py-2.5 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl"
          >
            Access Terminal
          </button>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-blue-500 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/5 p-8 flex flex-col gap-6 lg:hidden"
            >
              {['Platform', 'Solutions', 'Architecture', 'Enterprise'].map(item => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-lg font-black uppercase tracking-[0.2em] text-white hover:text-blue-500 transition-colors"
                >
                  {item}
                </a>
              ))}
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onStart();
                }}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl mt-4"
              >
                Access Terminal
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section with Video & 3D */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden pt-32">
        {/* Background Video Layer */}
        <div className="absolute inset-0 z-0 opacity-40">
           <div className="absolute inset-0 bg-blue-600/5 mix-blend-overlay" />
           <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover grayscale contrast-150"
          >
            <source src="https://cdn.pixabay.com/video/2023/10/24/186350-877717468_large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020202]/80 via-transparent to-[#020202]/80" />
        </div>

        {/* 3D Content Wrapper */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           style={{ rotateX, rotateY, perspective: 1500 }}
           className="relative z-10 text-center space-y-10 md:space-y-16 max-w-7xl"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 backdrop-blur-xl shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-blue-500/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Sparkles className="text-blue-400 animate-pulse" size={14} />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-blue-400">Autonomous Career Orchestration</span>
          </motion.div>

          <h1 className="text-[12vw] md:text-[110px] lg:text-[145px] font-black leading-[0.8] tracking-tighter uppercase text-white drop-shadow-[0_20px_60px_rgba(37,99,235,0.3)]">
            Forge Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400 py-3 block">Elite Status</span>
          </h1>

          <p className="text-sm md:text-xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed opacity-70 px-4">
            The world's first AI-driven architect for hyper-competitive trajectories. <br className="hidden md:block" /> Built for leaders who demand <span className="text-white">mathematical certainty</span> in their evolution.
          </p>

          <div className="flex flex-col items-center justify-center pt-8">
            <motion.div 
              className="relative p-[1px] rounded-2xl md:rounded-[2.5rem] bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 overflow-hidden group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-white/20 to-blue-600 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
              
              <button 
                onClick={onStart}
                className="relative px-12 md:px-20 py-8 md:py-10 bg-[#020202] rounded-2xl md:rounded-[2.5rem] text-white flex flex-col items-center gap-4 transition-all group-hover:bg-transparent overflow-hidden"
              >
                <div className="absolute top-0 right-10 flex gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                   {[...Array(3)].map((_, i) => (
                     <div key={i} className="w-[1px] h-4 bg-white animate-pulse" style={{ animationDelay: `${i*0.2}s` }} />
                   ))}
                </div>
                
                <div className="flex items-center gap-6">
                  <span className="text-xl md:text-3xl font-black uppercase tracking-tighter italic">Initialize Identity Sync</span>
                  <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <ArrowUpRight size={28} strokeWidth={3} className="group-hover:rotate-45 transition-transform" />
                  </div>
                </div>
                
                <div className="flex items-center gap-4 opacity-50 text-[8px] font-black uppercase tracking-[0.4em]">
                  <Zap size={10} className="text-blue-500" />
                  <span>Establishing Neural Bridge</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" />
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce delay-75" />
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce delay-150" />
                  </div>
                </div>
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-700">Enter Modules</span>
          <ChevronDown className="text-slate-800" size={16} />
        </motion.div>
      </section>

      {/* 3D Pillars Section - Mobile Responsive Grid */}
      <section className="py-24 md:py-40 px-4 md:px-8 relative z-10 bg-[#020202]">
        <div className="max-w-7xl mx-auto space-y-24 md:space-y-40">
           {pillars.map((pillar, idx) => (
             <motion.div 
                key={pillar.id}
                id={pillar.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={cn(
                  "flex flex-col gap-12 md:gap-24 items-center",
                  idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                )}
             >
                <div className="flex-1 space-y-6 md:space-y-8 text-center lg:text-left">
                   <div className="inline-flex items-center gap-3 text-blue-500 uppercase font-black tracking-widest text-[10px] md:text-xs">
                      <pillar.icon size={18} />
                      <span>{pillar.title} Protocol</span>
                   </div>
                   <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase text-white leading-none">
                     {pillar.title} <br />
                     <span className={cn(
                       "bg-clip-text text-transparent bg-gradient-to-r",
                       idx % 2 === 0 ? "from-blue-600 to-cyan-400" : "from-emerald-400 to-blue-500"
                     )}>Evolution</span>
                   </h2>
                   <p className="text-base md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                     {pillar.desc} Our system leverages a unique {pillar.id}-first approach to ensure every data point is synchronized with your target market.
                   </p>
                   <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                      {['Scalable', 'Neural', 'Precise'].map(tag => (
                        <span key={tag} className="px-5 py-2 rounded-full border border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400">{tag}</span>
                      ))}
                   </div>
                </div>

                 <div className="flex-1 relative w-full aspect-[4/3] max-w-2xl group/image rounded-[3rem] overflow-hidden">
                   <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity">
                      <video autoPlay muted loop playsInline className="w-full h-full object-cover grayscale">
                         <source src={pillar.video} type="video/mp4" />
                      </video>
                   </div>
                   
                   <motion.div 
                     whileHover={{ scale: 1.05, rotate: idx % 2 === 0 ? 2 : -2 }}
                     className="w-full h-full relative z-10 p-4 md:p-8"
                   >
                     <div className="absolute top-0 right-0 p-8 z-20 flex flex-col items-end gap-2 opacity-0 group-hover/image:opacity-100 transition-opacity">
                        <div className="flex gap-1">
                           {[...Array(4)].map((_, i) => <div key={i} className="w-1 h-4 bg-blue-500 animate-pulse" style={{ animationDelay: `${i*0.1}s` }} />)}
                        </div>
                        <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Active Processing</span>
                     </div>

                     <img 
                       src={pillar.image} 
                       alt={pillar.title} 
                       className="w-full h-full object-contain drop-shadow-[0_40px_80px_rgba(37,99,235,0.3)] animate-float mix-blend-lighten contrast-125"
                       style={{ animationDelay: `${idx * 0.5}s` }}
                     />
                     <div className={cn(
                       "absolute inset-0 blur-3xl opacity-20 -z-10 group-hover/image:opacity-40 transition-opacity",
                       pillar.color === 'blue' ? "bg-blue-600" : 
                       pillar.color === 'indigo' ? "bg-indigo-600" : 
                       pillar.color === 'cyan' ? "bg-cyan-600" : "bg-emerald-600"
                     )} />

                     <div className="absolute bottom-0 left-0 p-8 z-20 opacity-0 group-hover/image:opacity-100 transition-opacity">
                        <div className="font-mono text-[8px] text-slate-700">
                           NODE_SYNC::STABLE<br/>
                           UX_PARAM_0{idx+1}::OPTIMIZED<br/>
                           VECTOR_AUTH::VERIFIED
                        </div>
                     </div>
                   </motion.div>
                </div>
             </motion.div>
           ))}
        </div>
      </section>

      {/* User Reviews Section - Advanced 3D Horizontal Scroll */}
      <section className="py-24 md:py-40 bg-zinc-950/20 px-4 md:px-8 border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center mb-16 md:mb-24 space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Market Validation</h2>
          <p className="text-4xl md:text-7xl font-black text-white tracking-tighter italic uppercase">Recruiter <br className="md:hidden" /> Consensus</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-10 perspective-1000">
           {testimonials.map((t, i) => (
             <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9, rotateY: 30 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex-1 group bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden backdrop-blur-xl hover:border-blue-500/50 transition-all duration-500"
             >
                <Quote className="absolute -top-4 -right-4 text-white/5 w-40 h-40 group-hover:text-blue-500/10 transition-colors" />
                <div className="space-y-8 relative z-10">
                   <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-blue-500 fill-blue-500" />)}
                   </div>
                   <p className="text-lg md:text-xl font-medium leading-relaxed italic text-slate-300">"{t.quote}"</p>
                   <div className="flex items-center gap-4 pt-10">
                      <div className="w-14 h-14 rounded-2xl bg-blue-600 overflow-hidden ring-4 ring-white/5">
                        <img src={t.avatar} alt={t.name} className="w-full h-full" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-white uppercase tracking-widest">{t.name}</p>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{t.role}</p>
                      </div>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Advanced Footer */}
      <footer className="pt-32 pb-16 px-4 md:px-8 border-t border-white/5 bg-[#010101] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 md:gap-20 mb-24 transition-all">
              <div className="col-span-2 space-y-10">
                 <div className="flex items-center gap-3">
                    <Rocket className="text-blue-600" size={32} />
                    <span className="text-3xl font-black text-white tracking-tighter">ASTRA<span className="text-blue-500">AI</span></span>
                 </div>
                 <p className="text-slate-500 text-sm font-medium leading-loose max-w-sm">
                    The autonomous intelligence layer for global career synchronization. Built at the intersection of neural linguistics and elite recruitment architecture.
                 </p>
                 <div className="flex gap-4">
                    {[Github, Twitter, Linkedin].map((Icon, i) => (
                      <a key={i} href="#" className="w-12 h-12 rounded-xl border border-white/5 bg-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:border-blue-600 transition-all">
                        <Icon size={20} />
                      </a>
                    ))}
                 </div>
              </div>

              <div className="space-y-8">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Ecosystem</h4>
                 <ul className="space-y-4">
                    {['Neural Engine', 'Platform', 'Solutions', 'Enterprise'].map(item => (
                      <li key={item}>
                        <a 
                          href={item !== 'Neural Engine' ? `#${item.toLowerCase()}` : '#'} 
                          onClick={(e) => {
                             if (item !== 'Neural Engine') {
                               e.preventDefault();
                               document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
                             }
                          }}
                          className="text-xs font-bold text-slate-600 hover:text-blue-500 transition-colors uppercase tracking-widest"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                 </ul>
              </div>

               <div className="space-y-8">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Intel</h4>
                  <ul className="space-y-4">
                     {['Whitepapers', 'API Layer', 'Status', 'Architecture'].map(item => (
                       <li key={item}>
                         <a 
                           href="#" 
                           onClick={(e) => {
                               e.preventDefault();
                               const targetId = item === 'Architecture' ? 'architecture' : 
                                               item === 'API Layer' ? 'platform' : 
                                               item === 'Status' ? 'hero' : ''; // Hero for status
                               
                               if (targetId) {
                                 document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
                               } else {
                                 window.scrollTo({ top: 0, behavior: 'smooth' });
                               }
                           }}
                           className="text-xs font-bold text-slate-600 hover:text-blue-500 transition-colors uppercase tracking-widest"
                         >
                           {item}
                         </a>
                       </li>
                     ))}
                  </ul>
               </div>

              <div className="col-span-2 lg:col-span-1 space-y-8">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Neural Briefing</h4>
                 <AnimatePresence mode="wait">
                    {!isSubscribed ? (
                      <motion.div 
                        key="subscribe"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <div className="space-y-4">
                           <div className="relative group">
                              <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter identity email..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-800 text-white font-medium"
                              />
                           </div>
                           <button 
                            onClick={() => {
                              if (email && email.includes('@')) {
                                setIsSubscribed(true);
                              }
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 group"
                            disabled={!email}
                           >
                              <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                              <span>Initialize Identity Sync</span>
                           </button>
                        </div>
                        <p className="text-[8px] font-bold text-slate-700 uppercase tracking-widest leading-relaxed">
                          Join 50k+ elite professionals receiving weekly algorithmic insights.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-2xl bg-blue-600/10 border border-blue-500/20 backdrop-blur-xl space-y-3"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-blue-500" />
                          <span className="text-[9px] font-black text-white uppercase tracking-widest">Identity Verified</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                          Neural synchronization initiated. You will receive the briefing at <span className="text-blue-400 font-bold">{email}</span>.
                        </p>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>
           </div>

           <div className="flex flex-col md:flex-row justify-between items-center pt-16 border-t border-white/5 gap-8">
              <div className="flex gap-8 text-[9px] font-black text-slate-700 uppercase tracking-widest">
                 <a href="#" className="hover:text-white transition-colors">Privacy Ops</a>
                 <a href="#" className="hover:text-white transition-colors">Security Protocol</a>
                 <a href="#" className="hover:text-white transition-colors">Neural Terms</a>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-black text-white italic tracking-tighter">
                 <span className="text-slate-800 not-italic uppercase tracking-widest">EST. 2026</span>
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                 <span>ASTRA NEURAL SYSTEMS GLOBAL</span>
              </div>
           </div>
        </div>
      </footer>

      {/* Extra Atmospheric Layer */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[100px]" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-20px) rotate(1deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite linear;
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}} />
    </div>
  );
}
