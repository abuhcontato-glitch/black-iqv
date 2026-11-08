# Onboarding Construcel — SPRINT contratado

A contratação e assinatura do SPRINT foram confirmadas pelo usuário. Reunião inicial confirmada: **segunda-feira, 09/11/2026, às 11h, online pelo Google Meet**, horário de Brasília (`America/Sao_Paulo`). Meet confirmado: https://meet.google.com/dur-zzzs-mtj. Duração confirmada: 11h às 12h, Brasília. A página não presume pagamento confirmado.

## Páginas e implantação

O build Vite tem três entradas HTML independentes, com CSS e roteadores separados:

- `index.html`: BLACK IQV, mantida no endereço existente.
- `construcel/index.html`: apresentação original da Construcel, incluindo link ONBOARDING.
- `construcel/onboarding/index.html`: acesso direto ao onboarding SPRINT.

No GitHub Pages atual, os endereços são:

- Apresentação: `https://abuhcontato-glitch.github.io/black-iqv/construcel/`
- Onboarding: `https://abuhcontato-glitch.github.io/black-iqv/construcel/onboarding/`

Os documentos da Construcel inicializam a rota por hash correspondente a seu `data-entry-route`, preservando acesso direto e recarga no Pages. As rotas antigas `#/construcel/*` e `#/onboarding` da raiz redirecionam para a entrada própria da Construcel. O diagnóstico comercial, o contrato SPRINT 90 e a opção B da campanha também são preservados. A rota de onboarding já contratado não exige refazer o diagnóstico pré-venda. A raiz continua carregando `StudioMain.tsx`; as entradas Construcel carregam `main.tsx`. Não trocar a raiz de um cliente para publicar outro.

## Conteúdo e calendário

`src/Onboarding.tsx` e `src/Onboarding.css` apresentam escopo, reunião inicial, pauta, etapas, fluxo comercial, acessos, materiais, agenda editorial, anúncios, encontros, responsabilidades, resumo e dúvidas. São usadas imagens conceituais já presentes na apresentação da Construcel, com identificação nas legendas.

`src/onboardingData.ts` centraliza as datas e o conteúdo operacional:

- D0: 09/11/2026.
- Ciclo 1: 09/11 a 08/12/2026.
- Ciclo 2: 09/12/2026 a 07/01/2027.
- Ciclo 3: 08/01 a 06/02/2027.

São três ciclos de 30 dias corridos, totalizando 90 dias com contagem inclusiva. A janela é planejamento operacional; não determina vencimentos financeiros.

**Somente a reunião inicial tem data e horário confirmados.** O usuário pediu mês 1 de estruturação e mês 2 de veiculação. A página identifica esse faseamento como proposta para validação conjunta, pois o contrato já assinado prevê entregas mensais. Não altera o contrato nem exclui ou transfere cotas automaticamente. A visita de captação do mês 1 tem janela proposta em 23/11, 09h–11h, com local, deslocamento, duração, roteiro, responsáveis, entregas e eventuais custos a detalhar e acordar antes da execução, conforme o contrato existente. Não se torna pacote recorrente de visitas. A ilha de edição se limita às peças e edições simples previstas. Marcos, materiais, reuniões e entrada no ar continuam propostos e dependentes de acessos, dados, materiais, verba, aprovação e liberação técnica.

A fonte contratual mais recente é `src/sprint90.ts`, integrada do remoto antes da publicação: 12 pautas oficiais e 100 peças por ciclo (36 pautas e 300 peças em 90 dias), distribuídas entre Google Perfil da Empresa, Stories, Reels e feed do Instagram. Há também oito criativos de anúncios mensais, com possível reaproveitamento dos materiais. O calendário propõe 8 peças de feed, 4 Reels, 84 Stories e 4 publicações Google por ciclo; a divisão é proposta, não um desdobramento contratual fixo. As 12 pautas não são somadas às 100 peças. No mês 1, as 100 peças são plano de produção/aprovação sem datas de publicação. Nos meses 2 e 3, há janelas propostas. Meta e Google têm primeira ativação proposta em 09/12; a rotina de otimização começa após ativação. O calendário não promete desempenho perfeito nem resultados comerciais. O suporte inclui grupo exclusivo WhatsApp das 09h às 17h, horário de Brasília. As três reuniões incluem o kickoff, sem acrescentar reuniões semanais ao SPRINT.

A geração de `.ics` exporta apenas o kickoff confirmado, às 14h UTC / 11h de Brasília. Término confirmado às 15h UTC / 12h de Brasília e link do Meet incluídos. O texto segue CRLF e dobramento UTF-8 de linhas. O CSV inclui as propostas identificadas e não agenda ou publica nada externamente.

Para inserir o link do Meet, atualizar `onboarding.meetUrl`. Não criar um código fictício. Se o link for informado, atualizar também a descrição do calendário e o FAQ correspondente.

## Estado local e limites

A checklist guarda somente marcações booleanas neste navegador. Ela não comprova concessão de acesso, não envia solicitações e não é uma base compartilhada. A página não recebe senhas ou tokens. As anotações não são persistidas; o usuário pode revisar, copiar ou baixar o resumo. Nenhum e-mail, mensagem, evento externo, anúncio ou publicação é enviado automaticamente.

## Validação

- `npm test`: 40 testes, incluindo oito testes de calendário, escopo da agenda e exportações.
- `npm run build -- --base=/black-iqv/`: build de todas as entradas.
- Navegador: abertura direta, recarga, navegação desde a Construcel, preservação da BLACK IQV, imagens, checklist local, abas com 12 pautas, 100 peças e filtros por canal, downloads reais ICS/CSV, resumo, clipboard e menu móvel.
- Larguras de 320, 390, 768 e 1440px; tabela possui rolagem própria. Sem erros de JavaScript.

## Central de entrega e diagnóstico comercial

`src/OnboardingHandover.tsx` orienta convites para **abuhoficial@gmail.com**, e-mail informado pelo usuário, e uma pasta restrita criada pela cliente no Drive. Não há pasta de destino fornecida nem upload/backend: o fluxo efetivo é convidar nas plataformas, compartilhar a pasta e preparar e-mail (`mailto`) ou copiar o resumo para o grupo. A página deixa explícito que só a conferência da agência comprova recebimento e acesso. A pasta não é tornada pública pelo aplicativo.

Inclui domínio/DNS, hospedagem/CMS, Google Ads/Perfil/GA4/GTM/Search Console, Meta/Facebook, Instagram, WhatsApp, TikTok e CRM. TikTok entra como inventário/diagnóstico; sua gestão não é acrescida ao SPRINT. A estrutura Drive separa fotos, vídeos brutos/editados, criativos, planejamentos e relatórios. Dados solicitados: janeiro–outubro de 2026, últimos três meses fechados (agosto/setembro/outubro), novembro parcial separado, histórico 2025 se disponível, funil, receita, vendas, ticket, investimento, produtos, margem e capacidade de atendimento. CSV mensal vazio não inventa números. Solicita totais agregados sem dados pessoais de compradores.

O formulário usa apenas memória da aba. Links e observações entram no resumo local, nunca na URL pública nem no armazenamento persistente. A abertura da pasta exige URL HTTPS de pasta `drive.google.com`; senhas/códigos não são solicitados. Botões copiam e-mail/resumo, baixam checklist e modelo CSV e preparam e-mail para revisão e envio pela cliente. Testado em navegador com downloads reais, preenchimento, estados de acesso, URL inválida, clipboard e larguras 320/390/768/1440px.
