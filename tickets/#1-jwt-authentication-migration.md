# Migrate to JWT-based Authentication with Server-side Authorization

**Issue #:** #1  
**Status:** Open  
**Priority:** High  
**Type:** Enhancement / Security  
**Created:** 2025-01-XX

## Overview
Migrate from client-side only authentication to JWT-based authentication with server-side authorization. This will significantly improve security by implementing password hashing, token-based authentication, and server-side route protection.

## Current Issues

### Security Vulnerabilities
- ❌ **Client-side only authentication** - Authentication state stored in localStorage/sessionStorage (boolean flag + user ID)
- ❌ **Plain text passwords** - Passwords stored unencrypted in `db.json`
- ❌ **No server-side validation** - json-server has no authentication middleware
- ❌ **No tokens** - No JWT or session tokens
- ❌ **Client-side data filtering** - Todos filtered by `accountID` on client, all data sent to browser
- ❌ **No API protection** - All endpoints publicly accessible

### Current Implementation
- Authentication: `localStorage.getItem("isLoggedIn") === "true"` check
- User ID stored in: `localStorage.getItem("accID")` or `sessionStorage.getItem("accID")`
- Login: Fetches all accounts, compares plain text password
- API calls: No authentication headers, no server-side validation

## Proposed Solution

### Backend Changes

#### 1. Express Server Wrapper
- Wrap json-server with Express middleware
- Express server on port 3004
- json-server as middleware for `/api/*` routes
- Authentication endpoints: `/auth/login`, `/auth/register`
- JWT middleware to protect `/api/todos` and `/api/accounts` endpoints

#### 2. Dependencies to Add
```json
{
  "express": "^4.x.x",
  "jsonwebtoken": "^9.x.x",
  "bcrypt": "^5.x.x",
  "cors": "^2.x.x",
  "dotenv": "^16.x.x"
}
```

#### 3. New Files to Create
- `server/index.js` - Express server entry point
- `server/middleware/auth.js` - JWT verification middleware
- `server/routes/auth.js` - Authentication routes (login/register)
- `server/.env` - Environment variables (JWT_SECRET)

#### 4. Security Improvements
- Hash all passwords using bcrypt
- Implement JWT token-based authentication
- Server-side route protection
- User-specific data filtering on server
- Token expiration and refresh handling

### Frontend Changes

#### 1. Update Auth Utilities (`frontend/src/utils/auth.ts`)
- Replace localStorage flags with JWT token storage
- Functions: `getToken()`, `setToken()`, `removeToken()`
- Update `isAuthenticated()` to check token validity

#### 2. Create API Client (`frontend/src/utils/api.ts`)
- Centralized fetch wrapper
- Automatically add Authorization header with JWT
- Handle token refresh/expiration

#### 3. Update Components
- **Login.tsx**: Call `/auth/login` endpoint, store JWT
- **Register.tsx**: Call `/auth/register` endpoint, store JWT
- **TodoList.tsx**: Use API client with auth headers
- **Header.tsx**: Use API client for todo creation
- **useUserAccount.ts**: Use API client, call authenticated endpoint
- **App.tsx**: Check JWT token validity instead of localStorage flag

## Implementation Tasks

### Backend
- [ ] Set up Express server with json-server middleware
- [ ] Install and configure JWT and bcrypt dependencies
- [ ] Create authentication endpoints (login/register)
- [ ] Create JWT middleware for route protection
- [ ] Hash existing passwords in db.json
- [ ] Protect `/api/todos` endpoint (require auth, filter by user)
- [ ] Protect `/api/accounts` endpoint (require auth, return only current user)

### Frontend
- [ ] Update `auth.ts` to use JWT tokens
- [ ] Create API client with automatic token injection
- [ ] Update Login page to use `/auth/login` endpoint
- [ ] Update Register page to use `/auth/register` endpoint
- [ ] Update all API calls to use authenticated API client
- [ ] Update route protection in App.tsx

### Testing
- [ ] Test login flow with JWT
- [ ] Test register flow with JWT
- [ ] Test protected routes (should redirect if no token)
- [ ] Test API calls with invalid/expired tokens
- [ ] Test user-specific data filtering
- [ ] Verify password hashing works correctly

## Benefits
- ✅ Secure password storage (bcrypt hashing)
- ✅ Token-based authentication (JWT)
- ✅ Server-side authorization
- ✅ Protected API endpoints
- ✅ User-specific data isolation
- ✅ Better security posture overall
- ✅ Industry-standard authentication pattern

## Technical Details

### JWT Token Structure
```json
{
  "userId": "14be",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234571490
}
```

### API Endpoints

**Public:**
- `POST /auth/login` - Login with email/password, returns JWT
- `POST /auth/register` - Register new account, returns JWT

**Protected (require JWT):**
- `GET /api/todos` - Get todos for authenticated user
- `POST /api/todos` - Create todo for authenticated user
- `PUT /api/todos/:id` - Update todo (only if owner)
- `DELETE /api/todos/:id` - Delete todo (only if owner)
- `GET /api/accounts/me` - Get current user account

### Environment Variables
```
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h
```

## Migration Notes
- Existing users will need to reset passwords (passwords will be hashed)
- Consider migration script to hash existing passwords
- Frontend will need to handle token expiration gracefully
- Update API base URL if needed

## Related Files
- `server/db.json` - Database file (passwords need hashing)
- `frontend/src/utils/auth.ts` - Auth utilities (needs refactor)
- `frontend/src/pages/Login.tsx` - Login page (needs update)
- `frontend/src/pages/Register.tsx` - Register page (needs update)
- `frontend/src/components/TodoList.tsx` - Todo list (needs auth headers)
- `frontend/src/components/Header.tsx` - Header (needs auth headers)
- `frontend/src/hooks/useUserAccount.ts` - User account hook (needs auth)
- `frontend/src/App.tsx` - App router (needs JWT check)

