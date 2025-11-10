import { Card } from '../store/gameStore';

const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = ['6', '7', '8', '9', '10', 'В', 'Д', 'К', 'Т'];

export const CARD_VALUES: { [key: string]: number } = {
  '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  'В': 2, 'Д': 3, 'К': 4, 'Т': 11,
};

export function createDeck(): Card[] {
  const deck: Card[] = [];
  
  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({
        value,
        suit,
        color: (suit === '♥' || suit === '♦') ? 'red' : 'black',
      });
    }
  }
  
  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function dealCards(deck: Card[], playerCount: number, cardsPerPlayer: number) {
  const hands: Card[][] = Array(playerCount).fill(null).map(() => []);
  
  for (let i = 0; i < cardsPerPlayer; i++) {
    for (let j = 0; j < playerCount; j++) {
      const card = deck.pop();
      if (card) hands[j].push(card);
    }
  }
  
  return hands;
}

export function isValidMove(playerCards: Card[], card: Card, leadSuit: string | null): boolean {
  // Первый ход - любая карта валидна
  if (!leadSuit) return true;
  
  // Если карта той же масти - валидна
  if (card.suit === leadSuit) return true;
  
  // Если нет карт той же масти - можно любую
  const hasLeadSuit = playerCards.some(c => c.suit === leadSuit);
  return !hasLeadSuit;
}

export function calculateTrickPoints(cards: Card[]): number {
  return cards.reduce((sum, card) => sum + CARD_VALUES[card.value], 0);
}

export function determineBotBet(botBalance: number, minBet: number, maxBet: number): number {
  // Простая логика: бот ставит случайную сумму от minBet до min(maxBet, balance/2)
  const maxPossible = Math.min(maxBet, Math.floor(botBalance / 2));
  const betAmount = Math.floor(Math.random() * (maxPossible - minBet + 1)) + minBet;
  return Math.min(betAmount, botBalance);
}

export function selectBotCard(
  hand: Card[],
  leadSuit: string | null,
  trumpSuit: string,
  tableCards: { playerId: number; card: Card }[]
): number {
  // Простая стратегия бота
  
  // Если первый ход - ходим средней картой
  if (!leadSuit) {
    const midIndex = Math.floor(hand.length / 2);
    return midIndex;
  }
  
  // Ищем карты нужной масти
  const validCards = hand.filter(c => c.suit === leadSuit);
  
  if (validCards.length > 0) {
    // Если есть карты масти - играем минимальную (если проигрываем) или максимальную (если выигрываем)
    const sortedValid = validCards.sort((a, b) => CARD_VALUES[a.value] - CARD_VALUES[b.value]);
    
    // Проверяем, можем ли выиграть
    const maxTableValue = Math.max(...tableCards.map(tc => 
      tc.card.suit === leadSuit ? CARD_VALUES[tc.card.value] : 0
    ));
    
    const winningCard = sortedValid.find(c => CARD_VALUES[c.value] > maxTableValue);
    
    if (winningCard) {
      return hand.indexOf(winningCard);
    } else {
      // Играем минимальную
      return hand.indexOf(sortedValid[0]);
    }
  }
  
  // Нет карт масти - ищем козыри
  const trumpCards = hand.filter(c => c.suit === trumpSuit);
  
  if (trumpCards.length > 0) {
    // Играем минимальный козырь
    const sortedTrumps = trumpCards.sort((a, b) => CARD_VALUES[a.value] - CARD_VALUES[b.value]);
    return hand.indexOf(sortedTrumps[0]);
  }
  
  // Нет ни масти, ни козырей - сбрасываем минимальную карту
  const sorted = [...hand].sort((a, b) => CARD_VALUES[a.value] - CARD_VALUES[b.value]);
  return hand.indexOf(sorted[0]);
}
