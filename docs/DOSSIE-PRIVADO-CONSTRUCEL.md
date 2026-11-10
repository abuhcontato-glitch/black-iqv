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
