# Plano de Implementação Final - Invent App v2.0

## 📋 **Visão Geral**
Reimplementação completa da interface do app Invent com Material Design 3 usando @react-native-material/core e migração para react-native-sqlite-storage.

## 🎯 **Objetivos**
- Substituir react-native-paper por @react-native-material/core
- Migrar de expo-sqlite para react-native-sqlite-storage
- Implementar layout específico conforme especificação do usuário
- Criar sistema de design Material Design 3 customizado

## 📱 **Especificações da Interface**

### **Layout da Tela Principal**
```
┌─────────────────────────────────┐
│ TopAppBar: "Inventário" [☰]     │
├─────────────────────────────────┤
│ [Importar] [Exportar]           │ ← 16dp margins, largura igual
├─────────────────────────────────┤
│ ┌─── Card (16dp padding) ─────┐ │
│ │ Código: [____________]      │ │
│ │                             │ │
│ │ Nome: NÃO CADASTRADO        │ │ ← Texto estático, cinza escuro
│ │ Embalagem: NÃO CADASTRADO   │ │
│ │ Preço: NÃO CADASTRADO       │ │
│ │                             │ │
│ │ Quantidade: [___________]    │ │
│ └─────────────────────────────┘ │
│                                 │
│        [Salvar]                 │ ← Elevated, centralizado
└─────────────────────────────────┘
```

### **Sistema de Design**
- **Cor Primária**: #6200EE (azul)
- **Cor de Fundo**: #f5f5f5 (cinza claro)
- **Tipografia**: Roboto
- **Espaçamento**: Múltiplos de 8dp (8, 16, 24, 32dp)
- **Card**: Border-radius 8dp, sombra suave
- **TextInput**: Bordas 1px visíveis

### **Componentes Material Design 3**
- **TopAppBar**: Título "Inventário" + ícone menu (☰)
- **Buttons Filled**: Importar/Exportar (#6200EE)
- **Button Elevated**: Salvar (centralizado)
- **TextInput**: @react-native-material/core
- **Card**: Elevação 2dp

## 🛠️ **Fases de Implementação**

### **Fase 1: Configuração de Dependências**
1. Remover dependências antigas:
   - expo-sqlite
   - react-native-paper
   - react-native-safe-area-context (se não necessário)

2. Instalar novas dependências:
   - react-native-sqlite-storage
   - @react-native-material/core
   - Dependências relacionadas

3. Configurar linking nativo para Android

### **Fase 2: Sistema de Design**
1. Criar `src/theme/index.js`:
   - Definir paleta de cores
   - Configurar tipografia Roboto
   - Estabelecer sistema de espaçamento
   - Definir elevações e sombras

2. Exportar tema para uso global

### **Fase 3: Componentes Reutilizáveis**
1. `src/components/TextInput/index.js`:
   - Wrapper do TextInput do @react-native-material/core
   - Estilização customizada (bordas 1px)
   - Props padronizadas

2. `src/components/TopAppBar/index.js`:
   - Barra superior com título e menu
   - Integração com tema

3. `src/components/Card/index.js`:
   - Card com estilização Material Design 3
   - Border-radius 8dp, elevação 2dp

### **Fase 4: Tela Principal**
1. Criar `src/screens/HomeScreen.js`:
   - Implementar layout conforme especificação
   - Integrar componentes criados
   - Aplicar espaçamento 16dp consistente

2. Funcionalidades:
   - Busca de produto por código
   - Atualização dinâmica das informações
   - Validação do campo quantidade
   - Estado do botão salvar

### **Fase 5: Configuração SQLite**
1. Configurar react-native-sqlite-storage:
   - Setup para Bare Workflow Android
   - Configuração de linking nativo
   - Validar compatibilidade SDK 34-36

2. Criar estrutura de banco:
   - `src/database/connection.js`
   - `src/database/schema.js`
   - Schema básico: products, entries

3. Implementar operações básicas:
   - Busca de produto por código
   - Inserção de entradas
   - Autocomplete para product_code e product_name

### **Fase 6: Integração e Testes**
1. Integrar SQLite com interface
2. Implementar busca em tempo real
3. Testar responsividade
4. Validar performance
5. Atualizar testes unitários

## 📁 **Estrutura Final de Arquivos**
```
src/
├── components/
│   ├── TextInput/
│   │   └── index.js
│   ├── TopAppBar/
│   │   └── index.js
│   └── Card/
│       └── index.js
├── theme/
│   └── index.js              # Tema Material Design 3
├── database/
│   ├── connection.js         # react-native-sqlite-storage setup
│   └── schema.js             # Schema das tabelas
├── screens/
│   └── HomeScreen.js         # Tela principal
└── styles/
    └── global.js             # Estilos globais
```

## 🎨 **Especificações Técnicas**

### **Cores**
```javascript
theme = {
  colors: {
    primary: '#6200EE',
    background: '#f5f5f5',
    surface: '#FFFFFF',
    text: '#333333',
    textSecondary: '#666666',
    border: '#CCCCCC'
  }
}
```

### **Espaçamento**
```javascript
spacing = {
  xs: 4,   // 4dp
  sm: 8,   // 8dp
  md: 16,  // 16dp (padrão)
  lg: 24,  // 24dp
  xl: 32   // 32dp
}
```

### **Tipografia**
```javascript
typography = {
  fontFamily: 'Roboto',
  sizes: {
    title: 20,
    body: 16,
    caption: 14
  }
}
```

## ✅ **Critérios de Aceitação**
- [ ] TopAppBar com título "Inventário" e ícone menu
- [ ] Botões Importar/Exportar com largura igual e estilo filled
- [ ] Card com campos Código e Quantidade funcionais
- [ ] Informações do produto atualizando dinamicamente
- [ ] Botão Salvar estilo elevated e centralizado
- [ ] Espaçamento consistente de 16dp
- [ ] SQLite configurado e funcional
- [ ] Layout responsivo para diferentes telas
- [ ] Performance otimizada para buscas

## 🚀 **Próximos Passos**
1. Mudar para modo Code
2. Implementar Fase 1 (dependências)
3. Prosseguir sequencialmente pelas fases
4. Testar em dispositivo Android
5. Validar com expo doctor

---
**Status**: Aprovado para implementação  
**Data**: Janeiro 2025  
**Responsável**: Modo Code