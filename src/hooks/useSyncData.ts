import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { PROJECTS as STATIC_PROJECTS } from '../data/projects.data';
import { Project, AboutInfo } from '../types/schema';

export const useSyncData = (defaultAbout: AboutInfo) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [aboutInfo, setAboutInfo] = useState<AboutInfo>(defaultAbout);
  const [contactInfo, setContactInfo] = useState<any>({});

  useEffect(() => {
    if (!db) return;

    // ===== Projects =====
    const unsubProjects = onSnapshot(
      query(collection(db, 'projects'), orderBy('createdAt', 'desc')),
      (snap) => {
        const cloud = snap.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Project[];
        const merged = [...cloud];

        STATIC_PROJECTS.forEach(sp => {
          if (!merged.find(m => m.id === sp.id)) merged.push(sp as Project);
        });

        setProjects(merged);
        localStorage.setItem('local_projects', JSON.stringify(merged));
      }
    );

    // ===== General (About + Contact) =====
    const unsubGeneral = onSnapshot(collection(db, 'general'), (snap) => {
      snap.forEach(docSnap => {
        const data = docSnap.data();

        if (docSnap.id === 'about') {
          setAboutInfo(prev => ({ ...prev, ...data }));
          localStorage.setItem('general_about', JSON.stringify(data));
        }

        if (docSnap.id === 'contact') {
          setContactInfo(data);
          localStorage.setItem('general_contact', JSON.stringify(data));
        }
      });
    });

    return () => {
      unsubProjects();
      unsubGeneral();
    };
  }, [defaultAbout]);

  return { projects, aboutInfo, contactInfo };
};
