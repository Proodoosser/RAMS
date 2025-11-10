import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../store/gameStore';
import TonWalletService from '../services/TonWalletService';
import SoundService from '../services/SoundService';

export default function WalletScreen({ navigation }: any) {
  const { userBalance, tonWalletAddress, connectWallet, depositFunds, withdrawFunds } = useGameStore();
  const [walletInput, setWalletInput] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConnectWallet = async () => {
    if (!walletInput.trim()) {
      Alert.alert('Ошибка', 'Введите адрес кошелька');
      return;
    }

    setIsLoading(true);
    const success = await TonWalletService.connectWallet(walletInput);
    setIsLoading(false);

    if (success) {
      connectWallet(walletInput);
      SoundService.playSound('win');
      SoundService.vibrate('success');
      Alert.alert('Успех', 'Кошелёк подключен!');
    } else {
      SoundService.vibrate('error');
      Alert.alert('Ошибка', 'Неверный адрес кошелька');
    }
  };

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Ошибка', 'Введите корректную сумму');
      return;
    }

    if (!tonWalletAddress) {
      Alert.alert('Ошибка', 'Сначала подключите кошелёк');
      return;
    }

    setIsLoading(true);
    const success = await TonWalletService.deposit(amount);
    setIsLoading(false);

    if (success) {
      depositFunds(amount);
      SoundService.playSound('chip');
      SoundService.vibrate('success');
      Alert.alert('Успех', `Пополнено на ${amount} TON`);
      setDepositAmount('');
    } else {
      SoundService.vibrate('error');
      Alert.alert('Ошибка', 'Не удалось выполнить депозит');
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Ошибка', 'Введите корректную сумму');
      return;
    }

    if (amount > userBalance) {
      Alert.alert('Ошибка', 'Недостаточно средств');
      return;
    }

    if (!tonWalletAddress) {
      Alert.alert('Ошибка', 'Сначала подключите кошелёк');
      return;
    }

    setIsLoading(true);
    const success = await TonWalletService.withdraw(amount);
    setIsLoading(false);

    if (success) {
      withdrawFunds(amount);
      SoundService.playSound('chip');
      SoundService.vibrate('success');
      Alert.alert('Успех', `Выведено ${amount} TON`);
      setWithdrawAmount('');
    } else {
      SoundService.vibrate('error');
      Alert.alert('Ошибка', 'Не удалось выполнить вывод');
    }
  };

  return (
    <LinearGradient colors={['#0b0b2d', '#1a1a4a']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Заголовок */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Назад</Text>
          </TouchableOpacity>
          <Text style={styles.title}>💰 Кошелёк</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Баланс */}
        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>Игровой баланс</Text>
          <LinearGradient
            colors={['#6a11cb', '#2575fc']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.balanceBox}
          >
            <Text style={styles.balanceAmount}>{userBalance.toFixed(2)} ₽</Text>
          </LinearGradient>
        </View>

        {/* Подключение кошелька */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Подключить TON кошелёк</Text>
          {tonWalletAddress ? (
            <View style={styles.connectedWallet}>
              <Text style={styles.connectedText}>✅ Подключен</Text>
              <Text style={styles.walletAddress} numberOfLines={1}>
                {tonWalletAddress}
              </Text>
              <TouchableOpacity
                style={styles.disconnectButton}
                onPress={() => {
                  TonWalletService.disconnectWallet();
                  connectWallet('');
                  Alert.alert('Успех', 'Кошелёк отключен');
                }}
              >
                <Text style={styles.disconnectText}>Отключить</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <TextInput
                style={styles.input}
                value={walletInput}
                onChangeText={setWalletInput}
                placeholder="Введите адрес TON кошелька"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.button} onPress={handleConnectWallet}>
                <LinearGradient
                  colors={['#6a11cb', '#2575fc']}
                  style={styles.buttonGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Подключить</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Пополнение */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Пополнить баланс</Text>
          <TextInput
            style={styles.input}
            value={depositAmount}
            onChangeText={setDepositAmount}
            placeholder="Сумма в TON"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          <View style={styles.quickAmounts}>
            {[1, 5, 10, 50].map((amount) => (
              <TouchableOpacity
                key={amount}
                style={styles.quickButton}
                onPress={() => setDepositAmount(amount.toString())}
              >
                <Text style={styles.quickText}>{amount} TON</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleDeposit}>
            <LinearGradient
              colors={['#2ecc71', '#27ae60']}
              style={styles.buttonGradient}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Пополнить</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Вывод */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Вывести средства</Text>
          <TextInput
            style={styles.input}
            value={withdrawAmount}
            onChangeText={setWithdrawAmount}
            placeholder="Сумма для вывода"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={handleWithdraw}>
            <LinearGradient
              colors={['#e74c3c', '#c0392b']}
              style={styles.buttonGradient}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Вывести</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Информация */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            ℹ️ Подключите TON кошелёк для пополнения и вывода средств
          </Text>
          <Text style={styles.infoText}>
            💡 Используйте тестовую сеть для разработки
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  balanceSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  balanceLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 10,
  },
  balanceBox: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 20,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  button: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  connectedWallet: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(46, 204, 113, 0.4)',
  },
  connectedText: {
    color: '#2ecc71',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  walletAddress: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 10,
  },
  disconnectButton: {
    backgroundColor: 'rgba(231, 76, 60, 0.3)',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  disconnectText: {
    color: '#e74c3c',
    fontSize: 14,
    fontWeight: 'bold',
  },
  quickAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  quickButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.5)',
  },
  quickText: {
    color: '#fff',
    fontSize: 14,
  },
  infoBox: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    padding: 15,
    gap: 8,
  },
  infoText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    lineHeight: 18,
  },
});
