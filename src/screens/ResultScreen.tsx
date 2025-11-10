import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../store/gameStore';
import SoundService from '../services/SoundService';

export default function ResultScreen({ navigation }: any) {
  const { players, pot, resetGame } = useGameStore();

  // Определяем победителя
  const winner = players.reduce((prev, current) => 
    current.points > prev.points ? current : prev
  );

  const handlePlayAgain = () => {
    SoundService.playSound('bet');
    SoundService.vibrate('medium');
    resetGame();
    navigation.navigate('Game');
  };

  const handleBackToMenu = () => {
    SoundService.playSound('chip');
    resetGame();
    navigation.navigate('Menu');
  };

  return (
    <LinearGradient colors={['#0b0b2d', '#1a1a4a']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Заголовок */}
        <View style={styles.header}>
          <Text style={styles.title}>🎉 Игра завершена!</Text>
        </View>

        {/* Победитель */}
        <View style={styles.winnerSection}>
          <Text style={styles.winnerLabel}>Победитель</Text>
          <View style={styles.winnerCard}>
            <Text style={styles.winnerAvatar}>{winner.avatar}</Text>
            <Text style={styles.winnerName}>{winner.name}</Text>
            <LinearGradient
              colors={['#ffd700', '#ffed4e']}
              style={styles.crownBadge}
            >
              <Text style={styles.crownText}>👑 #{1}</Text>
            </LinearGradient>
          </View>
          <View style={styles.winnerStats}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{winner.tricks}</Text>
              <Text style={styles.statLabel}>Взяток</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{winner.points}</Text>
              <Text style={styles.statLabel}>Очков</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{pot} ₽</Text>
              <Text style={styles.statLabel}>Выигрыш</Text>
            </View>
          </View>
        </View>

        {/* Таблица результатов */}
        <View style={styles.resultsTable}>
          <Text style={styles.tableTitle}>Итоговая таблица</Text>
          {players
            .sort((a, b) => b.points - a.points)
            .map((player, index) => (
              <View
                key={player.id}
                style={[
                  styles.playerRow,
                  index === 0 && styles.firstPlace,
                ]}
              >
                <Text style={styles.playerRank}>#{index + 1}</Text>
                <Text style={styles.playerRowAvatar}>{player.avatar}</Text>
                <Text style={styles.playerRowName}>{player.name}</Text>
                <View style={styles.playerRowStats}>
                  <Text style={styles.playerRowStat}>💎 {player.tricks}</Text>
                  <Text style={styles.playerRowStat}>🎯 {player.points}</Text>
                </View>
              </View>
            ))}
        </View>

        {/* Кнопки */}
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={handlePlayAgain}>
            <LinearGradient
              colors={['#6a11cb', '#2575fc']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>🔄 Играть ещё</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleBackToMenu}>
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>← В меню</Text>
            </LinearGradient>
          </TouchableOpacity>
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
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
  },
  winnerSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  winnerLabel: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 15,
  },
  winnerCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.2)',
    borderRadius: 20,
    padding: 25,
    width: '80%',
    borderWidth: 2,
    borderColor: '#ffd700',
  },
  winnerAvatar: {
    fontSize: 80,
    marginBottom: 10,
  },
  winnerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  crownBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
  },
  crownText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0b0b2d',
  },
  winnerStats: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 20,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffd700',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 5,
  },
  resultsTable: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  firstPlace: {
    backgroundColor: 'rgba(255,215,0,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.4)',
  },
  playerRank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    width: 35,
  },
  playerRowAvatar: {
    fontSize: 24,
    marginRight: 10,
  },
  playerRowName: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  playerRowStats: {
    flexDirection: 'row',
    gap: 15,
  },
  playerRowStat: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  buttons: {
    gap: 15,
  },
  button: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
