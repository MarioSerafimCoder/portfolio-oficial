'use client';

import {useEffect, useRef} from 'react';

/** A continuous contour field, independent of scroll or the foreground sculpture. */
export function LivingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const hero = canvas.parentElement!;
    const context = canvas.getContext('2d');
    if (!context) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(pointer: fine)');
    let width = 1, height = 1, visible = false, frame = 0, last = 0, elapsed = 0;
    let x = 0, y = 0, targetX = 0, targetY = 0;
    function stop() { cancelAnimationFrame(frame); frame = 0; last = 0; }
    function request() {
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw);
    }
    function draw(now: number) {
      frame = 0;
      const dt = last ? Math.min((now - last) / 1000, .05) : 1 / 30;
      // Keep the field economical on phones and high-refresh monitors.
      if (last && now - last < 1000 / 30) { request(); return; }
      last = now;
      if (!reduced.matches) elapsed += dt;
      const ease = 1 - Math.exp(-3 * dt);
      x += (targetX - x) * ease; y += (targetY - y) * ease;
      const t = reduced.matches ? 0 : elapsed;
      const px = reduced.matches ? 0 : x, py = reduced.matches ? 0 : y;
      context!.clearRect(0, 0, width, height);
      context!.strokeStyle = getComputedStyle(canvas).color;
      context!.lineWidth = 1;
      const unit = Math.max(width * .48, height * .58);
      for (let ring = 0; ring < 9; ring++) {
        context!.beginPath();
        for (let step = 0; step <= 160; step++) {
          const a = step / 160 * Math.PI * 2;
          const radius = .25 + ring * .19;
          const ripple = Math.sin(a * 3 + t * .23 + ring * .22) * .065
            + Math.cos(a * 2 - t * .19 + ring * .17) * .1
            + Math.sin(a * 5 - t * .14) * .025;
          const cx = width * .74 + Math.sin(t * .12) * width * .045 + px * 28;
          const cy = height * .38 + Math.cos(t * .15) * height * .04 + py * 24;
          const vx = cx + Math.cos(a) * (radius + ripple) * unit * 1.2
            + Math.sin(a * 2 + t * .18) * unit * .07;
          const vy = cy + Math.sin(a) * (radius + ripple) * unit * .78
            + Math.cos(a * 3 - t * .16) * unit * .045;
          if (step === 0) context!.moveTo(vx, vy); else context!.lineTo(vx, vy);
        }
        context!.closePath(); context!.stroke();
      }
      if (!reduced.matches) request();
    }
    const resize = new ResizeObserver(() => {
      width = hero.clientWidth; height = hero.clientHeight;
      const dpr = Math.min(devicePixelRatio, 1.5);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0); request();
    });
    resize.observe(hero);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting; if (visible) request(); else stop();
    }); observer.observe(hero);
    const move = (event: PointerEvent) => {
      if (reduced.matches || !fine.matches || event.pointerType === 'touch') return;
      const rect = hero.getBoundingClientRect();
      targetX = (event.clientX - rect.left) / width * 2 - 1;
      targetY = (event.clientY - rect.top) / height * 2 - 1;
    };
    const reset = () => { targetX = targetY = 0; request(); };
    const visibility = () => { if (document.hidden) stop(); else request(); };
    const theme = new MutationObserver(request);
    theme.observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme', 'class']});
    hero.addEventListener('pointermove', move, {passive: true});
    hero.addEventListener('pointerleave', reset);
    reduced.addEventListener('change', reset);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      stop(); resize.disconnect(); observer.disconnect(); theme.disconnect();
      hero.removeEventListener('pointermove', move); hero.removeEventListener('pointerleave', reset);
      reduced.removeEventListener('change', reset); document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  return <canvas ref={canvasRef} className="living-background" aria-hidden="true" />;
}
