
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, Save, X, Sparkles, Phone, Mail, Globe, MapPin, CheckCircle, Image as ImageIcon, FileText, Video, Box, Layers, BookOpen, PenTool, GitBranch, User, Quote, Link, Type, Lock, Cloud, AlertTriangle, CloudOff, MessageSquare, Star, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { useLang } from '../language-context';
import { GoogleGenAI } from "@google/genai";
import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, setDoc, query, onSnapshot, orderBy, getDocs } from 'firebase/firestore';

const ArrayInput = ({ items, onChange, placeholder, label }: any) => {
  const [currentVal, setCurrentVal] = useState('');
  const add = () => {
    if(currentVal.trim()) {
      onChange([...(items || []), currentVal.trim()]);
      setCurrentVal('');
    }
  };
  const remove = (idx: number) => {
    onChange(items.filter((_: any, i: number) => i !== idx));
  };
  return (
    <div className="space-y-3">
      <label>{label}</label>
      <div className="flex gap-2">
        <input 
          value={currentVal} 
          onChange={(e) => setCurrentVal(e.target.value)}
          placeholder={placeholder}
          className="flex-1 min-w-0"
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <button onClick={add} type="button" className="bg-[#d4a373] text-black px-4 rounded-xl font-bold shrink-0">+</button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {items?.map((item: string, idx: number) => (
          <div key={idx} className="bg-white/10 px-3 py-1 rounded-md text-xs flex items-center gap-2 max-w-full">
            <span className="truncate max-w-[150px] md:max-w-[200px]">{item}</span>
            <button onClick={() => remove(idx)} className="text-red-400 hover:text-red-300 shrink-0"><X size={12} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Admin = ({ projects, contact, about, theme, isFirebaseConnected, onRefresh }: any) => {
  const { t, lang } = useLang();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '2025') {
      setIsAuthenticated(true);
    } else {
      setError(lang === 'ar' ? 'الرمز غير صحيح' : 'Incorrect Access Key');
      setPin('');
    }
  };

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'works' | 'info' | 'studio' | 'reviews'>('works');
  const [modalTab, setModalTab] = useState<'basic' | 'story' | 'visuals' | 'technical' | 'immersive'>('basic');
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const [formData, setFormData] = useState<any>({
    titleEn: '', titleAr: '', titleTr: '', catEn: '', catAr: '', catTr: '', scopeEn: '', scopeAr: '', scopeTr: '', img: '', descEn: '', descAr: '', descTr: '',
    gallery: [], blueprints: [], videoUrl: '', model3dUrl: '', presentationUrl: '',
    story: { 
      challengeEn: '', challengeAr: '', challengeTr: '', 
      conceptEn: '', conceptAr: '', conceptTr: '', 
      solutionEn: '', solutionAr: '', solutionTr: '', 
      decisionEn: '', decisionAr: '', decisionTr: '', 
      reflectionEn: '', reflectionAr: '', reflectionTr: '' 
    },
    tools: []
  });
  
  const [contactData, setContactData] = useState(contact);
  const [aboutData, setAboutData] = useState(about);
  const [themeData, setThemeData] = useState(theme || { serif: 'Bodoni Moda', sans: 'Plus Jakarta Sans', arabic: 'Noto Kufi Arabic' });
  const [allReviews, setAllReviews] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'reviews') {
        fetchReviews();
    }
  }, [isAuthenticated, activeTab]);

  const fetchReviews = async () => {
       if (db && isFirebaseConnected) {
           const q = query(collection(db, "comments"), orderBy("createdAt", "desc"));
           const snap = await getDocs(q);
           const data = snap.docs.map(d => ({id: d.id, ...d.data()}));
           setAllReviews(data);
       } else {
           const reviews: any[] = [];
           for(let i=0; i<localStorage.length; i++) {
               const key = localStorage.key(i);
               if(key?.startsWith('comments_')) {
                   const raw = JSON.parse(localStorage.getItem(key) || '[]');
                   const projId = key.replace('comments_', '');
                   const withId = raw.map((r: any) => ({...r, projectId: projId}));
                   reviews.push(...withId);
               }
           }
           setAllReviews(reviews.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
       }
  };

  const deleteReview = async (id: string, projectId: string) => {
    if(window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا التعليق؟' : 'Delete this review?')) {
        if (db && isFirebaseConnected) {
            await deleteDoc(doc(db, "comments", id));
            setAllReviews(prev => prev.filter(r => r.id !== id));
        } else {
            const key = `comments_${projectId}`;
            const existing = JSON.parse(localStorage.getItem(key) || '[]');
            const updated = existing.filter((r: any) => r.id !== id); 
            localStorage.setItem(key, JSON.stringify(updated));
            setAllReviews(prev => prev.filter(r => r.id !== id));
        }
    }
  };

  const handleSaveProject = async () => {
    setIsSaving(true);
    try {
        if (db && isFirebaseConnected) {
             if (editingId === 'new') {
                 await addDoc(collection(db, "projects"), formData);
             } else {
                 await updateDoc(doc(db, "projects", editingId!), formData);
             }
        } else {
             const existing = JSON.parse(localStorage.getItem('arc_projects') || '[]');
             if (editingId === 'new') {
                 const newProj = { ...formData, id: Date.now().toString() };
                 localStorage.setItem('arc_projects', JSON.stringify([newProj, ...existing]));
             } else {
                 const updated = existing.map((p: any) => p.id === editingId ? { ...formData, id: editingId } : p);
                 localStorage.setItem('arc_projects', JSON.stringify(updated));
             }
             if(onRefresh) onRefresh();
        }
        setEditingId(null);
        resetForm();
        triggerToast();
    } catch (e) {
        console.error("Error saving project:", e);
    } finally {
        setIsSaving(false);
    }
  };

  const handleSaveContact = async () => {
    setIsSaving(true);
    try {
        if (db && isFirebaseConnected) {
            await setDoc(doc(db, "general", "contact"), contactData);
        } else {
            localStorage.setItem('arc_contact', JSON.stringify(contactData));
            if(onRefresh) onRefresh();
        }
        triggerToast();
    } catch(e) { console.error(e); }
    finally { setIsSaving(false); }
  };

  const handleSaveAbout = async () => {
    setIsSaving(true);
    try {
        if (db && isFirebaseConnected) {
            await setDoc(doc(db, "general", "about"), aboutData);
            await setDoc(doc(db, "general", "theme"), themeData);
        } else {
            localStorage.setItem('arc_about', JSON.stringify(aboutData));
            localStorage.setItem('arc_theme', JSON.stringify(themeData));
            if(onRefresh) onRefresh();
        }
        triggerToast();
    } catch(e) { console.error(e); }
    finally { setIsSaving(false); }
  };

  const confirmDeleteProject = async () => {
    if(!deletingId) return;
    try {
        if (db && isFirebaseConnected) {
            await deleteDoc(doc(db, "projects", deletingId));
        } else {
             const existing = JSON.parse(localStorage.getItem('arc_projects') || '[]');
             const updated = existing.filter((p: any) => p.id !== deletingId);
             localStorage.setItem('arc_projects', JSON.stringify(updated));
             if(onRefresh) onRefresh();
        }
        triggerToast();
    } catch (e) {
        console.error("Delete failed", e);
    } finally {
        setDeletingId(null);
    }
  };

  const triggerToast = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const resetForm = () => {
    setFormData({ 
      titleEn: '', titleAr: '', titleTr: '', catEn: '', catAr: '', catTr: '', scopeEn: '', scopeAr: '', scopeTr: '', img: '', descEn: '', descAr: '', descTr: '',
      gallery: [], blueprints: [], videoUrl: '', model3dUrl: '', presentationUrl: '',
      story: { challengeEn: '', challengeAr: '', challengeTr: '', conceptEn: '', conceptAr: '', conceptTr: '', solutionEn: '', solutionAr: '', solutionTr: '', decisionEn: '', decisionAr: '', decisionTr: '', reflectionEn: '', reflectionAr: '', reflectionTr: '' },
      tools: []
    });
    setModalTab('basic');
  };

  const startEdit = (p: any) => {
    setFormData({
      ...p,
      scopeEn: p.scopeEn || '', scopeAr: p.scopeAr || '', scopeTr: p.scopeTr || '',
      titleTr: p.titleTr || '', catTr: p.catTr || '', descTr: p.descTr || '',
      gallery: p.gallery || [],
      blueprints: p.blueprints || [],
      tools: p.tools || [],
      story: {
        ...{ challengeEn: '', challengeAr: '', challengeTr: '', conceptEn: '', conceptAr: '', conceptTr: '', solutionEn: '', solutionAr: '', solutionTr: '', decisionEn: '', decisionAr: '', decisionTr: '', reflectionEn: '', reflectionAr: '', reflectionTr: '' },
        ...(p.story || {})
      },
      videoUrl: p.videoUrl || '',
      model3dUrl: p.model3dUrl || '',
      presentationUrl: p.presentationUrl || ''
    });
    setEditingId(p.id);
    setModalTab('basic');
  };

  const generateWithAi = async (type: 'descEn' | 'descAr' | 'descTr') => {
    const concept = formData.titleEn || formData.titleAr;
    if (!concept) return alert('Please enter a title first');
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let targetLang = 'English';
      if (type === 'descAr') targetLang = 'Arabic';
      if (type === 'descTr') targetLang = 'Turkish';
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a minimalist architectural critic. Write a poetic, sophisticated architectural description in ${targetLang} for a project titled "${concept}". Focus on materiality and soul. Max 45 words.`,
      });
      setFormData({ ...formData, [type]: response.text });
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const generateBioAi = async (field: 'bioEn' | 'bioAr' | 'bioTr' | 'philosophyEn' | 'philosophyAr' | 'philosophyTr') => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let langPrompt = 'English';
      if (field.endsWith('Ar')) langPrompt = 'Arabic';
      if (field.endsWith('Tr')) langPrompt = 'Turkish';
      const typePrompt = field.includes('bio') ? 'professional architect biography' : 'architectural design philosophy';
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write a sophisticated, short, and poetic ${typePrompt} in ${langPrompt}. Emphasize spatial intelligence and human emotion. Max 50 words.`,
      });
      setAboutData({ ...aboutData, [field]: response.text });
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const getProjectName = (projId: string) => {
    const proj = projects.find((p: any) => p.id === projId);
    return proj ? (lang === 'ar' ? proj.titleAr : proj.titleEn) : projId;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center px-6">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="bg-black/40 backdrop-blur-3xl border border-white/10 p-12 rounded-[3rem] max-w-md w-full text-center shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative overflow-hidden"
        >
          {/* Subtle accent light */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#d4a373]/10 blur-[80px] rounded-full"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-[#d4a373]/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-[#d4a373]/20">
                <ShieldCheck className="text-[#d4a373]" size={32} />
            </div>
            
            <h2 className="text-2xl font-serif italic mb-2 tracking-wide text-white">Studio Vault</h2>
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-10">Restricted Workspace</p>
            
            <form onSubmit={handleLogin} className="space-y-6">
                <div className="relative group">
                    <input 
                      type="password" 
                      placeholder="ACCESS KEY" 
                      value={pin} 
                      onChange={e => setPin(e.target.value)} 
                      className="text-center tracking-[0.8em] text-xl font-bold bg-white/5 border-white/10 hover:border-[#d4a373]/40 focus:border-[#d4a373] transition-all py-6 rounded-2xl" 
                      autoFocus 
                    />
                </div>
                {error && (
                    <motion.p 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="text-red-400 text-[9px] uppercase tracking-widest font-bold"
                    >
                        {error}
                    </motion.p>
                )}
                <button 
                    type="submit" 
                    className="w-full bg-[#d4a373] text-black py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#d4a373]/10"
                >
                    Authorize Access
                </button>
            </form>
            
            <p className="mt-12 text-[8px] uppercase tracking-[0.5em] text-white/10">Mariam Al-Haidari Studio &copy; 2025</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 pt-32 pb-20">
      <div className={`mb-8 p-4 rounded-xl border flex items-center gap-4 ${isFirebaseConnected ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
          {isFirebaseConnected ? <Cloud size={20} /> : <CloudOff size={20} />}
          <div>
              <h4 className="font-bold text-xs uppercase tracking-widest">{isFirebaseConnected ? 'Cloud Active' : 'Offline Mode'}</h4>
              <p className="text-xs opacity-70">{isFirebaseConnected ? 'Changes synced to Firebase.' : 'Changes saved to Local Browser only.'}</p>
          </div>
      </div>

      <div className="flex gap-8 border-b border-white/5 mb-12 overflow-x-auto no-scrollbar">
        {[
          { id: 'works', label: t.admin.projects },
          { id: 'studio', label: t.admin.studio },
          { id: 'reviews', label: t.admin.reviews },
          { id: 'info', label: t.admin.contact }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)} 
            className={`pb-4 text-[10px] uppercase tracking-[0.4em] transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-[#d4a373] border-b-2 border-[#d4a373]' : 'text-white/30 hover:text-white'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'works' && (
        <>
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif italic mb-2">{t.admin.title}</h2>
              <p className="text-white/40 text-[10px] uppercase tracking-[0.4em]">Manage Portfolio</p>
            </div>
            <button onClick={() => { setEditingId('new'); resetForm(); }} className="flex items-center gap-2 bg-[#d4a373] text-black px-6 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#d4a373]/20">
              <Plus size={16} /> {t.admin.addBtn}
            </button>
          </div>
          <div className="grid gap-6">
            {projects.map((p: any) => (
              <motion.div layout key={p.id} className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between group hover:bg-white/[0.05] transition-all gap-6">
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/40 shrink-0">
                    <img src={p.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <div>
                    <h4 className="font-serif italic text-xl">{lang === 'ar' ? p.titleAr : (lang === 'tr' ? p.titleTr : p.titleEn)}</h4>
                    <p className="text-[10px] text-[#d4a373] uppercase tracking-widest mt-1 opacity-70">{lang === 'ar' ? p.catAr : (lang === 'tr' ? p.catTr : p.catEn)} • {p.year}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(p)} className="p-4 hover:bg-white/10 rounded-xl transition-colors text-white/40 hover:text-white"><Edit3 size={18} /></button>
                  <button onClick={() => setDeletingId(p.id)} className="p-4 hover:bg-red-500/10 text-white/40 hover:text-red-400 rounded-xl transition-colors"><Trash2 size={18} /></button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'reviews' && (
           <div className="space-y-6">
              <h3 className="text-3xl font-serif italic mb-2">{t.admin.reviews}</h3>
              {allReviews.length === 0 ? <p className="text-white/40 italic">No reviews yet.</p> : (
                  <div className="grid gap-4">
                      {allReviews.map((review, i) => (
                          <div key={i} className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row justify-between gap-4">
                              <div>
                                  <div className="flex items-center gap-3 mb-2">
                                      <span className="font-bold text-[#d4a373]">{review.userName}</span>
                                      <div className="flex gap-1">
                                           {[...Array(5)].map((_, i) => (<Star key={i} size={12} className={i < review.rating ? "text-[#d4a373] fill-[#d4a373]" : "text-white/10"} />))}
                                      </div>
                                      <span className="text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded">Project: {getProjectName(review.projectId)}</span>
                                  </div>
                                  <p className="text-sm text-white/70 italic">"{review.text}"</p>
                              </div>
                              <button onClick={() => deleteReview(review.id, review.projectId)} className="self-end md:self-center p-2 text-white/20 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                          </div>
                      ))}
                  </div>
              )}
           </div>
      )}

      {activeTab === 'studio' && (
         <div className="space-y-12">
            <div className="flex justify-between items-center mb-12">
                <div><h3 className="text-3xl font-serif italic mb-2">{t.admin.studio}</h3></div>
                <button onClick={handleSaveAbout} disabled={isSaving} className="flex items-center gap-2 bg-[#d4a373] text-black px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest disabled:opacity-50 transition-all hover:scale-105">
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                  {isSaving ? 'Saving...' : t.admin.save}
                </button>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="md:col-span-2 bg-white/[0.02] p-8 rounded-3xl border border-white/5">
                    <label className="text-xs uppercase mb-6 block">Visual Identity & Profile</label>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label>{t.admin.aboutFields.profileImage}</label>
                        <input value={aboutData.profileImage} onChange={e => setAboutData({...aboutData, profileImage: e.target.value})} placeholder="URL" />
                        <div className="mt-4 flex gap-4">
                           <div className="w-16 h-16 rounded-full bg-black/40 border border-white/10 overflow-hidden"><img src={aboutData.profileImage} className="w-full h-full object-cover" /></div>
                           <div className="flex-1"><label>Portfolio PDF (Resume)</label><input value={aboutData.resumeUrl || ''} onChange={e => setAboutData({...aboutData, resumeUrl: e.target.value})} placeholder="URL" /></div>
                        </div>
                      </div>
                      <div className="space-y-4">
                         <div><label>Name (En)</label><input value={aboutData.nameEn || ''} onChange={e => setAboutData({...aboutData, nameEn: e.target.value})} /></div>
                         <div><label>Name (Ar)</label><input value={aboutData.nameAr || ''} onChange={e => setAboutData({...aboutData, nameAr: e.target.value})} dir="rtl" /></div>
                         <div><label>Name (Tr)</label><input value={aboutData.nameTr || ''} onChange={e => setAboutData({...aboutData, nameTr: e.target.value})} /></div>
                      </div>
                    </div>
                </div>

                <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 space-y-6">
                    <div className="flex justify-between items-center"><label>Bio (En)</label><button onClick={() => generateBioAi('bioEn')} className="text-[#d4a373] text-[9px] flex items-center gap-1 hover:text-white transition-all"><Sparkles size={10} /> {isAiLoading ? '...' : 'AI'}</button></div>
                    <textarea value={aboutData.bioEn} onChange={e => setAboutData({...aboutData, bioEn: e.target.value})} rows={3} />
                    <div className="flex justify-between items-center"><label>Bio (Ar)</label><button onClick={() => generateBioAi('bioAr')} className="text-[#d4a373] text-[9px] flex items-center gap-1 hover:text-white transition-all"><Sparkles size={10} /> {isAiLoading ? '...' : 'AI'}</button></div>
                    <textarea value={aboutData.bioAr} onChange={e => setAboutData({...aboutData, bioAr: e.target.value})} rows={3} dir="rtl" />
                    <div className="flex justify-between items-center"><label>Bio (Tr)</label><button onClick={() => generateBioAi('bioTr')} className="text-[#d4a373] text-[9px] flex items-center gap-1 hover:text-white transition-all"><Sparkles size={10} /> {isAiLoading ? '...' : 'AI'}</button></div>
                    <textarea value={aboutData.bioTr} onChange={e => setAboutData({...aboutData, bioTr: e.target.value})} rows={3} />
                </div>

                <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 space-y-6">
                    <div className="flex justify-between items-center"><label>Philosophy (En)</label><button onClick={() => generateBioAi('philosophyEn')} className="text-[#d4a373] text-[9px] flex items-center gap-1 hover:text-white transition-all"><Sparkles size={10} /> AI</button></div>
                    <textarea value={aboutData.philosophyEn} onChange={e => setAboutData({...aboutData, philosophyEn: e.target.value})} rows={3} />
                    <div className="flex justify-between items-center"><label>Philosophy (Ar)</label><button onClick={() => generateBioAi('philosophyAr')} className="text-[#d4a373] text-[9px] flex items-center gap-1 hover:text-white transition-all"><Sparkles size={10} /> AI</button></div>
                    <textarea value={aboutData.philosophyAr} onChange={e => setAboutData({...aboutData, philosophyAr: e.target.value})} rows={3} dir="rtl" />
                    <div className="flex justify-between items-center"><label>Philosophy (Tr)</label><button onClick={() => generateBioAi('philosophyTr')} className="text-[#d4a373] text-[9px] flex items-center gap-1 hover:text-white transition-all"><Sparkles size={10} /> AI</button></div>
                    <textarea value={aboutData.philosophyTr} onChange={e => setAboutData({...aboutData, philosophyTr: e.target.value})} rows={3} />
                </div>
            </div>
         </div>
      )}

      {activeTab === 'info' && (
        <div className="space-y-12">
          <div className="flex justify-between items-center mb-12">
            <div><h3 className="text-3xl font-serif italic mb-2">{t.admin.contact}</h3></div>
            <button onClick={handleSaveContact} className="bg-[#d4a373] text-black px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all hover:scale-105">Save</button>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6 bg-white/[0.02] p-8 rounded-3xl border border-white/5">
              <div><label>Phone</label><input value={contactData.phone} onChange={e => setContactData({...contactData, phone: e.target.value})} /></div>
              <div><label>Email</label><input value={contactData.email} onChange={e => setContactData({...contactData, email: e.target.value})} /></div>
              <div><label>Instagram</label><input value={contactData.instagram} onChange={e => setContactData({...contactData, instagram: e.target.value})} /></div>
            </div>
            <div className="space-y-6 bg-white/[0.02] p-8 rounded-3xl border border-white/5">
              <div><label>Address (En)</label><input value={contactData.addressEn} onChange={e => setContactData({...contactData, addressEn: e.target.value})} /></div>
              <div><label>Address (Ar)</label><input value={contactData.addressAr} onChange={e => setContactData({...contactData, addressAr: e.target.value})} dir="rtl" /></div>
              <div><label>Address (Tr)</label><input value={contactData.addressTr} onChange={e => setContactData({...contactData, addressTr: e.target.value})} /></div>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {deletingId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-6 backdrop-blur-xl">
             <div className="bg-[#0f0f0f] border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center">
                <AlertTriangle size={32} className="mx-auto mb-6 text-red-500" />
                <h3 className="text-xl mb-2">Confirm Deletion</h3>
                <p className="text-white/50 text-sm mb-8">This project will be permanently removed.</p>
                <div className="flex gap-4">
                    <button onClick={() => setDeletingId(null)} className="flex-1 py-3 border border-white/10 rounded-lg">Cancel</button>
                    <button onClick={confirmDeleteProject} className="flex-1 py-3 bg-red-500 rounded-lg font-bold">Delete</button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/95 z-[90] flex items-end md:items-center justify-center md:p-6 backdrop-blur-xl">
            <div className="bg-[#0f0f0f] md:rounded-[2.5rem] rounded-t-[2.5rem] w-full h-full md:h-[90vh] md:max-w-6xl flex flex-col overflow-hidden border-t border-white/10">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
                <h3 className="text-2xl font-serif italic">{editingId === 'new' ? t.admin.addBtn : t.admin.edit}</h3>
                <button onClick={() => setEditingId(null)} className="p-2 opacity-40 hover:opacity-100 transition-all"><X /></button>
              </div>
              <div className="flex px-8 border-b border-white/5 bg-white/[0.02] overflow-x-auto no-scrollbar">
                 {[
                   { id: 'basic', label: t.admin.tabs.basic },
                   { id: 'story', label: t.admin.tabs.story },
                   { id: 'visuals', label: t.admin.tabs.visuals },
                   { id: 'technical', label: t.admin.tabs.technical },
                   { id: 'immersive', label: t.admin.tabs.immersive }
                 ].map(tab => (
                   <button key={tab.id} onClick={() => setModalTab(tab.id as any)} className={`px-6 py-4 text-[10px] uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${modalTab === tab.id ? 'border-[#d4a373] text-[#d4a373] bg-[#d4a373]/5' : 'border-transparent text-white/30 hover:text-white'}`}>{tab.label}</button>
                 ))}
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-12">
                {modalTab === 'basic' && (
                   <div className="grid md:grid-cols-3 gap-8">
                      <div className="space-y-4">
                        <div><label>Title (En)</label><input value={formData.titleEn} onChange={e => setFormData({...formData, titleEn: e.target.value})} /></div>
                        <div><label>Title (Ar)</label><input value={formData.titleAr} onChange={e => setFormData({...formData, titleAr: e.target.value})} dir="rtl" /></div>
                        <div><label>Title (Tr)</label><input value={formData.titleTr || ''} onChange={e => setFormData({...formData, titleTr: e.target.value})} /></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div><label>Year</label><input value={formData.year || ''} onChange={e => setFormData({...formData, year: e.target.value})} /></div>
                          <div><label>Scale</label><input value={formData.scale || ''} onChange={e => setFormData({...formData, scale: e.target.value})} /></div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div><label>Category (En)</label><input value={formData.catEn} onChange={e => setFormData({...formData, catEn: e.target.value})} /></div>
                        <div><label>Category (Ar)</label><input value={formData.catAr} onChange={e => setFormData({...formData, catAr: e.target.value})} dir="rtl" /></div>
                        <div><label>Category (Tr)</label><input value={formData.catTr || ''} onChange={e => setFormData({...formData, catTr: e.target.value})} /></div>
                        <div><label>Location</label><input value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center"><label>Short Desc (En)</label><button onClick={() => generateWithAi('descEn')} className="text-[9px] text-[#d4a373] hover:text-white transition-all"><Sparkles size={10} className="inline mr-1" /> AI</button></div>
                        <textarea value={formData.descEn} onChange={e => setFormData({...formData, descEn: e.target.value})} rows={2} />
                        <div className="flex justify-between items-center"><label>Short Desc (Ar)</label><button onClick={() => generateWithAi('descAr')} className="text-[9px] text-[#d4a373] hover:text-white transition-all"><Sparkles size={10} className="inline mr-1" /> AI</button></div>
                        <textarea value={formData.descAr} onChange={e => setFormData({...formData, descAr: e.target.value})} rows={2} dir="rtl" />
                        <div className="flex justify-between items-center"><label>Short Desc (Tr)</label><button onClick={() => generateWithAi('descTr')} className="text-[9px] text-[#d4a373] hover:text-white transition-all"><Sparkles size={10} className="inline mr-1" /> AI</button></div>
                        <textarea value={formData.descTr || ''} onChange={e => setFormData({...formData, descTr: e.target.value})} rows={2} />
                      </div>
                   </div>
                )}
                {modalTab === 'story' && (
                  <div className="grid md:grid-cols-3 gap-8">
                     <div className="space-y-6">
                        <h4 className="text-[10px] uppercase tracking-widest text-[#d4a373]">English Narrative</h4>
                        <div><label>Challenge</label><textarea value={formData.story.challengeEn} onChange={e => setFormData({...formData, story: {...formData.story, challengeEn: e.target.value}})} rows={2} /></div>
                        <div><label>Concept</label><textarea value={formData.story.conceptEn} onChange={e => setFormData({...formData, story: {...formData.story, conceptEn: e.target.value}})} rows={2} /></div>
                        <div><label>Decision</label><textarea value={formData.story.decisionEn} onChange={e => setFormData({...formData, story: {...formData.story, decisionEn: e.target.value}})} rows={2} /></div>
                     </div>
                     <div className="space-y-6" dir="rtl">
                        <h4 className="text-[10px] uppercase tracking-widest text-[#d4a373] text-right">السرد العربي</h4>
                        <div><label>التحدي</label><textarea value={formData.story.challengeAr} onChange={e => setFormData({...formData, story: {...formData.story, challengeAr: e.target.value}})} rows={2} /></div>
                        <div><label>المفهوم</label><textarea value={formData.story.conceptAr} onChange={e => setFormData({...formData, story: {...formData.story, conceptAr: e.target.value}})} rows={2} /></div>
                        <div><label>القرار الجوهري</label><textarea value={formData.story.decisionAr} onChange={e => setFormData({...formData, story: {...formData.story, decisionAr: e.target.value}})} rows={2} /></div>
                     </div>
                     <div className="space-y-6">
                        <h4 className="text-[10px] uppercase tracking-widest text-[#d4a373]">Türkçe Anlatı</h4>
                        <div><label>Zorluk</label><textarea value={formData.story.challengeTr || ''} onChange={e => setFormData({...formData, story: {...formData.story, challengeTr: e.target.value}})} rows={2} /></div>
                        <div><label>Konsept</label><textarea value={formData.story.conceptTr || ''} onChange={e => setFormData({...formData, story: {...formData.story, conceptTr: e.target.value}})} rows={2} /></div>
                        <div><label>Karar</label><textarea value={formData.story.decisionTr || ''} onChange={e => setFormData({...formData, story: {...formData.story, decisionTr: e.target.value}})} rows={2} /></div>
                     </div>
                  </div>
                )}
                {modalTab === 'visuals' && (
                  <div className="space-y-6">
                     <div><label>Main Cover Image (URL)</label><input value={formData.img} onChange={e => setFormData({...formData, img: e.target.value})} placeholder="https://..." /></div>
                     <ArrayInput label="Project Gallery (Multiple URLs)" items={formData.gallery} onChange={(val: any) => setFormData({...formData, gallery: val})} placeholder="https://..." />
                  </div>
                )}
                {modalTab === 'technical' && (
                  <div className="grid md:grid-cols-2 gap-8">
                    <ArrayInput label="Technical Blueprints (URLs)" items={formData.blueprints} onChange={(val: any) => setFormData({...formData, blueprints: val})} placeholder="https://..." />
                    <ArrayInput label="Software Tools (comma separated)" items={formData.tools} onChange={(val: any) => setFormData({...formData, tools: val})} placeholder="Revit, Rhino..." />
                  </div>
                )}
                {modalTab === 'immersive' && (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div><label>Video Walkthrough (Youtube/Vimeo Link)</label><input value={formData.videoUrl || ''} onChange={e => setFormData({...formData, videoUrl: e.target.value})} /></div>
                    <div><label>3D Model / BIM Viewer Embed URL</label><input value={formData.model3dUrl || ''} onChange={e => setFormData({...formData, model3dUrl: e.target.value})} /></div>
                    <div className="md:col-span-2"><label>External Presentation Link (PDF/Behance)</label><input value={formData.presentationUrl || ''} onChange={e => setFormData({...formData, presentationUrl: e.target.value})} /></div>
                  </div>
                )}
              </div>
              <div className="p-8 border-t border-white/5 flex justify-end gap-4 bg-black/20">
                <button onClick={() => setEditingId(null)} className="px-8 text-white/40 hover:text-white transition-all">Cancel</button>
                <button onClick={handleSaveProject} disabled={isSaving} className="bg-[#d4a373] text-black px-12 py-4 rounded-full font-bold hover:scale-105 transition-all shadow-lg shadow-[#d4a373]/20">
                   {isSaving ? <Loader2 size={18} className="animate-spin inline mr-2" /> : <Save size={18} className="inline mr-2" />} 
                   Save Project
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>{showSavedToast && <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#d4a373] text-black px-8 py-4 rounded-full font-bold z-[100] shadow-2xl flex items-center gap-2"><CheckCircle size={18} /> Update Complete</motion.div>}</AnimatePresence>
    </div>
  );
};
