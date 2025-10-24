import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    },
  },
};

const AnimatedHero = () => {
  return (
    <motion.section
      id="hero"
      className="text-center py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-6xl font-extrabold text-manus-blue-500 mb-4"
        variants={itemVariants}
      >
        Willkommen zum <span className="text-manus-success-500">German Design System</span>
      </motion.h1>
      
      <motion.p
        className="text-2xl text-manus-gray-700 mb-8 max-w-3xl mx-auto"
        variants={itemVariants}
      >
        Ihre digitale Präsenz, gebaut auf Präzision, Zugänglichkeit und deutschem Ingenieurwesen.
      </motion.p>
      
      <motion.div
        className="flex justify-center space-x-4"
        variants={itemVariants}
      >
        <a
          href="/unternehmen"
          className="px-6 py-3 text-lg font-semibold rounded-lg bg-manus-blue-500 text-white hover:bg-manus-blue-600 transition duration-300"
        >
          Für Unternehmen
        </a>
        <a
          href="/privatkunden"
          className="px-6 py-3 text-lg font-semibold rounded-lg border-2 border-manus-blue-500 text-manus-blue-500 hover:bg-manus-blue-50 transition duration-300"
        >
          Für Privatkunden
        </a>
      </motion.div>
    </motion.section>
  );
};

export default AnimatedHero;
