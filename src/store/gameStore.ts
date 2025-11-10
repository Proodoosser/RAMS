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
  // Расширенные правила
  passesUsed: number;        // Количество использованных пасов
  hasFolded: boolean;        // Сложил карты в текущем раунде
  hasMaltsy: boolean;        // Объявил "мальцов"
  maltsyBonus: number;       // Бонус за мальцов
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
  gamePhase: 'betting' | 'declaring' | 'playing' | 'result' | 'menu';
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
  
  // Расширенные правила
  allowFold: boolean;        // Можно ли пасовать
  declarationPhase: boolean; // Фаза объявления мальцов
  
  // UI
  isAnimating: boolean;
  soundEnabled: boolean;
  volume: number;
  
  // Методы
  setPlayers: (players: Player[]) => void;
  setCurrentPlayer: (index: number) => void;
  setGamePhase: (phase: 'betting' | 'declaring' | 'playing' | 'result' | 'menu') => void;
  placeBet: (playerId: number, amount: number) => void;
  startGame: () => void;
  playCard: (playerId: number, cardIndex: number) => void;
  determineTrickWinner: () => void;
  endGame: () => void;
  resetGame: () => void;
  // Расширенные правила
  playerFold: (playerId: number) => boolean;
  declareMaltsy: (playerId: number) => boolean;
  checkForAutoWin: (playerId: number) => boolean;
  // Кошелёк
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
  allowFold: true,
  declarationPhase: false,
  isAnimating: false,
  soundEnabled: true,
  volume: 0.7,

  setPlayers: (players) => set({ players }),
  
  setCurrentPlayer: (index) => set({ currentPlayer: index }),
  
  setGamePhase: (phase) => set({ 
    gamePhase: phase,
    allowFold: phase === 'declaring', // Пас доступен только в фазе объявления
    declarationPhase: phase === 'declaring',
  }),
  
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
        passesUsed: 0,
        hasFolded: false,
        hasMaltsy: false,
        maltsyBonus: 0,
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
        passesUsed: 0,
        hasFolded: false,
        hasMaltsy: false,
        maltsyBonus: 0,
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
        passesUsed: 0,
        hasFolded: false,
        hasMaltsy: false,
        maltsyBonus: 0,
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
        passesUsed: 0,
        hasFolded: false,
        hasMaltsy: false,
        maltsyBonus: 0,
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
    
    // Применяем штраф за нулевую взятку
    players.forEach(player => {
      if (!player.hasFolded && player.tricks === 0) {
        player.balance -= 10;
        // Логика штрафа
      }
    });
    
    // Определяем победителя
    let winner = players[0];
    for (const player of players) {
      // Учитываем бонусы
      const totalPoints = player.points + player.maltsyBonus;
      const winnerPoints = winner.points + winner.maltsyBonus;
      
      if (totalPoints > winnerPoints) {
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
  
  // Правило паса (сложить карты)
  playerFold: (playerId: number) => {
    const state = get();
    const players = [...state.players];
    const player = players[playerId];
    
    if (!state.allowFold) {
      return false; // Пас уже недоступен
    }
    
    let penalty = 0;
    if (player.passesUsed === 0) {
      // Первый пас бесплатный
      penalty = 0;
    } else {
      // Каждый последующий -25
      penalty = 25;
      player.balance -= penalty;
    }
    
    player.passesUsed++;
    player.hasFolded = true;
    
    set({ players });
    
    return true;
  },
  
  // Объявление мальцов (валетов)
  declareMaltsy: (playerId: number) => {
    const state = get();
    const players = [...state.players];
    const player = players[playerId];
    
    // Проверяем валетов в руке
    const jacks = player.cards.filter(card => card.value === 'В');
    
    // 4 валета = автоматическая победа
    if (jacks.length === 4) {
      player.hasMaltsy = true;
      player.maltsyBonus = 1000; // Огромный бонус для гарантированной победы
      player.balance += 10; // Аванс
      set({ players });
      return true;
    }
    
    // 2 валета одного цвета = +5 очков
    const redJacks = jacks.filter(j => j.color === 'red');
    const blackJacks = jacks.filter(j => j.color === 'black');
    
    if (redJacks.length === 2 || blackJacks.length === 2) {
      player.hasMaltsy = true;
      player.maltsyBonus = 5;
      player.balance += 10; // Аванс
      set({ players });
      return true;
    }
    
    return false;
  },
  
  // Проверка автопобеды (4 валета)
  checkForAutoWin: (playerId: number) => {
    const state = get();
    const player = state.players[playerId];
    
    if (!player) return false;
    
    const jacks = player.cards.filter(card => card.value === 'В');
    return jacks.length === 4;
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
