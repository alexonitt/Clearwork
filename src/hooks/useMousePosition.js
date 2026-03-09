import { useEffect, useState } from 'react';

export function useMousePosition(lag = 0.15) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMove);

    let rafId;
    const smooth = () => {
      setSmoothPosition((prev) => ({
        x: prev.x + (position.x - prev.x) * lag,
        y: prev.y + (position.y - prev.y) * lag,
      }));
      rafId = requestAnimationFrame(smooth);
    };
    rafId = requestAnimationFrame(smooth);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(rafId);
    };
  }, [position.x, position.y, lag]);

  return smoothPosition;
}
