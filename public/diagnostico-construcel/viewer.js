import { economics, funnel } from './math.js';
const gate=document.querySelector('#gate'),app=document.querySelector('#app'),keyInput=document.querySelector('#key'),status=document.querySelector('#gate-status');
let activeKey='';
const base64=value=>Uint8Array.from(atob(value),c=>c.charCodeAt(0));
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
const money=n=>n===null?'Indeterminado':new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(n);
function link(text,href){const a=el('a',text);a.href=href;return a;}
function simulator(data){
 const section=el('section',undefined,'section simulator');section.id='simulador';section.append(el('p','SIMULAÇÃO · HIPÓTESES EDITÁVEIS','eyebrow'),el('h2','A meta precisa fechar a conta.'),el('p','Meta mensal confirmada. Verba, margem e taxas abaixo são exemplos fictícios, não dados da Construcel nem médias de mercado. Alterações ficam somente nesta sessão.','intro'));
 const form=el('div',undefined,'sim-inputs'),fields={};
 const definitions=[['revenue','Receita mensal desejada (R$)',data.target,0],['spend','Mídia no mês (R$) — exemplo',100000,0],['margin','Margem de contribuição (%) — exemplo',30,0,100],['fee','Agência no mês (R$)',data.fee,0],['operations','Outros custos incrementais no mês (R$)',0,0],['ticket','Ticket médio (R$) — exemplo',1000,1],['conversion','Conversas qualificadas → pedidos (%) — exemplo',5,0.01,100],['cpl','Custo por conversa qualificada (R$) — exemplo',15,0],['days','Dias de atendimento no mês — exemplo',24,1,31],['minutes','Minutos totais por conversa, incluindo retornos',15,0]];
 for(const [id,label,value,min,max]of definitions){const wrapper=el('label',label),input=el('input');input.type='number';input.id=id;input.min=min;input.step='any';if(max!==undefined)input.max=max;input.value=value;wrapper.append(input);form.append(wrapper);fields[id]=input;}
 const output=el('div',undefined,'sim-results');output.setAttribute('aria-live','polite');
 const note=el('p',undefined,'security-note');
 function update(){const v=Object.fromEntries(Object.entries(fields).map(([id,input])=>[id,input.value.trim()===''?NaN:Number(input.value)]));const e=economics(v),f=funnel(v);output.replaceChildren();if(!e||!f){output.append(el('p','Preencha valores válidos: ticket, dias e conversão maiores que zero; percentuais até 100.'));note.textContent='';return;}
 const rows=[['ROAS da mídia',e.roas===null?'Sem gasto de mídia':e.roas.toFixed(2)+'×'],['Contribuição antes de marketing',money(e.contribution)],['Saldo após mídia, agência e outros',money(e.balance)],['Retorno sobre custos de marketing',e.roi===null?'Indeterminado':(e.roi*100).toFixed(1)+'%'],['Receita para equilíbrio desses custos',money(e.breakEven)],['Pedidos necessários',String(f.orders)],['Conversas qualificadas necessárias',String(f.leads)],['Mídia exigida pelo funil hipotético',money(f.budget)],['Conversas por dia de atendimento',f.perDay.toFixed(1)],['Horas de atendimento/dia',f.hoursPerDay.toFixed(1)]];
 for(const [label,value]of rows){const c=el('article');c.append(el('small',label),el('strong',value));output.append(c);}
 note.textContent=`O saldo não é lucro líquido: ainda faltam os custos fixos não informados. ROI exibido = saldo ÷ (mídia + agência + outros custos incrementais). Equilíbrio = esses custos ÷ margem de contribuição. O orçamento do funil é uma conta separada: não altera a mídia digitada. Diferença entre mídia digitada e exigida pelo funil: ${money(v.spend-f.budget)}. Pedidos e conversas são arredondados para cima; atingir quantidades não é garantido. Horas incluem o tempo médio informado por conversa, não toda a operação comercial.`;}
 form.addEventListener('input',update);const preset=el('button','Usar no financeiro a mídia calculada pelo funil','button secondary');preset.type='button';preset.onclick=()=>{const v=Object.fromEntries(Object.entries(fields).map(([id,input])=>[id,input.value.trim()===''?NaN:Number(input.value)]));const f=funnel(v);if(f){fields.spend.value=f.budget;update();}};
 section.append(form,preset,output,note,el('p','Capacidade: compare as horas calculadas com as horas efetivamente disponíveis da equipe, sem esquecer pausas e outras atividades. R$ 0 em outros custos significa ausência de informação, não ausência de custo. Não há integração com contas de anúncios nem alteração de orçamento real.','source-note'));update();return section;
}
function render(data){
 app.replaceChildren();const header=el('header',undefined,'header');header.append(el('strong','abuhsca®'));const nav=el('nav');nav.setAttribute('aria-label','Navegação do diagnóstico');nav.append(link('Parecer','#s0'),link('Escopo','#s2'),link('Simular','#simulador'),link('Ação','#s6'));
 const lock=el('button','Bloquear','lock');lock.onclick=()=>{app.replaceChildren();app.hidden=true;gate.hidden=false;activeKey='';keyInput.focus();};const print=el('button','Imprimir / salvar PDF','lock');print.onclick=()=>window.print();header.append(nav,print,lock);app.append(header);
 const main=el('main');app.append(main);const hero=el('section',undefined,'diagnostic-hero');hero.append(el('p','ABUHSCA × CONSTRUCEL · DIREÇÃO E OPERAÇÃO','eyebrow'),el('h1',data.title),el('p',data.subtitle,'subtitle'),el('p',data.date+' · Documento interno, baseado no material recebido.','hero-note'));main.append(hero);
 const stats=el('div',undefined,'stats');for(const [v,t]of [[money(data.target),'objetivo mensal pelo WhatsApp'],['10 clientes','objetivo B2B em três meses'],['Pendente','verba de anúncios aprovada'],['Não validada','viabilidade financeira da meta']]){const n=el('div');n.append(el('strong',v),el('span',t));stats.append(n);}main.append(stats);
 const toc=el('details',undefined,'toc');toc.append(el('summary','Índice do diagnóstico'));data.sections.forEach((s,i)=>toc.append(link(s.title,'#s'+i)));main.append(toc);
 data.sections.forEach((s,i)=>{const section=el('section',undefined,'section');section.id='s'+i;section.append(el('h2',s.title),el('p',s.intro,'intro'));const grid=el('div',undefined,'diagnosis-grid');s.cards.forEach(c=>{const card=el('article',undefined,'diagnosis-card');card.append(el('span',c.status,'badge'),el('h3',c.title),el('p',c.text));grid.append(card);});section.append(grid);main.append(section);if(i===3)main.append(simulator(data));});
 const source=el('section',undefined,'section');source.append(el('h2','Fontes e limites da análise'));for(const s of data.sources)source.append(el('p',s));const dossier=link('Consultar o dossiê original e os acessos','../dossie-construcel/#k='+encodeURIComponent(activeKey));source.append(dossier);main.append(source);app.append(el('footer','ABUHSCA · Diagnóstico de direção · Consulta privada. Recomendações não alteram o contrato por si só.'));gate.hidden=true;app.hidden=false;document.title='Diagnóstico de direção | Construcel';window.scrollTo(0,0);
}
async function unlock(value) {
  status.textContent = 'Abrindo o conteúdo privado…';
  try {
    const normalized = value.trim().replace(/-/g, '+').replace(/_/g, '/'); const bytes = base64(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='));
    if (bytes.length !== 32) throw new Error();
    const response = await fetch('./record.bin', { credentials: 'omit', cache: 'no-store' }); if (!response.ok) throw new Error();
    const encrypted = new Uint8Array(await response.arrayBuffer()), header = new TextEncoder().encode('ABUHDS01');
    if (new TextDecoder().decode(encrypted.subarray(0, 8)) !== 'ABUHDS01') throw new Error();
    const key = await crypto.subtle.importKey('raw', bytes, 'AES-GCM', false, ['decrypt']);
    const clear = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: encrypted.subarray(8, 20), additionalData: header }, key, encrypted.subarray(20));
    const data = JSON.parse(new TextDecoder().decode(clear)); if (data.schema !== 1) throw new Error();
    activeKey = value.trim(); keyInput.value = ''; history.replaceState(null, '', location.pathname + location.search); render(data);
  } catch { status.textContent = 'Não foi possível abrir. Confira a chave do link privado e tente novamente.'; }
}
document.querySelector('#unlock').onclick = () => unlock(keyInput.value);
keyInput.addEventListener('keydown', event => { if (event.key === 'Enter') unlock(keyInput.value); });
function openKeyFromLocation() { const suppliedKey = new URLSearchParams(location.hash.slice(1)).get('k'); if (suppliedKey) unlock(suppliedKey); }
window.addEventListener('hashchange', openKeyFromLocation);
openKeyFromLocation();
