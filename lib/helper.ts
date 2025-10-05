type score = {
  id: number,
  impact: number,
  creativity: number,
  presentation: number,
  relevance: number,
  validity: number,
  judgeId: number,
  judgeName: string
}
export const calcScore = (scores: score[]) => {
  if (scores.length === 0) return 0;
  const total = scores.reduce((sum, s) => {
    return sum + s.impact + s.creativity + s.presentation + s.relevance + s.validity;
  }, 0);
  return Math.round(total / scores.length / 5); // average score per category
}