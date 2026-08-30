> **Fetched from github:** [7](https://github.com/AS95Egypt/cinema-tickets-front/issues/7)  
> *Fetched 2026-08-30T04:19:12.452Z. Edit the sections below as needed; the planner reads this file verbatim.*


## Source — work item (from tracker)

**Title:** User Story 7 — Admin Screening Management  
**Type:** Issue  
**Status:** open

### Description

## Feature

Movie Screening / Schedule Management

## User Story

As an administrator, I want to create and view movie screenings so that I can schedule active movies in available cinema halls at specific dates and times.

## Frontend Technology

* Angular
* TypeScript
* Angular Reactive Forms
* Angular HttpClient
* Angular Router
* Angular Signals and/or RxJS

## Authorization

All screening management functionality requires an authenticated administrator.

The backend remains responsible for enforcing administrator authorization and scheduling business rules.

---

## Backend API Dependencies

### Create Screening

```http
POST /api/movies/{movieId}/screenings
```

Example:

```json
{
  "hallId": "hall-001",
  "startDateTime": "2026-08-25T20:00:00",
  "price": 150
}
```

### Get Screenings for Movie

```http
GET /api/movies/{movieId}/screenings
```

The frontend should use the actual API contract implemented by the backend.

---

## Screening Data

A screening contains:

```text
Id
MovieId
HallId
StartDateTime
Price
CreatedAt
UpdatedAt
```

Screening duration is derived from the associated movie's duration.

The frontend should not require a separate screening duration field.

---

## Requirements

### 1. Screening Management Page

Create:

```text
/admin/screenings
```

The page should allow administrators to:

* View screenings.
* Create a new screening.
* Navigate to movie/hall information.

The exact presentation may use a table, calendar, or grouped list.

---

### 2. Retrieve Screenings

Screenings can be retrieved through:

```http
GET /api/movies/{movieId}/screenings
```

The frontend may retrieve screenings per movie or use an appropriate backend endpoint if a global screening endpoint is added.

The implementation should not assume a global endpoint exists if the backend does not provide one.

---

### 3. Create Screening

Create:

```text
/admin/screenings/create
```

The form should contain:

```text
Movie
Hall
Start Date 
Start Time
Price
```

---

### 4. Movie Selection

The movie selector should contain only active movies.

The frontend should retrieve active movies using:

```http
GET /api/movies/active
```

---

### 5. Hall Selection

The hall selector should contain active halls.

Retrieve halls using:

```http
GET /api/halls
```

and only allow active halls to be selected.

A deactivated hall must not be offered for a new screening.

---

### 6. Date and Time

The administrator must select:

```text
Start Date
Start Time
```

The frontend should combine them into the backend's expected `startDateTime` format.

Example:

```json
{
  "hallId": "hall-001",
  "startDateTime": "2026-08-25T20:00:00",
  "price": 150
}
```

The implementation must be careful about timezone handling.

The application's chosen timezone strategy should be documented during implementation planning.

---

### 7. Price Validation

The price must:

* Be required.
* Be numeric.
* Be greater than zero.
* Use an appropriate currency display.

Example:

```text
150 EGP
```

The frontend should prevent obviously invalid values, while the backend remains responsible for final validation.

---

### 8. Screening Conflict

A hall cannot contain overlapping screenings.

The backend calculates the screening end time using:

```text
StartTime + Movie.Duration
```

The frontend should handle a backend conflict response gracefully.

Example:

```text
This hall is already occupied during the selected time.
Please choose another hall or time.
```

The frontend should **not duplicate the complete scheduling conflict algorithm** unless a future backend endpoint specifically exposes availability information.

The backend is the final authority.

---

### 9. Inactive Movie/Hall

The frontend must not allow the administrator to create a screening using:

* An inactive movie.
* An inactive hall.

If the backend rejects the request anyway, display the backend error appropriately.

---

### 10. Screening List

Display useful screening information:

```text
Movie
Date
Start Time
Hall
Hall Type
Price
```

Example:

```text
Example Movie
25 Aug 2026
20:00
Hall 1
IMAX
150 EGP
```

---

### 11. Group Screenings

Screenings should be grouped by date where practical.

Example:

```text
Monday, August 25

18:00 — Example Movie — Hall 1 — IMAX
21:00 — Another Movie — Hall 2 — Gold


Tuesday, August 26

17:00 — Example Movie — Hall 1 — IMAX
```

---

### 12. Past Screenings

Past screenings should be clearly identified.

The frontend should not provide reservation-related actions for screenings whose start time has already passed.

Historical screenings should remain visible to administrators.

---

### 13. Screening Creation Result

After successful creation:

* Display a success message.
* Navigate to the screening list/details.
* Display the newly created screening where possible.

Example:

```text
Screening created successfully.
```

---

### 14. Error Handling

Handle:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

Especially handle:

```text
409 Conflict
```

for scheduling conflicts.

Example:

```text
The selected hall already has another screening during this time.
```

Do not expose raw backend exceptions.

---

### 15. Loading States

Provide loading indicators when:

* Loading movies.
* Loading halls.
* Loading screenings.
* Creating a screening.

Disable the submit button while the create request is in progress to prevent accidental duplicate submissions.

---

## Angular Structure

Suggested:

```text
src/app/
└── features/
    └── admin/
        └── screenings/
            ├── screening-list/
            ├── screening-create/
            ├── screening-details/
            ├── screening.service.ts
            └── screening.models.ts
```

The create page should reuse existing movie/hall services rather than duplicating API calls.

---

## Important Architectural Rule

The frontend should not become the source of truth for cinema scheduling.

The backend is responsible for enforcing:

```text
Active Movie
        +
Active Hall
        +
No Hall Conflict
        +
Valid Date/Time
        ↓
Valid Screening
```

The Angular application provides validation and a good user experience, while the ASP.NET Core backend enforces the actual business rules.

---

## Acceptance Criteria

* Administrator can access screening management.
* Administrator can view screenings.
* Administrator can create a screening.
* Only active movies can be selected.
* Only active halls can be selected.
* Administrator can select date and time.
* Administrator can enter a valid ticket price.
* Screening data is submitted using the backend API.
* Backend scheduling conflicts are handled gracefully.
* Inactive movies cannot receive new screenings.
* Inactive halls cannot receive new screenings.
* Past screenings are clearly identified.
* Screenings can be grouped by date.
* Movie, hall, hall type, time, and price are displayed.
* Duplicate submissions are prevented while creating a screening.
* Loading, empty, success, and error states are handled.
* Backend remains the final authority for scheduling validation and authorization.

### Attachments

None.

---
# Story intake

Fill this template for each story you want planned. Keep it copy-paste-friendly: the planner reads **this file and the files in `attachments/`**, nothing else.

- Folder: `.squad/stories/admin-dashboard/7/intake.md`
- Binaries (screenshots, PDFs, exports): put them in `attachments/` next to this file and list them below.
- Do **not** rely on external links (tracker URLs, wiki, chat) — the planner cannot open them. Paste the content you want considered.

This is **not** an implementation prompt. It is the input to the plan-generation meta-prompt bundled with squad-kit (`generate-plan.md` in the installed package).

---

## Feature

- **Feature name (display):**
- **Feature slug (folder under `plans/`):** `admin-dashboard`

## Tracker (metadata only)

- **Tracker type:** `github`
- **Work item id:** `7` *(used in filenames and plan tables; fill manually if empty)*
- **Work item type:** `Issue`
- **Status:** `open`
- **Assignee:** ``
- **Labels:** ``

External tracker links are **not** followed by the planner. Keep the id for naming and traceability only.

---

## Title

*(Paste the work item title verbatim. Prefilled when `squad new-story` fetched from a tracker.)*

```
User Story 7 — Admin Screening Management
```

---

## Description

*(Paste the full work item description. Prefilled when fetched from a tracker.)*

```
## Feature

Movie Screening / Schedule Management

## User Story

As an administrator, I want to create and view movie screenings so that I can schedule active movies in available cinema halls at specific dates and times.

## Frontend Technology

* Angular
* TypeScript
* Angular Reactive Forms
* Angular HttpClient
* Angular Router
* Angular Signals and/or RxJS

## Authorization

All screening management functionality requires an authenticated administrator.

The backend remains responsible for enforcing administrator authorization and scheduling business rules.

---

## Backend API Dependencies

### Create Screening

```http
POST /api/movies/{movieId}/screenings
```

Example:

```json
{
  "hallId": "hall-001",
  "startDateTime": "2026-08-25T20:00:00",
  "price": 150
}
```

### Get Screenings for Movie

```http
GET /api/movies/{movieId}/screenings
```

The frontend should use the actual API contract implemented by the backend.

---

## Screening Data

A screening contains:

```text
Id
MovieId
HallId
StartDateTime
Price
CreatedAt
UpdatedAt
```

Screening duration is derived from the associated movie's duration.

The frontend should not require a separate screening duration field.

---

## Requirements

### 1. Screening Management Page

Create:

```text
/admin/screenings
```

The page should allow administrators to:

* View screenings.
* Create a new screening.
* Navigate to movie/hall information.

The exact presentation may use a table, calendar, or grouped list.

---

### 2. Retrieve Screenings

Screenings can be retrieved through:

```http
GET /api/movies/{movieId}/screenings
```

The frontend may retrieve screenings per movie or use an appropriate backend endpoint if a global screening endpoint is added.

The implementation should not assume a global endpoint exists if the backend does not provide one.

---

### 3. Create Screening

Create:

```text
/admin/screenings/create
```

The form should contain:

```text
Movie
Hall
Start Date 
Start Time
Price
```

---

### 4. Movie Selection

The movie selector should contain only active movies.

The frontend should retrieve active movies using:

```http
GET /api/movies/active
```

---

### 5. Hall Selection

The hall selector should contain active halls.

Retrieve halls using:

```http
GET /api/halls
```

and only allow active halls to be selected.

A deactivated hall must not be offered for a new screening.

---

### 6. Date and Time

The administrator must select:

```text
Start Date
Start Time
```

The frontend should combine them into the backend's expected `startDateTime` format.

Example:

```json
{
  "hallId": "hall-001",
  "startDateTime": "2026-08-25T20:00:00",
  "price": 150
}
```

The implementation must be careful about timezone handling.

The application's chosen timezone strategy should be documented during implementation planning.

---

### 7. Price Validation

The price must:

* Be required.
* Be numeric.
* Be greater than zero.
* Use an appropriate currency display.

Example:

```text
150 EGP
```

The frontend should prevent obviously invalid values, while the backend remains responsible for final validation.

---

### 8. Screening Conflict

A hall cannot contain overlapping screenings.

The backend calculates the screening end time using:

```text
StartTime + Movie.Duration
```

The frontend should handle a backend conflict response gracefully.

Example:

```text
This hall is already occupied during the selected time.
Please choose another hall or time.
```

The frontend should **not duplicate the complete scheduling conflict algorithm** unless a future backend endpoint specifically exposes availability information.

The backend is the final authority.

---

### 9. Inactive Movie/Hall

The frontend must not allow the administrator to create a screening using:

* An inactive movie.
* An inactive hall.

If the backend rejects the request anyway, display the backend error appropriately.

---

### 10. Screening List

Display useful screening information:

```text
Movie
Date
Start Time
Hall
Hall Type
Price
```

Example:

```text
Example Movie
25 Aug 2026
20:00
Hall 1
IMAX
150 EGP
```

---

### 11. Group Screenings

Screenings should be grouped by date where practical.

Example:

```text
Monday, August 25

18:00 — Example Movie — Hall 1 — IMAX
21:00 — Another Movie — Hall 2 — Gold


Tuesday, August 26

17:00 — Example Movie — Hall 1 — IMAX
```

---

### 12. Past Screenings

Past screenings should be clearly identified.

The frontend should not provide reservation-related actions for screenings whose start time has already passed.

Historical screenings should remain visible to administrators.

---

### 13. Screening Creation Result

After successful creation:

* Display a success message.
* Navigate to the screening list/details.
* Display the newly created screening where possible.

Example:

```text
Screening created successfully.
```

---

### 14. Error Handling

Handle:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

Especially handle:

```text
409 Conflict
```

for scheduling conflicts.

Example:

```text
The selected hall already has another screening during this time.
```

Do not expose raw backend exceptions.

---

### 15. Loading States

Provide loading indicators when:

* Loading movies.
* Loading halls.
* Loading screenings.
* Creating a screening.

Disable the submit button while the create request is in progress to prevent accidental duplicate submissions.

---

## Angular Structure

Suggested:

```text
src/app/
└── features/
    └── admin/
        └── screenings/
            ├── screening-list/
            ├── screening-create/
            ├── screening-details/
            ├── screening.service.ts
            └── screening.models.ts
```

The create page should reuse existing movie/hall services rather than duplicating API calls.

---

## Important Architectural Rule

The frontend should not become the source of truth for cinema scheduling.

The backend is responsible for enforcing:

```text
Active Movie
        +
Active Hall
        +
No Hall Conflict
        +
Valid Date/Time
        ↓
Valid Screening
```

The Angular application provides validation and a good user experience, while the ASP.NET Core backend enforces the actual business rules.

---

## Acceptance Criteria

* Administrator can access screening management.
* Administrator can view screenings.
* Administrator can create a screening.
* Only active movies can be selected.
* Only active halls can be selected.
* Administrator can select date and time.
* Administrator can enter a valid ticket price.
* Screening data is submitted using the backend API.
* Backend scheduling conflicts are handled gracefully.
* Inactive movies cannot receive new screenings.
* Inactive halls cannot receive new screenings.
* Past screenings are clearly identified.
* Screenings can be grouped by date.
* Movie, hall, hall type, time, and price are displayed.
* Duplicate submissions are prevented while creating a screening.
* Loading, empty, success, and error states are handled.
* Backend remains the final authority for scheduling validation and authorization.
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
