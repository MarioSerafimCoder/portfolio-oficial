'use client';

import {useEffect, useId, useRef, useState} from 'react';
import Image from 'next/image';
import './fortune-cookie.css';

type Phase = 'closed' | 'opening' | 'open' | 'closing';

const openings = [
  'Nem toda ideia precisa de um logo',
  'O briefing pediu ousadia',
  'A tendência chegou atrasada',
  'Seu processo criativo merece uma pausa',
  'A inspiração também lê o contrato',
];
const endings = [
  'mas toda reunião quer um.',
  'e aprovou a primeira opção.',
  'bem na hora de virar referência.',
  'antes de abrir outra aba.',
  'antes de aceitar o prazo.',
];

export function FortuneCookie() {
  const [phase, setPhase] = useState<Phase>('closed');
  const [phrase, setPhrase] = useState('');
  const lastIndex = useRef(-1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paperId = useId();

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function toggle() {
    if (phase === 'opening' || phase === 'closing') return;
    if (timer.current) clearTimeout(timer.current);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (phase === 'closed') {
      let index = Math.floor(Math.random() * openings.length * endings.length);
      if (index === lastIndex.current) index = (index + 1) % (openings.length * endings.length);
      lastIndex.current = index;
      setPhrase(`${openings[Math.floor(index / endings.length)]}, ${endings[index % endings.length]}`);
      setPhase(reducedMotion ? 'open' : 'opening');
      if (!reducedMotion) timer.current = setTimeout(() => setPhase('open'), 560);
    } else {
      setPhase(reducedMotion ? 'closed' : 'closing');
      if (!reducedMotion) timer.current = setTimeout(() => setPhase('closed'), 560);
    }
  }

  const expanded = phase === 'opening' || phase === 'open';
  return <div className="fortune-cookie">
    <span className="fortune-cookie-heading">BISCOITO DA DISCÓRDIA</span>
    <button type="button" className={`fortune-cookie-button fortune-cookie-${phase}`} onClick={toggle} disabled={phase === 'opening' || phase === 'closing'} aria-expanded={expanded} aria-controls={paperId} aria-label={expanded ? 'Fechar biscoito' : 'Abrir biscoito'}>
      <span id={paperId} className="fortune-cookie-paper" aria-hidden={!expanded}>
        <Image src="/images/biscoito-papel.webp" alt="" width={1182} height={413} sizes="(max-width: 700px) 320px, 300px" />
        <span className="fortune-cookie-paper-copy">{phrase}</span>
      </span>
      <span className="fortune-cookie-art" aria-hidden="true">
        <Image className="fortune-cookie-half fortune-cookie-left" src="/images/biscoito-esquerdo.webp" alt="" width={409} height={660} sizes="100px" />
        <Image className="fortune-cookie-half fortune-cookie-right" src="/images/biscoito-direito.webp" alt="" width={441} height={660} sizes="100px" />
      </span>
    </button>
    <span className="fortune-cookie-hint">{expanded ? 'Clique para fechar' : 'Clique para abrir'}</span>
  </div>;
}
