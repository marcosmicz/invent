# Plano Material Design 3 - Projeto React Native 'invent'

## 🎨 Visão Geral do Material Design 3

Material Design 3 (Material You) é a mais recente evolução do sistema de design do Google, focando em personalização, acessibilidade e expressão pessoal.

### **Principais Características:**
- **Dynamic Color** - Cores adaptáveis baseadas no wallpaper do usuário
- **Adaptive Components** - Componentes que se adaptam ao contexto
- **Enhanced Accessibility** - Melhor contraste e navegação
- **Expressive Typography** - Sistema tipográfico mais flexível

## 📱 Implementação para React Native Android

### **Bibliotecas Recomendadas:**

#### 1. **React Native Paper (v5+)** ⭐ **PRINCIPAL**
```bash
npm install react-native-paper react-native-vector-icons
```
- ✅ Material Design 3 nativo
- ✅ Componentes prontos (Cards, Buttons, TextInput)
- ✅ Theming completo
- ✅ Suporte a Dynamic Color

#### 2. **React Native Vector Icons**
```bash
npm install react-native-vector-icons
npx react-native link react-native-vector-icons
```
- ✅ Material Icons
- ✅ Material Symbols (MD3)

#### 3. **React Navigation v6**
```bash
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
```
- ✅ Material Design navigation patterns
- ✅ Bottom tabs, drawers, stacks

## 🎨 Sistema de Cores Material Design 3

### **Core Colors:**
```javascript
const MD3Colors = {
  // Primary
  primary: '#6750A4',
  onPrimary: '#FFFFFF',
  primaryContainer: '#EADDFF',
  onPrimaryContainer: '#21005D',
  
  // Secondary
  secondary: '#625B71',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#E8DEF8',
  onSecondaryContainer: '#1D192B',
  
  // Tertiary
  tertiary: '#7D5260',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#FFD8E4',
  onTertiaryContainer: '#31111D',
  
  // Error
  error: '#BA1A1A',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#410002',
  
  // Background
  background: '#FFFBFE',
  onBackground: '#1C1B1F',
  surface: '#FFFBFE',
  onSurface: '#1C1B1F',
  
  // Surface variants
  surfaceVariant: '#E7E0EC',
  onSurfaceVariant: '#49454F',
  outline: '#79747E',
  outlineVariant: '#CAC4D0',
  
  // Other
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#313033',
  inverseOnSurface: '#F4EFF4',
  inversePrimary: '#D0BCFF',
};
```

### **Tema Personalizado para Invent:**
```javascript
const InventTheme = {
  ...MD3Colors,
  // Cores específicas para inventário
  success: '#4CAF50',        // Produtos ok
  warning: '#FF9800',        // Alertas
  info: '#2196F3',          // Informações
  loss: '#F44336',          // Perdas/negativos
  gain: '#8BC34A',          // Ganhos/positivos
  
  // Cores de categoria
  categoryFood: '#FF8F00',
  categoryBeverage: '#00BCD4',
  categoryHygiene: '#9C27B0',
  categoryOther: '#607D8B',
};
```

## 🧩 Componentes Principais do App

### **1. Layout Structure:**
```
┌─────────────────────────────┐
│      Top App Bar            │ ← Material 3 AppBar
├─────────────────────────────┤
│                             │
│      Main Content           │ ← Cards, Lists, Forms
│                             │
│                             │
├─────────────────────────────┤
│   Bottom Navigation         │ ← Material 3 BottomNav
└─────────────────────────────┘
```

### **2. Telas Principais:**

#### **🏠 Home/Dashboard**
- ✅ **Cards** com estatísticas de perdas
- ✅ **FAB** (Floating Action Button) para nova entrada
- ✅ **Charts** com Material colors
- ✅ **Quick actions** em chips

#### **🔍 Busca de Produtos**
- ✅ **SearchBar** com autocomplete
- ✅ **Product Cards** com imagem e preços
- ✅ **Filters** em chips
- ✅ **Results List** com Material styling

#### **📝 Formulário de Entrada**
- ✅ **TextInput** Material 3 (outlined style)
- ✅ **Dropdown** para motivos
- ✅ **Number Input** para quantidade
- ✅ **Date Picker** Material style
- ✅ **Buttons** (Primary/Secondary)

#### **📊 Relatórios**
- ✅ **Data Tables** responsivas
- ✅ **Charts** com Material colors
- ✅ **Export buttons**
- ✅ **Filter panels**

#### **⚙️ Configurações**
- ✅ **Settings List** com Material styling
- ✅ **Switches** e **Radio buttons**
- ✅ **About section**

## 📂 Estrutura de Arquivos UI

```
src/
├── components/
│   ├── common/
│   │   ├── AppBar.jsx
│   │   ├── FAB.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ErrorBoundary.jsx
│   ├── forms/
│   │   ├── ProductSearchInput.jsx
│   │   ├── EntryForm.jsx
│   │   └── FilterPanel.jsx
│   ├── cards/
│   │   ├── ProductCard.jsx
│   │   ├── EntryCard.jsx
│   │   └── StatsCard.jsx
│   └── lists/
│       ├── ProductList.jsx
│       ├── EntryList.jsx
│       └── ReasonList.jsx
├── screens/
│   ├── HomeScreen.jsx
│   ├── SearchScreen.jsx
│   ├── EntryScreen.jsx
│   ├── ReportsScreen.jsx
│   └── SettingsScreen.jsx
├── navigation/
│   ├── AppNavigator.jsx
│   ├── BottomTabNavigator.jsx
│   └── StackNavigators.jsx
├── theme/
│   ├── colors.js
│   ├── typography.js
│   ├── spacing.js
│   └── theme.js
└── utils/
    ├── formatters.js
    └── validators.js
```

## 🚀 Plano de Implementação

### **Fase 1: Setup Base (1-2 dias)**
1. ✅ **Instalar dependências** React Native Paper + Navigation
2. ✅ **Configurar tema** Material 3 customizado
3. ✅ **Setup navegação** com bottom tabs
4. ✅ **Criar estrutura** de pastas

### **Fase 2: Componentes Base (2-3 dias)**
1. ✅ **AppBar** com search e menu
2. ✅ **Bottom Navigation** com 4 tabs
3. ✅ **Cards base** para produtos e estatísticas
4. ✅ **Forms base** com TextInput Material 3

### **Fase 3: Telas Principais (3-4 dias)**
1. ✅ **Home/Dashboard** com cards de estatísticas
2. ✅ **Product Search** com autocomplete
3. ✅ **Entry Form** para lançamentos
4. ✅ **Product Detail** com informações completas

### **Fase 4: Funcionalidades Avançadas (2-3 dias)**
1. ✅ **Reports screen** com charts
2. ✅ **Settings** com preferências
3. ✅ **Dark theme** support
4. ✅ **Accessibility** improvements

### **Fase 5: Polish & Testing (1-2 dias)**
1. ✅ **Animations** Material Motion
2. ✅ **Loading states** e error handling
3. ✅ **Performance** optimization
4. ✅ **Testing** UI components

## 📝 Comandos de Instalação

### **1. Instalar React Native Paper:**
```bash
npm install react-native-paper
```

### **2. Instalar Navigation:**
```bash
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
```

### **3. Instalar Icons:**
```bash
npm install react-native-vector-icons
# Android linking automático via autolinking
```

### **4. Instalar Charts (opcional):**
```bash
npm install react-native-chart-kit react-native-svg
```

## 🎯 Benefícios Específicos para o App Invent

### **UX Melhorada:**
- ✅ **Autocomplete visual** para busca de produtos
- ✅ **Cards informativos** para estatísticas de perdas
- ✅ **Forms intuitivos** para entrada de dados
- ✅ **Feedback visual** para ações do usuário

### **Produtividade:**
- ✅ **FAB** para acesso rápido a nova entrada
- ✅ **Bottom navigation** para alternância rápida
- ✅ **Search persistente** no AppBar
- ✅ **Shortcuts** via chips e buttons

### **Profissionalismo:**
- ✅ **Design consistente** com padrões Google
- ✅ **Animations suaves** Material Motion
- ✅ **Accessibility** built-in
- ✅ **Responsive design** para diferentes tamanhos

## 🔄 Integração com SQLite

### **Componentes que usarão o banco:**
```javascript
// ProductSearchInput.jsx
const searchProducts = async (term) => {
  const products = await dao.products.searchByName(term, 10);
  setResults(products);
};

// EntryForm.jsx
const saveEntry = async (entryData) => {
  await dao.entries.insert(entryData);
  showSuccessSnackbar();
};

// StatsCard.jsx
const loadStats = async () => {
  const stats = await db.stats();
  setDashboardData(stats);
};
```

## 🎨 Mockups Principais

### **Home Screen:**
```
┌─────────────────────────────┐
│  🏠 Invent      🔍  ⚙️     │
├─────────────────────────────┤
│ ┌─────────┐ ┌─────────────┐ │
│ │ Perdas  │ │  Produtos   │ │
│ │  124    │ │    1,456    │ │
│ └─────────┘ └─────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Últimas Entradas        │ │
│ │ • Coca-Cola - Vencido   │ │
│ │ • Pão - Danificado      │ │
│ └─────────────────────────┘ │
│                          ⊕  │
├─────────────────────────────┤
│ 🏠 📊 📝 ⚙️              │
└─────────────────────────────┘
```

### **Search Screen:**
```
┌─────────────────────────────┐
│  🔍 Buscar produtos...      │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ 🥤 Coca-Cola 350ml      │ │
│ │    R$ 3,50 / R$ 2,99    │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 🍞 Pão Francês         │ │
│ │    R$ 0,80 / R$ 0,75    │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ 🏠 📊 📝 ⚙️              │
└─────────────────────────────┘
```

## ✅ Próximos Passos

1. **Confirmar aprovação** do plano Material Design 3
2. **Instalar dependências** (React Native Paper + Navigation)
3. **Configurar tema** personalizado para Invent
4. **Implementar navegação** base com bottom tabs
5. **Criar primeiro componente** (ProductSearchInput)

---

**Estimativa total:** 8-12 dias de desenvolvimento
**Resultado:** App profissional seguindo padrões Material Design 3
**Compatibilidade:** Android SDK 34-36 ✅