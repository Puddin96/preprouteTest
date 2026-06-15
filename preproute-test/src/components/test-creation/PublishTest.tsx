import { useState } from 'react'
import type { FormEvent } from 'react'
import { AiOutlineCalendar, AiOutlineDown } from 'react-icons/ai'
import './formRadio.css'
import './publishTest.css'

const PUBLISH_MODES = ['Publish Now', 'Schedule Publish'] as const
const LIVE_UNTIL_OPTIONS = [
  'Always Available',
  '1 Week',
  '2 Weeks',
  '3 Weeks',
  '1 Month',
  'Custom Duration',
] as const

type PublishMode = (typeof PUBLISH_MODES)[number]
type LiveUntilOption = (typeof LIVE_UNTIL_OPTIONS)[number]

type PublishTestProps = {
  onCancel: () => void
  onConfirm: (payload: {
    publishMode: PublishMode
    liveUntil: LiveUntilOption
    scheduleDate: string
    scheduleTime: string
    endDate: string
    endTime: string
  }) => void
  isSubmitting?: boolean
  error?: string | null
}

type DateTimeFieldsProps = {
  dateLabel: string
  timeLabel: string
  date: string
  time: string
  onDateChange: (value: string) => void
  onTimeChange: (value: string) => void
  required?: boolean
}

function DateTimeFields({
  dateLabel,
  timeLabel,
  date,
  time,
  onDateChange,
  onTimeChange,
  required = false,
}: DateTimeFieldsProps) {
  return (
    <div className="publish-test__field-row">
      <label className="publish-test__field">
        <div className="publish-test__input-wrap">
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            aria-label={dateLabel}
            required={required}
          />
          <AiOutlineCalendar className="publish-test__input-icon" aria-hidden="true" />
        </div>
      </label>

      <label className="publish-test__field">
        <div className="publish-test__input-wrap">
          <input
            type="time"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            aria-label={timeLabel}
            required={required}
          />
          <AiOutlineDown className="publish-test__input-icon" aria-hidden="true" />
        </div>
      </label>
    </div>
  )
}

export default function PublishTest({
  onCancel,
  onConfirm,
  isSubmitting = false,
  error = null,
}: PublishTestProps) {
  const [publishMode, setPublishMode] = useState<PublishMode>('Publish Now')
  const [liveUntil, setLiveUntil] = useState<LiveUntilOption>('Custom Duration')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('')

  const isSchedulePublish = publishMode === 'Schedule Publish'
  const isCustomDuration = liveUntil === 'Custom Duration'

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onConfirm({
      publishMode,
      liveUntil,
      scheduleDate,
      scheduleTime,
      endDate,
      endTime,
    })
  }

  return (
    <form className="publish-test" onSubmit={handleSubmit}>
      <div className="publish-test__tabs" role="group" aria-label="Publish mode">
        {PUBLISH_MODES.map((mode) => (
          <button
            key={mode}
            type="button"
            aria-pressed={publishMode === mode}
            className={`publish-test__tab${publishMode === mode ? ' publish-test__tab--active' : ''}`}
            onClick={() => setPublishMode(mode)}
          >
            {mode}
          </button>
        ))}
      </div>

      {isSchedulePublish && (
        <section className="publish-test__section">
          <h2 className="publish-test__heading">Select Date and Time</h2>
          <DateTimeFields
            dateLabel="Select Date"
            timeLabel="Select Time"
            date={scheduleDate}
            time={scheduleTime}
            onDateChange={setScheduleDate}
            onTimeChange={setScheduleTime}
            required
          />
        </section>
      )}

      <section className="publish-test__section">
        <h2 className="publish-test__heading">Live Until</h2>
        <p className="publish-test__description">
          Choose how long this test should remain available on the platform.
        </p>

        <fieldset className="publish-test__options">
          <legend className="publish-test__options-legend">Live until options</legend>
          <div className="publish-test__options-grid">
            {LIVE_UNTIL_OPTIONS.map((option) => (
              <label key={option} className="form-radio">
                <input
                  type="radio"
                  name="liveUntil"
                  value={option}
                  checked={liveUntil === option}
                  onChange={() => setLiveUntil(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {isCustomDuration && (
          <DateTimeFields
            dateLabel="Select End Date"
            timeLabel="Select End Time"
            date={endDate}
            time={endTime}
            onDateChange={setEndDate}
            onTimeChange={setEndTime}
            required
          />
        )}
      </section>

      {error && <p className="publish-test__error">{error}</p>}

      <div className="publish-test__actions">
        <button
          type="button"
          className="publish-test__btn publish-test__btn--cancel"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="publish-test__btn publish-test__btn--confirm"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Publishing…' : 'Confirm'}
        </button>
      </div>
    </form>
  )
}
