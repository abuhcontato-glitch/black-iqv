# Diagnóstico de direção privado

Consulta em `public/diagnostico-construcel/`, separada do dossiê documental e do site principal. O conteúdo específico da cliente está apenas em `record.bin` (AES-256-GCM, formato ABUHDS01, IV aleatório, cabeçalho autenticado). Não publicar o JSON de trabalho nem a chave. O simulador é genérico; os valores iniciais específicos vêm do conteúdo descriptografado. Não há gravação, analytics ou envio das hipóteses para terceiros.

Atualizar a análise a partir de fontes privadas, com identificação de fatos, declarações, hipóteses e decisões pendentes. Não alterar respostas originais. O escopo registrado no projeto não substitui a conferência do contrato assinado. Nunca inferir lucro a partir de ROAS.

```sh
node scripts/encrypt-diagnostic.mjs /fora/do/repositorio/diagnostico.json /fora/do/repositorio/chave.json
node scripts/build-standalone-diagnostic.mjs --output /tmp/diagnostico/diagnostico-direcao-construcel.zip
node --test tests/diagnostic-math.test.mjs tests/diagnostic-package.test.mjs
```

O ZIP tem um único HTML autônomo criptografado e instruções. A chave fica fora do pacote. Extração em `public_html` cria `diagnostico-construcel/index.html`, com arquivo 0644 e pasta 0755. Pode abrir offline com a chave. O botão de dossiê pressupõe a instalação da consulta original na pasta irmã `dossie-construcel` e requer HTTPS quando hospedado.

O link com fragmento `#k=` contém a capacidade de acesso: compartilhar apenas com pessoas autorizadas. Bloquear limpa o DOM, mas não desfaz cópias, PDFs ou um link já compartilhado. Imprimir gera cópia legível, que deve ficar em armazenamento privado.

Publicar o pacote criptografado na branch de downloads não instala o arquivo no cPanel. Não declarar publicação na HostGator sem upload e verificação efetivos.
