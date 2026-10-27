export function briefingText({name,email,type,description,budget='',whatsapp='',industry=''},locale='pt') {
  if(locale==='en')return `Hi, Mário!\n\nMy name is ${name}.\nReply email: ${email}\nProject type: ${englishProjectType(type)}\nIndustry: ${industry || 'Not provided'}\nEstimated investment: ${budget || 'Not provided'}\nWhatsApp: ${whatsapp || 'Not provided'}\n\n${description || "I'd rather discuss the details."}\n\nSent from Mário Serafim's portfolio.`;
  return `Olá, Mário!\n\nMeu nome é ${name}.\nE-mail de retorno: ${email}\nTipo de projeto: ${type}\nÁrea de atuação: ${industry || 'Não informada'}\nInvestimento previsto: ${budget || 'Não informado'}\nWhatsApp: ${whatsapp || 'Não informado'}\n\n${description || 'Prefiro conversar sobre os detalhes.'}\n\nEnviado a partir do portfólio Mário Serafim.`;
}
// Preserve the contract of the deployed Apps Script, including its type allowlist
// and minimum description length. Optional fields travel in the email body.
export function deliveryPayload(data, origin, submittedAt = new Date().toISOString()) {
  const types = {'Site ou experiência digital':'Experiência digital','Ainda não tenho certeza':'Quero entender as possibilidades'};
  return {name:data.name.trim(), email:data.email.trim(), type:types[data.type] || data.type,
    description:[`Solicitação: ${data.type}`, `Área de atuação: ${data.industry || 'Não informada'}`, `Investimento previsto: ${data.budget || 'Não informado'}`,
      `WhatsApp: ${data.whatsapp || 'Não informado'}`, '', data.description.trim() || 'Prefiro conversar sobre os detalhes.',
      '', `Data do contato: ${submittedAt}`, `Origem: ${origin}`].join('\n')};
}
const englishProjectType=type=>({'Identidade visual':'Visual identity','Branding':'Branding','Direção de arte':'Art direction','Site ou experiência digital':'Website or digital experience','Ainda não tenho certeza':"I'm not sure yet"}[type]||type);
export function mailtoDraft(data, recipient,locale='pt') {
  return `mailto:${recipient}?subject=${encodeURIComponent(locale==='en'?`New project — ${englishProjectType(data.type)}`:`Novo projeto — ${data.type}`)}&body=${encodeURIComponent(briefingText(data,locale))}`;
}
export function emlDraft(data,recipient,locale='pt') {
  const subject = locale==='en'?`New project - ${englishProjectType(data.type)}`:`Novo projeto - ${data.type}`;
  return `To: ${recipient}\r\nSubject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=\r\nX-Unsent: 1\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n${briefingText(data,locale).replace(/\n/g,'\r\n')}`;
}
