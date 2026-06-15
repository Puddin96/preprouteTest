import { useNavigate } from 'react-router-dom'
import type { TestDraft } from '../../types/testCreation.ts'

function BreadcrumbChevron() {
  return (
    <svg
      className="add-questions__breadcrumb-icon"
      width="10"
      height="12"
      viewBox="0 0 10 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 1L8 6L1 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type AddQuestionsToolbarProps = {
  draft: TestDraft
  onPublish?: () => void
  isPublishView?: boolean
}

export default function AddQuestionsToolbar({
  draft,
  onPublish,
  isPublishView = false,
}: AddQuestionsToolbarProps) {
  const navigate = useNavigate()

  return (
    <header className="add-questions__toolbar">
      <nav className="add-questions__breadcrumb" aria-label="Breadcrumb">
        <button
          type="button"
          className="add-questions__breadcrumb-link"
          onClick={() => navigate('/home/test-creation')}
        >
          Test Creation
        </button>
        <BreadcrumbChevron />
        <button
          type="button"
          className="add-questions__breadcrumb-link"
          onClick={() => navigate('/home/test-creation')}
        >
          Create Test
        </button>
        <span className="add-questions__breadcrumb-separator">/</span>
        <span className="add-questions__breadcrumb-current">{draft.testType}</span>
      </nav>

      <button
        type="button"
        className={`add-questions__publish-btn${isPublishView ? ' add-questions__publish-btn--active' : ''}`}
        onClick={onPublish}
        aria-pressed={isPublishView}
      >
        Publish
      </button>
    </header>
  )
}
