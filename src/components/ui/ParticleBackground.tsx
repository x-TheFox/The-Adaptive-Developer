'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

interface ParticleBackgroundProps {
  variant?: 'nebula' | 'stars' | 'fireflies';
  className?: string;
  particleCount?: number;
}

export function ParticleBackground({ 
  variant = 'nebula', 
  className,
  particleCount = 60 
}: ParticleBackgroundProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const colors = useMemo(() => {
    switch (variant) {
      case 'stars':
        return ['#ffffff', '#e0e7ff', '#c7d2fe'];
      case 'fireflies':
        return ['#fbbf24', '#f59e0b', '#10b981', '#34d399'];
      case 'nebula':
      default:
        return ['#06b6d4', '#8b5cf6', '#ec4899', '#3b82f6', '#10b981'];
    }
  }, [variant]);

  const particles = useMemo(() => {
    const seed = 54321;
    const seededRandom = (i: number) => {
      const x = Math.sin(seed + i * 9999) * 10000;
      return x - Math.floor(x);
    };

    return [...Array(particleCount)].map((_, i) => ({
      id: i,
      x: seededRandom(i) * 100,
      y: seededRandom(i + 100) * 100,
      size: variant === 'stars' 
        ? seededRandom(i + 200) * 2 + 1 
        : seededRandom(i + 200) * 4 + 2,
      color: colors[Math.floor(seededRandom(i + 300) * colors.length)],
      duration: seededRandom(i + 400) * 20 + 10,
      delay: seededRandom(i + 500) * 5,
    }));
  }, [variant, particleCount, colors]);

  if (!mounted) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: variant === 'fireflies' 
              ? `0 0 ${particle.size * 3}px ${particle.color}` 
              : variant === 'nebula'
                ? `0 0 ${particle.size * 2}px ${particle.color}40`
                : 'none',
          }}
          animate={{
            x: [0, (Math.random() - 0.5) * 50, 0],
            y: [0, (Math.random() - 0.5) * 50, 0],
            opacity: variant === 'fireflies' 
              ? [0.2, 1, 0.2] 
              : variant === 'stars'
                ? [0.3, 1, 0.3]
                : [0.3, 0.6, 0.3],
            scale: variant === 'fireflies' ? [1, 1.5, 1] : [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {variant === 'nebula' && (
        <>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
        </>
      )}
    </div>
  );
}
