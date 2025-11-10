import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

import WalletScreen from './src/screens/WalletScreen';
import GameScreen from './src/screens/GameScreen';
import MenuScreen from './src/screens/MenuScreen';
import ResultScreen from './src/screens/ResultScreen';

const Stack = createStackNavigator();

const manifestUrl = 'https://your-app.com/tonconnect-manifest.json';

export default function App() {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Menu"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#0b0b2d' },
          }}
        >
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="Wallet" component={WalletScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </TonConnectUIProvider>
  );
}
