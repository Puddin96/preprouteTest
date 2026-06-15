import type { QuestionSlot, TestDraft } from '../types/testCreation.ts'

const TEST_DRAFT_KEY = 'preproute_test_draft'
const QUESTIONS_KEY = 'preproute_test_questions'
const API_TEST_ID_KEY = 'preproute_api_test_id'

export function setTestDraft(draft: TestDraft) {
  sessionStorage.setItem(TEST_DRAFT_KEY, JSON.stringify(draft))
}

export function getTestDraft(): TestDraft | null {
  const raw = sessionStorage.getItem(TEST_DRAFT_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as TestDraft
  } catch {
    return null
  }
}

export function clearTestDraft() {
  sessionStorage.removeItem(TEST_DRAFT_KEY)
  sessionStorage.removeItem(QUESTIONS_KEY)
  sessionStorage.removeItem(API_TEST_ID_KEY)
}

export function setApiTestId(id: string) {
  sessionStorage.setItem(API_TEST_ID_KEY, id)
}

export function getApiTestId(): string | null {
  return sessionStorage.getItem(API_TEST_ID_KEY)
}

export function clearQuestionSlots() {
  sessionStorage.removeItem(QUESTIONS_KEY)
}

export function startNewTestSession(draft: TestDraft) {
  clearQuestionSlots()
  setTestDraft(draft)
}

export function getQuestionSlots(total: number): QuestionSlot[] {
  const raw = sessionStorage.getItem(QUESTIONS_KEY)
  const slots: QuestionSlot[] = Array.from({ length: total }, () => null)

  if (!raw) return slots

  try {
    const parsed = JSON.parse(raw) as QuestionSlot[]
    parsed.forEach((question, index) => {
      if (index < total) slots[index] = question
    })
    return slots
  } catch {
    return slots
  }
}

export function setQuestionSlots(slots: QuestionSlot[]) {
  sessionStorage.setItem(QUESTIONS_KEY, JSON.stringify(slots))
}
