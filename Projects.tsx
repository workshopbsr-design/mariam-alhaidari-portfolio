
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from './language-context';
import { X, ChevronRight, ChevronLeft, Layers, Image as ImageIcon, Video, Box, ExternalLink, Filter, PenTool, Lightbulb, CheckCircle, Info, GitBranch, Quote, Star, MessageSquare, Send, User, Trophy } from 'lucide-react';
import { db } from './app/firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore';

// --- NEW COMPONENT: PROJECT COMMENTS ---
const ProjectComments = ({ projectId, staticReviews = [] }: { projectId: string, staticReviews?: any[] }) => {
    const { t, lang, isRtl } = useLang();
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(0);
    const [newName, setNewName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        let unsubscribe = () => {};

        if (db) {
            // FIREBASE MODE: Real-time updates
            const q = query(
                collection(db, "comments"), 
                where("projectId", "==", projectId),
                orderBy("createdAt", "desc")
            );
            
            unsubscribe = onSnapshot(q, (snapshot) => {
                const loadedComments = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setComments(loadedComments);
            }, (err) => console.log("Comments error (likely offline):", err));
        } else {
            // LOCAL STORAGE MODE (Fallback)
            const localKey = `comments_${projectId}`;
            const localComments = JSON.parse(localStorage.getItem(localKey) || '[]');
            setComments(localComments.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        }

        return () => unsubscribe();
    }, [projectId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!newComment.trim() || newRating === 0) return;
        setIsSubmitting(true);

        const commentData = {
            projectId,
            text: newComment,
            rating: newRating,
            userName: newName || (lang === 'ar' ? 'زائر' : 'Visitor'),
            createdAt: new Date().toISOString(),
            id: Date.now().toString() // Add explicit ID for local storage to allow deletion
        };

        if (db) {
            try {
                // Remove ID before sending to Firebase (Firebase generates its own)
                const { id, ...firebaseData } = commentData;
                await addDoc(collection(db, "comments"), {
                    ...firebaseData,
                    createdAt: serverTimestamp() 
                });
            } catch (error) {
                console.error("Error adding comment: ", error);
            }
        } else {
            // Local Storage Fallback
            const localKey = `comments_${projectId}`;
            const existing = JSON.parse(localStorage.getItem(localKey) || '[]');
            const updated = [commentData, ...existing];
            localStorage.setItem(localKey, JSON.stringify(updated));
            setComments(updated); // Update UI manually
        }

        setNewComment("");
        setNewRating(0);
        setNewName("");
        setIsSubmitting(false);
    };

    // Combine Static and Dynamic Comments for Display
    const allComments = [...comments, ...staticReviews].sort((a,b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
    });

    // Calculate Average
    const averageRating = allComments.length > 0 
        ? (allComments.reduce((acc, curr) => acc + curr.rating, 0) / allComments.length).toFixed(1)
        : "0.0";

    return (
        <div className="max-w-2xl mx-auto mt-24 border-t border-white/10 pt-16">
            <h3 className="flex items-center gap-3 text-[#d4a373] text-xs uppercase tracking-[0.2em] mb-12 justify-center">
                <MessageSquare size={14} /> {t.reviews.title}
            </h3>

            {/* Average Rating Display */}
            <div className="flex flex-col items-center mb-12">
                 <div className="flex items-end gap-2 mb-2">
                     <span className="text-5xl font-serif font-bold text-white">{averageRating}</span>
                     <span className="text-xl text-white/40 font-serif mb-1">/ 5.0</span>
                 </div>
                 <div className="flex gap-1 mb-2">
                     {[1, 2, 3, 4, 5].map((star) => (
                         <Star 
                            key={star} 
                            size={18} 
                            className={star <= Math.round(Number(averageRating)) ? "text-[#d4a373] fill-[#d4a373]" : "text-white/10"} 
                         />
                     ))}
                 </div>
                 <p className="text-xs text-white/40 uppercase tracking-widest">
                     {t.reviews.basedOn} {allComments.length} {t.reviews.reviewsCount}
                 </p>
            </div>

            {/* Input Form */}
            <div className="bg-white/[0.03] p-6 rounded-lg border border-white/5 mb-12">
                <h4 className="text-sm font-serif italic mb-6 text-white/80">{t.reviews.addBtn}</h4>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <input 
                            type="text" 
                            placeholder={t.reviews.placeholderName}
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="bg-black/30 border border-white/10 rounded-lg p-3 text-sm focus:border-[#d4a373] outline-none flex-1"
                        />
                        <div className="flex items-center gap-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2">
                             {[1, 2, 3, 4, 5].map((star) => (
                                 <button 
                                    key={star}
                                    type="button"
                                    onClick={() => setNewRating(star)}
                                    className={`transition-all ${newRating >= star ? 'text-[#d4a373] scale-110' : 'text-white/20 hover:text-white/50'}`}
                                 >
                                     <Star size={16} fill={newRating >= star ? "currentColor" : "none"} />
                                 </button>
                             ))}
                        </div>
                    </div>
                    <textarea 
                        placeholder={t.reviews.placeholderComment}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm focus:border-[#d4a373] outline-none resize-none"
                    />
                    <div className="flex justify-end">
                        <button 
                            type="submit" 
                            disabled={isSubmitting || newRating === 0}
                            className="bg-[#d4a373] text-black px-6 py-2 rounded-full text-[10px] uppercase font-bold tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                           {t.reviews.submit} <Send size={12} />
                        </button>
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="space-y-6">
                {allComments.length === 0 ? (
                    <p className="text-center text-white/30 text-xs italic">{t.reviews.noReviews}</p>
                ) : (
                    allComments.map((c, idx) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={c.id || idx} 
                            className="border-b border-white/5 pb-6 last:border-0"
                        >
                            <div className="flex justify-between items-baseline mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[#d4a373]">
                                        <User size={12} />
                                    </div>
                                    <span className="text-xs font-bold text-white/80">{c.userName}</span>
                                </div>
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={10} className={i < c.rating ? "text-[#d4a373] fill-[#d4a373]" : "text-white/10"} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm font-light text-white/60 leading-relaxed pl-8">
                                "{c.text}"
                            </p>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export const Projects = ({ projects }: { projects: any[] }) => {
  const { lang, t } = useLang();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Interior', 'Architecture', 'Decor'];
  
  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.catEn === filter);

  const getTitle = (p: any) => lang === 'ar' ? p.titleAr : (lang === 'tr' ? p.titleTr : p.titleEn);
  const getCat = (p: any) => lang === 'ar' ? p.catAr : (lang === 'tr' ? p.catTr : p.catEn);
  const getScope = (p: any) => lang === 'ar' ? p.scopeAr : (lang === 'tr' ? p.scopeTr : p.scopeEn);
  const getDesc = (p: any) => lang === 'ar' ? p.descAr : (lang === 'tr' ? p.descTr : p.descEn);

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <h2 className="text-xs uppercase tracking-[0.8em] text-white/30">
            {t.nav.projects}
            </h2>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`text-[10px] uppercase tracking-widest px-4 py-2 rounded-full border transition-all ${
                            filter === cat 
                            ? 'bg-[#d4a373] border-[#d4a373] text-black font-bold' 
                            : 'border-white/10 text-white/50 hover:border-white/30'
                        }`}
                    >
                        {cat === 'All' ? t.projects.filterAll : cat}
                    </button>
                ))}
            </div>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredProjects.map((p, i) => (
              <motion.div 
                layout
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setSelectedProject(p)}
              >
                <div className="aspect-[3/4] overflow-hidden bg-[#111] mb-6 relative">
                  <img 
                    src={p.img} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                    loading="lazy"
                    alt={getTitle(p)}
                  />
                  
                  {(p.scopeEn || p.scopeAr) && (
                    <div className="absolute top-4 right-4 z-20">
                         <span className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-[8px] uppercase tracking-[0.2em] text-white/90">
                            {getScope(p) || p.scopeEn}
                        </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end items-start">
                    <span className="text-[#d4a373] tracking-widest text-[9px] uppercase mb-4 border border-[#d4a373] px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 delay-100">
                      {t.project.viewProject}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                      <span className="text-[9px] text-[#d4a373] uppercase tracking-widest">
                          {getCat(p)}
                      </span>
                      <span className="text-[9px] text-white/30 font-mono">{p.year}</span>
                  </div>
                  <h3 className="text-2xl font-serif italic mb-2 group-hover:text-[#d4a373] transition-colors">
                    {getTitle(p)}
                  </h3>
                  <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
                       {getDesc(p)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-xl">
             <Layers className="text-white/20 mb-4" size={48} />
             <p className="text-white/40 uppercase tracking-widest text-xs">
               {lang === 'ar' ? 'لا توجد مشاريع في هذا القسم حالياً' : lang === 'tr' ? 'Bu kategoride proje bulunamadı' : 'No projects found in this category'}
             </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
            t={t} 
            lang={lang} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

const ProjectDetail = ({ project, onClose, t, lang }: any) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const getRole = (p: any) => lang === 'ar' ? p.roleAr : (lang === 'tr' ? p.roleTr : p.roleEn);
  const getStory = (key: string) => {
    if (!project.story) return '';
    return lang === 'ar' ? project.story[`${key}Ar`] : (lang === 'tr' ? project.story[`${key}Tr`] : project.story[`${key}En`]);
  };
  const getCaption = (item: any) => lang === 'ar' ? item.captionAr : (lang === 'tr' ? item.captionTr : item.captionEn);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 z-[100] bg-[#0A0A0A] overflow-y-auto"
    >
        <div className="sticky top-0 z-50 flex justify-between items-center px-6 py-6 md:px-12 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/5">
          <div>
            <span className="text-[10px] text-[#d4a373] uppercase tracking-widest block mb-1">
                {lang === 'ar' ? project.catAr : (lang === 'tr' ? project.catTr : project.catEn)}
            </span>
            <h2 className="text-xl md:text-2xl font-serif italic text-white">
              {lang === 'ar' ? project.titleAr : (lang === 'tr' ? project.titleTr : project.titleEn)}
            </h2>
          </div>
          <button onClick={onClose} className="group bg-white/5 hover:bg-white/10 p-3 rounded-full transition-all flex items-center gap-2">
            <span className="text-[9px] uppercase tracking-widest hidden md:block group-hover:text-white/80 transition-colors">
                {lang === 'ar' ? 'إغلاق' : (lang === 'tr' ? 'Kapat' : 'Close')}
            </span>
            <X size={20} className="text-white/60 group-hover:text-white" />
          </button>
        </div>

        <div className="max-w-5xl mx-auto px-6 pb-32">
            <div className="w-full aspect-video mt-8 mb-16 overflow-hidden">
                <img src={project.img} className="w-full h-full object-cover" alt={project.titleEn} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 border-y border-white/10 py-8">
                <div>
                    <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2">{t.projects.year}</span>
                    <span className="text-sm">{project.year || '2024'}</span>
                </div>
                <div>
                    <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2">{t.projects.location}</span>
                    <span className="text-sm">{project.location || 'Riyadh'}</span>
                </div>
                <div>
                    <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2">{t.projects.scale}</span>
                    <span className="text-sm">{project.scale || 'N/A'}</span>
                </div>
                <div>
                    <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2">{t.projects.role}</span>
                    <span className="text-sm">{getRole(project)}</span>
                </div>
            </div>

            {getStory('decision') && (
              <div className="mb-20">
                <div className="border border-[#d4a373]/30 bg-[#d4a373]/5 p-6 md:p-8 rounded-sm relative">
                    <div className="absolute -top-3 left-6 bg-[#0A0A0A] px-2 text-[#d4a373] text-[9px] uppercase tracking-[0.2em] flex items-center gap-2">
                        <GitBranch size={12} /> {t.projects.decision}
                    </div>
                    <p className="font-serif italic text-xl md:text-2xl text-white/90 leading-relaxed">
                        "{getStory('decision')}"
                    </p>
                </div>
              </div>
            )}

            {project.story && (
                <div className="grid md:grid-cols-2 gap-16 mb-24">
                    <div className="space-y-8">
                        <div>
                            <h3 className="flex items-center gap-2 text-[#d4a373] text-xs uppercase tracking-[0.2em] mb-4">
                                <Info size={14} /> {t.projects.challenge}
                            </h3>
                            <p className="font-light leading-relaxed text-lg text-white/80">
                                {getStory('challenge')}
                            </p>
                        </div>
                        <div>
                            <h3 className="flex items-center gap-2 text-[#d4a373] text-xs uppercase tracking-[0.2em] mb-4">
                                <Lightbulb size={14} /> {t.projects.concept}
                            </h3>
                            <p className="font-serif italic text-2xl text-white/90 leading-relaxed">
                                "{getStory('concept')}"
                            </p>
                        </div>
                    </div>
                    <div className="bg-white/[0.03] p-8 rounded-sm border-l border-white/10">
                         <h3 className="flex items-center gap-2 text-[#d4a373] text-xs uppercase tracking-[0.2em] mb-6">
                            <CheckCircle size={14} /> {t.projects.solution}
                        </h3>
                        <p className="font-light leading-relaxed text-white/70 mb-8">
                            {getStory('solution')}
                        </p>
                        
                        <div className="mt-8 pt-8 border-t border-white/5">
                            <span className="text-[9px] text-white/30 uppercase tracking-widest block mb-3">{t.projects.tools}</span>
                            <div className="flex flex-wrap gap-2">
                                {project.tools?.map((tool: string, idx: number) => (
                                    <span key={idx} className="text-[10px] px-3 py-1 bg-white/10 rounded-full">{tool}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {project.process && project.process.length > 0 && (
                <div className="mb-24">
                    <h3 className="flex items-center gap-2 text-[#d4a373] text-xs uppercase tracking-[0.2em] mb-12 justify-center">
                        <PenTool size={14} /> {t.projects.process}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        {project.process.map((item: any, idx: number) => (
                            <div key={idx}>
                                <div className="bg-white p-2 rounded-sm mb-4">
                                    <img src={item.url} className="w-full h-auto mix-blend-multiply contrast-125 grayscale" alt={getCaption(item)} />
                                </div>
                                <p className="text-center text-[10px] uppercase tracking-widest text-white/40">
                                    {getCaption(item)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {getStory('reflection') && (
                <div className="mb-24 max-w-3xl mx-auto text-center relative py-12">
                    <Quote className="absolute top-0 left-0 text-[#d4a373]/20" size={48} />
                    <h3 className="text-[#d4a373] text-[10px] uppercase tracking-[0.3em] mb-6">{t.projects.reflection}</h3>
                    <p className="font-serif italic text-xl md:text-2xl leading-relaxed text-white/80">
                        "{getStory('reflection')}"
                    </p>
                    <Quote className="absolute bottom-0 right-0 text-[#d4a373]/20 rotate-180" size={48} />
                </div>
            )}

            <div className="space-y-8 mb-24">
                 <h3 className="flex items-center gap-2 text-[#d4a373] text-xs uppercase tracking-[0.2em] mb-8">
                    <ImageIcon size={14} /> {t.project.gallery}
                </h3>
                {project.gallery?.map((img: string, idx: number) => (
                    <div key={idx} className="w-full">
                        <img src={img} className="w-full h-auto" alt={`Gallery ${idx}`} />
                    </div>
                ))}
            </div>

            <ProjectComments projectId={project.id} staticReviews={project.reviews} />

            <div className="border-t border-white/10 pt-12 flex justify-between mt-12">
                <button onClick={onClose} className="text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                    {t.project.back}
                </button>
            </div>
        </div>
    </motion.div>
  );
};
