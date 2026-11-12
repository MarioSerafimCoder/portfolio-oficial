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
    return <main id="conteudo" className="privacy-page section-wrap"><span className="eyebrow">{i18nText("Privacidade / Atualizada em 3 de novembro de 2026")}</span><h1>{i18nText("Uma conversa")}<br />{i18nText("com ")}<em>{i18nText("respeito.")}</em></h1>
  <section><h2>{i18nText("O que voc\u00EA compartilha")}</h2><p>{i18nText("O formul\u00E1rio de contato solicita nome, e-mail e tipo de projeto. \u00C1rea de atua\u00E7\u00E3o, telefone ou WhatsApp, faixa de investimento e descri\u00E7\u00E3o s\u00E3o opcionais. A data e a p\u00E1gina de origem acompanham a mensagem para contextualizar a solicita\u00E7\u00E3o.")}</p></section>
  <section><h2>{i18nText("Para que uso esses dados")}</h2><p>{i18nText("Uso as informa\u00E7\u00F5es do contato para responder, entender o projeto e dar continuidade \u00E0 conversa. A mensagem \u00E9 encaminhada por Google Apps Script e recebida no Zoho Mail. O Google processa o envio conforme sua ")}<a href={i18nHref("https://policies.google.com/privacy")} target="_blank" rel="noopener noreferrer">{i18nText("pol\u00EDtica de privacidade ")}<span className="sr-only">{i18nText("(abre em nova aba)")}</span></a>{i18nText(", e o Zoho armazena a mensagem recebida conforme sua ")}<a href={i18nHref("https://www.zoho.com/privacy.html")} target="_blank" rel="noopener noreferrer">{i18nText("pol\u00EDtica de privacidade ")}<span className="sr-only">{i18nText("(abre em nova aba)")}</span></a>{i18nText(".")}</p></section>
  <section><h2>{i18nText("Acompanhamento privado do projeto")}</h2><p>{i18nText("Após o envio do e-mail, os dados essenciais do pedido também são encaminhados ao Lastro, meu painel privado hospedado na Cloudflare, para acompanhar a conversa, proposta e próximo contato. O acesso é restrito ao administrador. A retenção padrão é de 365 dias a partir do recebimento, com exclusão na próxima consulta ou entrada de contato; o prazo pode ser ajustado conforme a necessidade do projeto. Você pode solicitar acesso, correção ou exclusão pelo e-mail abaixo. Seus dados comerciais não são inscritos na newsletter e não geram mensagens comerciais automáticas.")}</p></section>
  <section><h2>{locale==='en'?'Blog comments':'Comentários no blog'}</h2>
    <p>{locale==='en'
      ? 'When you comment, I record the name or nickname you enter, your text, the article and the submission time. A person reviews each comment before publishing the name, text and approval date. The system does not ask for your email.'
      : 'Ao comentar, registro o nome ou apelido que você informa, seu texto, o artigo e a data de envio. Uma pessoa revisa cada comentário antes de publicar o nome, o texto e a data de aprovação. O sistema não pede seu e-mail.'}</p>
    <p>{locale==='en'
      ? 'Cloudflare Turnstile helps prevent spam. The blog uses a temporary code derived from the connection address to limit submissions. The comments database does not store the raw IP address. Rejected comments and spam are removed in routine maintenance, by default after 30 days. To request removal, email '
      : 'O Cloudflare Turnstile ajuda a prevenir spam. O blog usa um código temporário derivado do endereço da conexão para limitar envios. O banco de comentários não guarda o IP bruto. Comentários rejeitados e spam são removidos na manutenção de rotina, por padrão após 30 dias. Para pedir a remoção, escreva para '}
      <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
  </section>
  <section id="regras-da-conversa"><h2>{locale==='en'?'Conversation rules':'Regras da conversa'}</h2>
    <p>{locale==='en'
      ? 'Disagreement, thoughtful criticism, corrections and suggestions are welcome. Comments are reviewed by a person. Threats, harassment, personal abuse, discrimination, sharing private information, spam, abusive advertising and malicious links are prohibited.'
      : 'Discordâncias, críticas fundamentadas, correções e sugestões são bem-vindas. Os comentários passam por moderação humana. Ameaças, assédio, ataques abusivos, discriminação, exposição de dados privados, spam, propaganda abusiva e links maliciosos não são aceitos.'}</p>
  </section>
  <section><h2>{i18nText("Newsletter")}</h2><p>{i18nText("Se voc\u00EA escolher se inscrever, seu e-mail, o registro de consentimento (data e hora) e, quando disponibilizado pela hospedagem, o endere\u00E7o IP ser\u00E3o enviados \u00E0 Buttondown para confirmar a inscri\u00E7\u00E3o e avisar sobre novos artigos de Pausa do caf\u00E9. A confirma\u00E7\u00E3o \u00E9 feita por e-mail; a Buttondown administra a lista e inclui o descadastro nas mensagens. N\u00E3o mantenho uma lista paralela no site. Consulte a ")}<a href={i18nHref("https://buttondown.com/legal/privacy")} target="_blank" rel="noopener noreferrer">{i18nText("pol\u00EDtica de privacidade da Buttondown")}</a>{i18nText(". Para solicitar acesso ou exclus\u00E3o, escreva para o endere\u00E7o abaixo.")}</p></section>
  <section><h2>{i18nText("Cookies, m\u00E9tricas e prefer\u00EAncias")}</h2><p>{i18nText("As prefer\u00EAncias essenciais do site, como tema, idioma e sua escolha de privacidade, ficam guardadas no navegador e permanecem sempre ativas. ")}{i18nText(plausible ? 'Com sua permissão, o Plausible é carregado para medir visitas e interações.' : ga4 ? 'Com sua permissão, o Google Analytics 4 é carregado e pode usar cookies analíticos para medir visitas e interações.' : 'Nenhum serviço de métricas está ativo nesta versão.')}{i18nText(" Os eventos n\u00E3o incluem nome, e-mail, telefone nem o texto enviado pelo formul\u00E1rio.")}</p></section>
  <section><h2>{i18nText("Armazenamento e seus direitos")}</h2><p>{i18nText("O acompanhamento de pedidos no Lastro usa armazenamento privado na Cloudflare. As mensagens permanecem na caixa de e-mail enquanto forem necess\u00E1rias para a conversa ou obriga\u00E7\u00F5es aplic\u00E1veis. Para solicitar acesso, corre\u00E7\u00E3o ou exclus\u00E3o dos dados, escreva para ")}<a href={i18nHref(`mailto:${site.email}`)}>{i18nText(site.email)}</a>{i18nText(". Evite enviar informa\u00E7\u00F5es sens\u00EDveis pelo formul\u00E1rio.")}</p></section>
  <Link className="text-link" href={i18nHref("/contato")}>{i18nText("Entrar em contato \u2197")}</Link>
    </main>;
}
