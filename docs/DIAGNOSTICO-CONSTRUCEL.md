# Diagnóstico antes da proposta — Construcel

Pedido: conduzir uma conversa de descoberta antes de mostrar serviços e preços. A etapa reaproveita a identidade visual da apresentação aprovada.

## Fluxo

1. Conexão e contexto: por que retomou a conversa e o que a empresa faz bem.
2. Cenário: de onde chegam os clientes, como são atendidos e o que já foi tentado.
3. Obstáculo e impacto: exemplo concreto, efeitos observáveis e consequências reais; admitir quando não existe necessidade relevante.
4. Objetivo e prioridade: resultado desejado, primeiro foco e critério observável de avanço.
5. Viabilidade: participantes e critérios da decisão, investimento ainda aberto ou definido, responsabilidades e prazo realista.
6. Resumo conjunto: revisar, corrigir e escolher apresentar, aprofundar ou pausar.

Cada etapa tem perguntas abertas, anotações, uma frase de reflexão e confirmação do entendimento. Há orientações de condução recolhidas por padrão. Não há respostas sugeridas de dor, orçamento mínimo obrigatório, pressão emocional, punição por pausar, promessa de resultado ou aceite contratual implícito.

## Uso na reunião

Abertura sugerida: “Obrigado por retomarmos. Antes de mostrar qualquer solução, posso te ouvir e fazer algumas perguntas? Depois a gente vê se existe encaixe.” Combine o tempo disponível e peça permissão para anotar.

Após cada resposta: espere, peça um exemplo quando necessário, retome as palavras dela e confirme a interpretação. “O que entendi foi X. Estou dando o peso certo ou você mudaria alguma coisa?” A cliente pode corrigir, não saber um dado ou dizer que não é prioridade.

No final: leia o resumo e confirme o primeiro foco, como perceber avanço, quem decide e quais condições ainda faltam. Se houver interesse em proposta, apresente o escopo aderente ao que foi dito. Se não houver, registre a pendência ou a decisão de pausar. Não use os desencontros anteriores como pressão.

A reunião foi inicialmente preenchida para 06/11/2026 às 11h de Brasília, conforme informado pelo usuário. O campo é editável e não altera validade comercial ou prazos contratuais.

## Implementação e limites

`DiscoveryGate` envolve as rotas no aplicativo de propostas e reserva `/construcel` e todos seus caminhos filhos até concluir o diagnóstico. Links diretos de planos e revisões também passam pela etapa. `/construcel/diagnostico` permite rever a conversa depois da liberação; há acesso visível para isso. Luxuosa, portfólio e campanha BLACK IQV não recebem o bloqueio.

Estado versionado em sessionStorage (`construcel-discovery-v1`), com validação, limites de texto e recuperação de dados inválidos. As respostas não são enviadas a servidor. A liberação depende das respostas essenciais, cinco confirmações de etapa, três confirmações finais e decisão de conhecer uma proposta. Editar uma resposta revoga a liberação e as confirmações dependentes. Baixar/copiar resumo e nova conversa com confirmação estão disponíveis.

É uma etapa de organização da apresentação, não autenticação, assinatura ou controle de acesso seguro. Não comprova que a cliente pessoalmente preencheu ou aprovou o registro. Quem conduz a reunião deve registrar fielmente e obter a confirmação na conversa. Manter/duplicar/restaurar abas pode preservar a sessão conforme o navegador; use Nova conversa antes de outro atendimento.

Não alterados: valores, entregas, condições e meios de cobrança dos planos. Nenhuma contratação, mensagem ou pagamento automático foi adicionado.

## Validação

23 testes passaram. Build com duas entradas (campanha e proposta) aprovado. Chromium: rotas diretas bloqueadas sem expor planos/preços, seis etapas, resumo, pausa sem apresentação, download, confirmações finais, liberação, recarga, aba nova sem liberação, revogação por edição, cancelamento/confirmação de limpeza e quatro larguras (320/390/768/1440). Luxuosa e BLACK IQV preservadas. Inspeção visual de desktop e celular.

## Atualização — navegação livre

A pedido do usuário, retiradas as travas de preenchimento e sequência. As seis etapas ficam disponíveis desde o início; Próxima etapa funciona sem respostas ou confirmações. Ler roteiro completo apresenta todas as perguntas em uma única leitura. Ver proposta agora permite consulta imediata, preservando as anotações sem marcar confirmações inexistentes.

A consulta manual é guardada separadamente em sessionStorage (`construcel-discovery-v1-view`). O aviso da proposta distingue consulta livre de diagnóstico realmente confirmado. Nova conversa limpa também essa liberação. A etapa escolhida é retomada mesmo quando incompleta. As validações do diagnóstico confirmado permanecem para não registrar um acordo que não ocorreu.

23 testes e build aprovados. Chromium verificou acesso livre às etapas, navegação vazia, retomada no resumo, seis blocos do roteiro completo, quatro larguras, abertura manual dos cinco planos, aviso sem confirmação falsa, recarga e limpeza.
