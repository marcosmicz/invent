/**
 * Serviço de Gerenciamento de Permissões
 * Responsável por verificar e solicitar permissões de armazenamento
 */

import { Alert, PermissionsAndroid, Platform } from 'react-native';

class PermissionService {
  /**
   * Verifica e solicita permissões de armazenamento
   */
  async checkAndRequestStoragePermissions() {
    // Não precisa mais verificar permissões já que usa diretório interno
    console.log('PERMISSION_SERVICE: Usando diretório interno do app, sem necessidade de permissões');
    return true;
  }

  /**
   * Exibe alerta de permissão negada
   */
  showPermissionDeniedAlert() {
    // Não é mais necessário mostrar alerta de permissão negada
    return;
  }
}

export const permissionService = new PermissionService();
export default permissionService;