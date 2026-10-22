# Evolução do portfólio — versão para revisão

19 de outubro de 2026 · Branch `feat/portfolio-evolution`

A versão 2 do site público [Mário Serafim — Portfólio](https://marioserafim.com.br/) foi ativada em 19/10/2026, após aprovação do usuário. A captura da página inicial pública anterior está em [`published-home.png`](screenshots/portfolio/published-home.png). As capturas da versão revisada em 390, 768, 1024 e 1440 px ainda não foram produzidas: a ferramenta de navegador bloqueou a prévia local nesta sessão. As capturas em `screenshots/portfolio/` anteriores a 19/10 pertencem à versão precedente.

## Páginas e conteúdo alterados

| Página | Alteração |
| --- | --- |
| Início `/` | Hero com “Marcas não nascem distintas. Tornam-se.”, texto de apoio e CTA para contato. Rooftop ocupa o destaque visual principal; showreel de três projetos entra depois do hero. A seleção seguinte prioriza Simetria, Amazonita, Eduardo Noronha e Amanda Araújo, sem repetir Rooftop. |
| Projetos `/projetos` | Ordem Rooftop → Simetria → Amazonita → Eduardo → Amanda. Cards trazem uma frase de contexto além do nome e disciplina; filtros e índice permanecem. |
| Cases `/projetos/[slug]` | Contexto, desafio, objetivo, papel de Mário, direção, sistema, galeria, resultado observável e créditos são visíveis. Resultados descrevem materiais entregues, sem alegar efeitos comerciais não documentados. Vídeos e legendas identificam visualizações geradas por IA. |
| Simetria `/projetos/simetria` | Novo case baseado em manual e aplicações fornecidos no Drive, com assinatura, paleta, tipografia, grafismos e mockups reais do acervo; ano não informado. Aplicações são rotuladas como visualizações. |
| Sobre `/sobre` | Processo aprovado em quatro etapas: Compreender, Direcionar, Construir, Consolidar; exemplo concreto baseado no manual Rooftop. |
| Serviços em Início e Sobre | Quatro áreas aprovadas com problema atendido e possíveis entregas no accordion existente. |
| Contato `/contato` | Formulário progressivo preservado; botão de envio direto vinculado ao Apps Script do Gmail, confirmação dependente de resposta positiva, token por envio, estado de espera, timeout, edição e fallback de e-mail/rascunho. |

As fontes editoriais continuam sendo os materiais do Drive fornecidos pelo usuário. Simetria foi examinada na [pasta do projeto](https://drive.google.com/drive/folders/15DDXgLVnMeC2vTscI9LBBboJ-FqHkvEW). Nenhuma métrica, depoimento ou cliente foi inventado. O texto de serviços e o processo foram aprovados pelo usuário em 19/10/2026.

## Vídeos e integração

Foram produzidos três clipes no Google Flow a partir de referências do acervo e um showreel montado com seus trechos. Arquivos, posters, referências e prompts efetivamente usados estão em [FLOW_PRODUCTION.md](FLOW_PRODUCTION.md). Os MP4 estão em [`public/media/motion`](../public/media/motion/). São carregados sob demanda, silenciosos e inline; o autoplay é restrito à mídia visível e desativado para preferência de movimento reduzido. O visitante tem controle de reprodução, e os posters preservam uma alternativa estática.

## Gmail e jornada comercial

O [Apps Script implantado](https://script.google.com/macros/s/AKfycbyulPLIGLCQKtFhvcvRvz69KwrZIc4S_2TcQNU-4rWDanoisOmVMlyoATYTnHx3pToU/exec) executa como a conta de Mário e está acessível a qualquer pessoa, conforme autorização expressa. O destinatário é fixo em `marioserafim.da@gmail.com`; validação, campo-isca, deduplicação, limitação por e-mail e consulta à cota do Gmail reduzem abuso. Uma mensagem técnica de teste recebeu resposta `sent` e foi localizada na caixa de entrada. Uma repetição idêntica retornou “Mensagem já recebida” e uma entrada inválida recebeu resposta de correção. O teste foi feito no endpoint; o percurso completo pelo navegador da nova página ainda não foi confirmado. O código e a instrução de manutenção estão em [`integrations/gmail-contact`](../integrations/gmail-contact/).

## Verificações e limites

- `npm run check`: passou.
- `npm test`: 2 testes de fallback de contato passaram.
- `npm run build`: passou, com 15 páginas estáticas geradas e cinco URLs de case.
- Validação visual nova em 390/768/1024/1440 px, teclado, dark mode e Lighthouse: **pendente** por bloqueio da prévia local no navegador desta sessão. A auditoria anterior ([relatório anterior](DELIVERY_REPORT.md)) mede a versão anterior e não foi reutilizada como métrica desta evolução.
- LCP, CLS, INP e notas Lighthouse da nova versão: **não medidos**. Os MP4 finais somam cerca de 3,04 MB e cada vídeo fora da primeira viewport usa poster e `preload="none"`; isso reduz carga inicial, mas não substitui medições reais.
- Safari/iOS e leitores de tela reais: não testados.

A implantação pública da versão 2 foi concluída com sucesso, e as páginas dos cases e os quatro arquivos de vídeo responderam HTTP 200 no endereço final. Ainda falta a inspeção visual em 390, 768, 1024 e 1440 px, o teste do formulário pelo próprio site e a medição Lighthouse; qualquer desvio encontrado deve gerar uma correção posterior.
