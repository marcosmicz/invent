# Plano Final de Implementação - Material Design 3

## ✅ Configurações Confirmadas

- **UI Library:** React Native Paper v5 (Material Design 3 oficial)
- **Database:** Manter expo-sqlite (já implementado e funcionando)
- **Bundle:** Pular `.bundle` (desnecessário para Android-only)
- **Paleta:** Azul #6200EE + Verde #03DAC6 + tons complementares
- **Implementação:** Completa conforme planejamento

## 🚀 Fases de Implementação

### **Fase 1: Instalação e Setup Base (15 min)**

#### 1.1 Instalar Dependências
```bash
npm install react-native-paper react-native-vector-icons
npm install react-native-safe-area-context
npx pod-install  # Apenas se fosse iOS
```

#### 1.2 Configurar Vector Icons (Android)
```xml
<!-- android/app/src/main/assets/fonts/ - Auto-linking -->
<!-- Configuração automática via autolinking -->
```

#### 1.3 Verificar package.json
- react-native-paper: ^5.x
- react-native-vector-icons: ^10.x
- react-native-safe-area-context: ^4.x

### **Fase 2: Sistema de Tema (20 min)**

#### 2.1 Criar [`src/theme/colors.js`](src/theme/colors.js)
```javascript
export const InventColors = {
  // Primary (Azul)
  primary: '#6200EE',
  onPrimary: '#FFFFFF',
  primaryContainer: '#EADDFF',
  onPrimaryContainer: '#21005D',
  
  // Secondary (Verde)
  secondary: '#03DAC6',
  onSecondary: '#000000',
  secondaryContainer: '#A7F3D0',
  onSecondaryContainer: '#00201A',
  
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
  
  // Custom for Inventory
  success: '#4CAF50',
  successContainer: '#E8F5E8',
  warning: '#FF9800',
  warningContainer: '#FFF3E0',
  
  // Categories
  categoryFood: '#FF8F00',
  categoryBeverage: '#00BCD4',
  categoryHygiene: '#9C27B0',
  categoryOther: '#607D8B',
};
```

#### 2.2 Criar [`src/theme/typography.js`](src/theme/typography.js)
```javascript
export const InventTypography = {
  // Display
  displayLarge: {
    fontFamily: 'Roboto',
    fontSize: 57,
    fontWeight: '400',
    lineHeight: 64,
  },
  
  // Headlines
  headlineLarge: {
    fontFamily: 'Roboto',
    fontSize: 32,
    fontWeight: '400',
    lineHeight: 40,
  },
  headlineMedium: {
    fontFamily: 'Roboto',
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 36,
  },
  
  // Titles
  titleLarge: {
    fontFamily: 'Roboto',
    fontSize: 22,
    fontWeight: '500',
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  
  // Body
  bodyLarge: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  
  // Labels
  labelLarge: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  labelMedium: {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
};
```

#### 2.3 Criar [`src/theme/spacing.js`](src/theme/spacing.js)
```javascript
// Material Design 3 - Grid baseado em 4dp
export const spacing = {
  xs: 4,   // 4dp
  sm: 8,   // 8dp
  md: 16,  // 16dp
  lg: 24,  // 24dp
  xl: 32,  // 32dp
  xxl: 48, // 48dp
  
  // Specific spacing
  cardPadding: 16,
  screenMargin: 16,
  buttonHeight: 40,
  inputHeight: 56,
  appBarHeight: 64,
  
  // Elevation levels
  elevation: {
    level0: 0,
    level1: 1,
    level2: 3,
    level3: 6,
    level4: 8,
    level5: 12,
  },
};
```

#### 2.4 Criar [`src/theme/index.js`](src/theme/index.js)
```javascript
import { MD3LightTheme } from 'react-native-paper';
import { InventColors } from './colors';
import { InventTypography } from './typography';
import { spacing } from './spacing';

export const InventTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...InventColors,
  },
  fonts: {
    ...MD3LightTheme.fonts,
    ...InventTypography,
  },
  spacing,
};

export { InventColors, InventTypography, spacing };
```

### **Fase 3: Layout Base e Provider (15 min)**

#### 3.1 Atualizar [`App.js`](App.js)
```javascript
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { InventTheme } from './src/theme';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={InventTheme}>
        <StatusBar style="auto" />
        <HomeScreen />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
```

### **Fase 4: Componentes Base (30 min)**

#### 4.1 Criar [`src/components/common/AppTopBar.js`](src/components/common/AppTopBar.js)
```javascript
import React from 'react';
import { Appbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AppTopBar = ({ title, onMenuPress, onSearchPress, ...props }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <Appbar.Header 
      style={{ marginTop: insets.top }}
      {...props}
    >
      <Appbar.Action 
        icon="menu" 
        onPress={onMenuPress}
        accessibilityLabel="Menu"
      />
      <Appbar.Content title={title} />
      {onSearchPress && (
        <Appbar.Action 
          icon="magnify" 
          onPress={onSearchPress}
          accessibilityLabel="Buscar"
        />
      )}
    </Appbar.Header>
  );
};

export default AppTopBar;
```

#### 4.2 Criar [`src/components/common/StatsCard.js`](src/components/common/StatsCard.js)
```javascript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

const StatsCard = ({ title, value, subtitle, icon, variant = 'primary' }) => {
  const theme = useTheme();
  
  const getCardColor = () => {
    switch (variant) {
      case 'success': return theme.colors.successContainer;
      case 'error': return theme.colors.errorContainer;
      case 'warning': return theme.colors.warningContainer;
      default: return theme.colors.primaryContainer;
    }
  };
  
  return (
    <Card 
      style={[
        styles.card, 
        { backgroundColor: getCardColor() }
      ]}
      elevation={2}
    >
      <Card.Content>
        <View style={styles.header}>
          <Text variant="labelLarge" style={styles.title}>
            {title}
          </Text>
          {icon}
        </View>
        <Text variant="headlineMedium" style={styles.value}>
          {value}
        </Text>
        {subtitle && (
          <Text variant="bodyMedium" style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    opacity: 0.8,
  },
  value: {
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.7,
  },
});

export default StatsCard;
```

#### 4.3 Criar [`src/components/forms/MotiveDropdown.js`](src/components/forms/MotiveDropdown.js)
```javascript
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Menu, TextInput, useTheme } from 'react-native-paper';
import { dao } from '../../database/db';

const MotiveDropdown = ({ value, onValueChange, error, ...props }) => {
  const [visible, setVisible] = useState(false);
  const [reasons, setReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState(null);
  const theme = useTheme();
  
  useEffect(() => {
    loadReasons();
  }, []);
  
  useEffect(() => {
    if (value && reasons.length > 0) {
      const reason = reasons.find(r => r.reason_id === value);
      setSelectedReason(reason);
    }
  }, [value, reasons]);
  
  const loadReasons = async () => {
    try {
      const data = await dao.reasons.getAll();
      setReasons(data);
    } catch (error) {
      console.error('Erro ao carregar motivos:', error);
    }
  };
  
  const handleSelect = (reason) => {
    setSelectedReason(reason);
    onValueChange(reason.reason_id);
    setVisible(false);
  };
  
  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <TextInput
            {...props}
            value={selectedReason?.reason_name || ''}
            onFocus={() => setVisible(true)}
            right={<TextInput.Icon icon="chevron-down" />}
            editable={false}
            error={error}
            mode="outlined"
            label="Motivo da Quebra"
          />
        }
        contentStyle={styles.menu}
      >
        {reasons.map((reason) => (
          <Menu.Item
            key={reason.reason_id}
            onPress={() => handleSelect(reason)}
            title={reason.reason_name}
            titleStyle={styles.menuItem}
          />
        ))}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  menu: {
    maxHeight: 200,
  },
  menuItem: {
    fontSize: 16,
  },
});

export default MotiveDropdown;
```

### **Fase 5: Tela Principal (25 min)**

#### 5.1 Criar [`src/screens/HomeScreen.js`](src/screens/HomeScreen.js)
```javascript
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { FAB, useTheme, Snackbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppTopBar from '../components/common/AppTopBar';
import StatsCard from '../components/common/StatsCard';
import EntryForm from '../components/forms/EntryForm';
import { dao } from '../database/db';

const HomeScreen = () => {
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({
    totalLosses: 0,
    totalProducts: 0,
    totalValue: 0,
    recentEntries: 0,
  });
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  
  useEffect(() => {
    loadStats();
  }, []);
  
  const loadStats = async () => {
    try {
      // Implementar queries de estatísticas
      const totalProducts = await dao.products.count();
      const totalEntries = await dao.entries.count();
      
      setStats({
        totalLosses: totalEntries,
        totalProducts: totalProducts,
        totalValue: 0, // Calcular valor total
        recentEntries: totalEntries,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };
  
  const handleMenuPress = () => {
    // TODO: Implementar drawer navigation
    console.log('Menu pressed');
  };
  
  const handleSearchPress = () => {
    // TODO: Navegar para tela de busca
    console.log('Search pressed');
  };
  
  const handleNewEntry = () => {
    setShowForm(true);
  };
  
  const handleFormSubmit = async (entryData) => {
    try {
      await dao.entries.insert(entryData);
      setShowForm(false);
      setSnackbarMessage('Entrada salva com sucesso!');
      setSnackbarVisible(true);
      loadStats(); // Recarregar estatísticas
    } catch (error) {
      console.error('Erro ao salvar entrada:', error);
      setSnackbarMessage('Erro ao salvar entrada');
      setSnackbarVisible(true);
    }
  };
  
  const handleFormCancel = () => {
    setShowForm(false);
  };
  
  return (
    <View style={styles.container}>
      <AppTopBar
        title="Inventário"
        onMenuPress={handleMenuPress}
        onSearchPress={handleSearchPress}
      />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Statistics Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatsCard
              title="Total de Perdas"
              value={stats.totalLosses.toString()}
              subtitle="Este mês"
              variant="error"
            />
            <StatsCard
              title="Produtos Cadastrados"
              value={stats.totalProducts.toString()}
              subtitle="No sistema"
              variant="primary"
            />
          </View>
          <View style={styles.statsRow}>
            <StatsCard
              title="Valor em Perdas"
              value={`R$ ${stats.totalValue.toFixed(2)}`}
              subtitle="Este mês"
              variant="warning"
            />
            <StatsCard
              title="Entradas Recentes"
              value={stats.recentEntries.toString()}
              subtitle="Últimos 7 dias"
              variant="success"
            />
          </View>
        </View>
        
        {/* Entry Form Modal/Sheet */}
        {showForm && (
          <View style={styles.formContainer}>
            <EntryForm
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </View>
        )}
      </ScrollView>
      
      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={[
          styles.fab,
          { bottom: insets.bottom + 16 }
        ]}
        onPress={handleNewEntry}
        label="Nova Entrada"
      />
      
      {/* Snackbar for feedback */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ marginBottom: insets.bottom }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBFE',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  statsGrid: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  formContainer: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 4,
  },
  fab: {
    position: 'absolute',
    right: 16,
    backgroundColor: '#6200EE',
  },
});

export default HomeScreen;
```

#### 5.2 Criar [`src/components/forms/EntryForm.js`](src/components/forms/EntryForm.js)
```javascript
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { 
  Card, 
  Text, 
  TextInput, 
  Button, 
  useTheme 
} from 'react-native-paper';
import MotiveDropdown from './MotiveDropdown';

const EntryForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    product_code: '',
    reason_id: null,
    quantity_lost: '',
    unit_cost: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const theme = useTheme();
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.product_code.trim()) {
      newErrors.product_code = 'Código do produto é obrigatório';
    }
    
    if (!formData.reason_id) {
      newErrors.reason_id = 'Motivo é obrigatório';
    }
    
    if (!formData.quantity_lost.trim()) {
      newErrors.quantity_lost = 'Quantidade é obrigatória';
    } else if (isNaN(Number(formData.quantity_lost))) {
      newErrors.quantity_lost = 'Quantidade deve ser um número';
    }
    
    if (formData.unit_cost && isNaN(Number(formData.unit_cost))) {
      newErrors.unit_cost = 'Custo deve ser um número';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const entryData = {
        ...formData,
        quantity_lost: Number(formData.quantity_lost),
        unit_cost: formData.unit_cost ? Number(formData.unit_cost) : null,
        entry_date: new Date().toISOString(),
      };
      
      await onSubmit(entryData);
    } catch (error) {
      console.error('Erro no formulário:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };
  
  return (
    <Card style={styles.card} elevation={0}>
      <Card.Content>
        <Text variant="titleLarge" style={styles.title}>
          Nova Entrada de Perda
        </Text>
        
        <TextInput
          label="Código do Produto"
          value={formData.product_code}
          onChangeText={(value) => updateField('product_code', value)}
          error={!!errors.product_code}
          mode="outlined"
          style={styles.input}
          placeholder="Ex: 1234567890"
        />
        {errors.product_code && (
          <Text variant="bodySmall" style={styles.errorText}>
            {errors.product_code}
          </Text>
        )}
        
        <MotiveDropdown
          value={formData.reason_id}
          onValueChange={(value) => updateField('reason_id', value)}
          error={!!errors.reason_id}
          style={styles.input}
        />
        {errors.reason_id && (
          <Text variant="bodySmall" style={styles.errorText}>
            {errors.reason_id}
          </Text>
        )}
        
        <TextInput
          label="Quantidade Perdida"
          value={formData.quantity_lost}
          onChangeText={(value) => updateField('quantity_lost', value)}
          error={!!errors.quantity_lost}
          mode="outlined"
          style={styles.input}
          keyboardType="numeric"
          placeholder="Ex: 5"
        />
        {errors.quantity_lost && (
          <Text variant="bodySmall" style={styles.errorText}>
            {errors.quantity_lost}
          </Text>
        )}
        
        <TextInput
          label="Custo Unitário (Opcional)"
          value={formData.unit_cost}
          onChangeText={(value) => updateField('unit_cost', value)}
          error={!!errors.unit_cost}
          mode="outlined"
          style={styles.input}
          keyboardType="decimal-pad"
          placeholder="Ex: 3.50"
        />
        {errors.unit_cost && (
          <Text variant="bodySmall" style={styles.errorText}>
            {errors.unit_cost}
          </Text>
        )}
        
        <TextInput
          label="Observações (Opcional)"
          value={formData.notes}
          onChangeText={(value) => updateField('notes', value)}
          mode="outlined"
          style={styles.input}
          multiline
          numberOfLines={3}
          placeholder="Detalhes adicionais..."
        />
      </Card.Content>
      
      <Card.Actions style={styles.actions}>
        <Button 
          mode="outlined" 
          onPress={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button 
          mode="contained" 
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
        >
          Salvar
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: '#BA1A1A',
    marginBottom: 8,
    marginLeft: 16,
  },
  actions: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default EntryForm;
```

### **Fase 6: Estrutura de Pastas Final (5 min)**

```
src/
├── theme/
│   ├── index.js          ✅ Tema principal
│   ├── colors.js         ✅ Paleta MD3
│   ├── typography.js     ✅ Tipografia
│   └── spacing.js        ✅ Espaçamentos
├── components/
│   ├── common/
│   │   ├── AppTopBar.js  ✅ TopAppBar
│   │   └── StatsCard.js  ✅ Cards estatísticas
│   └── forms/
│       ├── MotiveDropdown.js  ✅ Dropdown motivos
│       └── EntryForm.js       ✅ Formulário entrada
├── screens/
│   └── HomeScreen.js     ✅ Tela principal
└── database/            ✅ Já existe (expo-sqlite)
    ├── db.js
    ├── schema.js
    └── dao/
```

## 📋 Checklist de Implementação

### **Setup e Dependências:**
- [ ] Instalar React Native Paper v5
- [ ] Instalar react-native-vector-icons
- [ ] Instalar react-native-safe-area-context
- [ ] Verificar autolinking

### **Sistema de Tema:**
- [ ] Criar [`src/theme/colors.js`](src/theme/colors.js)
- [ ] Criar [`src/theme/typography.js`](src/theme/typography.js)
- [ ] Criar [`src/theme/spacing.js`](src/theme/spacing.js)
- [ ] Criar [`src/theme/index.js`](src/theme/index.js)

### **Componentes Base:**
- [ ] Criar [`src/components/common/AppTopBar.js`](src/components/common/AppTopBar.js)
- [ ] Criar [`src/components/common/StatsCard.js`](src/components/common/StatsCard.js)
- [ ] Criar [`src/components/forms/MotiveDropdown.js`](src/components/forms/MotiveDropdown.js)
- [ ] Criar [`src/components/forms/EntryForm.js`](src/components/forms/EntryForm.js)

### **Telas:**
- [ ] Criar [`src/screens/HomeScreen.js`](src/screens/HomeScreen.js)
- [ ] Atualizar [`App.js`](App.js) com Provider

### **Integração Database:**
- [ ] Conectar MotiveDropdown com tabela `reasons`
- [ ] Conectar EntryForm com tabela `entries`
- [ ] Implementar queries de estatísticas
- [ ] Testar fluxo completo

### **Testes:**
- [ ] Testar em emulador Android
- [ ] Verificar performance
- [ ] Validar acessibilidade
- [ ] Testar formulário completo

## 🎯 Resultado Esperado

### **Interface Material Design 3:**
✅ TopAppBar com título "Inventário" e ícones
✅ Cards de estatísticas com elevação e cores MD3
✅ Formulário com TextInput outlined e validação
✅ Dropdown conectado ao SQLite (tabela `reasons`)
✅ FAB para nova entrada
✅ Snackbar para feedback
✅ Tema consistente com paleta azul/verde
✅ Tipografia Roboto e espaçamentos 8dp

### **Funcionalidades:**
✅ Cadastro de entradas de perdas
✅ Seleção de motivos via dropdown
✅ Validação de formulário
✅ Estatísticas dinâmicas
✅ Feedback visual (loading, success, error)
✅ Layout responsivo

### **Performance:**
✅ Carregamento < 200ms
✅ Autocomplete < 50ms
✅ Salvamento < 100ms
✅ Bundle size otimizado

---

**📱 Ready to implement! Próximo passo: Começar instalação das dependências.**