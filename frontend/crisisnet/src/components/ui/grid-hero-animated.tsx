"use client";

import { useEffect, useRef, useCallback } from "react";

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
  /** Overlay children rendered above the canvas (your hero text) */
  children?: React.ReactNode;
  className?: string;
  /** Grid cell size in px, defaults to 40 */
  gridSize?: number;
  /** Static grid line color */
  gridColor?: string;
  /** Particle glow color (center stop) */
  particleColor?: string;
  /** Grid opacity (0–1) */
  gridOpacity?: number;
}

export function GridHero({
  children,
  className = "",
  gridSize = 40,
  gridColor = "#7a9470",
  particleColor = "#16a34a",
  gridOpacity = 0.22,
}: GridHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lightsRef = useRef<LightParticle[]>([]);
  const hoveredRef = useRef<{ col: number; row: number } | null>(null);
  const hoverFillsRef = useRef<HoverFill[]>([]);
  const lastTimeRef = useRef(0);

  // Parse hex to rgb
  const hexToRgb = useCallback((hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }, []);

  const createLight = useCallback(
    (width: number, height: number): LightParticle => {
      const isHorizontal = Math.random() > 0.5;
      if (isHorizontal) {
        const y = Math.floor(Math.random() * (height / gridSize)) * gridSize;
        return {
          x: 0,
          y,
          targetX: width,
          targetY: y,
          speed: 0.4 + Math.random() * 1.2,
          brightness: 0.7 + Math.random() * 0.3,
          gridLine: "horizontal",
          progress: 0,
        };
      } else {
        const x = Math.floor(Math.random() * (width / gridSize)) * gridSize;
        return {
          x,
          y: 0,
          targetX: x,
          targetY: height,
          speed: 0.4 + Math.random() * 1.2,
          brightness: 0.7 + Math.random() * 0.3,
          gridLine: "vertical",
          progress: 0,
        };
      }
    },
    [gridSize]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rgb = hexToRgb(particleColor);
    const gridRgb = hexToRgb(gridColor);

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const getWaveOffset = (
      x: number,
      y: number,
      centerX: number,
      centerY: number,
      size: number
    ) => {
      const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      const wave = Math.sin(dist * 0.02) * 12;
      const perspective = Math.max(0, 1 - dist / (size * 0.85));
      return wave * perspective;
    };

    const drawGrid = (
      width: number,
      height: number,
      centerX: number,
      centerY: number
    ) => {
      ctx.strokeStyle = `rgba(${gridRgb.r},${gridRgb.g},${gridRgb.b},${gridOpacity})`;
      ctx.lineWidth = 1;

      // vertical grid lines
      for (let gx = 0; gx <= width + gridSize; gx += gridSize) {
        ctx.beginPath();
        for (let gy = 0; gy <= height; gy += 2) {
          const offset = getWaveOffset(gx, gy, centerX, centerY, width);
          const ax = gx + offset;
          gy === 0 ? ctx.moveTo(ax, gy) : ctx.lineTo(ax, gy);
        }
        ctx.stroke();
      }

      // horizontal grid lines
      for (let gy = 0; gy <= height + gridSize; gy += gridSize) {
        ctx.beginPath();
        for (let gx = 0; gx <= width; gx += 2) {
          const offset = getWaveOffset(gx, gy, centerX, centerY, height);
          const ay = gy + offset;
          gx === 0 ? ctx.moveTo(gx, ay) : ctx.lineTo(gx, ay);
        }
        ctx.stroke();
      }
    };

    const drawHoverFills = (
      width: number,
      height: number,
      centerX: number,
      centerY: number
    ) => {
      hoverFillsRef.current.forEach((hf) => {
        if (hf.alpha <= 0) return;
        const bx = hf.col * gridSize;
        const by = hf.row * gridSize;

        ctx.save();

        // Clip to the (roughly) warped cell region using a polygon of the 4 corners
        const corners = [
          [bx, by],
          [bx + gridSize, by],
          [bx + gridSize, by + gridSize],
          [bx, by + gridSize],
        ].map(([cx, cy]) => {
          const ov = getWaveOffset(cx, cy, centerX, centerY, width);
          const oh = getWaveOffset(cx, cy, centerX, centerY, height);
          return [cx + ov, cy + oh];
        });

        ctx.beginPath();
        ctx.moveTo(corners[0][0], corners[0][1]);
        for (let i = 1; i < 4; i++) ctx.lineTo(corners[i][0], corners[i][1]);
        ctx.closePath();

        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${hf.alpha * 0.18})`;
        ctx.fill();
        ctx.restore();
      });
    };

    const drawLights = (
      width: number,
      height: number,
      centerX: number,
      centerY: number
    ) => {
      lightsRef.current.forEach((light) => {
        const dist = Math.sqrt(
          (light.x - centerX) ** 2 + (light.y - centerY) ** 2
        );
        const wave = Math.sin(dist * 0.02) * 12;

        let ax = light.x;
        let ay = light.y;
        if (light.gridLine === "vertical") {
          ax = light.x + wave * Math.max(0, 1 - dist / (width * 0.85));
        } else {
          ay = light.y + wave * Math.max(0, 1 - dist / (height * 0.85));
        }

        const grad = ctx.createRadialGradient(ax, ay, 0, ax, ay, 16);
        grad.addColorStop(
          0,
          `rgba(${rgb.r},${rgb.g},${rgb.b},${light.brightness})`
        );
        grad.addColorStop(
          0.5,
          `rgba(${rgb.r},${rgb.g},${rgb.b},${light.brightness * 0.45})`
        );
        grad.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ax, ay, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${light.brightness})`;
        ctx.beginPath();
        ctx.arc(ax, ay, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const animate = (now: number) => {
      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;

      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      drawGrid(w, h, cx, cy);
      drawHoverFills(w, h, cx, cy);
      drawLights(w, h, cx, cy);

      // Update lights
      lightsRef.current = lightsRef.current.filter((light) => {
        light.progress += light.speed * dt * 0.001;
        if (light.gridLine === "horizontal") {
          light.x = light.progress * light.targetX;
        } else {
          light.y = light.progress * light.targetY;
        }
        return light.progress < 1;
      });

      if (Math.random() < 0.025 && lightsRef.current.length < 8) {
        lightsRef.current.push(createLight(w, h));
      }

      // Decay hover fills
      hoverFillsRef.current = hoverFillsRef.current
        .map((hf) => ({ ...hf, alpha: hf.alpha - dt * 0.0018 }))
        .filter((hf) => hf.alpha > 0);

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animationRef.current = requestAnimationFrame(animate);
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gridSize, gridColor, particleColor, gridOpacity, createLight, hexToRgb]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const col = Math.floor(mx / gridSize);
      const row = Math.floor(my / gridSize);

      const prev = hoveredRef.current;
      if (!prev || prev.col !== col || prev.row !== row) {
        hoveredRef.current = { col, row };
        // Push a new fill or refresh existing
        const existing = hoverFillsRef.current.find(
          (hf) => hf.col === col && hf.row === row
        );
        if (existing) {
          existing.alpha = 1;
        } else {
          hoverFillsRef.current.push({ col, row, alpha: 1 });
        }
      }
    },
    [gridSize]
  );

  const handleMouseLeave = useCallback(() => {
    hoveredRef.current = null;
  }, []);

  return (
    <div className={`absolute inset-0 ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
