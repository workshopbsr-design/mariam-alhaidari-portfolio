import { useEffect, useState } from 'react';
import { AboutInfo } from '../types/schema';

/**
 * useAbout
 * ------------------------------------------------------------------
 * Single Source of Truth (مؤقت)
 * - Hook ذاتي
 * - لا يعتمد على Router
 * - Mock data مقصود كجسر مرحلي
 * ------------------------------------------------------------------
 */

type UseAboutState = {
  aboutInfo: AboutInfo | null;
  isLoading: boolean;
  error: Error | null;
};

export const useAbout = (): UseAboutState => {
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // 🟡 Mock Data — سيتم استبداله لاحقًا بمصدر حقيقي
      const mock: AboutInfo = {
        nameEn: 'Mariam Al-Haidari',
        nameAr: 'مريم الحيدري',

        bioEn: 'Architect and strategist specializing in human-centered design.',
        bioAr: 'مهندسة معمارية واستراتيجية متخصصة في التصميم المتمحور حول الإنسان.',

        philosophyEn: 'Space is the language of human experience.',
        philosophyAr: 'المكان هو لغة التجربة الإنسانية.',

        profileImage:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200',

        resumeUrl: '',

        fontSerif: "'Bodoni Moda', serif",
        fontSans: "'Plus Jakarta Sans', sans-serif",
        fontArabic: "'Amiri', serif",
        fontSize: '16',
        nameFontSize: '80',

        email: 'Alhaidarimariam@gmail.com',
        phone: '+905436351693',
        instagram: 'https://www.instagram.com/smemo_5',
      };

      // محاكاة تحميل غير متزامن
      setTimeout(() => {
        setAboutInfo(mock);
        setIsLoading(false);
      }, 300);
    } catch (e) {
      setError(e as Error);
      setIsLoading(false);
    }
  }, []);

  return { aboutInfo, isLoading, error };
};
