import type {Metadata} from 'next';
import {ProjectBrowser} from '@/components/projects';
export const metadata:Metadata={title:'Projetos',description:'Uma seleção de identidades visuais, direção de arte e experiências digitais por Mário Serafim.'};
export default function Projects(){return <main id="conteudo" className="projects-page"><div className="page-heading section-wrap"><span className="eyebrow">Projetos</span><h1>Uma ideia só ganha força<br/>quando encontra <em>expressão.</em></h1><p>Identidades, linguagens e experiências.<br/>Uma seleção do meu trabalho.</p></div><section className="section-wrap project-browser" aria-label="Seleção de projetos"><ProjectBrowser/></section></main>}
