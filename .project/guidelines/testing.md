# Testing Strategy

## Overview

This document outlines the testing strategy for the DDX Customer Dashboard, including unit tests, integration tests, and end-to-end (E2E) tests, with special considerations for Auth0 authentication.

## Test Types

### 1. Unit Tests
- **Location**: `src/__tests__/unit/`
- **Framework**: Vitest + React Testing Library
- **Purpose**: Test individual components and functions in isolation
- **Auth0 Handling**: Mock `@auth0/auth0-react` hooks

### 2. Integration Tests
- **Location**: `src/__tests__/integration/`
- **Framework**: Vitest
- **Purpose**: Test interactions between components and services
- **Auth0 Handling**: Mock Auth0 responses

### 3. End-to-End Tests
- **Location**: `e2e/`
- **Framework**: Playwright
- **Purpose**: Test complete user workflows
- **Auth0 Handling**: Bypass mode for CI/CD efficiency

## Authentication Testing Strategy

### E2E Test Mode Bypass

For fast and reliable E2E tests in CI/CD, we use a test mode that bypasses Auth0 authentication:

#### Implementation

1. **Environment Variable**: Set `VITE_E2E_TEST_MODE=true` when running E2E tests
2. **Conditional Provider**: The app uses `TestAuthProvider` instead of `Auth0Provider` when in test mode
3. **Mock User**: TestAuthProvider simulates an authenticated user

#### Configuration

```javascript
// main.tsx
const AuthProvider = import.meta.env.VITE_E2E_TEST_MODE === 'true'
  ? TestAuthProvider
  : Auth0Provider;
```

```javascript
// playwright.config.ts
webServer: {
  command: 'VITE_E2E_TEST_MODE=true npm run dev',
  // ...
}
```

### Why Bypass Mode?

1. **Speed**: No external Auth0 calls = faster tests
2. **Reliability**: No network dependencies = fewer flaky tests
3. **Simplicity**: No need to manage test credentials
4. **CI/CD Friendly**: Works in any environment without Auth0 setup

### Testing Auth0 Itself

While most E2E tests bypass Auth0, we should have separate tests specifically for authentication:

```javascript
// e2e/auth.spec.ts - Future implementation
test.describe('Authentication Flow', () => {
  test.skip('can login with Auth0', async ({ page }) => {
    // This would test actual Auth0 login flow
    // Marked as skip by default, run manually or in nightly builds
  });
});
```

## Test Execution

### Local Development

```bash
# Unit tests
npm run test

# Unit tests with coverage
npm run test:coverage

# E2E tests (with Auth0 bypass)
npm run test:e2e

# E2E tests UI mode
npm run test:e2e:ui
```

### CI/CD Pipeline

1. **Unit Tests**: Run on every PR
2. **E2E Tests**: Run on every PR with Auth0 bypass
3. **Auth Tests**: Run nightly or on-demand with real Auth0 (future)

## Best Practices

### 1. Test Isolation
- Each test should be independent
- Use proper setup and teardown
- Don't rely on test execution order

### 2. Mock Data
- Use consistent test data factories
- Mock external services appropriately
- Keep mocks close to reality

### 3. Assertions
- Test user-visible behavior, not implementation details
- Use semantic queries (by role, by text)
- Avoid testing framework internals

### 4. Performance
- Keep tests fast (bypass external services when possible)
- Run tests in parallel when safe
- Use test mode flags to skip expensive operations

## Environment Variables

### E2E Test Mode
- `VITE_E2E_TEST_MODE=true`: Enables test mode, bypassing Auth0

### Future Considerations
- `E2E_TEST_EMAIL`: Test user email (for real Auth0 tests)
- `E2E_TEST_PASSWORD`: Test user password (for real Auth0 tests)

## Testing Checklist

Before merging any PR:

- [ ] Unit tests pass
- [ ] E2E tests pass (with bypass mode)
- [ ] No console errors in tests
- [ ] Test coverage maintained or improved
- [ ] New features have corresponding tests

## Future Improvements

1. **Smoke Tests**: Add a small suite that tests real Auth0 login
2. **Visual Regression**: Implement Percy or similar for UI consistency
3. **Performance Testing**: Add Lighthouse CI for performance metrics
4. **Accessibility Testing**: Integrate axe-core for a11y validation