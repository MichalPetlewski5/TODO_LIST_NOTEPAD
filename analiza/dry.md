# Analiza Naruszenia Zasady DRY (Don't Repeat Yourself)

## Podsumowanie
Aplikacja frontend zawiera znaczące naruszenia zasady DRY, co prowadzi do duplikacji kodu w wielu obszarach. Główne problemy dotyczą komponentów Todo, logiki uwierzytelniania, obsługi formularzy i definicji interfejsów.

## 🔴 Krytyczne Naruszenia DRY

### 1. Duplikacja Komponentów Todo
**Pliki:** `TodoListElement.tsx` i `TodoListElementCompleted.tsx`

**Problem:**
- 80%+ zduplikowanego kodu między komponentami
- Identyczne interfejsy TypeScript
- Podobna struktura JSX
- Duplikacja logiki zmiany statusu

**Kod zduplikowany:**
```typescript
// Identyczny interfejs w obu plikach (linie 3-8)
interface TodoElement {
    id: string,
    content: string,
    priority: Number,
    date: string,
    status: string
}

// Podobna logika zmiany statusu
const changeStatus = async (e: FormEvent): Promise<void> => {
    // Niemal identyczna implementacja
}
```

**Wpływ:**
- Trudność w utrzymaniu kodu
- Ryzyko niespójności przy modyfikacjach
- Zwiększony rozmiar aplikacji

### 2. Duplikacja Logiki Uwierzytelniania
**Pliki:** `App.tsx`, `Login.tsx`, `Register.tsx`

**Problem:**
- Sprawdzanie stanu uwierzytelnienia powtórzone w 3 miejscach
- Identyczna logika dostępu do localStorage/sessionStorage

**Przykłady duplikacji:**
```typescript
// App.tsx (linie 15-17)
const local = localStorage.getItem("isLoggedIn")
const session = sessionStorage.getItem("isLoggedIn")
setIsAuthenticated(local === "true" || session === "true")

// App.tsx w ProtectedRoute (linie 25-27)
if(localStorage.getItem("isLoggedIn") === "true" || sessionStorage.getItem("isLoggedIn") === "true")

// Login.tsx (linie 67-74)
if(LoginForm.isRemember){
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("accID", findAccount.id)
    sessionStorage.removeItem("isLoggedIn")
} else{
    sessionStorage.setItem("isLoggedIn", "true")
    sessionStorage.setItem("accID", findAccount.id)
    localStorage.removeItem("isLoggedIn")
}
```

### 3. Duplikacja Obsługi Formularzy
**Pliki:** `Header.tsx`, `Login.tsx`, `Register.tsx`

**Problem:**
- Identyczne funkcje `handleValueChange`/`changeValues`
- Powtarzający się wzorzec aktualizacji stanu formularza

**Zduplikowany kod:**
```typescript
// Header.tsx (linie 24-30)
const handleValueChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const {name, value} = e.target
    setFormData({
        ...formData,
        [name]: value
    })
}

// Login.tsx (linie 44-49) - identyczna implementacja
const changeValues = (e:ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const {name, value} = e.target
    setLoginForm({
        ...LoginForm,
        [name]: value
    })
}
```

### 4. Duplikacja URL-i API
**Problem:** `http://localhost:3004` na twardo wpisane w 7 plikach

**Lokalizacje:**
- `Header.tsx` (linia 56)
- `TodoList.tsx` (linia 28)
- `TodoListElement.tsx` (linia 32)
- `TodoListElementCompleted.tsx` (linia 33, 53)
- `Login.tsx` (linia 50)
- `Register.tsx` (linia 51, 92)
- `useUserAccount.ts` (linia 18)

### 5. Duplikacja Definicji Interfejsów
**Problem:** Identyczne interfejsy zdefiniowane wielokrotnie

**TodoElement** interfejs w:
- `TodoListElement.tsx` (linie 3-8)
- `TodoListElementCompleted.tsx` (linie 3-8)
- `commons.ts` (linie 1-7)

**AccountData** interfejs w:
- `Login.tsx` (linie 11-16)
- `Register.tsx` (linie 9-14)
- `useUserAccount.ts` (linie 4-8)

## 🟡 Średnie Naruszenia DRY

### 6. Duplikacja Logiki Priorytetów
**Pliki:** `Header.tsx`, `TodoListElement.tsx`

**Problem:**
- Powtarzające się mapowanie numerów priorytetów na kolory i tekst
- Brak centralnej definicji priorytetów

### 7. Duplikacja Stylów Inline
**Problem:**
- Powtarzające się klasy Tailwind CSS
- Brak komponentów stylowanych wielokrotnego użytku

## 📊 Statystyki Duplikacji

| Kategoria | Liczba duplikacji | Szacowany wpływ |
|-----------|-------------------|-----------------|
| Komponenty Todo | 2 pliki, ~120 linii | Wysoki |
| Logika uwierzytelniania | 3 pliki, ~30 linii | Wysoki |
| Obsługa formularzy | 3 pliki, ~18 linii | Średni |
| URL-e API | 7 plików | Średni |
| Interfejsy TypeScript | 6 definicji | Średni |

## 💡 Rekomendacje Naprawy

### Priorytet Wysoki
1. **Skonsoliduj komponenty Todo** - Utwórz jeden `TodoItem` z renderowaniem warunkowym
2. **Centralizuj logikę uwierzytelniania** - Custom hook `useAuth`
3. **Utwórz plik konfiguracyjny** - `config/api.ts` dla URL-i
4. **Zunifikuj definicje typów** - Używaj tylko `commons.ts`

### Priorytet Średni
5. **Stwórz hook dla formularzy** - `useForm` hook dla obsługi formularzy
6. **Centralizuj definicje priorytetów** - `constants/priorities.ts`
7. **Komponenty stylowane** - Wielokrotnego użytku dla przycisków, inputów

### Przykład refaktoryzacji:
```typescript
// config/api.ts
export const API_BASE_URL = 'http://localhost:3004';

// hooks/useForm.ts
export const useForm = <T>(initialState: T) => {
  const [formData, setFormData] = useState<T>(initialState);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  return { formData, handleChange, setFormData };
};
```

## Podsumowanie
Wyeliminowanie opisanych duplikacji może zmniejszyć rozmiar kodu o 30-40% i znacząco poprawić jego maintainability. 