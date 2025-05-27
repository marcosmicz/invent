import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import { 
  Text, 
  Button, 
  Card, 
  TextInput, 
  Portal, 
  Modal, 
  List, 
  Chip,
  Surface,
  useTheme
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopAppBar from '../components/TopAppBar';
import { expoDbManager } from '../database/expo-manager';

const HomeScreen = () => {
  const theme = useTheme();
  
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
    <List.Item
      title={item.description}
      description={item.code}
      onPress={() => selectReason(item)}
      style={styles.listItem}
    />
  );

  // Render item das sugestões de produtos
  const renderProductSuggestion = ({ item }) => (
    <List.Item
      title={item.product_name}
      description={`(${item.product_code})`}
      onPress={() => selectProduct(item)}
      style={styles.listItem}
    />
  );

  const isFormValid = selectedReason && code.trim() && quantity.trim();

  return (
    <SafeAreaView style={styles.container}>
      <TopAppBar 
        title="Inventário" 
        onMenuPress={handleMenuPress}
      />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Botões Importar e Exportar */}
        <View style={styles.buttonRow}>
          <Button
            mode="contained"
            onPress={handleImport}
            style={styles.actionButton}
            contentStyle={styles.buttonContent}
          >
            Importar
          </Button>
          <Button
            mode="contained"
            onPress={handleExport}
            style={styles.actionButton}
            contentStyle={styles.buttonContent}
          >
            Exportar
          </Button>
        </View>

        {/* Card principal com formulário */}
        <Card mode="elevated" style={styles.formCard}>
          <Card.Content>
            {/* Campo Motivo - Dropdown */}
            <View style={styles.inputContainer}>
              <Text variant="labelMedium" style={styles.inputLabel}>Motivo</Text>
              <Button
                mode="outlined"
                onPress={() => setShowReasonDropdown(true)}
                style={styles.dropdownButton}
                contentStyle={styles.dropdownButtonContent}
              >
                {selectedReason ? selectedReason.description : 'Selecione um motivo'}
              </Button>
              {selectedReason && (
                <Chip 
                  icon="check" 
                  style={styles.selectedChip}
                  onClose={() => setSelectedReason(null)}
                >
                  {selectedReason.description}
                </Chip>
              )}
            </View>

            {/* Campo Código - com Autocomplete */}
            <View style={styles.inputContainer}>
              <TextInput
                label="Código"
                value={code}
                onChangeText={handleCodeChange}
                placeholder="Digite o código do produto"
                mode="outlined"
                style={styles.textInput}
                onFocus={() => {
                  if (filteredProducts.length > 0) {
                    setShowProductSuggestions(true);
                  }
                }}
              />
              
              {/* Lista de sugestões de produtos */}
              {showProductSuggestions && filteredProducts.length > 0 && (
                <Surface style={styles.suggestionsContainer} elevation={2}>
                  {filteredProducts.slice(0, 5).map((item) => (
                    <List.Item
                      key={item.product_code}
                      title={item.product_name}
                      description={`(${item.product_code})`}
                      onPress={() => selectProduct(item)}
                      style={styles.suggestionItem}
                    />
                  ))}
                </Surface>
              )}
            </View>

            {/* Informações do produto */}
            <Card mode="outlined" style={styles.productInfoCard}>
              <Card.Content>
                <Text variant="titleSmall" style={styles.productInfoTitle}>
                  Informações do Produto
                </Text>
                <Text variant="bodyMedium">
                  Nome: {selectedProduct ? selectedProduct.product_name : 'NÃO CADASTRADO'}
                </Text>
                <Text variant="bodyMedium">
                  Embalagem: {selectedProduct ? selectedProduct.unit_type : 'NÃO CADASTRADO'}
                </Text>
                <Text variant="bodyMedium">
                  Preço: {selectedProduct ? `R$ ${selectedProduct.regular_price?.toFixed(2).replace('.', ',')}` : 'NÃO CADASTRADO'}
                </Text>
              </Card.Content>
            </Card>

            {/* Campo Quantidade */}
            <View style={styles.inputContainer}>
              <TextInput
                label="Quantidade"
                value={quantity}
                onChangeText={setQuantity}
                placeholder="Digite a quantidade"
                mode="outlined"
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Botão Salvar */}
        <View style={styles.saveButtonContainer}>
          <Button
            mode="contained"
            onPress={handleSave}
            disabled={!isFormValid}
            style={[
              styles.saveButton,
              { backgroundColor: theme.colors.primary }
            ]}
            contentStyle={styles.saveButtonContent}
            labelStyle={{ color: theme.colors.onPrimary }}
          >
            Salvar
          </Button>
        </View>
      </ScrollView>

      {/* Modal do Dropdown de Motivos */}
      <Portal>
        <Modal
          visible={showReasonDropdown}
          onDismiss={() => setShowReasonDropdown(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Surface style={styles.modalSurface}>
            <Text variant="headlineSmall" style={styles.modalTitle}>
              Selecione um Motivo
            </Text>
            <FlatList
              data={reasons}
              renderItem={renderReasonItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.modalList}
              showsVerticalScrollIndicator={false}
            />
            <Button
              mode="outlined"
              onPress={() => setShowReasonDropdown(false)}
              style={styles.modalCloseButton}
            >
              Fechar
            </Button>
          </Surface>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Content
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  
  // Botões superiores
  buttonRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  actionButton: {
    flex: 1,
  },
  buttonContent: {
    height: 48,
  },

  // Card do formulário
  formCard: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  
  // Inputs
  inputContainer: {
    marginVertical: 4, // Reduzido de 8 para 4
  },
  inputLabel: {
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: 'transparent',
  },

  // Dropdown de motivos
  dropdownButton: {
    justifyContent: 'flex-start',
  },
  dropdownButtonContent: {
    height: 48,
    justifyContent: 'flex-start',
  },
  selectedChip: {
    marginTop: 4, // Reduzido de 8 para 4
    alignSelf: 'flex-start',
  },

  // Sugestões de produtos
  suggestionsContainer: {
    marginTop: 4,
    borderRadius: 8,
    maxHeight: 200,
  },
  suggestionItem: {
    paddingVertical: 4, // Reduzido de 8 para 4
  },

  // Informações do produto
  productInfoCard: {
    marginVertical: 4, // Reduzido de 8 para 4
  },
  productInfoTitle: {
    marginBottom: 4, // Reduzido de 8 para 4
  },

  // Botão salvar
  saveButtonContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  saveButton: {
    marginTop: 8,
    backgroundColor: 'transparent', // Remove background para usar cor do tema
  },
  saveButtonContent: {
    height: 48,
  },

  // Modal
  modalContainer: {
    margin: 20,
  },
  modalSurface: {
    padding: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  modalList: {
    maxHeight: 300,
  },
  modalCloseButton: {
    marginTop: 16,
  },
  listItem: {
    paddingVertical: 4, // Reduzido de 8 para 4
  },
});

export default HomeScreen;