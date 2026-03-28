"use client";

import { useRef, useEffect } from "react";

// 3D → 2D projection keeps stroke width constant regardless of angle
export function GlobeLogo({ size = 20 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 1.5;

    // Tilt angles (fixed axis tilt)
    const tiltX = -20 * (Math.PI / 180);
    const tiltZ = -15 * (Math.PI / 180);

    const cosX = Math.cos(tiltX);
    const sinX = Math.sin(tiltX);
    const cosZ = Math.cos(tiltZ);
    const sinZ = Math.sin(tiltZ);

    function project(
      x: number,
      y: number,
      z: number
    ): [number, number, number] {
      // Rotate around Z
      let x1 = x * cosZ - y * sinZ;
      let y1 = x * sinZ + y * cosZ;
      let z1 = z;
      // Rotate around X
      let y2 = y1 * cosX - z1 * sinX;
      let z2 = y1 * sinX + z1 * cosX;
      return [cx + x1, cy + y2, z2];
    }

    let animId: number;
    const STEPS = 64;

    function draw(time: number) {
      ctx!.clearRect(0, 0, size, size);
      const angle = ((time / 6000) % 1) * Math.PI * 2;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      // Rotate point around Y (spin axis) then project
      function rotAndProject(
        x: number,
        y: number,
        z: number
      ): [number, number, number] {
        const rx = x * cosA + z * sinA;
        const rz = -x * sinA + z * cosA;
        return project(rx, y, rz);
      }

      // Draw a ring as a series of segments with back-face dimming
      function drawRing(
        points: [number, number, number][],
        projected: [number, number, number][],
        color: string,
        dimColor: string,
        lineWidth: number
      ) {
        for (let i = 0; i < projected.length; i++) {
          const j = (i + 1) % projected.length;
          const midZ = (projected[i][2] + projected[j][2]) / 2;
          // Back-face: dim; front-face: full color
          ctx!.strokeStyle = midZ < 0 ? dimColor : color;
          ctx!.lineWidth = lineWidth;
          ctx!.beginPath();
          ctx!.moveTo(projected[i][0], projected[i][1]);
          ctx!.lineTo(projected[j][0], projected[j][1]);
          ctx!.stroke();
        }
      }

      // Generate longitude rings
      const longitudes = [0, 45, 90, 135];
      for (const lng of longitudes) {
        const lngRad = lng * (Math.PI / 180);
        const pts3d: [number, number, number][] = [];
        const pts2d: [number, number, number][] = [];
        for (let i = 0; i <= STEPS; i++) {
          const t = (i / STEPS) * Math.PI * 2;
          const x = r * Math.cos(t) * Math.cos(lngRad);
          const y = r * Math.sin(t);
          const z = r * Math.cos(t) * Math.sin(lngRad);
          pts3d.push([x, y, z]);
          pts2d.push(rotAndProject(x, y, z));
        }
        drawRing(pts3d, pts2d, "#16a34a99", "#16a34a30", 0.8);
      }

      // Generate latitude rings
      const latitudes = [0, 30, -30, 55, -55];
      for (const lat of latitudes) {
        const latRad = lat * (Math.PI / 180);
        const ringR = r * Math.cos(latRad);
        const ringY = r * Math.sin(latRad);
        const pts3d: [number, number, number][] = [];
        const pts2d: [number, number, number][] = [];
        for (let i = 0; i <= STEPS; i++) {
          const t = (i / STEPS) * Math.PI * 2;
          const x = ringR * Math.cos(t);
          const z = ringR * Math.sin(t);
          pts3d.push([x, ringY, z]);
          pts2d.push(rotAndProject(x, ringY, z));
        }
        const isEquator = lat === 0;
        drawRing(
          pts3d,
          pts2d,
          isEquator ? "#16a34acc" : "#16a34a55",
          isEquator ? "#16a34a40" : "#16a34a20",
          isEquator ? 0.9 : 0.7
        );
      }

      // Outer circle (always fully visible)
      ctx!.beginPath();
      ctx!.arc(cx, cy, r, 0, Math.PI * 2);
      ctx!.strokeStyle = "#16a34a";
      ctx!.lineWidth = 1.2;
      ctx!.stroke();

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      className="flex-shrink-0"
      style={{ width: size, height: size }}
    />
  );
}
