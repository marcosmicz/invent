# Arquitetura do Projeto - Material Design 3 + SQLite

## 🏗️ Diagrama de Arquitetura

```mermaid
graph TB
    subgraph "📱 React Native App"
        A[App.js] --> B[Theme Provider]
        B --> C[Navigation]
        C --> D[Screens]
    end
    
    subgraph "🎨 Material Design 3"
        E[React Native Paper v5]
        F[Theme System]
        G[Components]
        
        F --> F1[Colors MD3]
        F --> F2[Typography]
        F --> F3[Spacing 8dp]
        F --> F4[Elevation]
        
        G --> G1[TopAppBar]
        G --> G2[Card]
        G --> G3[Button]
        G --> G4[TextInput]
        G --> G5[Dropdown]
    end
    
    subgraph "🗄️ SQLite Database"
        H[expo-sqlite]
        I[Database Schema]
        J[DAO Layer]
        
        I --> I1[products]
        I --> I2[reasons]
        I --> I3[entries]
        I --> I4[entry_changes]
        I --> I5[imports]
        
        J --> J1[ProductDAO]
        J --> J2[ReasonDAO]
        J --> J3[EntryDAO]
    end
    
    subgraph "📂 File Structure"
        K[src/]
        K --> K1[theme/]
        K --> K2[components/]
        K --> K3[screens/]
        K --> K4[database/]
        K --> K5[utils/]
        
        K1 --> K1A[colors.js]
        K1 --> K1B[typography.js]
        K1 --> K1C[index.js]
        
        K2 --> K2A[common/]
        K2 --> K2B[forms/]
        K2 --> K2C[layout/]
        
        K4 --> K4A[db.js]
        K4 --> K4B[schema.js]
        K4 --> K4C[dao/]
    end
    
    %% Connections
    A --> E
    B --> F
    D --> G
    D --> H
    G --> J
    
    %% Styling
    classDef primary fill:#6200EE,stroke:#fff,stroke-width:2px,color:#fff
    classDef secondary fill:#03DAC6,stroke:#000,stroke-width:2px
    classDef database fill:#4CAF50,stroke:#fff,stroke-width:2px,color:#fff
    classDef structure fill:#FF9800,stroke:#fff,stroke-width:2px,color:#fff
    
    class A,B,C,D primary
    class E,F,G secondary
    class H,I,J database
    class K,K1,K2,K3,K4,K5 structure
```

## 🔄 Fluxo de Dados

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Material UI
    participant C as Component
    participant D as DAO
    participant DB as SQLite
    
    U->>UI: Abre tela
    UI->>C: Renderiza componentes MD3
    C->>D: Busca dados
    D->>DB: Query SQL
    DB-->>D: Retorna resultados
    D-->>C: Dados formatados
    C-->>UI: Atualiza interface
    UI-->>U: Exibe informações
    
    U->>UI: Preenche formulário
    UI->>C: Valida dados
    C->>D: Salva entrada
    D->>DB: INSERT/UPDATE
    DB-->>D: Confirmação
    D-->>C: Sucesso
    C-->>UI: Feedback visual
    UI-->>U: Snackbar confirmação
```

## 🎯 Componentes Principais

```mermaid
graph LR
    subgraph "🏠 HomeScreen"
        A1[TopAppBar] --> A2[Stats Cards]
        A2 --> A3[Recent Entries]
        A3 --> A4[FAB New Entry]
    end
    
    subgraph "📝 EntryForm"
        B1[Product Search] --> B2[Motive Dropdown]
        B2 --> B3[Quantity Input]
        B3 --> B4[Save Button]
    end
    
    subgraph "🔍 Search"
        C1[SearchBar] --> C2[Autocomplete]
        C2 --> C3[Product List]
        C3 --> C4[Select Product]
    end
    
    A4 --> B1
    C4 --> B1
    
    classDef screen fill:#E3F2FD,stroke:#1976D2,stroke-width:2px
    classDef component fill:#F3E5F5,stroke:#7B1FA2,stroke-width:2px
    
    class A1,A2,A3,A4,B1,B2,B3,B4,C1,C2,C3,C4 component
```

## 📊 Performance Targets

| Operação | Target | Método |
|----------|--------|--------|
| **Autocomplete** | <50ms | Índices + LIMIT |
| **Form Save** | <100ms | Transações |
| **Screen Load** | <200ms | Lazy loading |
| **Search** | <30ms | FTS + Cache |

## 🎨 Material Design 3 Implementation

```mermaid
graph TB
    subgraph "Theme System"
        T1[Material Theme] --> T2[Color Tokens]
        T1 --> T3[Typography Scale]
        T1 --> T4[Motion System]
        
        T2 --> T2A[Primary: #6200EE]
        T2 --> T2B[Secondary: #03DAC6]
        T2 --> T2C[Error: #BA1A1A]
        T2 --> T2D[Success: #4CAF50]
        
        T3 --> T3A[Roboto Font]
        T3 --> T3B[Scale: 12-32sp]
        
        T4 --> T4A[Duration: 200-300ms]
        T4 --> T4B[Easing: Standard]
    end
    
    classDef theme fill:#6200EE,stroke:#fff,stroke-width:2px,color:#fff
    classDef token fill:#03DAC6,stroke:#000,stroke-width:2px
    
    class T1 theme
    class T2A,T2B,T2C,T2D,T3A,T3B,T4A,T4B token