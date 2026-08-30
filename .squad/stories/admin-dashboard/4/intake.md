> **Fetched from github:** [4](https://github.com/AS95Egypt/cinema-tickets-front/issues/4)  
> *Fetched 2026-08-29T18:56:00.071Z. Edit the sections below as needed; the planner reads this file verbatim.*


## Source — work item (from tracker)

**Title:** User Story 4 — Admin Dashboard & Authorization  
**Type:** Issue  
**Status:** open

### Description

## Feature

Admin Dashboard, Navigation & Authorization

## User Story

As an administrator, I want to access an admin dashboard and protected management pages so that I can manage cinema halls, movies, and screenings.

## Frontend Technology

* Angular
* TypeScript
* Angular Router
* Angular HttpClient
* Angular route guards
* JWT authentication
* Angular Signals and/or RxJS

## Backend API Dependencies

This story relies on the authentication API implemented in the backend:

```http
POST /api/auth/login
```

The login response contains:

```json
{
  "accessToken": "<jwt>",
  "expiresIn": 3600,
  "user": {
    "id": "8a9c...",
    "username": "ahmed",
    "email": "ahmed@example.com",
    "isAdmin": true
  }
}
```

Admin authorization is ultimately enforced by the backend through the JWT claims/role.

The frontend must not replace backend authorization.

---

## Requirements

### 1. Admin Route

Create a protected admin route:

```text
/admin
```

The admin area should contain the management sections:

```text
/admin
/admin/halls
/admin/movies
/admin/screenings
```

The exact routing structure can be refined during implementation.

---

### 2. Admin Authorization Guard

Create an Angular admin authorization guard.

The guard must verify that:

1. The user is authenticated.
2. The authenticated user has administrator privileges.

A normal customer must not be allowed to access admin routes.

Example:

```text
Customer
    ↓
/admin
    ↓
Access denied
```

The user should be redirected to an appropriate page or shown a `403 Forbidden` page.

---

### 3. Admin Layout

Create a dedicated admin layout containing:

* Header/top bar
* Navigation/sidebar
* Main content area
* Current user information
* Logout action

Navigation should provide access to:

```text
Dashboard
Halls
Movies
Screenings
```

---

### 4. Admin Dashboard

Create:

```text
/admin
```

The dashboard should provide an overview of the cinema management system.

At minimum, provide navigation/summary sections for:

* Halls
* Movies
* Screenings
* Reservations where applicable

The dashboard may initially use simple navigation cards rather than implementing statistics if the backend does not expose dashboard statistics.

Do not create fake statistics.

If dashboard statistics are not available through backend APIs, display useful management shortcuts instead.

---

### 5. Unauthorized Access

Handle:

```text
401 Unauthorized
403 Forbidden
```

Behavior:

### 401

If the JWT is missing, invalid, or expired:

```text
Clear authentication state
        ↓
Redirect to /login
```

### 403

If the user is authenticated but not an administrator:

```text
Display Forbidden / Access Denied
```

The frontend must not expose admin functionality to normal customers.

---

### 6. Admin Navigation

The admin navigation should allow the administrator to move between:

```text
Dashboard
Halls
Movies
Screenings
```

Navigation should preserve the admin layout.

---

### 7. Logout

The administrator should be able to log out from the admin area.

Logout should:

* Clear authentication state.
* Clear stored authentication information.
* Navigate to the login or public application page.

---

### 8. Responsive Layout

The admin interface should support:

* Desktop
* Tablet
* Smaller screens where practical

The management tables should remain usable on smaller screens.

---

## Angular Structure

A possible structure:

```text
src/app/
├── features/
│   └── admin/
│       ├── admin-layout/
│       ├── dashboard/
│       ├── halls/
│       ├── movies/
│       └── screenings/
│
├── core/
│   └── auth/
│       ├── auth.service.ts
│       ├── auth.guard.ts
│       ├── admin.guard.ts
│       └── auth.interceptor.ts
│
└── shared/
```

The exact structure should be refined according to the existing Angular project.

---

## Acceptance Criteria

* Authenticated administrator can access `/admin`.
* Normal authenticated customers cannot access `/admin`.
* Unauthenticated users cannot access `/admin`.
* Admin navigation contains Dashboard, Halls, Movies, and Screenings.
* Admin layout is shared across management pages.
* Logout works from the admin area.
* Expired/invalid authentication redirects to login.
* Authenticated non-admin users receive an appropriate forbidden response/page.
* Admin dashboard does not display fabricated statistics.
* Backend remains the final authority for authorization.

### Attachments

None.

---
# Story intake

Fill this template for each story you want planned. Keep it copy-paste-friendly: the planner reads **this file and the files in `attachments/`**, nothing else.

- Folder: `.squad/stories/admin-dashboard/4/intake.md`
- Binaries (screenshots, PDFs, exports): put them in `attachments/` next to this file and list them below.
- Do **not** rely on external links (tracker URLs, wiki, chat) — the planner cannot open them. Paste the content you want considered.

This is **not** an implementation prompt. It is the input to the plan-generation meta-prompt bundled with squad-kit (`generate-plan.md` in the installed package).

---

## Feature

- **Feature name (display):**
- **Feature slug (folder under `plans/`):** `admin-dashboard`

## Tracker (metadata only)

- **Tracker type:** `github`
- **Work item id:** `4` *(used in filenames and plan tables; fill manually if empty)*
- **Work item type:** `Issue`
- **Status:** `open`
- **Assignee:** ``
- **Labels:** ``

External tracker links are **not** followed by the planner. Keep the id for naming and traceability only.

---

## Title

*(Paste the work item title verbatim. Prefilled when `squad new-story` fetched from a tracker.)*

```
User Story 4 — Admin Dashboard & Authorization
```

---

## Description

*(Paste the full work item description. Prefilled when fetched from a tracker.)*

```
## Feature

Admin Dashboard, Navigation & Authorization

## User Story

As an administrator, I want to access an admin dashboard and protected management pages so that I can manage cinema halls, movies, and screenings.

## Frontend Technology

* Angular
* TypeScript
* Angular Router
* Angular HttpClient
* Angular route guards
* JWT authentication
* Angular Signals and/or RxJS

## Backend API Dependencies

This story relies on the authentication API implemented in the backend:

```http
POST /api/auth/login
```

The login response contains:

```json
{
  "accessToken": "<jwt>",
  "expiresIn": 3600,
  "user": {
    "id": "8a9c...",
    "username": "ahmed",
    "email": "ahmed@example.com",
    "isAdmin": true
  }
}
```

Admin authorization is ultimately enforced by the backend through the JWT claims/role.

The frontend must not replace backend authorization.

---

## Requirements

### 1. Admin Route

Create a protected admin route:

```text
/admin
```

The admin area should contain the management sections:

```text
/admin
/admin/halls
/admin/movies
/admin/screenings
```

The exact routing structure can be refined during implementation.

---

### 2. Admin Authorization Guard

Create an Angular admin authorization guard.

The guard must verify that:

1. The user is authenticated.
2. The authenticated user has administrator privileges.

A normal customer must not be allowed to access admin routes.

Example:

```text
Customer
    ↓
/admin
    ↓
Access denied
```

The user should be redirected to an appropriate page or shown a `403 Forbidden` page.

---

### 3. Admin Layout

Create a dedicated admin layout containing:

* Header/top bar
* Navigation/sidebar
* Main content area
* Current user information
* Logout action

Navigation should provide access to:

```text
Dashboard
Halls
Movies
Screenings
```

---

### 4. Admin Dashboard

Create:

```text
/admin
```

The dashboard should provide an overview of the cinema management system.

At minimum, provide navigation/summary sections for:

* Halls
* Movies
* Screenings
* Reservations where applicable

The dashboard may initially use simple navigation cards rather than implementing statistics if the backend does not expose dashboard statistics.

Do not create fake statistics.

If dashboard statistics are not available through backend APIs, display useful management shortcuts instead.

---

### 5. Unauthorized Access

Handle:

```text
401 Unauthorized
403 Forbidden
```

Behavior:

### 401

If the JWT is missing, invalid, or expired:

```text
Clear authentication state
        ↓
Redirect to /login
```

### 403

If the user is authenticated but not an administrator:

```text
Display Forbidden / Access Denied
```

The frontend must not expose admin functionality to normal customers.

---

### 6. Admin Navigation

The admin navigation should allow the administrator to move between:

```text
Dashboard
Halls
Movies
Screenings
```

Navigation should preserve the admin layout.

---

### 7. Logout

The administrator should be able to log out from the admin area.

Logout should:

* Clear authentication state.
* Clear stored authentication information.
* Navigate to the login or public application page.

---

### 8. Responsive Layout

The admin interface should support:

* Desktop
* Tablet
* Smaller screens where practical

The management tables should remain usable on smaller screens.

---

## Angular Structure

A possible structure:

```text
src/app/
├── features/
│   └── admin/
│       ├── admin-layout/
│       ├── dashboard/
│       ├── halls/
│       ├── movies/
│       └── screenings/
│
├── core/
│   └── auth/
│       ├── auth.service.ts
│       ├── auth.guard.ts
│       ├── admin.guard.ts
│       └── auth.interceptor.ts
│
└── shared/
```

The exact structure should be refined according to the existing Angular project.

---

## Acceptance Criteria

* Authenticated administrator can access `/admin`.
* Normal authenticated customers cannot access `/admin`.
* Unauthenticated users cannot access `/admin`.
* Admin navigation contains Dashboard, Halls, Movies, and Screenings.
* Admin layout is shared across management pages.
* Logout works from the admin area.
* Expired/invalid authentication redirects to login.
* Authenticated non-admin users receive an appropriate forbidden response/page.
* Admin dashboard does not display fabricated statistics.
* Backend remains the final authority for authorization.
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
