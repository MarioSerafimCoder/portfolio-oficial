import type {Metadata} from 'next';
import Link from 'next/link';
import {site} from '@/content/site';
import {googleAnalyticsId,plausibleDomain} from '@/lib/analytics-config';

const newsletter=Boolean(process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT?.trim());
const plausible=Boolean(plausibleDomain);
const ga4=Boolean(googleAnalyticsId);
export const metadata:Metadata={title:'Privacidade e dados pessoais',description:'Como Mário Serafim usa os dados enviados pelo formulário de contato, pela newsletter e pelas métricas opcionais.',alternates:{canonical:'/privacidade'}};

export default function Privacy(){return <main id="conteudo" className="privacy-page section-wrap"><span className="eyebrow">Privacidade / Atualizada em 26 de outubro de 2026</span><h1>Uma conversa<br/>com <em>respeito.</em></h1>
  <section><h2>O que você compartilha</h2><p>O formulário de contato solicita nome, e-mail e tipo de projeto. Área de atuação, telefone ou WhatsApp, faixa de investimento e descrição são opcionais. A data e a página de origem acompanham a mensagem para contextualizar a solicitação.</p></section>
  <section><h2>Para que uso esses dados</h2><p>Uso as informações do contato para responder, entender o projeto e dar continuidade à conversa. A mensagem é encaminhada por Google Apps Script e recebida no Zoho Mail. O Google processa o envio conforme sua <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">política de privacidade <span className="sr-only">(abre em nova aba)</span></a>, e o Zoho armazena a mensagem recebida conforme sua <a href="https://www.zoho.com/privacy.html" target="_blank" rel="noopener noreferrer">política de privacidade <span className="sr-only">(abre em nova aba)</span></a>.</p></section>
  {newsletter&&<section><h2>Newsletter</h2><p>Se você se inscrever, nome (opcional), e-mail e consentimento serão enviados ao serviço configurado para a newsletter, somente para avisar sobre novos textos. Você pode solicitar o encerramento da inscrição pelo e-mail abaixo.</p></section>}
  <section><h2>Cookies, métricas e preferências</h2><p>As preferências essenciais do site, como tema, idioma e sua escolha de privacidade, ficam guardadas no navegador e permanecem sempre ativas. {plausible?'Com sua permissão, o Plausible é carregado para medir visitas e interações.':ga4?'Com sua permissão, o Google Analytics 4 é carregado e pode usar cookies analíticos para medir visitas e interações.':'Nenhum serviço de métricas está ativo nesta versão.'} Os eventos não incluem nome, e-mail, telefone nem o texto enviado pelo formulário.</p></section>
  <section><h2>Armazenamento e seus direitos</h2><p>O site não mantém banco próprio de contatos. As mensagens permanecem na caixa de e-mail enquanto forem necessárias para a conversa ou obrigações aplicáveis. Para solicitar acesso, correção ou exclusão dos dados, escreva para <a href={`mailto:${site.email}`}>{site.email}</a>. Evite enviar informações sensíveis pelo formulário.</p></section>
  <Link className="text-link" href="/contato">Entrar em contato ↗</Link>
</main>}
