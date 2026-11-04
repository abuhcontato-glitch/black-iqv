# BLACK IQV — storyboards de pré-produção

A página ativa é `src/StudioMain.tsx`. A campanha fica em `/`, a listagem em `/filmes` e cada filme em `/filmes/01` a `/filmes/05`. O build com uma base diferente de `/` usa rotas por hash para GitHub Pages.

## Organização visual

O planejamento enviado pelo usuário define cinco filmes, dez sequências por filme e três quadros por sequência: 50 pranchas e 150 enquadramentos. Os prompts de origem e as descrições em português estão em `src/studio/data/storyboard-plan.json`.

As pranchas ficam em `public/black-iqv/filme-NN-etapa/FNN-SNN.png`. O manifesto `src/studio/data/storyboard-images.json` associa cada identificador à imagem existente. Os arquivos gerados são mantidos inteiros; a página mostra os três painéis individualmente por posicionamento CSS, na ordem esquerda, centro e direita. As três exibições reutilizam o mesmo arquivo em cache.

As imagens são visualizações conceituais geradas por IA a partir das referências enviadas. Não representam captação real, telas aprovadas de uma plataforma, resultados comerciais ou aprovação da cliente. Nenhum clone ou serviço do Google Veo foi acessado. Não há valores, bônus ou condições comerciais inventados nas imagens.

O planejamento visual posterior difere do roteiro original em algumas sequências. Os títulos e descrições visuais são apresentados separadamente, preservando as falas originais para revisão criativa. A aba Roteiro mantém a versão anterior. As lentes dos quadros são sugestões de planejamento, não metadados de captação real.

## Desenvolvimento e verificação

Node.js 24 e npm 11. Na raiz do checkout:

```sh
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
npm run dev -- --port 5173 --strictPort
npm test
npm run build
```

Os testes de assets verificam as 50 sequências, seus 150 descritores e a existência das imagens PNG associadas. As telas de sequência e storyboard completo permitem abrir um quadro e navegar com as setas; Escape fecha a ampliação. Fontes e imagens são locais. Aprovação e comentários continuam sem persistência, conforme o projeto recebido.

O workflow de Pages deriva a base do nome atual do repositório (`github.event.repository.name`), mantendo compatibilidade antes e depois da renomeação. O repositório foi renomeado no GitHub para `black-iqv`; a URL de destino é `https://abuhcontato-glitch.github.io/black-iqv/`. Uma nova execução após a renomeação recebe o nome atualizado no evento de publicação.

Para conferir esse destino localmente, use `npm run build -- --base=/black-iqv/` e depois `npm run preview -- --base=/black-iqv/ --port 4173 --strictPort`. A base do preview precisa coincidir com a do build.

Publicação não ocorre automaticamente nesta tarefa. O workflow existente de GitHub Pages só executa quando acionado remotamente.
