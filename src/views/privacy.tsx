import {createTranslator} from '@/i18n/translate';
import type {SiteLocale} from '@/i18n/routes';
import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/content/site';
import { googleAnalyticsId, plausibleDomain } from '@/lib/analytics-config';
const plausible = Boolean(plausibleDomain);
const ga4 = Boolean(googleAnalyticsId);
export const metadata: Metadata = { title: 'Privacidade e dados pessoais', description: 'Como Mário Serafim usa os dados enviados pelo formulário de contato, pela newsletter e pelas métricas opcionais.', alternates: { canonical: '/privacidade' } };
export default function Privacy({ locale = "pt" }: {
    locale?: SiteLocale;
} = {}) {
    const { i18nText, i18nHref } = createTranslator(locale);
    return <main id="conteudo" className="privacy-page section-wrap"><span className="eyebrow">{i18nText("Privacidade / Atualizada em 27 de outubro de 2026")}</span><h1>{i18nText("Uma conversa")}<br />{i18nText("com ")}<em>{i18nText("respeito.")}</em></h1>
  <section><h2>{i18nText("O que voc\u00EA compartilha")}</h2><p>{i18nText("O formul\u00E1rio de contato solicita nome, e-mail e tipo de projeto. \u00C1rea de atua\u00E7\u00E3o, telefone ou WhatsApp, faixa de investimento e descri\u00E7\u00E3o s\u00E3o opcionais. A data e a p\u00E1gina de origem acompanham a mensagem para contextualizar a solicita\u00E7\u00E3o.")}</p></section>
  <section><h2>{i18nText("Para que uso esses dados")}</h2><p>{i18nText("Uso as informa\u00E7\u00F5es do contato para responder, entender o projeto e dar continuidade \u00E0 conversa. A mensagem \u00E9 encaminhada por Google Apps Script e recebida no Zoho Mail. O Google processa o envio conforme sua ")}<a href={i18nHref("https://policies.google.com/privacy")} target="_blank" rel="noopener noreferrer">{i18nText("pol\u00EDtica de privacidade ")}<span className="sr-only">{i18nText("(abre em nova aba)")}</span></a>{i18nText(", e o Zoho armazena a mensagem recebida conforme sua ")}<a href={i18nHref("https://www.zoho.com/privacy.html")} target="_blank" rel="noopener noreferrer">{i18nText("pol\u00EDtica de privacidade ")}<span className="sr-only">{i18nText("(abre em nova aba)")}</span></a>{i18nText(".")}</p></section>
  <section><h2>{i18nText("Newsletter")}</h2><p>{i18nText("Se voc\u00EA escolher se inscrever, seu e-mail, o registro de consentimento (data e hora) e, quando disponibilizado pela hospedagem, o endere\u00E7o IP ser\u00E3o enviados \u00E0 Buttondown para confirmar a inscri\u00E7\u00E3o e avisar sobre novos artigos de Pausa do caf\u00E9. A confirma\u00E7\u00E3o \u00E9 feita por e-mail; a Buttondown administra a lista e inclui o descadastro nas mensagens. N\u00E3o mantenho uma lista paralela no site. Consulte a ")}<a href={i18nHref("https://buttondown.com/legal/privacy")} target="_blank" rel="noopener noreferrer">{i18nText("pol\u00EDtica de privacidade da Buttondown")}</a>{i18nText(". Para solicitar acesso ou exclus\u00E3o, escreva para o endere\u00E7o abaixo.")}</p></section>
  <section><h2>{i18nText("Cookies, m\u00E9tricas e prefer\u00EAncias")}</h2><p>{i18nText("As prefer\u00EAncias essenciais do site, como tema, idioma e sua escolha de privacidade, ficam guardadas no navegador e permanecem sempre ativas. ")}{i18nText(plausible ? 'Com sua permissão, o Plausible é carregado para medir visitas e interações.' : ga4 ? 'Com sua permissão, o Google Analytics 4 é carregado e pode usar cookies analíticos para medir visitas e interações.' : 'Nenhum serviço de métricas está ativo nesta versão.')}{i18nText(" Os eventos n\u00E3o incluem nome, e-mail, telefone nem o texto enviado pelo formul\u00E1rio.")}</p></section>
  <section><h2>{i18nText("Armazenamento e seus direitos")}</h2><p>{i18nText("O site n\u00E3o mant\u00E9m banco pr\u00F3prio de contatos. As mensagens permanecem na caixa de e-mail enquanto forem necess\u00E1rias para a conversa ou obriga\u00E7\u00F5es aplic\u00E1veis. Para solicitar acesso, corre\u00E7\u00E3o ou exclus\u00E3o dos dados, escreva para ")}<a href={i18nHref(`mailto:${site.email}`)}>{i18nText(site.email)}</a>{i18nText(". Evite enviar informa\u00E7\u00F5es sens\u00EDveis pelo formul\u00E1rio.")}</p></section>
  <Link className="text-link" href={i18nHref("/contato")}>{i18nText("Entrar em contato \u2197")}</Link>
    </main>;
}
