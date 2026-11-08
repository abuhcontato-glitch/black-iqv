# Onboarding Construcel — SPRINT contratado

A contratação e assinatura do SPRINT foram confirmadas pelo usuário. Reunião inicial confirmada: **segunda-feira, 09/11/2026, às 11h, online pelo Google Meet**, horário de Brasília (`America/Sao_Paulo`). O link e a duração do encontro não foram informados. A página não presume pagamento confirmado.

## Páginas e implantação

O build Vite tem três entradas HTML independentes, com CSS e roteadores separados:

- `index.html`: BLACK IQV, mantida no endereço existente.
- `construcel/index.html`: apresentação original da Construcel, incluindo link ONBOARDING.
- `construcel/onboarding/index.html`: acesso direto ao onboarding SPRINT.

No GitHub Pages atual, os endereços são:

- Apresentação: `https://abuhcontato-glitch.github.io/black-iqv/construcel/`
- Onboarding: `https://abuhcontato-glitch.github.io/black-iqv/construcel/onboarding/`

Os documentos da Construcel inicializam a rota por hash correspondente a seu `data-entry-route`, preservando acesso direto e recarga no Pages. As rotas antigas `#/construcel/*` e `#/onboarding` da raiz redirecionam para a entrada própria da Construcel. A raiz continua carregando `StudioMain.tsx`; as entradas Construcel carregam `main.tsx`. Não trocar a raiz de um cliente para publicar outro.

## Conteúdo e calendário

`src/Onboarding.tsx` e `src/Onboarding.css` apresentam escopo, reunião inicial, pauta, etapas, fluxo comercial, acessos, materiais, agenda editorial, anúncios, encontros, responsabilidades, resumo e dúvidas. São usadas imagens conceituais já presentes na apresentação da Construcel, com identificação nas legendas.

`src/onboardingData.ts` centraliza as datas e o conteúdo operacional:

- D0: 09/11/2026.
- Ciclo 1: 09/11 a 08/12/2026.
- Ciclo 2: 09/12/2026 a 07/01/2027.
- Ciclo 3: 08/01 a 06/02/2027.

São três ciclos de 30 dias corridos, totalizando 90 dias com contagem inclusiva. A janela é planejamento operacional; não determina vencimentos financeiros.

**Somente a reunião inicial tem data e horário confirmados.** Marcos, recebimento de materiais, gravações pela equipe da cliente, reuniões seguintes, publicações e ativação dos anúncios são propostas explícitas para alinhamento, dependentes dos acessos, materiais, verba e aprovação. O contrato não foi modificado para incluir captação presencial da agência.

Há exatamente oito publicações propostas por ciclo (24 no total), posteriores às respectivas janelas propostas de gravação pela cliente. As publicações reaproveitam os oito criativos mensais; não são 16 peças originais. As três reuniões incluem o kickoff, sem acrescentar reuniões semanais ao SPRINT.

A geração de `.ics` exporta apenas o kickoff confirmado, às 14h UTC / 11h de Brasília. Não inventa horário final nem duração. O texto segue CRLF e dobramento UTF-8 de linhas. O CSV inclui as propostas identificadas e não agenda ou publica nada externamente.

Para inserir o link do Meet, atualizar `onboarding.meetUrl`. Não criar um código fictício. Se o link for informado, atualizar também a descrição do calendário e o FAQ correspondente.

## Estado local e limites

A checklist guarda somente marcações booleanas neste navegador. Ela não comprova concessão de acesso, não envia solicitações e não é uma base compartilhada. A página não recebe senhas ou tokens. As anotações não são persistidas; o usuário pode revisar, copiar ou baixar o resumo. Nenhum e-mail, mensagem, evento externo, anúncio ou publicação é enviado automaticamente.

## Validação

- `npm test`: 23 testes, incluindo cinco testes de calendário, escopo da agenda e exportações.
- `npm run build -- --base=/black-iqv/`: build de todas as entradas.
- Navegador: abertura direta, recarga, navegação desde a Construcel, preservação da BLACK IQV, imagens, checklist local, abas com oito publicações, downloads reais ICS/CSV, resumo, clipboard e menu móvel.
- Larguras de 320, 390, 768 e 1440px; tabela possui rolagem própria. Sem erros de JavaScript.
