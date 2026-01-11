import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageProvider } from './language-context';

import { Header } from './app/header';
import { Home } from './app/home';
import { Projects } from './app/projects';
import { About } from './app/about';
import { AiGenerator } from './app/aigenerator';
import { Admin } from './app/admin';
import { Contact } from './app/contact';

import { Instagram, Mail, MessageCircle } from 'lucide-react';
import { PROJECTS as STATIC_PROJECTS } from './app/data';
import { db } from './app/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

/* ================= DEFAULT DATA ================= */

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
  bioTr: "Mimarlığın 'Nasıl'ından önce 'Neden'ine odaklanan bir mimar."
};

const DEFAULT_THEME = {
  serif: 'Bodoni Moda',
  sans: 'Plus Jakarta Sans',
  arabic: 'Noto Kufi Arabic'
};

/* ================= APP ================= */

const AppContent = () => {
  const [view, setView] = useState<'home' | 'projects' | 'ai' | 'about' | 'contact' | 'admin'>('home');
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
    if (!db) {
      refreshLocalData();
      return;
    }

    setIsFirebaseConnected(true);

    const unsubProjects = onSnapshot(collection(db, "projects"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      data.length ? setProjects(data) : refreshLocalData();
    });

    const unsubGeneral = onSnapshot(collection(db, "general"), (snapshot) => {
      snapshot.forEach(doc => {
        if (doc.id === 'contact') setContactInfo(prev => ({ ...prev, ...doc.data() }));
        if (doc.id === 'about') setAboutInfo(prev => ({ ...prev, ...doc.data() }));
        if (doc.id === 'theme') setTheme(prev => ({ ...prev, ...doc.data() }));
      });
    });

    return () => {
      unsubProjects();
      unsubGeneral();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5]">
      <Header currentView={view} setView={setView} />

      <main className="min-h-[85vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {view === 'home' && <Home onNavigate={setView} info={aboutInfo} />}
            {view === 'projects' && <Projects projects={projects} />}
            {view === 'ai' && <AiGenerator />}
            {view === 'about' && <About info={aboutInfo} />}
            {view === 'contact' && <Contact info={contactInfo} />}
            {view === 'admin' && (
              <Admin
                projects={projects}
                contact={contactInfo}
                about={aboutInfo}
                theme={theme}
                isFirebaseConnected={isFirebaseConnected}
                onRefresh={refreshLocalData}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="px-6 md:px-16 py-16 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/20">
              © 2025 Alhaidari Studio. All rights reserved.
            </p>
          </div>
          <div className="flex gap-6 text-white/40">
            {contactInfo.instagram && (
              <a href={`https://instagram.com/${contactInfo.instagram.replace('@', '')}`} target="_blank">
                <Instagram size={20} />
              </a>
            )}
            {contactInfo.phone && (
              <a href={`https://wa.me/${contactInfo.phone.replace(/[^0-9]/g, '')}`} target="_blank">
                <MessageCircle size={20} />
              </a>
            )}
            {contactInfo.email && (
              <a href={`mailto:${contactInfo.email}`}>
                <Mail size={20} />
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

/* ================= BOOTSTRAP ================= */

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container not found');
}

createRoot(container).render(
  <React.StrictMode>
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  </React.StrictMode>
);
