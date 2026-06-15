import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { isAxiosError } from 'axios'
import { AiOutlineCheck, AiOutlineDoubleRight, AiOutlineMinus } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import {
  DIFFICULTY_OPTIONS,
  SUB_TOPICS_BY_TOPIC,
  TOPICS_BY_SUBJECT,
} from '../../data/testCreationData.ts'
import type {
  Question,
  QuestionFormData,
  PublishSettings,
  TestDraft,
} from '../../types/testCreation.ts'
import {
  addCreatedTest,
  clearEditingTestId,
  getCreatedTestById,
  getEditingTestId,
  updateCreatedTest,
} from '../../utils/createdTestsStorage.ts'
import { buildBulkQuestionPayload } from '../../utils/buildBulkQuestionPayload.ts'
import { buildCreateTestPayload } from '../../utils/buildCreateTestPayload.ts'
import { getIdFromApiResponse } from '../../utils/mapApiTest.ts'
import { createQuestionsInBulk, createTest, publishTest } from '../../services/services.ts'
import {
  clearTestDraft,
  getApiTestId,
  getQuestionSlots,
  getTestDraft,
  setApiTestId,
  setQuestionSlots,
  setTestDraft,
} from '../../utils/testDraftStorage.ts'
import type { QuestionSlot } from '../../types/testCreation.ts'
import RichTextEditor, { isRichTextEmpty } from '../RichTextEditor/RichTextEditor.tsx'
import AddQuestionsToolbar from './AddQuestionsToolbar.tsx'
import PublishTest from './PublishTest.tsx'
import TestCreationDialog from './TestCreationDialog.tsx'
import TestSummaryBanner from './TestSummaryBanner.tsx'
import { MdDeleteForever } from "react-icons/md";
import './addQuestions.css'

const BASE_FORM: QuestionFormData = {
  text: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctAnswer: 'A',
  difficulty: '',
  topicId: '',
  subTopicId: '',
}

function getInitialForm(draft: TestDraft): QuestionFormData {
  return {
    ...BASE_FORM,
    difficulty: draft.difficulty,
    topicId: draft.topicId,
    subTopicId: draft.subTopicId,
  }
}

function getTotalQuestions(draft: TestDraft) {
  return Math.max(0, parseInt(draft.numQuestions, 10) || 0)
}

function getFirstEmptySlotIndex(slots: QuestionSlot[]) {
  const index = slots.findIndex((slot) => slot === null)
  return index === -1 ? 0 : index
}

function scrollToPageTop() {
  document.querySelector('.home-main')?.scrollTo({ top: 0, behavior: 'smooth' })
}

export default function AddQuestions() {
  const navigate = useNavigate()
  const [testDraft, setTestDraftState] = useState<TestDraft | null>(() => getTestDraft())
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [showPublish, setShowPublish] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishError, setPublishError] = useState<string | null>(null)
  const [isCreatingTest, setIsCreatingTest] = useState(false)
  const [createTestError, setCreateTestError] = useState<string | null>(null)
  const [isAddingQuestion, setIsAddingQuestion] = useState(false)
  const [questionError, setQuestionError] = useState<string | null>(null)
  const totalQuestions = testDraft ? getTotalQuestions(testDraft) : 0
  const [questionSlots, setQuestionSlotsState] = useState<QuestionSlot[]>(() =>
    testDraft ? getQuestionSlots(getTotalQuestions(testDraft)) : [],
  )
  const [activeSlotIndex, setActiveSlotIndex] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editorResetKey, setEditorResetKey] = useState(0)
  const [form, setForm] = useState<QuestionFormData>(() =>
    testDraft ? getInitialForm(testDraft) : BASE_FORM,
  )

  const topics = useMemo(
    () => (testDraft ? TOPICS_BY_SUBJECT[testDraft.subjectId] ?? [] : []),
    [testDraft],
  )

  const subTopics = useMemo(
    () => (form.topicId ? SUB_TOPICS_BY_TOPIC[form.topicId] ?? [] : []),
    [form.topicId],
  )

  useEffect(() => {
    if (!testDraft) {
      navigate('/home/test-creation', { replace: true })
    }
  }, [navigate, testDraft])

  if (!testDraft) return null

  const isEditing = selectedId !== null
  const allQuestionsAdded =
    totalQuestions > 0 && questionSlots.every((slot) => slot !== null)

  function handleDraftSave(draft: TestDraft) {
    setTestDraft(draft)
    setTestDraftState(draft)

    const newTotal = getTotalQuestions(draft)
    setQuestionSlotsState((previousSlots) => {
      const resizedSlots = Array.from(
        { length: newTotal },
        (_, index) => previousSlots[index] ?? null,
      )
      setQuestionSlots(resizedSlots)
      return resizedSlots
    })

    setActiveSlotIndex((previousIndex) =>
      Math.min(previousIndex, Math.max(0, newTotal - 1)),
    )
    setForm((previousForm) => ({
      ...previousForm,
      difficulty: draft.difficulty,
      topicId: draft.topicId,
      subTopicId: draft.subTopicId,
    }))
  }

  function persistSlots(slots: QuestionSlot[]) {
    setQuestionSlotsState(slots)
    setQuestionSlots(slots)
  }

  function resetForm(slotIndex = activeSlotIndex) {
    setActiveSlotIndex(slotIndex)
    setForm(getInitialForm(testDraft!))
    setSelectedId(null)
  }

  function handleDeleteAllEdits() {
    const savedQuestion = questionSlots[activeSlotIndex]

    if (savedQuestion) {
      loadQuestionIntoForm(savedQuestion, activeSlotIndex)
    } else {
      resetForm(activeSlotIndex)
    }

    setEditorResetKey((key) => key + 1)
  }

  function loadQuestionIntoForm(question: Question, slotIndex: number) {
    setActiveSlotIndex(slotIndex)
    setSelectedId(question.id)
    setForm({
      text: question.text,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty ?? testDraft!.difficulty,
      topicId: question.topicId ?? testDraft!.topicId,
      subTopicId: question.subTopicId ?? testDraft!.subTopicId,
    })
  }

  function selectSlot(slotIndex: number) {
    const question = questionSlots[slotIndex]
    if (question) {
      loadQuestionIntoForm(question, slotIndex)
      return
    }
    resetForm(slotIndex)
  }

  function getSlotStatus(slotIndex: number, question: Question | null) {
    const isActive = activeSlotIndex === slotIndex
    if (question && isActive) return 'active'
    if (question) return 'completed'
    return 'pending'
  }

  function handleTopicChange(value: string) {
    setForm((prev) => ({
      ...prev,
      topicId: value,
      subTopicId: '',
    }))
  }

  async function ensureApiTestId() {
    const existingId = getApiTestId() ?? getEditingTestId()
    if (existingId) return existingId

    const questions = questionSlots.filter(
      (question): question is Question => question !== null,
    )
    const response = await createTest(buildCreateTestPayload(testDraft!, questions))
    const testId = getIdFromApiResponse(response)

    if (!testId) {
      throw new Error('Test created but no test id was returned')
    }

    setApiTestId(testId)
    return testId
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isRichTextEmpty(form.text)) return

    const updated = [...questionSlots]

    if (isEditing && selectedId) {
      updated[activeSlotIndex] = { ...updated[activeSlotIndex]!, ...form, id: selectedId }
      persistSlots(updated)
      const nextEmpty = updated.findIndex((slot, index) => index > activeSlotIndex && slot === null)
      resetForm(nextEmpty === -1 ? activeSlotIndex : nextEmpty)
      scrollToPageTop()
      return
    }

    setIsAddingQuestion(true)
    setQuestionError(null)

    try {
      const testId = await ensureApiTestId()
      const payload = buildBulkQuestionPayload(form, testId)
      await createQuestionsInBulk(payload)

      const newQuestion: Question = {
        id: crypto.randomUUID(),
        ...form,
      }
      updated[activeSlotIndex] = newQuestion
      persistSlots(updated)

      const nextEmpty = updated.findIndex((slot, index) => index > activeSlotIndex && slot === null)
      resetForm(nextEmpty === -1 ? activeSlotIndex : nextEmpty)
      scrollToPageTop()
    } catch (err) {
      const message = isAxiosError(err)
        ? (err.response?.data?.message ?? err.message)
        : err instanceof Error
          ? err.message
          : 'Failed to add question'
      setQuestionError(message)
    } finally {
      setIsAddingQuestion(false)
    }
  }

  function handleDelete() {
    if (!selectedId) return
    const updated = [...questionSlots]
    updated[activeSlotIndex] = null
    persistSlots(updated)
    resetForm(getFirstEmptySlotIndex(updated))
  }

  async function handleCreateTest() {
    const questions = questionSlots.filter(
      (question): question is Question => question !== null,
    )
    const payload = buildCreateTestPayload(testDraft!, questions)

    setIsCreatingTest(true)
    setCreateTestError(null)

    try {
      const response = await createTest(payload)
      const testId = getIdFromApiResponse(response)

      if (!testId) {
        throw new Error('Test created but no test id was returned')
      }

      setApiTestId(testId)
    } catch (err) {
      const message = isAxiosError(err)
        ? (err.response?.data?.message ?? err.message)
        : err instanceof Error
          ? err.message
          : 'Failed to create test'
      setCreateTestError(message)
    } finally {
      setIsCreatingTest(false)
    }
  }

  async function handlePublishConfirm(publishSettings: PublishSettings) {
    const testId = getApiTestId() ?? getEditingTestId()

    if (!testId) {
      setPublishError('Create the test before publishing.')
      return
    }

    setIsPublishing(true)
    setPublishError(null)

    try {
      await publishTest(testId)

      const filledQuestions = questionSlots.filter(
        (question): question is Question => question !== null,
      )
      const editingTestId = getEditingTestId()
      const existingTest = editingTestId ? getCreatedTestById(editingTestId) : null

      const savedTest = {
        id: testId,
        createdAt: existingTest?.createdAt ?? new Date().toISOString(),
        draft: testDraft!,
        questionSlots: [...questionSlots],
        questions: filledQuestions,
        publishSettings,
      }

      if (existingTest) {
        updateCreatedTest(savedTest)
      } else {
        addCreatedTest(savedTest)
      }

      clearEditingTestId()
      clearTestDraft()
      navigate('/home/test-tracking')
    } catch (err) {
      const message = isAxiosError(err)
        ? (err.response?.data?.message ?? err.message)
        : err instanceof Error
          ? err.message
          : 'Failed to publish test'
      setPublishError(message)
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="add-questions">
      <aside className="add-questions__sidebar">
        <p className="add-questions__sidebar-title">Questions Created</p>
        <p className="add-questions__sidebar-title">
          Total questions: {testDraft.numQuestions || '0'}
        </p>
        <div className="add-questions__sidebar-list">
          {totalQuestions === 0 ? (
            <p className="add-questions__sidebar-empty">No questions configured.</p>
          ) : (
            questionSlots.map((question, index) => {
              const status = getSlotStatus(index, question)
              return (
                <button
                  key={index}
                  type="button"
                  className={`add-questions__sidebar-item add-questions__sidebar-item--${status}`}
                  onClick={() => selectSlot(index)}
                  aria-current={status === 'active' ? 'true' : undefined}
                >
                  <span className="add-questions__sidebar-item-status" aria-hidden="true">
                    {question ? <AiOutlineCheck /> : <AiOutlineMinus />}
                  </span>
                  <span className="add-questions__sidebar-item-text">
                    Question {index + 1}
                  </span>
                  <AiOutlineDoubleRight
                    className="add-questions__sidebar-item-icon"
                    aria-hidden="true"
                  />
                </button>
              )
            })
          )}
        </div>
      </aside>

      <div className="add-questions__main">
        <AddQuestionsToolbar
          draft={testDraft}
          onPublish={() => setShowPublish(true)}
          isPublishView={showPublish}
        />

        {!showPublish && (
          <div className="add-questions__header">
            <h1 className="add-questions__title">
              {isEditing ? 'Edit Question' : 'Add Question'}
            </h1>

            <p className="add-questions__subtitle">
              {testDraft.testName ? `Test: ${testDraft.testName}` : 'Add questions to your test'}
            </p>
          </div>
        )}

        <div className="add-questions__form">
          <TestSummaryBanner
            draft={testDraft}
            onEdit={() => setIsEditDialogOpen(true)}
          />

          {showPublish ? (
            <PublishTest
              onCancel={() => {
                if (isPublishing) return
                setShowPublish(false)
                setPublishError(null)
              }}
              onConfirm={handlePublishConfirm}
              isSubmitting={isPublishing}
              error={publishError}
            />
          ) : (
            <form className="add-questions__question-form" onSubmit={handleSubmit}>
              <div className="add-questions__field add-questions__field--rich-text">
                <div className="add-questions__question-header">
                  <span className="add-questions__field-label">
                    Question {activeSlotIndex + 1} /{' '}
                    <span className="add-questions__field-label-total">
                      {totalQuestions || testDraft.numQuestions || 0}
                    </span>
                  </span>
                </div>
                <div style={{ display: "flex", marginTop: "25px" }}>
                  <MdDeleteForever className="delete-icon" />
                  <button
                    type="button"
                    className="add-questions__clear-edits-btn"
                    onClick={handleDeleteAllEdits}
                  >
                    Delete all edits
                  </button>
                </div>
                <RichTextEditor
                  key={`${selectedId ?? `slot-${activeSlotIndex}`}-${editorResetKey}`}
                  value={form.text}
                  onChange={(text) => setForm((prev) => ({ ...prev, text }))}
                  placeholder="Enter your question"
                />
              </div>
              <span style={{color: "black"}}>Type the options below:</span>
              <div className="add-questions__options">
                <label className="add-questions__field">
                  <span>Option A</span>
                  <input
                    type="text"
                    value={form.optionA}
                    onChange={(e) => setForm((prev) => ({ ...prev, optionA: e.target.value }))}
                    placeholder="Option A"
                    required
                  />
                </label>
                <label className="add-questions__field">
                  <span>Option B</span>
                  <input
                    type="text"
                    value={form.optionB}
                    onChange={(e) => setForm((prev) => ({ ...prev, optionB: e.target.value }))}
                    placeholder="Option B"
                    required
                  />
                </label>
                <label className="add-questions__field">
                  <span>Option C</span>
                  <input
                    type="text"
                    value={form.optionC}
                    onChange={(e) => setForm((prev) => ({ ...prev, optionC: e.target.value }))}
                    placeholder="Option C"
                    required
                  />
                </label>
                <label className="add-questions__field">
                  <span>Option D</span>
                  <input
                    type="text"
                    value={form.optionD}
                    onChange={(e) => setForm((prev) => ({ ...prev, optionD: e.target.value }))}
                    placeholder="Option D"
                    required
                  />
                </label>
              </div>

              <fieldset className="add-questions__field">
                <legend>Correct Answer</legend>
                <div className="add-questions__correct-group">
                  {(['A', 'B', 'C', 'D'] as const).map((option) => (
                    <label key={option} className="add-questions__correct-option">
                      <input
                        type="radio"
                        name="correctAnswer"
                        value={option}
                        checked={form.correctAnswer === option}
                        onChange={() =>
                          setForm((prev) => ({ ...prev, correctAnswer: option }))
                        }
                        required
                      />
                      <span>Option {option}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <section className="add-questions__settings">
                <h2 className="add-questions__settings-title">Question Settings</h2>
                <div className="add-questions__settings-grid">
                  <label className="add-questions__field">
                    <span>Level of difficulty</span>
                    <select
                      name="difficulty"
                      value={form.difficulty}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, difficulty: e.target.value }))
                      }
                      required
                    >
                      <option value="">Select difficulty</option>
                      {DIFFICULTY_OPTIONS.map((level) => (
                        <option key={level} value={level.toLowerCase()}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="add-questions__field">
                    <span>Topic</span>
                    <select
                      name="topic"
                      value={form.topicId}
                      onChange={(e) => handleTopicChange(e.target.value)}
                      required
                    >
                      <option value="">Select topic</option>
                      {topics.map((topic) => (
                        <option key={topic.id} value={topic.id}>
                          {topic.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="add-questions__field">
                    <span>Sub-Topic</span>
                    <select
                      name="subTopic"
                      value={form.subTopicId}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, subTopicId: e.target.value }))
                      }
                      disabled={!form.topicId}
                      required
                    >
                      <option value="">
                        {form.topicId ? 'Select sub-topic' : 'Select a topic first'}
                      </option>
                      {subTopics.map((subTopic) => (
                        <option key={subTopic.id} value={subTopic.id}>
                          {subTopic.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </section>

              <div className="add-questions__actions">
                <button
                  type="button"
                  className="add-questions__btn add-questions__btn--exit"
                  onClick={() => navigate('/home')}
                >
                  Exit Test Creation
                </button>
                <div className="add-questions__actions-right">
                  {questionError && (
                    <p className="add-questions__error">{questionError}</p>
                  )}
                  {createTestError && (
                    <p className="add-questions__error">{createTestError}</p>
                  )}
                  {allQuestionsAdded && (
                    <button
                      type="button"
                      className="add-questions__btn add-questions__btn--create"
                      onClick={handleCreateTest}
                      disabled={isCreatingTest || Boolean(getApiTestId())}
                    >
                      {isCreatingTest
                        ? 'Creating…'
                        : getApiTestId()
                          ? 'Test Created'
                          : 'Create Test'}
                    </button>
                  )}
                  {isEditing && (
                    <button
                      type="button"
                      className="add-questions__btn add-questions__btn--danger"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  )}
                  {isEditing && (
                    <button
                      type="button"
                      className="add-questions__btn add-questions__btn--secondary"
                      onClick={() => resetForm(getFirstEmptySlotIndex(questionSlots))}
                    >
                      New Question
                    </button>
                  )}
                  <button
                    type="submit"
                    className="add-questions__btn add-questions__btn--primary"
                    disabled={isAddingQuestion}
                  >
                    {isAddingQuestion
                      ? 'Adding…'
                      : isEditing
                        ? 'Update Question'
                        : 'Add Question'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      <TestCreationDialog
        open={isEditDialogOpen}
        draft={testDraft}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleDraftSave}
      />
    </div>
  )
}
