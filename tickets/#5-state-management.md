# Implementacja właściwego zarządzania stanem

**Issue #:** #5  
**Status:** Open  
**Priority:** Medium  
**Type:** Enhancement / Architecture  
**Created:** 2025-11-22

## Przegląd
Zaimplementowanie właściwego rozwiązania zarządzania stanem w celu wyeliminowania prop drilling, scentralizowania stanu aplikacji i poprawy komunikacji między komponentami. To sprawi, że kod będzie bardziej utrzymywalny i skalowalny.

## Obecne problemy

### Problemy zarządzania stanem
- ❌ **Brak scentralizowanego stanu** - Stan rozproszony w komponentach
- ❌ **Prop drilling** - Przekazywanie props przez wiele warstw komponentów
- ❌ **Zduplikowany stan** - Te same dane pobierane/przechowywane w wielu miejscach
- ❌ **Ręczna synchronizacja** - Komponenty ręcznie synchronizują stan
- ❌ **Brak globalnego stanu** - Stan auth, dane użytkownika nie są globalnie dostępne

### Problemy obecnej implementacji
- Stan uwierzytelniania zarządzany w `App.tsx` i narzędziach `auth.ts`
- Dane konta użytkownika pobierane w hooku `useUserAccount.ts` (zduplikowana logika)
- Stan todo zarządzany lokalnie w `TodoList.tsx`
- Brak wspólnego stanu między komponentami
- `location.reload()` używany do synchronizacji stanu (Header.tsx:76)

### Problemy synchronizacji stanu
- ❌ **Ręczne przeładowania strony** - `location.reload()` w Header.tsx do synchronizacji todo
- ❌ **Brak optymistycznych aktualizacji** - UI nie aktualizuje się natychmiast
- ❌ **Warunki wyścigu** - Wiele komponentów pobiera te same dane
- ❌ **Brak cache** - Dane pobierane niepotrzebnie ponownie

## Proponowane rozwiązanie

### Opcja 1: React Context API (Zalecane dla obecnej skali)
- Utwórz AuthContext dla stanu uwierzytelniania
- Utwórz UserContext dla danych konta użytkownika
- Utwórz TodoContext dla operacji todo
- Lekkie, bez dodatkowych zależności

### Opcja 2: Zustand (Jeśli potrzebny bardziej złożony stan)
- Lekka biblioteka zarządzania stanem
- Prosty API, dobre wsparcie TypeScript
- Lepsza wydajność niż Context API dla częstych aktualizacji

### Podejście implementacyjne
1. Utwórz dostawców kontekstu dla:
   - Uwierzytelniania (token, użytkownik, login/logout)
   - Danych konta użytkownika
   - Operacji todo (CRUD)
2. Zastąp prop drilling konsumpcją kontekstu
3. Zaimplementuj optymistyczne aktualizacje
4. Dodaj cache stanu aby zmniejszyć wywołania API

## Zadania implementacyjne

### Konfiguracja
- [ ] Zdecyduj o rozwiązaniu zarządzania stanem (Context API lub Zustand)
- [ ] Zainstaluj Zustand jeśli wybrane (opcjonalne)
- [ ] Utwórz strukturę kontekstu/store

### Stan uwierzytelniania
- [ ] Utwórz `AuthContext` lub store auth
- [ ] Przenieś logikę uwierzytelniania do kontekstu/store
- [ ] Udostępnij stan auth globalnie
- [ ] Zaktualizuj komponenty aby używały kontekstu auth

### Stan konta użytkownika
- [ ] Utwórz `UserContext` lub store użytkownika
- [ ] Przenieś pobieranie konta użytkownika do kontekstu/store
- [ ] Cache danych konta użytkownika
- [ ] Zaktualizuj `useUserAccount` aby używał kontekstu/store

### Stan Todo
- [ ] Utwórz `TodoContext` lub store todo
- [ ] Przenieś operacje CRUD todo do kontekstu/store
- [ ] Zaimplementuj optymistyczne aktualizacje
- [ ] Dodaj cache todo
- [ ] Zaktualizuj `TodoList` aby używał kontekstu/store

### Aktualizacja komponentów
- [ ] Usuń prop drilling z App.tsx
- [ ] Zaktualizuj Header aby używał kontekstu todo (usuń location.reload)
- [ ] Zaktualizuj TodoList aby używał kontekstu todo
- [ ] Zaktualizuj Login/Register aby aktualizowały kontekst auth
- [ ] Usuń zduplikowane zarządzanie stanem

### Optymistyczne aktualizacje
- [ ] Zaimplementuj optymistyczne tworzenie todo
- [ ] Zaimplementuj optymistyczne aktualizacje todo
- [ ] Zaimplementuj optymistyczne usuwanie todo
- [ ] Dodaj wycofanie przy błędzie

### Testowanie
- [ ] Przetestuj aktualizacje stanu w komponentach
- [ ] Przetestuj optymistyczne aktualizacje
- [ ] Przetestuj trwałość stanu
- [ ] Przetestuj aktualizacje kontekstu/dostawcy

## Korzyści
- ✅ Eliminuje prop drilling
- ✅ Scentralizowane zarządzanie stanem
- ✅ Lepsza komunikacja między komponentami
- ✅ Optymistyczne aktualizacje dla lepszego UX
- ✅ Zmniejszone wywołania API (cache)
- ✅ Łatwiejsze testowanie i utrzymanie
- ✅ Lepsza wydajność (brak niepotrzebnych re-renderów)

## Szczegóły techniczne

### Przykład Context API
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
  
  // Implementacja...
  
  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Przykład Zustand (Alternatywa)
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

### Przykład optymistycznej aktualizacji
```typescript
// W TodoContext
const addTodo = async (todo: CreateTodoDto) => {
  // Optymistyczna aktualizacja
  setTodos(prev => [...prev, { ...todo, id: 'temp-' + Date.now() }]);
  
  try {
    const created = await api.post('/api/todos', todo);
    // Zastąp tymczasowe prawdziwym todo
    setTodos(prev => prev.map(t => t.id.startsWith('temp-') ? created : t));
  } catch (error) {
    // Wycofaj przy błędzie
    setTodos(prev => prev.filter(t => !t.id.startsWith('temp-')));
    throw error;
  }
};
```

## Powiązane pliki
- `frontend/src/contexts/AuthContext.tsx` - Nowy kontekst auth (do utworzenia)
- `frontend/src/contexts/UserContext.tsx` - Nowy kontekst użytkownika (do utworzenia)
- `frontend/src/contexts/TodoContext.tsx` - Nowy kontekst todo (do utworzenia)
- `frontend/src/App.tsx` - Wymaga dostawców kontekstu
- `frontend/src/components/Header.tsx` - Wymaga użycia kontekstu (usuń reload)
- `frontend/src/components/TodoList.tsx` - Wymaga użycia kontekstu
- `frontend/src/pages/Login.tsx` - Wymaga użycia kontekstu
- `frontend/src/pages/Register.tsx` - Wymaga użycia kontekstu
- `frontend/src/hooks/useUserAccount.ts` - Może zostać zastąpiony kontekstem
- `frontend/package.json` - Może wymagać zależności Zustand
