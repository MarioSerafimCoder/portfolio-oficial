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
    description: 'Sou Mário Serafim, diretor de arte em Fortaleza. Trabalho com identidade visual, campanhas e projetos digitais.',
    alternates: { canonical: '/sobre' },
    openGraph: { title: 'Sobre Mário Serafim | Direção de arte em Fortaleza', description: 'Minha trajetória, formação e maneira de trabalhar com direção de arte e identidade visual.', url: '/sobre' },
};
// Certificação Adobe: reservar a inclusão até confirmar título oficial e validade.
const highlights = [
    { label: 'Direção de Arte', body: 'Pós-graduação pela Anhanguera. Uma formação que acompanha minha atuação profissional.' },
    { label: 'Marketing', body: 'Graduação pela Wyden/Fanor. Foi onde minha formação profissional começou.' },
    { label: 'UX, UI e Desenvolvimento Web', body: 'Estudos em experiência do usuário, interfaces digitais e programação. Conhecimentos que ajudam a aproximar a criação visual do uso real.' },
];
const processParagraphs = [
    'Antes de pensar em cores, fontes ou referências, prefiro entender o problema. Quem é a marca? Com quem ela conversa? O que precisa mudar?',
    'Parece óbvio, eu sei. Mas um layout bonito não faz milagre com um briefing mal resolvido.',
    'Também fui estudar UX e desenvolvimento web. Não pra abandonar a direção de arte, mas pra entender o que acontece depois que a ideia sai da apresentação e precisa funcionar de verdade.',
    'Gosto de testar, questionar e mudar de ideia quando aparece uma solução melhor. Faz parte.',
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
        <div className="about-prose"><p>{i18nText("Comecei pelo marketing e, aos poucos, o design foi ocupando cada vez mais espaço. Passei por agências, educação, esporte e hoje trabalho também com rochas naturais.")}</p><p>{i18nText("Parece uma mistura improvável. E talvez seja. Mas circular por universos tão diferentes me ensinou uma coisa: nem toda marca precisa seguir a tendência do momento.")}</p><p>{i18nText("Às vezes, a melhor decisão é justamente não fazer o que todo mundo está fazendo.")}</p></div>
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

    <section className="about-ending section-wrap" aria-labelledby="ending-title"><span className="eyebrow">{i18nText("O trabalho continua")}</span><div><h2 id="ending-title">{i18nText("O restante est\u00E1")}<br /><em>{i18nText("nos projetos.")}</em></h2><p>{i18nText("Já falei um bocado sobre mim. Mas acho que a melhor maneira de entender meu trabalho é conhecer os projetos, as decisões que tomei e os problemas que tentei resolver.")}</p><div className="about-ending-actions"><Link className="pill filled" href={i18nHref("/projetos")}>{i18nText("Ver meus projetos ")}<span aria-hidden="true">{i18nText("\u2197")}</span></Link><Link className="text-link" href={i18nHref("/contato")}>{i18nText("Entrar em contato \u2197")}</Link></div></div></section>
  </main>;
}
