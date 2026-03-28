"use client";

import { useEffect, useRef, useCallback, useState, type RefObject } from "react";

interface LightParticle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  brightness: number;
  gridLine: "horizontal" | "vertical";
  progress: number;
}

interface HoverFill {
  col: number;
  row: number;
  alpha: number;
}

interface GridHeroProps {
  className?: string;
  gridSize?: number;
  gridColor?: string;
  particleColor?: string;
  gridOpacity?: number;
  containerRef?: RefObject<HTMLElement | null>;
}

export function GridHero({
  className = "",
  gridSize = 40,
  gridColor = "#7a9470",
  particleColor = "#16a34a",
  gridOpacity = 0.22,
  containerRef,
}: GridHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>();
  const lightsRef = useRef<LightParticle[]>([]);
  const hoveredRef = useRef<{ col: number; row: number } | null>(null);
  const fillsRef = useRef<HoverFill[]>([]);
  const lastTimeRef = useRef(0);
  const [mounted, setMounted] = useState(false);

  // Trigger a re-render after mount so containerRef.current is populated
  useEffect(() => setMounted(true), []);

  const hexToRgb = useCallback((hex: string) => ({
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  }), []);

  const createLight = useCallback((w: number, h: number): LightParticle => {
    if (Math.random() > 0.5) {
      const y = Math.floor(Math.random() * (h / gridSize)) * gridSize;
      return { x: 0, y, targetX: w, targetY: y, speed: 0.4 + Math.random() * 1.2, brightness: 0.7 + Math.random() * 0.3, gridLine: "horizontal", progress: 0 };
    }
    const x = Math.floor(Math.random() * (w / gridSize)) * gridSize;
    return { x, y: 0, targetX: x, targetY: h, speed: 0.4 + Math.random() * 1.2, brightness: 0.7 + Math.random() * 0.3, gridLine: "vertical", progress: 0 };
  }, [gridSize]);

  // Main animation + drawing effect
  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rgb = hexToRgb(particleColor);
    const gRgb = hexToRgb(gridColor);
    let currentW = 0;
    let currentH = 0;

    const applySize = (w: number, h: number) => {
      if (w === 0 || h === 0) return;
      canvas.width = w * window.devicePixelRatio;
      canvas.height = h * window.devicePixelRatio;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      currentW = w;
      currentH = h;
    };

    // Use ResizeObserver — fires when element actually gets dimensions
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        applySize(width, height);
      }
    });
    ro.observe(canvas);

    const wave = (x: number, y: number, cx: number, cy: number, size: number) => {
      const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      return Math.sin(d * 0.02) * 12 * Math.max(0, 1 - d / (size * 0.85));
    };

    const drawGrid = (w: number, h: number, cx: number, cy: number) => {
      ctx.strokeStyle = `rgba(${gRgb.r},${gRgb.g},${gRgb.b},${gridOpacity})`;
      ctx.lineWidth = 1;
      for (let gx = 0; gx <= w + gridSize; gx += gridSize) {
        ctx.beginPath();
        for (let gy = 0; gy <= h; gy += 2) {
          const ax = gx + wave(gx, gy, cx, cy, w);
          gy === 0 ? ctx.moveTo(ax, gy) : ctx.lineTo(ax, gy);
        }
        ctx.stroke();
      }
      for (let gy = 0; gy <= h + gridSize; gy += gridSize) {
        ctx.beginPath();
        for (let gx = 0; gx <= w; gx += 2) {
          const ay = gy + wave(gx, gy, cx, cy, h);
          gx === 0 ? ctx.moveTo(gx, ay) : ctx.lineTo(gx, ay);
        }
        ctx.stroke();
      }
    };

    const drawFills = (w: number, h: number, cx: number, cy: number) => {
      fillsRef.current.forEach((hf) => {
        if (hf.alpha <= 0) return;
        const bx = hf.col * gridSize;
        const by = hf.row * gridSize;
        const corners = [
          [bx, by], [bx + gridSize, by],
          [bx + gridSize, by + gridSize], [bx, by + gridSize],
        ].map(([px, py]) => [px + wave(px, py, cx, cy, w), py + wave(px, py, cx, cy, h)]);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(corners[0][0], corners[0][1]);
        for (let i = 1; i < 4; i++) ctx.lineTo(corners[i][0], corners[i][1]);
        ctx.closePath();
        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${hf.alpha * 0.2})`;
        ctx.fill();
        ctx.restore();
      });
    };

    const drawLights = (w: number, h: number, cx: number, cy: number) => {
      lightsRef.current.forEach((light) => {
        const d = Math.sqrt((light.x - cx) ** 2 + (light.y - cy) ** 2);
        const wv = Math.sin(d * 0.02) * 12 * Math.max(0, 1 - d / (w * 0.85));
        const ax = light.gridLine === "vertical" ? light.x + wv : light.x;
        const ay = light.gridLine === "horizontal" ? light.y + wv : light.y;
        const g = ctx.createRadialGradient(ax, ay, 0, ax, ay, 16);
        g.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},${light.brightness})`);
        g.addColorStop(0.5, `rgba(${rgb.r},${rgb.g},${rgb.b},${light.brightness * 0.45})`);
        g.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(ax, ay, 16, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${light.brightness})`;
        ctx.beginPath(); ctx.arc(ax, ay, 2, 0, Math.PI * 2); ctx.fill();
      });
    };

    const animate = (now: number) => {
      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;
      if (currentW === 0 || currentH === 0) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }
      const w = currentW;
      const h = currentH;
      const cx = w / 2, cy = h / 2;
      ctx.clearRect(0, 0, w, h);
      drawGrid(w, h, cx, cy);
      drawFills(w, h, cx, cy);
      drawLights(w, h, cx, cy);
      lightsRef.current = lightsRef.current.filter((light) => {
        light.progress += light.speed * dt * 0.001;
        if (light.gridLine === "horizontal") light.x = light.progress * light.targetX;
        else light.y = light.progress * light.targetY;
        return light.progress < 1;
      });
      if (Math.random() < 0.025 && lightsRef.current.length < 8)
        lightsRef.current.push(createLight(w, h));
      fillsRef.current = fillsRef.current
        .map((hf) => ({ ...hf, alpha: hf.alpha - dt * 0.002 }))
        .filter((hf) => hf.alpha > 0);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      ro.disconnect();
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [mounted, gridSize, gridColor, particleColor, gridOpacity, createLight, hexToRgb]);

  // Separate effect for mouse listeners — uses containerRef.current after mount
  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    const target = containerRef?.current ?? canvas;
    if (!target) return;

    const onMove = (e: MouseEvent) => {
      const rect = (target as Element).getBoundingClientRect();
      const col = Math.floor((e.clientX - rect.left) / gridSize);
      const row = Math.floor((e.clientY - rect.top) / gridSize);
      const prev = hoveredRef.current;
      if (!prev || prev.col !== col || prev.row !== row) {
        hoveredRef.current = { col, row };
        const ex = fillsRef.current.find((hf) => hf.col === col && hf.row === row);
        if (ex) ex.alpha = 1;
        else fillsRef.current.push({ col, row, alpha: 1 });
      }
    };
    const onLeave = () => { hoveredRef.current = null; };

    target.addEventListener("mousemove", onMove as EventListener);
    target.addEventListener("mouseleave", onLeave);

    return () => {
      target.removeEventListener("mousemove", onMove as EventListener);
      target.removeEventListener("mouseleave", onLeave);
    };
  }, [mounted, containerRef, gridSize]);

  return (
    <div className={`absolute inset-0 ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ width: "100%", height: "100%", pointerEvents: "none" }}
      />
    </div>
  );
}
