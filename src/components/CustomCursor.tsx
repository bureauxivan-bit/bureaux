'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function CustomCursor() {
  const pathname = usePathname();
  const wrapRef = useRef<HTMLDivElement>(null);
  const dotRef  = useRef<HTMLDivElement>(null);
  const mouse   = useRef({ x: -300, y: -300 });
  const rafRef  = useRef<number>(0);

  useEffect(() => {
    if (pathname.startsWith('/admin') || pathname.startsWith('/miy-proekt') || pathname === '/login' || pathname === '/register') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const enter = () => dotRef.current?.classList.add('scale-[2.5]', 'opacity-30');
    const leave = () => dotRef.current?.classList.remove('scale-[2.5]', 'opacity-30');

    const bindHover = () => {
      document.querySelectorAll('a, button, [role="button"], input, textarea, select').forEach((el) => {
        el.addEventListener('mouseenter', enter);
        el.addEventListener('mouseleave', leave);
      });
    };
    bindHover();

    const observer = new MutationObserver(bindHover);
    observer.observe(document.body, { childList: true, subtree: true });

    const animate = () => {
      if (wrapRef.current) {
        wrapRef.current.style.transform =
          `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    document.addEventListener('mousemove', onMove);
    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [pathname]);

  if (pathname.startsWith('/admin') || pathname.startsWith('/miy-proekt') || pathname === '/login' || pathname === '/register') return null;

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{ willChange: 'transform', transform: 'translate3d(-300px, -300px, 0)' }}
    >
      <div
        ref={dotRef}
        className="h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink transition-[transform,opacity] duration-300"
      />
    </div>
  );
}
