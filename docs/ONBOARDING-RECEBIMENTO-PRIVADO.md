# Correção do recebimento — Construcel — 11/11/2026

## Estado real

Implementação e pacote de atualização preparados. **Não declarar o serviço implantado nem recomendar o envio do link à cliente antes do teste completo na HostGator.**

Nesta execução, `https://abuhsca.com.br/onboarding-construcel/`, `api/index.php?route=/health` e `api/index.php?route=/v1/dossier` responderam HTTP 406 com a mensagem ModSecurity. Não há credencial cPanel/SFTP nem convites de produção configurados no ambiente; também não há ferramenta de desktop/sessão autenticada de hospedagem disponível. Assim, não foi possível instalar a atualização, verificar a configuração privada existente ou fazer um recebimento real. Isso não prova que o diretório esteja instalado ou ausente; a proteção respondeu antes de podermos conferir a aplicação.

## Fluxo implementado

- Convites privados distintos na entrada da cliente e da agência; sem convite em URL, armazenamento de token no navegador ou senhas de redes sociais.
- Respostas sincronizadas automaticamente com debounce e fila serial. O indicador confirma servidor somente após resposta válida; uma confirmação antiga nunca marca como salvas edições feitas durante a solicitação.
- Upload automático por arquivo, progresso e confirmação separados. 100% transmitido não significa recebido. Falhas preservam a cópia local e permitem repetir o mesmo identificador sem duplicação.
- Retomada em outro navegador pelo convite e GET autenticado do dossiê. Se o rascunho local divergir, pede escolha explícita e preserva a versão anterior antes de substituí-la.
- Revisão final e manifesto dos arquivos. Protocolo e data do servidor persistem; interface mostra horário de Brasília. Uma alteração posterior invalida a confirmação da versão atual.
- Agência tem consulta própria, pendências, prévia autenticada de PNG/JPEG/WebP/PDF e downloads autenticados. O servidor proíbe gravação/envio sob o papel da agência (403); esconder botão não é o controle de acesso.
- Dados e anexos criptografados na pasta privada existente, fora de `public_html`. Nenhuma alteração/regeneração de chave ou convite em atualização.
- Dez etapas e perguntas existentes preservadas. Materiais distinguem disponível, não possui, vai enviar depois e não se aplica. Etapas podem continuar com pendências, sem inventar informações.
- Sem ligação com DNS, e-mail, BLACK IQV, contrato, preço ou cronograma comercial. E-mail `abuhoficial@gmail.com` continua destinado aos convites nas plataformas; esta atualização não simula envio de e-mail.

## Atualização segura da instalação existente

`npm run package:hostgator:update` gera `deploy-artifacts/hostgator-atualizacao-DATA/ATUALIZAR-SOMENTE-ONBOARDING.zip`.

O ZIP contém somente `public_html/onboarding-construcel/index.html`, assets, mídias públicas, `api/index.php` e `api/schema.json`. Não inclui `config.php`, convites, chave, `state.bin`, anexos privados, `.htaccess` nem `.user.ini`. Assim, preserva configuração privada e ajustes existentes. É uma atualização, não um instalador para instância ausente.

No cPanel: fazer backup privado; enviar o ZIP à pasta inicial da conta (acima de `public_html`) e extrair ali. Os arquivos contidos atualizam somente a subpasta de onboarding. Não apagar a pasta privada nem executar o instalador inicial sobre instalação existente. Se a instalação não existir, confirmar esse estado antes de preparar novas chaves/convites.

O 406 exige revisão pontual pela HostGator da regra ModSecurity aplicada aos dois caminhos. Não alterar DNS, não desativar proteção global e não publicar configuração privada para resolver isso.

## Endereços planejados e acesso

Cliente: `https://abuhsca.com.br/onboarding-construcel/`.
Agência: `https://abuhsca.com.br/onboarding-construcel/?perfil=agencia`.

Ambos pedem o convite correspondente. O parâmetro apenas escolhe o formulário de acesso; não concede permissão. O servidor decide o papel. O convite da cliente é compartilhado somente por canal privado; o convite da agência não é enviado à cliente.

Os convites já existentes ficam no arquivo privado `abuhsca-onboarding-private/CONVITES-PRIVADOS.txt`, na pasta inicial da conta. Se ele não estiver disponível, preservar `config.php` e planejar recuperação de acesso, sem reinicializar a chave de criptografia. O teste automatizado lê convites apenas de variáveis/segredos privados, nunca de argumentos, logs ou URLs.

Respostas/metadados/sessões: `abuhsca-onboarding-private/state.bin`.
Anexos: `abuhsca-onboarding-private/files/<id>`.
Configuração e chave: `abuhsca-onboarding-private/config.php`.

## Validações executadas localmente

- Suíte completa com PHP 8.4 CLI real extraído de pacotes oficiais em diretório temporário; não dependeu de PHP simulado.
- Autenticação, CORS, concorrência, conflito de versão, preservação de configuração, criptografia e download.
- Navegador Chromium contra PHP: preenchimento fictício, autosave, desconexão/recuperação sem falso sucesso, PNG real, PDF real, falha/repetição de upload, nova sessão sem IndexedDB, protocolo e data recuperados, acesso da agência e downloads com bytes idênticos.
- API negou consulta/download sem autorização (401) e escrita da agência (403).
- Larguras 320, 390 e 1440 sem transbordamento.
- ZIP íntegro, apenas caminhos públicos permitidos e nenhum arquivo de configuração privada. Extração sobre a instalação PHP fictícia preservou `config.php` e `state.bin` byte a byte.

Esses resultados são **locais**. Não equivalem a recebimento na HostGator.

## Validação real a executar após obter acesso

`scripts/verify-onboarding-live.mjs` exige `ONBOARDING_TEST_API_URL`, `ONBOARDING_CLIENT_INVITE`, `ONBOARDING_ADMIN_INVITE` como variáveis/segredos privados e `ONBOARDING_ALLOW_EMPTY_TEST=YES` para autorizar um teste numa instância vazia. Não incluir segredos em comandos de chat. Exemplo de URL, sem segredo: `https://abuhsca.com.br/onboarding-construcel/api/index.php?route=`.

O verificador confirma ambos os papéis antes de gravar. Recusa instância que já tenha dossiê/arquivos/versão e nunca sobrescreve dados reais. Numa instalação vazia autorizada, grava registro TESTE-FICTICIO, envia PNG/PDF, retoma com outra sessão, conclui, lê como agência, compara bytes, testa 401/403 e remove somente seus próprios dados de teste se ninguém editou durante a verificação. Caso exista dossiê real, usar instância de validação separada ou conferência manual não destrutiva. Depois, repetir o navegador real, a falha de conexão e as larguras móvel/desktop antes de distribuir o link.

## Legado

O banco IndexedDB `construcel-onboarding-app-v1` e seus arquivos não foram apagados ou renomeados. A conferência antiga de acessos também permanece intacta. Não há redirecionamento automático. O acesso sem backend oferece recuperação explícita do rascunho antigo e informa que nada foi recebido pela agência; não abre um novo formulário que só salva localmente.

Somente após validar a API real, configurar a variável GitHub `ONBOARDING_API_URL` com o endpoint público sem segredos e publicar a integração no endereço antigo. A mesma cliente poderá sincronizar respostas e arquivos já presentes naquele navegador sem precisar enviar ZIP manualmente. As opções de backup são proteção adicional e migração entre origens, nunca a prova de recebimento.
