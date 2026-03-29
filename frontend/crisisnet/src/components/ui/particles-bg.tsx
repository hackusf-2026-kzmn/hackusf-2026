"use client";

import { useEffect, useCallback, useId } from "react";

const SCRIPT_SRC =
  "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";

export function ParticlesBg({ className = "" }: { className?: string }) {
  // useId produces a stable, SSR-consistent identifier
  const rawId = useId();
  const id = `particles-${rawId.replace(/:/g, "")}`;

  const initParticles = useCallback(() => {
    // @ts-ignore
    if (typeof window.particlesJS !== "function") return;

    // Destroy any prior instance occupying this container
    // @ts-ignore
    if (Array.isArray(window.pJSDom)) {
      // @ts-ignore
      window.pJSDom = window.pJSDom.filter((p: any) => {
        try {
          if (p.pJS.canvas.el.closest(`#${id}`)) {
            p.pJS.fn.vendors.destroypJS();
            return false;
          }
        } catch (_) {}
        return true;
      });
    }

    // @ts-ignore
    window.particlesJS(id, {
      particles: {
        number: { value: 180, density: { enable: true, value_area: 800 } },
        color: { value: "#16a34a" },
        shape: {
          type: "circle",
          stroke: { width: 0.5, color: "#52665e" },
        },
        opacity: {
          value: 0.45,
          random: true,
          anim: { enable: true, speed: 0.8, opacity_min: 0.15 },
        },
        size: {
          value: 2.5,
          random: true,
          anim: { enable: true, speed: 1.5, size_min: 0.8 },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#7a9470",
          opacity: 0.3,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1.2,
          random: true,
          out_mode: "bounce",
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true,
        },
        modes: {
          grab: { distance: 200, line_linked: { opacity: 0.7 } },
          push: { particles_nb: 3 },
        },
      },
      retina_detect: true,
    });
  }, [id]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const run = () => initParticles();

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`
    );

    if (existing) {
      // @ts-ignore
      if (typeof window.particlesJS === "function") {
        run();
      } else {
        existing.addEventListener("load", run);
        return () => existing.removeEventListener("load", run);
      }
    } else {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
      script.onload = run;
    }

    return () => {
      // @ts-ignore
      if (Array.isArray(window.pJSDom)) {
        // @ts-ignore
        window.pJSDom = window.pJSDom.filter((p: any) => {
          try {
            if (p.pJS.canvas.el.closest(`#${id}`)) {
              p.pJS.fn.vendors.destroypJS();
              return false;
            }
          } catch (_) {}
          return true;
        });
      }
      const container = document.getElementById(id);
      container?.querySelector("canvas")?.remove();
    };
  }, [initParticles]);

  return (
    <div
      id={id}
      className={`absolute inset-0 ${className}`}
    />
  );
}
