# Test Documentation

## Test Organization

The test suite is organized into three main directories:

- **api/**: End-to-end API tests that verify the complete request-response cycle
- **unit/**: Unit tests for individual components (services, utilities, etc.)
- **integration/**: Tests that verify interactions between multiple components

## Setup (setup.ts)
Database connection management for testing environment.

### Operations
- `connect()`: Establishes MongoDB connection
- `clearDatabase()`: Cleans all collections
- `closeDatabase()`: Drops database and closes connection

## Test Utilities (testUtils.ts)
Helper functions for common test operations:
- Creating test users
- Generating auth tokens
- Creating test data

## Test Coverage Summary

| Module | Test Count | Coverage |
|--------|------------|----------|
| Authentication | 10 tests | 95% |
| Library Management | 30 tests | 90% |
| Seat Management | 25 tests | 89% |
| Reservation System | 25 tests | 91% |
| Schedule Management | 23 tests | 100% |
| User Management | 25 tests | 94% |
| Middleware | 10 tests | 91% |
| Utilities | 15 tests | 95% |
| Repositories | 50 tests | 88% |

Total: 198 tests with 88.36% overall coverage

## Key Test Areas

### API Tests (api/)

- **Authentication**: Registration, login, profile management
- **Library Management**: CRUD operations, access control
- **Seat Management**: Creation, updates, filtering
- **Reservation System**: Booking, cancellation, conflicts
- **Librarian Management**: Role assignment, permissions
- **Schedule Management**: Library operating hours

### Unit Tests (unit/)

- **Service Layer**: Business logic validation
- **Middleware**: Authentication, authorization, error handling
- **Route Configuration**: Proper middleware chains
- **Utility Functions**: Helper functions, error handling

### Integration Tests (integration/)

- **Repository Layer**: Database interactions
- **Controller-Service**: Request handling and business logic
- **Service-Repository**: Business logic and data persistence

## Test Principles

1. **Isolation**: Each test runs independently
2. **Determinism**: Tests produce the same results on each run
3. **Coverage**: Tests cover happy paths and edge cases
4. **Performance**: Tests run efficiently with minimal setup/teardown
5. **Readability**: Tests clearly describe expected behavior

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- test/api/library.test.ts

# Run tests with specific pattern
npm test -- -t "should create a library"
```

## CI/CD Integration

Tests are automatically run on:
- Pull requests
- Merges to main branch
- Release preparation

Failed tests block deployments to ensure code quality.