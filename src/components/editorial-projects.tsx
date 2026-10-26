import Image from 'next/image';
import Link from 'next/link';
import {projects} from '@/content/projects';
import {AmazonitaExperience} from './amazonita-experience';
import {ProjectChoreography} from './project-choreography';

const rooftop=projects.find(project=>project.slug==='rooftop')!;
const simetria=projects.find(project=>project.slug==='simetria')!;
const closing=projects.filter(project=>['eduardo-noronha','amanda-araujo'].includes(project.slug));

function Visit(){return <span className="editorial-visit">Explorar projeto <span aria-hidden="true">↗</span></span>}

export function EditorialProjects(){
  return <ProjectChoreography>
    <AmazonitaExperience>
      <Link href="/projetos/amazonita" className="material-link">
        <div className="material-stage">
          <Image className="material-texture" src="/media/motion/amazonita-poster.webp" alt="Textura real da rocha Amazonita em tons verde-azulados e veios minerais" fill sizes="(max-width: 700px) 100vw, (max-width: 1400px) 90vw, 1160px"/>
          <div className="material-shade"/>
          <span className="material-index">01 / Direção de arte · Digital · Editorial</span>
          <h3 id="amazonita-feature-title">Amazonita</h3>
          <span className="material-subtitle">A matéria-prima como protagonista.</span>
        </div>
        <div className="material-caption"><p>Uma linguagem visual que valoriza a presença e a textura da Amazonita.</p><Visit/></div>
      </Link>
      <div className="material-application"><div className="editorial-image"><Image src="/media/amazonita-cover.webp" alt="Aplicação da direção de arte Amazonita na abertura da experiência digital" fill sizes="(max-width: 700px) 78vw, 42vw"/></div><p>Amazonita / Direção de arte · Digital · Editorial</p></div>
    </AmazonitaExperience>

    <article className="editorial-rooftop" aria-labelledby="rooftop-feature-title">
      <div className="editorial-intro"><span className="editorial-index">02 / Identidade visual · Estudo conceitual</span><h3 id="rooftop-feature-title">Rooftop<br/>{' '}Arquitetura</h3><p>Uma identidade que explora precisão, presença e a linguagem visual da arquitetura.</p><Link href="/projetos/rooftop"><Visit/></Link></div>
      <Link href="/projetos/rooftop" className="editorial-rooftop-mark editorial-image" aria-label="Explorar projeto Rooftop Arquitetura"><Image src={rooftop.cover} alt={rooftop.coverAlt} fill sizes="(max-width: 700px) 90vw, 54vw"/></Link>
      <Link href="/projetos/rooftop" className="editorial-rooftop-application editorial-image" aria-label="Ver a apresentação editorial da Rooftop"><Image src="/media/rooftop-02.webp" alt="Diagramação da apresentação Rooftop com arquitetura do acervo do escritório" fill sizes="(max-width: 700px) 72vw, 38vw"/></Link>
      <p className="editorial-image-note">Identidade e apresentação editorial.<br/>Arquitetura do acervo do escritório.</p>
    </article>

    <article className="editorial-simetria" aria-labelledby="simetria-feature-title">
      <Link href="/projetos/simetria" className="editorial-simetria-portrait editorial-image" aria-label="Explorar projeto Simetria Estética"><Image src={simetria.cardCover!} alt={simetria.coverAlt} fill sizes="(max-width: 700px) 90vw, 48vw"/></Link>
      <div className="editorial-intro"><span className="editorial-index">03 / Identidade visual · Estudo conceitual</span><h3 id="simetria-feature-title">Simetria<br/>{' '}<em>Estética</em></h3><p>Equilíbrio, leveza e uma linguagem visual pensada para transmitir confiança sem parecer distante.</p><Link href="/projetos/simetria"><Visit/></Link></div>
      <Link href="/projetos/simetria" className="editorial-simetria-application editorial-image" aria-label="Ver aplicação da identidade Simetria"><Image src="/media/simetria/tote.webp" alt="Visualização conceitual da marca Simetria aplicada a uma bolsa" fill sizes="(max-width: 700px) 66vw, 32vw"/></Link>
    </article>

    <div className="editorial-closing">{closing.map((project,index)=><article key={project.slug} aria-labelledby={`${project.slug}-feature-title`}><Link href={`/projetos/${project.slug}`}><div className="editorial-image"><Image src={project.cover} alt={project.coverAlt} fill sizes="(max-width: 700px) 90vw, 44vw"/></div><div className="editorial-closing-caption"><div><span className="editorial-index">0{index+4} / {project.discipline}</span><h3 id={`${project.slug}-feature-title`}>{project.name}</h3></div><span aria-hidden="true">↗</span></div><p>{index===0?'Uma identidade sóbria e contemporânea para a comunicação jurídica.':'Uma linguagem visual que aproxima, acolhe e transmite confiança.'}</p><Visit/></Link></article>)}</div>
  </ProjectChoreography>;
}
