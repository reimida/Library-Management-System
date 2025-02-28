# Integration Tests

This directory contains integration tests that verify interactions between multiple components of the application. These tests focus on ensuring that different parts of the system work together correctly.

## Test Files

- **libraryRepository.test.ts**: Tests for library data access layer
- **seatRepository.test.ts**: Tests for seat data access layer
- **userRepository.test.ts**: Tests for user data access layer
- **libraryController.test.ts**: Tests for library controller with service integration

## Testing Approach

Integration tests follow these principles:

1. **Component Interaction**: Test how components work together
2. **Real Dependencies**: Use actual implementations rather than mocks where appropriate
3. **Database Integration**: Test actual database operations
4. **Focused Scope**: Test specific integration points rather than entire system
5. **Realistic Scenarios**: Test real-world usage patterns

## Test Database

Integration tests use a dedicated test database:

1. **Isolation**: Tests run in a separate database from development
2. **Clean State**: Database is cleared between test runs
3. **Realistic Data**: Tests create realistic data structures
4. **Transaction Management**: Tests handle database transactions properly

## Common Test Patterns

Most integration tests follow this structure:

1. **Setup**: Create necessary test data in the database
2. **Execution**: Call the components being tested
3. **Assertion**: Verify the components interact correctly
4. **Verification**: Confirm database state after operations
5. **Cleanup**: Ensure database is cleaned up after tests

## Running Integration Tests

```bash
# Run all integration tests
npm test -- test/integration

# Run specific integration test file
npm test -- test/integration/libraryRepository.test.ts
``` 