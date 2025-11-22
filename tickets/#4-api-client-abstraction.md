# Create Centralized API Client Abstraction

**Issue #:** #2  
**Status:** Open  
**Priority:** High  
**Type:** Enhancement / Code Quality  
**Created:** 2025-01-XX

## Overview
Create a centralized API client to abstract all HTTP requests, eliminate code duplication, provide consistent error handling, and automatically inject authentication headers. This will improve maintainability and make it easier to update API endpoints across the application.

## Current Issues

### Code Duplication
- ❌ **Scattered fetch calls** - Direct `fetch()` calls in multiple components (Login, Register, TodoList, Header, useUserAccount)
- ❌ **Hardcoded API URLs** - `http://localhost:3004` repeated throughout codebase
- ❌ **No base URL configuration** - Difficult to change API endpoint for different environments
- ❌ **Inconsistent headers** - Some requests include headers, others don't
- ❌ **No request interceptors** - Cannot automatically add auth tokens to all requests

### Missing Features
- ❌ **No centralized error handling** - Each component handles errors differently
- ❌ **No request/response interceptors** - Cannot transform requests/responses globally
- ❌ **No retry logic** - Failed requests are not automatically retried
- ❌ **No request cancellation** - Cannot cancel in-flight requests
- ❌ **No timeout handling** - Requests can hang indefinitely

### Current Implementation
- Direct `fetch()` calls in:
  - `frontend/src/pages/Login.tsx` (line 56)
  - `frontend/src/pages/Register.tsx` (lines 48, 98)
  - `frontend/src/components/TodoList.tsx` (lines 23, 43, 62)
  - `frontend/src/components/Header.tsx` (line 59)
  - `frontend/src/hooks/useUserAccount.ts` (line 20)
- Hardcoded base URL: `http://localhost:3004`
- Inconsistent error handling patterns

## Proposed Solution

### Create API Client (`frontend/src/utils/api.ts`)

#### 1. Base Configuration
- Environment-based API base URL
- Default headers (Content-Type, etc.)
- Request/response interceptors
- Error handling wrapper

#### 2. Authentication Integration
- Automatically inject JWT token from storage
- Handle token refresh on 401 responses
- Redirect to login on authentication failure

#### 3. Request Methods
- `get(url, config?)` - GET requests
- `post(url, data, config?)` - POST requests
- `put(url, data, config?)` - PUT requests
- `delete(url, config?)` - DELETE requests
- `patch(url, data, config?)` - PATCH requests

#### 4. Features
- Automatic JSON parsing
- Request timeout (default 30s)
- Retry logic for failed requests
- Request cancellation support
- TypeScript types for responses

## Implementation Tasks

### Setup
- [ ] Create `frontend/src/utils/api.ts` file
- [ ] Add environment variable for API base URL
- [ ] Create TypeScript types for API responses
- [ ] Configure Vite environment variables

### API Client Implementation
- [ ] Implement base fetch wrapper
- [ ] Add request interceptor for auth headers
- [ ] Add response interceptor for error handling
- [ ] Implement automatic token injection
- [ ] Add token refresh logic
- [ ] Implement request timeout
- [ ] Add retry mechanism for failed requests

### Migration
- [ ] Update `Login.tsx` to use API client
- [ ] Update `Register.tsx` to use API client
- [ ] Update `TodoList.tsx` to use API client
- [ ] Update `Header.tsx` to use API client
- [ ] Update `useUserAccount.ts` to use API client
- [ ] Remove all direct `fetch()` calls

### Testing
- [ ] Test API client with authentication
- [ ] Test error handling scenarios
- [ ] Test token refresh flow
- [ ] Test request cancellation
- [ ] Test timeout handling

## Benefits
- ✅ Single source of truth for API calls
- ✅ Consistent error handling across application
- ✅ Automatic authentication header injection
- ✅ Easier to update API endpoints
- ✅ Better TypeScript support
- ✅ Improved maintainability
- ✅ Environment-specific configuration support

## Technical Details

### API Client Structure
```typescript
// frontend/src/utils/api.ts
const api = {
  get: (url: string, config?: RequestConfig) => Promise<T>,
  post: (url: string, data?: any, config?: RequestConfig) => Promise<T>,
  put: (url: string, data?: any, config?: RequestConfig) => Promise<T>,
  delete: (url: string, config?: RequestConfig) => Promise<T>,
}
```

### Environment Variables
```env
VITE_API_BASE_URL=http://localhost:3004
VITE_API_TIMEOUT=30000
```

### Example Usage
```typescript
// Before
const response = await fetch('http://localhost:3004/todos');
const data = await response.json();

// After
const data = await api.get('/api/todos');
```

## Related Files
- `frontend/src/utils/api.ts` - New API client file (to be created)
- `frontend/src/pages/Login.tsx` - Needs migration
- `frontend/src/pages/Register.tsx` - Needs migration
- `frontend/src/components/TodoList.tsx` - Needs migration
- `frontend/src/components/Header.tsx` - Needs migration
- `frontend/src/hooks/useUserAccount.ts` - Needs migration
- `frontend/.env` - Environment configuration (to be created)
- `frontend/vite.config.ts` - May need updates for env vars

