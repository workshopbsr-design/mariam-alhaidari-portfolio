
import React from 'react';
import { useLang } from '../language-context';
import { LayoutGrid, Home, Layers, User, Mail, LayoutDashboard } from 'lucide-react';

export const Header = ({ currentView, setView }: any) => {
  const { t, lang, setLang } = useLang();
  const navItems = [
    { id: 'home', label: t.nav.home, icon: Home },
    { id: 'projects', label: t.nav.projects, icon: Layers },
    { id: 'about', label: t.nav.about, icon: User },
    { id: 'contact', label: t.nav.contact, icon: Mail },
    { id: 'admin', label: t.nav.admin, icon: LayoutDashboard },
  ];

  const cycleLang = () => {
    if (lang === 'en') setLang('ar');
    else if (lang === 'ar') setLang('tr');
    else setLang('en');
  };

  const getLangLabel = () => {
    if (lang === 'en') return 'EN';
    if (lang === 'ar') return 'AR';
    return 'TR';
  };

  return (
    <header className="fixed top-0 w-full z-50 flex justify-center pt-4 md:pt-6 px-4 pointer-events-none">
      <div className="w-full max-w-7xl flex justify-between items-center gap-2 md:gap-4">
        <div 
          className="flex items-center gap-2 md:gap-3 cursor-pointer pointer-events-auto bg-black/40 backdrop-blur-2xl border border-white/10 px-4 md:px-5 py-2.5 md:py-3 rounded-full hover:bg-black/60 transition-all shrink-0 shadow-2xl group" 
          onClick={() => setView('home')}
        >
          <div className="w-5 h-5 bg-[#d4a373] rounded-sm flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
             <LayoutGrid className="text-black" size={14} />
          </div>
          <span className="hidden sm:block text-base md:text-lg font-serif font-bold tracking-tight text-white">Atelier</span>
        </div>
        <nav className="flex items-center gap-1 pointer-events-auto bg-black/40 backdrop-blur-2xl border border-white/10 p-1 rounded-full shadow-2xl overflow-x-auto no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs font-medium uppercase tracking-wider transition-all duration-300 shrink-0 ${
                currentView === item.id 
                  ? 'bg-[#d4a373] text-black shadow-[0_0_15px_rgba(212,163,115,0.4)] font-bold' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={14} strokeWidth={2.5} />
              <span className="hidden lg:block">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2 md:gap-3 pointer-events-auto shrink-0">
          <button 
            onClick={cycleLang}
            className="bg-black/40 backdrop-blur-2xl border border-white/10 text-white/80 hover:text-white hover:bg-black/60 px-4 md:px-5 py-2.5 md:py-3 rounded-full text-[10px] md:text-xs font-bold transition-all uppercase tracking-widest shadow-2xl min-w-[50px] md:min-w-[64px]"
          >
            {getLangLabel()}
          </button>
        </div>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </header>
  );
};
