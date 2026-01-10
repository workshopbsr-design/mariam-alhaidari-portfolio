/* ================= PROJECT TYPES ================= */

export type Language = "ar" | "en" | "tr";

/* ---------- Reviews ---------- */
export interface Review {
  id: string;
  userName: string;
  rating: number; // 1 → 5
  text: string;
  createdAt: string | Date;
}

/* ---------- Process Items ---------- */
export interface ProcessItem {
  type: "sketch" | "diagram" | "render" | "photo";
  url: string;
  captionEn: string;
  captionAr: string;
  captionTr: string;
}

/* ---------- Story ---------- */
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

/* ---------- Project ---------- */
export interface Project {
  id: string;

  titleEn: string;
  titleAr: string;
  titleTr: string;

  catEn: string;
  catAr: string;
  catTr: string;

  scopeEn?: string;
  scopeAr?: string;
  scopeTr?: string;

  year: string;
  location?: string;
  scale?: string;

  roleEn: string;
  roleAr: string;
  roleTr: string;

  tools?: string[];

  img: string;

  descEn: string;
  descAr: string;
  descTr: string;

  story?: ProjectStory;

  reviews?: Review[];

  gallery?: string[];
  process?: ProcessItem[];

  blueprints?: string[];
  videoUrl?: string;
  model3dUrl?: string;
  presentationUrl?: string;
}
