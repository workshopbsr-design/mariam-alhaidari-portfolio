import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { PROJECTS as STATIC_PROJECTS } from '../data/projects.data';
import { Project, AboutInfo } from '../types/schema';

export const useSyncData = (defaultAbout: AboutInfo) => {
  /* =======================
     STATE
  ======================= */

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

  /* =======================
     MANUAL LOCAL SYNC
  ======================= */

  const syncFromLocal = () => {
    const about = localStorage.getItem('general_about');
    const contact = localStorage.getItem('general_contact');
    const projects = localStorage.getItem('local_projects');

    if (about) setAboutInfo(JSON.parse(about));
    if (contact) setContactInfo(JSON.parse(contact));
    if (projects) setProjects(JSON.parse(projects));
  };

  /* =======================
     FIREBASE SYNC
  ======================= */

  useEffect(() => {
    if (!db) return;

    // ---- Projects ----
    const unsubProjects = onSnapshot(
      query(collection(db, 'projects'), orderBy('createdAt', 'desc')),
      (snap) => {
        const cloudProjects = snap.docs.map(doc => ({
          ...(doc.data() as Project),
          id: doc.id
        }));

        const merged = [...cloudProjects];

        STATIC_PROJECTS.forEach(sp => {
          if (!merged.find(p => p.id === sp.id)) {
            merged.push(sp);
          }
        });

        setProjects(merged);
        localStorage.setItem('local_projects', JSON.stringify(merged));
      }
    );

    // ---- General (About + Contact) ----
    const unsubGeneral = onSnapshot(
      collection(db, 'general'),
      (snap) => {
        snap.forEach(docSnap => {
          const data = docSnap.data();

          if (docSnap.id === 'about') {
            const merged = { ...defaultAbout, ...data };
            setAboutInfo(merged);
            localStorage.setItem('general_about', JSON.stringify(merged));
          }

          if (docSnap.id === 'contact') {
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
  }, [defaultAbout]);

  /* =======================
     EXPORT
  ======================= */

  return {
    projects,
    aboutInfo,
    contactInfo,
    syncFromLocal
  };
};

