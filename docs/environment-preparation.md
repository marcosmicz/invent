# Preparação do Ambiente - Projeto React Native 'invent' (Android Only)

## Status da Verificação do Ambiente

### 1. Arquivo local.properties
❌ **AUSENTE** - O arquivo `android/local.properties` não foi encontrado

**Ação Necessária:**
Criar o arquivo `android/local.properties` com o conteúdo:
```properties
sdk.dir=C:\\Users\\marco\\AppData\\Local\\Android\\Sdk
```

### 2. Verificação da Pasta .bundle
✅ **NÃO NECESSÁRIA** - Para desenvolvimento Android-only, o Bundler (Ruby) não é necessário
- Bundler é usado apenas para dependências iOS (CocoaPods)
- Seu projeto focará apenas em Android

### 3. Verificação da Pasta __tests__
❌ **AUSENTE** - A pasta `__tests__` não foi encontrada na raiz do projeto

## Arquivos a Serem Criados

### 1. android/local.properties
```properties
sdk.dir=C:\\Users\\marco\\AppData\\Local\\Android\\Sdk
```

### 2. __tests__/App.test.js
```javascript
import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

describe('App Component', () => {
  it('renders correctly', () => {
    render(<App />);
    expect(true).toBe(true); // Teste básico inicial
  });

  it('should not crash on render', () => {
    expect(() => render(<App />)).not.toThrow();
  });
});
```

### 3. __tests__/setup.js
```javascript
import 'react-native-gesture-handler/jestSetup';

// Mock do React Native Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock das animações nativas
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Setup global para testes
global.__DEV__ = true;
```

### 4. Atualizações no package.json
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "preset": "react-native",
    "setupFilesAfterEnv": ["<rootDir>/__tests__/setup.js"],
    "transformIgnorePatterns": [
      "node_modules/(?!(react-native|@react-native|expo|@expo|expo-sqlite)/)"
    ]
  },
  "devDependencies": {
    "@testing-library/react-native": "^12.4.2",
    "@testing-library/jest-native": "^5.4.3"
  }
}
```

## Comandos de Verificação (Android Only)

### 1. Verificação do Ambiente Expo
```bash
npx expo doctor
```

### 2. Instalação de Dependências de Teste
```bash
npm install --save-dev @testing-library/react-native @testing-library/jest-native
```

### 3. Teste do Build Android
```bash
npx expo run:android
```

## Análise Comparativa: expo-sqlite vs react-native-sqlite-storage

### expo-sqlite ✅ **ESCOLHIDO**

#### ✅ **Prós:**
- **Integração Nativa com Expo:** Perfeitamente integrado ao ecossistema Expo
- **Configuração Simplificada:** Instalação com `npx expo install expo-sqlite`
- **Autolinking Automático:** Não requer configuração manual de linking
- **New Architecture Ready:** Suporte completo à nova arquitetura do React Native
- **Tamanho Menor:** ~50KB adicional ao bundle
- **Manutenção Ativa:** Mantido pela equipe oficial do Expo
- **TypeScript Nativo:** Tipagens oficiais incluídas
- **API Moderna:** Usa Promises/async-await nativamente
- **Android Focus:** Otimizado para Android (não precisa de iOS)

#### 📊 **Performance para seu caso:**
- **Autocomplete:** Excelente com índices apropriados
- **Inserções Frequentes:** Otimizado para operações batch
- **Operação Offline:** Suporte completo

## Configuração Específica para Android

### Dependências Necessárias (Android):
- ✅ Java 17.0.15
- ✅ Android SDK 34.0.0, 35.0.0, 35.0.1, 36.0.0
- ✅ React Native 0.79.2
- ✅ Expo ~53.0.9

### Não Necessário para Android:
- ❌ Bundler (Ruby) - usado apenas para iOS/CocoaPods
- ❌ Xcode - desenvolvimento iOS
- ❌ iOS SDK - desenvolvimento iOS

## Estrutura de Implementação (expo-sqlite - Android)

### Estrutura de Pastas:
```
src/
├── database/
│   ├── index.js              # DatabaseManager singleton
│   ├── connection.js         # Configuração de conexão
│   ├── schema.js             # Definição de tabelas e índices
│   ├── migrations.js         # Sistema de versionamento
│   ├── dao/                  # Data Access Objects
│   │   ├── ProductDAO.js
│   │   ├── ReasonDAO.js
│   │   ├── EntryDAO.js
│   │   ├── EntryChangeDAO.js
│   │   └── ImportDAO.js
│   └── utils/
│       ├── validators.js     # Validações de dados
│       └── helpers.js        # Funções auxiliares
```

### Otimizações para Android + Autocomplete:
```sql
-- Índices especiais para busca de produtos
CREATE INDEX idx_products_search ON products (product_code, product_name);
CREATE INDEX idx_products_name_fts ON products (product_name COLLATE NOCASE);
```

### Performance para Inserções (Android):
```javascript
// Inserções em batch para melhor performance no Android
const insertMultipleEntries = async (entries) => {
  await db.withTransactionAsync(async () => {
    for (const entry of entries) {
      await db.runAsync(insertQuery, entry);
    }
  });
};
```

## Plano de Implementação (Android Only)

### Fase 1: Preparação do Ambiente
1. ✅ **Bundle NÃO necessário** (Android only)
2. Criar `android/local.properties`
3. Criar estrutura `__tests__/`
4. Executar `npx expo doctor`

### Fase 2: Instalação SQLite
1. `npx expo install expo-sqlite`
2. Verificar package.json
3. Testar autolinking (automático no Expo)

### Fase 3: Configuração do Banco
1. Criar estrutura `src/database/`
2. Implementar DatabaseManager
3. Definir schemas e índices
4. Criar DAOs

### Fase 4: Testes e Validação
1. Testes de conexão
2. Testes de performance
3. Validação no Android

## Próximos Passos

1. **Confirmar:** Bundle não é necessário para Android ✅
2. **Criar:** arquivos de configuração do ambiente
3. **Executar:** `npx expo doctor`
4. **Instalar:** expo-sqlite
5. **Implementar:** estrutura do banco

---

**Status:** Pronto para implementação Android-only com expo-sqlite
**Bundle:** Não necessário para desenvolvimento Android
**Próximo:** Criar arquivos de configuração do ambiente