# Implement Proper State Management

**Issue #:** #5  
**Status:** Open  
**Priority:** Medium  
**Type:** Enhancement / Architecture  
**Created:** 2025-01-XX

## Overview
Implement a proper state management solution to eliminate prop drilling, centralize application state, and improve component communication. This will make the codebase more maintainable and scalable.

## Current Issues

### State Management Problems
- ❌ **No centralized state** - State scattered across components
- ❌ **Prop drilling** - Passing props through multiple component layers
- ❌ **Duplicate state** - Same data fetched/stored in multiple places
- ❌ **Manual synchronization** - Components manually sync state
- ❌ **No global state** - Auth state, user data not globally accessible

### Current Implementation Issues
- Authentication state managed in `App.tsx` and `auth.ts` utilities
- User account data fetched in `useUserAccount.ts` hook (duplicated logic)
- Todo state managed locally in `TodoList.tsx`
- No shared state between components
- `location.reload()` used to sync state (Header.tsx:76)

### State Synchronization Issues
- ❌ **Manual page reloads** - `location.reload()` in Header.tsx to sync todos
- ❌ **No optimistic updates** - UI doesn't update immediately
- ❌ **Race conditions** - Multiple components fetching same data
- ❌ **No cache** - Data refetched unnecessarily

## Proposed Solution

### Option 1: React Context API (Recommended for current scale)
- Create AuthContext for authentication state
- Create UserContext for user account data
- Create TodoContext for todo operations
- Lightweight, no additional dependencies

### Option 2: Zustand (If more complex state needed)
- Lightweight state management library
- Simple API, good TypeScript support
- Better performance than Context API for frequent updates

### Implementation Approach
1. Create context providers for:
   - Authentication (token, user, login/logout)
   - User account data
   - Todo operations (CRUD)
2. Replace prop drilling with context consumption
3. Implement optimistic updates
4. Add state caching to reduce API calls

## Implementation Tasks

### Setup
- [ ] Decide on state management solution (Context API or Zustand)
- [ ] Install Zustand if chosen (optional)
- [ ] Create context/store structure

### Authentication State
- [ ] Create `AuthContext` or auth store
- [ ] Move authentication logic to context/store
- [ ] Provide auth state globally
- [ ] Update components to use auth context

### User Account State
- [ ] Create `UserContext` or user store
- [ ] Move user account fetching to context/store
- [ ] Cache user account data
- [ ] Update `useUserAccount` to use context/store

### Todo State
- [ ] Create `TodoContext` or todo store
- [ ] Move todo CRUD operations to context/store
- [ ] Implement optimistic updates
- [ ] Add todo caching
- [ ] Update `TodoList` to use context/store

### Component Updates
- [ ] Remove prop drilling from App.tsx
- [ ] Update Header to use todo context (remove location.reload)
- [ ] Update TodoList to use todo context
- [ ] Update Login/Register to update auth context
- [ ] Remove duplicate state management

### Optimistic Updates
- [ ] Implement optimistic todo creation
- [ ] Implement optimistic todo updates
- [ ] Implement optimistic todo deletion
- [ ] Add rollback on error

### Testing
- [ ] Test state updates across components
- [ ] Test optimistic updates
- [ ] Test state persistence
- [ ] Test context/provider updates

## Benefits
- ✅ Eliminates prop drilling
- ✅ Centralized state management
- ✅ Better component communication
- ✅ Optimistic updates for better UX
- ✅ Reduced API calls (caching)
- ✅ Easier to test and maintain
- ✅ Better performance (no unnecessary re-renders)

## Technical Details

### Context API Example
```typescript
// frontend/src/contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  // Implementation...
  
  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Zustand Example (Alternative)
```typescript
// frontend/src/stores/authStore.ts
import create from 'zustand';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (token, user) => set({ token, user }),
  logout: () => set({ token: null, user: null }),
}));
```

### Optimistic Update Example
```typescript
// In TodoContext
const addTodo = async (todo: CreateTodoDto) => {
  // Optimistic update
  setTodos(prev => [...prev, { ...todo, id: 'temp-' + Date.now() }]);
  
  try {
    const created = await api.post('/api/todos', todo);
    // Replace temp with real todo
    setTodos(prev => prev.map(t => t.id.startsWith('temp-') ? created : t));
  } catch (error) {
    // Rollback on error
    setTodos(prev => prev.filter(t => !t.id.startsWith('temp-')));
    throw error;
  }
};
```

## Related Files
- `frontend/src/contexts/AuthContext.tsx` - New auth context (to be created)
- `frontend/src/contexts/UserContext.tsx` - New user context (to be created)
- `frontend/src/contexts/TodoContext.tsx` - New todo context (to be created)
- `frontend/src/App.tsx` - Needs context providers
- `frontend/src/components/Header.tsx` - Needs context usage (remove reload)
- `frontend/src/components/TodoList.tsx` - Needs context usage
- `frontend/src/pages/Login.tsx` - Needs context usage
- `frontend/src/pages/Register.tsx` - Needs context usage
- `frontend/src/hooks/useUserAccount.ts` - May be replaced by context
- `frontend/package.json` - May need Zustand dependency

