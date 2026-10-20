'use client';

import {usePathname} from 'next/navigation';
import {whatsappLink} from '@/lib/site-links';
import {site} from '@/content/site';
import {trackEvent} from '@/lib/analytics';

export function WhatsAppLink({context, className = '', label = 'Conversar pelo WhatsApp'}: {context: string; className?: string; label?: string}) {
  const href = whatsappLink(context);
  if (!href) return null;
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer" aria-label="Conversar com Mário pelo WhatsApp (abre em nova aba)" onClick={() => trackEvent('whatsapp_click', {page: context})}>{label}<span aria-hidden="true">↗</span></a>;
}

export function BookingLink({className = ''}: {className?: string}) {
  if (!site.bookingUrl) return null;
  return <a className={className} href={site.bookingUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('booking_click')}>Agendar uma conversa de 20 min <span aria-hidden="true">↗</span><span className="sr-only">Abre em nova aba</span></a>;
}

export function WhatsAppFloating() {
  const path = usePathname();
  if (!site.whatsapp || path.startsWith('/blog')) return null;
  const context = path.startsWith('/projetos/') ? `o projeto ${path.split('/').pop()?.replace(/-/g, ' ')}` : path === '/sobre' ? 'a página Sobre' : 'seu trabalho';
  return <WhatsAppLink context={context} className="whatsapp-floating" label="WhatsApp"/>;
}
