export type StructureSuggestion = {
  id: string;
  pattern: string;
  meaning: string;
  sentence: string;
};

export type SavedStructure = {
  id: string;
  english: string;
  meaning: string;
};

const expandContractions = (text: string) =>
  text
    .replace(/[’‘]/g, "'")
    .replace(/\bi'm\b/gi, 'I am')
    .replace(/\b(you|we|they)'re\b/gi, '$1 are')
    .replace(/\b(he|she|it)'s\b/gi, '$1 is')
    .replace(/\b(i|you|we|they|he|she|it)'ll\b/gi, '$1 will')
    .replace(/\b(i|you|we|they|he|she|it)'ve\b/gi, '$1 have')
    .replace(/\bcan't\b/gi, 'can not')
    .replace(/\bcannot\b/gi, 'can not')
    .replace(/\bwon't\b/gi, 'will not')
    .replace(
      /\b(could|should|would|must|is|are|was|were|has|have|had|do|does|did)n't\b/gi,
      '$1 not',
    );

const canonicalWord = (word: string) => {
  if (/^(?:am|is|are|was|were|been|being)$/i.test(word)) return 'be';
  if (/^(?:has|had)$/i.test(word)) return 'have';
  if (/^(?:does|did)$/i.test(word)) return 'do';
  return word.toLowerCase();
};

const placeholders = new Set([
  's',
  'subject',
  'n',
  'noun',
  'v',
  'verb',
  'v-ing',
  'ving',
  'v-ed',
  'ved',
  'v2',
  'v3',
  'adj',
  'adjective',
  'adv',
  'adverb',
  'object',
  'o',
  'something',
  'someone',
]);

const isPlaceholder = (word: string) =>
  placeholders.has(word.toLowerCase().replace(/\s+/g, ''));

const savedStructureMatches = (sentence: string, pattern: string) => {
  const normalizedSentence = expandContractions(sentence).toLowerCase();
  let normalizedPattern = pattern
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\bto\s+be\b/g, 'be');

  const pairedPhrases = normalizedPattern.match(
    /\b([a-z]+)\s+([a-z]+)\s*\/\s*([a-z]+)\s+([a-z]+)\b/,
  );
  if (pairedPhrases && /\bbe\b/.test(normalizedPattern)) {
    const [, firstWord, firstLink, secondWord, secondLink] = pairedPhrases;
    return new RegExp(
      `\\b(?:am|is|are|was|were|been|being)\\s+(?:(?:very|really|quite|so|too|rather|pretty)\\s+)*(?:${firstWord}\\s+${firstLink}|${secondWord}\\s+${secondLink})\\b`,
      'i',
    ).test(normalizedSentence);
  }

  const alternativeGroups: string[][] = [];
  normalizedPattern = normalizedPattern.replace(
    /\b([a-z]+(?:-[a-z]+)?)\s*\/\s*([a-z]+(?:-[a-z]+)?)\b/g,
    (_, first: string, second: string) => {
      if (!isPlaceholder(first) || !isPlaceholder(second)) {
        alternativeGroups.push([canonicalWord(first), canonicalWord(second)]);
      }
      return ' ';
    },
  );

  const anchors = [
    ...new Set(
      (normalizedPattern.match(/[a-z]+(?:-[a-z]+)?/g) ?? [])
        .filter((word) => !isPlaceholder(word))
        .map(canonicalWord),
    ),
  ];
  if (!anchors.length && !alternativeGroups.length) return false;

  const sentenceWords = new Set(
    (normalizedSentence.match(/[a-z]+(?:-[a-z]+)?/g) ?? []).map(canonicalWord),
  );
  return (
    anchors.every((word) => sentenceWords.has(word)) &&
    alternativeGroups.every((group) =>
      group.some((word) => sentenceWords.has(word)),
    )
  );
};

export const detectStructures = (
  text: string,
  savedStructures: SavedStructure[] = [],
): StructureSuggestion[] => {
  const sentences = (text.slice(0, 50000).match(/[^.!?\n]+[.!?]?/g) ?? [])
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const seenPatterns = new Set<string>();
  const results: StructureSuggestion[] = [];

  for (const structure of savedStructures) {
    const pattern = structure.english.trim();
    const normalizedPattern = pattern.toLocaleLowerCase();
    if (!pattern || seenPatterns.has(normalizedPattern)) continue;
    const sentence = sentences.find((item) =>
      savedStructureMatches(item, pattern),
    );
    if (!sentence) continue;

    seenPatterns.add(normalizedPattern);
    results.push({
      id: `saved:${structure.id}`,
      pattern,
      meaning:
        structure.meaning.trim() || 'Cấu trúc bạn đã lưu trong sổ bài học.',
      sentence,
    });
  }

  return results;
};
