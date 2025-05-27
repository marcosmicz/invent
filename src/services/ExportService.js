/**
 * Serviço de Exportação de Dados
 * Responsável por exportar dados de inventário para arquivos .txt usando Storage Access Framework
 */

import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import { expoDbManager } from '../database/expo-manager';

/**
 * Utilitário para validação e manipulação de URIs do SAF
 */
class SafUriHelper {
  /**
   * Verifica se o URI é suportado para escrita
   */
  static isWritableUri(uri) {
    if (!uri) return false;
    
    // Validar formato básico do URI
    try {
      const isContentUri = uri.startsWith('content://');
      if (!isContentUri) return false;
      
      // Verificar se é um URI do MiXplorer (pode requerer tratamento especial)
      const isMixplorer = uri.includes('com.mixplorer');
      
      // Evitar URIs problemáticos conhecidos
      const hasInvalidChars = /[<>:"|?*]/.test(uri);
      
      return !hasInvalidChars;
    } catch (error) {
      console.error('SAFE_URI_HELPER: Erro ao validar URI:', error);
      return false;
    }
  }

  /**
   * Tenta normalizar o URI para um formato compatível
   */
  static normalizeUri(uri) {
    if (!uri) return null;
    
    try {
      // Remover caracteres problemáticos
      let normalized = uri.replace(/[<>:"|?*]/g, '_');
      
      // Garantir que começa com content://
      if (!normalized.startsWith('content://')) {
        normalized = `content://${normalized}`;
      }
      
      return normalized;
    } catch (error) {
      console.error('SAFE_URI_HELPER: Erro ao normalizar URI:', error);
      return null;
    }
  }
}

class ExportService {
  /**
   * Verifica se tem permissão de escrita no diretório
   */
  async verifyWritePermission(uri) {
    try {
      console.log('EXPORT_SERVICE: Verificando permissão de escrita para:', uri);
      
      // Verificar formato do URI
      if (!SafUriHelper.isWritableUri(uri)) {
        throw new Error('URI inválido ou não suportado para escrita');
      }
      
      // Tentar criar um arquivo de teste
      const testFile = 'test_permission.txt';
      await FileSystem.StorageAccessFramework
        .createFileAsync(uri, testFile, 'text/plain')
        .catch(() => { throw new Error('Sem permissão de escrita no diretório'); });
      
      // Se chegou aqui, tem permissão de escrita
      return true;
      
    } catch (error) {
      console.error('EXPORT_SERVICE: Erro ao verificar permissão:', error);
      throw error;
    }
  }

  /**
   * Tenta criar arquivo com retry em caso de erro
   */
  async createSafFileWithRetry(dirUri, fileName, content, maxRetries = 3) {
    let lastError = null;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        console.log(`EXPORT_SERVICE: Tentativa ${i + 1} de criar arquivo ${fileName}`);
        
        // Tentar criar normalmente primeiro
        const fileUri = await FileSystem.StorageAccessFramework
          .createFileAsync(dirUri, fileName, 'text/plain');
        
        // Se criou o arquivo, tentar escrever o conteúdo
        await FileSystem.writeAsStringAsync(fileUri, content, {
          encoding: FileSystem.EncodingType.UTF8
        });
        
        console.log('EXPORT_SERVICE: Arquivo criado com sucesso:', fileUri);
        return fileUri;
        
      } catch (error) {
        console.warn(`EXPORT_SERVICE: Falha na tentativa ${i + 1}:`, error);
        lastError = error;
        
        // Se for erro de URI, tentar normalizar
        if (error.message.includes('Location') || error.message.includes('URI')) {
          dirUri = SafUriHelper.normalizeUri(dirUri);
          if (!dirUri) break; // Se não conseguir normalizar, desistir
        }
        
        // Esperar um pouco antes da próxima tentativa
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    throw new Error(`Falha ao criar arquivo após ${maxRetries} tentativas: ${lastError?.message}`);
  }

  /**
   * Realizar exportação completa de dados
   */
  async exportData() {
    console.log('EXPORT_SERVICE: Iniciando exportação de dados...');
    
    try {
      // Solicitar permissão e selecionar diretório via SAF
      const permissionResult = await FileSystem.StorageAccessFramework
        .requestDirectoryPermissionsAsync();
      
      if (!permissionResult.granted) {
        throw new Error('Permissão de acesso ao diretório negada');
      }
      
      const dirUri = permissionResult.directoryUri;
      console.log(`EXPORT_SERVICE: Diretório selecionado: ${dirUri}`);
      
      // Validar URI e verificar permissões de escrita
      if (!SafUriHelper.isWritableUri(dirUri)) {
        throw new Error('O diretório selecionado não é suportado para escrita. Por favor, escolha outro local ou use um gerenciador de arquivos diferente.');
      }
      
      // Verificar permissões explicitamente
      await this.verifyWritePermission(dirUri);
      
      // Realizar migração se necessário
      await expoDbManager.migrateExistingEntries();
      
      // Buscar todos os motivos cadastrados
      const reasons = await expoDbManager.getReasons();
      
      if (!reasons || reasons.length === 0) {
        throw new Error('Nenhum motivo encontrado no banco de dados');
      }
      
      console.log(`EXPORT_SERVICE: ${reasons.length} motivos encontrados`);
      
      // Processar cada motivo independentemente
      const results = {
        totalReasons: reasons.length,
        successfulExports: 0,
        failedExports: 0,
        exportedFiles: [],
        errors: [],
        directoryUri: dirUri
      };
      
      for (const reason of reasons) {
        try {
          const exported = await this.exportReasonData(reason, dirUri);
          if (exported) {
            results.successfulExports++;
            results.exportedFiles.push(exported);
          }
        } catch (error) {
          console.error(`EXPORT_SERVICE: Erro ao exportar motivo ${reason.code}:`, error);
          results.failedExports++;
          results.errors.push({
            reason: reason.code,
            error: error.message
          });
        }
      }
      
      // Exibir resultado final
      this.showExportResults(results);
      
      return results;
      
    } catch (error) {
      console.error('EXPORT_SERVICE: Erro na exportação:', error);
      
      // Melhorar mensagem de erro global
      let title = 'Erro na Exportação';
      let errorMessage = 'Ocorreu um erro durante a exportação';
      
      if (error.message.includes('não é suportado')) {
        title = 'Local Não Suportado';
        errorMessage = error.message;
      } else if (error.message.includes('permissão')) {
        title = 'Permissão Negada';
        errorMessage = 'O aplicativo não tem permissão para salvar arquivos no local escolhido. ' +
                      'Por favor, selecione outro diretório.';
      } else if (error.message.includes('Location')) {
        title = 'Local Não Gravável';
        errorMessage = 'Não é possível gravar arquivos no local selecionado. ' +
                      'Tente escolher outro diretório ou use um gerenciador de arquivos diferente.';
      } else {
        errorMessage += `: ${error.message}`;
      }
      
      Alert.alert(title, errorMessage, [{ text: 'OK' }]);
      throw error;
    }
  }
  
  /**
   * Exportar dados de um motivo específico
   */
  /**
   * Exportar dados de um motivo específico
   */
  async exportReasonData(reason, dirUri) {
    try {
      console.log(`EXPORT_SERVICE: Processando motivo ${reason.code} - ${reason.description}`);
      
      // Buscar entradas não sincronizadas para este motivo
      const entries = await expoDbManager.getUnsynchronizedEntriesByReason(reason.id);
      
      if (!entries || entries.length === 0) {
        console.log(`EXPORT_SERVICE: Nenhuma entrada pendente para motivo ${reason.code}`);
        return null;
      }
      
      console.log(`EXPORT_SERVICE: ${entries.length} entradas encontradas para motivo ${reason.code}`);
      
      // Gerar nome do arquivo
      const fileName = this.generateFileName(reason.code);
      
      // Gerar conteúdo do arquivo
      const fileContent = this.generateFileContent(entries);
      
      // Criar arquivo com retry em caso de erro
      const fileUri = await this.createSafFileWithRetry(dirUri, fileName, fileContent);
      
      // Se chegou aqui, arquivo foi criado com sucesso
      // Marcar entradas como sincronizadas
      const entryIds = entries.map(entry => entry.id);
      await expoDbManager.markEntriesAsSynchronized(entryIds);
      
      return {
        reason: reason.code,
        fileName: fileName,
        fileUri: fileUri,
        entriesCount: entries.length
      };
      
    } catch (error) {
      console.error(`EXPORT_SERVICE: Erro ao exportar motivo ${reason.code}:`, error);
      
      // Melhorar mensagem de erro para o usuário
      let errorMessage = `Falha na exportação do motivo ${reason.code}`;
      if (error.message.includes('Location')) {
        errorMessage += ': O diretório selecionado não permite escrita';
      } else if (error.message.includes('permission')) {
        errorMessage += ': Sem permissão para salvar no local escolhido';
      } else {
        errorMessage += `: ${error.message}`;
      }
      
      throw new Error(errorMessage);
    }
  }
  
  /**
   * Gerar nome do arquivo com padrão motivoXX_YYYYMMDD.txt
   */
  generateFileName(reasonCode) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    const dateStr = `${year}${month}${day}`;
    const paddedCode = reasonCode.padStart(2, '0');
    
    return `motivo${paddedCode}_${dateStr}.txt`;
  }
  
  /**
   * Gerar conteúdo do arquivo no formato especificado
   */
  generateFileContent(entries) {
    const lines = entries.map(entry => {
      // Formato: "Inventario [product_code] [quantity]"
      return `Inventario ${entry.product_code} ${entry.quantity}`;
    });
    
    // Adicionar quebra de linha no final
    return lines.join('\n') + '\n';
  }
  
  /**
   * Exibir resultados da exportação
   */
  showExportResults(results) {
    const { totalReasons, successfulExports, failedExports, exportedFiles, errors, directoryUri } = results;
    
    if (successfulExports === 0 && failedExports === 0) {
      Alert.alert(
        'Exportação Concluída',
        'Nenhuma entrada pendente encontrada para exportação.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    let message = `Exportação concluída!\n\n`;
    message += `• Motivos processados: ${totalReasons}\n`;
    message += `• Exportações bem-sucedidas: ${successfulExports}\n`;
    
    if (failedExports > 0) {
      message += `• Falhas: ${failedExports}\n`;
    }
    
    if (exportedFiles.length > 0) {
      message += `\nArquivos gerados:\n`;
      exportedFiles.forEach(file => {
        message += `• ${file.fileName} (${file.entriesCount} entradas)\n`;
      });
    }
    
    if (errors.length > 0) {
      message += `\nErros encontrados:\n`;
      errors.forEach(error => {
        message += `• Motivo ${error.reason}: ${error.error}\n`;
      });
    }
    
    message += `\nArquivos salvos em:\n${directoryUri}`;
    
    Alert.alert(
      successfulExports > 0 ? 'Exportação Realizada' : 'Exportação com Problemas',
      message,
      [{ text: 'OK' }]
    );
  }
}

// Exportar instância singleton
export const exportService = new ExportService();
export default exportService;

//