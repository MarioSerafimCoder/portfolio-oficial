'use client';
import Link from 'next/link';
export default function ErrorPage({reset}:{reset:()=>void}){return <main id="conteudo" className="not-found section-wrap"><span className="eyebrow">Algo interrompeu a leitura</span><h1>Vamos tentar<br/>mais uma vez.</h1><button className="pill" onClick={reset}>Tentar novamente ↗</button><Link className="text-link" href="/">Voltar ao início</Link></main>}
