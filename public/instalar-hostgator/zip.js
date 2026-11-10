export function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
export function inspectZip(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const end = bytes.length - 22;
  if (end < 0 || view.getUint32(end, true) !== 0x06054b50 || view.getUint16(end + 20, true) !== 0 || view.getUint16(end + 4, true) !== 0 || view.getUint16(end + 6, true) !== 0) throw new Error('Pacote base inválido.');
  const count = view.getUint16(end + 10, true), size = view.getUint32(end + 12, true), start = view.getUint32(end + 16, true);
  if (count === 0xffff || start + size !== end || count !== view.getUint16(end + 8, true)) throw new Error('Formato de pacote não suportado.');
  let position = start;
  const records = [];
  for (let index = 0; index < count; index++) {
    if (position + 46 > end || view.getUint32(position, true) !== 0x02014b50) throw new Error('Índice do pacote inválido.');
    const nameLength = view.getUint16(position + 28, true), extra = view.getUint16(position + 30, true), comment = view.getUint16(position + 32, true);
    const length = 46 + nameLength + extra + comment;
    if (position + length > end) throw new Error('Índice incompleto.');
    records.push({ position, length, name: new TextDecoder().decode(bytes.subarray(position + 46, position + 46 + nameLength)) });
    position += length;
  }
  if (position !== end) throw new Error('Índice inconsistente.');
  return { start, size, count, records };
}
export async function privateZip(entries) {
  const dataChunks = [], records = [];
  let offset = 0, indexSize = 0;
  for (const entry of entries) {
    const name = new TextEncoder().encode(entry.name), data = new TextEncoder().encode(entry.content), crc = crc32(data);
    const local = new Uint8Array(30 + name.length), v = new DataView(local.buffer);
    v.setUint32(0, 0x04034b50, true); v.setUint16(4, 20, true); v.setUint16(6, 0x800, true); v.setUint16(12, 33, true);
    v.setUint32(14, crc, true); v.setUint32(18, data.length, true); v.setUint32(22, data.length, true); v.setUint16(26, name.length, true); local.set(name, 30);
    dataChunks.push(local, data);
    const central = new Uint8Array(46 + name.length), c = new DataView(central.buffer);
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, (3 << 8) | 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x800, true); c.setUint16(14, 33, true);
    c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, name.length, true);
    c.setUint32(38, (0o100600 * 65536) >>> 0, true); c.setUint32(42, offset, true); central.set(name, 46);
    records.push(central); offset += local.length + data.length; indexSize += central.length;
  }
  const end = new Uint8Array(22), v = new DataView(end.buffer);
  v.setUint32(0, 0x06054b50, true); v.setUint16(8, entries.length, true); v.setUint16(10, entries.length, true); v.setUint32(12, indexSize, true); v.setUint32(16, offset, true);
  return new Uint8Array(await new Blob([...dataChunks, ...records, end]).arrayBuffer());
}
export function appendPrivateZip(base, addition) {
  const source = inspectZip(base), extra = inspectZip(addition);
  if (source.count + extra.count >= 0xffff) throw new Error('Quantidade de arquivos não suportada.');
  const existing = new Set(source.records.map(record => record.name));
  for (const record of source.records) {
    if (record.name.includes('\\') || record.name.split('/').some(part => part === '..' || part === '.')) throw new Error('Caminho inválido no pacote.');
    if (!record.name.startsWith('public_html/onboarding-construcel/') && !record.name.startsWith('abuhsca-onboarding-private/')) throw new Error('Estrutura do instalador inválida.');
    if (record.name.endsWith('/config.php') || record.name.endsWith('/CONVITES-PRIVADOS.txt')) throw new Error('O pacote base não pode conter convites ou configuração privada.');
  }
  const central = addition.slice(extra.start, extra.start + extra.size), c = new DataView(central.buffer);
  for (const record of extra.records) {
    if (!['abuhsca-onboarding-private/config.php', 'abuhsca-onboarding-private/CONVITES-PRIVADOS.txt'].includes(record.name)) throw new Error('Caminho privado inválido.');
    if (existing.has(record.name)) throw new Error('Arquivo privado duplicado.');
    const position = record.position - extra.start;
    c.setUint32(position + 42, c.getUint32(position + 42, true) + source.start, true);
  }
  const end = new Uint8Array(22), v = new DataView(end.buffer);
  v.setUint32(0, 0x06054b50, true); v.setUint16(8, source.count + extra.count, true); v.setUint16(10, source.count + extra.count, true);
  v.setUint32(12, source.size + extra.size, true); v.setUint32(16, source.start + extra.start, true);
  return new Blob([base.subarray(0, source.start), addition.subarray(0, extra.start), base.subarray(source.start, source.start + source.size), central, end], { type: 'application/zip' });
}
