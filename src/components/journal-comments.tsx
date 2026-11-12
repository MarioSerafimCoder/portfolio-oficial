'use client';

import {useEffect,useRef,useState,type FormEvent} from 'react';

type PublicComment = {author:string;body:string;date:number;reply:{body:string;date:number}|null};
type Listing = {comments:PublicComment[];nextPage:number|null;accepting:boolean;sitekey:string|null};
type Widget = {
  render(element:HTMLElement,options:Record<string,unknown>):string;
  reset(id:string):void;
  remove(id:string):void;
};
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
    title:'A conversa continua.',
    description:'Discordou, concordou ou tem algo a acrescentar? Este espaço também é seu.',
    name:'Nome ou apelido', comment:'Comentário', send:'Enviar comentário', sending:'Enviando…',
    received:'Comentário recebido! Ele aparecerá aqui depois da moderação.',
    loading:'Carregando comentários…', empty:'Ainda não há comentários publicados.', more:'Carregar mais',
    error:'Não foi possível carregar os comentários. Tente novamente.', retry:'Tentar novamente',
    sendError:'Não foi possível enviar. Confira o texto e tente novamente.',
    limit:'Muitas tentativas. Aguarde um pouco antes de enviar novamente.',
    closed:'O envio de novos comentários está suspenso.', author:'Mário Serafim · Autor',
    challenge:'Não foi possível carregar a verificação de segurança.', privacy:'Política de privacidade',
    policy:'Discordâncias, críticas fundamentadas, correções e sugestões são bem-vindas. Os comentários passam por moderação humana. Ameaças, assédio, ataques abusivos, discriminação, exposição de dados privados, spam, propaganda abusiva e links maliciosos não são aceitos.',
  },
  en:{
    title:'The conversation continues.',
    description:'Agree, disagree, or have something to add? This space is yours too.',
    name:'Name or nickname', comment:'Comment', send:'Send comment', sending:'Sending…',
    received:'Comment received! It will appear here after moderation.',
    loading:'Loading comments…', empty:'No comments have been published yet.', more:'Load more',
    error:'Could not load comments. Please try again.', retry:'Try again',
    sendError:'Could not send your comment. Check your text and try again.',
    limit:'Too many attempts. Wait a little before sending again.',
    closed:'New comments are currently paused.', author:'Mário Serafim · Author',
    challenge:'Could not load the security check.', privacy:'Privacy policy',
    policy:'Disagreement, thoughtful criticism, corrections and suggestions are welcome. Comments are reviewed by a person. Threats, harassment, personal abuse, discrimination, sharing private information, spam, abusive advertising and malicious links are prohibited.',
  },
};

export function JournalComments({slug,locale,privacyHref}:{slug:string;locale:'pt'|'en';privacyHref:string}) {
  const t=copy[locale];
  const [listing,setListing]=useState<Listing|null>(null);
  const [loading,setLoading]=useState(true), [loadError,setLoadError]=useState(false), [loadAttempt,setLoadAttempt]=useState(0);
  const [author,setAuthor]=useState(''), [body,setBody]=useState(''), [token,setToken]=useState('');
  const [message,setMessage]=useState(''), [sendError,setSendError]=useState(''), [sending,setSending]=useState(false);
  const [widgetError,setWidgetError]=useState(false), [widgetAttempt,setWidgetAttempt]=useState(0);
  const widgetHost=useRef<HTMLDivElement>(null), widgetId=useRef<string|null>(null), submission=useRef(false);
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
    if(!sitekey||!widgetHost.current)return;
    let cancelled=false;
    const host=widgetHost.current;
    setWidgetError(false);setToken('');
    function render(api:Widget) {
      if(widgetId.current!==null)api.remove(widgetId.current);
      setToken('');
      widgetId.current=api.render(host,{
        sitekey,action:'blog_comment',language:locale==='pt'?'pt-br':'en',size:'flexible',
        theme:document.documentElement.dataset.theme==='dark'?'dark':'light',
        callback:(value:string)=>{setWidgetError(false);setToken(value)},
        'expired-callback':()=>setToken(''),
        'error-callback':()=>{setToken('');setWidgetError(true)},
      });
    }
    const observer=new MutationObserver(()=>{
      const api=widget();
      if(api&&widgetId.current!==null){try{render(api)}catch{setWidgetError(true)}}
    });
    void loadWidget().then(api=>{
      if(cancelled)return;
      render(api);
      observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
    }).catch(()=>{if(!cancelled)setWidgetError(true)});
    return ()=>{
      cancelled=true;observer.disconnect();
      if(widgetId.current!==null)widget()?.remove(widgetId.current);
      widgetId.current=null;
    };
  },[sitekey,widgetAttempt,locale]);
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
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(!token||submission.current)return;
    const website=new FormData(event.currentTarget).get('website');
    submission.current=true;setSending(true);setMessage('');setSendError('');
    try {
      const response=await fetch(endpoint,{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({author,body,token,website}),signal:AbortSignal.timeout(18000),
      });
      if(response.status!==202){
        setSendError(response.status===429?t.limit:response.status===403?t.closed:t.sendError);return;
      }
      setBody('');setAuthor('');setMessage(t.received);
    } catch {setSendError(t.sendError)}
    finally {
      submission.current=false;setSending(false);setToken('');
      if(widgetId.current!==null)widget()?.reset(widgetId.current);
    }
  }
  const date=(value:number)=>new Intl.DateTimeFormat(locale==='en'?'en':'pt-BR',{dateStyle:'medium',timeZone:'America/Fortaleza'}).format(value);
  return <section className="journal-comments" aria-labelledby="journal-comments-title">
    <h2 id="journal-comments-title">{t.title}</h2>
    <p>{t.description}</p>
    {loading&&<p role="status">{t.loading}</p>}
    {loadError&&<p role="alert">{t.error} <button className="journal-comments-more" onClick={()=>listing?void more():setLoadAttempt(value=>value+1)}>{t.retry}</button></p>}
    {listing&&!listing.comments.length&&<p>{t.empty}</p>}
    {listing&&listing.comments.length>0&&<ol className="journal-comments-list">
      {listing.comments.map((item,index)=><li key={index}>
        <header><strong>{item.author}</strong><time dateTime={new Date(item.date).toISOString()}>{date(item.date)}</time></header>
        <p className="journal-comment-text">{item.body}</p>
        {item.reply&&<div className="journal-comment-reply"><header><strong>{t.author}</strong><time dateTime={new Date(item.reply.date).toISOString()}>{date(item.reply.date)}</time></header><p className="journal-comment-text">{item.reply.body}</p></div>}
      </li>)}
    </ol>}
    {listing?.nextPage!=null&&!loadError&&<button className="journal-comments-more" type="button" disabled={loading} onClick={()=>void more()}>{t.more}</button>}
    {listing&&!listing.accepting&&<p>{t.closed}</p>}
    {listing?.accepting&&<form className="journal-comment-form" onSubmit={submit}>
      <p id="journal-comment-policy">{t.policy} <a href={privacyHref}>{t.privacy}</a>.</p>
      <label>{t.name}<input required maxLength={50} autoComplete="nickname" value={author} onChange={event=>setAuthor(event.target.value)}/></label>
      <label>{t.comment}<textarea required maxLength={800} rows={5} aria-describedby="journal-comment-count journal-comment-policy" value={body} onChange={event=>setBody(event.target.value)}/></label>
      <span id="journal-comment-count">{body.length}/800</span>
      <div className="journal-comment-trap" aria-hidden="true" inert><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
      <div className="journal-comment-widget" ref={widgetHost}/>
      {widgetError&&<p role="alert">{t.challenge} <button type="button" className="journal-comments-more" onClick={()=>setWidgetAttempt(value=>value+1)}>{t.retry}</button></p>}
      <button className="journal-comment-submit" disabled={!token||sending||!author.trim()||!body.trim()} type="submit">{sending?t.sending:t.send}</button>
      <p role="status">{message}</p>
      {sendError&&<p role="alert">{sendError}</p>}
    </form>}
  </section>;
}
