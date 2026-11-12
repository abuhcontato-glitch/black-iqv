# Construcel — consulta do material fornecido

Página independente em `/construcel/dados-fornecidos/`, sem alterar a estratégia ou o enxoval.

Exibe as declarações de produtos prioritários/mais vendidos, pagamento, entrega, serviços, política de promoções e margem, além de 12.157 registros estruturados do catálogo. A origem é o onboarding recebido e o arquivo identificado como CATÁLOGO DE PRODUTOS 10_11 / PRODUTOS.pdf. Preços e estoque são do documento, não uma consulta em tempo real. Promoção semanal e Black Friday são diferenciadas de preço de cadastro. As linhas não estruturadas e as limitações da extração ficam explícitas.

O catálogo e as transcrições são carregados a partir de um payload cifrado com AES-256-GCM. A chave não está neste repositório e é entregue somente no fragmento do link de acesso reservado. O fragmento não integra a requisição HTTP. A página não usa scripts externos nem envia a chave ou os dados para APIs. Busca, filtros e exportação CSV ocorrem no navegador. O arquivo de chave e os originais internos não devem ser versionados.

Testado: abertura com chave, bloqueio sem chave, contagem de registros, transcrições preservadas, busca por código/preço, filtros de estoque/preço, CSV e celular sem transbordamento.

## Acervo visual e planejamento

Após autorização explícita da pessoa solicitante para publicar o link no GitHub, a consulta foi ampliada com o material efetivamente recebido: 209 arquivos de imagem (incluindo repetições do acervo), seis artes comerciais e 13 vídeos. As seis artes mostram 20 produtos com preços à vista e validades impressas até 05/11 ou 12/11. Essas datas não confirmam reutilização ou ofertas de Black Friday. O PDF original usa o cabeçalho “Preço Promoção”; a página preserva essa nomenclatura, sem presumir vigência atual.

As respostas de planos e metas são transcritas literalmente, incluindo “Não temos nenhum” no campo de planejamento estratégico. Objetivos e metas declarados não são tratados como resultado garantido ou ampliação de escopo. O enxoval criado pela ABUHSCA permanece distinto das fotografias, vídeos e artes fornecidos pela cliente.

Os vídeos para compatibilidade e o PDF original são cifrados em arquivos binários; a chave continua fora do repositório. As imagens são prévias de arquivos recebidos, sem geração de novas cenas. Não foram incluídos arquivos de identidade, senhas, credenciais ou formulários de acesso do acervo.
