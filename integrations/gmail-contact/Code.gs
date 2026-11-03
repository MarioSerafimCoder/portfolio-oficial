// Deploy as an Apps Script web app running as the owner. Set access to anyone
// only after reviewing the limited MailApp permission and the anti-abuse limits.
const DESTINATION = 'contato@marioserafim.com.br';

function doPost(event) {
  const p = event && event.parameter ? event.parameter : {};
  const token = String(p.token || '').replace(/[^a-f0-9-]/gi, '').slice(0, 40);
  const result = (status, message) => HtmlService
    .createHtmlOutput('<!doctype html><meta charset="utf-8"><script>window.top.postMessage(' +
      JSON.stringify({source: 'mario-portfolio-contact', token: token, status: status, message: message}) +
      ', "*");</script>')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

  try {
    const name = String(p.name || '').trim().slice(0, 100);
    const email = String(p.email || '').trim().slice(0, 180);
    const type = String(p.type || '').trim().slice(0, 80);
    const whatsapp = String(p.whatsapp || '').replace(/[^0-9+ ()-]/g, '').slice(0,25);
    const area = String(p.industry || '').trim().slice(0,100);
    const budget = String(p.budget || '').trim().slice(0,100);
    const description = String(p.description || '').trim().slice(0, 1200);
    if (p.website) return result('rejected', 'Envio não aceito.');
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        !['Identidade visual', 'Branding', 'Direção de arte', 'Experiência digital', 'Quero entender as possibilidades'].includes(type) ||
        description.length < 20) return result('invalid', 'Revise os campos e tente novamente.');

    const lock = LockService.getScriptLock();
    if (!lock.tryLock(5000)) return result('retry', 'Muitas mensagens ao mesmo tempo. Tente em instantes.');
    try {
      const cache = CacheService.getScriptCache();
      const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, email.toLowerCase() + '\n' + type + '\n' + description);
      const key = 'lead-' + Utilities.base64EncodeWebSafe(digest).slice(0, 60);
      if (cache.get(key)) return result('sent', 'Mensagem já recebida.');
      const rateKey = 'email-' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, email.toLowerCase())).slice(0, 48);
      if (cache.get(rateKey)) return result('retry', 'Aguarde antes de enviar outra mensagem.');
      if (MailApp.getRemainingDailyQuota() < 1) return result('retry', 'O envio está indisponível no momento.');

      const body = [
        'Novo projeto recebido pelo portfólio de Mário Serafim', '',
        'Nome: ' + name, 'E-mail: ' + email, 'Tipo de projeto: ' + type,
        'WhatsApp: ' + whatsapp, 'Área: ' + area, 'Orçamento: ' + budget,
        '', 'Descrição:', description
      ].join('\n');
      MailApp.sendEmail({to: DESTINATION, subject: 'Novo projeto pelo portfólio — ' + type, body: body, replyTo: email, name: 'Portfólio Mário Serafim'});
      cache.put(key, 'sent', 600);
      cache.put(rateKey, 'recent', 60);
      forwardOpportunity({name: name, email: email, project_type: type, whatsapp: whatsapp, area: area, budget: budget, description: String(p.summary || description).trim().slice(0,1200), received_at: new Date().toISOString(), source: 'portfolio'});
      return result('sent', 'Mensagem enviada.');
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    console.error('contact_send_unconfirmed');
    return result('retry', 'Não foi possível confirmar o envio.');
  }
}

function doGet() {
  return HtmlService.createHtmlOutput('Canal de contato do portfólio Mário Serafim.');
}

// Configure only in Script Properties. No credential is exposed to the website.
function forwardOpportunity(payload) {
  try {
    const secret = PropertiesService.getScriptProperties().getProperty('LASTRO_OPPORTUNITIES_SECRET');
    if (!secret || secret.length < 32) { console.warn('opportunities_not_configured'); return; }
    payload.id = Utilities.getUuid();
    const raw = JSON.stringify(payload), timestamp = String(Date.now());
    const signed = timestamp + '\nPOST\n/integration/v1/opportunities\n' + raw;
    const signature = Utilities.computeHmacSha256Signature(signed, secret, Utilities.Charset.UTF_8).map(b => ('0' + ((b + 256) % 256).toString(16)).slice(-2)).join('');
    const response = UrlFetchApp.fetch('https://lastro.marioserafim.com.br/integration/v1/opportunities', {
      method: 'post', contentType: 'application/json', payload: raw, followRedirects: false,
      muteHttpExceptions: true, headers: {'X-Portfolio-Time': timestamp, 'X-Portfolio-Signature': signature}
    });
    if (response.getResponseCode() !== 200) console.warn('opportunities_delivery_failed:' + response.getResponseCode());
  } catch (_) { console.warn('opportunities_delivery_unavailable'); }
}
