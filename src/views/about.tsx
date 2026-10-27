import {translateObject} from '@/i18n/translate';
import {createTranslator} from '@/i18n/translate';
import type {SiteLocale} from '@/i18n/routes';
import type { Metadata } from 'next';
import Link from 'next/link';
import { AboutTypewriter } from '@/components/about-typewriter';
import { PointerProse } from '@/components/pointer-prose';
import '@/app/sobre/about.css';
import Image from 'next/image';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { site } from '@/content/site';
import { socialLinks } from '@/lib/site-links';
export const metadata: Metadata = {
    title: 'Sobre Mário Serafim | Diretor de Arte e Designer',
    description: 'Conheça Mário Serafim, diretor de arte em Fortaleza. Seu caminho pelo marketing, design e tecnologia e sua maneira de trabalhar.',
    alternates: { canonical: '/sobre' },
    openGraph: { title: 'Sobre Mário Serafim — Direção de arte em Fortaleza', description: 'Minha trajetória, formação e maneira de trabalhar com direção de arte e identidade visual.', url: '/sobre' },
};
// Certificação Adobe: reservar a inclusão até confirmar título oficial e validade.
const highlights = [
    { label: 'Direção de Arte', body: 'Pós-graduação pela Anhanguera. Uma formação que acompanha minha atuação profissional.' },
    { label: 'Marketing', body: 'Graduação pela Wyden/Fanor. Foi onde minha formação profissional começou.' },
    { label: 'UX, UI e Desenvolvimento Web', body: 'Estudos em experiência do usuário, interfaces digitais e programação. Conhecimentos que ajudam a aproximar a criação visual do uso real.' },
];
const processParagraphs = [
    'Antes de pensar em cores, fontes ou referências, gosto de entender o problema. Quem é a marca? Com quem ela quer conversar? O que precisa mudar? O que já funciona?',
    'Pode parecer óbvio, mas nem sempre essas perguntas recebem a atenção que merecem.',
    'Também fui estudar UX e desenvolvimento web. Não para abandonar a direção de arte, mas para entender melhor o que acontece depois que uma ideia sai da apresentação e precisa funcionar de verdade.',
    'Gosto de experimentar, testar possibilidades e questionar minhas próprias escolhas. Nem sempre a primeira solução é a melhor. E tudo bem.',
];
export default function About({ locale = "pt" }: {
    locale?: SiteLocale;
} = {}) {
    const { i18nText, i18nHref } = createTranslator(locale);
    const photoExists = existsSync(join(process.cwd(), 'public', site.authorPhoto.replace(/^\//, '')));
    const origin = (process.env.NEXT_PUBLIC_SITE_URL || 'https://marioserafim.com.br').replace(/\/$/, '');
    const structuredData = { '@context': 'https://schema.org', '@type': 'Person', name: site.name, url: origin, jobTitle: 'Diretor de arte', sameAs: socialLinks.map(link => link.url) };
    return <main id="conteudo" className="editorial-about">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(translateObject(structuredData,locale)).replace(/</g, '\\u003c') }}/>
    <section className="about-opening section-wrap" aria-labelledby="about-title">
      <div className="about-opening-top"><span className="eyebrow">{i18nText("Sobre M\u00E1rio Serafim")}</span><span>{i18nText("Dire\u00E7\u00E3o de arte \u00B7 Fortaleza, CE")}</span></div>
      <h1 id="about-title">{i18nText("Gosto de entender")}<br />{i18nText("antes de ")}<em>{i18nText("desenhar.")}</em></h1>
      <div className="about-opening-bottom"><span aria-hidden="true">{i18nText("\u2198")}</span><AboutTypewriter /></div>
    </section>

    <section className="about-origin section-wrap" aria-labelledby="origin-title">
      <span className="eyebrow">{i18nText("01 / Um pouco sobre mim")}</span>
      <div><h2 id="origin-title">{i18nText("Meu caminho")}<br /><em>{i18nText("at\u00E9 aqui.")}</em></h2>
        {i18nText(photoExists && <figure className="about-portrait"><Image src={site.authorPhoto} alt={i18nText("Retrato de M\u00E1rio Serafim")} width={640} height={800} sizes="(max-width: 700px) 90vw, 420px"/></figure>)}
        <div className="about-prose"><p>{i18nText("Comecei pelo marketing e, aos poucos, fui me aproximando cada vez mais do design. Passei por ag\u00EAncias, trabalhei com educa\u00E7\u00E3o, esporte e hoje estou no setor de rochas naturais. S\u00E3o universos bem diferentes, e talvez seja justamente isso que mais tenha acrescentado \u00E0 minha maneira de trabalhar.")}</p><p>{i18nText("Aprendi que nem toda marca precisa parecer moderna, minimalista ou seguir a tend\u00EAncia do momento. \u00C0s vezes, a melhor decis\u00E3o \u00E9 fazer exatamente o contr\u00E1rio.")}</p><p>{i18nText("Hoje me interessa menos encontrar uma est\u00E9tica bonita logo de cara e mais descobrir qual dire\u00E7\u00E3o realmente combina com o projeto.")}</p></div>
      </div>
    </section>

    <section className="about-thinking section-wrap" id="processo" aria-labelledby="thinking-title">
      <div className="about-thinking-head"><span className="eyebrow">{i18nText("02 / Como eu trabalho")}</span></div>
      <div className="about-thinking-body"><h2 id="thinking-title">{i18nText("N\u00E3o come\u00E7o pelo ")}<em>{i18nText("Photoshop.")}</em></h2><PointerProse paragraphs={processParagraphs}/></div>
    </section>

    <section className="about-credentials section-wrap" aria-labelledby="credentials-title">
      <div className="about-credentials-head"><span className="eyebrow">{i18nText("Algumas coisas pelo caminho")}</span><div><h2 id="credentials-title">{i18nText("Nem tudo precisa virar")}<br />{i18nText("uma linha do tempo.")}</h2><p>{i18nText("Minha trajet\u00F3ria passou por \u00E1reas diferentes. Estes s\u00E3o alguns dos estudos e experi\u00EAncias que considero relevantes para o trabalho que fa\u00E7o hoje.")}</p></div></div>
      <div className="about-credential-list">{i18nText(highlights.map((item, index) => <article key={item.label}><span>{i18nText(String(index + 1).padStart(2, '0'))}{i18nText(" /")}</span><div><h3><span className="credential-title-base">{i18nText(item.label)}</span><span className="credential-title-italic" aria-hidden="true">{i18nText(item.label)}</span></h3><p>{i18nText(item.body)}</p></div></article>))}</div>
    </section>

    <section className="about-ending section-wrap" aria-labelledby="ending-title"><span className="eyebrow">{i18nText("O trabalho continua")}</span><div><h2 id="ending-title">{i18nText("O restante est\u00E1")}<br /><em>{i18nText("nos projetos.")}</em></h2><p>{i18nText("Falei um pouco sobre mim. Mas acho que a melhor maneira de entender meu trabalho \u00E9 conhecer os projetos, as escolhas que fiz e os problemas que tentei resolver.")}</p><div className="about-ending-actions"><Link className="pill filled" href={i18nHref("/projetos")}>{i18nText("Ver meus projetos ")}<span aria-hidden="true">{i18nText("\u2197")}</span></Link><Link className="text-link" href={i18nHref("/contato")}>{i18nText("Entrar em contato \u2197")}</Link></div></div></section>
  </main>;
}
