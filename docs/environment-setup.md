# Configuração do Ambiente - Projeto React Native 'invent'

## Status Atual do Projeto

### Análise da Estrutura
- ❌ Pasta `.bundle` não encontrada
- ❌ Pasta `__tests__` não encontrada
- ✅ Estrutura básica do Expo Bare Workflow presente
- ✅ Configurações Android presentes

## Passos de Verificação e Configuração

### 1. Verificação do Ambiente com Expo Doctor

**Comando a executar:**
```bash
npx expo doctor
```

**Verificações esperadas:**
- Java 17.0.15
- react-native-cli 2.0.1
- react-native 0.79.2
- Android SDK 34.0.0 a 36.0.0
- Node.js versão compatível
- Dependências do Expo

### 2. Criação da Estrutura de Testes

**Criar pasta `__tests__`** com os seguintes arquivos:

#### `__tests__/App.test.js`
```javascript
import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

describe('App Component', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<App />);
    // Teste básico para verificar se o componente renderiza
    expect(true).toBe(true);
  });

  it('matches snapshot', () => {
    const tree = render(<App />);
    expect(tree).toMatchSnapshot();
  });
});
```

#### `__tests__/setup.js`
```javascript
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock do SQLite para testes
jest.mock('expo-sqlite', () => ({
  openDatabase: jest.fn(() => ({
    transaction: jest.fn(),
    executeSql: jest.fn(),
  })),
}));

// Silence the warning: Animated: `useNativeDriver`
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
```

### 3. Configuração do Jest no package.json

**Adicionar ao `package.json`:**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "jest": {
    "preset": "react-native",
    "setupFilesAfterEnv": ["<rootDir>/__tests__/setup.js"],
    "transformIgnorePatterns": [
      "node_modules/(?!(react-native|@react-native|expo|@expo|react-native-sqlite-storage)/)"
    ],
    "collectCoverage": true,
    "collectCoverageFrom": [
      "src/**/*.{js,jsx}",
      "!src/**/*.test.{js,jsx}",
      "!src/index.js"
    ]
  },
  "devDependencies": {
    "@testing-library/react-native": "^12.4.2",
    "@testing-library/jest-native": "^5.4.3",
    "jest": "^29.7.0"
  }
}
```

### 4. Verificação de Dependências Potenciais

**Dependências que podem ser necessárias:**
```bash
npm install --save-dev @testing-library/react-native @testing-library/jest-native
```

### 5. Configuração do Bundle (se necessário)

**Criar `.bundle/config` se ausente:**
```
---
BUNDLE_PATH: "vendor/bundle"
BUNDLE_BIN: "vendor/bundle/bin"
```

### 6. Problemas Comuns e Soluções

#### Problema: Java Version Mismatch
**Solução:**
- Verificar JAVA_HOME aponta para Java 17
- Atualizar gradle se necessário

#### Problema: Android SDK Não Encontrado
**Solução:**
- Verificar ANDROID_HOME
- Instalar SDKs 34-36 via Android Studio

#### Problema: React Native CLI Desatualizada
**Solução:**
```bash
npm uninstall -g react-native-cli
npm install -g @react-native-community/cli
```

### 7. Atualização do Plano SQLite

**Mudança importante:** Usar `expo-sqlite` ao invés de `react-native-sqlite-storage`

**Instalação:**
```bash
npx expo install expo-sqlite
```

**Vantagens do expo-sqlite:**
- Melhor integração com Expo
- Suporte nativo à New Architecture
- Menos configuração manual necessária
- Melhor compatibilidade com autolinking

## Checklist de Verificação

- [ ] Executar `npx expo doctor` e resolver problemas
- [ ] Criar estrutura `__tests__/`
- [ ] Configurar Jest no package.json
- [ ] Instalar dependências de teste
- [ ] Verificar variáveis de ambiente (JAVA_HOME, ANDROID_HOME)
- [ ] Confirmar versões compatíveis
- [ ] Testar build básico do projeto
- [ ] Executar testes básicos

## Próximos Passos

1. **Verificação do Ambiente:** Executar todos os comandos de diagnóstico
2. **Correção de Problemas:** Resolver incompatibilidades encontradas
3. **Implementação SQLite:** Usar expo-sqlite conforme plano atualizado
4. **Testes:** Validar configuração com testes básicos

---

**Observação:** Este documento deve ser seguido antes de prosseguir com a implementação do SQLite para garantir um ambiente estável.