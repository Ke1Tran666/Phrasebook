import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { detectStructures } from '@/structures';

const ids = (text: string) => detectStructures(text).map((item) => item.id);

describe('local structure suggestions', () => {
  for (const [sentence, expected] of [
    ['I’m going to go home.', 'going-to'],
    ["She's going to study tonight.", 'going-to'],
    ['They are not going to travel.', 'going-to'],
    ['I would like to learn English.', 'would-like'],
    ["I'd like to learn English.", 'would-like'],
    ['We used to live here.', 'used-to'],
    ['She has to work today.', 'have-to'],
    ['Could you give me a hand?', 'request'],
    ['You should practice every day.', 'modal'],
    ["I can't speak English.", 'modal'],
    ["We'll visit tomorrow.", 'modal'],
  ]) {
    it(`recognizes: ${sentence}`, () =>
      assert.deepEqual(ids(sentence), [expected]));
  }
  for (const sentence of [
    '',
    '   ',
    'Hello world.',
    'I am going to school.',
    'She is going to London.',
    'I am used to work.',
    'I used to working here.',
    'My going to go home.',
    'Could you give me a hand.',
    'I have two books.',
  ]) {
    it(`does not guess an unsupported structure: ${JSON.stringify(sentence)}`, () =>
      assert.deepEqual(ids(sentence), []));
  }
  it('keeps the original sentence and deduplicates repeated patterns', () => {
    const result = detectStructures(
      'I’m going to go home. We are going to study. You should practice.',
    );
    assert.deepEqual(
      result.map((item) => item.id),
      ['going-to', 'modal'],
    );
    assert.equal(result[0].sentence, 'I’m going to go home.');
  });
  it('does not match across sentence boundaries', () => {
    assert.deepEqual(ids('I am going to. Go home.'), []);
  });
  it('supports mixed case and repeated whitespace', () => {
    assert.deepEqual(ids('I AM   GOING TO   STUDY.'), ['going-to']);
  });
  it('does not conflate be used to with a past habit', () => {
    assert.deepEqual(ids('I am used to working late.'), []);
  });
});
