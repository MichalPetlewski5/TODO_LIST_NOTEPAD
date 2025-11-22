# Migracja do uwierzytelniania JWT z autoryzacją po stronie serwera

**Issue #:** #1  
**Status:** Open  
**Priority:** High  
**Type:** Enhancement / Security  
**Created:** 2025-11-22

## Przegląd
Migracja z uwierzytelniania tylko po stronie klienta do uwierzytelniania opartego na JWT z autoryzacją po stronie serwera. To znacznie poprawi bezpieczeństwo poprzez implementację hashowania haseł, uwierzytelniania opartego na tokenach i ochrony tras po stronie serwera.

## Obecne problemy

### Luki bezpieczeństwa
- ❌ **Uwierzytelnianie tylko po stronie klienta** - Stan uwierzytelniania przechowywany w localStorage/sessionStorage (flaga boolean + ID użytkownika)
- ❌ **Hasła w postaci zwykłego tekstu** - Hasła przechowywane niezaszyfrowane w `db.json`
- ❌ **Brak walidacji po stronie serwera** - json-server nie ma middleware uwierzytelniania
- ❌ **Brak tokenów** - Brak tokenów JWT lub sesyjnych
- ❌ **Filtrowanie danych po stronie klienta** - Todo filtrowane według `accountID` po stronie klienta, wszystkie dane wysyłane do przeglądarki
- ❌ **Brak ochrony API** - Wszystkie endpointy publicznie dostępne

### Obecna implementacja
- Uwierzytelnianie: sprawdzanie `localStorage.getItem("isLoggedIn") === "true"`
- ID użytkownika przechowywane w: `localStorage.getItem("accID")` lub `sessionStorage.getItem("accID")`
- Logowanie: Pobiera wszystkie konta, porównuje hasło w postaci zwykłego tekstu
- Wywołania API: Brak nagłówków uwierzytelniania, brak walidacji po stronie serwera

## Proponowane rozwiązanie

### Zmiany w backendzie

#### 1. Opakowanie serwera Express
- Opakuj json-server middleware Express
- Serwer Express na porcie 3004
- json-server jako middleware dla tras `/api/*`
- Endpointy uwierzytelniania: `/auth/login`, `/auth/register`
- Middleware JWT do ochrony endpointów `/api/todos` i `/api/accounts`

#### 2. Zależności do dodania
```json
{
  "express": "^4.x.x",
  "jsonwebtoken": "^9.x.x",
  "bcrypt": "^5.x.x",
  "cors": "^2.x.x",
  "dotenv": "^16.x.x"
}
```

#### 3. Nowe pliki do utworzenia
- `server/index.js` - Punkt wejścia serwera Express
- `server/middleware/auth.js` - Middleware weryfikacji JWT
- `server/routes/auth.js` - Trasy uwierzytelniania (login/register)
- `server/.env` - Zmienne środowiskowe (JWT_SECRET)

#### 4. Ulepszenia bezpieczeństwa
- Hashuj wszystkie hasła używając bcrypt
- Zaimplementuj uwierzytelnianie oparte na tokenach JWT
- Ochrona tras po stronie serwera
- Filtrowanie danych specyficznych dla użytkownika po stronie serwera
- Obsługa wygaśnięcia i odświeżania tokenów

### Zmiany w frontendzie

#### 1. Aktualizacja narzędzi uwierzytelniania (`frontend/src/utils/auth.ts`)
- Zastąp flagi localStorage przechowywaniem tokenów JWT
- Funkcje: `getToken()`, `setToken()`, `removeToken()`
- Zaktualizuj `isAuthenticated()` aby sprawdzała ważność tokenu

#### 2. Utworzenie klienta API (`frontend/src/utils/api.ts`)
- Centralizowana nakładka na fetch
- Automatyczne dodawanie nagłówka Authorization z JWT
- Obsługa odświeżania/wygaśnięcia tokenu

#### 3. Aktualizacja komponentów
- **Login.tsx**: Wywołaj endpoint `/auth/login`, przechowaj JWT
- **Register.tsx**: Wywołaj endpoint `/auth/register`, przechowaj JWT
- **TodoList.tsx**: Użyj klienta API z nagłówkami auth
- **Header.tsx**: Użyj klienta API do tworzenia todo
- **useUserAccount.ts**: Użyj klienta API, wywołaj uwierzytelniony endpoint
- **App.tsx**: Sprawdź ważność tokenu JWT zamiast flagi localStorage

## Zadania implementacyjne

### Backend
- [ ] Skonfiguruj serwer Express z middleware json-server
- [ ] Zainstaluj i skonfiguruj zależności JWT i bcrypt
- [ ] Utwórz endpointy uwierzytelniania (login/register)
- [ ] Utwórz middleware JWT do ochrony tras
- [ ] Zaszyfruj istniejące hasła w db.json
- [ ] Zabezpiecz endpoint `/api/todos` (wymagaj auth, filtruj według użytkownika)
- [ ] Zabezpiecz endpoint `/api/accounts` (wymagaj auth, zwróć tylko bieżącego użytkownika)

### Frontend
- [ ] Zaktualizuj `auth.ts` aby używał tokenów JWT
- [ ] Utwórz klienta API z automatycznym wstrzykiwaniem tokenu
- [ ] Zaktualizuj stronę Login aby używała endpointu `/auth/login`
- [ ] Zaktualizuj stronę Register aby używała endpointu `/auth/register`
- [ ] Zaktualizuj wszystkie wywołania API aby używały uwierzytelnionego klienta API
- [ ] Zaktualizuj ochronę tras w App.tsx

### Testowanie
- [ ] Przetestuj przepływ logowania z JWT
- [ ] Przetestuj przepływ rejestracji z JWT
- [ ] Przetestuj chronione trasy (powinny przekierować jeśli brak tokenu)
- [ ] Przetestuj wywołania API z nieprawidłowymi/wygasłymi tokenami
- [ ] Przetestuj filtrowanie danych specyficznych dla użytkownika
- [ ] Zweryfikuj, że hashowanie haseł działa poprawnie

## Korzyści
- ✅ Bezpieczne przechowywanie haseł (hashowanie bcrypt)
- ✅ Uwierzytelnianie oparte na tokenach (JWT)
- ✅ Autoryzacja po stronie serwera
- ✅ Chronione endpointy API
- ✅ Izolacja danych specyficznych dla użytkownika
- ✅ Lepsza postawa bezpieczeństwa ogólnie
- ✅ Standardowy wzorzec uwierzytelniania w branży

## Szczegóły techniczne

### Struktura tokenu JWT
```json
{
  "userId": "14be",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Endpointy API

**Publiczne:**
- `POST /auth/login` - Logowanie z emailem/hasłem, zwraca JWT
- `POST /auth/register` - Rejestracja nowego konta, zwraca JWT

**Chronione (wymagają JWT):**
- `GET /api/todos` - Pobierz todo dla uwierzytelnionego użytkownika
- `POST /api/todos` - Utwórz todo dla uwierzytelnionego użytkownika
- `PUT /api/todos/:id` - Zaktualizuj todo (tylko jeśli właściciel)
- `DELETE /api/todos/:id` - Usuń todo (tylko jeśli właściciel)
- `GET /api/accounts/me` - Pobierz konto bieżącego użytkownika

### Zmienne środowiskowe
```
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h
```

## Uwagi dotyczące migracji
- Istniejący użytkownicy będą musieli zresetować hasła (hasła będą zahashowane)
- Rozważ skrypt migracyjny do hashowania istniejących haseł
- Frontend będzie musiał obsłużyć wygaśnięcie tokenu elegancko
- Zaktualizuj bazowy URL API jeśli potrzeba

## Powiązane pliki
- `server/db.json` - Plik bazy danych (hasła wymagają hashowania)
- `frontend/src/utils/auth.ts` - Narzędzia auth (wymaga refaktoryzacji)
- `frontend/src/pages/Login.tsx` - Strona logowania (wymaga aktualizacji)
- `frontend/src/pages/Register.tsx` - Strona rejestracji (wymaga aktualizacji)
- `frontend/src/components/TodoList.tsx` - Lista todo (wymaga nagłówków auth)
- `frontend/src/components/Header.tsx` - Nagłówek (wymaga nagłówków auth)
- `frontend/src/hooks/useUserAccount.ts` - Hook konta użytkownika (wymaga auth)
- `frontend/src/App.tsx` - Router aplikacji (wymaga sprawdzenia JWT)
