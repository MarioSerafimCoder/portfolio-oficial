'use client';

import {useMemo, useRef, useState} from 'react';
import {fromMarkdown} from 'mdast-util-from-markdown';
import {MarkdownContent} from '@/components/markdown-content';
import type {MarkdownNode} from '@/content/journal';
import {editorialMarkdown, type EditorialDraft, type EditorialKind} from '@/lib/editorial-composer';

const kinds = [
  {kind: 'quote', label: 'Citação', description: 'Uma voz que amplia a conversa.', field: 'Texto da citação', placeholder: 'Escreva o trecho que você quer citar.'},
  {kind: 'impact', label: 'Frase de impacto', description: 'Uma ideia que merece espaço.', field: 'Frase de impacto', placeholder: 'Qual ideia merece um destaque?'},
  {kind: 'author', label: 'Nota do autor', description: 'Uma observação mais pessoal.', field: 'Texto da nota do autor', placeholder: 'Acrescente sua observação ao texto.'},
] as const;
const empty = (kind: EditorialKind): EditorialDraft => ({kind, text: '', author: '', source: '', url: ''});

export function EditorialComposer() {
  const [kind, setKind] = useState<EditorialKind>('quote');
  const [drafts, setDrafts] = useState<Record<EditorialKind, EditorialDraft>>({quote: empty('quote'), impact: empty('impact'), author: empty('author')});
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'copied' | 'manual'>('idle');
  const manual = useRef<HTMLTextAreaElement>(null);
  const draft = drafts[kind];
  const selected = kinds.find(item => item.kind === kind)!;
  const result = useMemo(() => editorialMarkdown(draft), [draft]);
  const tree = useMemo(() => fromMarkdown(result.markdown) as MarkdownNode, [result.markdown]);
  function update(field: keyof Omit<EditorialDraft, 'kind'>, value: string) {
    setDrafts(previous => ({...previous, [kind]: {...previous[kind], [field]: value}}));
    setCopyState('idle');
  }
  async function copy() {
    if (!result.markdown) return;
    setCopyState('copying');
    try {
      await navigator.clipboard.writeText(`\n\n${result.markdown}\n`);
      setCopyState('copied');
    } catch { setCopyState('manual'); }
  }
  return <main id="conteudo" className="editorial-composer section-wrap">
    <header className="composer-heading">
      <p className="composer-kicker">PAUSA DO CAFÉ · FERRAMENTA EDITORIAL</p>
      <h1>Compor bloco editorial</h1>
      <p>Escolha o destaque, escreva e veja como ele ficará no blog.</p>
    </header>
    <fieldset className="composer-kinds">
      <legend>Inserir bloco editorial</legend>
      <div>{kinds.map(item => <label key={item.kind} className={kind === item.kind ? 'is-selected' : ''}>
        <input type="radio" name="editorial-kind" value={item.kind} checked={kind === item.kind} onChange={() => {setKind(item.kind); setCopyState('idle');}}/>
        <span><strong>{item.label}</strong><small>{item.description}</small></span>
      </label>)}</div>
    </fieldset>
    <div className="composer-workspace">
      <section className="composer-fields" aria-labelledby="composer-edit-title">
        <h2 id="composer-edit-title">Seu texto</h2>
        <label htmlFor="composer-text">{selected.field}</label>
        <textarea id="composer-text" value={draft.text} onChange={e => update('text', e.target.value)} placeholder={selected.placeholder} rows={7} aria-invalid={result.errorField === 'text'} aria-describedby={result.errorField === 'text' ? 'composer-text-help composer-error' : 'composer-text-help'}/>
        <p id="composer-text-help" className="composer-help">Escreva normalmente. Uma linha em branco inicia outro parágrafo.</p>
        {kind === 'quote' && <><label htmlFor="composer-author">Autoria <span>(opcional)</span></label><input id="composer-author" value={draft.author} onChange={e => update('author', e.target.value)} placeholder="Quem disse isso?"/></>}
        <details className="composer-reference" key={kind}>
          <summary>{kind === 'quote' ? 'Adicionar fonte ou referência' : 'Adicionar referência'}</summary>
          <label htmlFor="composer-source">{kind === 'quote' ? 'Nome da fonte' : 'Texto da referência'} <span>(opcional)</span></label>
          <input id="composer-source" value={draft.source} onChange={e => update('source', e.target.value)} placeholder="Nome do livro, artigo ou site"/>
          <label htmlFor="composer-url">Endereço da fonte <span>(opcional)</span></label>
          <input id="composer-url" type="url" value={draft.url} onChange={e => update('url', e.target.value)} placeholder="https://" autoComplete="off" aria-invalid={result.errorField === 'url'} aria-describedby={result.errorField === 'url' ? 'composer-error' : undefined}/>
        </details>
        {result.error && <p id="composer-error" className="composer-error" role="alert">{result.error}</p>}
      </section>
      <section className="composer-preview" aria-labelledby="composer-preview-title">
        <div className="composer-preview-heading"><h2 id="composer-preview-title">Prévia no blog</h2><span>Atualizada enquanto você escreve</span></div>
        <div className="journal-post-page composer-preview-surface">
          <div className="journal-article-content">
            {result.markdown ? <MarkdownContent tree={tree} title=""/> : <p className="composer-placeholder">{result.error ? 'Ajuste os campos para visualizar o bloco.' : 'Seu destaque aparece aqui.'}</p>}
          </div>
        </div>
      </section>
    </div>
    <section className="composer-transfer" aria-labelledby="composer-transfer-title">
      <div><h2 id="composer-transfer-title">Leve para o seu artigo</h2><p>Copie o bloco e cole no modo <strong>Source</strong> do Pages CMS, entre os parágrafos do artigo. Depois, volte para <strong>Editor</strong> para continuar escrevendo.</p><a href="https://app.pagescms.org/marioserafimcoder/portfolio-oficial/main/collection/posts" target="_blank" rel="noopener noreferrer">Abrir Pages CMS ↗</a></div>
      <div className="composer-copy"><button type="button" className="composer-copy-button" disabled={!result.markdown || copyState === 'copying'} onClick={copy}>{copyState === 'copying' ? 'Copiando…' : 'Copiar bloco'}</button><p role="status" aria-live="polite">{copyState === 'copied' ? 'Bloco copiado. Agora é só colar no Source do CMS.' : copyState === 'manual' ? 'A cópia automática não ficou disponível. Selecione o bloco abaixo para copiar.' : ''}</p></div>
    </section>
    {copyState === 'manual' && <div className="composer-manual"><label htmlFor="composer-manual">Bloco pronto para copiar</label><textarea id="composer-manual" ref={manual} readOnly value={`\n\n${result.markdown}\n`} rows={8}/><button type="button" onClick={() => {manual.current?.focus(); manual.current?.select();}}>Selecionar bloco</button></div>}
  </main>;
}
