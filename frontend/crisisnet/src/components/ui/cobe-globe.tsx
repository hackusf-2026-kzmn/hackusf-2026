"use client";

import { useEffect, useRef, useCallback } from "react";
import createGlobe from "cobe";

interface CobeGlobeProps {
  className?: string;
  speed?: number;
}

const MARKERS: { location: [number, number]; size: number }[] = [];

export function CobeGlobe({ className = "", speed = 0.003 }: CobeGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerMovement = useRef(0);
  const phiRef = useRef(0);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = e.clientX;
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
  }, []);

  const handlePointerUp = useCallback(() => {
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
  }, []);

  const handlePointerOut = useCallback(() => {
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (pointerInteracting.current !== null) {
      pointerMovement.current = e.clientX - pointerInteracting.current;
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let animId: number;

    function init() {
      const width = canvas.offsetWidth;
      if (width === 0) return;

      const globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width: width * 2,
        height: width * 2,
        phi: 0,
        theta: 0.15,
        dark: 0,
        diffuse: 1.5,
        mapSamples: 16000,
        mapBrightness: 10,
        baseColor: [0.96, 0.97, 0.95],
        markerColor: [0.086, 0.639, 0.29],
        glowColor: [0.83, 0.86, 0.78],
        markers: MARKERS,
        opacity: 0.72,
      });

      function animate() {
        if (pointerInteracting.current === null) {
          phiRef.current += speed;
        }
        globe.update({
          phi: phiRef.current + pointerMovement.current / 200,
        });
        animId = requestAnimationFrame(animate);
      }
      animate();
      canvas.style.opacity = "1";

      return globe;
    }

    let globe: ReturnType<typeof createGlobe> | undefined;

    if (canvas.offsetWidth > 0) {
      globe = init();
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect();
          globe = init();
        }
      });
      ro.observe(canvas);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (globe) globe.destroy();
    };
  }, [speed]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerOut}
        onPointerMove={handlePointerMove}
        className={className}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1s ease",
          touchAction: "none",
          aspectRatio: "1",
        }}
      />

      {/* Rim refraction — blur is masked to the edge of the sphere only (accurate: center of lens refracts ~0, rim refracts most) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          backdropFilter: "blur(6px) brightness(1.04) saturate(1.08)",
          WebkitBackdropFilter: "blur(6px) brightness(1.04) saturate(1.08)",
          WebkitMaskImage: "radial-gradient(circle, transparent 58%, rgba(0,0,0,0.4) 72%, rgba(0,0,0,0.85) 85%, black 100%)",
          maskImage: "radial-gradient(circle, transparent 58%, rgba(0,0,0,0.4) 72%, rgba(0,0,0,0.85) 85%, black 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Specular highlights — upper-left primary reflection + lower-right secondary */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: [
            "radial-gradient(ellipse at 32% 28%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 35%, transparent 60%)",
            "radial-gradient(ellipse at 68% 72%, rgba(255,255,255,0.07) 0%, transparent 40%)",
            "radial-gradient(circle at 50% 50%, transparent 56%, rgba(220,230,215,0.12) 72%, rgba(200,215,195,0.18) 88%, rgba(180,200,175,0.08) 100%)",
          ].join(", "),
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
