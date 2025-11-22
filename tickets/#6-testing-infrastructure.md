# Konfiguracja infrastruktury testowej

**Issue #:** #6  
**Status:** Open  
**Priority:** Medium  
**Type:** Enhancement / Quality Assurance  
**Created:** 2025-11-22

## Przegląd
Ustanowienie kompleksowej infrastruktury testowej obejmującej testy jednostkowe, testy integracyjne i testy E2E. To poprawi jakość kodu, wyłapie błędy wcześnie i zapewni pewność podczas refaktoryzacji.

## Obecne problemy

### Brak testowania
- ❌ **Brak testów jednostkowych** - Komponenty i narzędzia nie są testowane
- ❌ **Brak testów integracyjnych** - Integracja API nie jest testowana
- ❌ **Brak testów E2E** - Przepływy użytkownika nie są testowane
- ❌ **Brak pokrycia testami** - Nieznane pokrycie kodu testami
- ❌ **Skrypt testowy zastępczy** - `package.json` ma niefunkcjonalny skrypt testowy

### Luki w testowaniu
- ❌ **Brak frameworka testowego** - Brak Jest, Vitest lub innego frameworka testowego
- ❌ **Brak narzędzi testowych** - Brak konfiguracji React Testing Library
- ❌ **Brak konfiguracji mocków** - Nie można mockować wywołań API
- ❌ **Brak konfiguracji testów** - Brak plików konfiguracyjnych testów
- ❌ **Brak integracji CI/CD** - Testy nie są uruchamiane automatycznie

### Obecna implementacja
- `server/package.json` ma zastępczy: `"test": "echo \"Error: no test specified\" && exit 1"`
- Brak plików testowych w projekcie
- Brak zainstalowanych zależności testowych
- Brak konfiguracji testów

## Proponowane rozwiązanie

### 1. Konfiguracja testowania frontendu
- Zainstaluj Vitest (szybki, natywny dla Vite)
- Zainstaluj React Testing Library
- Zainstaluj @testing-library/jest-dom dla matcherów
- Zainstaluj MSW (Mock Service Worker) do mockowania API

### 2. Konfiguracja testowania backendu
- Zainstaluj Jest lub użyj Vitest dla Node.js
- Zainstaluj Supertest do testowania API
- Skonfiguruj bazę danych testową/dane mockowe

### 3. Testowanie E2E (Opcjonalne)
- Zainstaluj Playwright lub Cypress
- Skonfiguruj zestaw testów E2E
- Skonfiguruj środowisko testowe

### 4. Struktura testów
- Testy jednostkowe dla narzędzi i hooków
- Testy komponentów dla komponentów React
- Testy integracyjne dla wywołań API
- Testy E2E dla krytycznych przepływów użytkownika

## Zadania implementacyjne

### Konfiguracja testowania frontendu
- [ ] Zainstaluj Vitest i zależności testowe
- [ ] Skonfiguruj Vitest w `vite.config.ts`
- [ ] Zainstaluj React Testing Library
- [ ] Zainstaluj @testing-library/jest-dom
- [ ] Zainstaluj MSW do mockowania API
- [ ] Utwórz plik konfiguracyjny testów
- [ ] Skonfiguruj skrypty testowe w package.json

### Konfiguracja testowania backendu
- [ ] Zainstaluj Jest lub Vitest dla Node.js
- [ ] Zainstaluj Supertest do testowania API
- [ ] Utwórz konfigurację bazy danych testowej
- [ ] Skonfiguruj skrypty testowe
- [ ] Skonfiguruj zmienne środowiskowe testowe

### Narzędzia testowe
- [ ] Utwórz narzędzia i pomocniki testowe
- [ ] Skonfiguruj handlery MSW do mockowania API
- [ ] Utwórz niestandardową funkcję render z dostawcami
- [ ] Utwórz fabryki danych testowych

### Testy jednostkowe
- [ ] Napisz testy dla narzędzi `auth.ts`
- [ ] Napisz testy dla klienta API (gdy utworzony)
- [ ] Napisz testy dla niestandardowych hooków
- [ ] Napisz testy dla funkcji narzędziowych

### Testy komponentów
- [ ] Napisz testy dla komponentu Login
- [ ] Napisz testy dla komponentu Register
- [ ] Napisz testy dla komponentu TodoList
- [ ] Napisz testy dla komponentu TodoItem
- [ ] Napisz testy dla komponentu Header

### Testy integracyjne
- [ ] Napisz testy dla przepływu uwierzytelniania
- [ ] Napisz testy dla operacji CRUD todo
- [ ] Napisz testy dla obsługi błędów API
- [ ] Napisz testy dla chronionych tras

### Testy E2E (Opcjonalne)
- [ ] Zainstaluj Playwright lub Cypress
- [ ] Skonfiguruj środowisko testowe E2E
- [ ] Napisz test E2E dla przepływu logowania
- [ ] Napisz test E2E dla tworzenia todo
- [ ] Napisz test E2E dla ukończenia todo

### Integracja CI/CD
- [ ] Dodaj krok testowy do GitHub Actions (jeśli dotyczy)
- [ ] Skonfiguruj raportowanie pokrycia testami
- [ ] Ustaw progi pokrycia testami
- [ ] Dodaj odznakę testów do README

### Dokumentacja
- [ ] Udokumentuj podejście do testowania
- [ ] Dodaj wytyczne testowania do README
- [ ] Udokumentuj jak uruchamiać testy
- [ ] Dodaj przykłady wzorców testowych

## Korzyści
- ✅ Wyłapywanie błędów wcześnie w rozwoju
- ✅ Pewność podczas refaktoryzacji
- ✅ Dokumentacja poprzez testy
- ✅ Lepsza jakość kodu
- ✅ Zapobieganie regresjom
- ✅ Szybszy rozwój (testy wyłapują problemy)

## Szczegóły techniczne

### Konfiguracja Vitest
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

### Przykład testu - Komponent
```typescript
// frontend/src/components/__tests__/TodoItem.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import TodoItem from '../TodoItem';

describe('TodoItem', () => {
  const mockTodo = {
    id: '1',
    content: 'Test todo',
    priority: 1,
    date: '2025-01-01',
    status: 'TODO',
  };

  it('renders todo content', () => {
    render(
      <TodoItem
        {...mockTodo}
        onStatusChange={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  it('calls onStatusChange when checkbox clicked', () => {
    const onStatusChange = jest.fn();
    render(
      <TodoItem
        {...mockTodo}
        onStatusChange={onStatusChange}
        onDelete={jest.fn()}
      />
    );
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onStatusChange).toHaveBeenCalledTimes(1);
  });
});
```

### Przykład testu - Integracja API
```typescript
// frontend/src/utils/__tests__/api.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import api from '../api';

const server = setupServer(
  rest.get('http://localhost:3004/api/todos', (req, res, ctx) => {
    return res(ctx.json([{ id: '1', content: 'Test' }]));
  })
);

beforeEach(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe('API Client', () => {
  it('fetches todos successfully', async () => {
    const todos = await api.get('/api/todos');
    expect(todos).toHaveLength(1);
    expect(todos[0].content).toBe('Test');
  });
});
```

### Skrypty package.json
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test"
  }
}
```

## Powiązane pliki
- `frontend/vite.config.ts` - Wymaga konfiguracji Vitest
- `frontend/package.json` - Wymaga zależności testowych
- `frontend/src/test/setup.ts` - Nowy plik konfiguracyjny testów (do utworzenia)
- `frontend/src/test/mocks/` - Nowy katalog mocków (do utworzenia)
- `server/package.json` - Wymaga zależności testowych
- `server/__tests__/` - Nowy katalog testów (do utworzenia)
- `.github/workflows/test.yml` - Workflow CI/CD (opcjonalne)
