# HostGator cPanel — onboarding Construcel

A zona DNS enviada pelo usuário identifica `abuhsca.com.br` no cPanel HostGator. Ela não fornece autenticação ao painel nem confirma a versão PHP, SSL, limites ou pasta raiz. Não alterar A/MX/TXT/DKIM/SPF para esta instalação. O caminho planejado é **https://abuhsca.com.br/onboarding-construcel/**, dentro do site atual.

## Download pelo navegador

Página de download: https://abuhcontato-glitch.github.io/black-iqv/instalar-hostgator/

Clicar **Preparar instalador** e depois **Salvar ZIP no computador**. A página baixa somente um template público sem credenciais e gera convites/chave com Web Crypto no navegador do titular. O ZIP final privado é montado localmente, preservando os arquivos comprimidos originais. Chave e convites não são enviados ao servidor. O template base sozinho não é um instalador completo. Usar o ZIP final gerado, em uma primeira instalação, conforme os passos abaixo.

O template público sem credenciais fica no branch separado `hostgator-downloads`, em `base.zip`, para evitar incluir o instalador grande no artefato do GitHub Pages. A página baixa o arquivo público por raw.githubusercontent.com e gera as credenciais localmente. Para atualizar o instalador, gerar novamente com `scripts/build-public-hostgator.mjs --output /pasta-temporaria/base.zip` e atualizar esse branch, preservando o histórico. Testes verificam download real, integridade ZIP, hashes de convites, permissões privadas e ausência de POST/exfiltração de convites.

## Pacote de primeira instalação

Executar na raiz do repositório, com Node 24, npm e Python:

```sh
npm run package:hostgator
```

Gera um ZIP **privado**, ignorado pelo Git, em `deploy-artifacts/hostgator-construcel-DATA/`. Contém somente:

- `public_html/onboarding-construcel/`: aplicativo compilado, assets, imagens da Construcel e API PHP.
- `abuhsca-onboarding-private/`: configuração, chave de criptografia, hashes dos convites e instruções. Essa pasta fica na pasta inicial da conta, **fora de public_html**.

Os convites de cliente e agência são fortes, distintos e gerados por instalação. Não aparecem no terminal. O arquivo `CONVITES-PRIVADOS.txt` fica na pasta privada. **Não enviar o ZIP à cliente, não publicar em release público nem subir o ZIP para public_html.**

## Instalar pelo Gerenciador de Arquivos

1. Abrir **Gerenciador de Arquivos → pasta inicial da conta**, um nível acima de `public_html` (normalmente `/home/USUARIO`).
2. Verificar se `public_html/onboarding-construcel` ou `abuhsca-onboarding-private` já existem. Se existirem, preservar e revisar antes de substituir. Este é um pacote de primeira instalação; não sobrescrever a chave de um armazenamento existente.
3. Enviar o ZIP para a **pasta inicial da conta** e extrair ali. Isso adiciona a subpasta do aplicativo; o pacote não contém nem substitui `public_html/index.*`, WordPress, DNS ou e-mail.
4. Selecionar PHP **8.1 ou superior**, OpenSSL, acesso de escrita à pasta privada, SSL válido e memória PHP de 256M. `.user.ini` configura 256M de memória, 64M de POST e até 50M por arquivo; a aplicação das diretivas pode demorar alguns minutos no cPanel. Restrições do provedor podem exigir ajuste no painel.
5. Abrir `https://abuhsca.com.br/onboarding-construcel/api/index.php?route=/health`. Esperado: JSON `ok:true`. Sem isso, não distribuir o link como operacional.
6. Abrir o aplicativo, começar o onboarding e ir à revisão. Usar o convite de cliente para salvar um rascunho e enviar um arquivo fictício. Em outra sessão/navegador, entrar com o convite da agência, carregar a nuvem e conferir o arquivo. Confirmar envio completo com protocolo.
7. Guardar os convites em local seguro e apagar o ZIP enviado da hospedagem. Compartilhar com a cliente somente o endereço do aplicativo e seu convite, por canal privado.

Para reinstalações/atualizações, atualizar somente a pasta pública após backup e revisão. **Não regenerar nem substituir `config.php`**, pois isso invalida convites e pode tornar os dados criptografados ilegíveis. Não criar banco MySQL nem instalar Docker/Node na hospedagem: o backend desta variante usa PHP/OpenSSL e arquivos privados com bloqueio concorrente.

## Comportamento da API

O frontend usa `api/index.php?route=/v1/...`, evitando dependência de rewrite/PATH_INFO. CORS limita origens a `abuhsca.com.br`, `www.abuhsca.com.br` e ao endereço GitHub já usado pela cliente. Convites e sessões são obrigatórios para dados/anexos; sessões expiram em 2 horas. Somente a agência pode remover anexos recebidos. Respostas, metadados, sessões e arquivos são criptografados AES-256-GCM em repouso. Tokens de sessão são guardados apenas como hash no estado privado.

`flock` e escrita temporária seguida de rename serializam alterações, com `If-Match` impedindo perda por edição simultânea. Limites: 50 MB por arquivo, 200 MB por dossiê. Reenvio do mesmo arquivo/identificador é idempotente. Downloads são binários autenticados, `nosniff` e `attachment`. A API exige HTTPS e não confia em `X-Forwarded-Proto` fornecido pelo visitante. Código de cliente não dá acesso a outros clientes: esta instância é exclusiva da Construcel.

O protocolo confirma recebimento no servidor, não aprovação nem teste de acesso às redes. Não há envio automático de e-mail. Fazer backup privado da configuração e do armazenamento; testar restauração e definir retenção/exclusão após o contrato. Nunca remover a pasta privada em atualização.

## Migração do link anterior

Os rascunhos/anexos locais do GitHub não migram de origem automaticamente. Manter o link antigo disponível. Para continuar dados já preenchidos: exportar ZIP/JSON no endereço antigo e restaurar respostas/anexos no novo; ou, **depois de validar a API real**, configurar a variável GitHub `ONBOARDING_API_URL` como `https://abuhsca.com.br/onboarding-construcel/api/index.php?route=` e republicar, permitindo à cliente enviar o rascunho antigo diretamente ao mesmo servidor. Não apagar dados locais antes da conferência.

## Estado de implantação

O pacote e a API podem ser testados localmente, mas **não estão instalados na HostGator apenas porque o código foi criado**. É necessário acesso autenticado ao cPanel ou que o titular envie/extraia o ZIP. O texto de DNS não concede esse acesso. Na verificação de 11/11/2026, aplicativo e API responderam HTTP 406 do ModSecurity. O ambiente não possui acesso autenticado ao cPanel/SFTP nem convites de produção; por isso o recebimento real não foi validado. Ver a correção e o pacote de atualização que preserva a configuração privada em [Recebimento privado](../../docs/ONBOARDING-RECEBIMENTO-PRIVADO.md).

## Testes

```sh
PHP_BINARY=/caminho/do/php node --test tests/hostgator-php.test.mjs
```

Usa servidor PHP real e múltiplos processos: autenticação, CORS, gravação concorrente, conflito de versão, criptografia em repouso, upload/download, reenvio, rejeição de caminho/categoria inválidos, confirmação, papel da agência e persistência após reinício. Sem PHP, esse teste HTTP é marcado como não executado, nunca como aprovado. O teste de proteção de configuração roda em Node. Validar PHP/SSL/permissões/limites novamente na hospedagem real.

## Atualização sem substituir chaves

Para instalação já existente, usar `npm run package:hostgator:update`, não o pacote de primeira instalação. O ZIP de atualização contém somente arquivos públicos e preserva `config.php`, convites, estado criptografado e anexos. A área administrativa fica em `?perfil=agencia` e exige o convite da agência; respostas e anexos continuam protegidos pelo servidor.
