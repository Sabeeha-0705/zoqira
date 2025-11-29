const fillerWords = ["um", "uh", "hmm", "erm", "mm", "ah"];

function countFillerWords(text) {
  const words = text.toLowerCase().split(/\s+/);
  let count = 0;
  for (const w of words) if (fillerWords.includes(w)) count++;
  return count;
}

function compareWords(expected = "", actual = "") {
  const expWords = expected.trim().split(/\s+/);
  const actWords = actual.trim().split(/\s+/);
  const issues = [];
  const len = Math.max(expWords.length, actWords.length);
  for (let i = 0; i < len; i++) {
    const e = expWords[i] || "";
    const a = actWords[i] || "";
    if (e.toLowerCase() !== a.toLowerCase()) {
      issues.push({ word: a || null, expected: e || null, type: "mismatch" });
    }
  }
  return issues;
}

function computeFluency(text, durationSeconds) {
  if (!durationSeconds || durationSeconds <= 0)
    return { wpm: 0, hesitationRatio: 0 };
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wpm = (words / durationSeconds) * 60;
  // simple hesitation ratio: filler words / total words
  const fillers = countFillerWords(text);
  const hesitationRatio = words ? fillers / words : 0;
  return {
    wpm: Math.round(wpm),
    hesitationRatio: Number(hesitationRatio.toFixed(3)),
  };
}

function scorePronunciation(expected, actual, durationSeconds) {
  const wordIssues = compareWords(expected, actual);
  const fillerCount = countFillerWords(actual);
  const fluency = computeFluency(actual, durationSeconds);
  // Basic scoring heuristics
  const mismatchPenalty = Math.min(50, wordIssues.length * 5);
  const fillerPenalty = Math.min(20, fillerCount * 2);
  let base =
    100 - mismatchPenalty - fillerPenalty - fluency.hesitationRatio * 20;
  base = Math.max(0, Math.round(base));
  return {
    pronunciation: base,
    fluency: Math.max(0, 100 - Math.round(fluency.hesitationRatio * 100)),
    grammar: 100 - Math.min(40, wordIssues.length * 2),
    fillerWordsCount: fillerCount,
    wordIssues,
    fluencyMetrics: fluency,
  };
}

module.exports = {
  countFillerWords,
  compareWords,
  computeFluency,
  scorePronunciation,
};
