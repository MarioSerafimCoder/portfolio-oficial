'use client';

import {useEffect,useRef,useState,type FormEvent} from 'react';

type PublicComment = {author:string;body:string;date:number;reply:{body:string;date:number}|null};
type Listing = {comments:PublicComment[];nextPage:number|null;accepting:boolean;sitekey:string|null};
type Widget = {
  render(element:HTMLElement,options:Record<string,unknown>):string;
  remove(id:string):void;
};
const commentLimit = 600;
const nameLimit = 50;
const widget = () => (window as Window & {turnstile?:Widget}).turnstile;
let scriptLoad:Promise<Widget>|undefined;
function loadWidget():Promise<Widget> {
  const ready = widget();
  if (ready) return Promise.resolve(ready);
  if (scriptLoad) return scriptLoad;
  scriptLoad = new Promise<Widget>((resolve,reject)=>{
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    const fail = () => {clearTimeout(timer);script.remove();reject(new Error('widget_unavailable'))};
    const timer = window.setTimeout(fail,10000);
    script.onload = () => {
      clearTimeout(timer);
      const api = widget();
      if (api) resolve(api); else fail();
    };
    script.onerror = fail;
    document.head.appendChild(script);
  }).catch(error=>{scriptLoad=undefined;throw error});
  return scriptLoad;
}
const copy = {
  pt:{
    title:'Comentários',
    invitation:'Curtiu? Se sim, deixa teu comentário. Se não gostou, deixa também!',
    placeholder:'Escreva o que você pensa...',
    name:'Nome ou apelido', comment:'Comentário', send:'Enviar comentário', sending:'Enviando…',
    confirmTitle:'Só falta se identificar.',
    confirmDescription:'Seu comentário está pronto. Informe como deseja aparecer e confirme o envio para moderação.',
    confirm:'Confirmar envio', back:'Voltar', invalidBody:'Escreva um comentário de até 600 caracteres.',
    received:'Comentário recebido!', thanks:'Obrigado por participar. Seu comentário aparecerá depois da aprovação.',
    loading:'Carregando comentários…', empty:'Ainda não há comentários publicados.', more:'Carregar mais',
    error:'Não foi possível carregar os comentários. Tente novamente.', retry:'Tentar novamente',
    sendError:'Não foi possível enviar. Confira o texto e tente novamente.',
    limit:'Muitas tentativas. Aguarde um pouco antes de enviar novamente.',
    closed:'O envio de novos comentários está suspenso.', author:'Mário Serafim · Autor',
    challenge:'Não foi possível carregar a verificação de segurança.',
    challengeLoading:'Carregando verificação…', challengeExpired:'A verificação expirou. Aguarde a renovação ou tente novamente.',
    challengeRejected:'A verificação não foi aceita. Conclua a nova verificação para tentar novamente.',
    moderation:'Cada comentário passa por aprovação antes de aparecer.',
    rules:'Regras da conversa', privacy:'Política de privacidade', newTab:' (abre em nova aba)',
  },
  en:{
    title:'Comments',
    invitation:'Liked it? Leave a comment. Didn’t like it? Leave one anyway!',
    placeholder:'Write what you think...',
    name:'Name or nickname', comment:'Comment', send:'Send comment', sending:'Sending…',
    confirmTitle:'Just tell us your name.',
    confirmDescription:'Your comment is ready. Enter how you’d like to appear and confirm your submission for review.',
    confirm:'Confirm submission', back:'Back', invalidBody:'Write a comment of up to 600 characters.',
    received:'Comment received!', thanks:'Thanks for taking part. Your comment will appear after approval.',
    loading:'Loading comments…', empty:'No comments have been published yet.', more:'Load more',
    error:'Could not load comments. Please try again.', retry:'Try again',
    sendError:'Could not send your comment. Check your text and try again.',
    limit:'Too many attempts. Wait a little before sending again.',
    closed:'New comments are currently paused.', author:'Mário Serafim · Author',
    challenge:'Could not load the security check.',
    challengeLoading:'Loading the security check…', challengeExpired:'The security check expired. Wait for it to refresh or try again.',
    challengeRejected:'The security check was not accepted. Complete the new check to try again.',
    moderation:'Each comment is reviewed before it appears.',
    rules:'Conversation rules', privacy:'Privacy policy', newTab:' (opens in a new tab)',
  },
};

export function JournalComments({slug,locale,privacyHref}:{slug:string;locale:'pt'|'en';privacyHref:string}) {
  const t=copy[locale];
  const [listing,setListing]=useState<Listing|null>(null);
  const [loading,setLoading]=useState(true), [loadError,setLoadError]=useState(false), [loadAttempt,setLoadAttempt]=useState(0);
  const [author,setAuthor]=useState(''), [body,setBody]=useState(''), [token,setToken]=useState('');
  const [received,setReceived]=useState(false), [sendError,setSendError]=useState(''), [sending,setSending]=useState(false);
  const [panelOpen,setPanelOpen]=useState(false), [bodyInvalid,setBodyInvalid]=useState(false);
  const [widgetStatus,setWidgetStatus]=useState<'loading'|'ready'|'expired'|'error'>('loading');
  const [widgetAttempt,setWidgetAttempt]=useState(0);
  const dialog=useRef<HTMLDialogElement>(null), dialogTitle=useRef<HTMLHeadingElement>(null);
  const composer=useRef<HTMLTextAreaElement>(null), trigger=useRef<HTMLButtonElement>(null);
  const widgetHost=useRef<HTMLDivElement>(null), submission=useRef(false);
  const endpoint='/api/comments?slug='+encodeURIComponent(slug);
  useEffect(()=>{
    const controller=new AbortController();
    setLoading(true);setLoadError(false);
    void fetch(endpoint,{signal:AbortSignal.any([controller.signal,AbortSignal.timeout(18000)])}).then(async response=>{
      if(!response.ok)throw Error();
      const data=await response.json() as Listing;
      if(!controller.signal.aborted)setListing(data);
    }).catch(()=>{if(!controller.signal.aborted)setLoadError(true)})
      .finally(()=>{if(!controller.signal.aborted)setLoading(false)});
    return ()=>controller.abort();
  },[endpoint,loadAttempt]);
  const sitekey=listing?.sitekey;
  useEffect(()=>{
    if(!panelOpen||!sitekey||!widgetHost.current)return;
    const host=widgetHost.current;
    let cancelled=false, renderVersion=0, widgetId:string|null=null;
    setWidgetStatus('loading');
    setToken('');
    function render(api:Widget) {
      const version=++renderVersion;
      const current=()=>!cancelled&&version===renderVersion;
      if(widgetId!==null)api.remove(widgetId);
      widgetId=null;
      setToken('');
      setWidgetStatus('ready');
      widgetId=api.render(host,{
        sitekey,action:'blog_comment',language:locale==='pt'?'pt-br':'en',
        size:host.clientWidth<300?'compact':'flexible',
        theme:document.documentElement.dataset.theme==='dark'?'dark':'light',
        'refresh-expired':'auto',
        callback:(value:string)=>{if(current()){setWidgetStatus('ready');setToken(value)}},
        'expired-callback':()=>{if(current()){setToken('');setWidgetStatus('expired')}},
        'error-callback':()=>{if(current()){setToken('');setWidgetStatus('error')}},
      });
    }
    const observer=new MutationObserver(()=>{
      const api=widget();
      if(api&&widgetId!==null){try{render(api)}catch{setWidgetStatus('error')}}
    });
    void loadWidget().then(api=>{
      if(cancelled)return;
      render(api);
      observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
    }).catch(()=>{if(!cancelled)setWidgetStatus('error')});
    return ()=>{
      cancelled=true;observer.disconnect();
      if(widgetId!==null)widget()?.remove(widgetId);
    };
  },[panelOpen,sitekey,widgetAttempt,locale]);
  useEffect(()=>{
    const viewport=window.visualViewport, panel=dialog.current;
    if(!panelOpen||!viewport||!panel)return;
    function fitPanel() {
      if(!viewport||!panel)return;
      panel.style.setProperty('--comment-viewport-height',`${viewport.height}px`);
      panel.style.setProperty('--comment-viewport-bottom',`${Math.max(0,window.innerHeight-viewport.height-viewport.offsetTop)}px`);
    }
    fitPanel();
    viewport.addEventListener('resize',fitPanel);
    viewport.addEventListener('scroll',fitPanel);
    return ()=>{
      viewport.removeEventListener('resize',fitPanel);
      viewport.removeEventListener('scroll',fitPanel);
    };
  },[panelOpen]);
  async function more() {
    if(listing?.nextPage==null||loading)return;
    setLoading(true);setLoadError(false);
    try {
      const response=await fetch(endpoint+'&page='+listing.nextPage,{signal:AbortSignal.timeout(18000)});
      if(!response.ok)throw Error();
      const next=await response.json() as Listing;
      setListing({...next,comments:[...listing.comments,...next.comments]});
    } catch {setLoadError(true)}
    finally {setLoading(false)}
  }
  const validBody=body.trim().length>0&&body.length<=commentLimit;
  const validAuthor=author.trim().length>0&&author.length<=nameLimit;
  function openPanel(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(!validBody){setBodyInvalid(true);composer.current?.focus();return}
    if(!sitekey||!dialog.current||dialog.current.open)return;
    setToken('');setSendError('');setWidgetStatus('loading');
    dialog.current.showModal();
    dialogTitle.current?.focus({preventScroll:true});
    setPanelOpen(true);
  }
  function closePanel() {
    if(submission.current)return;
    dialog.current?.close();
    setPanelOpen(false);setToken('');
    trigger.current?.focus({preventScroll:true});
  }
  function retryWidget() {
    setToken('');setWidgetStatus('loading');setWidgetAttempt(value=>value+1);
  }
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(!dialog.current?.open||!token||!validAuthor||!validBody||submission.current)return;
    const website=new FormData(event.currentTarget).get('website');
    submission.current=true;setSending(true);setSendError('');
    let accepted=false;
    try {
      const response=await fetch(endpoint,{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({author,body,token,website}),signal:AbortSignal.timeout(18000),
      });
      if(response.status!==202){
        const failure=await response.json().catch(()=>null) as {error?:string}|null;
        setSendError(failure?.error==='invalid_challenge'?t.challengeRejected:
          response.status===429?t.limit:failure?.error==='comments_closed'?t.closed:t.sendError);
        return;
      }
      accepted=true;
      setBody('');setAuthor('');setReceived(true);
    } catch {setSendError(t.sendError)}
    finally {
      submission.current=false;setSending(false);setToken('');
      if(accepted)closePanel();
      else retryWidget();
    }
  }
  const date=(value:number)=>new Intl.DateTimeFormat(locale==='en'?'en':'pt-BR',{dateStyle:'medium',timeZone:'America/Fortaleza'}).format(value);
  return <section className="journal-comments" aria-labelledby="journal-comments-title">
    <h2 id="journal-comments-title">{t.title}</h2>
    {loading&&<p role="status">{t.loading}</p>}
    {loadError&&<p role="alert">{t.error} <button className="journal-comments-more" onClick={()=>listing?void more():setLoadAttempt(value=>value+1)}>{t.retry}</button></p>}
    {listing&&!listing.comments.length&&!listing.accepting&&<p>{t.empty}</p>}
    {listing&&listing.comments.length>0&&<ol className="journal-comments-list">
      {listing.comments.map((item,index)=><li key={index}>
        <header><strong>{item.author}</strong><time dateTime={new Date(item.date).toISOString()}>{date(item.date)}</time></header>
        <p className="journal-comment-text">{item.body}</p>
        {item.reply&&<div className="journal-comment-reply"><header><strong>{t.author}</strong><time dateTime={new Date(item.reply.date).toISOString()}>{date(item.reply.date)}</time></header><p className="journal-comment-text">{item.reply.body}</p></div>}
      </li>)}
    </ol>}
    {listing?.nextPage!=null&&!loadError&&<button className="journal-comments-more" type="button" disabled={loading} onClick={()=>void more()}>{t.more}</button>}
    {listing&&!listing.accepting&&<p>{t.closed}</p>}
    {listing?.accepting&&<form className="journal-comment-form" onSubmit={openPanel} noValidate>
      {!listing.comments.length&&<p className="journal-comment-invitation">{t.invitation}</p>}
      <label className="sr-only" htmlFor="journal-comment-body">{t.comment}</label>
      <textarea id="journal-comment-body" ref={composer} required maxLength={commentLimit} rows={4}
        placeholder={t.placeholder} aria-invalid={bodyInvalid||undefined}
        aria-describedby={bodyInvalid?'journal-comment-count journal-comment-error':'journal-comment-count'}
        value={body} onChange={event=>{setBody(event.target.value);setBodyInvalid(false);setReceived(false)}}/>
      <div className="journal-comment-actions">
        <span id="journal-comment-count">{body.length}/{commentLimit}</span>
        <button ref={trigger} className="journal-action" type="submit" aria-haspopup="dialog">{t.send}</button>
      </div>
      {bodyInvalid&&<p id="journal-comment-error" role="alert">{t.invalidBody}</p>}
    </form>}
    <div role="status" aria-atomic="true">
      {received&&<><p><strong>{t.received}</strong></p><p>{t.thanks}</p></>}
    </div>
    <dialog ref={dialog} className="journal-comment-dialog" aria-labelledby="journal-comment-confirm-title"
      aria-describedby="journal-comment-confirm-description"
      onCancel={event=>{event.preventDefault();closePanel()}}>
      <h2 id="journal-comment-confirm-title" ref={dialogTitle} tabIndex={-1}>{t.confirmTitle}</h2>
      <p id="journal-comment-confirm-description">{t.confirmDescription}</p>
      <form className="journal-comment-form" onSubmit={submit}>
        <label>{t.name}<input required maxLength={nameLimit} autoComplete="nickname" readOnly={sending}
          value={author} onChange={event=>setAuthor(event.target.value)}/></label>
        <div className="journal-comment-trap" aria-hidden="true" inert><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
        <div className="journal-comment-widget" ref={widgetHost}/>
        {widgetStatus==='loading'&&<p role="status">{t.challengeLoading}</p>}
        {(widgetStatus==='error'||widgetStatus==='expired')&&<p role="status">
          {widgetStatus==='error'?t.challenge:t.challengeExpired}{' '}
          <button type="button" className="journal-comments-more" disabled={sending} onClick={retryWidget}>{t.retry}</button>
        </p>}
        <div className="journal-comment-moderation">
          <p>{t.moderation}</p>
          <div>
            <a href={`${privacyHref}#regras-da-conversa`} target="_blank" rel="noopener noreferrer">{t.rules}<span className="sr-only">{t.newTab}</span></a>
            <a href={privacyHref} target="_blank" rel="noopener noreferrer">{t.privacy}<span className="sr-only">{t.newTab}</span></a>
          </div>
        </div>
        {sendError&&<p role="alert">{sendError}</p>}
        <div className="journal-comment-actions">
          <button className="journal-action is-secondary" type="button" disabled={sending} onClick={closePanel}>{t.back}</button>
          <button className="journal-action" disabled={!token||sending||!validAuthor||!validBody} type="submit">{sending?t.sending:t.confirm}</button>
        </div>
      </form>
    </dialog>
  </section>;
}
