import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const scripts = JSON.parse(await readFile(new URL('../src/studio/data/option-b-scripts.json', import.meta.url), 'utf8'));
const source = await readFile(new URL('../docs/black-iqv/opcao-b-roteiro-cliente.md', import.meta.url), 'utf8');
const normalize = text => text.replaceAll('**','').replaceAll('\\\n','\n').trim();

test('latest client scripts preserve all 40 scenes and dialogue attribution in narrative order', () => {
  assert.deepEqual(scripts.map(film => film.id), ['02','03','04','05']);
  for (const film of scripts) {
    const start = source.indexOf(`## FILME ${film.id} —`);
    const end = source.indexOf('## FILME ', start + 1);
    const original = source.slice(start, end < 0 ? source.indexOf('## A progressão') : end);
    assert(original.includes(film.title));
    assert.equal(film.scenes.length, 10);
    let cursor = 0;
    for (const [index, scene] of film.scenes.entries()) {
      assert.equal(scene.n, index + 1);
      const body = original.indexOf(scene.title, cursor);
      assert(body >= cursor, `${film.id}: scene ${scene.n} order`);
      cursor = body + scene.title.length;
      assert(normalize(original).includes(scene.script), `${film.id}: scene ${scene.n} full script preserved`);
      for (const dialogue of scene.dialogue) {
        assert(scene.script.includes(`${dialogue.speaker}: ${dialogue.text}`));
      }
    }
    assert.equal(film.scenes[0].range, '00:00–00:08');
    assert.equal(film.scenes[9].range, '01:12–01:20');
  }
});

test('launch offer preserves approval placeholders and no-speaking scenes stay without invented dialogue', () => {
  const launch = scripts.find(film => film.id === '05');
  assert.equal(launch.scenes[0].dialogue.length, 0);
  assert.equal(launch.scenes[4].dialogue.length, 0);
  assert(launch.scenes[9].lettering.includes('[PREÇO PROMOCIONAL APROVADO]'));
  assert(launch.scenes[9].lettering.includes('[LINK OFICIAL DE COMPRA]'));
  assert(!scripts.some(film => film.scenes.some(scene => scene.script.includes('R$'))));
});

test('all five Option B boards are real PNG sheets with ten visual cells', async () => {
  for (let film = 1; film <= 5; film++) {
    const data = await readFile(new URL(`../public/media/black-iqv/opcao-b/F0${film}.png`, import.meta.url));
    assert.equal(data.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    const width = data.readUInt32BE(16), height = data.readUInt32BE(20);
    assert(width >= 1900 && height >= 700);
    assert(width / 5 >= 380 && height / 2 >= 350);
    assert(data.length > 100000);
  }
});
