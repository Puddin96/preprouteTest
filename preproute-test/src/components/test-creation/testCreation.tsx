import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import './testCreation.css'

type SelectOption = {
  id: string
  name: string
}

const SUBJECTS: SelectOption[] = [
  { id: 'mathematics', name: 'Mathematics' },
  { id: 'science', name: 'Science' },
  { id: 'english', name: 'English' },
  { id: 'history', name: 'History' },
]

const TOPICS_BY_SUBJECT: Record<string, SelectOption[]> = {
  mathematics: [
    { id: 'algebra', name: 'Algebra' },
    { id: 'geometry', name: 'Geometry' },
    { id: 'calculus', name: 'Calculus' },
  ],
  science: [
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'biology', name: 'Biology' },
  ],
  english: [
    { id: 'grammar', name: 'Grammar' },
    { id: 'literature', name: 'Literature' },
    { id: 'writing', name: 'Writing' },
  ],
  history: [
    { id: 'ancient', name: 'Ancient History' },
    { id: 'modern', name: 'Modern History' },
    { id: 'world-wars', name: 'World Wars' },
  ],
}

const SUB_TOPICS_BY_TOPIC: Record<string, SelectOption[]> = {
  algebra: [
    { id: 'linear-equations', name: 'Linear Equations' },
    { id: 'quadratic-equations', name: 'Quadratic Equations' },
  ],
  geometry: [
    { id: 'triangles', name: 'Triangles' },
    { id: 'circles', name: 'Circles' },
  ],
  calculus: [
    { id: 'derivatives', name: 'Derivatives' },
    { id: 'integrals', name: 'Integrals' },
  ],
  physics: [
    { id: 'mechanics', name: 'Mechanics' },
    { id: 'thermodynamics', name: 'Thermodynamics' },
  ],
  chemistry: [
    { id: 'organic', name: 'Organic Chemistry' },
    { id: 'inorganic', name: 'Inorganic Chemistry' },
  ],
  biology: [
    { id: 'genetics', name: 'Genetics' },
    { id: 'ecology', name: 'Ecology' },
  ],
  grammar: [
    { id: 'tenses', name: 'Tenses' },
    { id: 'syntax', name: 'Syntax' },
  ],
  literature: [
    { id: 'poetry', name: 'Poetry' },
    { id: 'prose', name: 'Prose' },
  ],
  writing: [
    { id: 'essays', name: 'Essays' },
    { id: 'creative-writing', name: 'Creative Writing' },
  ],
  ancient: [
    { id: 'egypt', name: 'Ancient Egypt' },
    { id: 'rome', name: 'Ancient Rome' },
  ],
  modern: [
    { id: 'industrial', name: 'Industrial Revolution' },
    { id: 'cold-war', name: 'Cold War' },
  ],
  'world-wars': [
    { id: 'ww1', name: 'World War I' },
    { id: 'ww2', name: 'World War II' },
  ],
}

const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Difficult'] as const

const TEST_TYPE_TABS = ['Chapter Wise', 'PYQ', 'Mock Test'] as const
type TestTypeTab = (typeof TEST_TYPE_TABS)[number]

export default function TestCreation() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TestTypeTab>('Chapter Wise')
  const [subjectId, setSubjectId] = useState('')
  const [testName, setTestName] = useState('')
  const [topicId, setTopicId] = useState('')
  const [subTopicId, setSubTopicId] = useState('')
  const [duration, setDuration] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [wrongAnswer, setWrongAnswer] = useState('')
  const [unattempted, setUnattempted] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [numQuestions, setNumQuestions] = useState('')
  const [totalMarks, setTotalMarks] = useState('')

  const topics = useMemo(
    () => (subjectId ? TOPICS_BY_SUBJECT[subjectId] ?? [] : []),
    [subjectId],
  )

  const subTopics = useMemo(
    () => (topicId ? SUB_TOPICS_BY_TOPIC[topicId] ?? [] : []),
    [topicId],
  )

  function handleSubjectChange(value: string) {
    setSubjectId(value)
    setTopicId('')
    setSubTopicId('')
  }

  function handleTopicChange(value: string) {
    setTopicId(value)
    setSubTopicId('')
  }

  function handleCancel() {
    navigate('/home')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <div className="home__page">
      <h1 className="home__page-title">Test Creation</h1>
      <p className="home__page-description">Create and manage your tests here.</p>

      <div className="test-creation__button-group" role="group" aria-label="Test type">
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

      <form className="test-creation__form" onSubmit={handleSubmit}>
        <input type="hidden" name="testType" value={activeTab} />
        <div className="test-creation__grid">
          <div className="test-creation__column">
            <label className="test-creation__field">
              <span>Subject</span>
              <select
                name="subject"
                value={subjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                required
              >
                <option value="">Select subject</option>
                {SUBJECTS.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </label>

             <label className="test-creation__field">
              <span>Topic</span>
              <select
                name="topic"
                value={topicId}
                onChange={(e) => handleTopicChange(e.target.value)}
                disabled={!subjectId}
                required
              >
                <option value="">
                  {subjectId ? 'Select topic' : 'Select a subject first'}
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
              <select
                name="subTopic"
                value={subTopicId}
                onChange={(e) => setSubTopicId(e.target.value)}
                disabled={!topicId}
                required
              >
                <option value="">
                  {topicId ? 'Select sub-topic' : 'Select a topic first'}
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
                  <label key={level} className="test-creation__radio">
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
            className="test-creation__btn test-creation__btn--cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button type="submit" className="test-creation__btn test-creation__btn--next">
            Next
          </button>
        </div>
      </form>
    </div>
  )
}
