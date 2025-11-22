# Optymalizacja wydajności i redukcja niepotrzebnych re-renderów

**Issue #:** #8  
**Status:** Open  
**Priority:** Medium  
**Type:** Enhancement / Performance  
**Created:** 2025-11-22

## Przegląd
Optymalizacja wydajności aplikacji poprzez eliminację niepotrzebnych re-renderów, implementację code splitting, dodanie memoizacji i usunięcie nieefektywnych wzorców takich jak pełne przeładowania strony. To poprawi doświadczenie użytkownika i responsywność aplikacji.

## Obecne problemy

### Problemy wydajności
- ❌ **Pełne przeładowania strony** - `location.reload()` w Header.tsx (linia 76) powoduje pełne odświeżenie strony
- ❌ **Brak code splitting** - Cała aplikacja ładowana z góry
- ❌ **Brak lazy loading** - Wszystkie trasy ładowane natychmiast
- ❌ **Brak memoizacji** - Komponenty renderują się niepotrzebnie ponownie
- ❌ **Nieefektywne renderowanie list** - Brak wirtualizacji dla długich list

### Problemy re-renderów
- ❌ **Brak React.memo** - Komponenty renderują się ponownie gdy props się nie zmieniły
- ❌ **Brak useMemo/useCallback** - Kosztowne obliczenia przeliczane przy każdym renderze
- ❌ **Niepotrzebne aktualizacje stanu** - Stan aktualizowany nawet gdy wartość się nie zmieniła
- ❌ **Brakujące tablice zależności** - Hooki useEffect mogą mieć brakujące zależności

### Wydajność API
- ❌ **Filtrowanie po stronie klienta** - Wszystkie todo pobierane, potem filtrowane (TodoList.tsx:29)
- ❌ **Brak debouncing żądań** - Możliwe wiele szybkich żądań
- ❌ **Brak anulowania żądań** - Anulowane żądania nadal przetwarzane
- ❌ **Brak paginacji** - Wszystkie dane ładowane naraz
- ❌ **Brak cache** - Te same dane pobierane wielokrotnie

### Problemy obecnej implementacji
- `location.reload()` w Header.tsx po utworzeniu todo (linia 76)
- Filtrowanie po stronie klienta w TodoList.tsx (linia 29)
- Brakująca zależność w useEffect (TodoList.tsx:74 - userAccount nie w deps)
- Brak memoizacji w komponentach
- Wszystkie trasy ładowane synchronicznie

## Proponowane rozwiązanie

### 1. Usuń pełne przeładowania strony
- Zastąp `location.reload()` aktualizacjami stanu
- Użyj zarządzania stanem/kontekstem do aktualizacji UI
- Zaimplementuj optymistyczne aktualizacje

### 2. Zaimplementuj code splitting
- Lazy load tras
- Dynamiczne importy dla ciężkich komponentów
- Podziel bundlery vendorów

### 3. Dodaj memoizację
- Użyj React.memo dla komponentów
- Użyj useMemo dla kosztownych obliczeń
- Użyj useCallback dla referencji funkcji
- Memoizuj odpowiedzi API

### 4. Optymalizuj renderowanie list
- Dodaj klucze właściwie (już zrobione, ale zweryfikuj)
- Rozważ wirtualizację dla długich list (jeśli potrzeba)
- Optymalizuj renderowanie TodoItem

### 5. Popraw wydajność API
- Filtrowanie po stronie serwera (już planowane w #1)
- Dodaj debouncing żądań
- Zaimplementuj anulowanie żądań
- Dodaj cache odpowiedzi

## Zadania implementacyjne

### Usuń przeładowania strony
- [ ] Usuń `location.reload()` z Header.tsx
- [ ] Zaimplementuj aktualizację stanu zamiast tego
- [ ] Użyj zarządzania stanem/kontekstem dla aktualizacji todo
- [ ] Przetestuj, że UI aktualizuje się poprawnie bez przeładowania

### Code splitting
- [ ] Lazy load strony Login
- [ ] Lazy load strony Register
- [ ] Lazy load TodoPage
- [ ] Dodaj komponenty fallback ładowania
- [ ] Skonfiguruj code splitting oparty na trasach

### Memoizacja
- [ ] Dodaj React.memo do komponentu TodoItem
- [ ] Dodaj React.memo do komponentu Header (jeśli potrzeba)
- [ ] Użyj useMemo dla filtrowanych todo
- [ ] Użyj useCallback dla handlerów zdarzeń
- [ ] Memoizuj kosztowne obliczenia

### Optymalizacja useEffect
- [ ] Napraw brakujące zależności w hookach useEffect
- [ ] Dodaj właściwe funkcje czyszczenia
- [ ] Optymalizuj zależności efektów
- [ ] Usuń niepotrzebne efekty

### Optymalizacja API
- [ ] Zaimplementuj filtrowanie po stronie serwera (część #1)
- [ ] Dodaj debouncing żądań dla wyszukiwania/filtrowania
- [ ] Zaimplementuj anulowanie żądań z AbortController
- [ ] Dodaj cache odpowiedzi
- [ ] Rozważ paginację dla dużych zbiorów danych

### Optymalizacja bundla
- [ ] Przeanalizuj rozmiar bundla
- [ ] Podziel chunki vendorów
- [ ] Usuń nieużywane zależności
- [ ] Optymalizuj importy (tree-shaking)
- [ ] Skonfiguruj optymalizacje build Vite

### Monitorowanie wydajności
- [ ] Dodaj użycie React DevTools Profiler
- [ ] Zmierz czasy renderowania komponentów
- [ ] Zidentyfikuj wąskie gardła wydajności
- [ ] Ustaw budżety wydajności

### Testowanie
- [ ] Przetestuj, że usunięcie przeładowania strony działa
- [ ] Przetestuj lazy loading
- [ ] Przetestuj efektywność memoizacji
- [ ] Przetestuj optymalizacje API
- [ ] Zmierz poprawy wydajności

## Korzyści
- ✅ Szybsze ładowanie stron (code splitting)
- ✅ Płynniejsze doświadczenie użytkownika (brak przeładowań strony)
- ✅ Zmniejszone re-rendery (memoizacja)
- ✅ Lepsza wydajność (zoptymalizowane wywołania API)
- ✅ Niższe użycie pamięci
- ✅ Lepsza postrzegana wydajność

## Szczegóły techniczne

### Przykład code splitting
```typescript
// App.tsx
import { lazy, Suspense } from 'react';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const TodoPage = lazy(() => import('./pages/TodoPage'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<TodoPage />} />
      </Routes>
    </Suspense>
  );
}
```

### Przykład memoizacji
```typescript
// TodoItem.tsx
import React, { memo } from 'react';

const TodoItem = memo(({ id, content, priority, date, status, onStatusChange, onDelete }) => {
  // Implementacja komponentu
});

export default TodoItem;
```

### Przykład useMemo/useCallback
```typescript
// TodoList.tsx
import { useMemo, useCallback } from 'react';

const TodoList = () => {
  const todos = useTodos(); // Z kontekstu
  
  const activeTodos = useMemo(
    () => todos.filter(todo => todo.status === 'TODO'),
    [todos]
  );
  
  const handleToggle = useCallback((todoId: string) => {
    toggleTodo(todoId);
  }, [toggleTodo]);
  
  // Implementacja komponentu
};
```

### Przykład anulowania żądania
```typescript
// TodoList.tsx
useEffect(() => {
  const abortController = new AbortController();
  
  const fetchTodos = async () => {
    try {
      const data = await api.get('/api/todos', {
        signal: abortController.signal
      });
      setTodos(data);
    } catch (error) {
      if (error.name !== 'AbortError') {
        // Obsłuż błąd
      }
    }
  };
  
  fetchTodos();
  
  return () => {
    abortController.abort();
  };
}, []);
```

### Usuń location.reload()
```typescript
// Header.tsx - Przed
finally {
  location.reload();
}

// Header.tsx - Po
finally {
  // Aktualizuj stan przez kontekst/store
  addTodo(data);
  // Lub wywołaj ponowne pobranie
  refetchTodos();
  // Resetuj formularz
  setFormData(initialFormData);
}
```

### Optymalizacja build Vite
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

## Powiązane pliki
- `frontend/src/components/Header.tsx` - Usuń location.reload()
- `frontend/src/components/TodoList.tsx` - Dodaj memoizację, napraw useEffect
- `frontend/src/components/TodoItem.tsx` - Dodaj React.memo
- `frontend/src/App.tsx` - Dodaj code splitting
- `frontend/src/pages/Login.tsx` - Lazy load
- `frontend/src/pages/Register.tsx` - Lazy load
- `frontend/src/pages/TodoPage.tsx` - Lazy load
- `frontend/vite.config.ts` - Optymalizacje build
- `frontend/src/utils/api.ts` - Anulowanie żądań (gdy utworzony)
