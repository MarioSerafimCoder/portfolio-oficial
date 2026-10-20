import {site} from '@/content/site';

export const socialLinks = [
  {name: 'Instagram', url: site.instagram, key: 'instagram'},
  {name: 'Behance', url: site.behance, key: 'behance'},
  {name: 'LinkedIn', url: site.linkedin, key: 'linkedin'},
].filter(item => item.url.trim());

export function whatsappLink(context: string) {
  const number = site.whatsapp.replace(/\D/g, '');
  if (!number) return '';
  return `https://wa.me/${number}?text=${encodeURIComponent(`Olá, Mário! Vi ${context} no seu portfólio e gostaria de conversar sobre um projeto.`)}`;
}
