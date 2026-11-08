import { test } from 'node:test';
import assert from 'node:assert/strict';
import { onboarding, cycles, meetings, publications, pieceSchedule, contentDistribution, campaigns, milestones, captureWindows, addDays, kickoffCalendar, scheduleCsv, weekdayLabel, commercialTemplateCsv, handoverTemplate, accessItems } from '../src/onboardingData.ts';

test('kickoff is Monday November 9 at 11h Brasília and later meetings remain proposals', () => {
  assert.equal(weekdayLabel(onboarding.startDate), 'segunda-feira');
  assert.equal(new Date(onboarding.kickoffInstant).toISOString(), '2026-11-09T14:00:00.000Z');
  assert.equal(meetings.length, 3);
  assert.deepEqual(meetings.filter(meeting => meeting.status === 'confirmed').map(meeting => meeting.id), ['kickoff']);
  assert(meetings.slice(1).every(meeting => meeting.status === 'proposed'));
});

test('three contiguous 30-day cycles cover exactly 90 inclusive days across the year boundary', () => {
  assert.equal(cycles.length, 3);
  assert.equal(cycles[0].start, '2026-11-09');
  for (const [index, cycle] of cycles.entries()) {
    assert.equal(addDays(cycle.start, 29), cycle.end);
    if (index > 0) assert.equal(addDays(cycles[index - 1].end, 1), cycle.start);
  }
  assert.equal(cycles.at(-1).end, '2027-02-06');
});

test('calendar covers the current contracted twelve official topics per cycle', () => {
  assert.equal(publications.length, 36);
  assert.equal(new Set(publications.map(item => item.id)).size, 36);
  for (const cycle of cycles) {
    const posts = publications.filter(item => item.cycle === cycle.number);
    assert.equal(posts.length, 12);
    if (cycle.number === 1) {
      assert(posts.every(post => post.date === '' && post.time === 'A definir'));
      continue;
    }
    assert.equal(new Set(posts.map(item => item.date)).size, 12);
    assert(posts[0].date > captureWindows[cycle.number - 1].date, 'publication follows the proposed client capture window');
    for (const post of posts) {
      assert(post.date >= cycle.start && post.date <= cycle.end);
      assert.equal(post.status, 'proposed');
      assert(['12:00', '18:00'].includes(post.time));
      assert(!['sábado', 'domingo'].includes(weekdayLabel(post.date)));
    }
  }
  assert(campaigns.every(item => item.status === 'proposed'));
});

test('calendar download contains the confirmed one-hour meeting and Google Meet link', () => {
  const calendar = kickoffCalendar(new Date('2026-11-08T12:00:00Z'));
  assert(calendar.startsWith('BEGIN:VCALENDAR\r\n'));
  assert(calendar.includes('DTSTART:20261109T140000Z\r\n'));
  assert(calendar.includes('DTSTAMP:20261108T120000Z\r\n'));
  assert(calendar.includes('DTEND:20261109T150000Z\r\n'));
  assert(calendar.includes('URL:https://meet.google.com/dur-zzzs-mtj'));
  assert(!calendar.includes('DURATION:'));
  assert(calendar.includes('STATUS:CONFIRMED'));
  assert.equal(calendar.match(/BEGIN:VEVENT/g).length, 1);
  for (const line of calendar.split('\r\n')) assert(Buffer.byteLength(line, 'utf8') <= 75);
  assert.match(calendar.replace(/\r\n /g, ''), /Das 11h às 12h/);
});

test('CSV preserves proposed statuses and identifies client recordings as client work', () => {
  const csv = scheduleCsv();
  assert.equal(csv.charCodeAt(0), 0xfeff);
  const rows = csv.slice(1).split('\r\n');
  assert.equal(rows.length, 1 + meetings.length + pieceSchedule.length + campaigns.length + captureWindows.length + milestones.length);
  assert.equal(rows.filter(row => row.includes('"Confirmada"')).length, 1);
  assert.equal(rows.filter(row => row.startsWith('"Gravação pela cliente"')).length, 2);
  assert.equal(rows.filter(row => row.startsWith('"Visita a acordar"')).length, 1);
  assert(csv.includes('Não há visita já agendada'));
  assert(csv.includes('Produção no mês 1 — veiculação sem data'));
});


test('100 shared pieces per cycle include 12 official topics and daily Stories without double counting', () => {
  assert.equal(pieceSchedule.length, 300);
  assert.equal(new Set(pieceSchedule.map(piece => piece.id)).size, 300);
  assert.equal(contentDistribution.reduce((sum, item) => sum + item.quantity, 0), 100);
  for (const cycle of cycles) {
    const pieces = pieceSchedule.filter(item => item.cycle === cycle.number);
    assert.equal(pieces.length, 100);
    assert(pieces.every(piece => piece.status === 'proposed'));
    if (cycle.number === 1) assert(pieces.every(piece => piece.date === '' && piece.time === 'A definir'));
    else assert(pieces.every(piece => piece.date >= cycle.start && piece.date <= cycle.end));
    assert.equal(pieces.filter(piece => ['Feed Instagram', 'Reels Instagram'].includes(piece.channel)).length, 12);
    if (cycle.number > 1) assert.equal(new Set(pieces.filter(piece => piece.channel === 'Stories Instagram').map(piece => piece.date)).size, 30);
    for (const channel of contentDistribution) assert.equal(pieces.filter(piece => piece.channel === channel.channel).length, channel.quantity);
  }
});


test('rephased operation does not promise November publication or advertising and preserves contracted production', () => {
  assert.equal(pieceSchedule.filter(piece => piece.cycle === 1).length, 100);
  assert(pieceSchedule.filter(piece => piece.cycle === 1).every(piece => !piece.date));
  assert(campaigns.every(campaign => campaign.date >= cycles[1].start));
  assert.equal(captureWindows[0].cycle, 1);
  assert.match(captureWindows[0].detail, /acordar|confirmar/);
});

test('handover covers platforms and commercial template separates ten closed months without fabricated numbers', () => {
  for (const id of ['domain', 'hosting', 'google-ads', 'google-profile', 'meta', 'instagram', 'whatsapp', 'tiktok', 'drive']) assert(accessItems.some(item => item.id === id));
  const rows = commercialTemplateCsv().slice(1).split('\r\n').map(row => row.split(';'));
  assert.equal(rows.length, 11);
  assert.equal(rows[1][0], '2026-01');
  assert.equal(rows.at(-1)[0], '2026-10');
  assert(rows.slice(1).every(row => row.slice(1).every(cell => cell === '')));
  assert.match(handoverTemplate(), /Agosto, setembro e outubro/);
  assert.match(handoverTemplate(), /não inclua senhas/);
});
