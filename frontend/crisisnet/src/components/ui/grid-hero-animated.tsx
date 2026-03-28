"use client";

import { useEffect, useRef, useCallback, useState, type RefObject } from "react";

interface LightParticle {
  x: number;
  y: number;
  speed: number;
  brightness: number;
  gridLine: "horizontal" | "vertical";
}

interface HoverFill {
  col: number; // world col
  row: number; // world row
  alpha: number;
}

interface GridHeroProps {
  className?: string;
  gridSize?: number;
  gridColor?: string;
  particleColor?: string;
  gridOpacity?: number;
  containerRef?: RefObject<HTMLElement | null>;
  rippleCenterRef?: RefObject<{ x: number; y: number } | null>;
  scrollDirection?: "tr" | "tl" | "br" | "bl";
  scrollSpeed?: number;
}

export function GridHero({
  className = "",
  gridSize = 40,
  gridColor = "#7a9470",
  particleColor = "#16a34a",
  gridOpacity = 0.22,
  containerRef,
  rippleCenterRef,
  scrollDirection = "tr",
  scrollSpeed = 18,
}: GridHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>();
  const lightsRef = useRef<LightParticle[]>([]);
  const hoveredRef = useRef<{ col: number; row: number } | null>(null);
  const fillsRef = useRef<HoverFill[]>([]);
  const lastTimeRef = useRef(0);
  const ripplesRef = useRef<{ wx: number; wy: number; start: number }[]>([]);
  const wasHoveringRef = useRef(false);
  const scrollXRef = useRef(0);
  const scrollYRef = useRef(0);
  const mouseCanvasRef = useRef<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  const dx = scrollDirection.includes("r") ? 1 : -1;
  const dy = scrollDirection.includes("b") ? 1 : -1;

  useEffect(() => setMounted(true), []);

  const hexToRgb = useCallback((hex: string) => ({
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  }), []);

  // Returns visual canvas offset for a given total scroll value: always in [0, gridSize)
  const gridOffset = useCallback(
    (scroll: number) => ((scroll % gridSize) + gridSize) % gridSize,
    [gridSize]
  );

  // Spawn a particle on a random visible grid line
  const createLight = useCallback(
    (w: number, h: number, ox: number, oy: number): LightParticle => {
      const speed = 150 + Math.random() * 250;
      if (Math.random() > 0.5) {
        // horizontal — travels in +x across canvas, y snapped to a visible row
        const numRows = Math.ceil(h / gridSize) + 2;
        const k = Math.floor(Math.random() * numRows);
        const y = oy - gridSize + k * gridSize;
        return { x: -12, y, speed, brightness: 0.7 + Math.random() * 0.3, gridLine: "horizontal" };
      } else {
        // vertical — travels in +y across canvas, x snapped to a visible column
        const numCols = Math.ceil(w / gridSize) + 2;
        const k = Math.floor(Math.random() * numCols);
        const x = ox - gridSize + k * gridSize;
        return { x, y: -12, speed, brightness: 0.7 + Math.random() * 0.3, gridLine: "vertical" };
      }
    },
    [gridSize]
  );

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
      const ox = gridOffset(scrollXRef.current);
      const oy = gridOffset(scrollYRef.current);
      ctx.strokeStyle = `rgba(${gRgb.r},${gRgb.g},${gRgb.b},${gridOpacity})`;
      ctx.lineWidth = 1;
      // vertical lines — start one cell before canvas left edge to fill seamlessly
      for (let gx = ox - gridSize; gx <= w + gridSize; gx += gridSize) {
        ctx.beginPath();
        for (let gy = 0; gy <= h; gy += 2) {
          const ax = gx + wave(gx, gy, cx, cy, w);
          gy === 0 ? ctx.moveTo(ax, gy) : ctx.lineTo(ax, gy);
        }
        ctx.stroke();
      }
      // horizontal lines
      for (let gy = oy - gridSize; gy <= h + gridSize; gy += gridSize) {
        ctx.beginPath();
        for (let gx = 0; gx <= w; gx += 2) {
          const ay = gy + wave(gx, gy, cx, cy, h);
          gx === 0 ? ctx.moveTo(gx, ay) : ctx.lineTo(gx, ay);
        }
        ctx.stroke();
      }
    };

    // World → canvas conversion
    const toCanvasX = (worldX: number) => worldX - scrollXRef.current;
    const toCanvasY = (worldY: number) => worldY - scrollYRef.current;

    const drawFills = (w: number, h: number, cx: number, cy: number) => {
      fillsRef.current.forEach((hf) => {
        if (hf.alpha <= 0) return;
        const bx = toCanvasX(hf.col * gridSize);
        const by = toCanvasY(hf.row * gridSize);
        if (bx > w + gridSize || bx + gridSize < -gridSize || by > h + gridSize || by + gridSize < -gridSize) return;
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

    const RIPPLE_MAX_RADIUS = 22;
    const RIPPLE_EXPAND_SPEED = 14;
    const RIPPLE_RING_WIDTH = 4;

    const drawRipples = (w: number, h: number, cx: number, cy: number, now: number) => {
      const isHovering = rippleCenterRef?.current != null;
      if (isHovering && !wasHoveringRef.current && rippleCenterRef?.current) {
        // Store in world coords so ripple travels with the grid
        ripplesRef.current.push({
          wx: rippleCenterRef.current.x + scrollXRef.current,
          wy: rippleCenterRef.current.y + scrollYRef.current,
          start: now,
        });
      }
      wasHoveringRef.current = isHovering;

      const cellAlpha = new Map<string, number>();

      ripplesRef.current = ripplesRef.current.filter((ripple) => {
        const elapsed = (now - ripple.start) / 1000;
        const wavefront = elapsed * RIPPLE_EXPAND_SPEED;
        if (wavefront > RIPPLE_MAX_RADIUS + RIPPLE_RING_WIDTH) return false;

        const centerCol = Math.floor(ripple.wx / gridSize);
        const centerRow = Math.floor(ripple.wy / gridSize);
        const outerR = Math.min(Math.ceil(wavefront) + 1, RIPPLE_MAX_RADIUS + RIPPLE_RING_WIDTH);

        // Visible world col/row range
        const visColMin = Math.floor(scrollXRef.current / gridSize) - 1;
        const visRowMin = Math.floor(scrollYRef.current / gridSize) - 1;
        const visColMax = visColMin + Math.ceil(w / gridSize) + 3;
        const visRowMax = visRowMin + Math.ceil(h / gridSize) + 3;

        const minCol = Math.max(visColMin, centerCol - outerR);
        const maxCol = Math.min(visColMax, centerCol + outerR);
        const minRow = Math.max(visRowMin, centerRow - outerR);
        const maxRow = Math.min(visRowMax, centerRow + outerR);

        for (let col = minCol; col <= maxCol; col++) {
          for (let row = minRow; row <= maxRow; row++) {
            const dist = Math.sqrt((col - centerCol) ** 2 + (row - centerRow) ** 2);
            if (dist > wavefront || dist < wavefront - RIPPLE_RING_WIDTH) continue;
            if (dist > RIPPLE_MAX_RADIUS) continue;
            const ringPos = 1 - (wavefront - dist) / RIPPLE_RING_WIDTH;
            const distFade = 1 - dist / RIPPLE_MAX_RADIUS;
            const alpha = ringPos * distFade;
            if (alpha > 0) {
              const key = `${col},${row}`;
              cellAlpha.set(key, Math.min(1, (cellAlpha.get(key) ?? 0) + alpha));
            }
          }
        }
        return true;
      });

      cellAlpha.forEach((a, key) => {
        if (a <= 0.01) return;
        const [colStr, rowStr] = key.split(",");
        const col = parseInt(colStr);
        const row = parseInt(rowStr);
        const bx = toCanvasX(col * gridSize);
        const by = toCanvasY(row * gridSize);
        if (bx > w + gridSize || bx + gridSize < -gridSize || by > h + gridSize || by + gridSize < -gridSize) return;
        const corners = [
          [bx, by], [bx + gridSize, by],
          [bx + gridSize, by + gridSize], [bx, by + gridSize],
        ].map(([px, py]) => [px + wave(px, py, cx, cy, w), py + wave(px, py, cx, cy, h)]);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(corners[0][0], corners[0][1]);
        for (let i = 1; i < 4; i++) ctx.lineTo(corners[i][0], corners[i][1]);
        ctx.closePath();
        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${a * 0.22})`;
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
      if (lastTimeRef.current === 0) lastTimeRef.current = now;
      const dt = Math.min(now - lastTimeRef.current, 50);
      lastTimeRef.current = now;

      if (currentW === 0 || currentH === 0) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }
      const w = currentW;
      const h = currentH;
      const cx = w / 2, cy = h / 2;

      // Advance scroll
      const scrollDX = dx * scrollSpeed * dt * 0.001;
      const scrollDY = dy * scrollSpeed * dt * 0.001;
      scrollXRef.current += scrollDX;
      scrollYRef.current += scrollDY;

      const ox = gridOffset(scrollXRef.current);
      const oy = gridOffset(scrollYRef.current);

      // Update hovered cell from current mouse position (so stationary mouse
      // sees cells scrolling under it and lights them up correctly)
      if (mouseCanvasRef.current) {
        const col = Math.floor((mouseCanvasRef.current.x + scrollXRef.current) / gridSize);
        const row = Math.floor((mouseCanvasRef.current.y + scrollYRef.current) / gridSize);
        const prev = hoveredRef.current;
        if (!prev || prev.col !== col || prev.row !== row) {
          hoveredRef.current = { col, row };
          const ex = fillsRef.current.find((hf) => hf.col === col && hf.row === row);
          if (ex) ex.alpha = 1;
          else fillsRef.current.push({ col, row, alpha: 1 });
        }
      }

      ctx.clearRect(0, 0, w, h);
      drawGrid(w, h, cx, cy);
      drawRipples(w, h, cx, cy, now);
      drawFills(w, h, cx, cy);
      drawLights(w, h, cx, cy);

      // Update particles: move with grid scroll AND along their grid line
      const margin = gridSize * 2;
      lightsRef.current = lightsRef.current.filter((light) => {
        light.x += scrollDX + (light.gridLine === "horizontal" ? light.speed * dt * 0.001 : 0);
        light.y += scrollDY + (light.gridLine === "vertical" ? light.speed * dt * 0.001 : 0);
        return (
          light.x > -margin && light.x < w + margin &&
          light.y > -margin && light.y < h + margin
        );
      });

      if (Math.random() < 0.025 && lightsRef.current.length < 8) {
        lightsRef.current.push(createLight(w, h, ox, oy));
      }

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
  }, [mounted, gridSize, gridColor, particleColor, gridOpacity, createLight, hexToRgb, rippleCenterRef, gridOffset, dx, dy, scrollSpeed]);

  // Mouse listeners — only update mouseCanvasRef; hover cell computed per-frame in animate loop
  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    const target = containerRef?.current ?? canvas;
    if (!target) return;

    const onMove = (e: MouseEvent) => {
      const rect = (target as Element).getBoundingClientRect();
      mouseCanvasRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    const onLeave = () => {
      mouseCanvasRef.current = null;
      hoveredRef.current = null;
    };

    target.addEventListener("mousemove", onMove as EventListener);
    target.addEventListener("mouseleave", onLeave);

    return () => {
      target.removeEventListener("mousemove", onMove as EventListener);
      target.removeEventListener("mouseleave", onLeave);
    };
  }, [mounted, containerRef]);

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

