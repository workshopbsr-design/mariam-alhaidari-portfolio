
import { AboutInfo } from '../types/schema';
import { ABOUT_DATA } from '../data/about.data';

/**
 * useAbout — Thin Adapter (Pure Pass-Through)
 * -------------------------------------------
 * 📌 المبادئ:
 * 1. No Mock Data
 * 2. No Async Simulation
 * 3. No isLoading / error
 * 4. Represents current reality (static in-memory data)
 * 5. Single Source of Truth = about.data.ts
 */

export const useAbout = (): { aboutInfo: AboutInfo } => {
  return { aboutInfo: ABOUT_DATA };
};
