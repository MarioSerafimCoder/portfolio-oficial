# Sobre — redesign editorial local

A página `/sobre` apresenta a trajetória como narrativa pessoal: origem no marketing, método de trabalho, quatro credenciais selecionadas e passagem para os projetos. A antiga rota `/trajetoria` responde com 308 para `/sobre`. O menu e o rodapé têm apenas a entrada **Sobre**; o sitemap aponta para a rota canônica. Publicação pendente de aprovação visual do usuário.

## Fontes e limites

O currículo fornecido pelo usuário (`C:/Users/MarioSerafimdaSilvaN/Downloads/Currículo - Mário Serafim (1).pdf`) sustenta a pós-graduação em Direção de Arte (Anhanguera, 2021), graduação em Marketing (Wyden/Fanor, 2015), UX/UI Design (EBAC, 2021), User Experience (Belas Artes, 2022), desenvolvimento web com JavaScript (Digital College, 2024) e atuação nos setores de educação, esporte e rochas naturais. A participação como palestrante no Git Together, sobre UX Design para desenvolvedores, já constava da verificação de conteúdo do projeto. O briefing fornecido pelo usuário orientou o texto em primeira pessoa.

Foi feita uma busca no projeto por “Adobe” e “certificação”. Não há nome oficial, produto, nível ou validação de uma certificação Adobe. O código registra essa pendência e a página não apresenta a credencial como confirmada.

## UI e validação

Composição tipográfica assimétrica, divisórias sutis, fontes e tokens existentes, vermelho #E50914 como acento. Não há timeline, filtros, datas de empregos, acordeões ou formulário duplicado. A página é um Server Component, sem JavaScript novo para a narrativa; respeita a preferência por movimento reduzido do sistema global.

Build e 9 testes automatizados passaram. Verificações visuais feitas a 390, 768 e 1440 px em tema escuro, além de prévia em tema claro. Não houve largura de documento maior que a viewport nas três medidas. `/trajetoria` respondeu 308 com `Location: /sobre`.

No Chrome, uma extensão adicionou um atributo ao `body` antes da hidratação e o Next dev mostrou um aviso. O atributo aparece explicitamente no diff do aviso; não foi causado pela página Sobre.
