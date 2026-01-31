// src/hooks/useContact.ts
import { CONTACT_DATA } from '../data/contact.data';

/**
 * useContact — Thin Adapter
 * -------------------------
 * Pure pass-through.
 * No loading. No error. No transformation.
 */

export const useContact = () => {
  return {
    contactInfo: CONTACT_DATA,
  };
};
