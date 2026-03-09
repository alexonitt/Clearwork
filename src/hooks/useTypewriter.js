import { useState, useEffect } from 'react';

export function useTypewriter(text, speed = 30, startOn = true) {
  const [display, setDisplay] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!startOn || !text) return;
    setDisplay('');
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      if (i <= text.length) {
        setDisplay(text.slice(0, i));
        i++;
      } else {
        setDone(true);
        clearInterval(id);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, startOn]);

  return [display, done];
}
