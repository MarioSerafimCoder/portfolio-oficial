'use client';

import {useEffect, useRef, useState} from 'react';

const introduction = 'Sou Mário Serafim, diretor de arte em Fortaleza. Trabalho com identidade visual, campanhas e projetos digitais. Gosto da parte visual, claro. Mas gosto principalmente de entender o que existe por trás de cada projeto.';
const characters = Array.from(introduction);

function pauseAfter(index: number) {
  const previous = characters[index - 1];
  const keyStroke = 14 + Math.random() * 30;
  if (previous === '.' || previous === '!' || previous === '?') return keyStroke + 180 + Math.random() * 120;
  if (previous === ',') return keyStroke + 80 + Math.random() * 80;
  if (previous === ' ' && Math.random() < .05) return keyStroke + 80 + Math.random() * 110;
  return keyStroke;
}

export function AboutTypewriter() {
  const [visibleCount, setVisibleCount] = useState(0);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const paragraph = paragraphRef.current;
    if (!paragraph) return;

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionPreference.matches) {
      setVisibleCount(characters.length);
      return;
    }

    let timer: number | undefined;
    let count = 0;
    const typeNext = () => {
      count += 1;
      setVisibleCount(count);
      if (count < characters.length) timer = window.setTimeout(typeNext, pauseAfter(count));
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      timer = window.setTimeout(typeNext, 200);
    }, {threshold: .15});

    observer.observe(paragraph);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return <p className="about-typewriter" ref={paragraphRef}>
    <span className="sr-only">{introduction}</span>
    <span className="about-typewriter-measure" aria-hidden="true">{introduction}</span>
    <span className="about-typewriter-visual" aria-hidden="true">{characters.slice(0, visibleCount).join('')}<span className="about-typewriter-cursor" /></span>
    <noscript><span className="about-typewriter-noscript">{introduction}</span></noscript>
  </p>;
}
