/**
 * SCHEMA TYPES
 * The "Domain Contracts" of Atelier Mariam.
 * These definitions ensure consistency across Firebase, the Admin Panel, and the Public View.
 */

export type Language = 'en' | 'ar' | 'tr';

export interface ProjectStory {
  decisionEn?: string;
  decisionAr?: string;
  decisionTr?: string;
  challengeEn?: string;
  challengeAr?: string;
  challengeTr?: string;
  conceptEn?: string;
  conceptAr?: string;
  conceptTr?: string;
  solutionEn?: string;
  solutionAr?: string;
  solutionTr?: string;
  reflectionEn?: string;
  reflectionAr?: string;
  reflectionTr?: string;
}

export interface Project {
  id: string;
  titleEn: string;
  titleAr?: string;
  titleTr?: string;
  catEn: string;
  catAr?: string;
  catTr?: string;
  year: string;
  location: string;
  scale: string;
  roleEn?: string;
  roleAr?: string;
  roleTr?: string;
  tools: string[] | string;
  img: string;
  videoUrl?: string;
  model3dUrl?: string;
  max3dUrl?: string;
  presentationUrl?: string;
  gallery?: string[];
  blueprints?: string[];
  story: ProjectStory;
  reviews?: any[];
  createdAt?: any;
  updatedAt?: any;
}

export interface AboutInfo {
  nameEn: string;
  nameAr?: string;
  nameTr?: string;
  bioEn?: string;
  bioAr?: string;
  bioTr?: string;
  philosophyEn?: string;
  philosophyAr?: string;
  philosophyTr?: string;
  fontSerif?: string;
  fontSans?: string;
  fontArabic?: string;
  fontSize?: string;
  nameFontSize?: string;
  email?: string;
  phone?: string;
  instagram?: string;
  resumeUrl?: string;
  profileImage?: string;
  address?: string;
  heroBg?: string;
  statementEn?: string;
  statementAr?: string;
  statementTr?: string;
}
