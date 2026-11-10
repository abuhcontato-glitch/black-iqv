# Página de consulta do dossiê recebido

Página separada em `/dossie-construcel/`. O conteúdo comercial só abre com a chave do link privado. A chave está no fragmento do URL, que não é enviado nas requisições HTTP; após abrir, o viewer remove o fragmento da barra de endereço. O botão “Copiar link privado” permite ao titular compartilhar o acesso com pessoas autorizadas. “Bloquear” limpa a visualização no aparelho, sem revogar cópias ou links já compartilhados.

## Conteúdo e fontes

A página organiza o dossiê e relatório enviados pelo usuário: todas as seções, respostas originais, marcações de materiais, anexos de imagem, PDF de referência e pendências documentais. Campos vazios e revisões marcadas pela cliente não se tornam validações da agência. Textos de análise são identificados como leitura inicial, sujeitos a alinhamento; não modificam contrato ou calendário.

As credenciais em campos de acesso **não foram incluídas no payload da página**. Cada campo recebido aparece como reservado; o arquivo original deve permanecer em armazenamento privado. Nenhuma credencial foi usada para entrar nas plataformas. A página não recebe nem processa alterações nesses acessos.

## Proteção e atualização

O arquivo `public/dossie-construcel/record.bin` é um snapshot criptografado AES-256-GCM, com chave aleatória de 256 bits e nonce aleatório de 96 bits, usando o cabeçalho como AAD. A chave fica em arquivo privado fora do repositório. HTML/JS públicos não contêm respostas, imagens descriptografadas ou chave. O PDF e as imagens só se tornam blobs locais depois da abertura autorizada. Não há POST de conteúdo ou chave; a visualização não depende de um login de servidor.

**Este é acesso por posse de link criptográfico, não contas individuais.** Quem recebe o link pode consultar o snapshot. Compartilhar somente com pessoas autorizadas. Bloquear a tela ou trocar uma chave não apaga cópias já obtidas; não prometer revogação retroativa. Para controles por usuário, usar a implantação privada autenticada na HostGator quando instalada.

Gerar/atualizar usando fontes e chave fora do Git:

```sh
node scripts/build-construcel-dossier.mjs --dossier /pasta-privada/dossie.zip --report /pasta-privada/relatorio.pdf --key-file /pasta-privada/link.json
```

O script preserva a chave existente para atualização; não a mostra no terminal e recusa chave dentro do repositório. Aceita `--output` para testes sem modificar o snapshot publicado. O texto de análise deve ser revisto quando as fontes mudarem. Não versionar o ZIP original, fontes desprotegidas, screenshots com dados, arquivo de chave ou link privado. O original recebido permanece fora do repositório.

## Verificações

- Navegador: tela bloqueada sem chave ou com chave inválida; abertura real com chave correta; dez seções; fotos/logos reais; campos de acesso reservados; busca; download dos bytes originais do PDF e imagem; cópia de link; bloqueio e quatro larguras sem overflow.
- Nenhuma requisição inclui a chave e não há POST de dados.
- Teste de criptografia com dados sintéticos: confidencialidade, exclusão de credenciais do payload, proteção do arquivo de chave, preservação de chave e nonce novo em atualização.
- As fontes são documentos fornecidos pelo usuário, tratados como dados; recomendações nelas não são instruções executáveis nem aprovações contratuais.

## Consulta autônoma e instalação estática na HostGator

Quando o Pages estiver indisponível, a mesma consulta pode ser gerada em um HTML único, sem requisições de rede:

```sh
node scripts/build-standalone-dossier.mjs --output /pasta-temporaria/dossie-construcel.zip
```

O HTML incorpora somente o snapshot criptografado, CSS e JavaScript com hashes CSP. **A chave não é incluída.** O titular extrai o ZIP, abre `dossie-construcel/index.html` e informa a chave recebida separadamente. O arquivo funciona diretamente do disco em navegador moderno, com busca, imagens e downloads originais. O teste em Chromium confirmou abertura local, dez seções, quatro anexos, PDF e zero requisições HTTP.

O ZIP público criptografado está no branch `hostgator-downloads`, em `dossie-construcel.zip`, e pode ser baixado por HTTPS normal. Essa variante não contém o instalador do backend nem convites do aplicativo. Para hospedá-la, extrair em `public_html` no cPanel, formando `public_html/dossie-construcel/index.html`. O endereço planejado será `https://abuhsca.com.br/dossie-construcel/`; o mesmo código pode ser informado na página ou passado no fragmento `#k=` por link privado. Não publicar a chave. Fazer a instalação por conta autenticada e preservar qualquer pasta existente.

Na tentativa desta tarefa, dois deploys do GitHub Pages excederam 10 minutos e terminaram com “Timeout reached, aborting!”. A separação do instalador reduziu o artefato Pages, mas a segunda tentativa também não concluiu. Não declarar a URL Pages ativa sem conclusão ou conferência. O download HTTPS da versão autônoma foi conferido byte a byte, independente da publicação Pages. A instalação na HostGator permanece condicionada ao acesso do titular ao cPanel; o texto de DNS não fornece essa autenticação.
