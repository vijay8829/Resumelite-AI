import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, BrainCircuit, Sparkles, User, MessageSquareText, Zap } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { cn } from '../lib/utils';
import { useTheme } from './ThemeProvider';

const aiLabels = ["Strategist", "Mentor", "Counselor", "Coach"];

export default function CareerCoach() {
  const { theme } = useTheme();
  const [messages, setMessages] = React.useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: "Hello! I'm your Astra Career Coach. I can help you with interview prep, negotiation strategies, or planning your next big career move. What's on your mind today?" }
  ]);
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : null);
      
      if (!apiKey) {
        // Fallback demo response
        setTimeout(() => {
          const demoResponse = {
            text: "Hello! I'm in offline demo mode because no AI API key is configured. To enable full AI coaching, please set VITE_GEMINI_API_KEY in your environment. \n\nDirect advice: For a technical leadership role, focus your resume on architectural decisions and team mentoring impacts."
          };
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'assistant',
            content: demoResponse.text,
            timestamp: new Date()
          }]);
          setIsTyping(false);
        }, 1000);
        return;
      }
      
      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: messages.concat({ role: 'user', content: userMsg }).map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: "You are a world-class elite career coach and executive recruiter. You provide highly strategic, evidence-based career advice. You are direct, encouraging, and professional. You specialize in FAANG/High-growth tech career paths. Keep responses concise and high-impact."
        }
      });
      
      setMessages(prev => [...prev, { role: 'assistant', content: response.text || 'I apologize, but I am currently recalibrating. Please try again in a moment.' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to my central intelligence. Let's try once more." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-4">
        <div className="space-y-1">
          <h2 className={cn(
            "text-4xl font-extrabold tracking-tight uppercase italic",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>
            Career <span className="text-blue-500">Coach</span>
          </h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Strategic Neural Guidance Module</p>
        </div>
        <div className="flex gap-2">
           {aiLabels.map(l => (
               <div key={l} className={cn(
                 "px-2.5 py-1 border rounded text-[7px] uppercase tracking-[0.3em] font-black",
                 theme === 'dark' ? "bg-slate-900 border-slate-800 text-slate-500" : "bg-white border-slate-200 text-slate-400"
               )}>
                  {l}
               </div>
           ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={cn(
        "flex-1 border rounded-[3rem] p-10 overflow-y-auto mb-8 flex flex-col gap-8 scrollbar-hide relative shadow-2xl transition-colors duration-500",
        theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
      )}>
         <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none transition-colors duration-500">
            <BrainCircuit size={300} className={theme === 'dark' ? "text-slate-400" : "text-blue-200"} />
         </div>
         
         <AnimatePresence>
            {messages.map((m, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                        "flex gap-5 max-w-[85%] relative z-10",
                        m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                >
                    <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all",
                        m.role === 'user' ? "bg-white text-slate-950 border-white shadow-xl" : theme === 'dark' ? "bg-slate-950 border-slate-800 text-blue-400" : "bg-blue-50 border-blue-100 text-blue-600"
                    )}>
                        {m.role === 'user' ? <User size={18} strokeWidth={3} /> : <Zap size={18} />}
                    </div>
                    <div className={cn(
                        "p-5 rounded-3xl text-xs leading-relaxed font-medium shadow-sm transition-colors duration-500",
                        m.role === 'user' ? "bg-slate-800 text-white rounded-tr-none" : theme === 'dark' ? "bg-slate-950/50 text-slate-300 rounded-tl-none border border-slate-800" : "bg-slate-50 text-slate-700 rounded-tl-none border border-slate-200"
                    )}>
                        {m.content}
                    </div>
                </motion.div>
            ))}
            {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-5">
                     <div className={cn(
                         "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border",
                         theme === 'dark' ? "bg-slate-950 border-slate-800 text-blue-400" : "bg-blue-50 border-blue-100 text-blue-600"
                     )}>
                        <BrainCircuit size={16} className="animate-pulse" />
                     </div>
                     <div className={cn(
                       "px-6 py-5 rounded-3xl rounded-tl-none border flex gap-1.5 items-center",
                       theme === 'dark' ? "bg-slate-950/50 border-slate-800" : "bg-slate-50 border-slate-200"
                     )}>
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                     </div>
                </motion.div>
            )}
         </AnimatePresence>
      </div>

      {/* Input */}
      <div className="relative group px-2 pb-2">
        <div className="absolute inset-0 bg-blue-600/5 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <div className={cn(
          "relative border rounded-full p-2.5 flex items-center shadow-2xl focus-within:border-blue-500/30 transition-all duration-500",
          theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        )}>
            <div className={cn(
              "w-11 h-11 rounded-full border flex items-center justify-center ml-1",
              theme === 'dark' ? "bg-slate-950 border-slate-800 text-slate-600" : "bg-slate-50 border-slate-100 text-slate-400"
            )}>
                <MessageSquareText size={18} />
            </div>
            <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Submit your query to the strategic engine..."
                className={cn(
                  "flex-1 bg-transparent px-6 text-sm focus:outline-none font-medium",
                  theme === 'dark' ? "text-slate-200 placeholder:text-slate-700" : "text-slate-900 placeholder:text-slate-300"
                )}
            />
            <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20"
            >
                <Send size={18} strokeWidth={3} />
            </button>
        </div>
      </div>
    </div>
  );
}
