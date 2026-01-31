import { HeroInfo } from '../types/schema';

/**
 * Hero Content — Business Data
 * -----------------------------------
 * Owns hero TEXTUAL + BUSINESS content.
 * No animations. No UI logic.
 */

export const HERO_DATA: HeroInfo = {
  nameEn: 'Mariam Alhaidari',
  nameAr: 'مريم الحيدري',

  statementEn:
    'Architecture is not walls and ceilings. It is the silent language between space and soul.',
  statementAr:
    'العمارة ليست جدراناً وأسقفاً، بل هي اللغة الصامتة بين الفضاء والروح.',

  heroBg: '', // فارغ عمداً لاستخدام HERO_CONFIG.background
};
