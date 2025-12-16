"use client";

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PageLoading } from '@/components/ui/PageLoading';
import { AnimateIn } from '@/components/animations/AnimateIn';

export function HeavyPageWrapper({ children, delay = 40 }: { children: React.ReactNode; delay?: number }) {
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    // Wait a frame so server-rendered loading state (loading.tsx) can show briefly,
    // then hide the overlay to trigger the exit animation.
    requestAnimationFrame(() => {
      // small timeout to allow visual continuity; can be tuned
      setTimeout(() => setShowOverlay(false), delay);
    });
  }, [delay]);

  return (
    <div className="relative">
      {/* Page content animates in */}
      <AnimateIn>
        {children}
      </AnimateIn>

      {/* Overlay that animates out once page is ready */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            key="heavy-page-loading"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
            className="absolute inset-0 z-50"
            // block pointer events while visible, allow interaction after exit
            style={{ pointerEvents: showOverlay ? 'auto' : 'none' }}
          >
            <PageLoading />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
