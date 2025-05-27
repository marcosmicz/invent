/**
 * Serviço de Exportação de Dados
 * Responsável por exportar dados de inventário para arquivos .txt usando Storage Access Framework
 */

import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import { expoDbManager } from '../database/expo-manager';

class ExportService {
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
      Alert.alert(
        'Erro na Exportação',
        `Ocorreu um erro durante a exportação: ${error.message}`,
        [{ text: 'OK' }]
      );
      throw error;
    }
  }
  
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
      
      // Criar arquivo no diretório selecionado usando SAF
      const fileUri = await FileSystem.StorageAccessFramework
        .createFileAsync(dirUri, fileName, 'text/plain');
      
      // Salvar conteúdo no arquivo
      await FileSystem.writeAsStringAsync(fileUri, fileContent, {
        encoding: FileSystem.EncodingType.UTF8
      });
      
      console.log(`EXPORT_SERVICE: Arquivo criado: ${fileUri}`);
      
      // Marcar entradas como sincronizadas apenas após sucesso na gravação
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
      throw new Error(`Falha na exportação do motivo ${reason.code}: ${error.message}`);
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
