import type { QuestionFormData } from '../types/testCreation.ts'

export type BulkQuestionItem = {
  type: 'mcq'
  question: string
  option1: string
  option2: string
  option3: string
  option4: string
  correct_option: 'option1' | 'option2' | 'option3' | 'option4'
  explanation: string
  difficulty: string
  test_id: string
}

export type BulkQuestionsPayload = {
  questions: BulkQuestionItem[]
}

const CORRECT_OPTION_MAP: Record<
  QuestionFormData['correctAnswer'],
  BulkQuestionItem['correct_option']
> = {
  A: 'option1',
  B: 'option2',
  C: 'option3',
  D: 'option4',
}

export function buildBulkQuestionPayload(
  form: QuestionFormData,
  testId: string,
): BulkQuestionsPayload {
  const question = form.text.replace(/<\/?p>/g, "");
  return {
    questions: [
      {
        type: 'mcq',
        question: question,
        option1: form.optionA,
        option2: form.optionB,
        option3: form.optionC,
        option4: form.optionD,
        correct_option: CORRECT_OPTION_MAP[form.correctAnswer],
        explanation: '',
        difficulty: form.difficulty,
        test_id: testId,
      },
    ],
  }
}
