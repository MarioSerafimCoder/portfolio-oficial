'use client';
import {LanguageSwitcher} from './language-switcher';
import {originalPath} from '@/i18n/routes';
import {useSiteTranslation} from '@/i18n/use-translation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { site } from '@/content/site';
import Image from 'next/image';
import { ContactForm } from './contact';
import { JournalFooter } from './journal-footer';
import { JournalHeaderTools } from './journal-header-tools';
import { useJournalPreferences } from './journal-preferences';
import { ThemeToggle } from './theme-toggle';
import { SocialLinks } from './social-links';
import { showJournalNavigation } from '@/content/journal';
import { WhatsAppFloating } from './whatsapp-link';
import { WhatsAppLink } from './whatsapp-link';
import { createSpring } from '@/lib/motion';
export function Arrow({ diagonal = false }: {
    diagonal?: boolean;
}) { const { i18nText, i18nHref } = useSiteTranslation(); return <span aria-hidden="true" className="arrow">{i18nText(diagonal ? '↗' : '↗')}</span>; }
export function Header() {
    const { i18nText, i18nHref } = useSiteTranslation();
    const path = originalPath(usePathname());
    const { locale } = useJournalPreferences();
    const isJournal = path === '/blog' || path.startsWith('/blog/');
    const dialog = useRef<HTMLDialogElement>(null);
    const header = useRef<HTMLElement>(null);
    const [preview, setPreview] = useState(0);
    const previews = ['amazonita-cover', 'rooftop-home', 'simetria/portrait'];
    const trigger = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    const motion = useRef<ReturnType<typeof createSpring> | null>(null);
    const destination = useRef(0);
    function instant() { return matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.input === 'keyboard'; }
    function finishClose() { dialog.current?.close(); setOpen(false); trigger.current?.focus({ preventScroll: true }); }
    function close() { if (!dialog.current?.open)
        return; destination.current = 0; motion.current?.to(0, instant(), finishClose); }
    function navigate() { destination.current = 0; motion.current?.to(0, true); dialog.current?.close(); setOpen(false); }
    function show() { if (!dialog.current)
        return; setPreview(0); dialog.current.showModal(); destination.current = 1; setOpen(true); motion.current?.to(1, instant()); }
    useEffect(() => {
        motion.current = createSpring(value => { if (dialog.current) {
            dialog.current.style.setProperty('--menu-progress', String(value));
            dialog.current.style.opacity = String(value);
            dialog.current.style.transform = `translateY(${(1 - value) * -12}px)`;
        } });
        const preference = matchMedia('(prefers-reduced-motion: reduce)');
        const settle = () => { if (preference.matches)
            motion.current?.to(destination.current, true, destination.current === 0 ? finishClose : undefined); };
        const keyboard = () => { if (dialog.current?.open)
            motion.current?.to(destination.current, true, destination.current === 0 ? finishClose : undefined); };
        preference.addEventListener('change', settle);
        document.addEventListener('keydown', keyboard);
        return () => { motion.current?.stop(); preference.removeEventListener('change', settle); document.removeEventListener('keydown', keyboard); };
    }, []);
    useEffect(() => {
        const compact = () => { if (header.current)
            header.current.dataset.compact = String(window.scrollY > 65); };
        compact();
        window.addEventListener('scroll', compact, { passive: true });
        return () => window.removeEventListener('scroll', compact);
    }, []);
    useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
    return <>
    <header ref={header} className={`site-header${isJournal ? ' journal-site-header' : ''}`}><Link className="wordmark" href={i18nHref("/")} aria-label={i18nText("M\u00E1rio Serafim \u2014 in\u00EDcio")}>{i18nText("M\u00E1rio ")}<em>{i18nText("Serafim")}</em></Link><div className="header-actions">{i18nText(isJournal ? <JournalHeaderTools /> : <nav className="header-nav" aria-label={i18nText("Acessos r\u00E1pidos")}><Link href={i18nHref("/projetos")} prefetch={false}>{i18nText("Projetos")}</Link>{i18nText(path === '/' ? <a href={i18nHref("#contato")}>{i18nText("Contato ")}<span aria-hidden="true">{i18nText("\u2197")}</span></a> : <Link href={i18nHref("/contato")}>{i18nText("Contato ")}<span aria-hidden="true">{i18nText("\u2197")}</span></Link>)}</nav>)}{!isJournal&&<LanguageSwitcher/>}<div className="header-social"><SocialLinks /></div><ThemeToggle compact locale={locale}/><button ref={trigger} type="button" className="menu-trigger" aria-label={i18nText(locale === 'en' ? 'Open menu' : 'Abrir menu')} aria-expanded={open} aria-controls="site-menu" onClick={show}><span className="menu-label">{i18nText("Menu")}</span><span className="menu-icon"><i /><i /></span></button></div></header>
    <dialog ref={dialog} id="site-menu" aria-label={i18nText("Navega\u00E7\u00E3o principal")} className="menu-dialog" onCancel={e => { e.preventDefault(); close(); }} onClose={() => setOpen(false)}>
      <div className="menu-top"><Link className="wordmark" href={i18nHref("/")} onClick={navigate}>{i18nText("M\u00E1rio ")}<em>{i18nText("Serafim")}</em></Link><div className="menu-top-actions"><div className="menu-mobile-social"><SocialLinks /></div><button className="close-button" aria-label={i18nText(isJournal && locale === 'en' ? 'Close menu' : 'Fechar menu')} onClick={close}>{i18nText("\u00D7")}</button></div></div>
      <div className="menu-content"><nav className="menu-links" aria-label={i18nText(isJournal && locale === 'en' ? 'Main navigation' : 'Principal')}>{i18nText((isJournal && locale === 'en' ? [['Projects', '/projetos'], ['About', '/sobre'], ...(showJournalNavigation ? [['Pausa do café', '/blog']] : []), ['Contact', '/contato']] : [['Projetos', '/projetos'], ['Sobre', '/sobre'], ...(showJournalNavigation ? [['Pausa do café', '/blog']] : []), ['Contato', '/contato']]).map(([label, url], i) => <Link key={url} href={i18nHref(url)} onMouseEnter={() => setPreview(i % 3)} onFocus={() => setPreview(i % 3)} aria-current={path === url ? 'page' : undefined} onClick={navigate} style={{ '--i': i } as React.CSSProperties}>{i18nText(label)}</Link>))}</nav><div className="menu-projects"><div className="menu-preview" aria-hidden="true">{i18nText(previews.map((image, index) => <Image key={image} src={`/media/${image}.webp`} alt={i18nText("")} fill sizes="(max-width:700px) 90vw, 46vw" data-active={preview === index}/>))}</div><span className="eyebrow">{i18nText(isJournal && locale === 'en' ? 'Featured' : 'Em foco')}</span>{i18nText([['Amazonita', 'amazonita', 'amazonita-cover'], ['Rooftop Arquitetura', 'rooftop', 'rooftop-home'], ['Simetria Estética', 'simetria', 'simetria/portrait']].map(([name, slug, img], i) => <Link href={i18nHref(`/projetos/${slug}`)} key={slug} onClick={navigate} onMouseEnter={() => setPreview(i)} onFocus={() => setPreview(i)} data-active={preview === i}><span className="menu-thumb"><Image src={`/media/${img}.webp`} alt={i18nText("")} fill sizes="110px"/></span><span><small>{i18nText(isJournal && locale === 'en' ? 'Project' : 'Projeto')}</small>{i18nText(name)}</span><span aria-hidden="true">{i18nText("\u2197")}</span></Link>))}</div></div>
      <div className="menu-bottom"><div><span className="eyebrow">{i18nText(isJournal && locale === 'en' ? 'An idea starts with a conversation.' : 'Uma ideia começa com uma conversa.')}</span><a className="text-link" href={i18nHref(`mailto:${site.email}`)}>{i18nText(site.email)}{i18nText(" \u2197")}</a></div><div><SocialLinks variant="text"/><p>{i18nText(isJournal && locale === 'en' ? 'Fortaleza, Brazil' : 'Fortaleza, Brasil')}</p></div></div>
    </dialog>
  </>;
}
export function Footer() {
    const { i18nText, i18nHref } = useSiteTranslation();
    const path = originalPath(usePathname());
    const { locale } = useJournalPreferences();
    const isJournal = path === '/blog' || path.startsWith('/blog/');
    const english = locale === 'en';
    const isArticle = path.startsWith('/blog/') && !path.startsWith('/blog/categoria/');
    return <footer className={`site-footer${path === '/' ? ' home-atmosphere' : ''}`} data-motion-owner="footer">
    {i18nText(!isJournal && path !== '/contato' && <section id="contato" className="footer-conversion" aria-labelledby="contact-heading"><div className="contact-invitation">{i18nText(path === '/' && <svg className="closing-ribbon" viewBox="0 0 600 400" aria-hidden="true"><path d="M80 300C-15 170 190 20 380 70s160 200 5 265S-15 275 80 170s290-150 395-40"/></svg>)}<span className="eyebrow">{i18nText(path === "/" ? "Vamos conversar" : "O próximo capítulo")}</span><h2 id="contact-heading">{i18nText(path === "/" ? <>{i18nText("Me conta o que voc\u00EA")}<br /><em>{i18nText("tem em mente.")}</em></> : <>{i18nText("Toda marca tem um")}<br /><em>{i18nText("pr\u00F3ximo cap\u00EDtulo.")}</em></>)}</h2><p>{i18nText(path === "/" ? "Pode ser uma marca começando agora, um negócio que cresceu ou uma identidade que já não acompanha o seu trabalho. Não precisa chegar com tudo resolvido. Me conte um pouco sobre o projeto e a gente descobre por onde começar." : "Conte um pouco sobre o que você está construindo. O resto começa com uma conversa.")}</p><WhatsAppLink context={path === '/sobre' ? 'a página Sobre' : path.startsWith('/projetos/') ? `o projeto ${path.split('/').pop()?.replace(/-/g, ' ')}` : 'seu trabalho'} className="text-link contact-whatsapp"/><span className="contact-signature">{i18nText("M\u00E1rio Serafim / Dire\u00E7\u00E3o de arte & identidade visual")}</span></div><ContactForm key={path}/></section>)}
    {i18nText(isJournal && !isArticle && <JournalFooter />)}
    <div className="footer-secondary"><nav aria-label={i18nText(english ? 'Footer' : 'Rodapé')}><Link href={i18nHref("/projetos")}>{i18nText(english ? 'Projects' : 'Projetos')}{i18nText(" \u2197")}</Link><Link href={i18nHref("/sobre")}>{i18nText(english ? 'About' : 'Sobre')}{i18nText(" \u2197")}</Link>{i18nText(showJournalNavigation && <Link href={i18nHref("/blog")}>{i18nText("Pausa do caf\u00E9 \u2197")}</Link>)}<Link href={i18nHref("/contato")}>{i18nText(english ? 'Contact' : 'Contato')}{i18nText(" \u2197")}</Link><Link href={i18nHref("/privacidade")}>{i18nText(english ? 'Privacy' : 'Privacidade')}</Link></nav><div><a href={i18nHref(`mailto:${site.email}`)}>{i18nText(site.email)}{i18nText(" \u2197")}</a><SocialLinks variant="text"/></div></div>
    <div className="footer-base"><Link href={i18nHref("/")} className="wordmark">{i18nText("M\u00C1RIO SERAFIM")}</Link><span>{i18nText(english ? 'Art direction & visual identity · Fortaleza, Brazil' : 'Direção de arte & identidade visual · Fortaleza, Brasil')}{i18nText(" \u00B7 \u00A9 ")}{i18nText(new Date().getFullYear())}</span></div>
    <WhatsAppFloating />
  </footer>;
}
export function MotionObserver() {
    useEffect(() => {
        const keyboard = () => { document.documentElement.dataset.input = 'keyboard'; };
        const pointer = () => { document.documentElement.dataset.input = 'pointer'; };
        document.addEventListener('keydown', keyboard, true);
        document.addEventListener('pointerdown', pointer, true);
        document.addEventListener('pointermove', pointer, { passive: true });
        return () => { document.removeEventListener('keydown', keyboard, true); document.removeEventListener('pointerdown', pointer, true); document.removeEventListener('pointermove', pointer); };
    }, []);
    return null;
}
