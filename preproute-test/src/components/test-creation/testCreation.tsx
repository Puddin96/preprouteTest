import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { toSelectOptions, type SelectOption } from '../../data/testCreationData.ts'
import { getAllSubjects, getSubTopicsByTopic, getTopicsBySubject } from '../../services/services.ts'
import { clearEditingTestId } from '../../utils/createdTestsStorage.ts'
import { startNewTestSession } from '../../utils/testDraftStorage.ts'
import TestCreationForm from './TestCreationForm.tsx'
import './testCreation.css'

export default function TestCreation() {
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState<SelectOption[]>([])
  const [subjectsLoading, setSubjectsLoading] = useState(true)
  const [subjectsError, setSubjectsError] = useState<string | null>(null)
  const [topics, setTopics] = useState<SelectOption[]>([])
  const [topicsLoading, setTopicsLoading] = useState(false)
  const [topicsError, setTopicsError] = useState<string | null>(null)
  const [subTopics, setSubTopics] = useState<SelectOption[]>([])
  const [subTopicsLoading, setSubTopicsLoading] = useState(false)
  const [subTopicsError, setSubTopicsError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadSubjects() {
      setSubjectsLoading(true)
      setSubjectsError(null)

      try {
        const response = await getAllSubjects()
        if (cancelled) return
        setSubjects(toSelectOptions(response))
      } catch (err) {
        if (cancelled) return
        const message = isAxiosError(err)
          ? (err.response?.data?.message ?? err.message)
          : 'Failed to load subjects'
        setSubjectsError(message)
      } finally {
        if (!cancelled) {
          setSubjectsLoading(false)
        }
      }
    }

    loadSubjects()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubjectIdChange(subjectId: string) {
    setTopics([])
    setTopicsError(null)
    setSubTopics([])
    setSubTopicsError(null)

    if (!subjectId) {
      setTopicsLoading(false)
      setSubTopicsLoading(false)
      return
    }

    setTopicsLoading(true)

    try {
      const response = await getTopicsBySubject(subjectId)
      setTopics(toSelectOptions(response))
    } catch (err) {
      const message = isAxiosError(err)
        ? (err.response?.data?.message ?? err.message)
        : 'Failed to load topics'
      setTopicsError(message)
      setTopics([])
    } finally {
      setTopicsLoading(false)
    }
  }

  async function handleTopicIdChange(topicId: string) {
    setSubTopics([])
    setSubTopicsError(null)

    if (!topicId) {
      setSubTopicsLoading(false)
      return
    }

    setSubTopicsLoading(true)

    try {
      const response = await getSubTopicsByTopic(topicId)
      setSubTopics(toSelectOptions(response))
    } catch (err) {
      const message = isAxiosError(err)
        ? (err.response?.data?.message ?? err.message)
        : 'Failed to load sub-topics'
      setSubTopicsError(message)
      setSubTopics([])
    } finally {
      setSubTopicsLoading(false)
    }
  }

  return (
    <div className="home__page">
      <h1 className="home__page-title">Test Creation</h1>
      <p className="home__page-description">Create and manage your tests here.</p>

      {subjectsError && <p className="test-creation__error">{subjectsError}</p>}

      <TestCreationForm
        subjects={subjects}
        subjectsLoading={subjectsLoading}
        topics={topics}
        topicsLoading={topicsLoading}
        topicsError={topicsError}
        subTopics={subTopics}
        subTopicsLoading={subTopicsLoading}
        subTopicsError={subTopicsError}
        onSubjectIdChange={handleSubjectIdChange}
        onTopicIdChange={handleTopicIdChange}
        useApiOptions
        onSubmitDraft={(draft) => {
          clearEditingTestId()
          startNewTestSession(draft)
          navigate('/home/test-creation/questions')
        }}
        onCancel={() => navigate('/home')}
      />
    </div>
  )
}
