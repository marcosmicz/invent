import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from '@react-native-material/core';
import { Alert } from 'react-native';
import { materialTheme } from './src/theme';
import HomeScreen from './src/screens/HomeScreen';
import { expoDbManager } from './src/database/expo-manager';
import { permissionService } from './src/services/PermissionService';

export default function App() {
  // Estado para permissões de armazenamento
  const [storagePermissionGranted, setStoragePermissionGranted] = useState(false);

  // Inicializar app e verificar permissões
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Inicializando aplicativo...');
        
        // Inicializar banco de dados
        await expoDbManager.initialize();
        console.log('Aplicativo inicializado com sucesso');
        
        try {
          // Verificar permissões de armazenamento
          await permissionService.initialize();
          const granted = await permissionService.checkAndRequestStoragePermissions();
          setStoragePermissionGranted(granted);
          
          if (!granted) {
            permissionService.showPermissionDeniedAlert();
          }
        } catch (error) {
          console.error('APP: Error checking storage permissions:', error);
          setStoragePermissionGranted(false);
          Alert.alert(
            'Erro de Permissão',
            'Não foi possível verificar as permissões de armazenamento. Algumas funcionalidades podem não estar disponíveis.',
            [{ text: 'OK' }]
          );
        }
        
      } catch (error) {
        console.error('Erro ao inicializar aplicativo:', error);
        Alert.alert(
          'Erro de Inicialização',
          'Falha ao inicializar o banco de dados. O app pode não funcionar corretamente.'
        );
      }
    };

    initializeApp();
  }, []);

  return (
    <Provider theme={materialTheme}>
      <StatusBar style="light" backgroundColor="#6200EE" />
      <HomeScreen storagePermissionGranted={storagePermissionGranted} />
    </Provider>
  );
}
