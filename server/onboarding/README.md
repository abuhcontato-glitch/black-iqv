# Recebimento privado do onboarding Construcel

Backend novo, sem dependências npm, Node 24 + SQLite e armazenamento de arquivos em disco persistente. **O código está pronto; publicar o frontend no GitHub Pages não hospeda este servidor. Nenhum servidor público foi provisionado automaticamente.**

## Implantação concreta

Requer uma hospedagem que execute Node 24 ou Docker, disco persistente e HTTPS. Não usar disco efêmero nem pasta pública do site. Uma instância atende apenas a Construcel; outros clientes exigem instâncias/dados/convites separados.

1. Em máquina privada, na raiz do repositório, executar `node server/onboarding/create-invites.mjs`. Gera `onboarding-private.env` e `onboarding-invites-private.txt`, ambos ignorados pelo Git. Não substituir uma DATA_KEY existente: perder a chave impede recuperar os dados.
2. Guardar os dois convites em gerenciador seguro. Entregar somente o convite de cliente à cliente, e o de agência à agência. Eles permitem entrar no dossiê; nunca colocá-los no código, URL pública ou chat. Sessões duram 2 horas e não são persistidas pelo frontend. Para revogar, trocar o hash do convite e reiniciar o serviço.
3. Implantar com `docker compose -f server/onboarding/compose.yaml up -d --build`. O volume `onboarding-data` mantém SQLite e arquivos entre reinícios. A porta fica somente em `127.0.0.1:8080`.
4. Configurar o proxy HTTPS do provedor para essa porta. Definir `ALLOWED_ORIGIN=https://abuhcontato-glitch.github.io` (origem, sem caminho e sem barra final). Não expor HTTP puro à internet. `GET /health` confirma disponibilidade, sem dados do cliente.
5. Na configuração do build frontend, definir `VITE_ONBOARDING_API_URL=https://ENDERECO-REAL-DO-SERVIDOR` e republicar. No GitHub Actions, usar a variável de repositório `ONBOARDING_API_URL`, já referenciada pelo workflow. URL do endpoint não é segredo; os convites e DATA_KEY são.
6. Testar: cliente entra, salva rascunho, anexa arquivo e conclui entrega; agência entra em outro aparelho, carrega versão da nuvem e baixa o arquivo. Confirmar também bloqueio sem convite e persistência após reinício.

Sem configuração do endpoint, o aplicativo funciona com rascunho/arquivos locais e exportação ZIP. Mostra que o recebimento online está inativo e não simula um envio. Para ativar o recebimento real, falta conectar uma conta/hospedagem e configurar sua URL pública; o ambiente desta tarefa não possui essa conta nem credenciais de implantação.

## Fluxo e limites

- `POST /v1/login`: convite de alta entropia, comparação de hash em tempo constante, sessão opaca de 2 horas; limite de 10 tentativas por IP em 10 minutos. Atrás de proxy, o IP é o do proxy; não confiamos em cabeçalhos forjáveis de IP.
- `GET/PUT /v1/dossier`: cliente e agência da mesma Construcel. Respostas criptografadas AES-256-GCM; controle de versão `If-Match` evita sobrescrever alterações concorrentes. Todas as escritas posteriores retornam o dossiê a rascunho.
- `POST /v1/files`: categoria conhecida, até 50 MB/arquivo e 200 MB/dossiê. Identificador de arquivo torna retries idempotentes, validando conteúdo. Arquivos criptografados em repouso; metadados ficam no SQLite privado.
- `GET /v1/files/:id`: só com sessão válida; download binário com `nosniff` e `attachment`, sem executar SVG/HTML.
- `DELETE /v1/files/:id`: somente agência. A interface remove cópias locais; exclusão remota administrativa é uma operação separada.
- `POST /v1/submit`: dados essenciais, e-mail válido, confirmação explícita e versão corrente. Só retorna protocolo após gravação do estado entregue. O protocolo indica recebimento pelo servidor, não aprovação ou conferência de acessos.
- A agência usa o mesmo espaço: entra com seu convite, carrega a versão recebida, confere campos/pendências e baixa anexos/pacote. Não existe notificação automática por e-mail nesta versão.
- Campos de domínio/redes recebem identificadores e situação do convite, nunca senhas, tokens ou códigos de verificação das plataformas.

## Operação

Fazer backup consistente do volume com o serviço parado ou snapshot consistente do provedor, e guardar DATA_KEY separadamente. Testar restauração antes de usar com dados reais. Definir retenção, responsáveis e exclusão ao final do contrato. Monitorar disco, HTTPS e saúde; não registrar corpo de requisição, convites ou arquivos em logs. Não usar o volume temporário de uma sessão Codex como produção. A criptografia não substitui proteção da hospedagem, dos backups e dos convites.

Os testes automatizados exercitam o servidor real com diretório temporário: autenticação, CORS, controle de versão, criptografia, upload/download, reenvio idempotente, confirmação, leitura pela agência e persistência após reinício. Não substituem o teste da hospedagem final.
