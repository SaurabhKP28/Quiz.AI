export function getTotalQuizTime(totalQuestions: number): number {
  if (totalQuestions < 5) return 2 * 60;   // 2 minutes
  if (totalQuestions === 5) return 3 * 60; // 3 minutes
  return 5 * 60;                           // 6–10 questions
}
