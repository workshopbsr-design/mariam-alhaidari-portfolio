import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../language-context';
import {
  X,
  Layers,
  Image as ImageIcon,
  Info,
  GitBranch,
  PenTool,
  CheckCircle,
} from 'lucide-react';
import { PROJECTS } from './data';

/* ================= PROJECTS LIST ================= */

export const Projects = () => {
  const { lang } = useLang();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Interior', 'Architecture', 'Decor'];

  const filteredProjects =
    filter === 'All'
      ? PROJECTS
      : PROJECTS.filter((p) => p.catEn === filter);

  const getTitle = (p: any) =>
    lang === 'ar' ? p.titleAr : lang === 'tr' ? p.titleTr : p.titleEn;

  const getCat = (p: any) =>
    lang === 'ar' ? p.catAr : lang === 'tr' ? p.catTr : p.catEn;

  const getDesc = (p: any) =>
    lang === 'ar' ? p.descAr : lang === 'tr' ? p.descTr : p.descEn;

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <h2 className="text-xs uppercase tracking-[0.8em] text-white/30">
            PROJECTS
          </h2>

          <div className="flex flex-wrap gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-[10px] uppercase tracking-widest px-4 py-2 rounded-full border transition-all ${
                  filter === cat
                    ? 'bg-[#d4a373] border-[#d4a373] text-black font-bold'
                    : 'border-white/10 text-white/50 hover:border-white/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredProjects.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setSelectedProject(p)}
              >
                <div className="aspect-[3/4] overflow-hidden bg-[#111] mb-6">
                  <img
                    src={p.img}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    alt={getTitle(p)}
                  />
                </div>

                <span className="text-[9px] text-[#d4a373] uppercase tracking-widest">
                  {getCat(p)}
                </span>
                <h3 className="text-2xl font-serif italic mt-2 mb-2">
                  {getTitle(p)}
                </h3>
                <p className="text-xs text-white/50 line-clamp-2">
                  {getDesc(p)}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-xl">
            <Layers className="text-white/20 mb-4" size={48} />
            <p className="text-white/40 uppercase tracking-widest text-xs">
              No projects found
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            lang={lang}
          />
        )}
      </AnimatePresence>
    </>
  );
};

/* ================= PROJECT DETAIL ================= */

const ProjectDetail = ({
  project,
  onClose,
  lang,
}: {
  project: any;
  onClose: () => void;
  lang: string;
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const getTitle = () =>
    lang === 'ar'
      ? project.titleAr
      : lang === 'tr'
      ? project.titleTr
      : project.titleEn;

  const getDesc = () =>
    lang === 'ar'
      ? project.descAr
      : lang === 'tr'
      ? project.descTr
      : project.descEn;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 z-[100] bg-[#0A0A0A] overflow-y-auto"
    >
      <div className="sticky top-0 flex justify-between items-center px-6 py-6 bg-black/90 backdrop-blur border-b border-white/5">
        <h2 className="text-xl font-serif italic">{getTitle()}</h2>
        <button
          onClick={onClose}
          className="bg-white/5 hover:bg-white/10 p-3 rounded-full"
        >
          <X size={20} />
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">
        <img src={project.img} className="w-full mb-12" />
        <p className="text-lg text-white/70">{getDesc()}</p>
      </div>
    </motion.div>
  );
};

/* ================= HELPERS ================= */

const Section = ({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) => (
  <div>
    <h3 className="flex items-center gap-2 text-[#d4a373] text-xs uppercase tracking-[0.2em] mb-4">
      {icon} {title}
    </h3>
    <p className="text-white/70">{children}</p>
  </div>
);
