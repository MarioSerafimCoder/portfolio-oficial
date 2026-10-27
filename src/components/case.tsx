'use client';
import {useSiteTranslation} from '@/i18n/use-translation';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Project } from '@/content/projects';
import { trackEvent } from '@/lib/analytics';
export function CaseViewTracker({ slug }: {
    slug: string;
}) { useEffect(() => { trackEvent('case_view', { case: slug }); }, [slug]); return null; }
export function Video({ src, caption, poster = '/media/amazonita-video-poster.webp' }: {
    src: string;
    caption: string;
    poster?: string;
}) {
    const { i18nText, i18nHref } = useSiteTranslation();
    const video = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(false);
    const mobileSrc = `/media/mobile/${src.split('/').pop()}`;
    return <div className={`video-frame ${src === '/media/amazonita-motion.mp4' ? 'video-portrait' : 'video-landscape'}`}><video ref={video} poster={poster} playsInline muted loop controls preload="none" aria-label={i18nText(caption)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}><source src={mobileSrc} media="(max-width: 700px)" type="video/mp4"/><source src={src} type="video/mp4"/>{i18nText("Seu navegador n\u00E3o suporta v\u00EDdeo. ")}<a href={i18nHref(src)}>{i18nText("Baixar v\u00EDdeo")}</a></video><button className="video-toggle" aria-label={i18nText(playing ? 'Pausar vídeo' : 'Reproduzir vídeo')} onClick={() => { if (playing)
        video.current?.pause();
    else
        video.current?.play().catch(() => { }); }}>{i18nText(playing ? 'Pausar Ⅱ' : 'Reproduzir ▷')}</button></div>;
}
export function CaseRail({ project: p }: {
    project: Project;
}) {
    const { i18nText, i18nHref } = useSiteTranslation();
    const rail = useRef<HTMLDivElement>(null);
    const previews = [{ src: p.cover, alt: p.coverAlt }, ...p.gallery.filter(m => m.kind !== 'video').slice(0, 2)];
    return <><div className="case-rail" data-project={p.slug} ref={rail} aria-label={i18nText(`Prévia visual de ${p.name}`)} tabIndex={0}>{i18nText(previews.map((m, i) => <a className={`rail-frame rail-${i}`} href={i18nHref("#galeria")} key={m.src} aria-label={i18nText(`Explorar galeria: ${m.alt}`)}><Image src={m.src} alt={i18nText(m.alt)} fill fetchPriority={i === 0 ? 'high' : undefined} loading={i === 0 ? 'eager' : 'lazy'} sizes="(max-width:600px) 85vw, 65vw" style={{ objectFit: i === 0 ? 'cover' : 'contain', ...(p.slug === 'rooftop' && i === 0 ? { transform: 'scale(1.06)' } : {}) }}/></a>))}</div><div className="rail-controls"><a href={i18nHref("#galeria")} className="text-link">{i18nText("Explorar a galeria \u2193")}</a><div><button className="round-button" aria-label={i18nText("Imagem anterior")} onClick={() => rail.current?.scrollBy({ left: -rail.current.clientWidth * .65, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>{i18nText("\u2190")}</button><button className="round-button" aria-label={i18nText("Pr\u00F3xima imagem")} onClick={() => rail.current?.scrollBy({ left: rail.current.clientWidth * .65, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>{i18nText("\u2192")}</button></div></div></>;
}
