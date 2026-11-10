'use client';

import {useEffect, useId, useRef, useState} from 'react';
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
      <span id={paperId} className="fortune-cookie-paper" aria-hidden={!expanded}>{phrase}</span>
      <svg className="fortune-cookie-art" viewBox="0 0 220 170" aria-hidden="true" focusable="false">
        <g className="fortune-cookie-half fortune-cookie-left">
          <path d="M110 14 C77 5 43 20 28 48 C8 77 19 119 47 139 C66 157 91 160 110 154 L104 136 L114 119 L105 101 L113 80 L103 61 L112 42 Z" />
          <path className="fortune-cookie-chip" d="m48 60 9-4 5 7-8 5z M72 112 l9-5 5 8-8 5z M86 37 l7-4 4 7-7 4z" />
        </g>
        <g className="fortune-cookie-half fortune-cookie-right">
          <path d="M110 14 C145 8 178 26 192 51 C210 83 198 124 171 143 C152 158 128 161 110 154 L104 136 L114 119 L105 101 L113 80 L103 61 L112 42 Z" />
          <path className="fortune-cookie-chip" d="m146 51 9-4 5 8-8 5z M172 103 l8-4 5 8-8 5z M135 130 l8-5 4 8-7 4z" />
        </g>
      </svg>
    </button>
    <span className="fortune-cookie-hint">{expanded ? 'Clique para fechar' : 'Clique para abrir'}</span>
  </div>;
}
