
import { AboutInfo } from '../types/schema';

/**
 * About Data — Single Source of Truth
 * -----------------------------------
 * ⚠️ Static, in-memory data
 * This file OWNS the About content.
 * No logic. No hooks. No UI concerns.
 */

export const ABOUT_DATA: AboutInfo = {
  // Identity
  nameEn: 'Mariam Alhaidari',
  nameAr: 'مريم الحيدري',

  // Biography
  bioEn:
    'Architect and interior designer focused on creating timeless, emotionally resonant spaces that balance form, function, and narrative.',
  bioAr:
    'معمارية ومصممة داخلية، أركز على خلق مساحات خالدة تحمل بعداً عاطفياً، وتوازن بين الشكل والوظيفة والسرد المعماري.',

  // Philosophy
  philosophyEn:
    'Architecture is not walls and ceilings. It is the silent language between space and soul.',
  philosophyAr:
    'العمارة ليست جدراناً وأسقفاً، بل هي اللغة الصامتة بين الفضاء والروح.',

  // Media
  profileImage:
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200',

  // Documents
  resumeUrl: '#', // Placeholder — until real file is added
};
