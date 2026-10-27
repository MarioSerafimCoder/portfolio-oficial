'use client';
import {useSiteTranslation} from '@/i18n/use-translation';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/content/projects';
import { AmazonitaExperience } from './amazonita-experience';
import { ProjectChoreography } from './project-choreography';
const simetria = projects.find(project => project.slug === 'simetria')!;
const closing = projects.filter(project => ['eduardo-noronha', 'amanda-araujo'].includes(project.slug));
function Visit() { const { i18nText, i18nHref } = useSiteTranslation(); return <span className="editorial-visit">{i18nText("Explorar projeto ")}<span aria-hidden="true">{i18nText("\u2197")}</span></span>; }
export function EditorialProjects() {
    const { i18nText, i18nHref } = useSiteTranslation();
    return <ProjectChoreography>
    <AmazonitaExperience>
      <Link href={i18nHref("/projetos/amazonita")} className="material-link">
        <div className="material-stage">
          <Image className="material-texture" src="/media/motion/amazonita-poster.webp" alt={i18nText("Textura real da rocha Amazonita em tons verde-azulados e veios minerais")} fill sizes="(max-width: 700px) 100vw, (max-width: 1400px) 90vw, 1160px"/>
          <div className="material-shade"/>
          <span className="material-index">{i18nText("01 / Dire\u00E7\u00E3o de arte \u00B7 Digital \u00B7 Editorial")}</span>
          <h3 id="amazonita-feature-title">{i18nText("Amazonita")}</h3>
          <span className="material-subtitle">{i18nText("A mat\u00E9ria-prima como protagonista.")}</span>
        </div>

      </Link>
      <div className="material-application"><div className="editorial-image"><Image src="/media/amazonita-cover.webp" alt={i18nText("Aplica\u00E7\u00E3o da dire\u00E7\u00E3o de arte Amazonita na abertura da experi\u00EAncia digital")} fill sizes="(max-width: 700px) 78vw, 42vw"/></div><p>{i18nText("Amazonita / Dire\u00E7\u00E3o de arte \u00B7 Digital \u00B7 Editorial")}</p></div><div className="material-caption"><p>{i18nText("Uma linguagem visual que valoriza a presen\u00E7a e a textura da Amazonita.")}</p><Link href={i18nHref("/projetos/amazonita")}><Visit /></Link></div>
    </AmazonitaExperience>

    <article className="editorial-rooftop" aria-labelledby="rooftop-feature-title">
      <div className="editorial-intro"><span className="editorial-index">{i18nText("02 / Identidade visual \u00B7 Estudo conceitual")}</span><h3 id="rooftop-feature-title">{i18nText("Rooftop")}<br />{i18nText(' ')}{i18nText("Arquitetura")}</h3><p>{i18nText("Uma identidade que explora precis\u00E3o, presen\u00E7a e a linguagem visual da arquitetura.")}</p><Link href={i18nHref("/projetos/rooftop")}><Visit /></Link></div>
      <Link href={i18nHref("/projetos/rooftop")} className="editorial-rooftop-mark editorial-image" aria-label={i18nText("Explorar projeto Rooftop Arquitetura")}><Image src="/media/rooftop-home.webp" alt={i18nText("Assinatura real da Rooftop Arquitetura, recortada para a composi\u00E7\u00E3o da home")} fill sizes="(max-width: 700px) 90vw, 54vw"/></Link>
      <Link href={i18nHref("/projetos/rooftop")} className="editorial-rooftop-application editorial-image" aria-label={i18nText("Ver a apresenta\u00E7\u00E3o editorial da Rooftop")}><Image src="/media/rooftop-02.webp" alt={i18nText("Diagrama\u00E7\u00E3o da apresenta\u00E7\u00E3o Rooftop com arquitetura do acervo do escrit\u00F3rio")} fill sizes="(max-width: 700px) 72vw, 38vw"/></Link>
      <p className="editorial-image-note">{i18nText("Identidade e apresenta\u00E7\u00E3o editorial.")}<br />{i18nText("Arquitetura do acervo do escrit\u00F3rio.")}</p>
    </article>

    <article className="editorial-simetria" aria-labelledby="simetria-feature-title">
      <Link href={i18nHref("/projetos/simetria")} className="editorial-simetria-portrait editorial-image" aria-label={i18nText("Explorar projeto Simetria Est\u00E9tica")}><Image src={simetria.cardCover!} alt={i18nText(simetria.coverAlt)} fill sizes="(max-width: 700px) 90vw, 48vw"/></Link>
      <div className="editorial-intro"><span className="editorial-index">{i18nText("03 / Identidade visual \u00B7 Estudo conceitual")}</span><h3 id="simetria-feature-title">{i18nText("Simetria")}<br />{i18nText(' ')}<em>{'Estética'}</em></h3><p>{i18nText("Equil\u00EDbrio, leveza e uma linguagem visual pensada para transmitir confian\u00E7a sem parecer distante.")}</p><Link href={i18nHref("/projetos/simetria")}><Visit /></Link></div>
      <Link href={i18nHref("/projetos/simetria")} className="editorial-simetria-application editorial-image" aria-label={i18nText("Ver aplica\u00E7\u00E3o da identidade Simetria")}><Image src="/media/simetria/tote.webp" alt={i18nText("Visualiza\u00E7\u00E3o conceitual da marca Simetria aplicada a uma bolsa")} fill sizes="(max-width: 700px) 66vw, 32vw"/></Link>
    </article>

    <div className="editorial-closing">{i18nText(closing.map((project, index) => <article key={project.slug} aria-labelledby={`${project.slug}-feature-title`}><Link href={i18nHref(`/projetos/${project.slug}`)}><div className="editorial-image"><Image src={project.cover} alt={i18nText(project.coverAlt)} fill sizes="(max-width: 700px) 90vw, 44vw"/></div><div className="editorial-closing-caption"><div><span className="editorial-index">{i18nText("0")}{i18nText(index + 4)}{i18nText(" / ")}{i18nText(project.discipline)}</span><h3 id={`${project.slug}-feature-title`}>{i18nText(project.name)}</h3></div><span aria-hidden="true">{i18nText("\u2197")}</span></div><p>{i18nText(index === 0 ? 'Uma identidade sóbria e contemporânea para a comunicação jurídica.' : 'Uma linguagem visual que aproxima, acolhe e transmite confiança.')}</p><Visit /></Link></article>))}</div>
  </ProjectChoreography>;
}
