# PrepRoute — Technical Decisions

A brief overview of the architectural and implementation choices in this project.

## Stack

| Choice | Rationale |
|--------|-----------|
| **React + TypeScript + Vite** | Component-based UI with type safety and fast local development. |
| **React Router** | Client-side routing with a public login route and protected app routes. |
| **Axios** | Shared HTTP client with interceptors for auth and error handling. |
| **Plain CSS (per feature)** | Colocated styles with BEM-style naming; no extra UI framework dependency. |

## Application structure

```
src/
├── components/     Feature UI (login, home, test-creation, test-tracking)
├── services/       API calls (thin wrappers around Axios)
├── utils/          Payload builders, storage helpers, API mappers
├── types/          Shared TypeScript domain types
└── data/           Static fallbacks and shared constants
```

Features are grouped by screen/flow rather than by file type. Shared logic lives in `utils/` and `services/`.

## Authentication

- **Login** calls `POST /auth/login`. On success, the user is stored in `sessionStorage` and the app navigates to `/home`.
- **JWT** is stored in `localStorage` and attached automatically via an Axios request interceptor (`Authorization: Bearer …`).
- **Route protection** uses a `RequireAuth` wrapper that checks `sessionStorage` before rendering `/home/*`.
- **Session reset on refresh** — `main.tsx` calls `clearAllSessionData()` before the app mounts, clearing user, drafts, token, and related data. Every full page load starts from a clean session.

This prioritizes a simple security model over persisting login or in-progress work across browser refresh.

## API layer

- **Single Axios instance** (`axiosInstance.ts`) with a fixed staging `baseURL`, 10s timeout, and interceptors.
- **Service functions** (`services.ts`) map one-to-one to backend endpoints. Required path parameters (`subjectId`, `topicId`, test `id`) are validated before the request is sent.
- **Response normalization** — helpers like `toSelectOptions()` and `mapApiTest.ts` handle varying API shapes (`id` vs `_id`, raw arrays vs `{ data: [] }`).

## Test creation flow

The flow is a three-step wizard:

1. **Configure test** — subject, topic, sub-topic, duration, difficulty, marking scheme.
2. **Add questions** — slot-based UI with a rich text editor for question content.
3. **Publish** — schedule options, then confirm.

### Cascading dropdowns

| Step | Trigger | API |
|------|---------|-----|
| Subjects | Test Creation page load | `GET /subjects` |
| Topics | Subject selected | `GET /topics/subject/:subjectId` |
| Sub-topics | Topic selected | `GET /sub-topics/topic/:topicId` |

Fetching is orchestrated in page components; results are passed into `TestCreationForm` as props. The form stays presentational and does not call APIs directly for subjects/topics on the main page.

### API integration during question creation

| Action | API | Notes |
|--------|-----|-------|
| First **Add Question** (if no test id) | `POST /tests` | Auto-creates the test so bulk questions have a valid `test_id`. |
| **Add Question** | `POST /questions/bulk` | Payload built by `buildBulkQuestionPayload`. |
| **Create Test** (manual button) | `POST /tests` | Available when all question slots are filled; stores returned test id. |
| **Publish (Confirm)** | `PUT /tests/:id` | Uses the stored API test id. |

**Update Question** updates local state only; it does not call the bulk API.

### Payload builders

UI models and API contracts are kept separate:

- `buildCreateTestPayload` — maps `TestDraft` + questions to the create-test body (snake_case fields, type mapping e.g. `Chapter Wise` → `practice`).
- `buildBulkQuestionPayload` — maps form data to the bulk MCQ shape (`option1`–`option4`, `correct_option`, `test_id`).

## State & storage

| Storage | Purpose |
|---------|---------|
| `sessionStorage` | Logged-in user, test draft, question slots, API test id |
| `localStorage` | JWT |
| React state | Form inputs, loading/error flags, UI toggles |

In-progress test work survives in-app navigation but not a full page refresh (by design, due to startup session clearing).

## UI patterns

- **`TestCreationForm`** — reused on the page and in the edit dialog via a `variant` prop; API-driven options enabled with `useApiOptions`.
- **Static fallbacks** in `testCreationData.ts` — used when API props are not passed (e.g. edit dialog).
- **`TestSummaryBanner`** — shared summary header across add-questions and test tracking views.
- **Test Tracking** — loads tests from `GET /tests` on page entry; display mapped through `mapApiTest.ts`.

## Key trade-offs

1. **Refresh logs the user out** — simpler auth and data hygiene, but drafts are lost on reload.
2. **Hybrid local + API for questions** — adds hit the API; edits stay local until a dedicated update endpoint is wired.
3. **Test created on first question add** — avoids blocking bulk upload on a manual “Create Test” step that appears later in the UI.
4. **Test Tracking is API-backed** — reflects server state after publish, not only locally cached tests.

## Backend

All API calls target the staging backend:

`https://admin-moderator-backend-staging.up.railway.app/api`

Authenticated routes require a valid token from login.
