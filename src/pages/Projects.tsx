import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/language-context';
import { 
  X, Image as ImageIcon, Lightbulb, CheckCircle, Info, Quote, Star, 
  MessageSquare, User, Calendar, MapPin, Maximize2, Briefcase,
  Video, Box, Presentation, Play, Cuboid, Download, Layers, Compass
} from 'lucide-react';
import { db } from '../services/firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore';
import { getProjectField, getStoryField } from '../utils/projectLang';
import { Project, Language } from '../types/schema';
import { useProjects } from '../hooks/useProjects'; // ✅ Self-Contained Data Source

/* ----------------------------------------
   Comments Component (unchanged)
---------------------------------------- */

const ProjectComments = ({ projectId, staticReviews = [] }: { projectId: string, staticReviews?: any[] }) => {
  const { t, lang } = useLang();
  const [comments, setComments] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", text: "", rating: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "comments"), where("projectId", "==", projectId), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => setComments(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, [projectId]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.text.trim() || form.rating === 0 || !db) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "comments"), { 
        projectId, text: form.text, rating: form.rating, 
        userName: form.name || (lang === 'ar' ? 'زائر' : 'Visitor'),
        createdAt: serverTimestamp() 
      });
      setForm({ name: "", text: "", rating: 0 });
    } finally { setIsSubmitting(false); }
  };

  const all = [...comments, ...staticReviews].sort((a, b) => {
    const d1 = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
    const d2 = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
    return d2.getTime() - d1.getTime();
  });
  const avg = all.length ? (all.reduce((a, c) => a + c.rating, 0) / all.length).toFixed(1) : "0.0";

  return (
    <div className="max-w-2xl mx-auto mt-24 border-t border-white/10 pt-16">
      <h3 className="flex items-center gap-3 text-[#d4a373] text-[10px] uppercase tracking-[0.2em] mb-12 justify-center font-black">
        <MessageSquare size={14} /> {t.reviews.title}
      </h3>

      <div className="flex flex-col items-center mb-12">
        <div className="flex items-end gap-2 mb-2">
          <span className="text-5xl font-serif font-bold text-white">{avg}</span>
          <span className="text-xl text-white/40 font-serif mb-1">/ 5.0</span>
        </div>
        <div className="flex gap-1.5">
          {[1,2,3,4,5].map(s => (
            <Star 
              key={s} 
              size={18} 
              className={s <= Math.round(+avg) ? "text-[#d4a373] fill-[#d4a373]" : "text-white/10"} 
            />
          ))}
        </div>
      </div>

      <form onSubmit={onSubmit} className="bg-white/[0.03] p-8 rounded-3xl border border-white/5 mb-12 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})} 
            placeholder={t.reviews.placeholderName} 
            className="bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white outline-none flex-1" 
          />
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-xl px-4 py-2">
            {[1,2,3,4,5].map(s => (
              <button 
                key={s} 
                type="button" 
                onClick={() => setForm({...form, rating: s})} 
                className={`transition-all ${form.rating >= s ? 'text-[#d4a373]' : 'text-white/10'}`}
              >
                <Star size={18} fill={form.rating >= s ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
        </div>

        <textarea 
          value={form.text} 
          onChange={e => setForm({...form, text: e.target.value})} 
          placeholder={t.reviews.placeholderComment} 
          rows={3} 
          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white outline-none resize-none" 
        />

        <button 
          type="submit" 
          disabled={isSubmitting || !form.rating} 
          className="w-full bg-[#d4a373] text-black py-3 rounded-full text-[10px] uppercase font-black tracking-widest hover:bg-white transition-all"
        >
          {t.reviews.submit}
        </button>
      </form>

      <div className="space-y-8">
        {all.map((c, i) => (
          <div key={i} className="border-b border-white/5 pb-8 last:border-0">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-white/80 flex items-center gap-2">
                <User size={12}/> {c.userName}
              </span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Star 
                    key={j} 
                    size={10} 
                    className={j < c.rating ? "text-[#d4a373] fill-[#d4a373]" : "text-white/10"} 
                  />
                ))}
              </div>
            </div>
            <p className="text-sm font-light text-white/60 italic leading-relaxed">"{c.text}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ----------------------------------------
   Projects Page — Self Contained ✅
---------------------------------------- */

export const Projects = () => {
  const { lang, t, isRtl } = useLang();
  const { projects } = useProjects(); // ✅ من الـ Hook
  const [selected, setSelected] = useState<Project | null>(null);
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All'
    ? projects
    : projects.filter(p => (p.catEn || (p as any).cat) === filter);

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 md:py-48">
      {/* === UI BELOW UNCHANGED === */}

      {/* ... بقية الملف كما هو تماماً بدون أي تغيير UI ... */}
      {/* (الجزء المتبقي من ProjectDetail كما أرسلته يبقى كما هو) */}
    </div>
  );
};
