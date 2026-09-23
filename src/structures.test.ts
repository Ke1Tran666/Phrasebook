import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { detectStructures, type SavedStructure } from '@/structures';

const structure = (
  english: string,
  id = 'structure-1',
  meaning = 'Cách dùng đã lưu.',
): SavedStructure => ({ id, english, meaning });

describe('saved structure suggestions', () => {
  it('does not use built-in structures', () => {
    assert.deepEqual(detectStructures("I'm going to drive to work."), []);
    assert.deepEqual(detectStructures('She has finished her homework.'), []);
    assert.deepEqual(detectStructures('Could you help me?'), []);
  });

  it('recognizes a structure added after the phrase', () => {
    const phrase = 'He is very bad at English.';
    assert.deepEqual(detectStructures(phrase), []);

    const result = detectStructures(phrase, [
      structure(
        'To be good at/ bad at + N/ V-ing',
        'good-at',
        'Giỏi về hoặc kém về một việc.',
      ),
    ]);
    assert.deepEqual(
      result.map((item) => item.id),
      ['saved:good-at'],
    );
    assert.equal(result[0].meaning, 'Giỏi về hoặc kém về một việc.');
  });

  it('recognizes a saved pattern with grammar placeholders', () => {
    assert.deepEqual(
      detectStructures("I'm going to drive to work.", [
        structure('S + be going to + V', 'going-to'),
      ]).map((item) => item.id),
      ['saved:going-to'],
    );
  });

  it('supports simple alternatives in a saved pattern', () => {
    const saved = [structure('S + can/could + V', 'modal-choice')];
    assert.equal(detectStructures('I can swim.', saved).length, 1);
    assert.equal(detectStructures('We could wait.', saved).length, 1);
    assert.equal(detectStructures('I should leave.', saved).length, 0);
  });

  it('does not match when a required part is missing', () => {
    const saved = [structure('To be good at/ bad at + N/ V-ing')];
    assert.deepEqual(detectStructures('English is very bad.', saved), []);
  });

  it('deduplicates equivalent saved patterns', () => {
    const result = detectStructures('I am good at swimming.', [
      structure('To be good at/ bad at + N/ V-ing', 'first'),
      structure('to be good at/ bad at + n/ v-ing', 'second'),
    ]);
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 'saved:first');
  });

  it('keeps the matching sentence from a passage', () => {
    const result = detectStructures(
      'I like music. She is really good at singing.',
      [structure('To be good at/ bad at + N/ V-ing')],
    );
    assert.equal(result[0].sentence, 'She is really good at singing.');
  });
});
