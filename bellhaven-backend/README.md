# Bellhaven Backend

Spring Boot REST API for the Bellhaven Boutique Hotel booking frontend.
Built to match `frontend/src/api.js` exactly, so you shouldn't need to
change anything on the frontend — just point it at this server.

## What's included

- **GET  /api/rooms** — list of rooms. Add `?preview=3` to get just the
  first 3 (used by the Home page). Backs `fetchRooms()`.
- **POST /api/bookings** — create a booking. Backs `submitBooking()`.
  - `201 Created` with `{ id, message }` on success
  - `400 Bad Request` with `{ fullname, email, checkin, checkout, room }`
    (only the fields that failed) on validation errors — same field ids
    the booking form uses, so the red error text just works.
- H2 in-memory database, pre-seeded (via `data.sql`) with the same 6
  rooms currently hardcoded in `Rooms.jsx`.
- CORS already opened up for `http://localhost:3000` (Create React App's
  default dev server) in `WebConfig.java`.

## Importing into Spring Tool Suite (STS)

1. Unzip this project somewhere on your machine.
2. In STS: **File → Import → Maven → Existing Maven Projects**.
3. Browse to the unzipped `bellhaven-backend` folder, select it, click
   **Finish**. STS will download the dependencies (needs internet the
   first time).
4. Once it's imported, right-click the project → **Run As → Spring Boot
   App** (or run `BellhavenBackendApplication.java` directly).
5. The API will be live at `http://localhost:8080`.

## Running from the command line instead

```bash
mvn spring-boot:run
```

(Requires Maven installed, or use `./mvnw spring-boot:run` if you
generate a wrapper via `mvn -N io.takari:maven:wrapper`.)

## Connecting the frontend

Nothing to change if you're running the frontend with `npm start` on
port 3000 — `api.js` already defaults to `http://localhost:8080/api`.
If you deploy somewhere else, set the `REACT_APP_API_BASE` environment
variable for the frontend, and add the new origin to the
`allowedOrigins(...)` list in `WebConfig.java`.

## Checking it out directly

- `http://localhost:8080/api/rooms` — see the seeded room list as JSON.
- `http://localhost:8080/h2-console` — browse the in-memory database
  (JDBC URL: `jdbc:h2:mem:bellhaven`, user `sa`, no password).

## Project structure

```
src/main/java/com/bellhaven/backend/
├── BellhavenBackendApplication.java   # main class
├── config/WebConfig.java              # CORS setup
├── controller/                        # REST endpoints
├── service/BookingService.java        # booking validation + save logic
├── model/                             # JPA entities (Room, Booking)
├── repository/                        # Spring Data JPA repositories
├── dto/                                # request/response shapes
└── exception/                         # turns validation failures into 400s
src/main/resources/
├── application.properties             # DB + server config
└── data.sql                           # seeds the 6 rooms on startup
```

## Notes / next steps

- The database is in-memory (`create-drop`), so bookings and any room
  edits are wiped every restart. Swap `spring.datasource.*` in
  `application.properties` for a real MySQL/Postgres instance when
  you're ready to persist data — no other code changes needed.
- There's no admin/auth layer yet (e.g. to manage rooms or view
  bookings) — everything here just covers what the current frontend
  calls.
- Room type on a booking is matched by name against the seeded rooms
  table; if you rename/add rooms, update `data.sql` (and `Rooms.jsx`
  on the frontend) to match.
