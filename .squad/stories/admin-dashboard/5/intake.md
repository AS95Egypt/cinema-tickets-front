> **Fetched from github:** [5](https://github.com/AS95Egypt/cinema-tickets-front/issues/5)  
> *Fetched 2026-08-29T19:32:37.174Z. Edit the sections below as needed; the planner reads this file verbatim.*


## Source — work item (from tracker)

**Title:** User Story 5 — Admin Hall Management  
**Type:** Issue  
**Status:** open

### Description

## Feature

Cinema Hall Management

## User Story

As an administrator, I want to create, view, edit, deactivate and activate cinema halls so that I can manage the halls available for movie screenings.

## Frontend Technology

* Angular
* TypeScript
* Angular Reactive Forms
* Angular HttpClient
* Angular Router
* Angular Signals and/or RxJS

## Authorization

All hall management functionality requires an authenticated administrator.

The backend remains responsible for enforcing administrator authorization.

---

## Backend API Dependencies

The frontend integrates with the following backend endpoints.

### Get Halls

```http
GET /api/halls
```

### Get Hall

```http
GET /api/halls/{id}
```

### Create Hall

```http
POST /api/halls
```

Example:

```json
{
  "title": "Hall 1",
  "numberOfSeats": 120,
  "type": "IMAX"
}
```

### Update Hall

```http
PUT /api/halls/{id}
```

### Deactivate Hall

```http
PATCH /api/halls/{id}/deactivate
```

### Activate Hall

```
PATCH /api/halls/{id}/activate
```

---

## Hall Data

A hall contains:

```text
Id
Title
NumberOfSeats
Type
IsActive
CreatedAt
UpdatedAt
```

Supported hall types:

```text
Standard
4D
Gold
MAX
IMAX
```

---

## Requirements

### 1. Hall List

Create:

```text
/admin/halls
```

The page should display a table/list containing:

* Hall title
* Number of seats
* Hall type
* Active/inactive status
* Created date where available
* Actions

Actions should include:

```text
View
Edit
Deactivate
```

---

### 2. Retrieve Halls

On opening the hall management page:

```http
GET /api/halls
```

should be called.

Display loading, empty, and error states.

---

### 3. Active/Inactive Filtering

The administrator should be able to distinguish active and inactive halls.

If the backend supports filtering, the frontend should use the backend filtering capability.

Otherwise, the frontend may filter the returned collection for display purposes.

Inactive halls should remain visible to administrators when appropriate because they may have historical screenings/reservations.

---

### 4. Create Hall

Provide a create form:

```text
/admin/halls/create
```

Fields:

```text
Title
Number of Seats
Type
```

Example:

```text
Title: Hall 1
Number of Seats: 120
Type: IMAX
```

Submit:

```http
POST /api/halls
```

---

### 5. Client-Side Validation

The form must validate:

* Title is required.
* Number of seats is required.
* Number of seats must be greater than zero.
* Hall type is required.
* Hall type must be one of the supported values.

Do not submit invalid forms.

Backend validation errors must also be displayed.

---

### 6. Edit Hall

Provide:

```text
/admin/halls/{id}/edit
```

Retrieve the hall:

```http
GET /api/halls/{id}
```

Populate the form.

Submit changes using:

```http
PUT /api/halls/{id}
```

After successful update:

* Display a success message.
* Navigate back to the hall list or hall details.

---

### 7. Deactivate Hall

Provide a deactivate action.

Before deactivation, display a confirmation dialog.

Example:

```text
Are you sure you want to deactivate Hall 1?
```

If confirmed:

```http
PATCH /api/halls/{id}/deactivate
```

After success:

* Update the displayed status.
* Prevent the admin UI from treating the hall as active.
* Display a success message.

The frontend must not physically remove the hall from historical data.

---

### 8. Deactivated Hall Behavior

A deactivated hall may still appear in the admin interface.

However:

* It should be clearly marked as inactive.
* It should not be offered as an active option when creating screenings.
* Historical information should remain accessible.

The backend remains responsible for rejecting invalid screening creation.

---
and please do the opposite for activate hall and adjust the interface

---

### 9. Error Handling

Handle at least:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

Display user-friendly messages.

Do not expose raw backend exception messages.

---

### 10. Loading and Empty States

The list must provide:

* Loading state
* Empty state
* Error state
* Retry where appropriate

Example empty state:

```text
No cinema halls have been created yet.
```

---

## Angular Structure

Suggested structure:

```text
src/app/
└── features/
    └── admin/
        └── halls/
            ├── hall-list/
            ├── hall-create/
            ├── hall-edit/
            ├── hall-details/
            ├── hall.service.ts
            └── hall.models.ts
```

The create and edit forms may share a reusable hall form component.

---

## Acceptance Criteria

* Administrator can view all halls.
* Administrator can create a hall.
* Administrator can edit a hall.
* Administrator can view hall details.
* Administrator can deactivate a hall.
* Hall type is restricted to the supported types.
* Invalid seat counts are rejected.
* Required fields are validated.
* Deactivated halls are clearly identified.
* Deactivated halls are not presented as active screening options.
* Historical halls remain visible where appropriate.
* Backend validation errors are displayed appropriately.
* Unauthorized users cannot perform hall management operations.
* Loading, empty, success, and error states are handled.

### Attachments

None.

---
# Story intake

Fill this template for each story you want planned. Keep it copy-paste-friendly: the planner reads **this file and the files in `attachments/`**, nothing else.

- Folder: `.squad/stories/admin-dashboard/5/intake.md`
- Binaries (screenshots, PDFs, exports): put them in `attachments/` next to this file and list them below.
- Do **not** rely on external links (tracker URLs, wiki, chat) — the planner cannot open them. Paste the content you want considered.

This is **not** an implementation prompt. It is the input to the plan-generation meta-prompt bundled with squad-kit (`generate-plan.md` in the installed package).

---

## Feature

- **Feature name (display):**
- **Feature slug (folder under `plans/`):** `admin-dashboard`

## Tracker (metadata only)

- **Tracker type:** `github`
- **Work item id:** `5` *(used in filenames and plan tables; fill manually if empty)*
- **Work item type:** `Issue`
- **Status:** `open`
- **Assignee:** ``
- **Labels:** ``

External tracker links are **not** followed by the planner. Keep the id for naming and traceability only.

---

## Title

*(Paste the work item title verbatim. Prefilled when `squad new-story` fetched from a tracker.)*

```
User Story 5 — Admin Hall Management
```

---

## Description

*(Paste the full work item description. Prefilled when fetched from a tracker.)*

```
## Feature

Cinema Hall Management

## User Story

As an administrator, I want to create, view, edit, deactivate and activate cinema halls so that I can manage the halls available for movie screenings.

## Frontend Technology

* Angular
* TypeScript
* Angular Reactive Forms
* Angular HttpClient
* Angular Router
* Angular Signals and/or RxJS

## Authorization

All hall management functionality requires an authenticated administrator.

The backend remains responsible for enforcing administrator authorization.

---

## Backend API Dependencies

The frontend integrates with the following backend endpoints.

### Get Halls

```http
GET /api/halls
```

### Get Hall

```http
GET /api/halls/{id}
```

### Create Hall

```http
POST /api/halls
```

Example:

```json
{
  "title": "Hall 1",
  "numberOfSeats": 120,
  "type": "IMAX"
}
```

### Update Hall

```http
PUT /api/halls/{id}
```

### Deactivate Hall

```http
PATCH /api/halls/{id}/deactivate
```

### Activate Hall

```
PATCH /api/halls/{id}/activate
```

---

## Hall Data

A hall contains:

```text
Id
Title
NumberOfSeats
Type
IsActive
CreatedAt
UpdatedAt
```

Supported hall types:

```text
Standard
4D
Gold
MAX
IMAX
```

---

## Requirements

### 1. Hall List

Create:

```text
/admin/halls
```

The page should display a table/list containing:

* Hall title
* Number of seats
* Hall type
* Active/inactive status
* Created date where available
* Actions

Actions should include:

```text
View
Edit
Deactivate
```

---

### 2. Retrieve Halls

On opening the hall management page:

```http
GET /api/halls
```

should be called.

Display loading, empty, and error states.

---

### 3. Active/Inactive Filtering

The administrator should be able to distinguish active and inactive halls.

If the backend supports filtering, the frontend should use the backend filtering capability.

Otherwise, the frontend may filter the returned collection for display purposes.

Inactive halls should remain visible to administrators when appropriate because they may have historical screenings/reservations.

---

### 4. Create Hall

Provide a create form:

```text
/admin/halls/create
```

Fields:

```text
Title
Number of Seats
Type
```

Example:

```text
Title: Hall 1
Number of Seats: 120
Type: IMAX
```

Submit:

```http
POST /api/halls
```

---

### 5. Client-Side Validation

The form must validate:

* Title is required.
* Number of seats is required.
* Number of seats must be greater than zero.
* Hall type is required.
* Hall type must be one of the supported values.

Do not submit invalid forms.

Backend validation errors must also be displayed.

---

### 6. Edit Hall

Provide:

```text
/admin/halls/{id}/edit
```

Retrieve the hall:

```http
GET /api/halls/{id}
```

Populate the form.

Submit changes using:

```http
PUT /api/halls/{id}
```

After successful update:

* Display a success message.
* Navigate back to the hall list or hall details.

---

### 7. Deactivate Hall

Provide a deactivate action.

Before deactivation, display a confirmation dialog.

Example:

```text
Are you sure you want to deactivate Hall 1?
```

If confirmed:

```http
PATCH /api/halls/{id}/deactivate
```

After success:

* Update the displayed status.
* Prevent the admin UI from treating the hall as active.
* Display a success message.

The frontend must not physically remove the hall from historical data.

---

### 8. Deactivated Hall Behavior

A deactivated hall may still appear in the admin interface.

However:

* It should be clearly marked as inactive.
* It should not be offered as an active option when creating screenings.
* Historical information should remain accessible.

The backend remains responsible for rejecting invalid screening creation.

---
and please do the opposite for activate hall and adjust the interface

---

### 9. Error Handling

Handle at least:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

Display user-friendly messages.

Do not expose raw backend exception messages.

---

### 10. Loading and Empty States

The list must provide:

* Loading state
* Empty state
* Error state
* Retry where appropriate

Example empty state:

```text
No cinema halls have been created yet.
```

---

## Angular Structure

Suggested structure:

```text
src/app/
└── features/
    └── admin/
        └── halls/
            ├── hall-list/
            ├── hall-create/
            ├── hall-edit/
            ├── hall-details/
            ├── hall.service.ts
            └── hall.models.ts
```

The create and edit forms may share a reusable hall form component.

---

## Acceptance Criteria

* Administrator can view all halls.
* Administrator can create a hall.
* Administrator can edit a hall.
* Administrator can view hall details.
* Administrator can deactivate a hall.
* Hall type is restricted to the supported types.
* Invalid seat counts are rejected.
* Required fields are validated.
* Deactivated halls are clearly identified.
* Deactivated halls are not presented as active screening options.
* Historical halls remain visible where appropriate.
* Backend validation errors are displayed appropriately.
* Unauthorized users cannot perform hall management operations.
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
