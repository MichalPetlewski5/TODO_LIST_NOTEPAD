# Set Up Testing Infrastructure

**Issue #:** #6  
**Status:** Open  
**Priority:** Medium  
**Type:** Enhancement / Quality Assurance  
**Created:** 2025-01-XX

## Overview
Establish a comprehensive testing infrastructure including unit tests, integration tests, and E2E tests. This will improve code quality, catch bugs early, and provide confidence when refactoring.

## Current Issues

### No Testing
- ❌ **No unit tests** - Components and utilities not tested
- ❌ **No integration tests** - API integration not tested
- ❌ **No E2E tests** - User flows not tested
- ❌ **No test coverage** - Unknown code coverage
- ❌ **Placeholder test script** - `package.json` has non-functional test script

### Testing Gaps
- ❌ **No test framework** - No Jest, Vitest, or other testing framework
- ❌ **No testing utilities** - No React Testing Library setup
- ❌ **No mock setup** - Cannot mock API calls
- ❌ **No test configuration** - No test config files
- ❌ **No CI/CD integration** - Tests not run automatically

### Current Implementation
- `server/package.json` has placeholder: `"test": "echo \"Error: no test specified\" && exit 1"`
- No test files in project
- No testing dependencies installed
- No test configuration

## Proposed Solution

### 1. Frontend Testing Setup
- Install Vitest (fast, Vite-native)
- Install React Testing Library
- Install @testing-library/jest-dom for matchers
- Install MSW (Mock Service Worker) for API mocking

### 2. Backend Testing Setup
- Install Jest or use Vitest for Node.js
- Install Supertest for API testing
- Set up test database/mock data

### 3. E2E Testing (Optional)
- Install Playwright or Cypress
- Set up E2E test suite
- Configure test environment

### 4. Test Structure
- Unit tests for utilities and hooks
- Component tests for React components
- Integration tests for API calls
- E2E tests for critical user flows

## Implementation Tasks

### Frontend Testing Setup
- [ ] Install Vitest and testing dependencies
- [ ] Configure Vitest in `vite.config.ts`
- [ ] Install React Testing Library
- [ ] Install @testing-library/jest-dom
- [ ] Install MSW for API mocking
- [ ] Create test setup file
- [ ] Configure test scripts in package.json

### Backend Testing Setup
- [ ] Install Jest or Vitest for Node.js
- [ ] Install Supertest for API testing
- [ ] Create test database setup
- [ ] Configure test scripts
- [ ] Set up test environment variables

### Test Utilities
- [ ] Create test utilities and helpers
- [ ] Set up MSW handlers for API mocking
- [ ] Create custom render function with providers
- [ ] Create test data factories

### Unit Tests
- [ ] Write tests for `auth.ts` utilities
- [ ] Write tests for API client (when created)
- [ ] Write tests for custom hooks
- [ ] Write tests for utility functions

### Component Tests
- [ ] Write tests for Login component
- [ ] Write tests for Register component
- [ ] Write tests for TodoList component
- [ ] Write tests for TodoItem component
- [ ] Write tests for Header component

### Integration Tests
- [ ] Write tests for authentication flow
- [ ] Write tests for todo CRUD operations
- [ ] Write tests for API error handling
- [ ] Write tests for protected routes

### E2E Tests (Optional)
- [ ] Install Playwright or Cypress
- [ ] Configure E2E test environment
- [ ] Write E2E test for login flow
- [ ] Write E2E test for todo creation
- [ ] Write E2E test for todo completion

### CI/CD Integration
- [ ] Add test step to GitHub Actions (if applicable)
- [ ] Configure test coverage reporting
- [ ] Set up test coverage thresholds
- [ ] Add test badge to README

### Documentation
- [ ] Document testing approach
- [ ] Add testing guidelines to README
- [ ] Document how to run tests
- [ ] Add examples of test patterns

## Benefits
- ✅ Catch bugs early in development
- ✅ Confidence when refactoring
- ✅ Documentation through tests
- ✅ Better code quality
- ✅ Regression prevention
- ✅ Faster development (tests catch issues)

## Technical Details

### Vitest Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

### Test Example - Component
```typescript
// frontend/src/components/__tests__/TodoItem.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import TodoItem from '../TodoItem';

describe('TodoItem', () => {
  const mockTodo = {
    id: '1',
    content: 'Test todo',
    priority: 1,
    date: '2025-01-01',
    status: 'TODO',
  };

  it('renders todo content', () => {
    render(
      <TodoItem
        {...mockTodo}
        onStatusChange={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  it('calls onStatusChange when checkbox clicked', () => {
    const onStatusChange = jest.fn();
    render(
      <TodoItem
        {...mockTodo}
        onStatusChange={onStatusChange}
        onDelete={jest.fn()}
      />
    );
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onStatusChange).toHaveBeenCalledTimes(1);
  });
});
```

### Test Example - API Integration
```typescript
// frontend/src/utils/__tests__/api.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import api from '../api';

const server = setupServer(
  rest.get('http://localhost:3004/api/todos', (req, res, ctx) => {
    return res(ctx.json([{ id: '1', content: 'Test' }]));
  })
);

beforeEach(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe('API Client', () => {
  it('fetches todos successfully', async () => {
    const todos = await api.get('/api/todos');
    expect(todos).toHaveLength(1);
    expect(todos[0].content).toBe('Test');
  });
});
```

### Package.json Scripts
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test"
  }
}
```

## Related Files
- `frontend/vite.config.ts` - Needs Vitest configuration
- `frontend/package.json` - Needs testing dependencies
- `frontend/src/test/setup.ts` - New test setup file (to be created)
- `frontend/src/test/mocks/` - New mocks directory (to be created)
- `server/package.json` - Needs testing dependencies
- `server/__tests__/` - New test directory (to be created)
- `.github/workflows/test.yml` - CI/CD workflow (optional)

