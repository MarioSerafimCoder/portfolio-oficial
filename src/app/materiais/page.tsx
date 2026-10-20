import type {Metadata} from 'next';
import Link from 'next/link';
import {Newsletter} from '@/components/newsletter';

// TODO(Mário): produzir e aprovar o arquivo do checklist antes de disponibilizar download e navegação.
export const metadata:Metadata={title:'Materiais em preparação',description:'Material de apoio sobre identidade visual em preparação por Mário Serafim.',robots:{index:false,follow:true},alternates:{canonical:'/materiais'}};

export default function Materials(){return <main id="conteudo" className="materials-page"><section className="section-wrap materials-intro"><span className="eyebrow">Materiais</span><h1>Checklist de identidade visual:<br/><em>sua marca está pronta?</em></h1><p>Estou preparando este material. Enquanto ele não está disponível, você pode conhecer os projetos ou acompanhar os textos do Diário.</p><div><Link className="pill" href="/projetos">Ver projetos ↗</Link><Link className="text-link" href="/blog">Ir ao Diário ↗</Link></div></section><Newsletter/></main>}
