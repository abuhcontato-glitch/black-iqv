import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const plan = JSON.parse(await readFile(new URL('../src/studio/data/storyboard-plan.json', import.meta.url), 'utf8'));
const images = JSON.parse(await readFile(new URL('../src/studio/data/storyboard-images.json', import.meta.url), 'utf8'));

test('five films contain ten planned sequences and three described frames each', () => {
  assert.equal(plan.length, 50);
  for (let film = 1; film <= 5; film++) {
    const sequences = plan.filter(item => item.film === film);
    assert.deepEqual(sequences.map(item => item.sequence), [1,2,3,4,5,6,7,8,9,10]);
    for (const sequence of sequences) {
      assert.equal(sequence.frames.length, 3);
      assert.equal(sequence.shots.length, 3);
      assert(sequence.title.trim());
      for (const shot of sequence.shots) {
        assert(shot.frame.trim());
        assert(shot.action.trim());
        assert(shot.lens.trim());
      }
    }
  }
});

test('all 150 panels resolve to distinct sequence sheets with real PNG image data', async () => {
  assert.equal(Object.keys(images).length, 50);
  assert.equal(new Set(Object.values(images)).size, 50);
  for (const sequence of plan) {
    const key = `F${String(sequence.film).padStart(2, '0')}-S${String(sequence.sequence).padStart(2, '0')}`;
    const relative = images[key];
    assert(relative?.endsWith(`/${key}.png`), key);
    assert(!relative.includes('..'));
    const data = await readFile(new URL(`../public/${relative}`, import.meta.url));
    assert.equal(data.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', key);
    assert(data.readUInt32BE(16) >= 1200, `${key}: sheet width`);
    assert(data.readUInt32BE(20) >= 700, `${key}: sheet height`);
    assert(data.readUInt32BE(16) > data.readUInt32BE(20), `${key}: horizontal triptych layout`);
    assert(data.length > 10000, `${key}: image payload`);
  }
});
