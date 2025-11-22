# Configure Linting and Code Formatting

**Issue #:** #7  
**Status:** Open  
**Priority:** Low  
**Type:** Enhancement / Code Quality  
**Created:** 2025-11-22

## Overview
Set up comprehensive linting and code formatting tools to enforce code quality, consistency, and catch potential bugs. This will improve code maintainability and developer experience.

## Current Issues

### Linting Configuration
- ❌ **Basic ESLint setup** - May need stricter rules
- ❌ **No Prettier** - No automatic code formatting
- ❌ **Inconsistent code style** - Manual formatting leads to inconsistencies
- ❌ **No pre-commit hooks** - Code can be committed without linting
- ❌ **No format on save** - Developers must manually format

### Code Quality Issues
- ❌ **Code style inconsistencies** - Mixed quote styles, spacing, etc.
- ❌ **Unused variables** - No linting to catch unused code
- ❌ **Import organization** - Imports not sorted consistently
- ❌ **No accessibility linting** - Missing a11y checks
- ❌ **No import order rules** - Imports not organized

### Current Implementation
- ESLint config exists (`frontend/eslint.config.js`)
- No Prettier configuration
- No Husky for git hooks
- No lint-staged for pre-commit checks
- No format scripts in package.json

## Proposed Solution

### 1. Enhance ESLint Configuration
- Add stricter rules
- Add accessibility plugin (eslint-plugin-jsx-a11y)
- Add import sorting rules
- Add React best practices rules

### 2. Add Prettier
- Install Prettier
- Configure Prettier rules
- Integrate with ESLint
- Add format scripts

### 3. Set Up Git Hooks
- Install Husky
- Install lint-staged
- Configure pre-commit hook
- Configure pre-push hook (optional)

### 4. Editor Configuration
- Add .editorconfig
- Add VS Code settings (if applicable)
- Configure format on save

## Implementation Tasks

### ESLint Enhancement
- [ ] Review and enhance ESLint rules
- [ ] Install eslint-plugin-jsx-a11y for accessibility
- [ ] Install eslint-plugin-import for import rules
- [ ] Configure import sorting
- [ ] Add custom rules if needed
- [ ] Fix existing linting errors

### Prettier Setup
- [ ] Install Prettier
- [ ] Create `.prettierrc` configuration file
- [ ] Create `.prettierignore` file
- [ ] Install eslint-config-prettier to avoid conflicts
- [ ] Configure Prettier with ESLint

### Git Hooks
- [ ] Install Husky
- [ ] Install lint-staged
- [ ] Configure pre-commit hook (lint + format)
- [ ] Configure pre-push hook (run tests, optional)
- [ ] Test git hooks

### Package.json Scripts
- [ ] Add `lint` script
- [ ] Add `lint:fix` script
- [ ] Add `format` script
- [ ] Add `format:check` script
- [ ] Update existing scripts if needed

### Editor Configuration
- [ ] Create `.editorconfig` file
- [ ] Add VS Code settings (`.vscode/settings.json`)
- [ ] Configure format on save
- [ ] Add recommended extensions

### Documentation
- [ ] Document linting rules
- [ ] Add linting guidelines to README
- [ ] Document how to fix common linting errors
- [ ] Add contribution guidelines

### Fix Existing Issues
- [ ] Run linter on entire codebase
- [ ] Fix all linting errors
- [ ] Format all files with Prettier
- [ ] Verify no new issues

## Benefits
- ✅ Consistent code style across project
- ✅ Catch bugs and errors early
- ✅ Better code readability
- ✅ Improved accessibility
- ✅ Easier code reviews
- ✅ Better developer experience
- ✅ Automated code quality checks

## Technical Details

### Prettier Configuration
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

### ESLint Configuration Enhancement
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
      'react/prop-types': 'off', // Using TypeScript
    },
  },
  prettier,
];
```

### Husky Configuration
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

### Package.json Scripts
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

### VS Code Settings
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

## Related Files
- `frontend/eslint.config.js` - Needs enhancement
- `frontend/.prettierrc` - New Prettier config (to be created)
- `frontend/.prettierignore` - New Prettier ignore (to be created)
- `frontend/.editorconfig` - New EditorConfig (to be created)
- `frontend/.vscode/settings.json` - New VS Code settings (to be created)
- `frontend/package.json` - Needs new scripts and dependencies
- `.husky/pre-commit` - New git hook (to be created)

