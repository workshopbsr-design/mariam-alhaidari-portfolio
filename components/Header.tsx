import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLang } from '../context/language-context';
import { Home, Layers, User, Mail, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_SCHEMA = [
  { id: 'home', path: '/', icon: Home },
  { id: 'projects', path: '/projects', icon: Layers },
  { id: 'about', path: '/about', icon: User },
  { id: 'contact', path: '/contact', icon: Mail },
];

export const Header = () => {
  const { t, lang, setLang } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [clickCount, setClickCount] = useState(0);
  const lastClickRef = useRef<number>(0);

  const cycleLang = () => {
    const langs: ('en' | 'ar' | 'tr')[] = ['en', 'ar', 'tr'];
    const nextIdx = (langs.indexOf(lang) + 1) % langs.length;
    setLang(langs[nextIdx]);
  };

  const handleSecretEntry = () => {
    const now = Date.now();
    // Timing window: 600ms between clicks to count as a sequence
    if (now - lastClickRef.current < 600) {
      const newCount = clickCount + 1;
      if (newCount >= 5) {
        // SECURE HANDSHAKE: Trigger navigation with a hidden state flag
        navigate('/admin', { state: { secretAccess: true } });
        setClickCount(0);
      } else {
        setClickCount(newCount);
      }
    } else {
      setClickCount(1);
    }
    lastClickRef.current = now;
  };

  return (
    <header className="fixed top-0 w-full z-[200] flex justify-center pt-8 px-6 pointer-events-none">
      <div className="w-full max-w-7xl flex justify-between items-center gap-4">
        {/* The Secret Logo Entry Point */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="pointer-events-auto bg-black/60 backdrop-blur-3xl border border-white/10 px-6 py-3 rounded-full cursor-pointer hover:border-[#d4a373] transition-all select-none group shadow-2xl"
          onClick={handleSecretEntry}
        >
          <span className="text-xl font-serif font-bold text-white italic group-hover:text-[#d4a373] transition-colors">
            Atelier<span className="text-[#d4a373]">.</span>
          </span>
        </motion.div>

        {/* Dynamic Navigation Bar */}
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 pointer-events-auto bg-black/60 backdrop-blur-3xl border border-white/10 p-1.5 rounded-full shadow-2xl"
        >
          {NAV_SCHEMA.map((item) => (
            <button 
              key={item.id} 
              onClick={() => navigate(item.path)} 
              className={`px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${
                location.pathname === item.path ? 'bg-[#d4a373] text-black shadow-lg shadow-[#d4a373]/20' : 'text-white/30 hover:text-white'
              }`}
            >
              <item.icon size={14} />
              <span className="hidden lg:inline">{(t.nav as any)[item.id]}</span>
            </button>
          ))}
        </motion.nav>

        {/* Language Orchestrator */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="pointer-events-auto">
          <button 
            onClick={cycleLang} 
            className="bg-black/60 backdrop-blur-3xl border border-white/10 text-white/80 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-2 hover:border-[#d4a373] transition-all group shadow-2xl"
          >
            <Globe size={14} className="text-[#d4a373] group-hover:rotate-45 transition-transform duration-500" /> 
            <span className="hidden sm:inline">{lang.toUpperCase()}</span>
          </button>
        </motion.div>
      </div>
    </header>
  );
};
