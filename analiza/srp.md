# Analiza Naruszenia Zasady SRP (Single Responsibility Principle)

## Podsumowanie
Aplikacja frontend zawiera kilka znaczących naruszeń zasady Single Responsibility Principle, gdzie pojedyncze komponenty i moduły odpowiadają za zbyt wiele zadań, co utrudnia maintenance, testowanie i rozwój aplikacji.

## 🔴 Krytyczne Naruszenia SRP

### 1. Header Component - Nadmierne Obowiązki
**Plik:** `Header.tsx` (143 linie)

**Identyfikowane Odpowiedzialności:**
1. **Wyświetlanie informacji użytkownika** (linie 78-82)
2. **Obsługa wylogowania** (linie 69-72)
3. **Formularz tworzenia TODO** (linie 84-91)
4. **Selektor priorytetów** (linie 93-128)
5. **Walidacja formularza** (linie 47-51)
6. **Komunikacja z API** (linie 52-66)
7. **Zarządzanie stanem formularza** (linie 13-43)

**Problemy:**
```typescript
// Header.tsx - zbyt wiele odpowiedzialności w jednym komponencie
const Header: React.FC = () => {
    // Stan formularza TODO
    const [formData, setFormData] = useState<FormData>({...})
    
    // Logika priorytetów
    const changePriority = (priority: Number) => {...}
    
    // Obsługa API
    const handleSubmit = async (e: FormEvent): Promise<void> => {...}
    
    // Logika uwierzytelniania
    const handleLogout = () => {...}
    
    // Renderowanie UI dla wszystkich funkcji
    return (
        <header>
            {/* User info */}
            {/* Todo form */}
            {/* Priority selector */}
        </header>
    )
}
```

**Zalecany podział:**
- `UserProfile` - informacje i wylogowanie użytkownika
- `TodoForm` - formularz tworzenia TODO
- `PrioritySelector` - wybór priorytetu
- `Header` - tylko layout i kompozycja

### 2. Rozproszenie Logiki Uwierzytelniania
**Problem:** Odpowiedzialności związane z uwierzytelnianiem rozproszone w wielu modułach

**Lokalizacje:**
- `App.tsx` - ochrona tras (linie 25-30)
- `Login.tsx` - logowanie + zarządzanie sesją (linie 50-80)
- `Header.tsx` - wylogowanie (linie 69-72)
- `useUserAccount.ts` - pobieranie danych użytkownika (linie 11-35)

**Problem SRP:**
```typescript
// App.tsx - mieszanie routingu z logiką uwierzytelniania
const ProtectedRoute = ({ children }: { children: ReactElement }) => {
    if(localStorage.getItem("isLoggedIn") === "true" || sessionStorage.getItem("isLoggedIn") === "true"){
        return children
    } else{
        return <Navigate to="/login/" />
    }
};

// Login.tsx - logowanie + zarządzanie storage + nawigacja
const handleLogin = async () => {
    // Fetch accounts
    // Validate credentials  
    // Set storage
    // Navigate
    // Handle errors
}
```

### 3. TodoList Component - Mieszane Odpowiedzialności
**Plik:** `TodoList.tsx`

**Identyfikowane Odpowiedzialności:**
1. **Pobieranie danych z API** (linie 25-39)
2. **Filtrowanie według użytkownika** (linia 33)
3. **Filtrowanie według statusu** (linie 34-35)
4. **Zarządzanie stanami loading/error** (linie 18-20)
5. **Renderowanie list** (linie 46-65)

**Problem:**
```typescript
const TodoList: React.FC = () => {
    // Data fetching
    const fetchTodos = async () => {
        // API call
        // User filtering
        // Status filtering
        // Error handling
    }
    
    // Rendering logic
    return (
        <div>
            {/* Loading state */}
            {/* Todo items */}
            {/* Completed items */}
        </div>
    )
}
```

### 4. Login/Register - Nadmierne Odpowiedzialności
**Pliki:** `Login.tsx`, `Register.tsx`

**Login.tsx odpowiedzialności:**
1. **Zarządzanie stanem formularza** (linie 20-49)
2. **Walidacja danych logowania** (linie 50-80)
3. **Zarządzanie sesją/localStorage** (linie 67-74)
4. **Nawigacja** (linie 76)
5. **Renderowanie UI** (linie 84-130)

**Register.tsx podobne problemy:**
1. **Walidacja hasła** (linie 64-67)
2. **Sprawdzanie unikalności** (linie 69-76)
3. **Tworzenie konta** (linie 84-103)
4. **Zarządzanie stanem** (linie 20-40)

## 🟡 Średnie Naruszenia SRP

### 5. useUserAccount Hook - Mieszane Zadania
**Plik:** `useUserAccount.ts`

**Problem:**
- Pobieranie listy wszystkich kont (niepotrzebne)
- Filtrowanie użytkownika
- Zarządzanie stanem

### 6. Todo Components - API + UI
**Pliki:** `TodoListElement.tsx`, `TodoListElementCompleted.tsx`

**Problem:**
- Komponenty UI zawierają logikę API
- Mieszanie prezentacji z logiką biznesową

## 📊 Mapa Odpowiedzialności

| Komponent | Liczba Odpowiedzialności | Ocena SRP |
|-----------|-------------------------|-----------|
| Header | 7 | 🔴 Bardzo źle |
| Login | 5 | 🔴 Źle |
| Register | 4 | 🟡 Średnio |
| TodoList | 5 | 🟡 Średnio |
| App | 3 | 🟡 Średnio |
| TodoListElement | 2 | 🟢 Dobrze |

## 💡 Rekomendacje Refaktoryzacji

### Priorytet Wysoki

#### 1. Podział Header Component
```typescript
// components/UserProfile.tsx
const UserProfile = () => {
    const userAccount = useUserAccount();
    const { logout } = useAuth();
    // Tylko logika związana z profilem użytkownika
}

// components/TodoForm.tsx  
const TodoForm = () => {
    const { createTodo } = useTodos();
    // Tylko formularz tworzenia TODO
}

// components/PrioritySelector.tsx
const PrioritySelector = ({ value, onChange }) => {
    // Tylko selektor priorytetu
}
```

#### 2. Centralizacja Uwierzytelniania
```typescript
// hooks/useAuth.ts
export const useAuth = () => {
    const login = (credentials) => { /* */ };
    const logout = () => { /* */ };
    const isAuthenticated = () => { /* */ };
    const getUser = () => { /* */ };
    
    return { login, logout, isAuthenticated, getUser };
}

// components/ProtectedRoute.tsx
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated() ? children : <Navigate to="/login" />;
}
```

#### 3. Separacja Data Layer
```typescript
// services/todoService.ts
export const todoService = {
    fetchTodos: () => { /* */ },
    createTodo: (todo) => { /* */ },
    updateTodo: (id, updates) => { /* */ },
    deleteTodo: (id) => { /* */ }
};

// hooks/useTodos.ts
export const useTodos = () => {
    // Tylko logika stanu TODO
    const { data, loading, error } = useQuery(todoService.fetchTodos);
    return { todos, loading, error, createTodo, updateTodo, deleteTodo };
}
```

### Priorytet Średni

#### 4. Generyczne Komponenty Form
```typescript
// components/forms/FormField.tsx
const FormField = ({ label, type, name, value, onChange, error }) => {
    // Tylko renderowanie pola formularza
}

// hooks/useForm.ts
export const useForm = (initialState, validationSchema) => {
    // Tylko logika formularza
}
```

#### 5. Separacja Walidacji
```typescript
// utils/validation.ts
export const validators = {
    email: (email) => { /* */ },
    password: (password) => { /* */ },
    required: (value) => { /* */ }
};
```

## 🎯 Oczekiwane Korzyści

### Po Refaktoryzacji:
1. **Testowanie** - każdy komponent będzie łatwiejszy do przetestowania
2. **Reużywalność** - komponenty będą mogły być użyte w innych kontekstach  
3. **Maintenance** - zmiany będą wpływały na mniejsze obszary kodu
4. **Czytelność** - każdy plik będzie miał jasno określony cel
5. **Debugging** - łatwiejsze lokalizowanie problemów

### Przykład Przed/Po:

**Przed:**
```typescript
// Header.tsx - 143 linie, 7 odpowiedzialności
const Header = () => {
    // Wszystko w jednym komponencie
}
```

**Po:**
```typescript
// Header.tsx - 20 linii, 1 odpowiedzialność (kompozycja)
const Header = () => (
    <header>
        <UserProfile />
        <TodoForm />
    </header>
);

// UserProfile.tsx - 30 linii, 1 odpowiedzialność
// TodoForm.tsx - 50 linii, 1 odpowiedzialność  
// PrioritySelector.tsx - 40 linii, 1 odpowiedzialność
```

## Podsumowanie
Naruszenia SRP w aplikacji prowadzą do trudności w maintenance i testowaniu. Refaktoryzacja według powyższych rekomendacji zwiększy modularność i quality kodu. 