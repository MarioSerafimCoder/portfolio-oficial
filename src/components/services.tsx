'use client';
import {useSiteTranslation} from '@/i18n/use-translation';
import Image from 'next/image';
import { useState } from 'react';
import { services } from '@/content/site';
import { QuietDisclosures } from './quiet-disclosures';
const previews = [
    { src: null, alt: 'Estudo tipográfico de identidade visual, sem vínculo com um projeto de cliente', caption: 'Estudo tipográfico / Identidade visual' },
    { src: null, alt: 'Composição vetorial sobre contexto, direção e expressão de marca', caption: 'Fundamentos antes da expressão' },
    { src: '/media/amazonita-cover.webp', alt: 'Direção de arte Amazonita', caption: 'Amazonita / Direção de arte' },
    { src: '/media/amazonita-web.webp', alt: 'Interface da experiência digital Amazonita', caption: 'Amazonita / Experiência digital' },
];
function Preview({ index }: {
    index: number;
}) { const { i18nText, i18nHref, locale } = useSiteTranslation(); const preview = previews[index]; if (preview.src)
    return <Image src={preview.src} alt={i18nText(preview.alt)} fill sizes="(max-width:700px) 86vw, 34vw"/>; if (index === 0)
    return <div className="identity-study" role="img" aria-label={i18nText(preview.alt)}><span className="identity-study-note">{i18nText("ESTUDO / 01")}</span><span className="identity-study-type">{i18nText("Aa")}</span><div className="identity-study-footer"><div><strong>{i18nText(locale==='en'?'Visual':'Identidade')}<br />{i18nText(locale==='en'?'identity':'visual')}</strong><span>{i18nText("Tipografia / cor / sistema")}</span></div><div className="identity-study-swatches" aria-hidden="true"><i /><i /><i /></div></div></div>; return <div className="brand-foundations" role="img" aria-label={i18nText(preview.alt)}><span>{i18nText("01 / Contexto")}</span><strong>{i18nText("O que")}<br />{i18nText("move")}<br /><em>{i18nText("a marca?")}</em></strong><span>{i18nText("02 / Dire\u00E7\u00E3o")}<br />{i18nText("03 / Express\u00E3o")}</span><svg viewBox="0 0 300 300" aria-hidden="true"><ellipse cx="150" cy="150" rx="128" ry="80" transform="rotate(-30 150 150)"/></svg></div>; }
export function Services() {
    const { i18nText, i18nHref } = useSiteTranslation();
    const [active, setActive] = useState(0);
    return <div className="service-workbench" data-motion-owner="services"><div className="service-list"><QuietDisclosures>{i18nText(services.map((s, i) => <details key={s.title} className="service-row" onToggle={event => { if (event.currentTarget.open)
        setActive(i); }}><summary><span className="service-number">{i18nText("0")}{i18nText(i + 1)}</span><h3>{i18nText(s.title)}</h3><span className="service-plus" aria-hidden="true">{i18nText("+")}</span></summary><p className="service-line">{i18nText(s.line)}</p><div className="service-description"><p>{i18nText(s.text)}</p><span><strong>{i18nText("Poss\u00EDveis entregas")}</strong> {i18nText(s.scope)}</span></div><div className="service-inline-preview"><div className="service-preview-stage"><Preview index={i}/></div><p className="service-preview-caption">{i18nText(previews[i].caption)}</p></div></details>))}</QuietDisclosures></div><aside className="service-preview" aria-label={i18nText("Pr\u00E9via visual do servi\u00E7o selecionado")}><div className="service-preview-stage">{i18nText(previews.map((preview, i) => <figure key={i} data-active={active === i} aria-hidden={active !== i}><Preview index={i}/></figure>))}</div><p className="service-preview-caption" aria-live="polite">{i18nText(previews[active].caption)}</p></aside></div>;
}
