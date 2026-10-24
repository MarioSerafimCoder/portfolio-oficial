# Refinamento de interface e movimento — 24/10/2026

Implementação sobre `ca4f80e`, preservando projetos, autoria, integrações, rotas, metadados e estrutura editorial. A headline foi ajustada para **Identidade é percepção.**, conforme o briefing.

## Auditoria e decisões

| Antes | Depois | Por quê |
| --- | --- | --- |
| Hero centralizado e texto diferente do briefing | Composição tipográfica assimétrica, duas entradas coordenadas e CTA ancorado no grid | Hierarquia e identidade autoral |
| Entradas de até 1,5 s e valores de movimento dispersos | Tokens de 140/220 ms para respostas e 440–720 ms para apresentações | Ritmo consistente e respostas rápidas |
| Menu com temporizador de fechamento | Spring amortecida, preservando velocidade, com cancelamento e navegação imediata | Evitar transições com saltos e espera de teclado |
| Cards dependentes de transições CSS longas | Spring na imagem, títulos e legendas progressivos; Rooftop/Simetria com mais presença tipográfica | Dar protagonismo aos cases |
| Opacidade reduzida em todo card fora da tela | Texto sempre em contraste pleno | Leitura disponível antes e durante a entrada |
| Erros só no envio do formulário | Validação ao sair do campo, correção durante edição e preservação ao voltar | Reduzir esforço no contato |
| WhatsApp flutuante sobreposto no mobile | Atalho oculto enquanto CTA ou formulário já estão visíveis | Não cobrir ações de conversão |

## Aplicação das skills

Foram lidas integralmente `F:/lastro/.agents/skills/apple-design/SKILL.md` e `F:/lastro/.agents/skills/emil-design-eng/SKILL.md`.

- Apple: spring criticamente amortecida com conservação de velocidade ao redirecionar, feedback no pressionamento, escalas tipográficas adaptáveis e respeito a movimento reduzido.
- Emil: propósito e frequência de cada efeito, curvas ease-out fortes, stagger curto, resposta instantânea de teclado, hover restrito a mouse e animação por transform/opacity. Sem biblioteca adicional.
- Referências consultadas: [COLLINS](https://wearecollins.com/) e [PORTO ROCHA](https://portorocha.com/). A composição e a ênfase editorial foram interpretadas para a identidade existente, sem copiar layouts.
- Não foram introduzidas transições compartilhadas experimentais: listagem e detalhes têm enquadramentos diferentes. A entrada discreta da página mantém continuidade sem atrasar o roteamento.

## Componentes

Home e estilos compartilhados; Header/MotionObserver; ProjectCard e hook de spring; ContactForm; ThemeToggle; ProcessSteps; ScrollHighlight; WhatsAppFloating. As páginas Sobre e cases aproveitam o observador comum. Backend de contato e conteúdo dos projetos não foram alterados.

## Validação

- TypeScript e build de produção aprovados (25 páginas geradas).
- 27 testes passaram, incluindo amortecimento a 30/60/120 fps e retargeting sem salto de velocidade.
- 90/90 verificações de rotas e arquivos passaram.
- Revisão em navegador: 320, 390 e 1440 px, claro/escuro, menu, Escape/retorno do foco, filtros, índice/galeria, Rooftop/Simetria, formulário e preservação dos campos ao voltar. Nenhum envio real foi realizado.
- Lighthouse local, mobile: performance 76, acessibilidade 100, boas práticas 100, SEO 100; CLS 0, TBT 30 ms. LCP 6,8 s na simulação móvel do servidor local sem compressão.
- Lighthouse local, desktop, com sinal de movimento reduzido: performance 97, demais categorias 100; LCP 1,2 s, CLS 0, TBT 0 ms.
- Referência anterior no domínio oficial: performance mobile 84, acessibilidade 97, LCP 4,2 s, CLS 0, TBT 40 ms. Valores locais e hospedados não são diretamente comparáveis. A verificação de produção deve ser repetida após o deploy automático do Cloudflare Pages.
- Testes em viewport não substituem avaliação em aparelho físico. Lighthouse é diagnóstico de laboratório, não medição de usuários reais.
