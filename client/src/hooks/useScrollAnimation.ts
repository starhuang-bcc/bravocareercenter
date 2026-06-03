import { useEffect, useRef } from "react";

export function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targets = entry.target.querySelectorAll(".fade-up");
            targets.forEach((t) => t.classList.add("visible"));
            // Also add visible to the element itself if it has fade-up
            if (entry.target.classList.contains("fade-up")) {
              entry.target.classList.add("visible");
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    // Also observe all fade-up children directly
    const fadeEls = el.querySelectorAll(".fade-up");
    fadeEls.forEach((fe) => observer.observe(fe));

    return () => observer.disconnect();
  }, []);

  return ref;
}
