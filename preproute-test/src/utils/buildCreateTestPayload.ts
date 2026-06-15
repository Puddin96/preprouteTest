import type { Question, TestDraft } from '../types/testCreation.ts'

export type CreateTestPayload = {
  name: string
  type: string
  subject: string
  topics: string[]
  sub_topics: string[]
  correct_marks: number
  wrong_marks: number
  unattempt_marks: number
  difficulty: string
  total_time: number
  total_marks: number
  total_questions: number
  status: null
}

const TEST_TYPE_TO_API: Record<string, string> = {
  'Chapter Wise': 'practice',
  PYQ: 'pyq',
  'Mock Test': 'mock',
}

function collectUniqueIds(...values: (string | undefined)[]): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value)))]
}

export function buildCreateTestPayload(
  draft: TestDraft,
  questions: Question[],
): CreateTestPayload {
  return {
    name: draft.testName,
    type: TEST_TYPE_TO_API[draft.testType] ?? draft.testType.toLowerCase(),
    subject: draft.subjectId,
    topics: collectUniqueIds(draft.topicId, ...questions.map((q) => q.topicId)),
    sub_topics: collectUniqueIds(draft.subTopicId, ...questions.map((q) => q.subTopicId)),
    correct_marks: Number(draft.correctAnswer) || 0,
    wrong_marks: Number(draft.wrongAnswer) || 0,
    unattempt_marks: Number(draft.unattempted) || 0,
    difficulty: draft.difficulty,
    total_time: Number(draft.duration) || 0,
    total_marks: Number(draft.totalMarks) || 0,
    total_questions: Number(draft.numQuestions) || 0,
    status: null,
  }
}
