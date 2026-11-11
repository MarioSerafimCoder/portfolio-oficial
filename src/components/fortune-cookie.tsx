'use client';

import {useEffect, useId, useRef, useState} from 'react';
import Image from 'next/image';
import catalog from '@/content/fortune-cookie-phrases.json';
import {createFortuneDrawer} from '@/lib/fortune-cookie-draw';
import './fortune-cookie.css';

type Phase = 'closed' | 'opening' | 'open' | 'closing';

const phrases = new Map(catalog.map(({id, texto}) => [id, texto]));
const phraseIds = [...phrases.keys()];
const draw = createFortuneDrawer();

export function FortuneCookie() {
  const [phase, setPhase] = useState<Phase>('closed');
  const [phrase, setPhrase] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paperId = useId();

  useEffect(() => () => {
    if (timer.current !== null) clearTimeout(timer.current);
  }, []);

  function toggle() {
    if (timer.current !== null || phase === 'opening' || phase === 'closing') return;
    const opening = phase === 'closed';
    if (opening) {
      const id = draw(phraseIds);
      if (id === undefined) return;
      setPhrase(phrases.get(id)!);
    }

    const nextPhase = opening ? 'open' : 'closed';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setPhase(nextPhase);
      return;
    }
    setPhase(opening ? 'opening' : 'closing');
    timer.current = setTimeout(() => {
      timer.current = null;
      setPhase(nextPhase);
    }, 560);
  }

  const expanded = phase === 'opening' || phase === 'open';
  const transitioning = phase === 'opening' || phase === 'closing';
  const length = phrase.length > 60 ? 'long' : phrase.length > 44 ? 'medium' : 'short';

  return (
    <div className={`fortune-cookie fortune-cookie-${phase}`}>
      <span className="fortune-cookie-heading">BISCOITO DA DISCÓRDIA</span>
      <div className="fortune-cookie-stage">
        <button
          type="button"
          className="fortune-cookie-button"
          onClick={toggle}
          aria-disabled={transitioning}
          aria-expanded={expanded}
          aria-controls={paperId}
          aria-label={expanded ? 'Fechar biscoito' : 'Abrir biscoito'}
        >
          <span className="fortune-cookie-art" aria-hidden="true">
            <Image className="fortune-cookie-half fortune-cookie-left" src="/images/biscoito-esquerdo.webp" alt="" width={409} height={660} sizes="100px" />
            <Image className="fortune-cookie-half fortune-cookie-right" src="/images/biscoito-direito.webp" alt="" width={441} height={660} sizes="100px" />
          </span>
        </button>
        <span className="fortune-cookie-paper" aria-hidden="true">
          <Image src="/images/biscoito-papel.webp" alt="" width={1182} height={413} sizes="350px" />
          <span className="fortune-cookie-paper-copy" data-length={length}>{phrase}</span>
        </span>
        <span id={paperId} className="sr-only" role="status">{expanded ? phrase : ''}</span>
      </div>
      <span className="fortune-cookie-hint">
        {expanded ? 'Clique para guardar a discórdia.' : 'Abra por sua conta e risco.'}
      </span>
    </div>
  );
}
