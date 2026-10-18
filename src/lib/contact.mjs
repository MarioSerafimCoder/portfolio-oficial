export function briefingText({name,email,type,description}) {
  return `Olá, Mário!\n\nMeu nome é ${name}.\nE-mail de retorno: ${email}\nTipo de projeto: ${type}\n\n${description}\n\nEnviado a partir do portfólio Mário Serafim.`;
}
export function mailtoDraft(data, recipient) {
  return `mailto:${recipient}?subject=${encodeURIComponent(`Novo projeto — ${data.type}`)}&body=${encodeURIComponent(briefingText(data))}`;
}
export function emlDraft(data,recipient) {
  const subject = `Novo projeto - ${data.type}`;
  return `To: ${recipient}\r\nSubject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=\r\nX-Unsent: 1\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n${briefingText(data).replace(/\n/g,'\r\n')}`;
}
