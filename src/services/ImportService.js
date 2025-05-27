/**
 * Serviço de Importação de Dados
 * Responsável por importar dados de inventário de arquivos .txt usando acesso direto ao sistema de arquivos
 */

import * as FileSystem from 'expo-file-system';
import { Alert, Platform } from 'react-native';
import { expoDbManager } from '../database/expo-manager';

class ImportService {
  /**
   * Obter diretório base de acordo com a versão do Android
   */
  /**
   * Obter diretório base de importação
   */
  getBaseDirectory(customPath = '') {
    // Se fornecido caminho customizado, usar ele
    if (customPath.trim()) {
      return customPath;
    }

    // Usar diretório Download do app
    return `${FileSystem.cacheDirectory}Download/Invent/`;
  }

  /**
   * Validar formato do arquivo
   */
  validateFileContent(content) {
    if (!content.trim()) {
      throw new Error('Arquivo vazio');
    }

    const lines = content.trim().split('\n');
    const invalidLines = lines.filter(line => {
      const parts = line.split('|');
      return parts.length !== 5 || !parts[0] || !parts[1] || isNaN(parts[2]) || isNaN(parts[3]);
    });

    if (invalidLines.length > 0) {
      throw new Error('Formato de arquivo inválido');
    }

    return lines;
  }

  /**
   * Processar linha do arquivo
   */
  async processLine(line) {
    const [productCode, productName, quantity, unitCost, date] = line.split('|');

    // Verificar se produto existe
    let product = await expoDbManager.getProductByCode(productCode);
    if (!product) {
      // Criar produto se não existir
      product = await expoDbManager.createProduct({
        product_code: productCode,
        product_name: productName
      });
    }

    // Criar entrada
    const entry = {
      product_code: productCode,
      product_name: productName,
      quantity: parseFloat(quantity),
      unit_cost: parseFloat(unitCost),
      total_cost: parseFloat(quantity) * parseFloat(unitCost),
      reason_id: 1, // Motivo padrão para importação
      notes: `Importado em ${new Date().toISOString()}`,
      created_at: date ? new Date(date) : new Date()
    };

    await expoDbManager.createEntry(entry);
    return entry;
  }

  /**
   * Importar dados de um arquivo
   */
  async importDataFromFile(filePath) {
    console.log('IMPORT_SERVICE: Iniciando importação:', filePath);
    
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

      // Validar formato
      const lines = this.validateFileContent(content);
      console.log(`IMPORT_SERVICE: ${lines.length} linhas para processar`);

      // Processar cada linha
      const results = {
        totalLines: lines.length,
        processedLines: 0,
        failedLines: 0,
        errors: []
      };

      for (const line of lines) {
        try {
          await this.processLine(line);
          results.processedLines++;
        } catch (error) {
          console.error('IMPORT_SERVICE: Erro processando linha:', error);
          results.failedLines++;
          results.errors.push({
            line,
            error: error.message
          });
        }
      }

      this.showImportResults(results);
      return results;

    } catch (error) {
      console.error('IMPORT_SERVICE: Erro na importação:', error);
      Alert.alert(
        'Erro na Importação',
        `Falha ao importar arquivo: ${error.message}`,
        [{ text: 'OK' }]
      );
      throw error;
    }
  }

  /**
   * Exibir resultados da importação
   */
  showImportResults(results) {
    const message = [
      `Total de linhas: ${results.totalLines}`,
      `Linhas processadas: ${results.processedLines}`,
      `Falhas: ${results.failedLines}`
    ];

    if (results.errors.length > 0) {
      message.push(
        '',
        'Erros:',
        ...results.errors.slice(0, 5).map(e => `- ${e.error}: ${e.line}`)
      );

      if (results.errors.length > 5) {
        message.push(`...e mais ${results.errors.length - 5} erros`);
      }
    }

    Alert.alert(
      'Importação Concluída',
      message.join('\n'),
      [{ text: 'OK' }]
    );
  }
}

export const importService = new ImportService();
export default importService;