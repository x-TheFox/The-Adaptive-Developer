'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMobile, setIsMobile] = useState(true);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const trailConfig = { damping: 35, stiffness: 200, mass: 0.8 };
  const trailXSpring = useSpring(cursorX, trailConfig);
  const trailYSpring = useSpring(cursorY, trailConfig);

  const colors = ['#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

  const spawnParticles = useCallback((x: number, y: number, count: number = 5) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        size: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setParticles((prev) => [...prev, ...newParticles].slice(-30));
    
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 800);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);

      if (Math.random() > 0.92) {
        spawnParticles(e.clientX, e.clientY, 1);
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = Boolean(
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-pointer')
      );
      setIsHovering(isInteractive);
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      spawnParticles(e.clientX, e.clientY, 8);
    };

    const handleMouseUp = () => setIsClicking(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    document.body.style.cursor = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'auto';
    };
  }, [isMobile, cursorX, cursorY, spawnParticles]);

  if (isMobile) return null;

  return (
    <>
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        a, button, [role="button"], .cursor-pointer {
          cursor: none !important;
        }
      `}</style>

      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 1, scale: 1 }}
            animate={{
              opacity: 0,
              scale: 0,
              x: (Math.random() - 0.5) * 100,
              y: (Math.random() - 0.5) * 100 - 50,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="fixed pointer-events-none z-[9998] rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
          />
        ))}
      </AnimatePresence>

      <motion.div
        className="fixed pointer-events-none z-[9997] rounded-full"
        style={{
          x: trailXSpring,
          y: trailYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovering ? 60 : 40,
          height: isHovering ? 60 : 40,
          opacity: isVisible ? 0.15 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 blur-md" />
      </motion.div>

      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isClicking ? 8 : isHovering ? 20 : 12,
          height: isClicking ? 8 : isHovering ? 20 : 12,
          opacity: isVisible ? 1 : 0,
          borderWidth: isHovering ? 2 : 0,
        }}
        transition={{ duration: 0.15 }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: isHovering
              ? 'transparent'
              : 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
            border: isHovering ? '2px solid rgba(6, 182, 212, 0.8)' : 'none',
            boxShadow: isClicking
              ? '0 0 30px rgba(6, 182, 212, 0.8), 0 0 60px rgba(139, 92, 246, 0.4)'
              : '0 0 15px rgba(6, 182, 212, 0.5)',
          }}
        />
      </motion.div>

      {isHovering && (
        <motion.div
          className="fixed pointer-events-none z-[9998]"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: '-50%',
            translateY: '-50%',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <motion.div
            className="w-10 h-10 rounded-full border border-cyan-400/50"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}
    </>
  );
}
