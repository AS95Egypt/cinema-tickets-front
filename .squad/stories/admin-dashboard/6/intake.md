> **Fetched from github:** [6](https://github.com/AS95Egypt/cinema-tickets-front/issues/6)  
> *Fetched 2026-08-29T20:47:57.894Z. Edit the sections below as needed; the planner reads this file verbatim.*


## Source — work item (from tracker)

**Title:** User Story 6 — Admin Movie Management  
**Type:** Issue  
**Status:** open

### Description

## Feature

Movie Management

## User Story

As an administrator, I want to create, view, edit, deactivate and activate movies so that I can manage the movies available for cinema screenings and customer browsing.

## Frontend Technology

* Angular
* TypeScript
* Angular Reactive Forms
* Angular HttpClient
* Angular Router
* Angular Signals and/or RxJS

## Authorization

All movie management functionality requires an authenticated administrator.

The backend remains responsible for enforcing administrator authorization.

---

## Backend API Dependencies

### Get Movies

```http
GET /api/movies
```

### Get Movie

```http
GET /api/movies/{id}
```

### Create Movie

```http
POST /api/movies
```

Example:

```json
{
  "title": "Example Movie",
  "genre": "Action",
  "duration": 120,
  "releaseDate": "2026-08-20",
  "language": "English",
  "description": "Example description",
  "actors": "Actor A, Actor B",
  "trailerUrl": "https://example.com/trailer"
}
```

### Update Movie

```http
PUT /api/movies/{id}
```

### Deactivate Movie

```http
PATCH /api/movies/{id}/deactivate

Activate Movie

PATCH /api/movies/{id}/activate
```

---

## Movie Data

A movie contains:

```text
Id
Title
Genre
Duration
ReleaseDate
Language
Description
Actors
TrailerUrl
IsActive
CreatedAt
UpdatedAt
```

Movie IDs are UUID/GUID values.

---

## Supported Genres

The UI should provide the genres supported by the backend.

Initially:

```text
Comedy
Action
Drama
Fantasy
```

---

## Requirements

### 1. Movie List

Create:

```text
/admin/movies
```

Display:

* Movie title
* Genre
* Duration
* Release date
* Language
* Active/inactive status
* Actions

Actions:

```text
View
Edit
Deactivate
Activate
```

---

### 2. Retrieve Movies

Call:

```http
GET /api/movies
```

Display loading, empty, and error states.

Administrators should be able to distinguish active and inactive movies.

---

### 3. Create Movie

Create:

```text
/admin/movies/create
```

Form fields:

```text
Title
Genre
Duration
Release Date
Language
Description
Actors
Trailer URL
```

Submit:

```http
POST /api/movies
```

---

### 4. Client-Side Validation

Validate:

* Title is required.
* Genre is required.
* Duration is required.
* Duration must be greater than zero.
* Release date is required and valid.
* Language is required.
* Description is required where applicable.
* Trailer URL must be a valid URL when provided.

Do not submit invalid forms.

---

### 5. Edit Movie

Create:

```text
/admin/movies/{id}/edit
```

Retrieve:

```http
GET /api/movies/{id}
```

Populate the form.

Submit:

```http
PUT /api/movies/{id}
```

After successful update:

* Display success feedback.
* Navigate back to the movie list/details page.

---

### 6. Deactivate Movie

Provide a deactivate action.

Before calling the API, display a confirmation dialog.

If confirmed:

```http
PATCH /api/movies/{id}/deactivate
```

After successful deactivation:

* Update the UI.
* Mark the movie inactive.
* Do not physically remove the movie from admin history.

---

### 7. Inactive Movie Behavior

Inactive movies:

* Should remain visible to administrators.
* Should be clearly marked as inactive.
* Must not be offered as active movies when creating screenings.
* Must not appear in the customer active movie listing.

The backend remains responsible for enforcing these rules.

and do the opposite for activate hall and adjust the interface

---

### 8. Movie Details

Provide:

```text
/admin/movies/{id}
```

Display the complete movie information.

If a trailer URL exists, provide a link/button to open the trailer.

The frontend should not attempt to embed arbitrary URLs unless the implementation explicitly supports safe embedding.

---

### 9. Error Handling

Handle:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

Display appropriate user-friendly messages.

---

### 10. Loading and Empty States

Provide:

* Loading indicator/skeleton
* Empty state
* Error state
* Retry action where appropriate

---

## Angular Structure

Suggested:

```text
src/app/
└── features/
    └── admin/
        └── movies/
            ├── movie-list/
            ├── movie-create/
            ├── movie-edit/
            ├── movie-details/
            ├── movie.service.ts
            └── movie.models.ts
```

Create/edit should preferably reuse the same movie form component where practical.

---

## Acceptance Criteria

* Administrator can view movies.
* Administrator can create a movie.
* Administrator can edit a movie.
* Administrator can view movie details.
* Administrator can deactivate a movie.
* Movie genre is selected from supported genres.
* Invalid duration is rejected.
* Invalid trailer URL is rejected.
* Required fields are validated.
* Inactive movies are clearly identified.
* Inactive movies cannot be selected when creating screenings.
* Customer-facing active movie listing is unaffected by admin-only inactive movies.
* Backend errors are displayed appropriately.
* Unauthorized users cannot perform movie management operations.
* Loading, empty, success, and error states are handled.

### Attachments

None.

---
# Story intake

Fill this template for each story you want planned. Keep it copy-paste-friendly: the planner reads **this file and the files in `attachments/`**, nothing else.

- Folder: `.squad/stories/admin-dashboard/6/intake.md`
- Binaries (screenshots, PDFs, exports): put them in `attachments/` next to this file and list them below.
- Do **not** rely on external links (tracker URLs, wiki, chat) — the planner cannot open them. Paste the content you want considered.

This is **not** an implementation prompt. It is the input to the plan-generation meta-prompt bundled with squad-kit (`generate-plan.md` in the installed package).

---

## Feature

- **Feature name (display):**
- **Feature slug (folder under `plans/`):** `admin-dashboard`

## Tracker (metadata only)

- **Tracker type:** `github`
- **Work item id:** `6` *(used in filenames and plan tables; fill manually if empty)*
- **Work item type:** `Issue`
- **Status:** `open`
- **Assignee:** ``
- **Labels:** ``

External tracker links are **not** followed by the planner. Keep the id for naming and traceability only.

---

## Title

*(Paste the work item title verbatim. Prefilled when `squad new-story` fetched from a tracker.)*

```
User Story 6 — Admin Movie Management
```

---

## Description

*(Paste the full work item description. Prefilled when fetched from a tracker.)*

```
## Feature

Movie Management

## User Story

As an administrator, I want to create, view, edit, deactivate and activate movies so that I can manage the movies available for cinema screenings and customer browsing.

## Frontend Technology

* Angular
* TypeScript
* Angular Reactive Forms
* Angular HttpClient
* Angular Router
* Angular Signals and/or RxJS

## Authorization

All movie management functionality requires an authenticated administrator.

The backend remains responsible for enforcing administrator authorization.

---

## Backend API Dependencies

### Get Movies

```http
GET /api/movies
```

### Get Movie

```http
GET /api/movies/{id}
```

### Create Movie

```http
POST /api/movies
```

Example:

```json
{
  "title": "Example Movie",
  "genre": "Action",
  "duration": 120,
  "releaseDate": "2026-08-20",
  "language": "English",
  "description": "Example description",
  "actors": "Actor A, Actor B",
  "trailerUrl": "https://example.com/trailer"
}
```

### Update Movie

```http
PUT /api/movies/{id}
```

### Deactivate Movie

```http
PATCH /api/movies/{id}/deactivate

Activate Movie

PATCH /api/movies/{id}/activate
```

---

## Movie Data

A movie contains:

```text
Id
Title
Genre
Duration
ReleaseDate
Language
Description
Actors
TrailerUrl
IsActive
CreatedAt
UpdatedAt
```

Movie IDs are UUID/GUID values.

---

## Supported Genres

The UI should provide the genres supported by the backend.

Initially:

```text
Comedy
Action
Drama
Fantasy
```

---

## Requirements

### 1. Movie List

Create:

```text
/admin/movies
```

Display:

* Movie title
* Genre
* Duration
* Release date
* Language
* Active/inactive status
* Actions

Actions:

```text
View
Edit
Deactivate
Activate
```

---

### 2. Retrieve Movies

Call:

```http
GET /api/movies
```

Display loading, empty, and error states.

Administrators should be able to distinguish active and inactive movies.

---

### 3. Create Movie

Create:

```text
/admin/movies/create
```

Form fields:

```text
Title
Genre
Duration
Release Date
Language
Description
Actors
Trailer URL
```

Submit:

```http
POST /api/movies
```

---

### 4. Client-Side Validation

Validate:

* Title is required.
* Genre is required.
* Duration is required.
* Duration must be greater than zero.
* Release date is required and valid.
* Language is required.
* Description is required where applicable.
* Trailer URL must be a valid URL when provided.

Do not submit invalid forms.

---

### 5. Edit Movie

Create:

```text
/admin/movies/{id}/edit
```

Retrieve:

```http
GET /api/movies/{id}
```

Populate the form.

Submit:

```http
PUT /api/movies/{id}
```

After successful update:

* Display success feedback.
* Navigate back to the movie list/details page.

---

### 6. Deactivate Movie

Provide a deactivate action.

Before calling the API, display a confirmation dialog.

If confirmed:

```http
PATCH /api/movies/{id}/deactivate
```

After successful deactivation:

* Update the UI.
* Mark the movie inactive.
* Do not physically remove the movie from admin history.

---

### 7. Inactive Movie Behavior

Inactive movies:

* Should remain visible to administrators.
* Should be clearly marked as inactive.
* Must not be offered as active movies when creating screenings.
* Must not appear in the customer active movie listing.

The backend remains responsible for enforcing these rules.

and do the opposite for activate hall and adjust the interface

---

### 8. Movie Details

Provide:

```text
/admin/movies/{id}
```

Display the complete movie information.

If a trailer URL exists, provide a link/button to open the trailer.

The frontend should not attempt to embed arbitrary URLs unless the implementation explicitly supports safe embedding.

---

### 9. Error Handling

Handle:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

Display appropriate user-friendly messages.

---

### 10. Loading and Empty States

Provide:

* Loading indicator/skeleton
* Empty state
* Error state
* Retry action where appropriate

---

## Angular Structure

Suggested:

```text
src/app/
└── features/
    └── admin/
        └── movies/
            ├── movie-list/
            ├── movie-create/
            ├── movie-edit/
            ├── movie-details/
            ├── movie.service.ts
            └── movie.models.ts
```

Create/edit should preferably reuse the same movie form component where practical.

---

## Acceptance Criteria

* Administrator can view movies.
* Administrator can create a movie.
* Administrator can edit a movie.
* Administrator can view movie details.
* Administrator can deactivate a movie.
* Movie genre is selected from supported genres.
* Invalid duration is rejected.
* Invalid trailer URL is rejected.
* Required fields are validated.
* Inactive movies are clearly identified.
* Inactive movies cannot be selected when creating screenings.
* Customer-facing active movie listing is unaffected by admin-only inactive movies.
* Backend errors are displayed appropriately.
* Unauthorized users cannot perform movie management operations.
* Loading, empty, success, and error states are handled.
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
