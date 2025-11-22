# Poprawa bezpieczeństwa typów TypeScript

**Issue #:** #4  
**Status:** Open  
**Priority:** Medium  
**Type:** Enhancement / Code Quality  
**Created:** 2025-11-22

## Przegląd
Naprawienie niespójności typów TypeScript, wyeliminowanie typów `any`, włączenie trybu strict i utworzenie kompleksowych definicji typów. To poprawi niezawodność kodu, wyłapie błędy w czasie kompilacji i zapewni lepsze wsparcie IDE.

## Obecne problemy

### Niespójności typów
- ❌ **Niespójne definicje typów** - Interfejsy `Todo` vs `TodoElement` (różne struktury)
- ❌ **Używanie `Number` zamiast `number`** - Powinno używać małej litery typu pierwotnego
- ❌ **Brak typów dla odpowiedzi API** - Brak typów dla odpowiedzi fetch
- ❌ **Brak typów dla props** - Niektóre komponenty nie mają właściwych typów props
- ❌ **Zduplikowane definicje typów** - Te same typy zdefiniowane w wielu plikach

### Problemy bezpieczeństwa typów
- ❌ **Używanie typu `any`** - Niszczy cel TypeScript (bloki catch, itp.)
- ❌ **Brak trybu strict** - TypeScript nie skonfigurowany dla maksymalnego bezpieczeństwa
- ❌ **Brak aliasów ścieżek** - Długie względne ścieżki importów
- ❌ **Brak typów generycznych** - Funkcje API nie są właściwie typowane
- ❌ **Niewłaściwe użycie optional chaining** - Niektóre miejsca używają `?` niepotrzebnie

### Problemy obecnej implementacji
- Interfejs `Todo` w `TodoList.tsx` (linie 5-12) vs `TodoElement` w `TodoItem.tsx` (linie 3-11) i `commons.ts` (linie 1-7)
- Typ `Number` używany zamiast `number` (TodoList.tsx:10, Header.tsx:6, itp.)
- Typ `any` w blokach catch (Login.tsx:75, Register.tsx:54, itp.)
- Brak typów zwracanych w niektórych funkcjach
- Brak typów dla odpowiedzi API

## Proponowane rozwiązanie

### 1. Włącz tryb strict TypeScript
- Zaktualizuj `tsconfig.json` aby włączyć ścisłe sprawdzanie
- Napraw wszystkie wynikowe błędy typów
- Włącz dodatkowe flagi strict

### 2. Utwórz wspólne definicje typów
- Utwórz `frontend/src/types/index.ts` dla wspólnych typów
- Skonsoliduj zduplikowane definicje typów
- Eksportuj typy z jednego źródła

### 3. Napraw problemy typów
- Zastąp `Number` przez `number`
- Zastąp `any` właściwymi typami
- Dodaj brakujące adnotacje typów
- Utwórz typy odpowiedzi API

### 4. Dodaj aliasy ścieżek
- Skonfiguruj aliasy ścieżek w `tsconfig.json` i `vite.config.ts`
- Zaktualizuj importy aby używały aliasów
- Popraw czytelność importów

### 5. Typuj odpowiedzi API
- Utwórz typy dla wszystkich endpointów API
- Typuj funkcje klienta API
- Dodaj typy generyczne dla funkcji wielokrotnego użytku

## Zadania implementacyjne

### Konfiguracja TypeScript
- [ ] Włącz tryb strict w `tsconfig.json`
- [ ] Włącz dodatkowe flagi strict (`strictNullChecks`, `noImplicitAny`, itp.)
- [ ] Skonfiguruj aliasy ścieżek (`@/`, `@components/`, `@utils/`, itp.)
- [ ] Zaktualizuj `vite.config.ts` dla rozdzielczości aliasów ścieżek

### Konsolidacja typów
- [ ] Utwórz `frontend/src/types/index.ts`
- [ ] Skonsoliduj `Todo` i `TodoElement` w jeden typ
- [ ] Utwórz typ `Account` (zastąp `AccountData`)
- [ ] Utwórz typy odpowiedzi API
- [ ] Usuń zduplikowane definicje typów

### Napraw problemy typów
- [ ] Zastąp wszystkie `Number` przez `number`
- [ ] Zastąp `any` w blokach catch przez `unknown` lub specyficzne typy błędów
- [ ] Dodaj typy zwracane do wszystkich funkcji
- [ ] Napraw niespójności typów w komponentach
- [ ] Dodaj właściwe typy props do wszystkich komponentów

### Typy API
- [ ] Utwórz typy dla żądań/odpowiedzi API
- [ ] Typuj funkcje klienta API
- [ ] Utwórz generyczny typ opakowania odpowiedzi API
- [ ] Dodaj typy odpowiedzi błędów

### Aktualizacja importów
- [ ] Zaktualizuj wszystkie importy aby używały aliasów ścieżek
- [ ] Usuń względne ścieżki importów gdzie możliwe
- [ ] Zaktualizuj instrukcje importu aby używały nowych lokalizacji typów

### Testowanie
- [ ] Zweryfikuj kompilację TypeScript bez błędów
- [ ] Przetestuj sprawdzanie typów w IDE
- [ ] Zweryfikuj, że aliasy ścieżek działają poprawnie
- [ ] Przetestuj typy generyczne

## Korzyści
- ✅ Wyłapywanie błędów w czasie kompilacji
- ✅ Lepsze autouzupełnianie i IntelliSense w IDE
- ✅ Poprawiona dokumentacja kodu (typy jako dokumentacja)
- ✅ Łatwiejsze refaktoryzowanie
- ✅ Lepsza utrzymywalność kodu
- ✅ Zmniejszona liczba błędów czasu wykonania

## Szczegóły techniczne

### Konfiguracja trybu strict TypeScript
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### Konfiguracja aliasów ścieżek
```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"]
    }
  }
}
```

### Przykład skonsolidowanego typu
```typescript
// frontend/src/types/index.ts
export interface Todo {
  id: string;
  content: string;
  priority: number; // Zmienione z Number
  date: string;
  status: 'TODO' | 'COMPLETED';
  accountID: string;
}

export interface Account {
  id: string;
  name: string;
  email: string;
  password?: string; // Opcjonalne dla odpowiedzi
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}
```

### Przykład typu błędu
```typescript
// Zamiast: catch (err: any)
catch (err: unknown) {
  if (err instanceof Error) {
    // Obsłuż Error
  } else {
    // Obsłuż nieznany błąd
  }
}
```

## Powiązane pliki
- `frontend/tsconfig.json` - Wymaga trybu strict i aliasów ścieżek
- `frontend/vite.config.ts` - Wymaga rozdzielczości aliasów ścieżek
- `frontend/src/types/index.ts` - Nowy plik wspólnych typów (do utworzenia)
- `frontend/src/types/commons.ts` - Wymaga konsolidacji
- `frontend/src/components/TodoList.tsx` - Wymaga napraw typów
- `frontend/src/components/TodoItem.tsx` - Wymaga napraw typów
- `frontend/src/components/Header.tsx` - Wymaga napraw typów
- `frontend/src/pages/Login.tsx` - Wymaga napraw typów
- `frontend/src/pages/Register.tsx` - Wymaga napraw typów
- `frontend/src/hooks/useUserAccount.ts` - Wymaga napraw typów
