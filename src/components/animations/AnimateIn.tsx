"use client";

import { motion } from 'framer-motion';
import React from 'react';

export type AnimateInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number; // pixels to animate from
  fade?: boolean;
};

export function AnimateIn({ children, className, delay = 0, duration = 0.5, distance = 16, fade = true }: AnimateInProps) {
  const variants = {
    hidden: { opacity: fade ? 0 : 1, y: distance, transition: { duration } },
    show: { opacity: 1, y: 0, transition: { duration, delay } },
    exit: { opacity: 0, y: -distance, transition: { duration: duration * 0.75 } },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      exit="exit"
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
