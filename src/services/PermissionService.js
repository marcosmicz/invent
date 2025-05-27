/**
 * Serviço de Gerenciamento de Permissões
 * Responsável por verificar e solicitar permissões de armazenamento
 */

import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { NativeModules } from 'react-native';

const { RNManageExternalStorage } = NativeModules;

class PermissionService {
  constructor() {
    this.isInitialized = false;
  }

  /**
   * Inicializa o serviço de permissões
   */
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      if (Platform.Version >= 30) {
        await RNManageExternalStorage.initialize();
      }
      this.isInitialized = true;
    } catch (error) {
      console.error('PERMISSION_SERVICE: Error initializing:', error);
      throw error;
    }
  }

  /**
   * Verifica e solicita permissões de armazenamento de acordo com a versão do Android
   */
  async checkAndRequestStoragePermissions() {
    try {
      await this.initialize();

      const androidVersion = Platform.Version;
      console.log('PERMISSION_SERVICE: Android version:', androidVersion);

      if (androidVersion >= 30) {
        console.log('PERMISSION_SERVICE: Using MANAGE_EXTERNAL_STORAGE');
        
        const hasPermission = await RNManageExternalStorage.isGranted();
        if (hasPermission) {
          console.log('PERMISSION_SERVICE: MANAGE_EXTERNAL_STORAGE already granted');
          return true;
        }
        
        console.log('PERMISSION_SERVICE: Requesting MANAGE_EXTERNAL_STORAGE...');
        const granted = await RNManageExternalStorage.requestExternalStoragePermission();
        
        if (granted) {
          console.log('PERMISSION_SERVICE: MANAGE_EXTERNAL_STORAGE granted');
          return true;
        }
        
        console.log('PERMISSION_SERVICE: MANAGE_EXTERNAL_STORAGE denied');
        return false;
      } else {
        // Android 10 - usar permissões legadas
        console.log('PERMISSION_SERVICE: Using legacy storage permissions');
        
        // Verificar permissão de escrita
        const hasWritePermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        
        if (hasWritePermission) {
          console.log('PERMISSION_SERVICE: WRITE_EXTERNAL_STORAGE already granted');
          return true;
        }
        
        // Solicitar permissão
        console.log('PERMISSION_SERVICE: Requesting WRITE_EXTERNAL_STORAGE...');
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Permissão de Armazenamento',
            message: 'O aplicativo precisa de acesso ao armazenamento para importar/exportar dados.',
            buttonPositive: 'OK'
          }
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('PERMISSION_SERVICE: WRITE_EXTERNAL_STORAGE granted');
          return true;
        }
        
        console.log('PERMISSION_SERVICE: WRITE_EXTERNAL_STORAGE denied');
        return false;
      }
    } catch (error) {
      console.error('PERMISSION_SERVICE: Error checking/requesting permissions:', error);
      return false;
    }
  }

  /**
   * Exibe alerta de permissão negada
   */
  showPermissionDeniedAlert() {
    Alert.alert(
      'Permissão Necessária',
      'O acesso ao armazenamento é necessário para importação/exportação de dados. Por favor, conceda a permissão nas configurações do app.',
      [{ text: 'OK' }]
    );
  }
}

// Exportar instância singleton
export const permissionService = new PermissionService();
export default permissionService;