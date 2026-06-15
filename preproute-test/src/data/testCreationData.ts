export type SelectOption = {
  id: string
  name: string
}

export const SUBJECTS: SelectOption[] = [
  { id: 'mathematics', name: 'Mathematics' },
  { id: 'science', name: 'Science' },
  { id: 'english', name: 'English' },
  { id: 'history', name: 'History' },
]

export const TOPICS_BY_SUBJECT: Record<string, SelectOption[]> = {
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

export const SUB_TOPICS_BY_TOPIC: Record<string, SelectOption[]> = {
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

export const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Difficult'] as const
export const TEST_TYPE_TABS = ['Chapter Wise', 'PYQ', 'Mock Test'] as const

export function getOptionName(options: SelectOption[], id: string) {
  const name = options.find((option) => option.id === id)?.name ?? id
  return name || '—'
}

export function toSelectOptions(data: unknown): SelectOption[] {
  const items = Array.isArray(data)
    ? data
    : Array.isArray((data as { data?: unknown })?.data)
      ? (data as { data: unknown[] }).data
      : []

  return items
    .map((item) => {
      if (!item || typeof item !== 'object') return null

      const record = item as Record<string, unknown>
      const id = String(record._id ?? record.id ?? '')
      const name = String(record.name ?? record.title ?? '')

      if (!id || !name) return null

      return { id, name }
    })
    .filter((item): item is SelectOption => item !== null)
}

export function formatDifficulty(value: string) {
  if (!value) return '—'
  return value.charAt(0).toUpperCase() + value.slice(1)
}
