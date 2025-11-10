import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../store/gameStore';
import SoundService from '../services/SoundService';
import {
  createDeck,
  shuffleDeck,
  dealCards,
  isValidMove,
  determineBotBet,
  selectBotCard,
  CARD_VALUES,
} from '../utils/gameLogic';

const { width, height } = Dimensions.get('window');

export default function GameScreen({ navigation }: any) {
  const {
    players,
    currentPlayer,
    gamePhase,
    tableCards,
    pot,
    trumpSuit,
    leadSuit,
    trick,
    round,
    minBet,
    maxBet,
    setPlayers,
    setCurrentPlayer,
    setGamePhase,
    placeBet,
    playCard,
    determineTrickWinner,
    endGame,
  } = useGameStore();

  const [showBetModal, setShowBetModal] = useState(false);
  const [betAmount, setBetAmount] = useState('50');
  const [gameLog, setGameLog] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (gamePhase === 'betting' && players.length > 0) {
      handleBettingPhase();
    }
  }, [gamePhase, players]);

  useEffect(() => {
    if (gamePhase === 'playing' && players[currentPlayer]?.isBot) {
      setTimeout(() => handleBotTurn(), 1500);
    }
  }, [currentPlayer, gamePhase]);

  useEffect(() => {
    if (tableCards.length === 4) {
      setIsProcessing(true);
      setTimeout(() => {
        determineTrickWinner();
        SoundService.playSound('win');
        SoundService.vibrate('success');
        
        if (trick >= 5) {
          setTimeout(() => {
            endGame();
            navigation.navigate('Result');
          }, 2000);
        } else {
          setIsProcessing(false);
        }
      }, 2000);
    }
  }, [tableCards]);

  const initializeGame = () => {
    const deck = shuffleDeck(createDeck());
    const hands = dealCards(deck, 4, 5);
    
    const trumpCard = deck[deck.length - 1];
    
    const newPlayers = [
      {
        id: 0,
        name: 'Вы',
        isBot: false,
        balance: useGameStore.getState().userBalance,
        bet: 0,
        cards: hands[0],
        tricks: 0,
        points: 0,
        avatar: '👤',
      },
      {
        id: 1,
        name: 'Бот 1',
        isBot: true,
        balance: 1000,
        bet: 0,
        cards: hands[1],
        tricks: 0,
        points: 0,
        avatar: '🤖',
      },
      {
        id: 2,
        name: 'Бот 2',
        isBot: true,
        balance: 1000,
        bet: 0,
        cards: hands[2],
        tricks: 0,
        points: 0,
        avatar: '🤖',
      },
      {
        id: 3,
        name: 'Бот 3',
        isBot: true,
        balance: 1000,
        bet: 0,
        cards: hands[3],
        tricks: 0,
        points: 0,
        avatar: '🤖',
      },
    ];

    setPlayers(newPlayers);
    setGamePhase('betting');
    addLog('🎮 Игра началась!');
    addLog(`🃏 Козырь: ${trumpCard.suit}`);
  };

  const handleBettingPhase = () => {
    setShowBetModal(true);
    
    // Боты делают ставки автоматически
    setTimeout(() => {
      players.forEach((player) => {
        if (player.isBot) {
          const botBet = determineBotBet(player.balance, minBet, maxBet);
          placeBet(player.id, botBet);
          addLog(`${player.name} поставил ${botBet} ₽`);
        }
      });
    }, 500);
  };

  const handlePlayerBet = () => {
    const amount = parseInt(betAmount);
    
    if (amount < minBet || amount > maxBet) {
      addLog(`❌ Ставка должна быть от ${minBet} до ${maxBet} ₽`);
      SoundService.vibrate('error');
      return;
    }

    if (amount > players[0].balance) {
      addLog('❌ Недостаточно средств');
      SoundService.vibrate('error');
      return;
    }

    placeBet(0, amount);
    addLog(`Вы поставили ${amount} ₽`);
    SoundService.playSound('bet');
    SoundService.vibrate('medium');
    
    setShowBetModal(false);
    
    // Начинаем игру
    setTimeout(() => {
      setGamePhase('playing');
      addLog('💎 Игра началась! Ваш ход');
    }, 1000);
  };

  const handleBotTurn = () => {
    if (isProcessing) return;
    
    const bot = players[currentPlayer];
    const cardIndex = selectBotCard(bot.cards, leadSuit, trumpSuit, tableCards);
    
    playCard(currentPlayer, cardIndex);
    SoundService.playSound('place');
    addLog(`${bot.name} сходил картой`);
    
    setTimeout(() => {
      setCurrentPlayer((currentPlayer + 1) % 4);
    }, 800);
  };

  const handlePlayerCardPress = (cardIndex: number) => {
    if (currentPlayer !== 0 || isProcessing) return;
    
    const card = players[0].cards[cardIndex];
    
    if (!isValidMove(players[0].cards, card, leadSuit)) {
      addLog(`❌ Нужно ходить в масть ${leadSuit}`);
      SoundService.vibrate('error');
      return;
    }

    playCard(0, cardIndex);
    SoundService.playSound('place');
    SoundService.vibrate('light');
    addLog(`Вы сходили: ${card.value}${card.suit}`);
    
    setTimeout(() => {
      setCurrentPlayer((currentPlayer + 1) % 4);
    }, 800);
  };

  const addLog = (message: string) => {
    setGameLog((prev) => [...prev, message].slice(-10));
  };

  const renderCard = (card: any, index: number, isPlayerCard: boolean) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.card,
        { borderColor: card.color === 'red' ? '#e74c3c' : '#2c3e50' },
      ]}
      onPress={() => isPlayerCard && handlePlayerCardPress(index)}
      disabled={!isPlayerCard || currentPlayer !== 0 || isProcessing}
      activeOpacity={0.7}
    >
      <Text style={[styles.cardValue, { color: card.color === 'red' ? '#e74c3c' : '#2c3e50' }]}>
        {card.value}
      </Text>
      <Text style={[styles.cardSuit, { color: card.color === 'red' ? '#e74c3c' : '#2c3e50' }]}>
        {card.suit}
      </Text>
    </TouchableOpacity>
  );

  const renderPlayerSeat = (player: any, position: 'top' | 'left' | 'right' | 'bottom') => {
    const isActive = currentPlayer === player.id;
    const tableCard = tableCards.find((tc) => tc.playerId === player.id);

    return (
      <View style={[styles.playerSeat, styles[`seat${position.charAt(0).toUpperCase() + position.slice(1)}`]]}>
        <View style={[styles.playerAvatar, isActive && styles.activeAvatar]}>
          <Text style={styles.avatarText}>{player.avatar}</Text>
        </View>
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={styles.playerStats}>💰 {player.balance} ₽</Text>
          <Text style={styles.playerStats}>🎯 {player.points}</Text>
        </View>
        {tableCard && (
          <View style={styles.tableCard}>
            {renderCard(tableCard.card, 0, false)}
          </View>
        )}
      </View>
    );
  };

  if (players.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#0b0b2d', '#1a1a4a']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Заголовок */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Меню</Text>
          </TouchableOpacity>
          <View style={styles.potDisplay}>
            <Text style={styles.potLabel}>Банк</Text>
            <Text style={styles.potAmount}>{pot} ₽</Text>
          </View>
          <View style={styles.roundInfo}>
            <Text style={styles.roundText}>Раунд {round}/5</Text>
            <Text style={styles.roundText}>Взятка {trick}/5</Text>
          </View>
        </View>

        {/* Игровой стол */}
        <View style={styles.gameTable}>
          {/* Игроки */}
          {renderPlayerSeat(players[2], 'top')}
          {renderPlayerSeat(players[1], 'left')}
          {renderPlayerSeat(players[3], 'right')}

          {/* Центр стола */}
          <View style={styles.tableCenter}>
            <Text style={styles.trumpText}>Козырь: {trumpSuit}</Text>
          </View>
        </View>

        {/* Рука игрока */}
        <View style={styles.playerHand}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {players[0].cards.map((card, index) => renderCard(card, index, true))}
          </ScrollView>
        </View>

        {/* Лог игры */}
        <View style={styles.gameLogContainer}>
          <ScrollView>
            {gameLog.map((log, index) => (
              <Text key={index} style={styles.logText}>
                {log}
              </Text>
            ))}
          </ScrollView>
        </View>

        {/* Модальное окно ставок */}
        <Modal visible={showBetModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Сделайте ставку</Text>
              <Text style={styles.modalSubtitle}>
                от {minBet} до {maxBet} ₽
              </Text>
              <TextInput
                style={styles.betInput}
                value={betAmount}
                onChangeText={setBetAmount}
                keyboardType="numeric"
                placeholder="Введите сумму"
                placeholderTextColor="#999"
              />
              <View style={styles.quickBets}>
                {[50, 100, 200, 500].map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={styles.quickBetButton}
                    onPress={() => setBetAmount(amount.toString())}
                  >
                    <Text style={styles.quickBetText}>{amount} ₽</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.confirmButton} onPress={handlePlayerBet}>
                <LinearGradient
                  colors={['#6a11cb', '#2575fc']}
                  style={styles.confirmGradient}
                >
                  <Text style={styles.confirmText}>Поставить</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b0b2d',
  },
  loadingText: {
    color: '#fff',
    fontSize: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButton: {
    color: '#fff',
    fontSize: 16,
  },
  potDisplay: {
    alignItems: 'center',
  },
  potLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  potAmount: {
    color: '#ffd700',
    fontSize: 24,
    fontWeight: 'bold',
  },
  roundInfo: {
    alignItems: 'flex-end',
  },
  roundText: {
    color: '#fff',
    fontSize: 12,
  },
  gameTable: {
    flex: 1,
    position: 'relative',
  },
  playerSeat: {
    position: 'absolute',
    alignItems: 'center',
  },
  seatTop: {
    top: 20,
    left: width / 2 - 50,
  },
  seatLeft: {
    left: 20,
    top: height / 3,
  },
  seatRight: {
    right: 20,
    top: height / 3,
  },
  seatBottom: {
    bottom: 150,
    left: width / 2 - 50,
  },
  playerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(106, 17, 203, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  activeAvatar: {
    borderColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  avatarText: {
    fontSize: 30,
  },
  playerInfo: {
    marginTop: 5,
    alignItems: 'center',
  },
  playerName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  playerStats: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
  },
  tableCard: {
    marginTop: 10,
  },
  tableCenter: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: [{ translateX: -60 }, { translateY: -20 }],
    alignItems: 'center',
  },
  trumpText: {
    color: '#ffd700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  playerHand: {
    height: 120,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  card: {
    width: 70,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'space-between',
    padding: 8,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardSuit: {
    fontSize: 24,
    textAlign: 'right',
  },
  gameLogContainer: {
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  logText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#1a1a4a',
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 20,
  },
  betInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  quickBets: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickBetButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.5)',
  },
  quickBetText: {
    color: '#fff',
    fontSize: 14,
  },
  confirmButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  confirmGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
