// src/data/contact.data.ts
import { ContactInfo } from '../types/schema';

/**
 * Contact Data — Single Source of Truth
 * ------------------------------------
 * Static, in-memory data.
 * No logic. No UI. No fallbacks.
 */

export const CONTACT_DATA: ContactInfo = {
  phone: '+966 000 000 000',
  email: 'mariam@atelier.com',
  instagram: '@mariam_arch',
  address: 'Riyadh, KSA',
};
