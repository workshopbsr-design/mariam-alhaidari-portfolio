import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Project } from '../types/schema';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'projects'),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Project),
        }));
        setProjects(data);
        setLoading(false);
      },
      (err) => {
        console.error('useProjects error:', err);
        setError('Failed to load projects');
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  return { projects, loading, error };
}
