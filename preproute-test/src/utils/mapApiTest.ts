import type { TestDraft } from '../types/testCreation.ts'

export type ApiTest = {
  _id?: string
  id?: string
  name?: string
  type?: string
  subject?: string
  topics?: string[]
  sub_topics?: string[]
  correct_marks?: number
  wrong_marks?: number
  unattempt_marks?: number
  difficulty?: string
  total_time?: number
  total_marks?: number
  total_questions?: number
  status?: string | null
  createdAt?: string
  created_at?: string
}

export type TrackedTest = {
  id: string
  draft: TestDraft
  createdAt: string
  status: string | null
  totalQuestions: number
}

const API_TYPE_TO_UI: Record<string, string> = {
  practice: 'Chapter Wise',
  pyq: 'PYQ',
  mock: 'Mock Test',
}

export function toApiTestList(data: unknown): ApiTest[] {
  const items = Array.isArray(data)
    ? data
    : Array.isArray((data as { data?: unknown })?.data)
      ? (data as { data: unknown[] }).data
      : []

  return items.filter((item): item is ApiTest => Boolean(item) && typeof item === 'object')
}

export function mapApiTestToTrackedTest(test: ApiTest): TrackedTest | null {
  const id = String(test._id ?? test.id ?? '')
  if (!id) return null

  return {
    id,
    createdAt: test.createdAt ?? test.created_at ?? new Date().toISOString(),
    status: test.status ?? null,
    totalQuestions: test.total_questions ?? 0,
    draft: {
      testType: API_TYPE_TO_UI[test.type ?? ''] ?? test.type ?? 'Chapter Wise',
      subjectId: test.subject ?? '',
      testName: test.name ?? '',
      topicId: test.topics?.[0] ?? '',
      subTopicId: test.sub_topics?.[0] ?? '',
      duration: String(test.total_time ?? ''),
      difficulty: test.difficulty ?? '',
      wrongAnswer: String(test.wrong_marks ?? ''),
      unattempted: String(test.unattempt_marks ?? ''),
      correctAnswer: String(test.correct_marks ?? ''),
      numQuestions: String(test.total_questions ?? ''),
      totalMarks: String(test.total_marks ?? ''),
    },
  }
}

export function getIdFromApiResponse(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null

  const record = data as Record<string, unknown>
  const nested =
    record.data && typeof record.data === 'object'
      ? (record.data as Record<string, unknown>)
      : null
  const id = record._id ?? record.id ?? nested?._id ?? nested?.id

  return id ? String(id) : null
}

export function mapApiTestsToTrackedTests(data: unknown): TrackedTest[] {
  return toApiTestList(data)
    .map(mapApiTestToTrackedTest)
    .filter((test): test is TrackedTest => test !== null)
}
