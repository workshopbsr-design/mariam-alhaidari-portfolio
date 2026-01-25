import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { PROJECTS as STATIC_PROJECTS } from '../data/projects.data';
import { Project, AboutInfo } from '../types/schema';

export const useSyncData = (defaultAbout: AboutInfo) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [aboutInfo, setAboutInfo] = useState<AboutInfo>(defaultAbout);
  const [contactInfo, setContactInfo] = useState<any>({});
  const [isHydrated, setIsHydrated] = useState(false);

  // 1️⃣ Hydrate once from localStorage (fast first paint)
  useEffect(() => {
    try {
      const p = localStorage.getItem('local_projects');
      const a = localStorage.getItem('general_about');
      const c = localStorage.getItem('general_contact');

      if (p) setProjects(JSON.parse(p));
      else setProjects(STATIC_PROJECTS);

      if (a) setAboutInfo(JSON.parse(a));
      if (c) setContactInfo(JSON.parse(c));
    } catch {
      setProjects(STATIC_PROJECTS);
    }

    setIsHydrated(true);
  }, []);

  // 2️⃣ Firebase = single source of truth
  useEffect(() => {
    if (!db || !isHydrated) return;

    const unsubProjects = onSnapshot(
      query(collection(db, 'projects'), orderBy('createdAt', 'desc')),
      snap => {
        const cloud = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Project[];
        setProjects(cloud);
        localStorage.setItem('local_projects', JSON.stringify(cloud));
      }
    );

    const unsubGeneral = onSnapshot(
      collection(db, 'general'),
      snap => {
        snap.forEach(doc => {
          const data = doc.data();
          if (doc.id === 'about') {
            setAboutInfo(data as AboutInfo);
            localStorage.setItem('general_about', JSON.stringify(data));
          }
          if (doc.id === 'contact') {
            setContactInfo(data);
            localStorage.setItem('general_contact', JSON.stringify(data));
          }
        });
      }
    );

    return () => {
      unsubProjects();
      unsubGeneral();
    };
  }, [isHydrated]);

  return { projects, aboutInfo, contactInfo };
};
