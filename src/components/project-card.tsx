'use client';
import Image from 'next/image';
import Link from 'next/link';
import type {Project} from '@/content/projects';
import {Arrow} from './shell';
import {useProjectMotion} from './use-project-motion';

export function ProjectCard({project,index=0,priority=false,homeDescription,homeLabel}:{project:Pick<Project,'slug'|'palette'|'cover'|'cardCover'|'coverAlt'|'name'|'discipline'|'headline'>;index?:number;priority?:boolean;homeDescription?:string;homeLabel?:string}){
 const card=useProjectMotion();
 return <Link ref={card} href={`/projetos/${project.slug}`} className={`project-card project-${index%4} card-${project.slug}`} data-reveal><div className="project-media" style={{background:project.palette[0]}}><Image src={project.cardCover||project.cover} alt={project.coverAlt} fill style={project.slug==='rooftop'?{transform:'scale(1.06)'}:undefined} sizes="(max-width: 600px) 90vw, (max-width: 900px) 45vw, 45vw" priority={priority}/><span className="project-visit" aria-hidden="true">Ver projeto ↗</span></div><div className="project-caption"><div><h2>{project.name}</h2><p>{homeLabel||project.discipline}</p><p className="project-teaser">{homeDescription||project.headline}</p></div><Arrow/></div></Link>
}

