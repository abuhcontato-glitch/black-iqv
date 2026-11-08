import { test } from 'node:test';
import assert from 'node:assert/strict';
import { onboarding, cycles, meetings, publications, campaigns, milestones, captureWindows, addDays, kickoffCalendar, scheduleCsv, weekdayLabel } from '../src/onboardingData.ts';

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

test('calendar stays within the contracted eight Instagram publications per cycle', () => {
  assert.equal(publications.length, 24);
  assert.equal(new Set(publications.map(item => item.id)).size, 24);
  for (const cycle of cycles) {
    const posts = publications.filter(item => item.cycle === cycle.number);
    assert.equal(posts.length, 8);
    assert.equal(new Set(posts.map(item => item.date)).size, 8);
    assert(posts[0].date > captureWindows[cycle.number - 1].date, 'publication follows the proposed client capture window');
    for (const post of posts) {
      assert(post.date >= cycle.start && post.date <= cycle.end);
      assert.equal(post.status, 'proposed');
      assert.equal(post.time, '12:00');
      assert(!['sábado', 'domingo'].includes(weekdayLabel(post.date)));
    }
  }
  assert(campaigns.every(item => item.status === 'proposed'));
});

test('calendar download contains the real start instant without inventing a meeting end time', () => {
  const calendar = kickoffCalendar(new Date('2026-11-08T12:00:00Z'));
  assert(calendar.startsWith('BEGIN:VCALENDAR\r\n'));
  assert(calendar.includes('DTSTART:20261109T140000Z\r\n'));
  assert(calendar.includes('DTSTAMP:20261108T120000Z\r\n'));
  assert(!calendar.includes('DTEND:'));
  assert(!calendar.includes('DURATION:'));
  assert(calendar.includes('STATUS:CONFIRMED'));
  assert.equal(calendar.match(/BEGIN:VEVENT/g).length, 1);
  for (const line of calendar.split('\r\n')) assert(Buffer.byteLength(line, 'utf8') <= 75);
  assert.match(calendar.replace(/\r\n /g, ''), /Duração a combinar/);
});

test('CSV preserves proposed statuses and identifies client recordings as client work', () => {
  const csv = scheduleCsv();
  assert.equal(csv.charCodeAt(0), 0xfeff);
  const rows = csv.slice(1).split('\r\n');
  assert.equal(rows.length, 1 + meetings.length + publications.length + campaigns.length + captureWindows.length + milestones.length);
  assert.equal(rows.filter(row => row.includes('"Confirmada"')).length, 1);
  assert.equal(rows.filter(row => row.startsWith('"Gravação pela cliente"')).length, 3);
  assert(csv.includes('não é captação presencial da agência'));
});
