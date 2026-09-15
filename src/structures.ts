export type StructureSuggestion = {
  id: string;
  pattern: string;
  meaning: string;
  sentence: string;
};

// A conservative vocabulary avoids treating destinations ("going to school")
// or nouns ("have to school") as infinitive verbs. Unknown verbs are skipped.
const verbs = new Set(
  'be have do go come get give take make learn study work help read write speak listen watch eat drink sleep buy sell call meet visit play run walk travel cook clean start stop try use need want see say tell know think feel find leave live move open close save practice remember understand bring put keep'.split(
    ' ',
  ),
);
const subject = '(?:i|you|we|they|he|she|it)';
const rules = [
  {
    id: 'going-to',
    pattern: 'S + be going to + V',
    meaning: 'Diễn tả dự định hoặc dự đoán có căn cứ.',
    regex: new RegExp(
      `\\b${subject}\\s+(?:am|is|are)\\s+(?:not\\s+)?going\\s+to\\s+([a-z]+)\\b`,
      'i',
    ),
  },
  {
    id: 'would-like',
    pattern: 'S + would like to + V',
    meaning: 'Diễn tả mong muốn một cách lịch sự.',
    regex: new RegExp(
      `\\b${subject}\\s+would\\s+like\\s+to\\s+([a-z]+)\\b`,
      'i',
    ),
  },
  {
    id: 'used-to',
    pattern: 'S + used to + V',
    meaning:
      'Diễn tả thói quen hoặc trạng thái trong quá khứ, thường không còn ở hiện tại.',
    regex: new RegExp(`\\b${subject}\\s+used\\s+to\\s+([a-z]+)\\b`, 'i'),
  },
  {
    id: 'have-to',
    pattern: 'S + have/has to + V',
    meaning: 'Diễn tả sự cần thiết hoặc nghĩa vụ.',
    regex: new RegExp(
      `\\b${subject}\\s+(?:have|has)\\s+to\\s+([a-z]+)\\b`,
      'i',
    ),
  },
  {
    id: 'request',
    pattern: 'Could/Would/Can/Will + you + V …?',
    meaning: 'Có thể dùng để nhờ ai làm việc gì; cần xem ngữ cảnh của câu hỏi.',
    regex: /\b(?:could|would|can|will)\s+you\s+([a-z]+)\b/i,
  },
  {
    id: 'modal',
    pattern: 'S + modal verb + V',
    meaning:
      'Động từ khuyết thiếu (can, could, should, must, may, might, will, would) đi với động từ nguyên mẫu; nghĩa tùy từ và ngữ cảnh.',
    regex: new RegExp(
      `\\b${subject}\\s+(?:can|could|should|must|may|might|will|would)\\s+(?:not\\s+)?([a-z]+)\\b`,
      'i',
    ),
  },
];

const expandContractions = (text: string) =>
  text
    .replace(/[’‘]/g, "'")
    .replace(/\bi'm\b/gi, 'I am')
    .replace(/\b(you|we|they)'re\b/gi, '$1 are')
    .replace(/\b(he|she|it)'s\s+(?=(?:not\s+)?going\b)/gi, '$1 is ')
    .replace(/\b(i|you|we|they|he|she|it)'ll\b/gi, '$1 will')
    .replace(/\b(i|you|we|they|he|she|it)'d\s+like\b/gi, '$1 would like')
    .replace(/\bcan't\b/gi, 'can not')
    .replace(/\bcannot\b/gi, 'can not')
    .replace(/\bwon't\b/gi, 'will not')
    .replace(/\b(could|should|would|must|is|are)n't\b/gi, '$1 not');

export const detectStructures = (text: string): StructureSuggestion[] => {
  const results: StructureSuggestion[] = [];
  const seen = new Set<string>();
  for (const raw of text.slice(0, 50000).match(/[^.!?\n]+[.!?]?/g) ?? []) {
    const sentence = raw.trim();
    const normalized = expandContractions(sentence);
    for (const rule of rules) {
      const match = rule.regex.exec(normalized);
      if (!match || !verbs.has(match[1].toLowerCase())) continue;
      if (rule.id === 'request' && !sentence.endsWith('?')) continue;
      // "would like" has a more useful specific explanation than the modal rule.
      if (rule.id === 'modal' && /\bwould\s+like\s+to\b/i.test(normalized))
        continue;
      if (seen.has(rule.id)) continue;
      seen.add(rule.id);
      results.push({
        id: rule.id,
        pattern: rule.pattern,
        meaning: rule.meaning,
        sentence,
      });
    }
  }
  return results;
};
