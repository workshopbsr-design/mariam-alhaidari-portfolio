import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Instagram, MapPin, ArrowUpRight, Send, User, Tag, MessageSquare, Lock } from 'lucide-react';
import { useLang } from '../context/language-context';

export const Contact = ({ info }: { info: any }) => {
  const { t, lang, isRtl } = useLang();
  const [formState, setFormState] = useState({ name: '', email: '', type: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `New Inquiry: ${formState.type} - ${formState.name}`;
    const body = `Name: ${formState.name}%0D%0AEmail: ${formState.email}%0D%0AType: ${formState.type}%0D%0A%0D%0AMessage:%0D%0A${formState.message}`;
    window.location.href = `mailto:${info?.email || 'studio@example.com'}?subject=${subject}&body=${body}`;
  };

  const contactList = [
    { icon: Phone, label: lang === 'ar' ? 'هاتف' : 'Phone', value: info?.phone || '+966 000 000 000', link: `tel:${info?.phone}` },
    { icon: Mail, label: lang === 'ar' ? 'بريد' : 'Email', value: info?.email || 'mariam@atelier.com', link: `mailto:${info?.email}` },
    { icon: Instagram, label: 'Instagram', value: info?.instagram || '@mariam_arch', link: `https://instagram.com/${info?.instagram?.replace('@','')}` },
    { icon: MapPin, label: lang === 'ar' ? 'موقع' : 'Location', value: info?.address || 'Riyadh, KSA', link: '#' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-40">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        <motion.div initial={{ opacity: 0, x: isRtl ? 30 : -30 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-xs uppercase tracking-[0.8em] text-[#d4a373] mb-8 font-bold">{t.nav.contact}</h2>
          <h3 className="text-4xl md:text-5xl lg:text-7xl font-serif italic mb-6 leading-tight text-white">{t.contact.title}</h3>
          <p className="text-white/50 mb-12 font-light text-base md:text-lg">{t.contact.subtitle}</p>
          <div className="grid gap-8">
            {contactList.map((item, idx) => (
              <a key={idx} href={item.link} className="group flex items-center justify-between border-b border-white/10 pb-8 hover:border-[#d4a373] transition-colors">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-[#d4a373]/10 transition-colors">
                    <item.icon size={20} className="text-[#d4a373]" />
                  </div>
                  <div>
                    <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-bold">{item.label}</span>
                    <p className="text-lg md:text-2xl font-light text-white/80">{item.value}</p>
                  </div>
                </div>
                <ArrowUpRight className="text-white/20 group-hover:text-[#d4a373] transition-all" />
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/[0.02] p-10 rounded-[3.5rem] border border-white/5 backdrop-blur-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
               <input required type="text" placeholder={t.contact.form.name} value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-[#d4a373] outline-none transition-all" />
               <input required type="email" placeholder={t.contact.form.email} value={formState.email} onChange={e => setFormState({...formState, email: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-[#d4a373] outline-none transition-all" />
               <select required value={formState.type} onChange={e => setFormState({...formState, type: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-[#d4a373] outline-none transition-all cursor-pointer">
                 <option value="" disabled>{t.contact.form.type}</option>
                 {t.contact.types.map((type: string) => <option key={type} value={type} className="bg-[#0A0A0A]">{type}</option>)}
               </select>
               <textarea required rows={4} placeholder={t.contact.form.message} value={formState.message} onChange={e => setFormState({...formState, message: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-[#d4a373] outline-none transition-all resize-none" />
               <button type="submit" className="w-full bg-white text-black font-black uppercase tracking-[0.3em] py-6 rounded-2xl hover:bg-[#d4a373] transition-all flex justify-center items-center gap-3">
                 <Send size={16} /> {t.contact.form.send}
               </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
