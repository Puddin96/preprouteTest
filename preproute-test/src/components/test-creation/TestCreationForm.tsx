import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  DIFFICULTY_OPTIONS,
  SUB_TOPICS_BY_TOPIC,
  SUBJECTS,
  TEST_TYPE_TABS,
  TOPICS_BY_SUBJECT,
  type SelectOption,
} from '../../data/testCreationData.ts'
import type { TestDraft } from '../../types/testCreation.ts'
import './formRadio.css'
import './testCreation.css'

type TestTypeTab = (typeof TEST_TYPE_TABS)[number]

export type TestCreationFormProps = {
  variant?: 'page' | 'dialog'
  initialDraft?: TestDraft | null
  subjects?: SelectOption[]
  subjectsLoading?: boolean
  topics?: SelectOption[]
  topicsLoading?: boolean
  topicsError?: string | null
  subTopics?: SelectOption[]
  subTopicsLoading?: boolean
  subTopicsError?: string | null
  onSubjectIdChange?: (subjectId: string) => void
  onTopicIdChange?: (topicId: string) => void
  useApiOptions?: boolean
  onSubmitDraft: (draft: TestDraft) => void
  onCancel: () => void
}

function getInitialTab(draft?: TestDraft | null): TestTypeTab {
  if (draft && TEST_TYPE_TABS.includes(draft.testType as TestTypeTab)) {
    return draft.testType as TestTypeTab
  }
  return 'Chapter Wise'
}

export default function TestCreationForm({
  variant = 'page',
  initialDraft = null,
  subjects = SUBJECTS,
  subjectsLoading = false,
  topics: apiTopics = [],
  topicsLoading = false,
  topicsError = null,
  subTopics: apiSubTopics = [],
  subTopicsLoading = false,
  subTopicsError = null,
  onSubjectIdChange,
  onTopicIdChange,
  useApiOptions = false,
  onSubmitDraft,
  onCancel,
}: TestCreationFormProps) {
  const [activeTab, setActiveTab] = useState<TestTypeTab>(() => getInitialTab(initialDraft))
  const [subjectId, setSubjectId] = useState(initialDraft?.subjectId ?? '')
  const [testName, setTestName] = useState(initialDraft?.testName ?? '')
  const [topicId, setTopicId] = useState(initialDraft?.topicId ?? '')
  const [subTopicId, setSubTopicId] = useState(initialDraft?.subTopicId ?? '')
  const [duration, setDuration] = useState(initialDraft?.duration ?? '')
  const [difficulty, setDifficulty] = useState(initialDraft?.difficulty ?? '')
  const [wrongAnswer, setWrongAnswer] = useState(initialDraft?.wrongAnswer ?? '')
  const [unattempted, setUnattempted] = useState(initialDraft?.unattempted ?? '')
  const [correctAnswer, setCorrectAnswer] = useState(initialDraft?.correctAnswer ?? '')
  const [numQuestions, setNumQuestions] = useState(initialDraft?.numQuestions ?? '')
  const [totalMarks, setTotalMarks] = useState(initialDraft?.totalMarks ?? '')

  const topics = useMemo(() => {
    if (!subjectId) return []
    return useApiOptions ? apiTopics : TOPICS_BY_SUBJECT[subjectId] ?? []
  }, [subjectId, useApiOptions, apiTopics])

  const subTopics = useMemo(() => {
    if (!topicId) return []
    return useApiOptions ? apiSubTopics : SUB_TOPICS_BY_TOPIC[topicId] ?? []
  }, [topicId, useApiOptions, apiSubTopics])

  const isDialog = variant === 'dialog'

  function handleSubjectChange(value: string) {
    setSubjectId(value)
    setTopicId('')
    setSubTopicId('')
    onSubjectIdChange?.(value)
  }

  function handleTopicChange(value: string) {
    setTopicId(value)
    setSubTopicId('')
    onTopicIdChange?.(value)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    onSubmitDraft({
      testType: activeTab,
      subjectId,
      testName,
      topicId,
      subTopicId,
      duration,
      difficulty,
      wrongAnswer,
      unattempted,
      correctAnswer,
      numQuestions,
      totalMarks,
    })
  }

  return (
    <>
      <div
        className={`test-creation__button-group${isDialog ? ' test-creation__button-group--dialog' : ''}`}
        role="group"
        aria-label="Test type"
      >
        {TEST_TYPE_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            aria-pressed={activeTab === tab}
            className={`test-creation__button-group-item${activeTab === tab ? ' test-creation__button-group-item--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <form
        className={`test-creation__form${isDialog ? ' test-creation__form--dialog' : ''}`}
        onSubmit={handleSubmit}
      >
        <input type="hidden" name="testType" value={activeTab} />
        <div className="test-creation__grid">
          <div className="test-creation__column">
            <label className="test-creation__field">
              <span>Subject</span>
              <select
                name="subject"
                value={subjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                disabled={subjectsLoading}
                required
              >
                <option value="">
                  {subjectsLoading ? 'Loading subjects…' : 'Select subject'}
                </option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="test-creation__field">
              <span>Topic</span>
              {topicsError && <p className="test-creation__error">{topicsError}</p>}
              <select
                name="topic"
                value={topicId}
                onChange={(e) => handleTopicChange(e.target.value)}
                disabled={!subjectId || topicsLoading}
                required
              >
                <option value="">
                  {!subjectId
                    ? 'Select a subject first'
                    : topicsLoading
                      ? 'Loading topics…'
                      : 'Select topic'}
                </option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="test-creation__column">
            <label className="test-creation__field">
              <span>Name of Test</span>
              <input
                type="text"
                name="testName"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="Enter test name"
                required
              />
            </label>

            <label className="test-creation__field">
              <span>Sub-Topic</span>
              {subTopicsError && <p className="test-creation__error">{subTopicsError}</p>}
              <select
                name="subTopic"
                value={subTopicId}
                onChange={(e) => setSubTopicId(e.target.value)}
                disabled={!topicId || subTopicsLoading}
                required
              >
                <option value="">
                  {!topicId
                    ? 'Select a topic first'
                    : subTopicsLoading
                      ? 'Loading sub-topics…'
                      : 'Select sub-topic'}
                </option>
                {subTopics.map((subTopic) => (
                  <option key={subTopic.id} value={subTopic.id}>
                    {subTopic.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="test-creation__duration-row">
          <label className="test-creation__field test-creation__field--duration">
            <span>Duration (Minutes)</span>
            <input
              type="number"
              name="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Enter duration in minutes"
              min={1}
              required
            />
          </label>

          <fieldset className="test-creation__difficulty">
            <legend className="test-creation__difficulty-label">Test Difficulty Level</legend>
            <div className="test-creation__radio-group">
              {DIFFICULTY_OPTIONS.map((level) => {
                const value = level.toLowerCase()
                return (
                  <label key={level} className="form-radio">
                    <input
                      type="radio"
                      name="difficulty"
                      value={value}
                      checked={difficulty === value}
                      onChange={(e) => setDifficulty(e.target.value)}
                      required
                    />
                    <span>{level}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>
        </div>

        <h2 className="test-creation__section-title">Marking scheme:</h2>
        <section className="test-creation__marking">
          <div className="test-creation__marking-scores">
            <label className="test-creation__field">
              <span>Wrong Answer</span>
              <input
                type="number"
                name="wrongAnswer"
                value={wrongAnswer}
                onChange={(e) => setWrongAnswer(e.target.value)}
                placeholder="0"
              />
            </label>

            <label className="test-creation__field">
              <span>Unattempted</span>
              <input
                type="number"
                name="unattempted"
                value={unattempted}
                onChange={(e) => setUnattempted(e.target.value)}
                placeholder="0"
              />
            </label>

            <label className="test-creation__field">
              <span>Correct Answer</span>
              <input
                type="number"
                name="correctAnswer"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                placeholder="0"
              />
            </label>
          </div>

          <div className="test-creation__marking-meta">
            <label className="test-creation__field">
              <span>No. of questions</span>
              <input
                type="text"
                name="numQuestions"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                placeholder="Enter number of questions"
              />
            </label>

            <label className="test-creation__field">
              <span>Total Marks</span>
              <input
                type="text"
                name="totalMarks"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                placeholder="Enter total marks"
              />
            </label>
          </div>
        </section>

        <div className="test-creation__actions">
          <button
            type="button"
            className={`test-creation__btn${isDialog ? ' test-creation__btn--secondary' : ' test-creation__btn--exit'}`}
            onClick={onCancel}
          >
            {isDialog ? 'Cancel' : 'Exit Test Creation'}
          </button>
          <button type="submit" className="test-creation__btn test-creation__btn--next">
            {isDialog ? 'Save' : 'Next'}
          </button>
        </div>
      </form>
    </>
  )
}
