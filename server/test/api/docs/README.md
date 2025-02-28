# API Tests

This directory contains end-to-end tests for the API endpoints. These tests verify the complete request-response cycle, including middleware, controllers, services, and database interactions.

## Test Files

- **library.test.ts**: Tests for library management endpoints
- **seats.test.ts**: Tests for seat management endpoints
- **librarianManagement.test.ts**: Tests for librarian role assignment
- **libraryAccess.test.ts**: Tests for library access control
- **login.test.ts**: Tests for user authentication
- **register.test.ts**: Tests for user registration
- **getProfile.test.ts**: Tests for retrieving user profiles
- **updateProfile.test.ts**: Tests for updating user profiles
- **reservationEndpoints.test.ts**: Tests for reservation management
- **scheduleEndpoints.test.ts**: Tests for library schedule management

## Testing Approach

API tests follow these principles:

1. **Complete Flow Testing**: Tests the entire request-response cycle
2. **Authentication Testing**: Verifies proper auth token handling
3. **Authorization Testing**: Ensures proper role-based access control
4. **Input Validation**: Tests handling of valid and invalid inputs
5. **Error Handling**: Verifies appropriate error responses
6. **Database Integration**: Confirms data is properly persisted

## Common Test Patterns

Most API tests follow this structure:

1. **Setup**: Create necessary test data and authentication tokens
2. **Request**: Send HTTP request to the endpoint
3. **Assertion**: Verify response status, body structure, and content
4. **Verification**: Confirm database state if applicable

## Running API Tests

```bash
# Run all API tests
npm test -- test/api

# Run specific API test file
npm test -- test/api/library.test.ts
``` 