import {translateObject} from '@/i18n/translate';
import {createTranslator} from '@/i18n/translate';
import type {SiteLocale} from '@/i18n/routes';
import Link from 'next/link';
import { Services } from '@/components/services';
import { ProcessSteps } from '@/components/process-steps';
import { Arrow } from '@/components/shell';
import '@/app/home.css';
import type { Metadata } from 'next';
import { site, generalFaq } from '@/content/site';
import { socialLinks } from '@/lib/site-links';
import { TrackedLink } from '@/components/tracked-link';
import { PerceptionHero } from '@/components/perception-hero';
import { EditorialProjects } from '@/components/editorial-projects';
import { ScrollHighlight } from '@/components/scroll-highlight';
import { HomeNarrative } from '@/components/home-narrative';
import { QuietDisclosures } from '@/components/quiet-disclosures';
const origin = (process.env.NEXT_PUBLIC_SITE_URL || 'https://marioserafim.com.br').replace(/\/$/, '');
export const metadata: Metadata = { title: 'Direção de arte, identidade visual e branding em Fortaleza', description: 'Portfólio de Mário Serafim: direção de arte, identidade visual, branding e experiências digitais desenvolvidas com clareza e personalidade.', alternates: { canonical: '/' }, openGraph: { title: 'Mário Serafim — Direção de arte e identidade visual', description: site.description, url: '/' } };
const steps = [
    { title: 'Entender', body: 'Você me conta o que está acontecendo com a marca. Eu faço perguntas para entender o negócio, as pessoas e o que precisa mudar.' },
    { title: 'Definir', body: 'Alinhamos a direção visual e o escopo. As escolhas são discutidas antes de avançar, com motivos que façam sentido para a marca.' },
    { title: 'Construir', body: 'A identidade toma forma nas aplicações combinadas. Revisamos como ela funciona e preparamos as entregas previstas.' },
];
export default function Home({ locale = "pt" }: {
    locale?: SiteLocale;
} = {}) {
    const { i18nText, i18nHref } = createTranslator(locale);
    const structuredData = [
        { '@context': 'https://schema.org', '@type': 'Person', name: site.name, url: origin, jobTitle: 'Diretor de arte', sameAs: socialLinks.map(link => link.url), homeLocation: { '@type': 'Place', name: site.location } },
        { '@context': 'https://schema.org', '@type': 'ProfessionalService', name: site.name, url: origin, description: site.description, email: site.email, areaServed: 'Fortaleza, Brasil', sameAs: socialLinks.map(link => link.url) },
        { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: generalFaq.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) },
    ];
    return <HomeNarrative><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(translateObject(structuredData,locale)).replace(/</g, '\\u003c') }}/>
  <PerceptionHero><div className="perception-heading"><span className="perception-label">{i18nText("M\u00E1rio Serafim / Dire\u00E7\u00E3o de arte & identidade visual")}</span><h1 id="perception-title"><span className="perception-line"><span data-perception-line>{i18nText("Identidade")}</span></span> <span className="perception-line"><span data-perception-line>{i18nText("\u00E9 ")}<em>{i18nText("percep\u00E7\u00E3o.")}</em></span></span></h1></div><div className="perception-support"><span>{i18nText("Dire\u00E7\u00E3o de arte.")}<br />{i18nText("Identidade visual. Branding.")}</span><div><p>{i18nText("Sou M\u00E1rio Serafim, diretor de arte. Ajudo neg\u00F3cios a construir uma identidade visual que represente melhor o que fazem, com personalidade, clareza e sem f\u00F3rmulas prontas.")}</p><a className="pill" href={i18nHref("#contato")}>{i18nText("Vamos falar da sua marca ")}<Arrow /></a></div><a className="hero-down" href={i18nHref("#selecionados")} aria-label={i18nText("Ver projetos selecionados")}>{i18nText("\u2193")}</a></div></PerceptionHero>

  <section className="selected-section" id="selecionados"><div className="project-current" aria-hidden="true"/><div className="section-heading section-wrap projects-introduction"><div><h2>{i18nText("N\u00E3o existe uma ")}<em className="aesthetic-word">{i18nText("est\u00E9tica")}<svg className="project-gesture" viewBox="0 0 250 75" aria-hidden="true"><path d="M15 49C33 13 222-8 236 25S52 91 18 57C-1 37 128 35 222 45" pathLength="1"/></svg></em>{i18nText(" que sirva para todo mundo.")}</h2><p className="home-section-intro">{i18nText("Cada projeto traz um contexto diferente. Aqui est\u00E3o alguns trabalhos e estudos que mostram como gosto de explorar essas diferen\u00E7as.")}</p></div><TrackedLink className="pill" href={i18nHref("/projetos")} event="all_projects_click">{i18nText("Ver todos os projetos ")}<Arrow /></TrackedLink></div>
    <EditorialProjects />
  </section>

  <section className="section-wrap services-section" id="atuacao"><div className="section-heading"><div><span className="eyebrow">{i18nText("O que eu fa\u00E7o")}</span><h2><span className="editorial-line"><span>{i18nText("Uma boa identidade vai")}</span></span><span className="editorial-line"><span>{i18nText("muito al\u00E9m do logo.")}</span></span></h2><p className="home-section-intro">{i18nText("Uma marca aparece em muitos lugares. E precisa fazer sentido em todos eles. Meu trabalho \u00E9 cuidar para que cada ponto de contato fa\u00E7a parte da mesma hist\u00F3ria.")}</p></div><Link className="pill" href={i18nHref("/sobre#processo")}>{i18nText("Conhe\u00E7a minha abordagem ")}<Arrow /></Link></div><Services /><div className="services-contact"><p>{i18nText("Come\u00E7ando do zero ou sentindo que sua marca j\u00E1 n\u00E3o representa o que voc\u00EA faz?")}</p><a className="text-link" href={i18nHref("#contato")}>{i18nText("Vamos conversar \u2197")}</a></div></section>

  <section className="thinking-section section-wrap"><div className="thinking-label"><span className="eyebrow">{i18nText("Como eu trabalho")}</span><span>{i18nText("Olhar & processo")}</span></div><ScrollHighlight /><div className="thinking-bottom"><div className="home-process-intro"><p>{i18nText("O que sua marca precisa resolver? Quem voc\u00EA quer alcan\u00E7ar? O que j\u00E1 funciona e o que est\u00E1 atrapalhando?")}</p><p>{i18nText("Gosto de entender essas coisas antes de pensar em cores, fontes ou refer\u00EAncias. N\u00E3o porque exista uma f\u00F3rmula infal\u00EDvel, mas porque criar sem entender o problema costuma ser um caminho bem mais longo.")}</p></div><Link href={i18nHref("/sobre#processo")} className="pill">{i18nText("Um pouco mais sobre como penso ")}<Arrow /></Link></div><div className="home-process"><p>{i18nText("Meu processo passa por tr\u00EAs momentos:")}</p><ProcessSteps steps={steps}/></div></section>
  <section className="faq-section section-wrap" aria-labelledby="faq-title"><span className="eyebrow">{i18nText("Perguntas frequentes")}</span><h2 id="faq-title">{i18nText("Antes de come\u00E7ar.")}</h2><QuietDisclosures>{i18nText(generalFaq.map(item => <details key={item.question}><summary>{i18nText(item.question)}<span aria-hidden="true">{i18nText("+")}</span></summary><p>{i18nText(item.answer)}</p></details>))}</QuietDisclosures></section>
    </HomeNarrative>;
}
