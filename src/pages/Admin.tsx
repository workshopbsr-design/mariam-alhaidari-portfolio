
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Save, Loader2, Camera, Palette, Type, X, 
  PlusCircle, Trash2, Edit3, ImageIcon, Video, Box, Presentation, 
  Compass, Layers, FileText, Type as TypeIcon, Cuboid, 
  Zap, Info, Lightbulb, Lock, Unlock, AlertCircle, 
  MapPin, Calendar, Maximize2, Briefcase, Globe
} from 'lucide-react';
import { useLang } from '../context/language-context';
import { db } from '../services/firebase';
import { doc, setDoc, updateDoc, deleteDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { AboutInfo, Project } from '../types/schema';

const FONT_OPTIONS = {
  serif: [
    { name: 'Bodoni Moda', value: "'Bodoni Moda', serif" },
    { name: 'Playfair Display', value: "'Playfair Display', serif" },
    { name: 'Cormorant Garamond', value: "'Cormorant Garamond', serif" }
  ],
  sans: [
    { name: 'Plus Jakarta Sans', value: "'Plus Jakarta Sans', sans-serif" },
    { name: 'Inter', value: "'Inter', sans-serif" },
    { name: 'Montserrat', value: "'Montserrat', sans-serif" }
  ],
  arabic: [
    { name: 'Amiri', value: "'Amiri', serif" },
    { name: 'Cairo', value: "'Cairo', sans-serif" },
    { name: 'Tajawal', value: "'Tajawal', sans-serif" }
  ]
};

// Fix: Explicitly included 'contact' in props and used type assertion for 'about' default value to satisfy TypeScript constraints
export const Admin = ({ about = {} as AboutInfo, projects = [], onRefresh, contact }: { about?: AboutInfo, projects?: Project[], onRefresh?: () => void, contact?: any }) => {
  const { t, isRtl, lang } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [loginStatus, setLoginStatus] = useState<'idle' | 'checking' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'studio' | 'works'>('studio');
  const [isSaving, setIsSaving] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [aboutData, setAboutData] = useState<AboutInfo>({ ...about } as AboutInfo);

  useEffect(() => {
    const hasHandshake = location.state?.secretAccess;
    if (!isAuthenticated && !hasHandshake) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  useEffect(() => { 
    setAboutData({ ...about } as AboutInfo); 
  }, [about]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginStatus === 'checking') return;
    setLoginStatus('checking');
    setTimeout(() => {
      if (pin === '2025') {
        setIsAuthenticated(true);
        setLoginStatus('idle');
      } else {
        setLoginStatus('error');
        setPin('');
        setTimeout(() => setLoginStatus('idle'), 2000);
      }
    }, 850);
  };

  const handleSaveIdentity = async () => {
    setIsSaving(true);
    try {
      if (db) await setDoc(doc(db, "general", "about"), aboutData);
      localStorage.setItem(`general_about`, JSON.stringify(aboutData));
      alert(t.common.success);
      if (onRefresh) onRefresh();
    } catch (e) { console.error(e); } finally { setIsSaving(false); }
  };

  const handleProjectSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setIsSaving(true);
    try {
      const pData = { 
        ...editingProject, 
        updatedAt: serverTimestamp(),
        gallery: editingProject.gallery || [],
        blueprints: editingProject.blueprints || [],
        tools: Array.isArray(editingProject.tools) ? editingProject.tools : (editingProject.tools || "").split(",").map((s: string) => s.trim())
      };

      if (editingProject.id && !editingProject.id.startsWith('p')) {
        const { id, ...rest } = pData;
        await updateDoc(doc(db, "projects", id), rest);
      } else {
        pData.createdAt = serverTimestamp();
        await addDoc(collection(db, "projects"), pData);
      }
      setEditingProject(null);
      if (onRefresh) onRefresh();
    } catch (e) { console.error(e); } finally { setIsSaving(false); }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1, x: loginStatus === 'error' ? [0, -10, 10, -10, 10, 0] : 0 }} 
          transition={{ duration: 0.4 }}
          className="max-w-md w-full bg-white/[0.02] border border-[#d4a373]/20 p-12 rounded-[3.5rem] text-center backdrop-blur-3xl shadow-2xl relative overflow-hidden"
        >
          <div className={`absolute inset-0 bg-gradient-to-b transition-opacity duration-1000 ${loginStatus === 'checking' ? 'from-[#d4a373]/5 opacity-100' : 'from-transparent opacity-0'}`} />
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div key={loginStatus} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex justify-center mb-8">
                {loginStatus === 'checking' ? <Unlock className="text-[#d4a373] animate-pulse" size={72} strokeWidth={1} /> : 
                 loginStatus === 'error' ? <AlertCircle className="text-red-500" size={72} strokeWidth={1} /> : 
                 <Lock className="text-[#d4a373]/40" size={72} strokeWidth={1} />}
              </motion.div>
            </AnimatePresence>
            <h2 className="text-3xl font-serif italic text-white mb-2 tracking-tight">
              {loginStatus === 'checking' ? (isRtl ? 'جاري فتح الخزنة...' : 'Unlocking Vault...') : t.admin.vaultAccess}
            </h2>
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-black mb-8">
              {loginStatus === 'error' ? (isRtl ? 'الرمز غير صحيح' : 'Invalid Credentials') : (isRtl ? 'أتيليه مريم' : 'Atelier Mariam')}
            </p>
            <form onSubmit={handleLogin} className="space-y-8">
              <input type="password" value={pin} onChange={e => setPin(e.target.value)} disabled={loginStatus === 'checking'} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-center text-3xl tracking-[0.5em] text-[#d4a373] outline-none focus:border-[#d4a373] transition-all" placeholder="••••" autoFocus />
              <button type="submit" disabled={loginStatus === 'checking' || !pin} className="w-full py-6 rounded-2xl font-black uppercase tracking-[0.4em] transition-all shadow-xl text-xs flex items-center justify-center gap-3 bg-[#d4a373] text-black hover:bg-white">
                {loginStatus === 'checking' && <Loader2 className="animate-spin" size={18} />}
                {loginStatus === 'checking' ? (isRtl ? 'تحقق...' : 'VERIFYING...') : t.admin.authorize}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pt-48 pb-32" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row justify-between items-center mb-24 gap-8">
        <div>
          <h2 className="text-6xl font-serif italic text-white mb-2">{t.admin.title}</h2>
          <p className="text-[#d4a373] text-[10px] uppercase tracking-[0.6em] font-black">{t.admin.manageShowcase}</p>
        </div>
        <div className="flex gap-4 p-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
            <button onClick={() => setActiveTab('studio')} className={`px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === 'studio' ? 'bg-[#d4a373] text-black shadow-lg shadow-[#d4a373]/30' : 'text-white/30 hover:text-white'}`}>
                {t.admin.tabs.studio}
            </button>
            <button onClick={() => setActiveTab('works')} className={`px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === 'works' ? 'bg-[#d4a373] text-black shadow-lg shadow-[#d4a373]/30' : 'text-white/30 hover:text-white'}`}>
                {t.admin.tabs.works}
            </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'studio' ? (
          <motion.div key="studio" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid lg:grid-cols-3 gap-16 items-start">
            <div className="lg:col-span-2 space-y-12">
                {/* Profile Image */}
                <div className="bg-white/[0.02] p-12 rounded-[4rem] border border-[#d4a373]/20 space-y-8">
                    <h3 className="text-[#d4a373] uppercase text-[10px] font-black tracking-[0.5em] flex items-center gap-4 mb-4"><Camera size={18}/> {t.admin.portrait}</h3>
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="w-48 h-64 bg-black/40 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
                            {aboutData.profileImage && <img src={aboutData.profileImage} className="w-full h-full object-cover" alt="Preview" />}
                        </div>
                        <div className="flex-1 space-y-4 w-full">
                            <label className="text-[10px] uppercase text-white/30 tracking-widest block font-black">{t.admin.portraitLabel}</label>
                            <input className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-[#d4a373] font-mono text-xs" value={aboutData.profileImage || ''} onChange={e => setAboutData({...aboutData, profileImage: e.target.value})} />
                        </div>
                    </div>
                </div>

                {/* Typography Engine */}
                <div className="bg-white/[0.02] p-12 rounded-[4rem] border border-white/5 space-y-12">
                    <h3 className="text-[#d4a373] uppercase text-[10px] font-black tracking-[0.5em] flex items-center gap-4"><Palette size={18}/> {t.admin.visualIdentity}</h3>
                    
                    <div className="space-y-10">
                        {/* Global Scale */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] uppercase text-white/40 tracking-[0.4em] font-black flex items-center gap-3"><TypeIcon size={14} /> {t.admin.labels.fontSize}</label>
                                <span className="text-[#d4a373] font-mono font-bold">{aboutData.fontSize || 16}px</span>
                            </div>
                            <input type="range" min="12" max="24" step="1" className="w-full accent-[#d4a373] bg-white/5 h-1 rounded-lg appearance-none cursor-pointer" value={aboutData.fontSize || 16} onChange={e => setAboutData({...aboutData, fontSize: e.target.value})} />
                        </div>

                        {/* Name Scale */}
                        <div className="space-y-6 pt-6 border-t border-white/5">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] uppercase text-white/40 tracking-[0.4em] font-black flex items-center gap-3"><Type size={14} /> {isRtl ? 'حجم اسم المعماري' : 'Architect Name Scale'}</label>
                                <span className="text-[#d4a373] font-mono font-bold">{aboutData.nameFontSize || 80}px</span>
                            </div>
                            <input type="range" min="40" max="150" step="2" className="w-full accent-[#d4a373] bg-white/5 h-1 rounded-lg appearance-none cursor-pointer" value={aboutData.nameFontSize || 80} onChange={e => setAboutData({...aboutData, nameFontSize: e.target.value})} />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 pt-6 border-t border-white/5">
                        {['fontSerif', 'fontSans', 'fontArabic'].map(f => (
                            <div key={f} className="space-y-4">
                                <label className="text-[9px] uppercase text-white/20 tracking-widest font-black block">{(t.admin.labels as any)[f]}</label>
                                <select className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#d4a373]" value={(aboutData as any)[f]} onChange={e => setAboutData({...aboutData, [f]: e.target.value})}>
                                    {(FONT_OPTIONS as any)[f.replace('font','').toLowerCase()].map((opt: any) => <option key={opt.value} value={opt.value} className="bg-black">{opt.name}</option>)}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Professional Bio */}
                <div className="bg-white/[0.02] p-12 rounded-[4rem] border border-white/5 space-y-8">
                    <h3 className="text-[#d4a373] uppercase text-[10px] font-black tracking-[0.5em] flex items-center gap-4"><Type size={18}/> {t.admin.professionalBio}</h3>
                    <input placeholder="Name (EN)" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white" value={aboutData.nameEn || ''} onChange={e => setAboutData({...aboutData, nameEn: e.target.value})} />
                    <input placeholder="الاسم (عربي)" dir="rtl" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white" value={aboutData.nameAr || ''} onChange={e => setAboutData({...aboutData, nameAr: e.target.value})} />
                    <textarea placeholder="Bio (EN)" rows={4} className="w-full bg-black/40 border border-white/10 p-6 rounded-3xl text-white" value={aboutData.bioEn || ''} onChange={e => setAboutData({...aboutData, bioEn: e.target.value})} />
                    <textarea placeholder="النبذة المهنية (عربي)" dir="rtl" rows={4} className="w-full bg-black/40 border border-white/10 p-6 rounded-3xl text-white" value={aboutData.bioAr || ''} onChange={e => setAboutData({...aboutData, bioAr: e.target.value})} />
                    <input className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white font-mono text-xs" value={aboutData.resumeUrl || ''} onChange={e => setAboutData({...aboutData, resumeUrl: e.target.value})} placeholder="Portfolio PDF Link" />
                </div>
            </div>

            {/* Sidebar Save - Harmonized with overall layout */}
            <div className="lg:sticky lg:top-40 h-fit space-y-6">
                <button onClick={handleSaveIdentity} disabled={isSaving} className="w-full bg-[#d4a373] text-black py-8 rounded-[2rem] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-4 hover:bg-white transition-all shadow-2xl">
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} {t.admin.saveBtn}
                </button>
                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] text-center">
                    <p className="text-[8px] uppercase tracking-widest text-white/20 font-black">{isRtl ? 'آخر تحديث للهوية' : 'Identity Last Updated'}</p>
                    <p className="text-[#d4a373] font-mono text-xs mt-2">{new Date().toLocaleDateString()}</p>
                </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="works" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="flex justify-between items-center mb-16">
                <h3 className="text-4xl font-serif italic text-white">{t.admin.orchestration}</h3>
                <button onClick={() => setEditingProject({ 
                    titleEn: '', titleAr: '', catEn: 'Interior', year: '2025', location: '', scale: '',
                    gallery: [], blueprints: [], videoUrl: "", model3dUrl: "", max3dUrl: "", presentationUrl: "", img: "", tools: "",
                    story: { decisionEn: '', challengeEn: '', conceptEn: '', solutionEn: '', decisionAr: '', challengeAr: '', conceptAr: '', solutionAr: '' }
                })} className="bg-[#d4a373] text-black px-12 py-6 rounded-full text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-4 shadow-2xl">
                    <PlusCircle size={20}/> {t.admin.newWork}
                </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {projects.map((p: Project) => (
                    <div key={p.id} className="bg-white/[0.02] border border-white/5 rounded-[3.5rem] p-8 group hover:border-[#d4a373]/40 transition-all">
                        <div className="aspect-[16/10] bg-black/40 rounded-[2rem] mb-8 overflow-hidden relative shadow-2xl">
                            <img src={p.img} className="w-full h-full object-cover opacity-30 group-hover:opacity-100 transition-all" alt="" />
                            <div className="absolute top-6 right-6 flex gap-3">
                                <button onClick={() => setEditingProject(p)} className="p-4 bg-black/80 rounded-full text-[#d4a373] border border-white/10"><Edit3 size={18}/></button>
                                <button onClick={() => {if(window.confirm(t.common.deleteConfirm)) deleteDoc(doc(db!, "projects", p.id)).then(onRefresh)}} className="p-4 bg-black/80 rounded-full text-red-500 border border-white/10"><Trash2 size={18}/></button>
                            </div>
                        </div>
                        <h4 className="text-white font-serif italic text-3xl mb-3">{lang === 'ar' ? p.titleAr || p.titleEn : p.titleEn}</h4>
                    </div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STRICT DOCKED FOOTER MODAL FOR PROJECTS */}
      <AnimatePresence>
        {editingProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 lg:p-12">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#0A0A0A] border border-[#d4a373]/20 w-full max-w-7xl rounded-[4rem] shadow-2xl relative flex flex-col h-full max-h-[92vh] overflow-hidden">
                
                {/* Fixed Header - Never scrolls */}
                <div className="p-8 lg:px-16 lg:py-10 border-b border-white/5 flex justify-between items-center bg-black/40 flex-shrink-0">
                    <div>
                        <h2 className="text-4xl font-serif italic text-white">{editingProject.id ? t.admin.editVision : t.admin.newWork}</h2>
                        <span className="text-[9px] uppercase tracking-widest text-[#d4a373] font-black">{t.admin.orchestration}</span>
                    </div>
                    <button onClick={() => setEditingProject(null)} className="p-5 hover:bg-white/5 rounded-full text-white/40 transition-all flex-shrink-0"><X size={32}/></button>
                </div>
                
                {/* Scrollable Form Content - The only part that scrolls */}
                <form id="project-form" onSubmit={handleProjectSave} className="flex-1 overflow-y-auto p-8 lg:p-20 scrollbar-hide space-y-24">
                    <div className="space-y-12">
                        <h3 className="text-[#d4a373] text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-4 border-b border-[#d4a373]/20 pb-4"><Info size={18}/> {t.admin.fields.basicInfo}</h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            <div className="space-y-4">
                                <label className="text-[9px] uppercase text-white/20 font-black flex items-center gap-2"><Globe size={12}/> {t.admin.fields.title}</label>
                                <input required className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-[#d4a373]" value={editingProject.titleEn} onChange={e => setEditingProject({...editingProject, titleEn: e.target.value})} placeholder="Title (EN)" />
                                <input dir="rtl" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-[#d4a373]" value={editingProject.titleAr} onChange={e => setEditingProject({...editingProject, titleAr: e.target.value})} placeholder="العنوان (عربي)" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4"><label className="text-[9px] uppercase text-white/20 font-black flex items-center gap-2"><Calendar size={12}/> {t.admin.fields.year}</label><input className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-[#d4a373]" value={editingProject.year} onChange={e => setEditingProject({...editingProject, year: e.target.value})} /></div>
                                <div className="space-y-4"><label className="text-[9px] uppercase text-white/20 font-black flex items-center gap-2"><Maximize2 size={12}/> {t.admin.fields.scale}</label><input className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-[#d4a373]" value={editingProject.scale} onChange={e => setEditingProject({...editingProject, scale: e.target.value})} /></div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[9px] uppercase text-white/20 font-black flex items-center gap-2"><MapPin size={12}/> {t.admin.fields.location}</label>
                                <input className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-[#d4a373]" value={editingProject.location} onChange={e => setEditingProject({...editingProject, location: e.target.value})} />
                                <input className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white mt-4 outline-none focus:border-[#d4a373]" value={editingProject.tools} onChange={e => setEditingProject({...editingProject, tools: e.target.value})} placeholder={t.admin.fields.tools} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/[0.01] p-12 rounded-[3.5rem] border border-white/5 space-y-16">
                        <h3 className="text-[#d4a373] text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-4 border-b border-[#d4a373]/20 pb-4"><Zap size={18}/> {t.admin.fields.assets}</h3>
                        <div className="grid lg:grid-cols-2 gap-16">
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase text-white/40 tracking-widest font-black flex items-center gap-3"><ImageIcon size={14} className="text-[#d4a373]" /> {t.admin.fields.img}</label>
                                    <input className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white font-mono text-xs outline-none focus:border-[#d4a373]" value={editingProject.img || ''} onChange={e => setEditingProject({...editingProject, img: e.target.value})} placeholder="https://..." />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase text-white/40 tracking-widest font-black flex items-center gap-3"><Video size={14} className="text-[#d4a373]" /> {t.admin.fields.video}</label>
                                    <input className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white font-mono text-xs outline-none focus:border-[#d4a373]" value={editingProject.videoUrl || ''} onChange={e => setEditingProject({...editingProject, videoUrl: e.target.value})} placeholder="YouTube / Vimeo URL" />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase text-white/40 tracking-widest font-black flex items-center gap-3"><Box size={14} className="text-[#d4a373]" /> {t.admin.fields.model3d}</label>
                                    <input className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white font-mono text-xs outline-none focus:border-[#d4a373]" value={editingProject.model3dUrl || ''} onChange={e => setEditingProject({...editingProject, model3dUrl: e.target.value})} placeholder="Sketchfab / Matterport URL" />
                                </div>
                            </div>
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase text-white/40 tracking-widest font-black flex items-center gap-3"><Cuboid size={14} className="text-[#d4a373]" /> {t.admin.fields.max3d}</label>
                                    <input className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white font-mono text-xs outline-none focus:border-[#d4a373]" value={editingProject.max3dUrl || ''} onChange={e => setEditingProject({...editingProject, max3dUrl: e.target.value})} placeholder="Direct Asset Link (.max, .obj, .zip)" />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase text-white/40 tracking-widest font-black flex items-center gap-3"><Presentation size={14} className="text-[#d4a373]" /> {t.admin.fields.presentation}</label>
                                    <input className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white font-mono text-xs outline-none focus:border-[#d4a373]" value={editingProject.presentationUrl || ''} onChange={e => setEditingProject({...editingProject, presentationUrl: e.target.value})} placeholder="PDF / PowerPoint Cloud Link" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-16 pb-12">
                        <h3 className="text-[#d4a373] text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-4 border-b border-[#d4a373]/20 pb-4"><Lightbulb size={18}/> {t.admin.fields.narrative}</h3>
                        <div className="grid lg:grid-cols-2 gap-16">
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <label className="text-[9px] uppercase text-white/30 font-black">{t.projects.decision} (EN / AR)</label>
                                    <textarea rows={2} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-[#d4a373]" value={editingProject.story.decisionEn} onChange={e => setEditingProject({...editingProject, story: {...editingProject.story, decisionEn: e.target.value}})} placeholder="Key Decision (EN)" />
                                    <textarea dir="rtl" rows={2} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-[#d4a373]" value={editingProject.story.decisionAr} onChange={e => setEditingProject({...editingProject, story: {...editingProject.story, decisionAr: e.target.value}})} placeholder="القرار الجوهري (عربي)" />
                                </div>
                            </div>
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <label className="text-[9px] uppercase text-white/30 font-black">{t.projects.concept} (EN / AR)</label>
                                    <textarea rows={2} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-[#d4a373]" value={editingProject.story.conceptEn} onChange={e => setEditingProject({...editingProject, story: {...editingProject.story, conceptEn: e.target.value}})} placeholder="The Concept (EN)" />
                                    <textarea dir="rtl" rows={2} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-[#d4a373]" value={editingProject.story.conceptAr} onChange={e => setEditingProject({...editingProject, story: {...editingProject.story, conceptAr: e.target.value}})} placeholder="المفهوم (عربي)" />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* FIXED DOCKED FOOTER - Strictly outside the scrollable area */}
                <div className="bg-[#0A0A0A] py-8 lg:py-10 border-t border-white/5 flex justify-end gap-6 px-8 lg:px-16 z-[100] backdrop-blur-3xl flex-shrink-0">
                    <button type="button" onClick={() => setEditingProject(null)} className="px-10 py-5 rounded-full text-white/30 font-black uppercase tracking-widest text-[10px] hover:text-white transition-all flex-shrink-0">{t.admin.fields.discard}</button>
                    <button 
                        form="project-form"
                        type="submit"
                        disabled={isSaving} 
                        className="bg-[#d4a373] text-black px-16 lg:px-24 py-5 rounded-full font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-4 hover:bg-white transition-all shadow-2xl flex-shrink-0 min-w-[200px]"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} {t.admin.fields.save}
                    </button>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
