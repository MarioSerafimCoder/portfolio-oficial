import {translateObject} from '@/i18n/translate';
import {createTranslator} from '@/i18n/translate';
import type {SiteLocale} from '@/i18n/routes';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import dimensions from '@/content/media-dimensions.json';
import { projects } from '@/content/projects';
import { CaseRail, CaseViewTracker, Video } from '@/components/case';
import { WhatsAppLink } from '@/components/whatsapp-link';
const origin = (process.env.NEXT_PUBLIC_SITE_URL || 'https://marioserafim.com.br').replace(/\/$/, '');
export const dynamicParams = false;
export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })); }
type Props = {
    params: Promise<{
        slug: string;
    }>;
};
export async function generateMetadata({ params,locale="pt" }: Props&{locale?:SiteLocale}): Promise<Metadata> {
    const { i18nText }=createTranslator(locale);
    const { slug } = await params;
    const project = projects.find(item => item.slug === slug);
    if (!project)
        return { title: 'Projeto não encontrado', robots: { index: false } };
    const title = `${project.name} — ${i18nText(project.discipline)}`;
    const description = `${i18nText(project.headline)} ${locale==='en'?'Explore the context, decisions and applications behind this project by Mário Serafim.':'Conheça o contexto, as decisões e as aplicações deste projeto de Mário Serafim.'}`;
    return { title, description, alternates: { canonical: `/projetos/${slug}` }, openGraph: { type: 'article', title, description, url: `/projetos/${slug}`, images: [{ url: project.cover, alt: project.coverAlt }] }, twitter: { card: 'summary_large_image', title, description, images: [project.cover] } };
}
export default async function Case({ params, locale = "pt" }: Props & {
    locale?: SiteLocale;
}) {
    const { i18nText, i18nHref } = createTranslator(locale);
    const { slug } = await params;
    const index = projects.findIndex(project => project.slug === slug);
    if (index < 0)
        notFound();
    const project = projects[index];
    const previous = projects[(index - 1 + projects.length) % projects.length];
    const next = projects[(index + 1) % projects.length];
    const url = `${origin}${i18nHref(`/projetos/${slug}`)}`;
    const structuredData = [
        { '@context': 'https://schema.org', '@type': 'CreativeWork', name: project.name, description: project.headline, url, image: `${origin}${project.cover}`, creator: { '@type': 'Person', name: 'Mário Serafim' }, genre: project.discipline },
        { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
                { '@type': 'ListItem', position: 1, name: i18nText('Início'), item: origin+i18nHref('/') },
                { '@type': 'ListItem', position: 2, name: i18nText('Projetos'), item: `${origin}${i18nHref('/projetos')}` },
                { '@type': 'ListItem', position: 3, name: project.name, item: url },
            ] },
    ];
    return <main id="conteudo" className="case-page">
    <CaseViewTracker slug={slug}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(translateObject(structuredData,locale)).replace(/</g, '\\u003c') }}/>
    <section className="case-heading section-wrap"><div><Link href={i18nHref("/projetos")} className="eyebrow">{i18nText("\u2190 Projetos")}</Link><span className="case-nature">{i18nText(project.nature)}</span></div><div><h1>{i18nText(project.name)}</h1><p>{i18nText(project.headline)}</p></div></section>
    <CaseRail project={project}/>
    <section className="case-story section-wrap" aria-labelledby="case-context-title">
      <dl><div><dt>{i18nText("Atua\u00E7\u00E3o")}</dt><dd>{i18nText(project.discipline)}</dd></div><div><dt>{i18nText("\u00C1rea")}</dt><dd>{i18nText(project.industry)}</dd></div><div><dt>{i18nText("Ano do material")}</dt><dd>{i18nText(project.year)}</dd></div></dl>
      <div><span className="eyebrow">{i18nText("Contexto")}</span><h2 id="case-context-title">{i18nText(project.context)}</h2><div className="case-facts"><div><h3>{i18nText("Desafio")}</h3><p>{i18nText(project.challenge)}</p></div><div><h3>{i18nText("Objetivo")}</h3><p>{i18nText(project.objective)}</p></div><div><h3>{i18nText("Meu papel")}</h3><p>{i18nText(project.role)}</p></div></div></div>
    </section>
    <section className="case-decisions section-wrap" aria-labelledby="case-decisions-title"><span className="eyebrow">{i18nText("Decis\u00F5es")}</span><div><h2 id="case-decisions-title">{i18nText(project.decisions)}</h2><h3>{i18nText("Sistema & aplica\u00E7\u00F5es")}</h3><p>{i18nText(project.system)}</p><div className="palette" aria-label={i18nText("Paleta do projeto")}>{i18nText(project.palette.map(color => <div key={color}><span style={{ background: color }}/><span>{i18nText(color.toUpperCase())}</span></div>))}</div></div></section>
    <section id="galeria" className="case-gallery section-wrap" aria-label={i18nText(`Sistema e aplicações de ${project.name}`)}>{i18nText(project.gallery.map((media, index) => <figure key={media.src} className={`gallery-${media.layout || 'wide'}`} data-reveal>{i18nText(media.kind === 'video' ? <Video src={media.src} caption={media.alt} poster={media.poster}/> : <div className={`gallery-image ${media.contain ? 'contain' : ''}`}><Image src={media.src} alt={i18nText(media.alt)} width={(dimensions as Record<string, {
        width: number;
        height: number;
    }>)[media.src].width} height={(dimensions as Record<string, {
        width: number;
        height: number;
    }>)[media.src].height} sizes={media.layout === 'half' ? '(max-width: 700px) 90vw, 45vw' : '90vw'} style={{ height: 'auto', width: '100%' }} loading="lazy"/></div>)}<figcaption><span>{i18nText(media.caption).replace(/^\d{2}\s*[—–-]\s*/, '')}</span><span>{i18nText(String(index + 1).padStart(2, '0'))}{i18nText(" / ")}{i18nText(String(project.gallery.length).padStart(2, '0'))}</span></figcaption></figure>))}</section>
    <section className="case-result section-wrap"><span className="eyebrow">{i18nText("Resultado")}</span><p>{i18nText(project.result)}</p></section>
    {i18nText(project.testimonial && <section className="case-testimonial section-wrap"><span className="eyebrow">{i18nText("Depoimento")}</span><blockquote><p>{i18nText(project.testimonial.quote)}</p><cite>{i18nText(project.testimonial.author)}</cite></blockquote></section>)}
    <section className="case-credits section-wrap"><span className="eyebrow">{i18nText("Cr\u00E9ditos")}</span><p>{i18nText(project.credits)}</p></section>
    <section className="case-contact section-wrap"><span className="eyebrow">{i18nText("Tem uma ideia em mente?")}</span><h2>{i18nText("Vamos conversar sobre o seu projeto.")}</h2><div><Link className="pill filled" href={i18nHref("/contato")}>{i18nText("Entrar em contato \u2197")}</Link><WhatsAppLink context={`o projeto ${project.name}`} className="text-link"/></div></section>
    <nav className="case-navigation section-wrap" aria-label={i18nText("Navegar entre projetos")}><Link href={i18nHref(`/projetos/${previous.slug}`)}><span className="eyebrow">{i18nText("\u2190 Projeto anterior")}</span><strong>{i18nText(previous.name)}</strong></Link><Link href={i18nHref(`/projetos/${next.slug}`)}><span className="eyebrow">{i18nText("Pr\u00F3ximo projeto \u2192")}</span><strong>{i18nText(next.name)}</strong></Link></nav>
  </main>;
}
