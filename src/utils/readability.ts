export interface ReadabilityResult {
  readingEase: number; // 0 - 100
  gradeLevel: number; // e.g. 6.5
  label: string; // e.g., "7th Grade (Ideal for Email)"
  gradeCategory: "very-easy" | "easy" | "fair" | "difficult";
  wordCount: number;
  sentenceCount: number;
  syllableCount: number;
  averageWordsPerSentence: number;
  recommendation: string;
}

export function countSyllablesInWord(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;

  // Replace common endings that don't add syllables
  const cleaned = w
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "")
    .replace(/^y/, "");

  const syllables = cleaned.match(/[aeiouy]{1,2}/g);
  return syllables ? Math.max(1, syllables.length) : 1;
}

export function calculateReadability(text: string): ReadabilityResult {
  if (!text || !text.trim()) {
    return {
      readingEase: 100,
      gradeLevel: 1,
      label: "Very Easy",
      gradeCategory: "very-easy",
      wordCount: 0,
      sentenceCount: 0,
      syllableCount: 0,
      averageWordsPerSentence: 0,
      recommendation: "Add copy to analyze readability.",
    };
  }

  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);

  const sentenceCount = Math.max(1, sentences.length);
  const wordCount = Math.max(1, words.length);

  let syllableCount = 0;
  words.forEach((w) => {
    syllableCount += countSyllablesInWord(w);
  });

  const wordsPerSentence = wordCount / sentenceCount;
  const syllablesPerWord = syllableCount / wordCount;

  // Flesch Reading Ease score formula
  let readingEase =
    206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord;
  readingEase = Math.min(100, Math.max(0, Math.round(readingEase)));

  // Flesch-Kincaid Grade Level formula
  let gradeLevel =
    0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59;
  gradeLevel = Math.max(1, Number(gradeLevel.toFixed(1)));

  let label = "";
  let gradeCategory: "very-easy" | "easy" | "fair" | "difficult" = "easy";
  let recommendation = "";

  if (readingEase >= 80) {
    label = `Grade ${Math.round(gradeLevel)} (Very Easy)`;
    gradeCategory = "very-easy";
    recommendation = "Excellent readability! Highly accessible for high-converting marketing campaigns.";
  } else if (readingEase >= 65) {
    label = `Grade ${Math.round(gradeLevel)} (Ideal for Email)`;
    gradeCategory = "easy";
    recommendation = "Optimal reading level for bulk email engagement (6th-8th grade level).";
  } else if (readingEase >= 50) {
    label = `Grade ${Math.round(gradeLevel)} (Fairly Readable)`;
    gradeCategory = "fair";
    recommendation = "Slightly complex copy. Consider shortening sentences to boost quick skimming.";
  } else {
    label = `Grade ${Math.round(gradeLevel)} (Complex / Dense)`;
    gradeCategory = "difficult";
    recommendation = "Difficult to skim. Simplify multi-syllable jargon and split long paragraphs.";
  }

  return {
    readingEase,
    gradeLevel,
    label,
    gradeCategory,
    wordCount,
    sentenceCount,
    syllableCount,
    averageWordsPerSentence: Number(wordsPerSentence.toFixed(1)),
    recommendation,
  };
}
