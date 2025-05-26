# Workflow de Desenvolvimento - Projeto React Native 'invent'

## Opções de Execução do Projeto

### 1. **Emulador Android (Recomendado para desenvolvimento)**

#### ✅ **Vantagens:**
- **Debug completo:** Acesso a todas as ferramentas de desenvolvimento
- **Hot Reload:** Mudanças em tempo real no código
- **DevTools:** React Native Debugger, Flipper, Chrome DevTools
- **SQLite Inspector:** Visualizar banco de dados em tempo real
- **Performance testing:** Testes de performance realistas
- **Logs completos:** Console.log e erros detalhados

#### **Como executar:**
```bash
# Iniciar o emulador Android primeiro
# Depois executar o projeto
npx expo run:android
```

#### **Configuração do Emulador:**
- **API Level:** 34, 35 ou 36 (compatível com seu SDK)
- **RAM:** Mínimo 4GB para performance adequada
- **Storage:** 8GB+ para instalar dependências
- **GPU:** Hardware acceleration habilitada

### 2. **Dispositivo Android Físico**

#### ✅ **Vantagens:**
- **Performance real:** Teste em hardware real
- **Sensores reais:** GPS, câmera, acelerômetro
- **Conectividade real:** WiFi, dados móveis
- **Experiência do usuário real**

#### **Como executar:**
```bash
# Ativar USB Debugging no dispositivo
# Conectar via USB ou WiFi
npx expo run:android
```

#### **Configuração necessária:**
- **Developer Options** habilitadas
- **USB Debugging** ativado
- **Install via USB** permitido

### 3. **Expo Go (Limitado para Bare Workflow)**

#### ❌ **Limitações:**
- **Bare Workflow:** Expo Go não suporta bibliotecas nativas customizadas
- **SQLite:** Como você vai usar expo-sqlite, pode não funcionar no Expo Go
- **Funcionalidades limitadas:** Apenas JavaScript puro

## Workflow Recomendado para Seu Projeto

### **Desenvolvimento Principal: Emulador Android**

```bash
# 1. Iniciar emulador Android
# (via Android Studio ou linha de comando)

# 2. Executar o projeto
npx expo run:android

# 3. Para development server separado (opcional)
npx expo start --dev-client
```

### **Comandos de Desenvolvimento:**

#### **Primeira execução:**
```bash
# Instalar dependências
npm install

# Executar no Android (primeira vez compila tudo)
npx expo run:android
```

#### **Desenvolvimento diário:**
```bash
# Executar rapidamente (hot reload ativo)
npx expo start --dev-client --android
```

#### **Debug avançado:**
```bash
# Com logs detalhados
npx expo run:android --verbose

# Para desenvolvimento com networking
npx expo start --dev-client --tunnel
```

## Ferramentas de Debug Recomendadas

### 1. **React Native Debugger**
- Interface visual para debug
- Redux DevTools integrado
- Network inspector
- Element inspector

### 2. **Flipper (Meta)**
- Debug nativo Android
- SQLite inspector (perfeito para seu projeto)
- Network inspector
- Layout inspector

### 3. **Chrome DevTools**
- Debug JavaScript
- Console.log em tempo real
- Network requests
- Source maps

## Debug Específico para SQLite

### **Visualizar banco de dados:**
```javascript
// Adicionar no código para debug
const logDatabasePath = async () => {
  const db = await dbManager.getDatabase();
  console.log('Database path:', db._db._path);
};
```

### **Ferramentas SQLite:**
- **DB Browser for SQLite:** Abrir arquivo .db diretamente
- **Flipper SQLite Plugin:** Visualizar em tempo real
- **adb shell:** Acessar banco via terminal

### **Comandos adb úteis:**
```bash
# Listar dispositivos
adb devices

# Logs em tempo real
adb logcat | grep ReactNative

# Acessar shell do app
adb shell run-as com.invent
```

## Hot Reload e Fast Refresh

### **Como funciona:**
- **Fast Refresh:** Mudanças em componentes React
- **Hot Reload:** Mudanças em JavaScript geral
- **Full Reload:** Mudanças em arquivos nativos

### **Atalhos úteis:**
- **R + R:** Reload manual
- **Ctrl + M:** Menu de desenvolvimento
- **Shake device:** Menu de desenvolvimento (dispositivo físico)

## Workflow para Testes SQLite

### **Desenvolvimento iterativo:**
```bash
# 1. Executar app no emulador
npx expo run:android

# 2. Fazer mudanças no código SQLite
# (src/database/...)

# 3. Hot reload automático
# OU forçar reload: R + R

# 4. Verificar logs no terminal
# console.log aparece automaticamente
```

### **Debug de queries:**
```javascript
// Adicionar logs temporários para debug
const debugQuery = async (query, params) => {
  console.log('Executing query:', query);
  console.log('With params:', params);
  const result = await db.runAsync(query, params);
  console.log('Query result:', result);
  return result;
};
```

## Configuração Recomendada

### **Para desenvolvimento eficiente:**

1. **Emulador Android** como principal
2. **React Native Debugger** para interface
3. **Flipper** para SQLite
4. **Hot Reload** sempre ativo
5. **Metro bundler** em terminal separado

### **Scripts package.json sugeridos:**
```json
{
  "scripts": {
    "start": "expo start --dev-client",
    "android": "expo run:android",
    "android:debug": "expo run:android --variant debug",
    "android:release": "expo run:android --variant release",
    "clean": "expo r -c",
    "test": "jest",
    "db:reset": "adb shell run-as com.invent rm databases/invent.db"
  }
}
```

## Resposta Direta às Suas Perguntas

### **Precisa rodar no emulador?**
✅ **SIM, é a melhor opção** para desenvolvimento com SQLite:
- Debug completo do banco de dados
- Hot reload para mudanças rápidas
- Ferramentas de desenvolvimento completas

### **Como executar em tempo real?**
```bash
# Comando principal
npx expo run:android

# Depois disso, hot reload está ativo
# Qualquer mudança no código reflete automaticamente
```

### **Para debugar/alterar:**
- **Logs:** Aparecem automaticamente no terminal
- **Breakpoints:** Via React Native Debugger
- **SQLite:** Via Flipper ou logs no código
- **Hot Reload:** Mudanças instantâneas

---

**Recomendação:** Use emulador Android como ambiente principal de desenvolvimento. É a melhor combinação de performance, ferramentas de debug e produtividade para seu projeto SQLite.