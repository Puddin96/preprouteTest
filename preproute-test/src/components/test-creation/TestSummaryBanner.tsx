import {
  AiOutlineBarChart,
  AiOutlineBook,
  AiOutlineClockCircle,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineQuestionCircle,
  AiOutlineUser,
} from 'react-icons/ai'
import {
  SUBJECTS,
  SUB_TOPICS_BY_TOPIC,
  TOPICS_BY_SUBJECT,
  formatDifficulty,
  getOptionName,
} from '../../data/testCreationData.ts'
import type { TestDraft } from '../../types/testCreation.ts'
import './testSummaryBanner.css'

type TestSummaryBannerProps = {
  draft: TestDraft
  onEdit?: () => void
  onDelete?: () => void
}

export default function TestSummaryBanner({ draft, onEdit, onDelete }: TestSummaryBannerProps) {

  const subjectName = getOptionName(SUBJECTS, draft.subjectId)
  const topicName = getOptionName(
    TOPICS_BY_SUBJECT[draft.subjectId] ?? [],
    draft.topicId,
  )
  const subTopicName = getOptionName(
    SUB_TOPICS_BY_TOPIC[draft.topicId] ?? [],
    draft.subTopicId,
  )

  return (
    <section className="test-summary-banner" aria-label="Test summary">
      <div className="test-summary-banner__left">
        <span className="test-summary-banner__type-badge">{draft.testType}</span>

        <div className="test-summary-banner__title-row">
          <AiOutlineBook className="test-summary-banner__book-icon" aria-hidden="true" />
          <h2 className="test-summary-banner__title">
            {draft.testName || 'Untitled Test'}
          </h2>
          <span className="test-summary-banner__difficulty">
            <AiOutlineUser className="test-summary-banner__difficulty-icon" aria-hidden="true" />
            {formatDifficulty(draft.difficulty)}
          </span>
        </div>

        <dl className="test-summary-banner__meta">
          <div className="test-summary-banner__meta-row">
            <dt>Subject</dt>
            <dd>{subjectName}</dd>
          </div>
          <div className="test-summary-banner__meta-row">
            <dt>Topic</dt>
            <dd>
              <span className="test-summary-banner__tag">{topicName}</span>
            </dd>
          </div>
          <div className="test-summary-banner__meta-row">
            <dt>Sub Topic</dt>
            <dd>
              <span className="test-summary-banner__tag">{subTopicName}</span>
            </dd>
          </div>
        </dl>
      </div>

      <div className="test-summary-banner__right">
        <div className="test-summary-banner__actions">
          <button
            type="button"
            className="test-summary-banner__edit"
            aria-label="Edit test"
            onClick={onEdit}
            disabled={!onEdit}
          >
            <AiOutlineEdit aria-hidden="true" />
          </button>
          <button
            type="button"
            className="test-summary-banner__delete"
            aria-label="Delete test"
            onClick={onDelete}
            disabled={!onDelete}
          >
            <AiOutlineDelete aria-hidden="true" />
          </button>
        </div>

        <div className="test-summary-banner__stats">
          <div className="test-summary-banner__stat">
            <AiOutlineClockCircle className="test-summary-banner__stat-icon" aria-hidden="true" />
            <span>{draft.duration || '0'} Min</span>
          </div>
          <div className="test-summary-banner__stat-divider" aria-hidden="true" />
          <div className="test-summary-banner__stat">
            <AiOutlineQuestionCircle className="test-summary-banner__stat-icon" aria-hidden="true" />
            <span>{draft.numQuestions || '0'} Q&apos;s</span>
          </div>
          <div className="test-summary-banner__stat-divider" aria-hidden="true" />
          <div className="test-summary-banner__stat">
            <AiOutlineBarChart className="test-summary-banner__stat-icon" aria-hidden="true" />
            <span>{draft.totalMarks || '0'} Marks</span>
          </div>
        </div>
      </div>
    </section>
  )
}
