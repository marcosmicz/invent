# Implementação do Storage Access Framework

## Visão Geral

Adaptação do sistema de exportação para usar o Storage Access Framework (SAF) do expo-file-system, permitindo que o usuário escolha o diretório de salvamento dos arquivos .txt.

## Fluxo de Exportação

```mermaid
sequenceDiagram
    participant U as Usuário
    participant H as HomeScreen
    participant E as ExportService
    participant DB as ExpoDbManager
    participant SAF as Storage Access Framework

    U->>H: Clica em Exportar
    H->>U: Confirma exportação
    U->>H: Confirma
    H->>E: handleExport()
    E->>SAF: Solicita permissão do diretório
    SAF->>U: Abre seletor de diretório
    U->>SAF: Seleciona diretório
    SAF->>E: Retorna URI do diretório
    E->>DB: Busca motivos
    DB->>E: Lista de motivos
    loop Para cada motivo
        E->>DB: Busca entradas não sincronizadas
        DB->>E: Entradas do motivo
        E->>E: Gera nome do arquivo (motivoXX_YYYYMMDD.txt)
        E->>E: Gera conteúdo do arquivo
        E->>SAF: Cria arquivo no diretório escolhido
        E->>DB: Marca entradas como sincronizadas
    end
    E->>H: Retorna resultado
    H->>U: Exibe resultado da exportação
```

## Mudanças Necessárias

### 1. ExportService.js

#### Métodos a Remover
- createBaseDirectories()
- createReasonDirectory()
- checkExistingStructure()
- listExportedFiles()

#### Métodos a Atualizar

**exportData()**
- Adicionar solicitação de permissão via SAF
- Tratar cancelamento/negação de permissão
- Usar URI retornado para salvar arquivos
- Remover criação de estrutura de diretórios

**showExportResults()**
- Incluir URI do diretório escolhido no log
- Atualizar mensagem para refletir novo local de salvamento

#### Métodos a Manter
- generateFileName()
- generateFileContent()

### 2. HomeScreen.js

#### Atualizar handleExport()
- Adicionar alerta inicial sobre seleção de diretório
- Tratar cancelamentos e erros de permissão
- Manter feedback existente para sucesso/erro

### 3. Componentes Mantidos Sem Alteração

- Funções do expoDbManager:
  * getReasons()
  * getUnsynchronizedEntriesByReason()
  * markEntriesAsSynchronized()
- Formato dos arquivos .txt
- Nomenclatura dos arquivos (motivoXX_YYYYMMDD.txt)
- Lógica de sincronização de dados

## Tratamento de Erros

1. Permissão negada pelo usuário
2. Cancelamento da seleção de diretório
3. Falha na criação de arquivos
4. Erros de acesso ao diretório selecionado

## Feedback ao Usuário

1. Alerta inicial para seleção de diretório
2. Mensagens claras para erros de permissão
3. Progresso da exportação
4. Resultado final com local dos arquivos (URI)

## Compatibilidade

- Android: Uso direto do SAF
- iOS: Fallback para document picker padrão