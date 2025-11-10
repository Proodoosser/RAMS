import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../store/gameStore';
import SoundService from '../services/SoundService';

const { width, height } = Dimensions.get('window');

export default function MenuScreen({ navigation }: any) {
  const { userBalance, loadUserData } = useGameStore();

  useEffect(() => {
    loadUserData();
    SoundService.initialize();
  }, []);

  const handleStartGame = () => {
    SoundService.playSound('bet');
    SoundService.vibrate('medium');
    navigation.navigate('Game');
  };

  const handleWallet = () => {
    SoundService.playSound('chip');
    SoundService.vibrate('light');
    navigation.navigate('Wallet');
  };

  return (
    <LinearGradient
      colors={['#0b0b2d', '#1a1a4a', '#2a2a6a']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Заголовок */}
        <View style={styles.header}>
          <Text style={styles.title}>🚀 КОСМИЧЕСКИЙ</Text>
          <Text style={styles.subtitle}>РАМС</Text>
        </View>

        {/* Баланс */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Ваш баланс</Text>
          <LinearGradient
            colors={['#6a11cb', '#2575fc']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.balanceBox}
          >
            <Text style={styles.balanceAmount}>{userBalance.toFixed(2)} ₽</Text>
          </LinearGradient>
        </View>

        {/* Кнопки меню */}
        <View style={styles.menuButtons}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleStartGame}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#6a11cb', '#2575fc']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>🎮 Начать игру</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleWallet}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>💰 Кошелёк</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>📖 Правила</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>⚙️ Настройки</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Информация */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💎 Выигрывайте взятки и зарабатывайте очки
          </Text>
          <Text style={styles.infoText}>
            🎯 Делайте ставки и удваивайте выигрыш
          </Text>
          <Text style={styles.infoText}>
            🏆 Станьте лучшим игроком в Рамс
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#ffffff',
    textShadowColor: 'rgba(106, 17, 203, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#ffffff',
    textShadowColor: 'rgba(37, 117, 252, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 4,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  balanceLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 10,
  },
  balanceBox: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#6a11cb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  menuButtons: {
    gap: 15,
    marginBottom: 30,
  },
  button: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  infoBox: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    padding: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
});
