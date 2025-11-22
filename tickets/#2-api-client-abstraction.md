# Utworzenie scentralizowanej abstrakcji klienta API

**Issue #:** #2  
**Status:** Open  
**Priority:** High  
**Type:** Enhancement / Code Quality  
**Created:** 2025-11-22

## Przegląd
Utworzenie scentralizowanego klienta API do abstrakcji wszystkich żądań HTTP, eliminacji duplikacji kodu, zapewnienia spójnej obsługi błędów i automatycznego wstrzykiwania nagłówków uwierzytelniania. To poprawi utrzymywalność i ułatwi aktualizację endpointów API w całej aplikacji.

## Obecne problemy

### Duplikacja kodu
- ❌ **Rozproszone wywołania fetch** - Bezpośrednie wywołania `fetch()` w wielu komponentach (Login, Register, TodoList, Header, useUserAccount)
- ❌ **Zakodowane na stałe URL-e API** - `http://localhost:3004` powtarzane w całym kodzie
- ❌ **Brak konfiguracji bazowego URL** - Trudno zmienić endpoint API dla różnych środowisk
- ❌ **Niespójne nagłówki** - Niektóre żądania zawierają nagłówki, inne nie
- ❌ **Brak interceptorów żądań** - Nie można automatycznie dodawać tokenów auth do wszystkich żądań

### Brakujące funkcje
- ❌ **Brak scentralizowanej obsługi błędów** - Każdy komponent obsługuje błędy inaczej
- ❌ **Brak interceptorów żądań/odpowiedzi** - Nie można przekształcać żądań/odpowiedzi globalnie
- ❌ **Brak logiki ponawiania** - Nieudane żądania nie są automatycznie ponawiane
- ❌ **Brak anulowania żądań** - Nie można anulować żądań w trakcie
- ❌ **Brak obsługi timeoutu** - Żądania mogą wisieć w nieskończoność

### Obecna implementacja
- Bezpośrednie wywołania `fetch()` w:
  - `frontend/src/pages/Login.tsx` (linia 56)
  - `frontend/src/pages/Register.tsx` (linie 48, 98)
  - `frontend/src/components/TodoList.tsx` (linie 23, 43, 62)
  - `frontend/src/components/Header.tsx` (linia 59)
  - `frontend/src/hooks/useUserAccount.ts` (linia 20)
- Zakodowany na stałe bazowy URL: `http://localhost:3004`
- Niespójne wzorce obsługi błędów

## Proponowane rozwiązanie

### Utworzenie klienta API (`frontend/src/utils/api.ts`)

#### 1. Konfiguracja bazowa
- Bazowy URL API oparty na środowisku
- Domyślne nagłówki (Content-Type, itp.)
- Interceptory żądań/odpowiedzi
- Nakładka obsługi błędów

#### 2. Integracja uwierzytelniania
- Automatyczne wstrzykiwanie tokenu JWT z magazynu
- Obsługa odświeżania tokenu przy odpowiedziach 401
- Przekierowanie do logowania przy niepowodzeniu uwierzytelniania

#### 3. Metody żądań
- `get(url, config?)` - Żądania GET
- `post(url, data, config?)` - Żądania POST
- `put(url, data, config?)` - Żądania PUT
- `delete(url, config?)` - Żądania DELETE
- `patch(url, data, config?)` - Żądania PATCH

#### 4. Funkcje
- Automatyczne parsowanie JSON
- Timeout żądania (domyślnie 30s)
- Logika ponawiania dla nieudanych żądań
- Wsparcie anulowania żądań
- Typy TypeScript dla odpowiedzi

## Zadania implementacyjne

### Konfiguracja
- [ ] Utwórz plik `frontend/src/utils/api.ts`
- [ ] Dodaj zmienną środowiskową dla bazowego URL API
- [ ] Utwórz typy TypeScript dla odpowiedzi API
- [ ] Skonfiguruj zmienne środowiskowe Vite

### Implementacja klienta API
- [ ] Zaimplementuj bazową nakładkę na fetch
- [ ] Dodaj interceptor żądań dla nagłówków auth
- [ ] Dodaj interceptor odpowiedzi dla obsługi błędów
- [ ] Zaimplementuj automatyczne wstrzykiwanie tokenu
- [ ] Dodaj logikę odświeżania tokenu
- [ ] Zaimplementuj timeout żądania
- [ ] Dodaj mechanizm ponawiania dla nieudanych żądań

### Migracja
- [ ] Zaktualizuj `Login.tsx` aby używał klienta API
- [ ] Zaktualizuj `Register.tsx` aby używał klienta API
- [ ] Zaktualizuj `TodoList.tsx` aby używał klienta API
- [ ] Zaktualizuj `Header.tsx` aby używał klienta API
- [ ] Zaktualizuj `useUserAccount.ts` aby używał klienta API
- [ ] Usuń wszystkie bezpośrednie wywołania `fetch()`

### Testowanie
- [ ] Przetestuj klienta API z uwierzytelnianiem
- [ ] Przetestuj scenariusze obsługi błędów
- [ ] Przetestuj przepływ odświeżania tokenu
- [ ] Przetestuj anulowanie żądań
- [ ] Przetestuj obsługę timeoutu

## Korzyści
- ✅ Jedno źródło prawdy dla wywołań API
- ✅ Spójna obsługa błędów w całej aplikacji
- ✅ Automatyczne wstrzykiwanie nagłówka uwierzytelniania
- ✅ Łatwiejsza aktualizacja endpointów API
- ✅ Lepsze wsparcie TypeScript
- ✅ Poprawiona utrzymywalność
- ✅ Wsparcie konfiguracji specyficznej dla środowiska

## Szczegóły techniczne

### Struktura klienta API
```typescript
// frontend/src/utils/api.ts
const api = {
  get: (url: string, config?: RequestConfig) => Promise<T>,
  post: (url: string, data?: any, config?: RequestConfig) => Promise<T>,
  put: (url: string, data?: any, config?: RequestConfig) => Promise<T>,
  delete: (url: string, config?: RequestConfig) => Promise<T>,
}
```

### Zmienne środowiskowe
```env
VITE_API_BASE_URL=http://localhost:3004
VITE_API_TIMEOUT=30000
```

### Przykład użycia
```typescript
// Przed
const response = await fetch('http://localhost:3004/todos');
const data = await response.json();

// Po
const data = await api.get('/api/todos');
```

## Powiązane pliki
- `frontend/src/utils/api.ts` - Nowy plik klienta API (do utworzenia)
- `frontend/src/pages/Login.tsx` - Wymaga migracji
- `frontend/src/pages/Register.tsx` - Wymaga migracji
- `frontend/src/components/TodoList.tsx` - Wymaga migracji
- `frontend/src/components/Header.tsx` - Wymaga migracji
- `frontend/src/hooks/useUserAccount.ts` - Wymaga migracji
- `frontend/.env` - Konfiguracja środowiska (do utworzenia)
- `frontend/vite.config.ts` - Może wymagać aktualizacji dla zmiennych env
