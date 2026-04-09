import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook using Intersection Observer directly to manage scroll reveal animations.
 * Once an element is seen, it stays "revealed" - no re-triggering on scroll speed changes.
 */
export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    // Skip if already revealed (state persists across renders)
    if (isRevealed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          // Unobserve once revealed to prevent re-triggering
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        // Add margins to ensure consistent triggering regardless of scroll speed
        rootMargin: '0px 0px -100px 0px', // Trigger slightly before element is fully visible
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [isRevealed]);

  return { ref, isRevealed };
}
