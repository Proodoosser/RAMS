import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Player {
  id: number;
  name: string;
  isBot: boolean;
  balance: number;
  bet: number;
  cards: Card[];
  tricks: number;
  points: number;
  avatar: string;
}

export interface Card {
  value: string;
  suit: string;
  color: 'red' | 'black';
}

export interface TableCard {
  playerId: number;
  card: Card;
}

export interface GameState {
  // Игроки
  players: Player[];
  currentPlayer: number;
  
  // Игровое состояние
  gameStarted: boolean;
  gamePhase: 'betting' | 'playing' | 'result' | 'menu';
  round: number;
  trick: number;
  trumpSuit: string;
  leadSuit: string | null;
  tableCards: TableCard[];
  deck: Card[];
  
  // Экономика
  pot: number;
  minBet: number;
  maxBet: number;
  
  // Пользователь
  userBalance: number;
  tonWalletAddress: string | null;
  
  // UI
  isAnimating: boolean;
  soundEnabled: boolean;
  volume: number;
  
  // Методы
  setPlayers: (players: Player[]) => void;
  setCurrentPlayer: (index: number) => void;
  setGamePhase: (phase: 'betting' | 'playing' | 'result' | 'menu') => void;
  placeBet: (playerId: number, amount: number) => void;
  startGame: () => void;
  playCard: (playerId: number, cardIndex: number) => void;
  determineTrickWinner: () => void;
  endGame: () => void;
  resetGame: () => void;
  connectWallet: (address: string) => void;
  depositFunds: (amount: number) => void;
  withdrawFunds: (amount: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
  loadUserData: () => Promise<void>;
  saveUserData: () => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Начальное состояние
  players: [],
  currentPlayer: 0,
  gameStarted: false,
  gamePhase: 'menu',
  round: 1,
  trick: 1,
  trumpSuit: '♠',
  leadSuit: null,
  tableCards: [],
  deck: [],
  pot: 0,
  minBet: 10,
  maxBet: 500,
  userBalance: 1000, // Начальный баланс
  tonWalletAddress: null,
  isAnimating: false,
  soundEnabled: true,
  volume: 0.7,

  setPlayers: (players) => set({ players }),
  
  setCurrentPlayer: (index) => set({ currentPlayer: index }),
  
  setGamePhase: (phase) => set({ gamePhase: phase }),
  
  placeBet: (playerId, amount) => {
    const state = get();
    const players = [...state.players];
    const player = players[playerId];
    
    if (player.balance >= amount) {
      player.balance -= amount;
      player.bet = amount;
      
      set({
        players,
        pot: state.pot + amount,
      });
    }
  },
  
  startGame: () => {
    const state = get();
    const initialPlayers: Player[] = [
      {
        id: 0,
        name: 'Вы',
        isBot: false,
        balance: state.userBalance,
        bet: 0,
        cards: [],
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
        cards: [],
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
        cards: [],
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
        cards: [],
        tricks: 0,
        points: 0,
        avatar: '🤖',
      },
    ];
    
    set({
      players: initialPlayers,
      gameStarted: true,
      gamePhase: 'betting',
      round: 1,
      trick: 1,
      pot: 0,
      tableCards: [],
    });
  },
  
  playCard: (playerId, cardIndex) => {
    const state = get();
    const players = [...state.players];
    const player = players[playerId];
    const card = player.cards[cardIndex];
    
    // Устанавливаем масть захода
    if (state.tableCards.length === 0) {
      set({ leadSuit: card.suit });
    }
    
    // Удаляем карту из руки
    player.cards.splice(cardIndex, 1);
    
    // Добавляем на стол
    const tableCards = [...state.tableCards, { playerId, card }];
    
    set({ players, tableCards });
  },
  
  determineTrickWinner: () => {
    const state = get();
    const { tableCards, trumpSuit, players } = state;
    
    if (tableCards.length < 4) return;
    
    const cardValues: { [key: string]: number } = {
      '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
      'В': 2, 'Д': 3, 'К': 4, 'Т': 11,
    };
    
    let winningCard = tableCards[0];
    
    for (let i = 1; i < tableCards.length; i++) {
      const current = tableCards[i];
      
      // Козырь бьет не козырь
      if (current.card.suit === trumpSuit && winningCard.card.suit !== trumpSuit) {
        winningCard = current;
      }
      // Обе карты одной масти - сравниваем значения
      else if (current.card.suit === winningCard.card.suit) {
        if (cardValues[current.card.value] > cardValues[winningCard.card.value]) {
          winningCard = current;
        }
      }
    }
    
    // Начисляем очки победителю
    const newPlayers = [...players];
    const winner = newPlayers[winningCard.playerId];
    winner.tricks++;
    
    let trickPoints = 0;
    tableCards.forEach(tc => {
      trickPoints += cardValues[tc.card.value];
    });
    winner.points += trickPoints;
    
    set({
      players: newPlayers,
      currentPlayer: winningCard.playerId,
      tableCards: [],
      leadSuit: null,
      trick: state.trick + 1,
    });
  },
  
  endGame: () => {
    const state = get();
    const players = [...state.players];
    
    // Определяем победителя
    let winner = players[0];
    for (const player of players) {
      if (player.points > winner.points) {
        winner = player;
      }
    }
    
    // Распределяем банк
    const totalPot = state.pot;
    winner.balance += totalPot;
    
    // Обновляем баланс пользователя
    if (winner.id === 0) {
      set({ userBalance: winner.balance });
      get().saveUserData();
    }
    
    set({
      players,
      gameStarted: false,
      gamePhase: 'result',
      pot: 0,
    });
  },
  
  resetGame: () => {
    set({
      players: [],
      currentPlayer: 0,
      gameStarted: false,
      gamePhase: 'menu',
      round: 1,
      trick: 1,
      tableCards: [],
      pot: 0,
      leadSuit: null,
    });
  },
  
  connectWallet: (address) => {
    set({ tonWalletAddress: address });
    get().saveUserData();
  },
  
  depositFunds: (amount) => {
    set({ userBalance: get().userBalance + amount });
    get().saveUserData();
  },
  
  withdrawFunds: (amount) => {
    const state = get();
    if (state.userBalance >= amount) {
      set({ userBalance: state.userBalance - amount });
      get().saveUserData();
    }
  },
  
  setSoundEnabled: (enabled) => {
    set({ soundEnabled: enabled });
    AsyncStorage.setItem('soundEnabled', JSON.stringify(enabled));
  },
  
  setVolume: (volume) => {
    set({ volume });
    AsyncStorage.setItem('volume', volume.toString());
  },
  
  loadUserData: async () => {
    try {
      const balance = await AsyncStorage.getItem('userBalance');
      const wallet = await AsyncStorage.getItem('tonWalletAddress');
      const sound = await AsyncStorage.getItem('soundEnabled');
      const vol = await AsyncStorage.getItem('volume');
      
      set({
        userBalance: balance ? parseFloat(balance) : 1000,
        tonWalletAddress: wallet,
        soundEnabled: sound ? JSON.parse(sound) : true,
        volume: vol ? parseFloat(vol) : 0.7,
      });
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  },
  
  saveUserData: async () => {
    try {
      const state = get();
      await AsyncStorage.setItem('userBalance', state.userBalance.toString());
      if (state.tonWalletAddress) {
        await AsyncStorage.setItem('tonWalletAddress', state.tonWalletAddress);
      }
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  },
}));
