
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { Home } from '../pages/Home';
import { About } from '../pages/About';
import { Projects } from '../pages/Projects';
import { Contact } from '../pages/Contact';

/**
 * AppRoutes - Zero Intelligence Router
 * --------------------------------------
 * 📌 القواعد المطبقة:
 * 1. لا يمرر أي بيانات
 * 2. مجرد توصيل Routes
 * 3. لا logic ولا conditions
 */
export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />      {/* ✅ نظيف */}
      <Route path="/projects" element={<Projects />} /> {/* ⚠️ سيعطي خطأ TypeScript */}
      <Route path="/contact" element={<Contact />} />   {/* ⚠️ سيعطي خطأ TypeScript */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
