import { useState, useEffect, useRef } from 'react';

/**
 * A wrapper that only renders its children when it becomes visible in the viewport.
 * Useful for delaying API calls and heavy rendering for components below the fold.
 */
export default function LazySection({ children, height = "400px" }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only load once
        }
      },
      {
        rootMargin: "200px", // Start loading slightly before it enters the viewport
        threshold: 0.01
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} style={{ minHeight: isVisible ? 'auto' : height }}>
      {isVisible ? children : null}
    </div>
  );
}
