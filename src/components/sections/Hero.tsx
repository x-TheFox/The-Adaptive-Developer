'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Download, Github, Terminal, Palette, Gamepad2, Users, Compass, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PersonaType } from '@/types/persona';
import { usePersona } from '@/hooks/usePersona';
import { useState, useEffect, useMemo, useRef } from 'react';
import { ParticleBackground } from '@/components/ui/ParticleBackground';

interface ProfileData {
  name: string;
  email: string | null;
  bio: string | null;
  shortBio: string | null;
  profileImageUrl: string | null;
  resumeUrl: string | null;
  socialLinks: Record<string, string> | null;
  location: string | null;
  available: boolean;
}

interface HeroProps {
  name?: string;
  title?: string;
  className?: string;
  profile?: ProfileData;
}

const HERO_CONTENT: Record<PersonaType, {
  headline: string;
  subheadline: string;
  cta: { text: string; href: string; icon: React.ReactNode };
  secondaryCta?: { text: string; href: string };
  accent: string;
  bgGradient: string;
  particleVariant: 'nebula' | 'stars' | 'fireflies';
}> = {
  recruiter: {
    headline: 'Full-Stack Developer',
    subheadline: 'Building scalable applications with modern technologies. 5+ years of experience delivering impactful solutions.',
    cta: { text: 'Download Resume', href: '/resume.pdf', icon: <Download size={18} /> },
    secondaryCta: { text: 'View Skills', href: '#skills' },
    accent: 'text-cyan-400',
    bgGradient: 'from-cyan-950/50 via-transparent to-transparent',
    particleVariant: 'nebula',
  },
  engineer: {
    headline: 'Building with Code',
    subheadline: 'TypeScript, React, Node.js, and beyond. Passionate about clean architecture and developer experience.',
    cta: { text: 'View GitHub', href: 'https://github.com', icon: <Github size={18} /> },
    secondaryCta: { text: 'Explore Projects', href: '/projects' },
    accent: 'text-green-400',
    bgGradient: 'from-green-950/50 via-transparent to-transparent',
    particleVariant: 'stars',
  },
  designer: {
    headline: 'Crafting Experiences',
    subheadline: 'Where aesthetics meet functionality. Designing interfaces that delight users and solve real problems.',
    cta: { text: 'View Portfolio', href: '/projects?category=design', icon: <Palette size={18} /> },
    secondaryCta: { text: 'See Case Studies', href: '/case-studies' },
    accent: 'text-purple-400',
    bgGradient: 'from-purple-950/50 via-transparent to-transparent',
    particleVariant: 'fireflies',
  },
  cto: {
    headline: 'Engineering Leadership',
    subheadline: 'Architecting systems at scale. Experience building and leading high-performance engineering teams.',
    cta: { text: 'Let\'s Talk Strategy', href: '/intake', icon: <Users size={18} /> },
    secondaryCta: { text: 'View Skills', href: '#skills' },
    accent: 'text-amber-400',
    bgGradient: 'from-amber-950/50 via-transparent to-transparent',
    particleVariant: 'nebula',
  },
  gamer: {
    headline: 'Code & Play',
    subheadline: 'Game dev enthusiast building interactive experiences. Unity, Unreal, and web-based games.',
    cta: { text: 'Play Demos', href: '/projects?category=game', icon: <Gamepad2 size={18} /> },
    secondaryCta: { text: 'See All Projects', href: '/projects' },
    accent: 'text-red-400',
    bgGradient: 'from-red-950/50 via-transparent to-transparent',
    particleVariant: 'fireflies',
  },
  curious: {
    headline: 'Welcome, Explorer',
    subheadline: 'Developer, designer, builder. Take a look around and discover what interests you.',
    cta: { text: 'Start Exploring', href: '#projects', icon: <Compass size={18} /> },
    secondaryCta: { text: 'About Me', href: '#about' },
    accent: 'text-zinc-400',
    bgGradient: 'from-zinc-900/50 via-transparent to-transparent',
    particleVariant: 'stars',
  },
};

export function Hero({ name = 'Developer', title, className, profile }: HeroProps) {
  const { persona, isAdapting } = usePersona();
  const content = HERO_CONTENT[persona];
  const displayName = profile?.name || name;
  const resumeUrl = profile?.resumeUrl || '/resume.pdf';
  const githubUrl = (profile?.socialLinks as { github?: string })?.github || 'https://github.com';
  
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const floatingOrbs = useMemo(() => {
    const seed = 12345;
    const seededRandom = (i: number) => {
      const x = Math.sin(seed + i * 9999) * 10000;
      return x - Math.floor(x);
    };
    return [...Array(6)].map((_, i) => ({
      id: i,
      size: seededRandom(i) * 200 + 100,
      x: seededRandom(i + 100) * 80 + 10,
      y: seededRandom(i + 200) * 80 + 10,
      duration: seededRandom(i + 300) * 10 + 15,
      delay: seededRandom(i + 400) * 5,
      color: ['cyan', 'purple', 'pink', 'blue', 'green'][Math.floor(seededRandom(i + 500) * 5)],
    }));
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      data-section="hero"
      className={cn(
        'relative min-h-screen flex items-center justify-center',
        'px-6 py-24 overflow-hidden',
        className
      )}
    >
      {mounted && <ParticleBackground variant={content.particleVariant} />}

      {mounted && floatingOrbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: `radial-gradient(circle, ${
              orb.color === 'cyan' ? 'rgba(6, 182, 212, 0.15)' :
              orb.color === 'purple' ? 'rgba(139, 92, 246, 0.15)' :
              orb.color === 'pink' ? 'rgba(236, 72, 153, 0.15)' :
              orb.color === 'blue' ? 'rgba(59, 130, 246, 0.15)' :
              'rgba(16, 185, 129, 0.15)'
            }, transparent 70%)`,
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <motion.div
        key={persona}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={cn(
          'absolute inset-0 bg-gradient-to-b',
          content.bgGradient
        )}
      />

      {persona === 'engineer' && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 0.1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute top-20 right-10 hidden lg:block"
          style={{ x: mousePosition.x * 2, y: mousePosition.y * 2 }}
        >
          <Terminal size={300} className="text-green-500" />
        </motion.div>
      )}

      <motion.div 
        className="relative z-10 max-w-4xl mx-auto text-center"
        style={{ y, opacity }}
      >
        {profile?.profileImageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="mb-8 perspective"
          >
            <motion.div
              className="relative inline-block"
              whileHover={{ scale: 1.05, rotateY: 10 }}
              style={{ x: mousePosition.x * 0.5, y: mousePosition.y * 0.5 }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-lg opacity-50 animate-pulse" />
              <img
                src={profile.profileImageUrl}
                alt={displayName}
                className="relative w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-zinc-800/50 shadow-2xl object-cover"
              />
              <motion.div
                className="absolute -inset-2 rounded-full border-2 border-cyan-500/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 flex items-center justify-center gap-2"
        >
          <Sparkles size={16} className={content.accent} />
          <span className={cn('text-sm font-medium tracking-wider uppercase', content.accent)}>
            {displayName}
          </span>
          <Sparkles size={16} className={content.accent} />
        </motion.div>

        <motion.h1
          key={`headline-${persona}`}
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: isAdapting ? 0.5 : 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, type: 'spring' }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
          style={{ x: mousePosition.x * 0.2, y: mousePosition.y * 0.2 }}
        >
          <span className="gradient-text-animated">{title || content.headline}</span>
        </motion.h1>

        <motion.p
          key={`subheadline-${persona}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isAdapting ? 0.5 : 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          {content.subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a
            href={
              content.cta.text === 'Download Resume'
                ? resumeUrl 
                : content.cta.text === 'View GitHub'
                  ? githubUrl
                  : content.cta.href
            }
            download={content.cta.text === 'Download Resume' ? true : undefined}
            target={content.cta.href.startsWith('http') || content.cta.text === 'View GitHub' ? '_blank' : undefined}
            rel={content.cta.href.startsWith('http') || content.cta.text === 'View GitHub' ? 'noopener noreferrer' : undefined}
            data-track="hero-cta-primary"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'group relative inline-flex items-center justify-center gap-2',
              'px-8 py-4 rounded-xl font-medium overflow-hidden',
              'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white',
              'shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40',
              'transition-all duration-300'
            )}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="absolute inset-0 animate-shimmer" />
            <span className="relative flex items-center gap-2">
              {content.cta.icon}
              {content.cta.text}
            </span>
          </motion.a>

          {content.secondaryCta && (
            <motion.a
              href={content.secondaryCta.href}
              data-track="hero-cta-secondary"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'group relative inline-flex items-center justify-center gap-2',
                'px-8 py-4 rounded-xl font-medium overflow-hidden',
                'border-2 border-zinc-700 text-zinc-300',
                'hover:border-cyan-500/50 hover:text-white',
                'transition-all duration-300',
                'glass'
              )}
            >
              {content.secondaryCta.text}
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowRight size={16} />
              </motion.span>
            </motion.a>
          )}
        </motion.div>

        {persona === 'recruiter' && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { value: '5+', label: 'Years Experience' },
              { value: '50+', label: 'Projects Shipped' },
              { value: '100%', label: 'Remote Ready' },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                className="text-center glass rounded-xl p-4"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-zinc-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-zinc-600 flex justify-center pt-2">
          <motion.div
            className="w-1.5 h-3 bg-cyan-500 rounded-full"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
