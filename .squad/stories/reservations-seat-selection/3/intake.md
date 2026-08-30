> **Fetched from github:** [3](https://github.com/AS95Egypt/cinema-tickets-front/issues/3)  
> *Fetched 2026-08-29T17:06:53.554Z. Edit the sections below as needed; the planner reads this file verbatim.*


## Source — work item (from tracker)

**Title:** User Story 3 — Seat Selection & Temporary Hold  
**Type:** Issue  
**Status:** open

### Description

## Feature

Seat Availability, Selection & Temporary Reservation Hold

## User Story

As an authenticated customer, I want to view the seat availability for a screening, select available seats, and temporarily hold them so that I can proceed to checkout before the hold expires.

## Frontend Technology

* Angular
* TypeScript
* Angular HttpClient
* Angular Router
* RxJS and/or Angular Signals
* Reactive UI state management

## Backend API Dependencies

This story depends on the backend reservation/seat APIs defined in the corresponding backend story:

```http
GET /api/screenings/{screeningId}/seats
```

and:

```http
POST /api/reservations
```

The exact endpoint contract should be aligned with the implemented backend API.

The reservation request is expected to contain the selected screening and seat numbers.

Example:

```json
{
  "screeningId": "screening-001",
  "seatNumbers": [10, 11]
}
```

Example response:

```json
{
  "reservationId": "reservation-001",
  "status": "Held",
  "expiresAt": "2026-08-28T21:10:00",
  "screeningId": "screening-001",
  "seatNumbers": [10, 11],
  "totalAmount": 300
}
```

> The exact request/response shape should be updated to match the final backend implementation.

---

## Important Business Context

The cinema system does **not** maintain a separate `HallSeats` table.

Seats are represented implicitly using the hall's:

```text
NumberOfSeats
```

Therefore, if a hall contains:

```text
NumberOfSeats = 120
```

the frontend should render seats:

```text
1 → 120
```


Seat availability must come from reservation data/backend availability rather than from a physical seat table.

The frontend must not invent or persist seat availability independently.

---

## Requirements

### 1. Seat Selection Page

Create a seat-selection page for a selected screening.

Example route:

```text
/movies/{movieId}/screenings/{screeningId}/seats
```

The page should retrieve the screening details and seat availability.

---

### 2. Seat Map

Display the seats belonging to the screening's hall.

If the hall has:

```text
NumberOfSeats = 120
```

display seats:

```text
1  2  3  4  5  ... 120
```

Seats are displayed as board/grid ethier square or rectangle grid
and make sure to center the reminder seats in the middle of the row

The important requirement is that each seat has a unique numeric seat number.

---

### 3. Seat States

The UI should visually distinguish at least:

```text
Available
Selected
Held / Unavailable
Reserved
```

Example:

```text
Available   → customer can select
Selected    → selected by current customer
Held        → unavailable
Reserved    → unavailable
```

Seats are displayed as tiny squares with different colors based on state
Available seats are displayed  in Green
Logged user seat is displayed in Pink
UnAvailable seats are displayed in gray with x in the center

---

### 4. Retrieve Availability

On entering the seat-selection page:

```http
GET /api/screenings/{screeningId}/seats
```

should be called.

The response should allow the frontend to determine which seat numbers are currently unavailable.

The frontend must not assume that a seat remains available after the initial request.

Seat availability can change because another customer may reserve or hold the same seat.

---

### 5. Seat Selection

The customer can select available seat.

The frontend must:

* Allow selecting one available seat per user reservation.
* Allow deselecting selected seat.
* Prevent selecting unavailable seat.
* Maintain the selected seat number in frontend state.
* Display the number of selected seat.
* Display the price.

Example:

```text
Selected Seat: 11

Price: 150 EGP

```

---

### 6. Create Temporary Hold

When the customer proceeds from seat selection, call the backend reservation endpoint:

```http
POST /api/reservations
```

The backend is responsible for atomically determining whether the selected seat can be held.

The frontend must not assume that the hold succeeds merely because the seats appeared available.

---

### 7. Handle Reservation Conflict

If the backend indicates that the selected seat is no longer available:

* Do not proceed to checkout.
* Display an appropriate message.
* Refresh seat availability.
* Mark newly unavailable seats appropriately.
* Allow the customer to select different seat.

Example:

```text
Sorry, one or selected seat are no longer available.
Please select different seat.
```

This scenario is expected because multiple customers can access the same screening concurrently.

---

### 8. Temporary Hold Countdown

After a successful reservation hold, the backend should provide an expiration time such as:

```json
{
  "reservationId": "reservation-001",
  "expiresAt": "2026-08-28T21:10:00"
}
```

The frontend must display a countdown timer.

Example:

```text
Seats held for: 09:42
```

The countdown is a fixed duration and its 10 minutes.

---

### 9. Hold Expiration

When the hold expires:

* Stop the countdown.
* Mark the reservation as expired/unavailable for checkout.
* Prevent the customer from continuing payment for the expired reservation.
* Refresh seat availability.
* Allow the customer to select a seat again.

Example:

```text
Your seat hold has expired.
Please select your seat again.
```

The backend remains responsible for actually expiring/releasing the reservation.

The frontend must not attempt to release seats merely by changing local UI state.

---

### 10. Continue to Checkout

After a successful hold:

```text
Selected Seat
      ↓
Temporary Hold
      ↓
Countdown
      ↓
Continue to Checkout
```

Navigate to the checkout/payment page while preserving:

```text
reservationId
```

The checkout page must use the reservation ID to retrieve or reference the held reservation.

---

### 11. Refresh / Navigation Handling

The implementation should account for the user:

* Refreshing the browser.
* Navigating away.
* Returning to the reservation.
* Opening the checkout page directly.

The frontend must not rely solely on in-memory state for a reservation that has already been created.

The reservation ID and/or relevant state should be recoverable using an appropriate mechanism, subject to the final authentication/storage strategy.

The backend remains the source of truth for reservation status.

---

### 12. Authentication

Seat reservation requires an authenticated customer.

If an unauthenticated customer attempts to begin reservation:

```text
Seat Selection
      ↓
Authentication required
      ↓
Login
      ↓
Return to selected screening
```

The original screening context should be preserved where practical.

---

### 13. Error Handling

Handle at least:

```text
401 Unauthorized
400 Bad Request
409 Conflict
404 Not Found
500 Internal Server Error
```

Examples:

* `401` → redirect to login.
* `404` → screening/reservation no longer exists.
* `409` → selected seat is no longer available.
* `500` → display generic error and allow retry.

---

## Angular State

The implementation should maintain seat-selection state in an appropriate Angular service/store/component state.

At minimum:

```text
screening
seats
selectedSeat
price
totalAmount
reservationId
reservationStatus
expiresAt
```

Avoid making individual seat components responsible for global reservation state.

---

## Suggested Angular Structure

```text
src/app/
├── features/
│   └── reservation/
│       ├── seat-selection/
│       ├── reservation-summary/
│       ├── reservation.service.ts
│       ├── reservation.models.ts
│       └── reservation-state.service.ts
│
└── core/
    └── auth/
```

The exact structure should be determined by the Squad-kit execution plan and the existing Angular project structure.

---

## Acceptance Criteria

* Authenticated customer can open seat selection for a future screening.
* Frontend retrieves seat availability from the backend.
* Seat numbers are generated/displayed according to the hall's `NumberOfSeats`.
* Available seats can be selected.
* Selected seat can be deselected.
* Held/reserved seats cannot be selected.
* Selected seat number and price are displayed.
* Frontend calls the reservation API when the customer proceeds.
* Backend-confirmed reservation/hold is treated as the source of truth.
* Seat conflicts are handled gracefully.
* Successful holds display an expiration countdown.
* Countdown is based on the backend `expiresAt` value.
* Expired holds cannot proceed to checkout.
* Seat availability is refreshed after hold expiration or conflict.
* Successful reservation navigates to checkout with the reservation ID.
* Authentication is required before creating a reservation.
* Refreshing the page does not incorrectly make an existing reservation appear available.
* Backend errors are converted into appropriate user-facing messages.

### Attachments

None.

---
# Story intake

Fill this template for each story you want planned. Keep it copy-paste-friendly: the planner reads **this file and the files in `attachments/`**, nothing else.

- Folder: `.squad/stories/reservations-seat-selection/3/intake.md`
- Binaries (screenshots, PDFs, exports): put them in `attachments/` next to this file and list them below.
- Do **not** rely on external links (tracker URLs, wiki, chat) — the planner cannot open them. Paste the content you want considered.

This is **not** an implementation prompt. It is the input to the plan-generation meta-prompt bundled with squad-kit (`generate-plan.md` in the installed package).

---

## Feature

- **Feature name (display):**
- **Feature slug (folder under `plans/`):** `reservations-seat-selection`

## Tracker (metadata only)

- **Tracker type:** `github`
- **Work item id:** `3` *(used in filenames and plan tables; fill manually if empty)*
- **Work item type:** `Issue`
- **Status:** `open`
- **Assignee:** ``
- **Labels:** ``

External tracker links are **not** followed by the planner. Keep the id for naming and traceability only.

---

## Title

*(Paste the work item title verbatim. Prefilled when `squad new-story` fetched from a tracker.)*

```
User Story 3 — Seat Selection & Temporary Hold
```

---

## Description

*(Paste the full work item description. Prefilled when fetched from a tracker.)*

```
## Feature

Seat Availability, Selection & Temporary Reservation Hold

## User Story

As an authenticated customer, I want to view the seat availability for a screening, select available seats, and temporarily hold them so that I can proceed to checkout before the hold expires.

## Frontend Technology

* Angular
* TypeScript
* Angular HttpClient
* Angular Router
* RxJS and/or Angular Signals
* Reactive UI state management

## Backend API Dependencies

This story depends on the backend reservation/seat APIs defined in the corresponding backend story:

```http
GET /api/screenings/{screeningId}/seats
```

and:

```http
POST /api/reservations
```

The exact endpoint contract should be aligned with the implemented backend API.

The reservation request is expected to contain the selected screening and seat numbers.

Example:

```json
{
  "screeningId": "screening-001",
  "seatNumbers": [10, 11]
}
```

Example response:

```json
{
  "reservationId": "reservation-001",
  "status": "Held",
  "expiresAt": "2026-08-28T21:10:00",
  "screeningId": "screening-001",
  "seatNumbers": [10, 11],
  "totalAmount": 300
}
```

> The exact request/response shape should be updated to match the final backend implementation.

---

## Important Business Context

The cinema system does **not** maintain a separate `HallSeats` table.

Seats are represented implicitly using the hall's:

```text
NumberOfSeats
```

Therefore, if a hall contains:

```text
NumberOfSeats = 120
```

the frontend should render seats:

```text
1 → 120
```


Seat availability must come from reservation data/backend availability rather than from a physical seat table.

The frontend must not invent or persist seat availability independently.

---

## Requirements

### 1. Seat Selection Page

Create a seat-selection page for a selected screening.

Example route:

```text
/movies/{movieId}/screenings/{screeningId}/seats
```

The page should retrieve the screening details and seat availability.

---

### 2. Seat Map

Display the seats belonging to the screening's hall.

If the hall has:

```text
NumberOfSeats = 120
```

display seats:

```text
1  2  3  4  5  ... 120
```

Seats are displayed as board/grid ethier square or rectangle grid
and make sure to center the reminder seats in the middle of the row

The important requirement is that each seat has a unique numeric seat number.

---

### 3. Seat States

The UI should visually distinguish at least:

```text
Available
Selected
Held / Unavailable
Reserved
```

Example:

```text
Available   → customer can select
Selected    → selected by current customer
Held        → unavailable
Reserved    → unavailable
```

Seats are displayed as tiny squares with different colors based on state
Available seats are displayed  in Green
Logged user seat is displayed in Pink
UnAvailable seats are displayed in gray with x in the center

---

### 4. Retrieve Availability

On entering the seat-selection page:

```http
GET /api/screenings/{screeningId}/seats
```

should be called.

The response should allow the frontend to determine which seat numbers are currently unavailable.

The frontend must not assume that a seat remains available after the initial request.

Seat availability can change because another customer may reserve or hold the same seat.

---

### 5. Seat Selection

The customer can select available seat.

The frontend must:

* Allow selecting one available seat per user reservation.
* Allow deselecting selected seat.
* Prevent selecting unavailable seat.
* Maintain the selected seat number in frontend state.
* Display the number of selected seat.
* Display the price.

Example:

```text
Selected Seat: 11

Price: 150 EGP

```

---

### 6. Create Temporary Hold

When the customer proceeds from seat selection, call the backend reservation endpoint:

```http
POST /api/reservations
```

The backend is responsible for atomically determining whether the selected seat can be held.

The frontend must not assume that the hold succeeds merely because the seats appeared available.

---

### 7. Handle Reservation Conflict

If the backend indicates that the selected seat is no longer available:

* Do not proceed to checkout.
* Display an appropriate message.
* Refresh seat availability.
* Mark newly unavailable seats appropriately.
* Allow the customer to select different seat.

Example:

```text
Sorry, one or selected seat are no longer available.
Please select different seat.
```

This scenario is expected because multiple customers can access the same screening concurrently.

---

### 8. Temporary Hold Countdown

After a successful reservation hold, the backend should provide an expiration time such as:

```json
{
  "reservationId": "reservation-001",
  "expiresAt": "2026-08-28T21:10:00"
}
```

The frontend must display a countdown timer.

Example:

```text
Seats held for: 09:42
```

The countdown is a fixed duration and its 10 minutes.

---

### 9. Hold Expiration

When the hold expires:

* Stop the countdown.
* Mark the reservation as expired/unavailable for checkout.
* Prevent the customer from continuing payment for the expired reservation.
* Refresh seat availability.
* Allow the customer to select a seat again.

Example:

```text
Your seat hold has expired.
Please select your seat again.
```

The backend remains responsible for actually expiring/releasing the reservation.

The frontend must not attempt to release seats merely by changing local UI state.

---

### 10. Continue to Checkout

After a successful hold:

```text
Selected Seat
      ↓
Temporary Hold
      ↓
Countdown
      ↓
Continue to Checkout
```

Navigate to the checkout/payment page while preserving:

```text
reservationId
```

The checkout page must use the reservation ID to retrieve or reference the held reservation.

---

### 11. Refresh / Navigation Handling

The implementation should account for the user:

* Refreshing the browser.
* Navigating away.
* Returning to the reservation.
* Opening the checkout page directly.

The frontend must not rely solely on in-memory state for a reservation that has already been created.

The reservation ID and/or relevant state should be recoverable using an appropriate mechanism, subject to the final authentication/storage strategy.

The backend remains the source of truth for reservation status.

---

### 12. Authentication

Seat reservation requires an authenticated customer.

If an unauthenticated customer attempts to begin reservation:

```text
Seat Selection
      ↓
Authentication required
      ↓
Login
      ↓
Return to selected screening
```

The original screening context should be preserved where practical.

---

### 13. Error Handling

Handle at least:

```text
401 Unauthorized
400 Bad Request
409 Conflict
404 Not Found
500 Internal Server Error
```

Examples:

* `401` → redirect to login.
* `404` → screening/reservation no longer exists.
* `409` → selected seat is no longer available.
* `500` → display generic error and allow retry.

---

## Angular State

The implementation should maintain seat-selection state in an appropriate Angular service/store/component state.

At minimum:

```text
screening
seats
selectedSeat
price
totalAmount
reservationId
reservationStatus
expiresAt
```

Avoid making individual seat components responsible for global reservation state.

---

## Suggested Angular Structure

```text
src/app/
├── features/
│   └── reservation/
│       ├── seat-selection/
│       ├── reservation-summary/
│       ├── reservation.service.ts
│       ├── reservation.models.ts
│       └── reservation-state.service.ts
│
└── core/
    └── auth/
```

The exact structure should be determined by the Squad-kit execution plan and the existing Angular project structure.

---

## Acceptance Criteria

* Authenticated customer can open seat selection for a future screening.
* Frontend retrieves seat availability from the backend.
* Seat numbers are generated/displayed according to the hall's `NumberOfSeats`.
* Available seats can be selected.
* Selected seat can be deselected.
* Held/reserved seats cannot be selected.
* Selected seat number and price are displayed.
* Frontend calls the reservation API when the customer proceeds.
* Backend-confirmed reservation/hold is treated as the source of truth.
* Seat conflicts are handled gracefully.
* Successful holds display an expiration countdown.
* Countdown is based on the backend `expiresAt` value.
* Expired holds cannot proceed to checkout.
* Seat availability is refreshed after hold expiration or conflict.
* Successful reservation navigates to checkout with the reservation ID.
* Authentication is required before creating a reservation.
* Refreshing the page does not incorrectly make an existing reservation appear available.
* Backend errors are converted into appropriate user-facing messages.
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
