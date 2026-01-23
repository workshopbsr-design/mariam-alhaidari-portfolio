import { useState, useEffect, useCallback } from 'react';
import { db } from '../services/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { PROJECTS as STATIC_PROJECTS } from '../data/projects.data';
import { Project, AboutInfo } from '../types/schema';

export const useSyncData = (defaultAbout: AboutInfo) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const local = localStorage.getItem('local_projects');
    return local ? JSON.parse(local) : STATIC_PROJECTS;
  });
  
  const [aboutInfo, setAboutInfo] = useState<AboutInfo>(() => {
    const local = localStorage.getItem('general_about');
    return local ? JSON.parse(local) : defaultAbout;
  });

  const [contactInfo, setContactInfo] = useState<any>(() => {
    const local = localStorage.getItem('general_contact');
    return local ? JSON.parse(local) : {};
  });

  const syncFromLocal = useCallback(() => {
    const localAbout = localStorage.getItem('general_about');
    const localContact = localStorage.getItem('general_contact');
    const localProjects = localStorage.getItem('local_projects');
    if (localAbout) setAboutInfo(JSON.parse(localAbout));
    if (localContact) setContactInfo(JSON.parse(localContact));
    if (localProjects) setProjects(JSON.parse(localProjects));
  }, []);

  useEffect(() => {
    if (!db) return;

    const unsubProjects = onSnapshot(query(collection(db, "projects"), orderBy("createdAt", "desc")), (snap) => {
      let cloudData = snap.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Project[];
      const merged = [...cloudData];
      STATIC_PROJECTS.forEach(sp => {
        if (!merged.find(m => m.id === sp.id)) merged.push(sp as Project);
      });
      setProjects(merged);
      localStorage.setItem('local_projects', JSON.stringify(merged));
    });

    const unsubGeneral = onSnapshot(collection(db, "general"), (snap) => {
      snap.forEach(docSnap => {
        const type = docSnap.id;
        const cloudData = docSnap.data();
        if (type === 'about') setAboutInfo((prev: AboutInfo) => ({...prev, ...cloudData}));
        if (type === 'contact') setContactInfo((prev: any) => ({...prev, ...cloudData}));
        localStorage.setItem(`general_${type}`, JSON.stringify(cloudData));
      });
    });

    return () => { unsubProjects(); unsubGeneral(); };
  }, []);

  return { projects, aboutInfo, contactInfo, syncFromLocal };
};
