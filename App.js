import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import { theme } from './src/theme/md3-theme';
import HomeScreen from './src/screens/HomeScreen';
import { expoDbManager } from './src/database/expo-manager';

export default function App() {
  // Inicializar banco de dados quando app carrega
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Inicializando aplicativo...');
        await expoDbManager.initialize();
        console.log('Aplicativo inicializado com sucesso');
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
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="auto" backgroundColor={theme.colors.surface} />
        <HomeScreen />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
