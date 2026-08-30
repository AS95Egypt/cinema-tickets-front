> **Fetched from github:** [2](https://github.com/AS95Egypt/cinema-tickets-front/issues/2)  
> *Fetched 2026-08-29T11:59:09.861Z. Edit the sections below as needed; the planner reads this file verbatim.*


## Source — work item (from tracker)

**Title:** User Story 2 — Browse Movies & Screenings  
**Type:** Issue  
**Status:** open

### Description

## Feature

Customer Movie & Screening Discovery

## User Story

As a cinema customer, I want to browse active movies and their available screenings so that I can choose a movie, date, and screening before reserving seats.

## Frontend Technology

* Angular
* TypeScript
* Angular Router
* Angular HttpClient
* Reactive UI components
* RxJS and/or Angular Signals

## Backend API Dependencies

The frontend integrates with the following existing backend endpoints.

### Get Active Movies

```http
GET /api/movies/active
```

This endpoint provides customer-facing active movies.

### Get Movie Details

```http
GET /api/movies/{movieId}
```

### Get Movie Screenings

```http
GET /api/movies/{movieId}/screenings
```

Optional date filtering may be supported by the backend if implemented.

---

## Requirements

### 1. Movie Listing Page

Create a customer-facing movie listing page.

The page should display active movies retrieved from:

```http
GET /api/movies/active
```

Each movie card should display appropriate summary information, such as:

* Movie title
* Genre
* Duration
* Language
* Release date
* Description summary
* Movie image/poster if supported by the backend
* Active status where appropriate

Inactive movies must not be displayed.

The frontend must not attempt to determine whether a movie is active independently if the backend already provides an active-movie endpoint.

---

### 2. Loading State

While movies are being retrieved:

* Display a loading indicator/skeleton.
* Prevent misleading empty-state messages while the request is still in progress.

---

### 3. Empty State

If no active movies are returned:

Display an appropriate message such as:

```text
No movies are currently available.
```

---

### 4. Error Handling

If retrieving movies fails:

* Display a user-friendly error.
* Provide a retry mechanism where appropriate.
* Do not display raw server errors.

---

### 5. Movie Details

Selecting a movie should navigate to a movie details page.

Example route:

```text
/movies/{movieId}
```

The page should retrieve movie information from:

```http
GET /api/movies/{movieId}
```

The page should display:

* Title
* Genre
* Duration
* Release date
* Language
* Description
* Actors
* Trailer
* Available screenings

---

### 6. Screening Retrieval

Retrieve screenings using:

```http
GET /api/movies/{movieId}/screenings
```

The frontend should display future screenings available for reservation.

Past screenings must not be presented as selectable reservation options.

The backend remains responsible for enforcing whether a screening can actually accept reservations.

---

### 7. Group Screenings by Day

The frontend should group screenings by calendar day.

Example:

```text
Monday, August 25

18:00   Hall 1 - IMAX   150 EGP
21:00   Hall 1 - IMAX   150 EGP


Tuesday, August 26

17:00   Hall 2 - Gold   180 EGP
20:30   Hall 2 - Gold   180 EGP
```

The grouping should be performed by the frontend based on the screening `startDateTime`.

---

### 8. Screening Information

Each screening option should display:

* Start date
* Start time
* Hall title
* Hall type
* Ticket price

Example backend object:

```json
{
  "id": "screening-001",
  "startDateTime": "2026-08-25T18:00:00",
  "price": 150,
  "hall": {
    "id": "hall-001",
    "title": "Hall 1",
    "type": "IMAX"
  }
}
```

---

### 9. Select Screening

The customer should be able to select an available screening.

Selecting a screening should navigate to the seat-selection experience.

Example:

```text
/screenings/{screeningId}/seats
```

The exact route can be refined during planning.

The selected screening ID must be preserved so that it can be used by the reservation API in the next story.

---

### 10. Authentication Behavior

Browsing movies and screenings should remain publicly accessible unless the backend explicitly requires authentication.

Authentication should be required when the customer starts the reservation process if that is the backend business rule.

If authentication is required for reservation:

```text
Browse Movie
    ↓
Select Screening
    ↓
Seat Selection
    ↓
Not authenticated?
    ↓
Login
    ↓
Return to selected screening
```

---

## Angular Structure

A possible feature structure:

```text
src/app/
├── features/
│   └── movies/
│       ├── movie-list/
│       ├── movie-details/
│       ├── screening-list/
│       ├── models/
│       └── movie.service.ts
│
└── core/
    └── services/
```

The exact structure should be refined during the execution plan.

---

## Data Models

Create appropriate TypeScript interfaces/models for API responses.

For example:

```typescript
interface Movie {
  id: string;
  title: string;
  genre: string;
  duration: number;
  releaseDate: string;
  language: string;
  description: string;
  actors: string;
  trailerUrl?: string;
  isActive: boolean;
}

interface Screening {
  id: string;
  startDateTime: string;
  price: number;
  hall: {
    id: string;
    title: string;
    type: string;
  };
}
```

The models should reflect the actual backend response rather than unnecessarily duplicating backend data.

---

## Acceptance Criteria

* Customer can browse active movies.
* Active movies are retrieved from `GET /api/movies/active`.
* Customer can open a movie details page.
* Movie details are retrieved from the backend.
* Customer can view available screenings for a movie.
* Screenings are retrieved from `GET /api/movies/{movieId}/screenings`.
* Screenings are grouped by day.
* Screening time, hall, hall type, and price are displayed.
* Past screenings cannot be selected for reservation.
* Customer can select a future screening.
* Selected movie/screening information is preserved when navigating to seat selection.
* Loading, empty, and error states are handled.
* Backend errors are not exposed directly to the customer.
* Movie browsing remains accessible without authentication unless the backend explicitly requires otherwise.

### Attachments

None.

---
# Story intake

Fill this template for each story you want planned. Keep it copy-paste-friendly: the planner reads **this file and the files in `attachments/`**, nothing else.

- Folder: `.squad/stories/movies-screenings/2/intake.md`
- Binaries (screenshots, PDFs, exports): put them in `attachments/` next to this file and list them below.
- Do **not** rely on external links (tracker URLs, wiki, chat) — the planner cannot open them. Paste the content you want considered.

This is **not** an implementation prompt. It is the input to the plan-generation meta-prompt bundled with squad-kit (`generate-plan.md` in the installed package).

---

## Feature

- **Feature name (display):**
- **Feature slug (folder under `plans/`):** `movies-screenings`

## Tracker (metadata only)

- **Tracker type:** `github`
- **Work item id:** `2` *(used in filenames and plan tables; fill manually if empty)*
- **Work item type:** `Issue`
- **Status:** `open`
- **Assignee:** ``
- **Labels:** ``

External tracker links are **not** followed by the planner. Keep the id for naming and traceability only.

---

## Title

*(Paste the work item title verbatim. Prefilled when `squad new-story` fetched from a tracker.)*

```
User Story 2 — Browse Movies & Screenings
```

---

## Description

*(Paste the full work item description. Prefilled when fetched from a tracker.)*

```
## Feature

Customer Movie & Screening Discovery

## User Story

As a cinema customer, I want to browse active movies and their available screenings so that I can choose a movie, date, and screening before reserving seats.

## Frontend Technology

* Angular
* TypeScript
* Angular Router
* Angular HttpClient
* Reactive UI components
* RxJS and/or Angular Signals

## Backend API Dependencies

The frontend integrates with the following existing backend endpoints.

### Get Active Movies

```http
GET /api/movies/active
```

This endpoint provides customer-facing active movies.

### Get Movie Details

```http
GET /api/movies/{movieId}
```

### Get Movie Screenings

```http
GET /api/movies/{movieId}/screenings
```

Optional date filtering may be supported by the backend if implemented.

---

## Requirements

### 1. Movie Listing Page

Create a customer-facing movie listing page.

The page should display active movies retrieved from:

```http
GET /api/movies/active
```

Each movie card should display appropriate summary information, such as:

* Movie title
* Genre
* Duration
* Language
* Release date
* Description summary
* Movie image/poster if supported by the backend
* Active status where appropriate

Inactive movies must not be displayed.

The frontend must not attempt to determine whether a movie is active independently if the backend already provides an active-movie endpoint.

---

### 2. Loading State

While movies are being retrieved:

* Display a loading indicator/skeleton.
* Prevent misleading empty-state messages while the request is still in progress.

---

### 3. Empty State

If no active movies are returned:

Display an appropriate message such as:

```text
No movies are currently available.
```

---

### 4. Error Handling

If retrieving movies fails:

* Display a user-friendly error.
* Provide a retry mechanism where appropriate.
* Do not display raw server errors.

---

### 5. Movie Details

Selecting a movie should navigate to a movie details page.

Example route:

```text
/movies/{movieId}
```

The page should retrieve movie information from:

```http
GET /api/movies/{movieId}
```

The page should display:

* Title
* Genre
* Duration
* Release date
* Language
* Description
* Actors
* Trailer
* Available screenings

---

### 6. Screening Retrieval

Retrieve screenings using:

```http
GET /api/movies/{movieId}/screenings
```

The frontend should display future screenings available for reservation.

Past screenings must not be presented as selectable reservation options.

The backend remains responsible for enforcing whether a screening can actually accept reservations.

---

### 7. Group Screenings by Day

The frontend should group screenings by calendar day.

Example:

```text
Monday, August 25

18:00   Hall 1 - IMAX   150 EGP
21:00   Hall 1 - IMAX   150 EGP


Tuesday, August 26

17:00   Hall 2 - Gold   180 EGP
20:30   Hall 2 - Gold   180 EGP
```

The grouping should be performed by the frontend based on the screening `startDateTime`.

---

### 8. Screening Information

Each screening option should display:

* Start date
* Start time
* Hall title
* Hall type
* Ticket price

Example backend object:

```json
{
  "id": "screening-001",
  "startDateTime": "2026-08-25T18:00:00",
  "price": 150,
  "hall": {
    "id": "hall-001",
    "title": "Hall 1",
    "type": "IMAX"
  }
}
```

---

### 9. Select Screening

The customer should be able to select an available screening.

Selecting a screening should navigate to the seat-selection experience.

Example:

```text
/screenings/{screeningId}/seats
```

The exact route can be refined during planning.

The selected screening ID must be preserved so that it can be used by the reservation API in the next story.

---

### 10. Authentication Behavior

Browsing movies and screenings should remain publicly accessible unless the backend explicitly requires authentication.

Authentication should be required when the customer starts the reservation process if that is the backend business rule.

If authentication is required for reservation:

```text
Browse Movie
    ↓
Select Screening
    ↓
Seat Selection
    ↓
Not authenticated?
    ↓
Login
    ↓
Return to selected screening
```

---

## Angular Structure

A possible feature structure:

```text
src/app/
├── features/
│   └── movies/
│       ├── movie-list/
│       ├── movie-details/
│       ├── screening-list/
│       ├── models/
│       └── movie.service.ts
│
└── core/
    └── services/
```

The exact structure should be refined during the execution plan.

---

## Data Models

Create appropriate TypeScript interfaces/models for API responses.

For example:

```typescript
interface Movie {
  id: string;
  title: string;
  genre: string;
  duration: number;
  releaseDate: string;
  language: string;
  description: string;
  actors: string;
  trailerUrl?: string;
  isActive: boolean;
}

interface Screening {
  id: string;
  startDateTime: string;
  price: number;
  hall: {
    id: string;
    title: string;
    type: string;
  };
}
```

The models should reflect the actual backend response rather than unnecessarily duplicating backend data.

---

## Acceptance Criteria

* Customer can browse active movies.
* Active movies are retrieved from `GET /api/movies/active`.
* Customer can open a movie details page.
* Movie details are retrieved from the backend.
* Customer can view available screenings for a movie.
* Screenings are retrieved from `GET /api/movies/{movieId}/screenings`.
* Screenings are grouped by day.
* Screening time, hall, hall type, and price are displayed.
* Past screenings cannot be selected for reservation.
* Customer can select a future screening.
* Selected movie/screening information is preserved when navigating to seat selection.
* Loading, empty, and error states are handled.
* Backend errors are not exposed directly to the customer.
* Movie browsing remains accessible without authentication unless the backend explicitly requires otherwise.
```

---

## Acceptance criteria

*(Checklist, bullets, Gherkin, etc. Prefilled for Azure DevOps when the work item has acceptance criteria.)*

```

```

---

## Attachments

Place files in `attachments/` next to this `intake.md`, then list them here so the planner knows what to open.

| File (relative to this folder) | What it is |
| ------------------------------ | ---------- |
| *(e.g. `attachments/flow.png`)* | *(e.g. UX flow)* |

*(Add rows per file. If none, write "None.")*

---

## Dependencies

- **Blocked by / related ids:** (tracker ids only; optional short note)
- **Depends on code areas or other stories:**

## Extra notes (optional)

- Anything not captured above (e.g. chat context) — keep short.

## Technical hints (optional)

- APIs, screens, services already discussed. Repos/roots: `.`. Primary language: `typescript`.

## Out of scope

- What this story explicitly does **not** cover:
