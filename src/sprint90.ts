export const sprint90 = {
 monthly: 2500, total: 7500, days: 90, installments: 3,
 monthlyPosts: 12, monthlyPieces: 36,
 pixKey: '04284996193', payee: 'MIKE CHRISTIAN', city: 'BRASILIA',
};
export function pixPayload(amount = sprint90.monthly) {
 if (!Number.isFinite(amount) || amount <= 0) throw new Error('Valor Pix inválido.');
 const field = (id: string, value: string) => id + String(value.length).padStart(2,'0') + value;
 const payload = field('00','01') + field('26',field('00','BR.GOV.BCB.PIX')+field('01',sprint90.pixKey)) + field('52','0000') + field('53','986') + field('54',amount.toFixed(2)) + field('58','BR') + field('59',sprint90.payee) + field('60',sprint90.city) + field('62',field('05','***')) + '6304';
 let crc=0xffff;
 for (const char of payload) { crc ^= char.charCodeAt(0)<<8; for(let i=0;i<8;i++) crc=((crc&0x8000)?(crc<<1)^0x1021:crc<<1)&0xffff; }
 return payload+crc.toString(16).toUpperCase().padStart(4,'0');
}
export const sprint90Scope = [
 ['Linha editorial e conteúdo', '12 pautas/postagens oficiais por ciclo mensal, desdobradas em 36 peças distribuídas entre Reels, Stories e feed do Instagram. Em três ciclos: 36 pautas e 108 peças. A divisão entre formatos segue o calendário aprovado.'],
 ['Planejamento de comunicação diária', 'Planejamento mensal com calendário editorial, roteiros, chamadas para ação e direcionamentos de gravação/publicação, para manter comunicação diária no Instagram com a participação da equipe Construcel. Comunicação diária não significa uma peça inédita por dia além das 36 peças mensais.'],
 ['Meta Ads e Google Ads', 'Gestão de até 2 campanhas ativas por plataforma, monitoramento e otimização semanal. 8 criativos publicitários mensais, utilizando também adaptações dos materiais aprovados da linha editorial. Peças estáticas, carrosséis e edições simples de vídeos fornecidos pela cliente.'],
 ['Google Perfil da Empresa', 'Otimização inicial do Google Meu Negócio/Perfil da Empresa, organização das informações comerciais e acompanhamento básico ao longo dos 90 dias.'],
 ['Landing pages de captação', 'Implantação simples e padronizada de páginas de campanha, com apresentação da oferta e chamada para orçamento no WhatsApp. A primeira página será implantada no primeiro ciclo. Páginas adicionais e prioridades serão discriminadas no cronograma aprovado, sem promessa de volume ilimitado.'],
 ['WhatsApp Business e CRM básico', 'Organização do catálogo prioritário, mensagens rápidas, etiquetas e direcionamento comercial no WhatsApp Business. Funil básico para acompanhar contatos, propostas, orçamentos e retornos.'],
 ['Acompanhamento comercial', '1 reunião mensal, resumo de indicadores, análise de oportunidades e definição das ações seguintes. A Construcel realiza o atendimento, os orçamentos e o fechamento das vendas.'],
 ['Execução orientada', 'Produção editorial remota: a ABUHSCA planeja, roteiriza, orienta e edita os materiais; a Construcel fornece informações, imagens e gravações. Demandas de captação presencial serão detalhadas e acordadas antes de execução.'],
] as const;
