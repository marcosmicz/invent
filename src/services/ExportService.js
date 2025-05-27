/**
 * Serviço de Exportação de Dados
 * Responsável por exportar dados de inventário para arquivos .txt usando acesso direto ao sistema de arquivos
 */

import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import { expoDbManager } from '../database/expo-manager';

class ExportService {
  /**
   * Gerar nome do arquivo baseado no código do motivo
   */
  generateFileName(reasonCode) {
    const now = new Date();
    const timestamp = now.toISOString()
      .replace(/[-:]/g, '')
      .replace('T', '_')
      .split('.')[0];
    
    return `invent_${reasonCode}_${timestamp}.txt`;
  }

  /**
   * Gerar conteúdo do arquivo
   */
  generateFileContent(entries) {
    return entries.map(entry => {
      const date = new Date(entry.created_at).toISOString()
        .replace('T', ' ')
        .split('.')[0];
      
      return [
        entry.product_code,
        entry.product_name,
        entry.quantity,
        entry.unit_cost.toFixed(2),
        date
      ].join('|');
    }).join('\n');
  }

  /**
   * Realizar exportação completa de dados
   */
  async exportData(baseExportPath) {
    console.log('EXPORT_SERVICE: Iniciando exportação de dados...');
    
    try {
      if (!baseExportPath?.trim()) {
        throw new Error('Caminho de exportação inválido');
      }

      await FileSystem.makeDirectoryAsync(baseExportPath, { 
        intermediates: true 
      });
      
      const reasons = await expoDbManager.getReasons();
      
      if (!reasons || reasons.length === 0) {
        throw new Error('Nenhum motivo encontrado no banco de dados');
      }
      
      console.log(`EXPORT_SERVICE: ${reasons.length} motivos encontrados`);
      
      const results = {
        totalReasons: reasons.length,
        successfulExports: 0,
        failedExports: 0,
        exportedFiles: [],
        errors: [],
        exportPath: baseExportPath
      };
      
      for (const reason of reasons) {
        try {
          const exported = await this.exportReasonData(reason, baseExportPath);
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
      
      this.showExportResults(results);
      return results;
      
    } catch (error) {
      console.error('EXPORT_SERVICE: Erro na exportação:', error);
      throw error;
    }
  }

  /**
   * Exportar dados de um motivo específico
   */
  async exportReasonData(reason, baseExportPath) {
    try {
      console.log(`EXPORT_SERVICE: Processando motivo ${reason.code}`);
      
      const entries = await expoDbManager.getUnsynchronizedEntriesByReason(reason.id);
      
      if (!entries || entries.length === 0) {
        console.log(`EXPORT_SERVICE: Nenhuma entrada para motivo ${reason.code}`);
        return null;
      }
      
      const fileName = this.generateFileName(reason.code);
      const filePath = `${baseExportPath}${fileName}`;
      
      const fileContent = this.generateFileContent(entries);
      await FileSystem.writeAsStringAsync(filePath, fileContent, {
        encoding: FileSystem.EncodingType.UTF8
      });
      
      const entryIds = entries.map(entry => entry.id);
      await expoDbManager.markEntriesAsSynchronized(entryIds);
      
      return {
        reason: reason.code,
        fileName,
        path: filePath,
        entriesCount: entries.length
      };
      
    } catch (error) {
      console.error(`EXPORT_SERVICE: Erro ao exportar motivo ${reason.code}:`, error);
      throw new Error(`Falha na exportação do motivo ${reason.code}: ${error.message}`);
    }
  }

  /**
   * Exibir resultados da exportação
   */
  showExportResults(results) {
    const message = [
      `Motivos processados: ${results.totalReasons}`,
      `Exportações com sucesso: ${results.successfulExports}`,
      `Falhas na exportação: ${results.failedExports}`,
      '',
      'Arquivos exportados:',
      ...results.exportedFiles.map(f => `- ${f.fileName} (${f.entriesCount} entradas)`)
    ];
    
    if (results.errors.length > 0) {
      message.push(
        '',
        'Erros:',
        ...results.errors.map(e => `- ${e.reason}: ${e.error}`)
      );
    }
    
    Alert.alert(
      'Exportação Concluída',
      message.join('\n'),
      [{ text: 'OK' }]
    );
  }
}

export const exportService = new ExportService();
export default exportService;