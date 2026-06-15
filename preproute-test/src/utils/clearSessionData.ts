import { clearUser } from './authStorage.ts'
import { clearCreatedTests } from './createdTestsStorage.ts'
import { clearTestDraft } from './testDraftStorage.ts'

export function clearAllSessionData() {
  clearUser()
  clearTestDraft()
  clearCreatedTests()
  localStorage.removeItem('token')
}
