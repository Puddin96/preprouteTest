import { useEffect } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import type { TestDraft } from '../../types/testCreation.ts'
import TestCreationForm from './TestCreationForm.tsx'
import './testCreationDialog.css'

type TestCreationDialogProps = {
  open: boolean
  draft: TestDraft
  onClose: () => void
  onSave: (draft: TestDraft) => void
}

export default function TestCreationDialog({
  open,
  draft,
  onClose,
  onSave,
}: TestCreationDialogProps) {
  useEffect(() => {
    if (!open) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  function handleSave(updatedDraft: TestDraft) {
    onSave(updatedDraft)
    onClose()
  }

  return (
    <div className="test-creation-dialog__backdrop" onClick={onClose}>
      <div
        className="test-creation-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="test-creation-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="test-creation-dialog__header">
          <h2 id="test-creation-dialog-title" className="test-creation-dialog__title">
            Edit Test Details
          </h2>
          <button
            type="button"
            className="test-creation-dialog__close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <AiOutlineClose aria-hidden="true" />
          </button>
        </div>

        <div className="test-creation-dialog__body">
          <TestCreationForm
            variant="dialog"
            initialDraft={draft}
            onSubmitDraft={handleSave}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  )
}
