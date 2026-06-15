import type { CreatedTest, QuestionSlot } from '../types/testCreation.ts'
import {
  setQuestionSlots,
  setTestDraft,
} from './testDraftStorage.ts'

const CREATED_TESTS_KEY = 'preproute_created_tests'
const EDITING_TEST_ID_KEY = 'preproute_editing_test_id'

export function getCreatedTests(): CreatedTest[] {
  const raw = localStorage.getItem(CREATED_TESTS_KEY)
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw) as CreatedTest[]
    return parsed.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  } catch {
    return []
  }
}

export function getCreatedTestById(id: string): CreatedTest | null {
  return getCreatedTests().find((test) => test.id === id) ?? null
}

export function addCreatedTest(test: CreatedTest) {
  const tests = getCreatedTests()
  localStorage.setItem(CREATED_TESTS_KEY, JSON.stringify([test, ...tests]))
}

export function updateCreatedTest(test: CreatedTest) {
  const tests = getCreatedTests()
  const updated = tests.map((entry) => (entry.id === test.id ? test : entry))
  localStorage.setItem(CREATED_TESTS_KEY, JSON.stringify(updated))
}

export function deleteCreatedTest(id: string) {
  const tests = getCreatedTests().filter((test) => test.id !== id)
  localStorage.setItem(CREATED_TESTS_KEY, JSON.stringify(tests))

  if (getEditingTestId() === id) {
    clearEditingTestId()
  }
}

export function getEditingTestId(): string | null {
  return sessionStorage.getItem(EDITING_TEST_ID_KEY)
}

export function setEditingTestId(id: string) {
  sessionStorage.setItem(EDITING_TEST_ID_KEY, id)
}

export function clearEditingTestId() {
  sessionStorage.removeItem(EDITING_TEST_ID_KEY)
}

export function clearCreatedTests() {
  localStorage.removeItem(CREATED_TESTS_KEY)
  clearEditingTestId()
}

function getQuestionSlotsFromTest(test: CreatedTest): QuestionSlot[] {
  const total = Math.max(0, parseInt(test.draft.numQuestions, 10) || 0)
  const slots: QuestionSlot[] = Array.from({ length: total }, () => null)

  if (test.questionSlots?.length) {
    test.questionSlots.forEach((question, index) => {
      if (index < total) slots[index] = question
    })
    return slots
  }

  test.questions?.forEach((question, index) => {
    if (index < total) slots[index] = question
  })

  return slots
}

export function loadCreatedTestForEditing(test: CreatedTest) {
  setTestDraft(test.draft)
  setQuestionSlots(getQuestionSlotsFromTest(test))
  setEditingTestId(test.id)
}
