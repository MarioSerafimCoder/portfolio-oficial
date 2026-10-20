export function briefingText({name,email,type,description,budget='',whatsapp=''}) {
  return `Olá, Mário!\n\nMeu nome é ${name}.\nE-mail de retorno: ${email}\nTipo de projeto: ${type}\nInvestimento previsto: ${budget || 'Não informado'}\nWhatsApp: ${whatsapp || 'Não informado'}\n\n${description || 'Prefiro conversar sobre os detalhes.'}\n\nEnviado a partir do portfólio Mário Serafim.`;
}
// Preserve the contract of the deployed Apps Script, including its type allowlist
// and minimum description length. Optional fields travel in the email body.
export function deliveryPayload(data, origin, submittedAt = new Date().toISOString()) {
  const types = {'Site ou experiência digital':'Experiência digital','Ainda não tenho certeza':'Quero entender as possibilidades'};
  return {name:data.name.trim(), email:data.email.trim(), type:types[data.type] || data.type,
    description:[`Solicitação: ${data.type}`, `Investimento previsto: ${data.budget || 'Não informado'}`,
      `WhatsApp: ${data.whatsapp || 'Não informado'}`, '', data.description.trim() || 'Prefiro conversar sobre os detalhes.',
      '', `Data do contato: ${submittedAt}`, `Origem: ${origin}`].join('\n')};
}
export function mailtoDraft(data, recipient) {
  return `mailto:${recipient}?subject=${encodeURIComponent(`Novo projeto — ${data.type}`)}&body=${encodeURIComponent(briefingText(data))}`;
}
export function emlDraft(data,recipient) {
  const subject = `Novo projeto - ${data.type}`;
  return `To: ${recipient}\r\nSubject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=\r\nX-Unsent: 1\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n${briefingText(data).replace(/\n/g,'\r\n')}`;
}
