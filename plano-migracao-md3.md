# 📋 Plano de Migração Material Design 3 - React Native Paper

**Projeto:** Inventário React Native  
**Data:** 26/05/2025  
**Objetivo:** Corrigir implementação MD3 e migrar para React Native Paper

---

## 🎯 **Problemas Identificados**

### ❌ **Problemas Críticos**
1. **Cores inconsistentes**: Primary `#6200EE` ≠ `#6750A4` solicitado
2. **Bibliotecas conflitantes**: `@react-native-material/core` + `react-native-paper`
3. **Tema duplicado**: `colors.js` vs `index.js` com valores diferentes
4. **Componentes mistos**: Paper + Material Core + Customizados

### ⚠️ **Problemas Secundários**
- Vector icons incompatíveis com Expo Bare Workflow
- Implementação manual de componentes MD3
- Falta de suporte a modo escuro consistente

---

## 🚀 **Fases de Implementação**

## **FASE 1: Limpeza e Preparação** ⚙️
**⏱️ Tempo estimado: 30 minutos**

### 1.1 Atualizar Dependências

```bash
# Remover biblioteca conflitante
npm uninstall @react-native-material/core

# Instalar/atualizar dependências necessárias
npm install react-native-paper@^5.12.3
npm install @expo/vector-icons@^14.0.0
npm install react-native-safe-area-context@^4.8.2

# Limpar cache
npm start -- --clear-cache
```

### 1.2 Configurar Ícones no app.json

```json
{
  "expo": {
    "assetBundlePatterns": [
      "**/*"
    ]
  }
}
```

### 1.3 Checklist Fase 1
- [ ] @react-native-material/core removido
- [ ] React Native Paper atualizado
- [ ] @expo/vector-icons instalado
- [ ] Dependências validadas
- [ ] Cache limpo

---

## **FASE 2: Unificação do Sistema de Tema** 🎨
**⏱️ Tempo estimado: 45 minutos**

### 2.1 Criar Tema MD3 Unificado

**Arquivo: `src/theme/md3-theme.js`**

```javascript
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Suas cores específicas MD3
const customColors = {
  primary: '#6750A4',
  onPrimary: '#FFFFFF',
  primaryContainer: '#EADDFF',
  onPrimaryContainer: '#21005D',
  
  secondary: '#625B71',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#E8DEF8',
  onSecondaryContainer: '#1D192B',
  
  tertiary: '#7D5260',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#FFD8E4',
  onTertiaryContainer: '#31111D',
  
  error: '#BA1A1A',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#410002',
  
  surface: '#FFFBFE',
  onSurface: '#1C1B1F',
  surfaceVariant: '#E7E0EC',
  onSurfaceVariant: '#49454F',
  
  background: '#FFFBFE',
  onBackground: '#1C1B1F',
  
  outline: '#79747E',
  outlineVariant: '#CAC4D0',
  
  inverseSurface: '#313033',
  inverseOnSurface: '#F4EFF4',
  inversePrimary: '#D0BCFF',
  
  shadow: '#000000',
  scrim: '#000000',
  
  surfaceDisabled: 'rgba(28, 27, 31, 0.12)',
  onSurfaceDisabled: 'rgba(28, 27, 31, 0.38)',
};

const customColorsLight = {
  ...customColors,
};

const customColorsDark = {
  primary: '#D0BCFF',
  onPrimary: '#381E72',
  primaryContainer: '#4F378B',
  onPrimaryContainer: '#EADDFF',
  
  secondary: '#CCC2DC',
  onSecondary: '#332D41',
  secondaryContainer: '#4A4458',
  onSecondaryContainer: '#E8DEF8',
  
  tertiary: '#EFB8C8',
  onTertiary: '#492532',
  tertiaryContainer: '#633B48',
  onTertiaryContainer: '#FFD8E4',
  
  error: '#FFB4AB',
  onError: '#690005',
  errorContainer: '#93000A',
  onErrorContainer: '#FFDAD6',
  
  surface: '#1C1B1F',
  onSurface: '#E6E1E5',
  surfaceVariant: '#49454F',
  onSurfaceVariant: '#CAC4D0',
  
  background: '#1C1B1F',
  onBackground: '#E6E1E5',
  
  outline: '#938F99',
  outlineVariant: '#49454F',
  
  inverseSurface: '#E6E1E5',
  inverseOnSurface: '#313033',
  inversePrimary: '#6750A4',
  
  shadow: '#000000',
  scrim: '#000000',
  
  surfaceDisabled: 'rgba(230, 225, 229, 0.12)',
  onSurfaceDisabled: 'rgba(230, 225, 229, 0.38)',
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...customColorsLight,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...customColorsDark,
  },
};

// Tema padrão (pode ser dinâmico baseado em preferência do usuário)
export const theme = lightTheme;
```

### 2.2 Arquivo de Configuração de Espaçamento

**Manter: `src/theme/spacing.js`**
```javascript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

### 2.3 Arquivo de Tipografia

**Manter: `src/theme/typography.js`**
```javascript
export const typography = {
  // Seguindo MD3 Type Scale
  displayLarge: {
    fontSize: 57,
    lineHeight: 64,
    fontWeight: '400',
  },
  displayMedium: {
    fontSize: 45,
    lineHeight: 52,
    fontWeight: '400',
  },
  displaySmall: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '400',
  },
  headlineLarge: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '400',
  },
  headlineMedium: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '400',
  },
  headlineSmall: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '400',
  },
  titleLarge: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '400',
  },
  titleMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  titleSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  labelMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  labelSmall: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
  },
};
```

### 2.4 Checklist Fase 2
- [ ] `md3-theme.js` criado com cores corretas
- [ ] Tema claro e escuro implementados
- [ ] `spacing.js` mantido
- [ ] `typography.js` mantido
- [ ] Arquivos antigos marcados para remoção

---

## **FASE 3: Migração de Componentes** 🔄
**⏱️ Tempo estimado: 1h 30min**

### 3.1 Atualizar App Principal

**Arquivo: `App.js`**

```javascript
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './src/theme/md3-theme';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="auto" backgroundColor={theme.colors.surface} />
        <HomeScreen />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
```

### 3.2 Migrar Componente Card

**Arquivo: `src/components/Card/index.js`**

```javascript
import React from 'react';
import { Card as PaperCard } from 'react-native-paper';

const Card = ({ children, style, mode = 'elevated', ...props }) => {
  return (
    <PaperCard mode={mode} style={style} {...props}>
      <PaperCard.Content>
        {children}
      </PaperCard.Content>
    </PaperCard>
  );
};

export default Card;
```

### 3.3 Migrar Componente TextInput

**Arquivo: `src/components/TextInput/index.js`**

```javascript
import React from 'react';
import { TextInput as PaperTextInput } from 'react-native-paper';

const TextInput = ({ 
  label, 
  mode = 'outlined', 
  style, 
  error,
  ...props 
}) => {
  return (
    <PaperTextInput
      label={label}
      mode={mode}
      error={error}
      style={style}
      {...props}
    />
  );
};

export default TextInput;
```

### 3.4 Atualizar AppTopBar (já correto)

**Arquivo: `src/components/common/AppTopBar.js` - Manter como está**

### 3.5 Migrar HomeScreen

**Arquivo: `src/screens/HomeScreen.js`**

```javascript
import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { 
  Surface, 
  Text, 
  Button, 
  FAB,
  Searchbar,
  useTheme 
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppTopBar from '../components/common/AppTopBar';
import Card from '../components/Card';
import StatsCard from '../components/common/StatsCard';

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const handleMenuPress = () => {
    // Implementar navegação do drawer
  };

  const handleSearchPress = () => {
    // Implementar busca
  };

  const handleAddPress = () => {
    // Implementar adição de item
  };

  return (
    <Surface style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <AppTopBar
        title="Inventário"
        onMenuPress={handleMenuPress}
        onSearchPress={handleSearchPress}
      />
      
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          padding: 16,
          paddingBottom: insets.bottom + 80 
        }}
      >
        <Searchbar
          placeholder="Buscar produtos..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{ marginBottom: 16 }}
        />

        <Text variant="headlineSmall" style={{ marginBottom: 16 }}>
          Estatísticas
        </Text>

        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between',
          marginBottom: 24 
        }}>
          <StatsCard title="Total de Produtos" value="150" />
          <StatsCard title="Baixo Estoque" value="8" />
        </View>

        <Text variant="headlineSmall" style={{ marginBottom: 16 }}>
          Ações Rápidas
        </Text>

        <Card style={{ marginBottom: 16 }}>
          <Text variant="titleMedium" style={{ marginBottom: 8 }}>
            Gerenciar Produtos
          </Text>
          <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
            Adicione, edite ou remova produtos do seu inventário
          </Text>
          <Button 
            mode="contained" 
            onPress={handleAddPress}
            style={{ alignSelf: 'flex-start' }}
          >
            Adicionar Produto
          </Button>
        </Card>

        <Card>
          <Text variant="titleMedium" style={{ marginBottom: 8 }}>
            Relatórios
          </Text>
          <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
            Visualize relatórios detalhados do seu estoque
          </Text>
          <Button 
            mode="outlined" 
            onPress={() => {}}
            style={{ alignSelf: 'flex-start' }}
          >
            Ver Relatórios
          </Button>
        </Card>
      </ScrollView>

      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: insets.bottom,
        }}
        onPress={handleAddPress}
      />
    </Surface>
  );
};

export default HomeScreen;
```

### 3.6 Atualizar StatsCard

**Arquivo: `src/components/common/StatsCard.js`**

```javascript
import React from 'react';
import { Surface, Text, useTheme } from 'react-native-paper';

const StatsCard = ({ title, value, icon }) => {
  const theme = useTheme();

  return (
    <Surface 
      style={{
        padding: 16,
        borderRadius: 12,
        flex: 1,
        marginHorizontal: 4,
        backgroundColor: theme.colors.primaryContainer,
      }}
      elevation={1}
    >
      <Text 
        variant="labelMedium" 
        style={{ color: theme.colors.onPrimaryContainer }}
      >
        {title}
      </Text>
      <Text 
        variant="headlineMedium" 
        style={{ 
          color: theme.colors.onPrimaryContainer,
          fontWeight: 'bold',
          marginTop: 4 
        }}
      >
        {value}
      </Text>
    </Surface>
  );
};

export default StatsCard;
```

### 3.7 Checklist Fase 3
- [ ] App.js migrado para PaperProvider
- [ ] Card migrado para Paper
- [ ] TextInput migrado para Paper
- [ ] HomeScreen refatorado
- [ ] StatsCard atualizado
- [ ] Todos os componentes usando tema unificado

---

## **FASE 4: Otimização e Validação** ✅
**⏱️ Tempo estimado: 45 minutos**

### 4.1 Comandos de Teste

```bash
# Testar no simulador iOS
npm run ios

# Testar no emulador Android
npm run android

# Testar no Expo Go
npx expo start
```

### 4.2 Validação de Cores

**Arquivo de teste: `src/utils/themeValidator.js`**

```javascript
import { theme } from '../theme/md3-theme';

export const validateTheme = () => {
  const requiredColors = {
    primary: '#6750A4',
    secondary: '#625B71',
    tertiary: '#7D5260',
    error: '#BA1A1A',
    surface: '#FFFBFE',
  };

  const issues = [];
  
  Object.entries(requiredColors).forEach(([key, expectedValue]) => {
    if (theme.colors[key] !== expectedValue) {
      issues.push(`${key}: esperado ${expectedValue}, encontrado ${theme.colors[key]}`);
    }
  });

  if (issues.length > 0) {
    console.warn('Problemas no tema:', issues);
  } else {
    console.log('✅ Tema validado com sucesso!');
  }

  return issues.length === 0;
};
```

### 4.3 Teste de Modo Escuro

**Adicionar ao App.js para teste:**

```javascript
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, Button } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { lightTheme, darkTheme } from './src/theme/md3-theme';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const currentTheme = isDark ? darkTheme : lightTheme;

  return (
    <SafeAreaProvider>
      <PaperProvider theme={currentTheme}>
        <StatusBar style={isDark ? "light" : "dark"} />
        
        {/* Botão de teste - remover em produção */}
        <Button onPress={() => setIsDark(!isDark)}>
          Toggle Theme
        </Button>
        
        <HomeScreen />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
```

### 4.4 Limpeza Final

**Arquivos para remover:**
- [ ] `src/theme/colors.js` (substituído por md3-theme.js)
- [ ] `src/theme/index.js` (substituído por md3-theme.js)

**Comando de limpeza:**
```bash
# Remover arquivos antigos
rm src/theme/colors.js
rm src/theme/index.js

# Verificar imports órfãos
grep -r "from.*theme/colors" src/
grep -r "from.*theme/index" src/
```

### 4.5 Checklist Final
- [ ] Todas as cores MD3 aplicadas corretamente
- [ ] Modo claro/escuro funcionando
- [ ] Componentes renderizando corretamente
- [ ] Performance otimizada
- [ ] Arquivos antigos removidos
- [ ] App funcionando no iOS e Android
- [ ] Validação de tema executada

---

## 📊 **Resultado Esperado**

### ✅ **Antes vs Depois**

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Biblioteca Principal** | Mixed (Material Core + Paper) | React Native Paper |
| **Cores Primary** | #6200EE | #6750A4 ✅ |
| **Cores Secondary** | #03DAC6 | #625B71 ✅ |
| **Cores Surface** | #FFFFFF | #FFFBFE ✅ |
| **Tema Unificado** | ❌ Duplicado | ✅ Único |
| **Modo Escuro** | ❌ Inconsistente | ✅ Funcional |
| **Compatibilidade Expo** | ⚠️ Parcial | ✅ Total |

### 🎯 **Benefícios Obtidos**
- ✅ Cores MD3 exatas conforme solicitado
- ✅ Componentes consistentes em todo o app
- ✅ Melhor performance (menos conflitos)
- ✅ Suporte completo a modo escuro
- ✅ Compatibilidade total com Expo Bare Workflow
- ✅ Código mais limpo e maintível
- ✅ Seguindo guidelines oficiais do Material Design 3

---

## 🚨 **Troubleshooting**

### Problema: Cores não aplicando
```bash
# Limpar cache e reinstalar
rm -rf node_modules
npm install
npx expo start --clear
```

### Problema: Ícones não carregando
```bash
# Verificar se @expo/vector-icons está instalado
npm list @expo/vector-icons

# Reinstalar se necessário
npm install @expo/vector-icons@^14.0.0
```

### Problema: App não iniciando
```bash
# Verificar dependências peer
npm install react-native-safe-area-context
npm install react-native-vector-icons  # só se necessário
```

---

## 📝 **Notas Importantes**

1. **Backup**: Sempre faça backup antes de iniciar a migração
2. **Teste Incremental**: Teste cada fase antes de continuar
3. **Performance**: Monitor a performance após cada mudança
4. **Compatibilidade**: Teste em dispositivos reais iOS e Android
5. **Acessibilidade**: Verifique se os contrastes MD3 atendem diretrizes

---

**✅ Plano criado com sucesso! Pronto para implementação.**

*Tempo total estimado: 3h 30min*  
*Nível de complexidade: Médio*  
*Risco: Baixo (com testes incrementais)*