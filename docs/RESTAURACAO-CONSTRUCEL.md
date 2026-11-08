# Restauração de acesso — Construcel

Diagnóstico de 05/11/2026: o repositório antes chamado `abuhsca` foi renomeado para `black-iqv`, e a entrada principal de `index.html` foi trocada para `src/StudioMain.tsx`. O endereço antigo `https://abuhcontato-glitch.github.io/abuhsca/` retorna 404. A rota `#/construcel` da campanha atual também renderiza a campanha BLACK IQV, em vez da proposta.

A proposta original permanece em `src/main.tsx`. O build agora tem duas entradas independentes:

- Campanha: `index.html` → `src/StudioMain.tsx` (preservada).
- Propostas: `construcel/index.html` → `src/main.tsx`.

Endereço da proposta restaurada: `https://abuhcontato-glitch.github.io/black-iqv/construcel/#/construcel`.

O hash mantém os cinco planos, revisões, portfólio e Luxuosa dentro da entrada de propostas. Os ativos usam a base atual do repositório, calculada pelo workflow de Pages. Não houve alteração de valores, escopo ou condições.

Verificação: 18 testes, build com as duas entradas e Chromium na página inicial, cinco planos e suas cinco páginas de revisão; preços R$ 500 / 1.500 / 2.500 / 5.500 / 8.500, dez FAQs em cada plano, logo carregada, navegação sem erros de JavaScript e larguras de 390/1440 px. Entrada BLACK IQV preservada.

Para voltar ao domínio de caminho antigo `/abuhsca/`, seria necessário criar outro repositório com esse nome ou renomear o atual. A criação foi negada à integração (403), e renomear de volta afetaria a campanha, portanto não foi feito.
