# 📋 Plano de Correção SQLite - Invent App

## 🎯 **Objetivo**
Corrigir o erro "Cannot convert null value to object" na conexão SQLite e popular as tabelas com dados específicos conforme solicitado pelo usuário.

## 🔍 **Análise do Problema Atual**

### **Erro Identificado:**
```
ERROR Erro na conexão SQLite: Cannot convert null value to object
```

### **Causa Raiz:**
- A configuração atual do `react-native-sqlite-storage` não está usando a sintaxe `createFromLocation: 1`
- Faltam verificações adequadas de valores nulos
- Os dados iniciais não seguem a estrutura específica solicitada

## 📝 **Plano de Implementação**

### **Etapa 1: Corrigir Conexão SQLite**

**Arquivo: `src/database/connection.js`**

Implementar nova função `openDatabase` com:
```javascript
import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

export const openDatabase = async () => {
  try {
    console.log('SQLITE: Tentando abrir banco de dados...');
    
    const db = await SQLite.openDatabase({
      name: 'invent.db',
      createFromLocation: 1, // Criar se não existir
      location: 'default'
    });
    
    console.log('SQLITE: Banco aberto com sucesso');
    return db;
  } catch (error) {
    console.error('SQLITE: Erro ao abrir:', error.message);
    throw new Error(`SQLite connection failed: ${error.message}`);
  }
};
```

**Verificações de Segurança:**
- Adicionar checks para `db !== null` antes de todas as operações
- Implementar try/catch em todas as funções
- Logs detalhados para debug

### **Etapa 2: Atualizar Schema com Dados Específicos**

**Arquivo: `src/database/schema.js`**

**Substituir `INITIAL_REASONS` por:**
```javascript
export const INITIAL_REASONS = [
  {
    id: "1",
    code: "01", 
    description: "Produto Vencido",
    created_at: "2025-05-25T10:02:00-03:00",
    updated_at: "2025-05-25T10:02:00-03:00"
  },
  {
    id: "2",
    code: "02",
    description: "Produto Danificado", 
    created_at: "2025-05-25T10:02:00-03:00",
    updated_at: "2025-05-25T10:02:00-03:00"
  },
  {
    id: "3",
    code: "03",
    description: "Degustação no Depósito",
    created_at: "2025-05-25T10:02:00-03:00", 
    updated_at: "2025-05-25T10:02:00-03:00"
  },
  {
    id: "4",
    code: "04",
    description: "Degustação na Loja",
    created_at: "2025-05-25T10:02:00-03:00",
    updated_at: "2025-05-25T10:02:00-03:00"
  },
  {
    id: "5", 
    code: "05",
    description: "Furto Interno",
    created_at: "2025-05-25T10:02:00-03:00",
    updated_at: "2025-05-25T10:02:00-03:00"
  },
  {
    id: "6",
    code: "06", 
    description: "Furto na Área de Vendas",
    created_at: "2025-05-25T10:02:00-03:00",
    updated_at: "2025-05-25T10:02:00-03:00"
  },
  {
    id: "7",
    code: "07",
    description: "Alimento Produzido para o Refeitório", 
    created_at: "2025-05-25T10:02:00-03:00",
    updated_at: "2025-05-25T10:02:00-03:00"
  },
  {
    id: "8",
    code: "08",
    description: "Furto Não Recuperado",
    created_at: "2025-05-25T10:02:00-03:00",
    updated_at: "2025-05-25T10:02:00-03:00"
  }
];
```

**Adicionar `INITIAL_PRODUCTS`:**
```javascript
export const INITIAL_PRODUCTS = [
  {
    product_code: "7891234567890",
    product_name: "Arroz 5kg", 
    regular_price: 25.99,
    club_price: 22.99,
    unit_type: "UN",
    created_at: "2025-05-25T10:02:00-03:00",
    updated_at: "2025-05-25T10:02:00-03:00"
  },
  {
    product_code: "7891234567891",
    product_name: "Feijão 1kg",
    regular_price: 8.50, 
    club_price: 7.50,
    unit_type: "UN",
    created_at: "2025-05-25T10:02:00-03:00",
    updated_at: "2025-05-25T10:02:00-03:00"
  },
  {
    product_code: "7891234567892",
    product_name: "Tomate",
    regular_price: 5.99,
    club_price: 4.99, 
    unit_type: "KG",
    created_at: "2025-05-25T10:02:00-03:00",
    updated_at: "2025-05-25T10:02:00-03:00"
  }
];
```

### **Etapa 3: Atualizar Database Manager**

**Arquivo: `src/database/index.js`**

**Modificar `insertInitialData()` para:**
```javascript
async insertInitialData() {
  try {
    if (!this.db) {
      throw new Error('Database não inicializado');
    }

    // Verificar reasons
    const reasonsCount = await this.db.getFirstAsync(
      'SELECT COUNT(*) as count FROM reasons'
    );
    
    if (reasonsCount && reasonsCount.count === 0) {
      for (const reason of INITIAL_REASONS) {
        await this.db.runAsync(
          'INSERT INTO reasons (id, code, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
          [reason.id, reason.code, reason.description, reason.created_at, reason.updated_at]
        );
      }
      console.log('SQLITE: Motivos inseridos com sucesso');
    }

    // Verificar products  
    const productsCount = await this.db.getFirstAsync(
      'SELECT COUNT(*) as count FROM products'
    );
    
    if (productsCount && productsCount.count === 0) {
      for (const product of INITIAL_PRODUCTS) {
        await this.db.runAsync(
          'INSERT INTO products (product_code, product_name, regular_price, club_price, unit_type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [product.product_code, product.product_name, product.regular_price, product.club_price, product.unit_type, product.created_at, product.updated_at]
        );
      }
      console.log('SQLITE: Produtos inseridos com sucesso');
    }

    // Log de verificação
    await this.logDataVerification();
    
  } catch (error) {
    console.error('SQLITE: Erro ao inserir dados iniciais:', error);
    throw error;
  }
}
```

**Adicionar função de verificação:**
```javascript
async logDataVerification() {
  try {
    // Verificar reasons
    const reasons = await this.db.getAllAsync('SELECT * FROM reasons');
    console.log('SQLITE: Motivos carregados:', reasons.length);
    reasons.forEach(r => console.log(`- ${r.code}: ${r.description}`));

    // Verificar products
    const products = await this.db.getAllAsync('SELECT * FROM products');
    console.log('SQLITE: Produtos carregados:', products.length);
    products.forEach(p => console.log(`- ${p.product_code}: ${p.product_name}`));
    
  } catch (error) {
    console.error('SQLITE: Erro na verificação:', error);
  }
}
```

### **Etapa 4: Implementar Verificações de Segurança**

**Em todas as funções SQLite:**
```javascript
async getProduct(productCode) {
  try {
    if (!this.db) {
      throw new Error('Database não inicializado');
    }
    
    if (!productCode || typeof productCode !== 'string') {
      return null;
    }
    
    const result = await this.db.getFirstAsync(
      'SELECT * FROM products WHERE product_code = ?',
      [productCode.trim()]
    );
    
    return result || null;
    
  } catch (error) {
    console.error('SQLITE: Erro ao buscar produto:', error);
    return null;
  }
}
```

## 🧪 **Processo de Teste**

### **Verificações Após Implementação:**

1. **Teste de Conexão:**
   - App inicia sem erro "Cannot convert null value to object"
   - Logs mostram "SQLITE: Banco aberto com sucesso"

2. **Teste de Dados:**
   - Console mostra "SQLITE: Motivos carregados: 8"
   - Console mostra "SQLITE: Produtos carregados: 3"
   - Lista todos os motivos e produtos inseridos

3. **Teste Funcional:**
   - Buscar produto "7891234567890" → "Arroz 5kg" 
   - Buscar produto "7891234567891" → "Feijão 1kg"
   - Buscar produto "7891234567892" → "Tomate"

## 📋 **Checklist de Implementação**

- [ ] Atualizar `src/database/connection.js` com `createFromLocation: 1`
- [ ] Atualizar `src/database/schema.js` com dados específicos
- [ ] Modificar `src/database/index.js` com verificações de segurança
- [ ] Adicionar logs detalhados para debug
- [ ] Implementar função de verificação de dados
- [ ] Testar conexão SQLite
- [ ] Verificar inserção de motivos (8 registros)
- [ ] Verificar inserção de produtos (3 registros)
- [ ] Testar busca de produtos por código
- [ ] Confirmar logs no console

## 🎯 **Resultado Esperado**

Após a implementação:
```
✅ SQLITE: Banco aberto com sucesso
✅ SQLITE: Tabelas criadas
✅ SQLITE: Motivos inseridos com sucesso  
✅ SQLITE: Produtos inseridos com sucesso
✅ SQLITE: Motivos carregados: 8
✅ SQLITE: Produtos carregados: 3
✅ Aplicativo inicializado com sucesso
```

## 🔄 **Próximos Passos**

1. **Solicitar mudança para modo Code** para implementar as alterações
2. **Executar as modificações** nos arquivos especificados
3. **Testar a aplicação** e verificar os logs
4. **Confirmar funcionamento** das buscas de produto
5. **Documentar o sucesso** da correção

---

**Status**: ✅ Plano pronto para implementação
**Modo necessário**: 💻 Code (para editar arquivos .js)