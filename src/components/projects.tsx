'use client';
import {useSiteTranslation} from '@/i18n/use-translation';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { projects } from '@/content/projects';
import { Arrow } from './shell';
import { ProjectCard } from './project-card';
export { ProjectCard } from './project-card';
export function ProjectBrowser() {
    const { i18nText, i18nHref } = useSiteTranslation();
    const [mode, setMode] = useState<'gallery' | 'index'>('gallery');
    const [filter, setFilter] = useState('Todos');
    const categories = ['Todos', 'Arquitetura', 'Saúde e bem-estar', 'Serviços profissionais', 'Indústria e materiais'];
    const categoryFor = (industry: string) => industry === 'Arquitetura' ? 'Arquitetura' : industry === 'Estética e bem-estar' ? 'Saúde e bem-estar' : industry === 'Rochas naturais' ? 'Indústria e materiais' : 'Serviços profissionais';
    const selected = projects.filter(p => filter === 'Todos' || categoryFor(p.industry) === filter);
    return <><div className="project-controls"><div className="project-filters" role="group" aria-label={i18nText("Filtrar projetos")}>{i18nText(categories.map(c => <button key={c} aria-pressed={filter === c} onClick={() => setFilter(c)}>{i18nText(c)}</button>))}</div><div className="view-switch" role="group" aria-label={i18nText("Visualiza\u00E7\u00E3o dos projetos")}><button aria-pressed={mode === 'gallery'} onClick={() => setMode('gallery')}>{i18nText("Galeria")}</button><button aria-pressed={mode === 'index'} onClick={() => setMode('index')}>{i18nText("\u00CDndice")}</button></div></div><p className="sr-only" role="status">{i18nText(selected.length)}{i18nText(" projetos encontrados")}</p>{i18nText(mode === 'gallery' ? <div className="project-gallery" key={filter}>{i18nText(selected.map((p, i) => <ProjectCard project={p} key={p.slug} index={i}/>))}</div> : <div className="project-index">{i18nText(selected.map((p, i) => <Link key={p.slug} href={i18nHref(`/projetos/${p.slug}`)}><span className="index-number">{i18nText("0")}{i18nText(i + 1)}</span><h2>{i18nText(p.name)}</h2><span>{i18nText(p.discipline)}</span><span>{i18nText(p.year)}</span><Arrow /></Link>))}</div>)}</>;
}
