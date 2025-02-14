# Test Suite Breakdown

Here's a breakdown of each test suite with their specific tests and their assertions in markdown format:

## setup.ts

This file is for setup and teardown, so it doesn't contain specific tests in the traditional sense. It ensures the test environment is correctly initialized and cleaned up before and after tests.

- beforeAll: Connects to the test database.
- beforeEach: Clears the database before each test to ensure isolation.
- afterAll: Closes the database connection after all tests are finished.

## getProfile.test.ts (1 test)
Actual test:
- should get the user profile when authenticated

Assertions tested:
- should return 401 if no token is provided
- should return 401 if invalid token is provided
- should return 200 and user profile if valid token is provided
- should return user data excluding password and sensitive fields
- should handle errors and return 500 if something goes wrong

## library.test.ts (10 tests)
Actual tests:
- should allow admin to create library
- should allow librarian to create library
- should not allow regular user to create library
- should validate required fields
- should list all libraries without authentication
- should filter inactive libraries by default
- should allow admin to update library
- should not allow regular user to update library
- should allow only admin to delete library
- should not allow librarian to delete library

Assertions tested for each endpoint:
### POST /libraries:
- Authorization checks
- Input validation
- Successful creation
- Error handling

### GET /libraries:
- List retrieval
- Filtering
- Authorization checks

### PUT /libraries/:id:
- Authorization checks
- Input validation
- Successful update
- Error handling

### DELETE /libraries/:id:
- Authorization checks
- Successful deletion
- Error handling

## libraryService.test.ts (5 tests)
Actual tests:
- should create a library successfully
- should throw error if library code already exists
- should update library successfully
- should throw error if library not found
- should toggle library status successfully

Service layer assertions:
- Data validation
- Error handling
- Repository interaction
- Business logic implementation

## login.test.ts (1 test)
Actual test:
- should log in an existing user and return a token

Assertions tested:
- Valid credentials handling
- Invalid credentials handling
- Token generation
- Error scenarios

## register.test.ts (1 test)
Actual test:
- should register a new user

Assertions tested:
- Input validation
- Duplicate email handling
- Password hashing
- Response data sanitization
- Error handling

## updateProfile.test.ts (1 test)
Actual test:
- should update the user profile when authenticated

Assertions tested:
- Authentication checks
- Input validation
- Successful update scenarios
- Field-specific updates
- Error handling

Total Test Count: 19 individual tests

Note: Each test may contain multiple assertions to thoroughly verify the functionality being tested. The assertions listed under each test describe what aspects are being verified within each test case.