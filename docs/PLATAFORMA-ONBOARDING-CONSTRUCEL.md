# Plataforma de onboarding Construcel

## Implementação atual

A página pública permanece em `/construcel/onboarding/`, com o botão **Começar meu onboarding** levando ao aplicativo `#plataforma`. O cronograma e as entregas assinadas não foram alterados. O formulário anterior de entrega (`OnboardingHandover`) foi substituído pelo aplicativo; sua orientação de links/arquivos e diagnóstico foi incorporada às etapas.

Dez etapas em `src/onboarding-app/model.ts`: empresa atual; planos macro/negócio/estratégico/marketing; logo e identidade; fotos categorizadas; vídeos por tipo; departamentos e equipes; acervo de agências; catálogos/preços/promoções; vendas/visitas/resultados; inventário de acessos. O e-mail para convites continua `abuhoficial@gmail.com`; nenhum campo pede senhas das plataformas.

## Uso pela cliente

Campos e anexos salvam em IndexedDB, separados dos estados antigos da checklist. O aplicativo indica salvando/salvo/falha e protege a saída durante operações pendentes. Links HTTPS por categoria, estados “não possui/a providenciar”, prévia de imagens raster, download e remoção local de anexos. Revisão por etapa, busca de etapas, resumo de campos preenchidos e pendências. Etapas revistas não são aprovação da agência. Campos essenciais: razão, fantasia, responsável e e-mail.

50 MB por arquivo, 200 MB por dossiê. Arquivos grandes devem vir por link restrito. O pacote ZIP contém respostas JSON, resumo textual e arquivos reais em categorias. A exportação não envia automaticamente nada. O backup JSON restaura respostas (não anexos); para restaurar anexos de um ZIP em outro aparelho, extrair e anexar os arquivos. O rascunho é específico do navegador/origem; limpar dados do site remove cópias locais. O aplicativo não envia informações comerciais para o repositório GitHub.

## Recebimento online

Servidor novo em `server/onboarding/`, com instruções e implantação Docker. Não depende de npm, usa Node 24/SQLite, disco persistente e criptografia AES-GCM das respostas e arquivos. Acesso por convites de alta entropia distintos para cliente e agência; sessão de duas horas somente em memória da aba. Controle de versão impede sobrescrever outro aparelho. Uploads idempotentes, recebimento confirmado com protocolo, CORS limitado e downloads binários autenticados. A mesma interface com convite da agência permite carregar/conferir o dossiê e baixar anexos. Cada instância é exclusiva de uma cliente.

**Estado de implantação:** frontend publicado pelo GitHub Pages; backend criado e testado localmente, mas sem hospedagem pública ativada. Esta tarefa não possui credenciais de um provedor de servidor. GitHub Pages não executa Node nem recebe uploads. Sem `VITE_ONBOARDING_API_URL`, a interface informa recebimento online inativo e oferece salvamento local/exportação. Não mostra um envio falso. Não há notificação automática por e-mail.

Para ativar, seguir [instruções do servidor](../server/onboarding/README.md): implantar numa conta/hospedagem com HTTPS e disco persistente, gerar convites fora do Git, definir a variável GitHub `ONBOARDING_API_URL` e republicar. Validar com dados fictícios antes de compartilhar convites. Essa ativação é a pendência real para o fluxo automático em produção.

## Verificações

- 46 testes incluindo modelo, estados de materiais, limites de arquivo, ZIP/CRC e servidor real.
- Servidor: autenticação, CORS, controle de versão, criptografia de respostas/arquivos, upload/download, reenvio sem duplicação, confirmação, papel da agência e persistência após reinício.
- Navegador: campos persistidos após recarga, upload real em IndexedDB, preview, link por categoria, exclusão local persistida, formato recusado e ZIP baixado.
- ZIP aberto com `zipfile` do Python: CRCs, respostas JSON e logo real conferidos.
- Integração cliente/servidor local: convite cliente, rascunho na nuvem, upload, protocolo de entrega; sessão independente da agência, restauração e download com os mesmos bytes.
- Larguras 320, 390, 768 e 1440px, sem transbordamento horizontal ou exceções JavaScript.
- O teste local não equivale a backend implantado; a hospedagem real ainda precisa ser conectada.

## Destino HostGator confirmado pelo usuário

O usuário informou cPanel e DNS de `abuhsca.com.br`. Foi adicionada variante PHP/OpenSSL com armazenamento criptografado privado, sem banco externo, em `server/hostgator/`. O pacote gerado por `npm run package:hostgator` contém o aplicativo público em `public_html/onboarding-construcel` e a pasta privada fora de `public_html`, incluindo convites distintos. Não altera DNS/e-mail/site principal. A instalação requer upload/extrair na pasta inicial do cPanel; a informação DNS não fornece autenticação. Antes de distribuir o novo endereço, conferir `/health`, SSL, upload real e leitura pela agência. Ver [instruções completas e migração de rascunhos](../server/hostgator/README.md).
