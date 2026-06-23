'use client';

import { useEffect, useRef } from 'react';

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const points: { x: number; y: number }[] = [];
    const maxPoints = 20;
    let raf: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent) => {
      points.push({ x: e.clientX, y: e.clientY });
      if (points.length > maxPoints) points.shift();
    };
    document.addEventListener('mousemove', onMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (points.length > 1) {
        for (let i = 1; i < points.length; i++) {
          const p = points[i];
          const prev = points[i - 1];
          const alpha = i / points.length;

          ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';

          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999999 }}
    />
  );
}
