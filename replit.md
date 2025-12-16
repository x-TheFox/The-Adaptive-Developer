# The Adaptive Developer Portfolio

## Overview
A Next.js 16 adaptive developer portfolio with AI-powered personalization, immersive visual effects, and beautiful UI components.

## Current State
- Portfolio is fully functional with fallback content (database tables not yet created)
- All visual enhancements are in place and working
- Chat widget supports markdown rendering with LaTeX math support

## Recent Changes (December 16, 2025)

### Phase 1: Markdown & LaTeX Rendering
- Created `MarkdownRenderer` component with full support for:
  - GitHub Flavored Markdown (tables, task lists, strikethrough)
  - LaTeX/KaTeX math rendering (inline and block)
  - Syntax highlighting for code blocks
  - Mermaid diagram support
- Integrated markdown rendering into ChatWidget

### Phase 2: Immersive UI Effects
- **CustomCursor**: Custom cursor component with trailing effects
- **ParticleBackground**: Colorful floating particles in Hero section
- **SmoothScroll**: Lenis-based smooth scrolling
- **Glassmorphism**: Applied `glass` utility class across sections (backdrop-blur, translucent backgrounds, border effects)
- **Gradient Text**: Animated gradient text for headings using `gradient-text` and `gradient-text-animated` classes
- **Neon/Glow Effects**: Shadow-based glow effects on hover states
- **Enhanced Sections**: Hero, About, Projects, Skills, Footer all updated with new effects

## Design System

### CSS Utilities (globals.css)
- `.glass` - Glassmorphism card effect
- `.gradient-text` - Static cyan-purple gradient text
- `.gradient-text-animated` - Animated gradient text that shifts colors
- `.neon-border` - Animated neon border effect
- `.glow-cyan`, `.glow-purple`, `.glow-pink` - Glow shadow effects

### Color Palette
- Primary gradient: cyan (#06b6d4) → purple (#a855f7)
- Accent: pink (#ec4899), blue (#3b82f6)
- Background: zinc-950 (#09090b)
- Glass backgrounds: zinc-900/50 with backdrop-blur

## Project Structure

### Key Directories
- `src/components/ui/` - Reusable UI components
- `src/components/sections/` - Page sections (Hero, About, Projects, etc.)
- `src/components/chat/` - Chat widget and markdown components
- `src/lib/` - Utilities, CMS, and API helpers

### Important Files
- `src/app/globals.css` - Global styles and CSS utilities
- `src/app/layout.tsx` - Root layout with providers
- `src/components/ui/MarkdownRenderer.tsx` - Markdown/LaTeX renderer
- `src/components/ui/CustomCursor.tsx` - Custom cursor effect
- `src/components/ui/ParticleBackground.tsx` - Particle system
- `src/components/ui/SmoothScroll.tsx` - Lenis smooth scroll wrapper

## Known Issues
- Database tables don't exist yet (app uses fallback content - returns 200 status)
- NOTION_PROJECTS_DATABASE_ID not set (falls back to empty projects)

## Dependencies
- `remark-gfm`, `remark-math` - Markdown processing
- `rehype-katex`, `rehype-highlight` - Math/code rendering
- `@react-three/fiber`, `@react-three/drei` - 3D support
- `tsparticles-slim` - Particle effects
- `lenis` - Smooth scrolling
- `framer-motion` - Animations

## Workflow
- Dev server runs on port 5000 via `npm run dev -- -p 5000`
