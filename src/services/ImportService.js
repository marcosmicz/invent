/**
 * Serviço de Importação de Dados
 * Responsável por importar dados de inventário de arquivos .txt via acesso direto ao sistema de arquivos
 */

import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import { expoDbManager } from '../database/expo-manager';

class ImportService {
  /**
   * Processar linha do arquivo de importação
   * @param {string} line Linha do arquivo
   * @returns {object} Objeto com dados da entrada
   */
  parseLine(line) {
    const [code, name, quantity, cost, date] = line.split('|');
    
    if (!code || !quantity || isNaN(quantity)) {
      throw new Error('Formato de linha inválido');
    }

    return {
      product_code: code.trim(),
      product_name: name?.trim() || 'PRODUTO NÃO CADASTRADO',
      quantity: parseFloat(quantity),
      unit_cost: parseFloat(cost) || 0,
      created_at: date ? new Date(date) : new Date()
    };
  }

  /**
   * Importar dados de um arquivo
   * @param {string} filePath Caminho completo do arquivo a ser importado
   */
  async importDataFromFile(filePath) {
    console.log('IMPORT_SERVICE: Iniciando importação de dados...');

    try {
      // Verificar se arquivo existe
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (!fileInfo.exists) {
        throw new Error('Arquivo não encontrado');
      }

      // Ler conteúdo do arquivo
      const content = await FileSystem.readAsStringAsync(filePath, {
        encoding: FileSystem.EncodingType.UTF8
      });

      // Processar linhas
      const lines = content.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        throw new Error('Arquivo vazio');
      }

      console.log(`IMPORT_SERVICE: Processando ${lines.length} linhas`);

      // Rastrear progresso
      const results = {
        totalLines: lines.length,
        successfulImports: 0,
        failedImports: 0,
        errors: []
      };

      // Processar cada linha
      for (const [index, line] of lines.entries()) {
        try {
          const entryData = this.parseLine(line);
          await expoDbManager.insertEntry(entryData);
          results.successfulImports++;
        } catch (error) {
          console.error(`IMPORT_SERVICE: Erro na linha ${index + 1}:`, error);
          results.failedImports++;
          results.errors.push({
            line: index + 1,
            content: line,
            error: error.message
          });
        }
      }

      // Exibir resultados
      this.showImportResults(results);
      return results;

    } catch (error) {
      console.error('IMPORT_SERVICE: Erro na importação:', error);
      throw error;
    }
  }

  /**
   * Exibir resultados da importação
   */
  showImportResults(results) {
    let message = [
      `Total de linhas: ${results.totalLines}`,
      `Importações com sucesso: ${results.successfulImports}`,
      `Falhas na importação: ${results.failedImports}`
    ];

    if (results.errors.length > 0) {
      message.push(
        '',
        'Erros:',
        ...results.errors.map(e => `- Linha ${e.line}: ${e.error}`)
      );
    }

    Alert.alert(
      'Importação Concluída',
      message.join('\n'),
      [{ text: 'OK' }]
    );
  }
}

// Exportar instância singleton
export const importService = new ImportService();
export default importService;