# Konfiguracja lintingu i formatowania kodu

**Issue #:** #7  
**Status:** Open  
**Priority:** Low  
**Type:** Enhancement / Code Quality  
**Created:** 2025-11-22

## Przegląd
Skonfigurowanie kompleksowych narzędzi lintingu i formatowania kodu w celu egzekwowania jakości kodu, spójności i wyłapywania potencjalnych błędów. To poprawi utrzymywalność kodu i doświadczenie dewelopera.

## Obecne problemy

### Konfiguracja lintingu
- ❌ **Podstawowa konfiguracja ESLint** - Może wymagać surowszych reguł
- ❌ **Brak Prettier** - Brak automatycznego formatowania kodu
- ❌ **Niespójny styl kodu** - Ręczne formatowanie prowadzi do niespójności
- ❌ **Brak hooków pre-commit** - Kod może być commitowany bez lintingu
- ❌ **Brak formatowania przy zapisie** - Deweloperzy muszą ręcznie formatować

### Problemy jakości kodu
- ❌ **Niespójności stylu kodu** - Mieszane style cudzysłowów, odstępy, itp.
- ❌ **Nieużywane zmienne** - Brak lintingu do wyłapywania nieużywanego kodu
- ❌ **Organizacja importów** - Importy nie są sortowane spójnie
- ❌ **Brak lintingu dostępności** - Brak sprawdzeń a11y
- ❌ **Brak reguł kolejności importów** - Importy nie są zorganizowane

### Obecna implementacja
- Konfiguracja ESLint istnieje (`frontend/eslint.config.js`)
- Brak konfiguracji Prettier
- Brak Husky dla hooków git
- Brak lint-staged dla sprawdzeń pre-commit
- Brak skryptów formatowania w package.json

## Proponowane rozwiązanie

### 1. Rozszerz konfigurację ESLint
- Dodaj surowsze reguły
- Dodaj plugin dostępności (eslint-plugin-jsx-a11y)
- Dodaj reguły sortowania importów
- Dodaj reguły najlepszych praktyk React

### 2. Dodaj Prettier
- Zainstaluj Prettier
- Skonfiguruj reguły Prettier
- Zintegruj z ESLint
- Dodaj skrypty formatowania

### 3. Skonfiguruj hooki Git
- Zainstaluj Husky
- Zainstaluj lint-staged
- Skonfiguruj hook pre-commit
- Skonfiguruj hook pre-push (opcjonalne)

### 4. Konfiguracja edytora
- Dodaj .editorconfig
- Dodaj ustawienia VS Code (jeśli dotyczy)
- Skonfiguruj formatowanie przy zapisie

## Zadania implementacyjne

### Rozszerzenie ESLint
- [ ] Przejrzyj i rozszerz reguły ESLint
- [ ] Zainstaluj eslint-plugin-jsx-a11y dla dostępności
- [ ] Zainstaluj eslint-plugin-import dla reguł importów
- [ ] Skonfiguruj sortowanie importów
- [ ] Dodaj niestandardowe reguły jeśli potrzeba
- [ ] Napraw istniejące błędy lintingu

### Konfiguracja Prettier
- [ ] Zainstaluj Prettier
- [ ] Utwórz plik konfiguracyjny `.prettierrc`
- [ ] Utwórz plik `.prettierignore`
- [ ] Zainstaluj eslint-config-prettier aby uniknąć konfliktów
- [ ] Skonfiguruj Prettier z ESLint

### Hooki Git
- [ ] Zainstaluj Husky
- [ ] Zainstaluj lint-staged
- [ ] Skonfiguruj hook pre-commit (lint + format)
- [ ] Skonfiguruj hook pre-push (uruchom testy, opcjonalne)
- [ ] Przetestuj hooki git

### Skrypty package.json
- [ ] Dodaj skrypt `lint`
- [ ] Dodaj skrypt `lint:fix`
- [ ] Dodaj skrypt `format`
- [ ] Dodaj skrypt `format:check`
- [ ] Zaktualizuj istniejące skrypty jeśli potrzeba

### Konfiguracja edytora
- [ ] Utwórz plik `.editorconfig`
- [ ] Dodaj ustawienia VS Code (`.vscode/settings.json`)
- [ ] Skonfiguruj formatowanie przy zapisie
- [ ] Dodaj zalecane rozszerzenia

### Dokumentacja
- [ ] Udokumentuj reguły lintingu
- [ ] Dodaj wytyczne lintingu do README
- [ ] Udokumentuj jak naprawić typowe błędy lintingu
- [ ] Dodaj wytyczne dotyczące wkładu

### Napraw istniejące problemy
- [ ] Uruchom linter na całym kodzie
- [ ] Napraw wszystkie błędy lintingu
- [ ] Sformatuj wszystkie pliki z Prettier
- [ ] Zweryfikuj brak nowych problemów

## Korzyści
- ✅ Spójny styl kodu w całym projekcie
- ✅ Wyłapywanie błędów i błędów wcześnie
- ✅ Lepsza czytelność kodu
- ✅ Poprawiona dostępność
- ✅ Łatwiejsze przeglądy kodu
- ✅ Lepsze doświadczenie dewelopera
- ✅ Automatyczne sprawdzanie jakości kodu

## Szczegóły techniczne

### Konfiguracja Prettier
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### Rozszerzenie konfiguracji ESLint
```javascript
// eslint.config.js
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off', // Używamy TypeScript
    },
  },
  prettier,
];
```

### Konfiguracja Husky
```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

### Skrypty package.json
```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,json,css}\"",
    "prepare": "husky install"
  }
}
```

### EditorConfig
```ini
# .editorconfig
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

### Ustawienia VS Code
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Powiązane pliki
- `frontend/eslint.config.js` - Wymaga rozszerzenia
- `frontend/.prettierrc` - Nowa konfiguracja Prettier (do utworzenia)
- `frontend/.prettierignore` - Nowy plik ignorowania Prettier (do utworzenia)
- `frontend/.editorconfig` - Nowy EditorConfig (do utworzenia)
- `frontend/.vscode/settings.json` - Nowe ustawienia VS Code (do utworzenia)
- `frontend/package.json` - Wymaga nowych skryptów i zależności
- `.husky/pre-commit` - Nowy hook git (do utworzenia)
