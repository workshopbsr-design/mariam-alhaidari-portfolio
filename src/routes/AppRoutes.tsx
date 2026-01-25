import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Home } from '../pages/Home';
import { Projects } from '../pages/Projects';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';
import { Admin } from '../pages/Admin';
import { AiGenerator } from '../pages/AiGenerator';
import { Project, AboutInfo } from '../types/schema';

type AppRoutesProps = {
  projects: Project[];
  aboutInfo: AboutInfo;
  contactInfo: any;
};

export const AppRoutes = ({ projects, aboutInfo, contactInfo }: AppRoutesProps) => {
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
          <Route path="/" element={<Home info={aboutInfo} />} />
          <Route path="/projects" element={<Projects projects={projects} />} />
          <Route path="/about" element={<About info={aboutInfo} />} />
          <Route path="/contact" element={<Contact info={contactInfo} />} />
          <Route path="/ai" element={<AiGenerator />} />
          <Route
            path="/admin"
            element={
              <Admin
                projects={projects}
                about={aboutInfo}
                contact={contactInfo}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};
