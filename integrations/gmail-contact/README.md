# Envio de contato por Gmail

`Code.gs` é o serviço de envio do formulário. Ele usa apenas a permissão de envio do Google Apps Script (`MailApp`), envia exclusivamente para o endereço profissional fixo no código e responde ao site por `postMessage` após o envio. A página do portfólio não armazena leads nem chaves de acesso.

Implantado em 19/10/2026 no projeto [Contato — Portfólio Mário Serafim](https://script.google.com/home/projects/1uJIe9d1DMCne1HOdwAvfQJmPeqMPzpw8Y9gCGWvvJmKRxN5skf7v_BTx/edit), versão 1, como aplicativo da Web executado na conta do proprietário e acessível a qualquer pessoa. A URL pública `/exec` já consta como padrão em `src/components/contact.tsx`; `NEXT_PUBLIC_CONTACT_ENDPOINT` permite substituí-la em outro ambiente. Uma mensagem de teste recebeu resposta positiva e foi localizada no Gmail de destino. Uma entrada inválida foi rejeitada e uma repetição idêntica foi deduplicada. O envio pelo formulário no navegador da nova versão ainda precisa de verificação visual.

Para manutenção: editar `Code.gs` no projeto vinculado, criar **nova versão** da implantação Web e testar novamente antes de atualizar o endereço caso ele mude. O destinatário permanece fixo no código e só deve ser alterado com autorização do proprietário.

O endpoint público aceita mensagens de visitantes anônimos, por isso inclui campos limitados, honeypot, limite por remetente e deduplicação. Esses controles reduzem abuso, mas não substituem uma proteção de reputação/CAPTCHA caso haja spam. Se a integração não estiver ativa, o site oferece um rascunho de e-mail como alternativa e nunca mostra confirmação de entrega.
