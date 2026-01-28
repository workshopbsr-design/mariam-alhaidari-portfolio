import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { Home } from '../pages/Home';
import { Projects } from '../pages/Projects';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';
import { Admin } from '../pages/Admin';
import { AiGenerator } from '../pages/AiGenerator';

export const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ai" element={<AiGenerator />} />

          {/* Admin route temporarily removed — will be reintroduced after data isolation */}
{/* <Route path="/admin" element={<Admin />} /> */}
          

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};
