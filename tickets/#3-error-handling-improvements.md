# Poprawa obsługi błędów i informacji zwrotnej dla użytkownika

**Issue #:** #3  
**Status:** Open  
**Priority:** High  
**Type:** Enhancement / UX  
**Created:** 2025-11-22

## Przegląd
Zastąpienie prymitywnej obsługi błędów (alerty, console.logs) właściwym systemem obsługi błędów obejmującym error boundaries, powiadomienia toast i spójne komunikaty błędów. To znacznie poprawi doświadczenie użytkownika i ułatwi debugowanie.

## Obecne problemy

### Słabe doświadczenie użytkownika
- ❌ **Używanie `alert()` dla błędów** - Blokuje UI, słabe UX (Login.tsx:72, Register.tsx:70, Header.tsx:74)
- ❌ **Brak informacji zwrotnej o sukcesie** - Użytkownicy nie wiedzą kiedy operacje się powiodły
- ❌ **Niespójne komunikaty błędów** - Różne formaty błędów w różnych komponentach
- ❌ **Brak odzyskiwania po błędach** - Użytkownicy nie mogą ponowić nieudanych operacji
- ❌ **Ciche niepowodzenia** - Niektóre błędy tylko logowane do konsoli

### Brakująca obsługa błędów
- ❌ **Brak React Error Boundary** - Nieobsłużone błędy powodują crash całej aplikacji
- ❌ **Brak globalnego obsługiwacza błędów** - Nie można przechwytywać i obsługiwać błędów centralnie
- ❌ **Brak obsługi błędów sieciowych** - Brak obsługi scenariuszy offline
- ❌ **Brak wyświetlania błędów walidacji** - Błędy formularzy nie pokazywane użytkownikom
- ❌ **Brak błędów stanu ładowania** - Błędy podczas ładowania nie obsługiwane

### Obecna implementacja
- `alert()` używany w:
  - `Login.tsx` linia 72: "Invalid credentails."
  - `Register.tsx` linie 70, 78, 82, 87, 116: Różne komunikaty walidacji/błędów
  - `Header.tsx` linia 54, 74: "TODO CANT BE EMPTY!!", alerty błędów
- `console.log()` / `console.error()` do logowania błędów
- Brak error boundaries
- Brak systemu powiadomień toast

## Proponowane rozwiązanie

### 1. Zainstaluj bibliotekę powiadomień Toast
- Dodaj `react-hot-toast` lub `sonner` dla powiadomień toast
- Zapewnia nieblokujące, dostępne komunikaty błędów/sukcesu

### 2. Utwórz komponent Error Boundary
- React Error Boundary do przechwytywania błędów komponentów
- UI zapasowe dla stanów błędów
- Integracja raportowania/logowania błędów

### 3. Utwórz narzędzia obsługi błędów
- Standaryzowane formatowanie komunikatów błędów
- Klasyfikacja typów błędów (sieć, walidacja, serwer, itp.)
- Mechanizmy odzyskiwania po błędach

### 4. Aktualizacja komponentów
- Zastąp wszystkie wywołania `alert()` powiadomieniami toast
- Dodaj właściwe stany błędów do komponentów
- Zaimplementuj mechanizmy ponawiania dla nieudanych operacji
- Dodaj stany ładowania z obsługą błędów

### 5. Informacja zwrotna walidacji formularzy
- Błędy walidacji inline
- Informacja zwrotna w czasie rzeczywistym
- Dostępne komunikaty błędów

## Zadania implementacyjne

### Konfiguracja
- [ ] Zainstaluj bibliotekę powiadomień toast (`react-hot-toast` lub `sonner`)
- [ ] Utwórz `frontend/src/components/ErrorBoundary.tsx`
- [ ] Utwórz `frontend/src/utils/errorHandler.ts`
- [ ] Utwórz typy i stałe błędów

### Error Boundary
- [ ] Zaimplementuj komponent Error Boundary
- [ ] Dodaj UI zapasowe
- [ ] Zintegruj logowanie błędów
- [ ] Opakuj komponent App w Error Boundary

### Powiadomienia Toast
- [ ] Skonfiguruj dostawcę toast w App.tsx
- [ ] Utwórz funkcje narzędziowe toast
- [ ] Zdefiniuj szablony komunikatów toast
- [ ] Dodaj warianty success/error/info/warning

### Aktualizacja komponentów
- [ ] Zastąp alerty w `Login.tsx` toastami
- [ ] Zastąp alerty w `Register.tsx` toastami
- [ ] Zastąp alerty w `Header.tsx` toastami
- [ ] Dodaj stany błędów do `TodoList.tsx`
- [ ] Dodaj obsługę błędów do `useUserAccount.ts`
- [ ] Dodaj informację zwrotną walidacji formularzy

### Narzędzia obsługi błędów
- [ ] Utwórz system klasyfikacji błędów
- [ ] Zaimplementuj formatowanie komunikatów błędów
- [ ] Dodaj pomocniki odzyskiwania po błędach
- [ ] Utwórz obsługiwacz błędów sieciowych

### Testowanie
- [ ] Przetestuj error boundary z błędami komponentów
- [ ] Przetestuj powiadomienia toast
- [ ] Przetestuj przepływy odzyskiwania po błędach
- [ ] Przetestuj obsługę błędów sieciowych
- [ ] Przetestuj błędy walidacji formularzy

## Korzyści
- ✅ Lepsze doświadczenie użytkownika (nieblokujące powiadomienia)
- ✅ Spójne komunikaty błędów
- ✅ Stabilność aplikacji (error boundaries)
- ✅ Lepsze debugowanie (strukturalne logowanie błędów)
- ✅ Poprawiona dostępność
- ✅ Profesjonalny wygląd

## Szczegóły techniczne

### Przykład powiadomienia Toast
```typescript
import toast from 'react-hot-toast';

// Sukces
toast.success('Todo utworzone pomyślnie!');

// Błąd
toast.error('Nie udało się utworzyć todo. Spróbuj ponownie.');

// Ładowanie
const toastId = toast.loading('Tworzenie todo...');
toast.success('Todo utworzone!', { id: toastId });
```

### Struktura Error Boundary
```typescript
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    // Zaloguj błąd do serwisu raportowania błędów
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### Typy błędów
```typescript
enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN'
}
```

## Powiązane pliki
- `frontend/src/components/ErrorBoundary.tsx` - Nowy error boundary (do utworzenia)
- `frontend/src/utils/errorHandler.ts` - Narzędzia błędów (do utworzenia)
- `frontend/src/pages/Login.tsx` - Wymaga aktualizacji obsługi błędów
- `frontend/src/pages/Register.tsx` - Wymaga aktualizacji obsługi błędów
- `frontend/src/components/Header.tsx` - Wymaga aktualizacji obsługi błędów
- `frontend/src/components/TodoList.tsx` - Wymaga aktualizacji obsługi błędów
- `frontend/src/App.tsx` - Wymaga opakowania Error Boundary
- `frontend/package.json` - Wymaga zależności biblioteki toast
