# Unit Tests

This directory contains unit tests for individual components of the application. These tests focus on isolated functionality without dependencies on other components.

## Test Files

- **libraryService.test.ts**: Tests for library service business logic
- **seatService.test.ts**: Tests for seat management service
- **userService.test.ts**: Tests for user management service
- **checkLibrarianOwnership.test.ts**: Tests for librarian ownership middleware
- **controllerUtils.test.ts**: Tests for controller utility functions
- **seatRoutes.test.ts**: Tests for seat routes configuration

## Testing Approach

Unit tests follow these principles:

1. **Isolation**: Test components in isolation using mocks for dependencies
2. **Focused Scope**: Test a single unit of functionality
3. **Complete Coverage**: Test both happy paths and edge cases
4. **Fast Execution**: Tests should run quickly without external dependencies
5. **Deterministic**: Tests should produce the same results on each run

## Mocking Strategy

Unit tests use Jest's mocking capabilities to:

1. **Mock Dependencies**: Replace real dependencies with test doubles
2. **Control Behavior**: Define how mocked functions should respond
3. **Verify Interactions**: Confirm components interact correctly with dependencies
4. **Simulate Errors**: Test error handling by forcing error conditions

## Common Test Patterns

Most unit tests follow this structure:

1. **Setup**: Create test data and mock dependencies
2. **Execution**: Call the function or method being tested
3. **Assertion**: Verify the function behaves as expected
4. **Verification**: Confirm mocks were called correctly

## Running Unit Tests

```bash
# Run all unit tests
npm test -- test/unit

# Run specific unit test file
npm test -- test/unit/libraryService.test.ts
``` 