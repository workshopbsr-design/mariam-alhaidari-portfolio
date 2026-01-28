import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { Home } from '../pages/Home';
import { About } from '../pages/About';
import { Projects } from '../pages/Projects';
import { Contact } from '../pages/Contact';

/**
 * AppRoutes
 * ------------------------------------------------------------------
 * Zero-Intelligence Router
 * - لا props
 * - لا بيانات
 * - لا منطق
 * - Route = Boundary فقط
 * ------------------------------------------------------------------
 */

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/contact" element={<Contact />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
