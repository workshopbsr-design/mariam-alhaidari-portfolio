
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageProvider, useLang } from './language-context';
import { Header } from './app/Header';
import { Home } from './Home';
import { Projects } from './Projects';
import { About } from './app/About';
import { AiGenerator } from './app/AiGenerator';
import { Admin } from './app/Admin';
import { Contact } from './app/Contact';
import { Instagram, Mail, Phone, WifiOff, Volume2, Waves, MessageCircle } from 'lucide-react';
import { PROJECTS as STATIC_PROJECTS } from './app/data';
import { db } from './app/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const DEFAULT_CONTACT = {
  phone: "+966 50 000 0000",
  email: "studio@arc-elite.com",
  instagram: "@arc.studio",
  addressEn: "Riyadh, Saudi Arabia",
  addressAr: "الرياض، المملكة العربية السعودية",
  addressTr: "Riyad, Suudi Arabistan"
};

const DEFAULT_ABOUT = {
  nameEn: "Mariam Al-Haidari",
  nameAr: "مريم الحيدري",
  nameTr: "Mariam Al-Haidari",
  profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
  resumeUrl: "",
  bioEn: "An architect obsessed with the 'Why' before the 'How'.",
  bioAr: "مهندسة معمارية مهووسة بـ 'اللماذا' قبل 'الكيف'.",
  bioTr: "Mimarlığın 'Nasıl'ından önce 'Neden'ine odaklanan bir mimar.",
  philosophyEn: "Minimal intervention for maximum impact.",
  philosophyAr: "التدخل الأدنى للأثر الأقصى.",
  philosophyTr: "Maksimum etki için minimum müdahale.",
  beliefEn: "Architecture is about meaning.",
  beliefAr: "العمارة تتعلق بالمعنى.",
  beliefTr: "Mimarlık anlamla ilgilidir.",
  skillsEn: ["Architectural Design", "BIM Management"],
  skillsAr: ["التصميم المعماري", "إدارة BIM"],
  skillsTr: ["Mimari Tasarım", "BIM Yönetimi"],
  softSkillsEn: ["Design Thinking"],
  softSkillsAr: ["التفكير التصميمي"],
  softSkillsTr: ["Tasarım Odaklı Düşünme"]
};

const DEFAULT_THEME = { serif: 'Bodoni Moda', sans: 'Plus Jakarta Sans', arabic: 'Noto Kufi Arabic' };

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a') || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.classList.contains('cursor-pointer')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);
  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-[#d4a373] rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        animate={{ x: mousePosition.x - 16, y: mousePosition.y - 16, scale: isHovering ? 2.5 : 1, backgroundColor: isHovering ? 'rgba(212, 163, 115, 0.15)' : 'transparent' }}
        transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.5 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#d4a373] rounded-full pointer-events-none z-[9999] hidden md:block"
        animate={{ x: mousePosition.x - 3, y: mousePosition.y - 3 }}
        transition={{ type: "spring", stiffness: 1000, damping: 50 }}
      />
    </>
  );
};

const AppContent = () => {
  const [view, setView] = useState('home');
  const { isRtl } = useLang();
  const [projects, setProjects] = useState(STATIC_PROJECTS);
  const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT);
  const [aboutInfo, setAboutInfo] = useState(DEFAULT_ABOUT);
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);

  const refreshLocalData = () => {
      const localProj = localStorage.getItem('arc_projects');
      if (localProj) setProjects(JSON.parse(localProj));
      const localCont = localStorage.getItem('arc_contact');
      if (localCont) setContactInfo(JSON.parse(localCont));
      const localAbout = localStorage.getItem('arc_about');
      if (localAbout) setAboutInfo(JSON.parse(localAbout));
      const localTheme = localStorage.getItem('arc_theme');
      if (localTheme) setTheme(JSON.parse(localTheme));
  };

  useEffect(() => {
    if (db) {
        setIsFirebaseConnected(true);
        onSnapshot(collection(db, "projects"), (snapshot) => {
            const data = snapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
            if (data.length > 0) setProjects(data);
            else refreshLocalData();
        });
        onSnapshot(collection(db, "general"), (snapshot) => {
             snapshot.forEach(doc => {
                 if (doc.id === 'contact') setContactInfo(prev => ({...prev, ...doc.data()}));
                 if (doc.id === 'about') setAboutInfo(prev => ({...prev, ...doc.data()}));
                 if (doc.id === 'theme') setTheme(prev => ({...prev, ...doc.data()}));
             });
        });
    } else {
        refreshLocalData();
    }
  }, []);

  return (
    <div className={`min-h-screen bg-[#0A0A0A] text-[#E5E5E5] selection:bg-[#d4a373] selection:text-black ${isRtl ? 'font-arabic' : 'font-jakarta'}`}>
      <CustomCursor />
      <Header currentView={view} setView={setView} />
      <main className="min-h-[85vh]">
        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            {view === 'home' && <Home onNavigate={setView} info={aboutInfo} />}
            {view === 'projects' && <Projects projects={projects} />}
            {view === 'ai' && <AiGenerator />}
            {view === 'about' && <About info={aboutInfo} />}
            {view === 'contact' && <Contact info={contactInfo} />}
            {view === 'admin' && <Admin projects={projects} contact={contactInfo} about={aboutInfo} theme={theme} isFirebaseConnected={isFirebaseConnected} onRefresh={refreshLocalData} />}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer setView={setView} contact={contactInfo} />
      <style>{`
        .font-serif { font-family: '${theme.serif}', serif; }
        .font-jakarta { font-family: '${theme.sans}', sans-serif; }
        .font-arabic { font-family: '${theme.arabic}', sans-serif; }
        body { cursor: none; background: #0A0A0A; overflow-x: hidden; }
        @media (max-width: 768px) { body { cursor: auto; } }
        input, textarea, select { cursor: text; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 1.25rem; border-radius: 1.25rem; color: white; width: 100%; outline: none; transition: all 0.4s; font-size: 14px; }
        input:focus, textarea:focus { border-color: #d4a373; background: rgba(255,255,255,0.06); box-shadow: 0 0 20px rgba(212, 163, 115, 0.1); }
        label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.25em; color: rgba(255,255,255,0.4); margin-bottom: 0.8rem; display: block; font-weight: 800; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: rgba(212, 163, 115, 0.3); border-radius: 10px; }
      `}</style>
    </div>
  );
};

const Footer = ({ setView, contact }: any) => {
  const { t } = useLang();
  return (
    <footer className="px-6 md:px-16 py-16 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div className="max-w-md">
          <p className="text-xl font-serif mb-4 leading-relaxed">{t.footer}</p>
          <p className="text-[10px] uppercase tracking-widest text-white/20">© 2025 Alhaidari Studio. All rights reserved.</p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-8 w-full md:w-auto">
          <div className="flex gap-6 text-white/40">
            {contact.instagram && <a href={`https://instagram.com/${contact.instagram.replace('@','')}`} target="_blank" className="hover:text-[#d4a373] transition-colors"><Instagram size={20} /></a>}
            {contact.phone && <a href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`} target="_blank" className="hover:text-[#d4a373] transition-colors"><MessageCircle size={20} /></a>}
            {contact.email && <a href={`mailto:${contact.email}`} className="hover:text-[#d4a373] transition-colors"><Mail size={20} /></a>}
          </div>
          <div className="flex gap-6">
            <button onClick={() => setView('ai')} className="text-[10px] text-white/30 hover:text-[#d4a373] transition-all uppercase tracking-[0.2em] font-bold">Narrative Tool</button>
            <button onClick={() => setView('admin')} className="text-[10px] text-white/30 hover:text-[#d4a373] transition-all uppercase tracking-[0.2em] font-bold">Admin</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<LanguageProvider><AppContent /></LanguageProvider>);
}
