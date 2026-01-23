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
          {[1,2,3,4,5].map(s => <Star key={s} size={18} className={s <= Math.round(+avg) ? "text-[#d4a373] fill-[#d4a373]" : "text-white/10"} />)}
        </div>
      </div>
      <form onSubmit={onSubmit} className="bg-white/[0.03] p-8 rounded-3xl border border-white/5 mb-12 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder={t.reviews.placeholderName} className="bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white outline-none flex-1" />
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-xl px-4 py-2">
            {[1,2,3,4,5].map(s => <button key={s} type="button" onClick={() => setForm({...form, rating: s})} className={`transition-all ${form.rating >= s ? 'text-[#d4a373]' : 'text-white/10'}`}><Star size={18} fill={form.rating >= s ? "currentColor" : "none"} /></button>)}
          </div>
        </div>
        <textarea value={form.text} onChange={e => setForm({...form, text: e.target.value})} placeholder={t.reviews.placeholderComment} rows={3} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white outline-none resize-none" />
        <button type="submit" disabled={isSubmitting || !form.rating} className="w-full bg-[#d4a373] text-black py-3 rounded-full text-[10px] uppercase font-black tracking-widest hover:bg-white transition-all">
          {t.reviews.submit}
        </button>
      </form>
      <div className="space-y-8">
        {all.map((c, i) => (
          <div key={i} className="border-b border-white/5 pb-8 last:border-0">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-white/80 flex items-center gap-2"><User size={12}/> {c.userName}</span>
              <div className="flex gap-0.5">{[...Array(5)].map((_, j) => <Star key={j} size={10} className={j < c.rating ? "text-[#d4a373] fill-[#d4a373]" : "text-white/10"} />)}</div>
            </div>
            <p className="text-sm font-light text-white/60 italic leading-relaxed">"{c.text}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Projects = ({ projects }: { projects: Project[] }) => {
  const { lang, t, isRtl } = useLang();
  const [selected, setSelected] = useState<Project | null>(null);
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? projects : projects.filter(p => (p.catEn || (p as any).cat) === filter);

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 md:py-48">
      <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-12">
        <div className={isRtl ? 'text-right' : 'text-left'}>
          <h2 className="text-[10px] uppercase tracking-[1em] text-[#d4a373] font-black mb-6">{t.nav.projects}</h2>
          <p className="text-4xl md:text-7xl font-serif italic text-white leading-[1.1] max-w-2xl">
            {isRtl ? 'بصمة مكانية خالدة' : 'Timeless Spatial Footprints'}
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          {['All', 'Interior', 'Architecture', 'Decor'].map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} className={`text-[10px] uppercase tracking-[0.3em] px-8 py-3 rounded-full border transition-all font-black ${filter === cat ? 'bg-[#d4a373] border-[#d4a373] text-black shadow-2xl shadow-[#d4a373]/30' : 'border-white/5 text-white/20 hover:text-white hover:border-white/20'}`}>
              {cat === 'All' ? t.projects.filterAll : (cat === 'Interior' ? t.projects.filterInterior : (cat === 'Architecture' ? t.projects.filterArch : t.projects.filterDecor))}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
        {filtered.map((p, i) => {
          const isHero = i === 0 && filter === 'All';
          return (
            <motion.div layout key={p.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15, duration: 1 }} className={`group cursor-pointer ${isHero ? 'md:col-span-2' : ''}`} onClick={() => setSelected(p)}>
              <div className={`overflow-hidden bg-[#111] mb-10 relative rounded-[3rem] border border-white/5 shadow-2xl ${isHero ? 'aspect-video' : 'aspect-[4/5]'}`}>
                <img src={p.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out" alt="" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center backdrop-blur-md">
                   <span className="bg-white text-black px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.6em] translate-y-6 group-hover:translate-y-0 transition-all duration-700">
                      {t.project.viewProject}
                   </span>
                </div>
              </div>
              <div className={isRtl ? 'text-right' : 'text-left'}>
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-[10px] text-[#d4a373] uppercase tracking-[0.4em] font-black">{getProjectField(p, lang, 'cat')}</span>
                  <span className="text-[10px] text-white/10 font-mono font-black">{p.year}</span>
                </div>
                <h3 className={`${isHero ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'} font-serif italic text-white group-hover:text-[#d4a373] transition-colors duration-500`}>
                  {getProjectField(p, lang, 'title')}
                </h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selected && (
          <ProjectDetail project={selected} onClose={() => setSelected(null)} t={t} lang={lang} />
        )}
      </AnimatePresence>
    </div>
  );
};

const ProjectDetail = ({ project, onClose, t, lang }: { project: Project, onClose: () => void, t: any, lang: Language }) => {
  const isRtl = lang === 'ar';
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black overflow-y-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="sticky top-0 z-[110] flex justify-between items-center px-6 py-8 md:px-12 bg-black/95 backdrop-blur-2xl border-b border-white/5">
        <div className={isRtl ? 'text-right' : 'text-left'}>
          <span className="text-[9px] text-[#d4a373] uppercase tracking-[0.5em] font-black block mb-2">{getProjectField(project, lang, 'cat')}</span>
          <h2 className="text-xl md:text-4xl font-serif italic text-white">{getProjectField(project, lang, 'title')}</h2>
        </div>
        <button onClick={onClose} className="bg-white/5 hover:bg-white text-white hover:text-black p-5 rounded-full transition-all duration-500"><X size={28} /></button>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-60 pt-16">
        <div className="w-full aspect-video mb-12 overflow-hidden rounded-[4rem] border border-white/5 shadow-2xl relative group">
          <img src={project.img} className="w-full h-full object-cover" alt="" />
          {project.videoUrl && (
            <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-black scale-90 group-hover:scale-100 transition-transform">
                <Play size={32} fill="currentColor" />
              </div>
            </a>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 border-y border-white/5 py-12 text-white/80">
          <div><span className="text-[9px] text-[#d4a373] uppercase block font-black mb-3 tracking-widest"><Calendar size={12}/> {t.projects.year}</span><span className="text-lg">{project.year}</span></div>
          <div><span className="text-[9px] text-[#d4a373] uppercase block font-black mb-3 tracking-widest"><MapPin size={12}/> {t.projects.location}</span><span className="text-lg">{project.location}</span></div>
          <div><span className="text-[9px] text-[#d4a373] uppercase block font-black mb-3 tracking-widest"><Maximize2 size={12}/> {t.projects.scale}</span><span className="text-lg">{project.scale}</span></div>
          <div><span className="text-[9px] text-[#d4a373] uppercase block font-black mb-3 tracking-widest"><Briefcase size={12}/> {t.projects.role}</span><span className="text-lg">{getProjectField(project, lang, 'role')}</span></div>
        </div>

        {/* Golden Architectural Toolkit Bar */}
        {(project.model3dUrl || project.max3dUrl || project.presentationUrl || project.videoUrl) && (
          <div className="flex flex-wrap gap-4 mb-32 p-10 bg-white/[0.02] border border-white/5 rounded-[3rem]">
              <div className="w-full mb-6">
                <span className="text-[8px] uppercase tracking-[0.6em] text-white/30 font-black">{t.admin.fields.assets}</span>
              </div>
              {project.model3dUrl && (
                  <a href={project.model3dUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-black/40 border border-[#d4a373]/20 px-8 py-5 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#d4a373] hover:text-black transition-all group shadow-xl">
                      <Box size={18} className="text-[#d4a373] group-hover:text-black transition-colors"/> {t.project.assets.view3d}
                  </a>
              )}
              {project.max3dUrl && (
                  <a href={project.max3dUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-black/40 border border-[#d4a373]/20 px-8 py-5 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#d4a373] hover:text-black transition-all group shadow-xl">
                      <Cuboid size={18} className="text-[#d4a373] group-hover:text-black transition-colors" /> {t.project.assets.viewMax}
                  </a>
              )}
              {project.presentationUrl && (
                  <a href={project.presentationUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-black/40 border border-[#d4a373]/20 px-8 py-5 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#d4a373] hover:text-black transition-all group shadow-xl">
                      <Presentation size={18} className="text-[#d4a373] group-hover:text-black transition-colors"/> {t.project.assets.viewPresentation}
                  </a>
              )}
              {project.videoUrl && (
                  <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-black/40 border border-[#d4a373]/20 px-8 py-5 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#d4a373] hover:text-black transition-all group shadow-xl">
                      <Video size={18} className="text-[#d4a373] group-hover:text-black transition-colors"/> {t.project.assets.viewVideo}
                  </a>
              )}
          </div>
        )}

        {getStoryField(project.story, lang, 'decision') && (
          <div className="mb-32 text-center border border-[#d4a373]/20 bg-[#d4a373]/5 p-20 rounded-[5rem] relative">
            <Quote className="text-[#d4a373]/20 absolute top-10 left-10" size={64} />
            <p className="font-serif italic text-3xl md:text-5xl text-white/90 leading-[1.2]">
              "{getStoryField(project.story, lang, 'decision')}"
            </p>
            <span className="mt-12 block text-[10px] uppercase tracking-[0.8em] text-[#d4a373] font-black">{t.projects.decision}</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-32 mb-40">
          <div className="space-y-16">
            <div>
              <h3 className="text-[#d4a373] text-[10px] uppercase mb-8 font-black flex items-center gap-3 tracking-[0.4em]"><Info size={14}/> {t.projects.challenge}</h3>
              <p className="font-light text-xl text-white/60 leading-relaxed italic">{getStoryField(project.story, lang, 'challenge')}</p>
            </div>
            <div>
              <h3 className="text-[#d4a373] text-[10px] uppercase mb-8 font-black flex items-center gap-3 tracking-[0.4em]"><Lightbulb size={14}/> {t.projects.concept}</h3>
              <p className="font-serif italic text-4xl text-white leading-tight">"{getStoryField(project.story, lang, 'concept')}"</p>
            </div>
          </div>
          <div className="bg-white/[0.02] p-16 rounded-[4rem] border border-white/5">
            <h3 className="text-[#d4a373] text-[10px] uppercase mb-10 font-black flex items-center gap-3 tracking-[0.4em]"><CheckCircle size={14}/> {t.projects.solution}</h3>
            <p className="font-light text-white/60 text-lg leading-relaxed italic">{getStoryField(project.story, lang, 'solution')}</p>
          </div>
        </div>

        {/* Gallery & Blueprints Sections */}
        {(project.gallery && project.gallery.length > 0 || project.blueprints && project.blueprints.length > 0) && (
          <div className="space-y-40 mb-40">
            {project.gallery && project.gallery.length > 0 && (
              <div className="space-y-12">
                <h3 className="text-[#d4a373] text-[10px] uppercase font-black flex items-center gap-3 tracking-[0.4em]"><Layers size={14}/> {t.project.gallery}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {project.gallery.map((url: string, i: number) => url && (
                    <div key={i} className="rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#111] aspect-[4/3] group">
                      <img src={url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {project.blueprints && project.blueprints.length > 0 && (
              <div className="space-y-12">
                <h3 className="text-[#d4a373] text-[10px] uppercase font-black flex items-center gap-3 tracking-[0.4em]"><Compass size={14}/> {t.project.blueprints}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {project.blueprints.map((url: string, i: number) => url && (
                    <div key={i} className="rounded-[2.5rem] overflow-hidden border border-white/5 bg-white/5 p-4 group">
                      <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-black/40">
                         <img src={url} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-1000" alt="" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <ProjectComments projectId={project.id} staticReviews={project.reviews} />
        
        <div className="mt-60 border-t border-white/5 pt-24 flex justify-center">
          <button onClick={onClose} className="bg-white text-black px-24 py-8 rounded-full text-[11px] font-black uppercase tracking-[0.6em] hover:bg-[#d4a373] transition-all">
            {t.project.back}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
