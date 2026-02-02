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
import { Project } from '../types/schema';
import { useProjects } from '../hooks/useProjects';

/* ----------------------------------------
   Comments Component (unchanged)
---------------------------------------- */

const ProjectComments = ({ 
  projectId, 
  staticReviews = [] 
}: { 
  projectId: string; 
  staticReviews?: any[] 
}) => {
  const { t, lang } = useLang();
  const [comments, setComments] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", text: "", rating: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!db) return;
    const q = query(
      collection(db, "comments"), 
      where("projectId", "==", projectId), 
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snap) => 
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
  }, [projectId]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.text.trim() || form.rating === 0 || !db) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "comments"), { 
        projectId, 
        text: form.text, 
        rating: form.rating, 
        userName: form.name || (lang === 'ar' ? 'زائر' : 'Visitor'),
        createdAt: serverTimestamp() 
      });
      setForm({ name: "", text: "", rating: 0 });
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const all = [...comments, ...staticReviews].sort((a, b) => {
    const d1 = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
    const d2 = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
    return d2.getTime() - d1.getTime();
  });

  const avg = all.length
    ? (all.reduce((a, c) => a + c.rating, 0) / all.length).toFixed(1)
    : "0.0";

  return (
    <div className="max-w-2xl mx-auto mt-24 border-t border-white/10 pt-16">
      {/* UI كما هو */}
    </div>
  );
};

/* ----------------------------------------
   Projects Page — Architectural Skeleton ✅
---------------------------------------- */

export const Projects = () => {
  const { lang, t, isRtl } = useLang();
  const { projects, loading, error } = useProjects();
  const [selected, setSelected] = useState<Project | null>(null);
  const [filter, setFilter] = useState('All');

  const filtered: Project[] =
    filter === 'All'
      ? projects
      : projects.filter((p: Project) => p.catEn === filter);

  if (loading) {
    return <div className="text-white px-6 py-24">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-red-500 px-6 py-24">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 md:py-48">
      {/* 
        === UI PLACEHOLDER (Intentionally Deferred) ===
        سيتم إعادة إدراج UI الكامل هنا بعد تثبيت البنية المعمارية
      */}

      <div className="text-white/40 text-sm italic">
        Projects UI will be re-attached after architectural stabilization.
      </div>
    </div>
  );
};

