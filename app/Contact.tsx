import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Instagram, MapPin, ArrowUpRight, Send, User, Tag, MessageSquare, Lock } from 'lucide-react';
import { useLang } from '../language-context';

export const Contact = ({ info }: { info: any }) => {
  const { t, lang, isRtl } = useLang();
  
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    type: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `New Inquiry: ${formState.type} - ${formState.name}`;
    const body = `Name: ${formState.name}%0D%0AEmail: ${formState.email}%0D%0AType: ${formState.type}%0D%0A%0D%0AMessage:%0D%0A${formState.message}`;
    window.location.href = `mailto:${info.email}?subject=${subject}&body=${body}`;
  };

  const getAddress = () => {
    if (lang === 'ar') return info.addressAr;
    if (lang === 'tr') return info.addressTr;
    return info.addressEn;
  };

  const contactList = [
    { icon: Phone, label: lang === 'ar' ? 'هاتف / واتساب' : 'Phone / WhatsApp', value: info.phone, link: `tel:${info.phone}` },
    { icon: Mail, label: lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address', value: info.email, link: `mailto:${info.email}` },
    { icon: Instagram, label: 'Instagram', value: info.instagram, link: `https://instagram.com/${info.instagram.replace('@','')}` },
    { icon: MapPin, label: lang === 'ar' ? 'الموقع' : (lang === 'tr' ? 'Konum' : 'Location'), value: getAddress(), link: '#' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        
        {/* Left Side: Info */}
        <motion.div
          initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-xs uppercase tracking-[0.8em] text-[#d4a373] mb-8">
            {t.nav.contact}
          </h2>
          <h3 className="text-4xl md:text-5xl lg:text-7xl font-serif italic mb-6 leading-tight">
            {t.contact.title}
          </h3>
          <p className="text-white/50 mb-12 font-light text-base md:text-lg">
             {lang === 'ar' 
               ? "نحن هنا لتحويل الأفكار المجردة إلى واقع ملموس. تواصل معنا لمناقشة مشروعك القادم."
               : (lang === 'tr' 
                   ? "Soyut fikirleri somut gerçekliğe dönüştürmek için buradayız. Bir sonraki projenizi tartışmak için iletişime geçin."
                   : "We are here to translate abstract ideas into tangible reality. Get in touch to discuss your next project.")}
          </p>
          
          <div className="grid gap-6 md:gap-8">
            {contactList.map((item, idx) => (
              <a 
                key={idx}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between border-b border-white/10 pb-6 hover:border-[#d4a373] transition-colors"
              >
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="p-3 md:p-4 bg-white/5 rounded-full group-hover:bg-[#d4a373]/10 transition-colors">
                    <item.icon size={18} className="text-[#d4a373]" />
                  </div>
                  <div>
                    <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-1">{item.label}</span>
                    <p className="text-lg md:text-xl font-light break-all">{item.value}</p>
                  </div>
                </div>
                <ArrowUpRight className="text-white/20 group-hover:text-[#d4a373] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.02] p-6 md:p-12 rounded-3xl border border-white/5 sticky top-24"
        >
          <div className="flex items-center gap-3 mb-8">
             <div className="w-2 h-2 rounded-full bg-[#d4a373]"></div>
             <h4 className="text-xl font-serif italic">{t.contact.subtitle}</h4>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
               <label className="flex items-center gap-2 mb-2"><User size={12} /> {t.contact.form.name}</label>
               <input 
                 required
                 type="text" 
                 value={formState.name}
                 onChange={e => setFormState({...formState, name: e.target.value})}
                 className="bg-black/20 focus:bg-black/40"
               />
            </div>

            <div className="relative">
               <label className="flex items-center gap-2 mb-2"><Mail size={12} /> {t.contact.form.email}</label>
               <input 
                 required
                 type="email" 
                 value={formState.email}
                 onChange={e => setFormState({...formState, email: e.target.value})}
                 className="bg-black/20 focus:bg-black/40"
               />
            </div>

            <div className="relative">
               <label className="flex items-center gap-2 mb-2"><Tag size={12} /> {t.contact.form.type}</label>
               <select 
                 required
                 value={formState.type}
                 onChange={e => setFormState({...formState, type: e.target.value})}
                 className="bg-black/20 focus:bg-black/40 appearance-none"
               >
                 <option value="" disabled className="bg-[#0A0A0A] text-gray-500">Select...</option>
                 {t.contact.types.map((type: string) => (
                   <option key={type} value={type} className="bg-[#0A0A0A]">{type}</option>
                 ))}
               </select>
            </div>

            <div className="relative">
               <label className="flex items-center gap-2 mb-2"><MessageSquare size={12} /> {t.contact.form.message}</label>
               <textarea 
                 required
                 rows={4} 
                 value={formState.message}
                 onChange={e => setFormState({...formState, message: e.target.value})}
                 className="bg-black/20 focus:bg-black/40 resize-none"
               />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#d4a373] text-black font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-[#c29365] transition-colors flex justify-center items-center gap-2 mt-4"
            >
              <Send size={16} /> {t.contact.form.send}
            </button>
            
            <p className="flex items-center justify-center gap-2 text-[10px] text-white/30 uppercase tracking-widest mt-6">
              <Lock size={10} /> {t.contact.confidentiality}
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
