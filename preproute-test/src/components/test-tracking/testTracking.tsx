import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import TestSummaryBanner from '../test-creation/TestSummaryBanner.tsx'
import { getAllTests } from '../../services/services.ts'
import { mapApiTestsToTrackedTests, type TrackedTest } from '../../utils/mapApiTest.ts'
import './testTracking.css'

function formatCreatedAt(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function formatStatus(status: string | null) {
  if (!status) return 'Draft'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export default function TestTracking() {
  const [tests, setTests] = useState<TrackedTest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadTests() {
      setLoading(true)
      setError(null)

      try {
        const response = await getAllTests()
        if (cancelled) return
        setTests(mapApiTestsToTrackedTests(response))
      } catch (err) {
        if (cancelled) return
        const message = isAxiosError(err)
          ? (err.response?.data?.message ?? err.message)
          : 'Failed to load tests'
        setError(message)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadTests()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="home__page test-tracking">
      <h1 className="home__page-title">Test Tracking</h1>
      <p className="home__page-description">
        View and track tests you have created and published.
      </p>

      {error && <p className="test-tracking__error">{error}</p>}

      {loading ? (
        <p className="test-tracking__loading">Loading tests…</p>
      ) : tests.length === 0 ? (
        <p className="test-tracking__empty">
          No tests found. Create and publish a test from Test Creation to see it here.
        </p>
      ) : (
        <div className="test-tracking__list">
          {tests.map((test) => (
            <article key={test.id} className="test-tracking__card">
              <TestSummaryBanner draft={test.draft} />
              <p className="test-tracking__meta">
                Created {formatCreatedAt(test.createdAt)} · {formatStatus(test.status)}
                {test.totalQuestions > 0 ? ` · ${test.totalQuestions} question(s)` : ''}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
