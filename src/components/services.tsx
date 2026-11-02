'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { services } from '@/content/site';
import { useSiteTranslation } from '@/i18n/use-translation';
import { QuietDisclosures } from './quiet-disclosures';

const previews = [
  {
    src: null,
    alt: 'Estudo tipográfico de identidade visual, sem vínculo com um projeto de cliente',
    caption: 'Estudo tipográfico / Identidade visual',
  },
  {
    src: null,
    alt: 'Composição vetorial sobre contexto, direção e expressão de marca',
    caption: 'Fundamentos antes da expressão',
  },
  {
    src: '/media/amazonita-cover.webp',
    alt: 'Direção de arte Amazonita',
    caption: 'Amazonita / Direção de arte',
  },
  {
    src: '/media/amazonita-web.webp',
    alt: 'Interface da experiência digital Amazonita',
    caption: 'Amazonita / Experiência digital',
  },
];

function studyLabel(index: number, i18nText: (value: string) => string) {
  return i18nText('ESTUDO / 01').replace('01', String(index + 1).padStart(2, '0'));
}

function Preview({ index }: { index: number }) {
  const study = useRef<HTMLDivElement>(null);
  const { i18nText } = useSiteTranslation();
  const preview = previews[index];

  useEffect(() => {
    const element = study.current;
    if (!element) return;

    let visible = false;
    const update = () => {
      element.dataset.animate = String(visible && !document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });

    observer.observe(element);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  if (preview.src) {
    return <Image src={preview.src} alt={i18nText(preview.alt)} fill sizes="(max-width:700px) 86vw, 34vw" />;
  }

  if (index === 0) {
    return (
      <div ref={study} className="identity-study" role="img" aria-label={i18nText(preview.alt)}>
        <span className="identity-study-type">{i18nText('Aa')}</span>
        <div className="identity-study-footer">
          <span>{i18nText('Tipografia / cor / sistema')}</span>
          <div className="identity-study-swatches" aria-hidden="true"><i /><i /><i /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="brand-foundations" role="img" aria-label={i18nText(preview.alt)}>
      <span>{i18nText('01 / Contexto')}</span>
      <strong>{i18nText('O que')}<br />{i18nText('move')}<br /><em>{i18nText('a marca?')}</em></strong>
      <span>{i18nText('02 / Direção')}<br />{i18nText('03 / Expressão')}</span>
      <svg viewBox="0 0 300 300" aria-hidden="true"><ellipse cx="150" cy="150" rx="128" ry="80" transform="rotate(-30 150 150)" /></svg>
    </div>
  );
}

export function Services() {
  const { i18nText } = useSiteTranslation();
  const [active, setActive] = useState(0);

  return (
    <div className="service-workbench" data-motion-owner="services">
      <div className="service-list">
        <QuietDisclosures>
          {i18nText(services.map((service, index) => (
            <details
              key={service.title}
              className="service-row"
              data-active={active === index}
              onPointerEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onToggle={event => {
                if (event.currentTarget.open) setActive(index);
              }}
            >
              <summary>
                <span className="service-number">{i18nText('0')}{i18nText(index + 1)}</span>
                <h3>{i18nText(service.title)}</h3>
                <span className="service-plus" aria-hidden="true">{i18nText('+')}</span>
              </summary>
              <p className="service-line">{i18nText(service.line)}</p>
              <div className="service-description">
                <p>{i18nText(service.text)}</p>
                <span><strong>{i18nText('Possíveis entregas')}</strong> {i18nText(service.scope)}</span>
              </div>
              <div className="service-inline-preview">
                <div className="service-inline-preview-head">
                  <span>{studyLabel(index, i18nText)}</span>
                  <strong>{i18nText(service.title)}</strong>
                </div>
                <div className="service-preview-stage"><Preview index={index} /></div>
                <p className="service-preview-caption">{i18nText(previews[index].caption)}</p>
              </div>
            </details>
          )))}
        </QuietDisclosures>
      </div>

      <aside className="service-preview" id="service-preview" aria-label={i18nText('Prévia visual do serviço selecionado')}>
        <div className="service-preview-heading" aria-live="polite">
          <span className="service-preview-index">{studyLabel(active, i18nText)}</span>
          <strong>{i18nText(services[active].title)}</strong>
        </div>
        <div className="service-preview-stage">
          {i18nText(previews.map((preview, index) => (
            <figure key={index} data-active={active === index} aria-hidden={active !== index}>
              <Preview index={index} />
            </figure>
          )))}
        </div>
        <p className="service-preview-caption">{i18nText(previews[active].caption)}</p>
      </aside>
    </div>
  );
}
