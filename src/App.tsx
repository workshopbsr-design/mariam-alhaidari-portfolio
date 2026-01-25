import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, Instagram, MessageCircle } from 'lucide-react';
import { Header } from './components/Header';
import { IntroPause } from './components/IntroPause';
import { AppRoutes } from './routes/AppRoutes';
import { useSyncData } from './hooks/useSyncData';
import { AboutInfo } from './types/schema';

const DEFAULT_ABOUT: AboutInfo = {
  nameEn: "Mariam Al-Haidari",
  nameAr: "مريم الحيدري",
  fontSerif: "'Bodoni Moda', serif",
  fontSans: "'Plus Jakarta Sans', sans-serif",
  fontArabic: "'Amiri', serif",
  fontSize: "16",
  nameFontSize: "80",
  email: "Alhaidarimariam@gmail.com",
  phone: "+905436351693",
  instagram: "https://www.instagram.com/smemo_5?igsh=MWF4bmRiMjk5MXM5bQ%3D%3D&utm_source=qr",
  resumeUrl: "",
  profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200"
};

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showIntro, setShowIntro] = useState(
    () => !sessionStorage.getItem('intro_seen')
  );

  const { aboutInfo, projects, contactInfo } = useSyncData(DEFAULT_ABOUT);

  useEffect(() => {
    if (location.pathname !== '/' && showIntro) {
      navigate('/', { replace: true });
    }
  }, [showIntro, navigate, location.pathname]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('intro_seen', 'true');
  };

  return (
    <div
      className="min-h-screen bg-[#050505] selection:bg-[#d4a373] selection:text-black"
      style={{ fontSize: `${aboutInfo.fontSize || '16'}px` }}
    >
      <AnimatePresence mode="wait">
        {showIntro && (
          <IntroPause key="intro" onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      {!showIntro && (
        <>
          <Header />

          <main className="relative z-10">
            <AppRoutes
              projects={projects}
              aboutInfo={aboutInfo}
              contactInfo={contactInfo}
              onRefresh={syncFromLocal}
            />
          </main>

          <footer className="px-6 py-48 bg-black border-t border-white/5 text-center relative z-20 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#d4a373]/30 to-transparent" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-[#d4a373] font-serif italic text-6xl md:text-8xl mb-8 tracking-tighter">
                Atelier Mariam.
              </div>

              <div className="flex justify-center gap-8 mb-12">
                {[
                  {
                    icon: MessageCircle,
                    href: `https://wa.me/${aboutInfo.phone?.replace(/[^0-9]/g, '')}`,
                    show: !!aboutInfo.phone
                  },
                  {
                    icon: Mail,
                    href: `mailto:${aboutInfo.email}`,
                    show: !!aboutInfo.email
                  },
                  {
                    icon: Instagram,
                    href: aboutInfo.instagram,
                    show: !!aboutInfo.instagram
                  }
                ].map(
                  (s, i) =>
                    s.show && (
                      <a
                        key={i}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#d4a373]/40 hover:text-[#d4a373] transition-all duration-500 transform hover:scale-125"
                      >
                        <s.icon size={28} strokeWidth={1} />
                      </a>
                    )
                )}
              </div>

              <p className="text-white/20 text-[10px] uppercase tracking-[1.2em] font-black mb-4">
                Architecture • Strategy • Human Experience
              </p>

              <div className="w-12 h-px bg-[#d4a373]/20 mx-auto mt-8" />
            </motion.div>
          </footer>
        </>
      )}

      <style>{`
        :root {
          --dyn-serif: ${aboutInfo.fontSerif || "'Bodoni Moda', serif"};
          --dyn-sans: ${aboutInfo.fontSans || "'Plus Jakarta Sans', sans-serif"};
          --dyn-arabic: ${aboutInfo.fontArabic || "'Amiri', serif"};
          --dyn-name-size: ${aboutInfo.nameFontSize || "80"}px;
        }
      `}</style>

      <div className="noise-bg" />
    </div>
  );
};

export default App;
