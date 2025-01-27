# Main Modules:

## Users Module (users):
Management of library users.
### Functionalities:

- User registration.
- Login/Logout.
- User profile management (view, edit).
- Authentication and authorization (permission management, e.g., basic user, librarian, administrator - if necessary).

## Seats Module (seats):
Management of available seats in the library.
### Functionalities:
- Definition of seat properties (e.g., identification number, location/room, floor, availability).
- Adding, modifying, and removing seats.
- Displaying seat availability (based on date/time).

## Reservations Module (reservations):
Management of seat reservations by users.
### Functionalities:
- Creating a reservation (user, seat, date and time, duration).
- Viewing a user's reservations.
- Canceling a reservation.
- Checking the reservation status of a seat (available, reserved).

# Secondary/Optional Modules (for future expansions):

## Library Module (libraries - if necessary for multiple locations):
Management of multiple libraries/locations (if the application needs to support multiple libraries).
### Functionalities:
- Definition of library properties (name, address, opening hours, etc.).
- Adding, modifying, and removing libraries.
- Associating seats with a specific library.

## Schedules Module (schedules - for opening/closing hours and time slots):
Management of library opening hours and bookable time slots.
### Functionalities:
- Definition of library opening/closing hours.
- Definition of bookable time slots (e.g., morning, afternoon, 1-hour slots, etc.).
- Management of exceptions to schedules (e.g., holiday closures).

# API Endpoints (RESTful Example):
Here is an example of how REST APIs could be structured for each module.

## Users (/users):
- **POST /users/register**: Register new user.
- **POST /users/login**: User login.
- **POST /users/logout**: User logout.
- **GET /users/me**: Get authenticated user information.
- **PUT /users/me**: Update authenticated user information.

## Seats (/seats):
- **GET /seats**: Get all seats (or filtered seats, e.g., by library).
- **GET /seats/:seatId**: Get a specific seat.
- **POST /seats**: Add a new seat (admin/librarian only).
- **PUT /seats/:seatId**: Update a seat (admin/librarian only).
- **DELETE /seats/:seatId**: Delete a seat (admin/librarian only).
- **GET /seats/availability**: Get seat availability (with parameters for date/time).

## Reservations (/reservations):
- **GET /reservations**: Get all reservations (admin/librarian only).
- **GET /reservations/me**: Get authenticated user's reservations.
- **GET /reservations/:reservationId**: Get a specific reservation (admin/librarian or owner user only).
- **POST /reservations**: Create a new reservation.
- **DELETE /reservations/:reservationId**: Cancel a reservation (owner user or admin/librarian).

## Library (/libraries - if module implemented):
- **GET /libraries**: Get all libraries.
- **GET /libraries/:libraryId**: Get a specific library.
- **POST /libraries**: Add a new library (admin only).
- **PUT /libraries/:libraryId**: Update a library (admin only).
- **DELETE /libraries/:libraryId**: Delete a library (admin only).

## Schedules (/schedules - if module implemented):
- **GET /schedules**: Get library schedules.
- **PUT /schedules**: Update library schedules (admin/librarian only).

## Tech Stack

*   **Backend Framework:** Node.js with Express.js
*   **Language:** TypeScript
*   **Database:** MongoDB
*   **ORM/ODM:** Mongoose
*   **Authentication:** JWT
*   **Testing:** Jest and Supertest
*   **Documentation:** Swagger or OpenAPI (To be implemented)
*   **Linting and Formatting:** ESLint and Prettier