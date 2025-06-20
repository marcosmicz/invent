import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  TextInput as RNTextInput,
  FlatList,
  Modal
} from 'react-native';
import { theme } from '../theme';
import { expoDbManager } from '../database/expo-manager';

const HomeScreen = () => {
  // Estados para dados
  const [reasons, setReasons] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Estados para seleção
  const [selectedReason, setSelectedReason] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Estados para campos
  const [code, setCode] = useState('');
  const [quantity, setQuantity] = useState('');
  
  // Estados para UI
  const [showReasonDropdown, setShowReasonDropdown] = useState(false);
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      console.log('HOMESCREEN: Carregando dados iniciais...');
      
      // Inicializar database
      await expoDbManager.initialize();
      
      // Carregar motivos
      const reasonsData = await expoDbManager.fetchData('reasons');
      setReasons(reasonsData);
      console.log('HOMESCREEN: Motivos carregados:', reasonsData.length);
      
      // Carregar produtos
      const productsData = await expoDbManager.fetchData('products');
      setProducts(productsData);
      console.log('HOMESCREEN: Produtos carregados:', productsData.length);
      
    } catch (error) {
      console.error('HOMESCREEN: Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Falha ao carregar dados do banco');
    }
  };

  // Buscar produtos conforme digitação (com debounce)
  const handleCodeChange = (text) => {
    setCode(text);
    setSelectedProduct(null);
    
    if (text.trim().length === 0) {
      setFilteredProducts([]);
      setShowProductSuggestions(false);
    }
  };

  // useEffect para debounce na busca
  useEffect(() => {
    const searchProducts = async () => {
      if (code.trim().length > 0) {
        try {
          const filtered = await expoDbManager.fetchData('products', code);
          setFilteredProducts(filtered);
          setShowProductSuggestions(filtered.length > 0);
        } catch (error) {
          console.error('HOMESCREEN: Erro ao buscar produtos:', error);
          setFilteredProducts([]);
          setShowProductSuggestions(false);
        }
      }
    };

    const timeoutId = setTimeout(searchProducts, 300); // Debounce de 300ms
    return () => clearTimeout(timeoutId);
  }, [code]);

  // Selecionar produto da lista
  const selectProduct = (product) => {
    setSelectedProduct(product);
    setCode(product.product_code);
    setShowProductSuggestions(false);
    setFilteredProducts([]);
  };

  // Selecionar motivo
  const selectReason = (reason) => {
    setSelectedReason(reason);
    setShowReasonDropdown(false);
  };

  // Salvar entrada
  const handleSave = async () => {
    if (!selectedReason) {
      Alert.alert('Erro', 'Por favor, selecione um motivo');
      return;
    }

    if (!code.trim()) {
      Alert.alert('Erro', 'Por favor, informe o código do produto');
      return;
    }

    if (!quantity.trim() || isNaN(quantity) || parseFloat(quantity) <= 0) {
      Alert.alert('Erro', 'Por favor, informe uma quantidade válida');
      return;
    }

    try {
      const entryData = {
        product_code: code.trim(),
        product_name: selectedProduct ? selectedProduct.product_name : 'PRODUTO NÃO CADASTRADO',
        quantity: parseFloat(quantity),
        reason_id: selectedReason.id,
        unit_cost: selectedProduct ? selectedProduct.regular_price : 0
      };

      const entryId = await expoDbManager.insertEntry(entryData);
      
      Alert.alert(
        'Sucesso', 
        `Entrada registrada com sucesso!\nID: ${entryId}`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Limpar formulário
              setSelectedReason(null);
              setSelectedProduct(null);
              setCode('');
              setQuantity('');
              setFilteredProducts([]);
              setShowProductSuggestions(false);
            }
          }
        ]
      );
    } catch (error) {
      console.error('HOMESCREEN: Erro ao salvar entrada:', error);
      Alert.alert('Erro', `Falha ao registrar entrada: ${error.message}`);
    }
  };

  // Funções dos botões (placeholder)
  const handleImport = () => {
    Alert.alert('Importar', 'Funcionalidade de importação será implementada');
  };

  const handleExport = () => {
    Alert.alert('Exportar', 'Funcionalidade de exportação será implementada');
  };

  const handleMenuPress = () => {
    Alert.alert('Menu', 'Menu lateral será implementado');
  };

  // Render item do dropdown de motivos
  const renderReasonItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => selectReason(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.dropdownItemText}>{item.description}</Text>
      <Text style={styles.dropdownItemCode}>{item.code}</Text>
    </TouchableOpacity>
  );

  // Render item das sugestões de produtos
  const renderProductSuggestion = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => selectProduct(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.suggestionName}>{item.product_name}</Text>
      <Text style={styles.suggestionCode}>({item.product_code})</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* TopAppBar */}
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={handleMenuPress}
          activeOpacity={0.7}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Inventário</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Botões Importar e Exportar */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleImport}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Importar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleExport}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Exportar</Text>
          </TouchableOpacity>
        </View>

        {/* Card principal com formulário */}
        <View style={styles.formCard}>
          {/* Campo Motivo - Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Motivo</Text>
            <TouchableOpacity
              style={[styles.textInput, styles.dropdownButton]}
              onPress={() => setShowReasonDropdown(true)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.dropdownButtonText,
                !selectedReason && styles.placeholderText
              ]}>
                {selectedReason ? selectedReason.description : 'Selecione um motivo'}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Campo Código - com Autocomplete */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Código</Text>
            <RNTextInput
              style={styles.textInput}
              value={code}
              onChangeText={handleCodeChange}
              placeholder="Digite o código do produto"
              placeholderTextColor="#999"
              onFocus={() => {
                if (filteredProducts.length > 0) {
                  setShowProductSuggestions(true);
                }
              }}
            />
            
            {/* Lista de sugestões de produtos */}
            {showProductSuggestions && filteredProducts.length > 0 && (
              <View style={styles.suggestionsContainer}>
                {filteredProducts.slice(0, 5).map((item) => (
                  <TouchableOpacity
                    key={item.product_code}
                    style={styles.suggestionItem}
                    onPress={() => selectProduct(item)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.suggestionName}>{item.product_name}</Text>
                    <Text style={styles.suggestionCode}>({item.product_code})</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Informações do produto */}
          <View style={styles.productInfo}>
            <Text style={styles.productInfoText}>
              Nome: {selectedProduct ? selectedProduct.product_name : 'NÃO CADASTRADO'}
            </Text>
            <Text style={styles.productInfoText}>
              Embalagem: {selectedProduct ? selectedProduct.unit_type : 'NÃO CADASTRADO'}
            </Text>
            <Text style={styles.productInfoText}>
              Preço: {selectedProduct ? `R$ ${selectedProduct.regular_price?.toFixed(2).replace('.', ',')}` : 'NÃO CADASTRADO'}
            </Text>
          </View>

          {/* Campo Quantidade */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Quantidade</Text>
            <RNTextInput
              style={styles.textInput}
              value={quantity}
              onChangeText={setQuantity}
              placeholder="Digite a quantidade"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Botão Salvar */}
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!selectedReason || !code.trim() || !quantity.trim()) && styles.saveButtonDisabled
            ]}
            onPress={handleSave}
            disabled={!selectedReason || !code.trim() || !quantity.trim()}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.saveButtonText,
              (!selectedReason || !code.trim() || !quantity.trim()) && styles.saveButtonTextDisabled
            ]}>
              Salvar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal do Dropdown de Motivos */}
      <Modal
        visible={showReasonDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowReasonDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowReasonDropdown(false)}
        >
          <View style={styles.dropdownModal}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Selecione um Motivo</Text>
              <TouchableOpacity
                onPress={() => setShowReasonDropdown(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={reasons}
              renderItem={renderReasonItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.dropdownList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // TopBar
  topBar: {
    height: 56,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  menuIcon: {
    fontSize: 20,
    color: theme.colors.onPrimary,
    fontWeight: '600',
  },
  title: {
    flex: 1,
    fontSize: theme.typography.sizes.headlineSmall,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.onPrimary,
    fontFamily: theme.typography.fontFamily,
    marginLeft: theme.spacing.md,
  },
  spacer: {
    width: 40,
  },
  
  // Content
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: theme.spacing.xl,
  },
  
  // Botões superiores
  buttonRow: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    height: 48,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  buttonText: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography.sizes.labelLarge,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fontFamily,
  },

  // Card do formulário
  formCard: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  
  // Inputs
  inputContainer: {
    marginVertical: theme.spacing.sm,
    zIndex: 1,
  },
  inputLabel: {
    fontSize: theme.typography.sizes.bodyMedium,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
    marginBottom: 4,
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.sizes.bodyLarge,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
    backgroundColor: theme.colors.surface,
  },

  // Dropdown de motivos
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownButtonText: {
    fontSize: theme.typography.sizes.bodyLarge,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
    flex: 1,
  },
  placeholderText: {
    color: '#999',
  },
  dropdownArrow: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },

  // Modal do dropdown
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModal: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    width: '80%',
    maxHeight: '60%',
    elevation: 8,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  dropdownTitle: {
    fontSize: theme.typography.sizes.titleMedium,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
  },
  dropdownList: {
    maxHeight: 300,
  },
  dropdownItem: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  dropdownItemText: {
    fontSize: theme.typography.sizes.bodyLarge,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
  },
  dropdownItemCode: {
    fontSize: theme.typography.sizes.bodySmall,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily,
    marginTop: 2,
  },

  // Sugestões de produtos
  suggestionsContainer: {
    position: 'absolute',
    top: 72,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: theme.borderRadius.sm,
    elevation: 4,
    zIndex: 1000,
  },
  suggestionsList: {
    maxHeight: 150,
  },
  suggestionItem: {
    padding: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  suggestionName: {
    fontSize: theme.typography.sizes.bodyMedium,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
  },
  suggestionCode: {
    fontSize: theme.typography.sizes.bodySmall,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily,
  },

  // Informações do produto
  productInfo: {
    paddingVertical: theme.spacing.md,
  },
  productInfoText: {
    fontSize: theme.typography.sizes.bodyLarge,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily,
    lineHeight: 24,
    marginBottom: theme.spacing.xs,
  },

  // Botão Salvar
  saveButtonContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    alignItems: 'center',
  },
  saveButton: {
    minWidth: 200,
    height: 48,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
    elevation: 1,
  },
  saveButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.labelLarge,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fontFamily,
  },
  saveButtonTextDisabled: {
    color: '#999',
  },
});

export default HomeScreen;