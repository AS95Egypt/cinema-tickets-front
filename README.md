# 🎬 Cinema Reservation Web

Angular frontend for a cinema ticket reservation system.

The application provides customer and administrator interfaces for browsing movies, selecting screenings, reserving seats, completing payment, and managing cinema data.

This project consumes the REST API provided by:

**Backend:** [Cinema Reservation API](https://github.com/AS95Egypt/cinema-tickets-back)

---

## 🚀 Features

### 👤 Customer

* User registration
* User login
* JWT authentication
* Browse active movies
* View movie details
* Browse movie screenings
* Select screening
* View seat availability
* Select a seat
* Temporarily hold a seat
* Countdown for temporary seat hold
* Checkout
* Mock payment
* Payment result handling
* Reservation confirmation
* View tickets/reservations
* Reservation cancellation/expiration

### 👨‍💼 Administrator

* Admin authentication and authorization
* Admin dashboard
* Cinema hall management
* Movie management
* Screening management
* Activate/deactivate halls
* Activate/deactivate movies
* Screening schedule management

---

# 📋 Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Angular CLI


---

# 📥 Installation

Clone the repository:

```bash
git clone https://github.com/AS95Egypt/cinema-tickets-front.git
```

Navigate to the project:

```bash
cd cinema-tickets-front
```

Install dependencies:

```bash
npm install
```

---

# ⚙️ Backend Configuration

The frontend communicates with the Cinema Reservation API.

The backend repository is available here:

**[Cinema Reservation API](https://github.com/AS95Egypt/cinema-tickets-back)**

Make sure the backend is running before testing functionality that requires API communication.

---

# ▶️ Running the Application

Start the Angular development server:

```bash
ng serve
```

Or:

```bash
npm start
```

The application is typically available at:

```text
http://localhost:4200
```

The terminal will display the actual URL if a different port is used.

---

# 🧪 Testing

Run unit tests:

```bash
ng test
```

Run tests in a CI-friendly environment where supported:

```bash
ng test --watch=false
```


---

# 🔗 Related Project

This Angular application consumes the backend API:

**Cinema Reservation API**

https://github.com/AS95Egypt/cinema-tickets-back

For backend setup, database configuration, migrations, and API documentation, see the backend repository.

---

# 📌 Project Status

🚧 **Under Development**

The application is being developed incrementally with customer reservation and administrator management functionality.

---

## 📄 License

This project is intended for learning and development purposes.
