> **Fetched from github:** [1](https://github.com/AS95Egypt/cinema-tickets-front/issues/1)  
> *Fetched 2026-08-29T09:33:08.523Z. Edit the sections below as needed; the planner reads this file verbatim.*


## Source — work item (from tracker)

**Title:** User Story 1 — Customer Authentication  
**Type:** Issue  
**Status:** open

### Description

## Feature

Customer Authentication & Session Management

## User Story

As a cinema customer, I want to register and log in to the cinema application so that I can securely access movie reservations and my tickets.

## Frontend Technology

* Angular
* TypeScript
* Angular Router
* Angular HttpClient
* Reactive Forms
* RxJS
* JWT-based authentication

## Backend API Dependencies

The frontend integrates with the following backend endpoints:

### Register

```http
POST /api/auth/register
```

Request:

```json
{
  "username": "ahmed",
  "email": "ahmed@example.com",
  "password": "Password123!"
}
```

### Login

```http
POST /api/auth/login
```

Request:

```json
{
  "email": "ahmed@example.com",
  "password": "Password123!"
}
```

Expected response:

```json
{
  "accessToken": "<jwt>",
  "expiresIn": 3600,
  "user": {
    "id": "8a9c...",
    "username": "ahmed",
    "email": "ahmed@example.com",
    "isAdmin": false
  }
}
```

The frontend must treat the backend API as the source of truth for authentication and authorization.

---

## Requirements

### 1. Registration Page

Create an Angular registration page containing:

* Username
* Email
* Password
* Confirm Password
* Register button

Client-side validation must include:

* Username is required.
* Email is required.
* Email must have a valid format.
* Password is required.
* Password must satisfy the backend password requirements.
* Confirm password must match password.

The frontend must display meaningful validation messages.

The frontend must not submit the request when client-side validation fails.

---

### 2. Registration API Integration

Create an Angular authentication service responsible for communicating with:

```http
POST /api/auth/register
```

After successful registration:

* Display a success message.
* Redirect the user to the login page.
* Do not automatically assume that the user is authenticated unless the backend explicitly returns authentication credentials.

Backend validation errors must be displayed appropriately.

---

### 3. Login Page

Create an Angular login page containing:

* Email
* Password
* Login button

Client-side validation:

* Email is required.
* Email must have a valid format.
* Password is required.

---

### 4. Login API Integration

Call:

```http
POST /api/auth/login
```

After successful authentication:

1. Store the returned authentication information securely according to the application's chosen authentication strategy.
2. Store the authenticated user's basic information.
3. Update the application's authentication state.
4. Redirect the user to the appropriate authenticated page.

For a normal customer, the default destination should be the customer movie experience.

If the authenticated user is an administrator, the application may redirect to the admin dashboard.

---

### 5. JWT Authentication

Implement an Angular HTTP interceptor that automatically adds the JWT to protected API requests.

Example:

```http
Authorization: Bearer <jwt>
```

The interceptor must:

* Add the token only when available.
* Avoid modifying authentication requests unnecessarily.
* Preserve existing request headers.
* Handle unauthorized responses appropriately.

---

### 6. Authentication State

Create a centralized authentication mechanism, such as:

```text
AuthService
AuthState
```

The authentication state should provide access to:

```text
isAuthenticated
currentUser
isAdmin
accessToken
```

The exact implementation can use Angular Signals, RxJS, or another appropriate Angular pattern.

The implementation should avoid duplicating authentication state across components.

---

### 7. Protected Routes

Configure Angular route guards for authenticated pages.

Unauthenticated users attempting to access protected pages should be redirected to:

```text
/login
```

The original requested URL should preferably be preserved so the user can be redirected back after successful login.

---

### 8. Admin Routes

Admin-only frontend routes must have an authorization guard.

A normal authenticated customer must not be allowed to access admin pages.

For example:

```text
/admin
/admin/movies
/admin/halls
/admin/screenings
```

The frontend guard should check the authenticated user's admin status.

However, frontend authorization is only a UX/security boundary.

The backend must remain responsible for enforcing authorization.

---

### 9. Logout

Provide a logout action that:

* Clears authentication state.
* Removes locally stored authentication information.
* Clears user information.
* Navigates to the login or public movie page.

The implementation should not require a backend logout endpoint unless one is introduced later.

---

### 10. Authentication Error Handling

Handle common backend responses such as:

```text
400 Bad Request
401 Unauthorized
409 Conflict
500 Internal Server Error
```

Examples:

* Duplicate email → display registration error.
* Invalid credentials → display generic login failure.
* Expired/invalid JWT → clear authentication state and redirect to login.
* Server error → display a generic error message.

The UI must not expose sensitive backend implementation details.

---

## Angular Structure

The exact structure can be refined during the Squad-kit planning phase, but the implementation should follow Angular best practices.

A possible structure:

```text
src/app/
├── core/
│   ├── auth/
│   │   ├── auth.service.ts
│   │   ├── auth.guard.ts
│   │   ├── admin.guard.ts
│   │   └── auth.interceptor.ts
│   │
│   ├── services/
│   └── models/
│
├── features/
│   └── auth/
│       ├── login/
│       └── register/
│
├── shared/
│   ├── components/
│   └── validators/
│
└── app.routes.ts
```

The final structure should be determined during implementation planning based on the existing Angular project.

---

## User Experience

### Successful Login

```text
Login
  ↓
POST /api/auth/login
  ↓
Store authentication state
  ↓
Redirect
  ↓
Customer Movie Experience
```

### Failed Login

```text
Login
  ↓
POST /api/auth/login
  ↓
401
  ↓
Display authentication error
  ↓
Remain on Login
```

### Expired/Invalid Token

```text
API Request
  ↓
401 Unauthorized
  ↓
Clear authentication state
  ↓
Redirect to Login
```

---

## Acceptance Criteria

* Customer can open the registration page.
* Customer can register using valid information.
* Invalid registration data is rejected client-side.
* Backend registration errors are displayed appropriately.
* Successful registration redirects to login.
* Customer can log in with valid credentials.
* Invalid credentials are rejected.
* Successful login stores authentication state.
* JWT is automatically attached to protected API requests.
* Unauthenticated users cannot access protected routes.
* Admin routes require administrator authorization.
* Normal customers cannot access admin routes.
* User can log out.
* Invalid/expired authentication results in appropriate logout and redirection.
* Authentication state is centralized and accessible throughout the Angular application.
* No sensitive authentication information is exposed in UI error messages.

### Attachments

None.

---
# Story intake

Fill this template for each story you want planned. Keep it copy-paste-friendly: the planner reads **this file and the files in `attachments/`**, nothing else.

- Folder: `.squad/stories/customer-auth/1/intake.md`
- Binaries (screenshots, PDFs, exports): put them in `attachments/` next to this file and list them below.
- Do **not** rely on external links (tracker URLs, wiki, chat) — the planner cannot open them. Paste the content you want considered.

This is **not** an implementation prompt. It is the input to the plan-generation meta-prompt bundled with squad-kit (`generate-plan.md` in the installed package).

---

## Feature

- **Feature name (display):**
- **Feature slug (folder under `plans/`):** `customer-auth`

## Tracker (metadata only)

- **Tracker type:** `github`
- **Work item id:** `1` *(used in filenames and plan tables; fill manually if empty)*
- **Work item type:** `Issue`
- **Status:** `open`
- **Assignee:** ``
- **Labels:** ``

External tracker links are **not** followed by the planner. Keep the id for naming and traceability only.

---

## Title

*(Paste the work item title verbatim. Prefilled when `squad new-story` fetched from a tracker.)*

```
User Story 1 — Customer Authentication
```

---

## Description

*(Paste the full work item description. Prefilled when fetched from a tracker.)*

```
## Feature

Customer Authentication & Session Management

## User Story

As a cinema customer, I want to register and log in to the cinema application so that I can securely access movie reservations and my tickets.

## Frontend Technology

* Angular
* TypeScript
* Angular Router
* Angular HttpClient
* Reactive Forms
* RxJS
* JWT-based authentication

## Backend API Dependencies

The frontend integrates with the following backend endpoints:

### Register

```http
POST /api/auth/register
```

Request:

```json
{
  "username": "ahmed",
  "email": "ahmed@example.com",
  "password": "Password123!"
}
```

### Login

```http
POST /api/auth/login
```

Request:

```json
{
  "email": "ahmed@example.com",
  "password": "Password123!"
}
```

Expected response:

```json
{
  "accessToken": "<jwt>",
  "expiresIn": 3600,
  "user": {
    "id": "8a9c...",
    "username": "ahmed",
    "email": "ahmed@example.com",
    "isAdmin": false
  }
}
```

The frontend must treat the backend API as the source of truth for authentication and authorization.

---

## Requirements

### 1. Registration Page

Create an Angular registration page containing:

* Username
* Email
* Password
* Confirm Password
* Register button

Client-side validation must include:

* Username is required.
* Email is required.
* Email must have a valid format.
* Password is required.
* Password must satisfy the backend password requirements.
* Confirm password must match password.

The frontend must display meaningful validation messages.

The frontend must not submit the request when client-side validation fails.

---

### 2. Registration API Integration

Create an Angular authentication service responsible for communicating with:

```http
POST /api/auth/register
```

After successful registration:

* Display a success message.
* Redirect the user to the login page.
* Do not automatically assume that the user is authenticated unless the backend explicitly returns authentication credentials.

Backend validation errors must be displayed appropriately.

---

### 3. Login Page

Create an Angular login page containing:

* Email
* Password
* Login button

Client-side validation:

* Email is required.
* Email must have a valid format.
* Password is required.

---

### 4. Login API Integration

Call:

```http
POST /api/auth/login
```

After successful authentication:

1. Store the returned authentication information securely according to the application's chosen authentication strategy.
2. Store the authenticated user's basic information.
3. Update the application's authentication state.
4. Redirect the user to the appropriate authenticated page.

For a normal customer, the default destination should be the customer movie experience.

If the authenticated user is an administrator, the application may redirect to the admin dashboard.

---

### 5. JWT Authentication

Implement an Angular HTTP interceptor that automatically adds the JWT to protected API requests.

Example:

```http
Authorization: Bearer <jwt>
```

The interceptor must:

* Add the token only when available.
* Avoid modifying authentication requests unnecessarily.
* Preserve existing request headers.
* Handle unauthorized responses appropriately.

---

### 6. Authentication State

Create a centralized authentication mechanism, such as:

```text
AuthService
AuthState
```

The authentication state should provide access to:

```text
isAuthenticated
currentUser
isAdmin
accessToken
```

The exact implementation can use Angular Signals, RxJS, or another appropriate Angular pattern.

The implementation should avoid duplicating authentication state across components.

---

### 7. Protected Routes

Configure Angular route guards for authenticated pages.

Unauthenticated users attempting to access protected pages should be redirected to:

```text
/login
```

The original requested URL should preferably be preserved so the user can be redirected back after successful login.

---

### 8. Admin Routes

Admin-only frontend routes must have an authorization guard.

A normal authenticated customer must not be allowed to access admin pages.

For example:

```text
/admin
/admin/movies
/admin/halls
/admin/screenings
```

The frontend guard should check the authenticated user's admin status.

However, frontend authorization is only a UX/security boundary.

The backend must remain responsible for enforcing authorization.

---

### 9. Logout

Provide a logout action that:

* Clears authentication state.
* Removes locally stored authentication information.
* Clears user information.
* Navigates to the login or public movie page.

The implementation should not require a backend logout endpoint unless one is introduced later.

---

### 10. Authentication Error Handling

Handle common backend responses such as:

```text
400 Bad Request
401 Unauthorized
409 Conflict
500 Internal Server Error
```

Examples:

* Duplicate email → display registration error.
* Invalid credentials → display generic login failure.
* Expired/invalid JWT → clear authentication state and redirect to login.
* Server error → display a generic error message.

The UI must not expose sensitive backend implementation details.

---

## Angular Structure

The exact structure can be refined during the Squad-kit planning phase, but the implementation should follow Angular best practices.

A possible structure:

```text
src/app/
├── core/
│   ├── auth/
│   │   ├── auth.service.ts
│   │   ├── auth.guard.ts
│   │   ├── admin.guard.ts
│   │   └── auth.interceptor.ts
│   │
│   ├── services/
│   └── models/
│
├── features/
│   └── auth/
│       ├── login/
│       └── register/
│
├── shared/
│   ├── components/
│   └── validators/
│
└── app.routes.ts
```

The final structure should be determined during implementation planning based on the existing Angular project.

---

## User Experience

### Successful Login

```text
Login
  ↓
POST /api/auth/login
  ↓
Store authentication state
  ↓
Redirect
  ↓
Customer Movie Experience
```

### Failed Login

```text
Login
  ↓
POST /api/auth/login
  ↓
401
  ↓
Display authentication error
  ↓
Remain on Login
```

### Expired/Invalid Token

```text
API Request
  ↓
401 Unauthorized
  ↓
Clear authentication state
  ↓
Redirect to Login
```

---

## Acceptance Criteria

* Customer can open the registration page.
* Customer can register using valid information.
* Invalid registration data is rejected client-side.
* Backend registration errors are displayed appropriately.
* Successful registration redirects to login.
* Customer can log in with valid credentials.
* Invalid credentials are rejected.
* Successful login stores authentication state.
* JWT is automatically attached to protected API requests.
* Unauthenticated users cannot access protected routes.
* Admin routes require administrator authorization.
* Normal customers cannot access admin routes.
* User can log out.
* Invalid/expired authentication results in appropriate logout and redirection.
* Authentication state is centralized and accessible throughout the Angular application.
* No sensitive authentication information is exposed in UI error messages.
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
