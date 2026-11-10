# BLACK IQV — Director’s Cut

A página ativa agora apresenta a campanha BLACK IQV do projeto enviado pelo usuário, com cinco filmes e storyboards cinematográficos. Consulte [os detalhes de organização e desenvolvimento](docs/BLACK-IQV-STORYBOARDS.md).

O repositório agora se chama `black-iqv`. O endereço de destino da campanha é `https://abuhcontato-glitch.github.io/black-iqv/`. O workflow usa o nome atual do repositório automaticamente; o deploy após a renomeação atualiza os arquivos nesse caminho.

A apresentação da Construcel foi restaurada em uma entrada própria, com o novo **ONBOARDING do SPRINT contratado**. Reunião inicial: **09/11/2026 às 11h, online pelo Google Meet, horário de Brasília**. [Abrir onboarding](https://abuhcontato-glitch.github.io/black-iqv/construcel/onboarding/) · [Documentação](docs/ONBOARDING-CONSTRUCEL.md). As demais datas são propostas para alinhamento.

A documentação original da Construcel está abaixo.

---

# ABUHSCA × CONSTRUCEL

Fase 01 da experiência comercial. React, TypeScript, Tailwind CSS e Vite.

## Desenvolvimento
Requer Node.js 24 e npm 11 (versões usadas na validação).

```sh
cd /workspace/abuhsca
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
npm run dev -- --port 5173
```

```sh
npm run build
npm test
```

Abra a rota `/construcel` no navegador do ambiente de desenvolvimento. O servidor de produção deve fazer fallback das rotas da aplicação para `index.html`. Não usar o servidor Vite de desenvolvimento como produção.

Leia `docs/ARQUITETURA.md` e `docs/BRIEFING.md` antes de desenvolver as próximas fases. As seções 02 e 03 agora apresentam Maike e a metodologia; as seções 04–10 continuam em desenvolvimento com prévias visuais. Nenhuma integração externa está ativa. SPRINT aparece abaixo da MARATONA após clicar em Liberar SPRINT; esse controle é visual, não autenticação. Proteção efetiva de dados dependerá de backend. Não há pagamentos, assinatura ou onboarding liberados.

Configure a data real em `src/config.ts` somente após confirmação. O contador fica desativado enquanto a data não for definida. Nomes de marcas são tipográficos provisórios, não logos oficiais. Não inserir segredos no código ou em variáveis VITE_.

## Publicação no GitHub Pages
O workflow `.github/workflows/pages.yml` publica a branch `main` após testes e build. No GitHub, selecione Settings → Pages → Build and deployment → Source: GitHub Actions. Reexecute o workflow Publicar no GitHub Pages caso a primeira execução tenha ocorrido antes dessa seleção.

Build para Pages: `npm run build -- --base=/abuhsca/`. Nesse destino a aplicação usa rotas por hash para suportar acesso direto e atualização de página sem servidor de fallback. URL prevista, a confirmar após deploy: `https://abuhcontato-glitch.github.io/abuhsca/#/construcel`.

A página será pública, incluindo os arquivos de mídia e o conteúdo SPRINT no bundle. O botão Liberar SPRINT apenas controla a exibição e não oferece confidencialidade. Não há pagamentos ativos. O site ainda é uma apresentação em desenvolvimento.

## Ofertas comerciais
A MARATONA agora possui seção de investimento e revisão de contratação em `/construcel/contratacao/maratona`. A SPRINT tem página completa em `/construcel/sprint`, acessada por Liberar SPRINT no final da proposta principal, e revisão independente em `/construcel/contratacao/sprint`. A liberação é visual, sem autenticação de servidor. As páginas permitem revisar preços, escopo e condições; pagamentos, assinatura e onboarding ainda não estão integrados. Conteúdo e valores da MARATONA estão em `src/config.ts`; comparação e conteúdo SPRINT em `src/Sprint.tsx`.

Os valores e escopos atuais estão em `src/config.ts` e `docs/PROPOSTAS-COMERCIAIS-ATUAIS.md`: MARATONA R$ 8.500/mês + R$ 12.000 por 12 meses (R$ 114.000); SPRINT R$ 2.500/mês por três meses (R$ 7.500), sem implantação adicional para landing page e CRM simples e padronizados. Substituem condições anteriores.

## Tecnologia prevista
A seção de integrações agora detalha ferramentas recomendadas e reservas estimadas adicionais à agência/mídia: SPRINT a dimensionar após ampliação do escopo; MARATONA R$ 205–705/mês, referência preliminar a revisar. São premissas não verificadas, condicionadas a orçamento e aprovação. Nenhuma assinatura ou integração foi ativada. Não publicar planejamento financeiro interno da agência no site público.

O SPRINT — 90 DIAS é uma alternativa revisada de aquisição e orçamentos, com escopo delimitado e concordância expressa necessária de Ana Paula. A operação completa permanece na MARATONA — OPERAÇÃO 360°. Veja `docs/PROPOSTAS-COMERCIAIS-ATUAIS.md`.

A seção de investimento agora permite escolher o plano, selecionar serviços extras sob orçamento e copiar/baixar uma solicitação comercial. Os adicionais são separados por plano; entregas incluídas não são cobradas novamente. Não há contato ou contratação automática. Catálogo e cálculos em `src/commercial.ts`; relatório e pendências em `docs/INTERATIVIDADE-COMERCIAL.md`. Os testes usam Node.js 22.18+ (suporte nativo a TypeScript nos testes comerciais); ambiente validado com Node.js 24.

A escolha após a apresentação agora é SPRINT, TRAÇÃO e MARATONA. TRAÇÃO é a nova oferta intermediária proposta, com produção presencial e acompanhamento comercial, por R$ 5.500/mês, com seis meses propostos (R$ 33.000 em honorários). A calculadora não aparece mais como modalidade; permanece para adicionais na seção comercial. Escopo centralizado em `tractionOffer` (`src/config.ts`).

Fluxo vigente: `/construcel` apresenta a agência e três botões. Cada botão abre uma proposta completa e independente: `/construcel/sprint` (R$ 2.500/mês), `/construcel/tracao` (R$ 5.500/mês) e `/construcel/maratona` (R$ 8.500/mês). Os três documentos e suas revisões preservam identidade, faixas, demonstrações e orçamento de adicionais, com valores isolados por rota. Não há gate visual adicional no SPRINT.

As três propostas agora exibem apenas o plano fechado: entregas, condições, mensalidade, prazo, implantação e total. Calculadoras, seleção de adicionais e pedidos de serviços avulsos foram retirados das propostas e revisões. Os valores continuam SPRINT R$ 2.500/mês por 90 dias, TRAÇÃO R$ 5.500/mês por seis meses e MARATONA R$ 8.500/mês por 12 meses.

Agora são cinco propostas individuais: BASE R$ 500/mês e ARRANQUE R$ 1.500/mês (ambos com ciclo inicial proposto de 30 dias), além de SPRINT, TRAÇÃO e MARATONA. Escopos atuais em `docs/PROPOSTAS-COMERCIAIS-ATUAIS.md`; a TRAÇÃO inclui site oficial e chatbot, e o SPRINT inclui landing pages conforme alinhamento de escopo.

A MARATONA possui uma demonstração clicável de 11 módulos, acessível pelo menu “A operação”. CRM, atendimento, automação, chatbot, prévia de IA, conteúdo, landing page, formulário, agenda, segmentação e mapeamento funcionam com dados fictícios locais. Detalhes em `docs/DEMONSTRACAO-MODULOS.md`.

### Aplicativo de onboarding Construcel

O onboarding agora inclui dez etapas, anexos/links, salvamento local, revisão e exportação ZIP. [Documentação e estado da implantação](docs/PLATAFORMA-ONBOARDING-CONSTRUCEL.md). O [backend privado](server/onboarding/README.md) foi criado e testado; o recebimento em produção exige hospedá-lo e configurar `ONBOARDING_API_URL` no build do GitHub Pages. Sem essa configuração, a página informa o modo local e não simula envio.

### Instalação na HostGator / cPanel

Domínio informado: `abuhsca.com.br`. A [variante PHP](server/hostgator/README.md) dispensa Node/Docker na hospedagem e mantém dados criptografados fora de `public_html`. `npm run package:hostgator` gera um pacote **privado de primeira instalação**, com convites, para extrair na pasta inicial da conta cPanel. Não alterar DNS/e-mail nem publicar o ZIP. Destino planejado: `https://abuhsca.com.br/onboarding-construcel/`. Requer upload autenticado ao painel e validação antes de considerar o serviço instalado.

Download normal pelo navegador: https://abuhcontato-glitch.github.io/black-iqv/instalar-hostgator/ — preparar o instalador e salvar o ZIP. As credenciais do pacote final são geradas no navegador, não publicadas no GitHub Pages. O template público sem chaves nem convites fica no branch separado `hostgator-downloads`; o ZIP privado só é gerado no navegador.

### Consulta privada do dossiê recebido

A página `/dossie-construcel/` apresenta um snapshot criptografado dos documentos fornecidos pelo usuário. A abertura exige o link privado; a chave fica fora do repositório. Campos de credenciais são reservados e seus valores não integram a página. [Documentação de acesso, fontes e atualização](docs/DOSSIE-PRIVADO-CONSTRUCEL.md).
