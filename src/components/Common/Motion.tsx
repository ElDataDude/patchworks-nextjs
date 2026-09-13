"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
export default function Motion() {
  const pathname = usePathname();
  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting, target }) => {
          if (isIntersecting) {
            (target as HTMLElement).dataset.revealState = "visible";
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.04 },
    );
    document
      .querySelectorAll<HTMLElement>("[data-reveal]")
      .forEach((element) => {
        if (element.getBoundingClientRect().top > window.innerHeight) {
          element.dataset.revealState = "waiting";
          observer.observe(element);
        }
      });
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
