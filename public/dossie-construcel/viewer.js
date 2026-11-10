const gate = document.querySelector('#gate'), app = document.querySelector('#app'), keyInput = document.querySelector('#key'), status = document.querySelector('#gate-status');
let activeKey = '', objectUrls = [];
const base64 = value => Uint8Array.from(atob(value), char => char.charCodeAt(0));
function element(tag, text, className) { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; if (className) node.className = className; return node; }
function urlFor(content, type) { const url = URL.createObjectURL(new Blob([base64(content)], { type })); objectUrls.push(url); return url; }
function anchor(label, href, className) { const node = element('a', label, className); node.href = href; return node; }
function badge(text, kind = '') { return element('span', text, `badge ${kind}`); }
function download(label, url, name) { const link = anchor(label, url, 'button secondary'); link.download = name; return link; }
function navLink(text, id) { return anchor(text, '#' + id); }
function section(id, kicker, title, subtitle) { const node = element('section', undefined, 'section'); node.id = id; node.append(element('p', kicker, 'eyebrow'), element('h2', title)); if (subtitle) node.append(element('p', subtitle, 'intro')); return node; }
function filesFor(data, category) { return data.files.filter(file => file.category === category); }
function imageType(name) { return name.toLowerCase().endsWith('.webp') ? 'image/webp' : name.toLowerCase().match(/\.jpe?g$/) ? 'image/jpeg' : 'image/png'; }
function render(data) {
  app.replaceChildren();
  const header = element('header', undefined, 'header');
  header.append(anchor('abuhsca®', '../', 'wordmark'));
  const nav = element('nav'); nav.setAttribute('aria-label', 'Seções do dossiê');
  for (const [text, id] of [['Visão geral', 'visao'], ['Respostas', 'respostas'], ['Materiais', 'materiais'], ['Pendências', 'pendencias']]) nav.append(navLink(text, id));
  const lock = element('button', 'Bloquear', 'lock'); lock.type = 'button'; lock.onclick = () => { for (const url of objectUrls) URL.revokeObjectURL(url); objectUrls = []; activeKey = ''; app.replaceChildren(); app.hidden = true; gate.hidden = false; status.textContent = 'Página bloqueada.'; keyInput.focus(); };
  header.append(nav, lock); app.append(header);
  const main = element('main'); app.append(main);
  const hero = element('section', undefined, 'hero'); hero.id = 'visao';
  const left = element('div'); left.append(element('p', 'ABUHSCA × CONSTRUCEL · INTELIGÊNCIA DE CLIENTE', 'eyebrow'), element('h1', 'O que a Construcel nos contou.'), element('p', 'Dossiê de onboarding', 'subtitle'));
  const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Sao_Paulo' }).format(new Date(data.updatedAt));
  left.append(element('p', `Arquivo da cliente atualizado em ${date} · Brasília. Respostas e materiais organizados para consulta. Informações ainda não auditadas.`, 'hero-note'));
  const actions = element('div', undefined, 'actions'); actions.append(navLink('Explorar as respostas ↓', 'respostas'));
  const pdf = urlFor(data.report.content, 'application/pdf'); actions.append(download('Baixar relatório PDF', pdf, data.report.name)); left.append(actions);
  const picture = data.files.find(file => file.category === 'fotos.foto-0');
  const right = element('figure', undefined, 'hero-photo'); if (picture) { const img = element('img'); img.src = urlFor(picture.content, imageType(picture.name)); img.alt = 'Fotografia da fachada fornecida pela Construcel'; right.append(img); } right.append(element('figcaption', 'Imagem enviada pela cliente · fachada da empresa'));
  hero.append(left, right); main.append(hero);
  const stats = element('div', undefined, 'stats');
  for (const [value, label] of [[data.stats.fields, 'campos recebidos'], [data.stats.reviewed + '/10', 'etapas marcadas pela cliente'], [data.stats.attachments, 'arquivos anexados'], [data.stats.links, 'links de anexos']]) { const item = element('div'); item.append(element('strong', String(value)), element('span', label)); stats.append(item); } main.append(stats);
  const overview = section('leitura', '01 · LEITURA INICIAL', 'Um retrato da operação.', 'Síntese a partir do que foi informado. Metas, intenções e dados cadastrais não equivalem a resultados ou decisões aprovadas.');
  const summary = element('div', undefined, 'summary-grid'); for (const [title, text] of data.summary) { const card = element('article'); card.append(element('h3', title), element('p', text)); summary.append(card); } overview.append(summary); main.append(overview);
  const answers = section('respostas', '02 · RESPOSTAS DA CLIENTE', 'Cada informação, preservada.', 'Texto original do formulário. Campos vazios, itens declarados indisponíveis e informações reservadas estão identificados.');
  const toolbar = element('div', undefined, 'search-bar'); const searchLabel = element('label', 'Buscar nas respostas'); const search = element('input'); search.type = 'search'; search.placeholder = 'Ex.: vendas, equipe, preços…'; searchLabel.append(search); toolbar.append(searchLabel); answers.append(toolbar);
  const answerCards = [];
  for (const item of data.sections) {
    const article = element('article', undefined, 'answer-section'); const top = element('div', undefined, 'answer-heading'); top.append(element('h3', item.title), badge(item.reviewed ? 'Marcada como revisada pela cliente' : 'Não revisada')); article.append(top);
    for (const field of item.fields) { const row = element('div', undefined, `answer-row ${field.provided ? '' : 'empty'} ${field.reserved ? 'reserved' : ''}`); row.append(element('h4', field.label), element('p', field.value)); if (field.reserved) row.append(badge('Recebido · conteúdo reservado', 'reserved')); article.append(row); }
    if (item.categories.length) { const list = element('div', undefined, 'category-list'); for (const category of item.categories) { const row = element('div'); row.append(element('strong', category.label), badge(category.status), element('span', `${category.count} anexo(s)`)); if (category.status === 'Não possui' && category.count > 0) row.append(badge('Há arquivo recebido · conferir marcação', 'warning')); if (category.link) row.append(element('span', category.link)); list.append(row); } article.append(list); }
    answers.append(article); answerCards.push(article);
  }
  search.addEventListener('input', () => { const query = search.value.toLocaleLowerCase('pt-BR'); for (const card of answerCards) card.hidden = !card.textContent.toLocaleLowerCase('pt-BR').includes(query); }); main.append(answers);
  const materials = section('materiais', '03 · ARQUIVOS RECEBIDOS', 'A marca e a empresa, de perto.', 'Três versões da logo e uma fotografia. Os arquivos abaixo são os anexos recebidos, sem substituição por imagens conceituais.');
  const gallery = element('div', undefined, 'gallery');
  for (const file of data.files) { const card = element('figure', undefined, `file-card ${file.category.startsWith('marca.') ? 'logo-card' : 'photo-card'}`); const imageBox = element('div', undefined, 'image-box'); if (/LOGO2/i.test(file.name)) imageBox.classList.add('dark'); const url = urlFor(file.content, imageType(file.name)); const img = element('img'); img.src = url; img.alt = `${file.category.startsWith('marca.') ? 'Logo' : 'Fotografia'} fornecida pela cliente: ${file.name}`; img.loading = 'lazy'; imageBox.append(img); const caption = element('figcaption'); caption.append(element('strong', file.name), element('span', `${(file.size / 1024).toFixed(1)} KB · ${file.category.startsWith('marca.') ? 'Identidade visual' : 'Fachada'}`)); const controls = element('div', undefined, 'file-actions'); controls.append(download('Baixar arquivo', url, file.name)); if (file.category.startsWith('marca.')) { const toggle = element('button', 'Alternar fundo', 'button secondary'); toggle.type = 'button'; toggle.onclick = () => imageBox.classList.toggle('dark'); controls.append(toggle); } caption.append(controls); card.append(imageBox, caption); gallery.append(card); } materials.append(gallery); main.append(materials);
  const pending = section('pendencias', '04 · PARA CONFERIR E AVANÇAR', 'O que ainda precisa chegar.', 'Leitura documental da ABUHSCA, sujeita a alinhamento. Dez etapas marcadas não significam informação completa, permissão concedida ou material aprovado.');
  const list = element('div', undefined, 'pending-list'); data.pending.forEach((item, index) => { const card = element('article'); card.append(element('span', String(index + 1).padStart(2, '0'), 'index')); const text = element('div'); text.append(element('h3', item.title), element('p', item.text), element('small', `Alinhamento: ${item.owner}`)); card.append(text); list.append(card); }); pending.append(list); main.append(pending);
  const source = section('relatorio', '05 · DOCUMENTAÇÃO', 'O relatório de referência.', 'Relatório fornecido junto ao dossiê. Recomendações são propostas; não alteram o contrato ou o cronograma por si só.');
  source.append(download('Baixar relatório completo em PDF', pdf, data.report.name), element('p', `Fonte: ${data.sources.dossierName} · ${data.sources.reportName}`, 'source-note'), element('p', 'Credenciais e senhas do ZIP original foram excluídas desta página. Consulte o original em armazenamento privado e utilize permissões por convite nas plataformas.', 'security-note')); main.append(source);
  const footer = element('footer'); footer.append(element('strong', 'ABUHSCA × CONSTRUCEL'), element('p', 'Consulta privada · compartilhe somente com pessoas autorizadas. Guarde o link recebido para reabrir a página.')); app.append(footer);
  const copy = element('button', 'Copiar link privado', 'button secondary'); copy.type = 'button'; copy.onclick = async () => { try { await navigator.clipboard.writeText(`${location.origin}${location.pathname}#k=${activeKey}`); copy.textContent = 'Link privado copiado'; } catch { copy.textContent = 'Abra novamente o link privado recebido'; } }; footer.append(copy);
  gate.hidden = true; app.hidden = false; document.title = 'Dossiê de onboarding | ABUHSCA × Construcel'; window.scrollTo(0, 0);
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
