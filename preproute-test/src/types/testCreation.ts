export type TestDraft = {
  testType: string
  subjectId: string
  testName: string
  topicId: string
  subTopicId: string
  duration: string
  difficulty: string
  wrongAnswer: string
  unattempted: string
  correctAnswer: string
  numQuestions: string
  totalMarks: string
}

export type Question = {
  id: string
  text: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: 'A' | 'B' | 'C' | 'D'
  difficulty: string
  topicId: string
  subTopicId: string
}

export type QuestionFormData = Omit<Question, 'id'>

export type PublishSettings = {
  publishMode: string
  liveUntil: string
  scheduleDate: string
  scheduleTime: string
  endDate: string
  endTime: string
}

export type QuestionSlot = Question | null

export type CreatedTest = {
  id: string
  createdAt: string
  draft: TestDraft
  questionSlots: QuestionSlot[]
  questions: Question[]
  publishSettings: PublishSettings
}
