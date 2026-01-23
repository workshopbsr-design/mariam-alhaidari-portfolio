import { Map, Box, Zap } from 'lucide-react';

/**
 * HERO_CONFIG
 * Centralized configuration for the Hero section.
 * Classified as: UI Data / Configuration.
 */
export const HERO_CONFIG = {
  background: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?q=80&w=2400&auto=format&fit=crop",
  dnaIcons: [Map, Box, Zap],
  animations: {
    heroVisual: {
      initial: { opacity: 0, scale: 1.05 },
      animate: { opacity: 1, scale: 1 },
      // Fixed: Cast cubic-bezier array to a four-number tuple to match Framer Motion's expected Easing type
      transition: { duration: 2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    },
    mainTitle: {
      initial: { y: 30, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      // Fixed: Cast cubic-bezier array to a four-number tuple to match Framer Motion's expected Easing type
      transition: { delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
    },
    dnaGrid: {
      initial: { opacity: 0, y: 40 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { delay: 0.5, duration: 1 }
    }
  }
};
