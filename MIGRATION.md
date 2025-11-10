# 🔄 Портирование HTML → React Native

## Ключевые изменения и улучшения

### 1. ❌ Проблемы HTML версии

#### Отсутствовала экономика
```javascript
// БЫЛО (HTML):
bank: 200  // Просто число, никак не связано с игроками

// СТАЛО (React Native):
players: [{
  balance: 1000,    // Баланс каждого игрока
  bet: 0,          // Ставка игрока
}],
pot: 0,            // Общий банк складывается из ставок
```

#### Не было ставок
```typescript
// СТАЛО (React Native):
// 1. Фаза ставок перед каждой игрой
gamePhase: 'betting' | 'playing' | 'result'

// 2. Модальное окно для ставок
placeBet(playerId, amount) {
  player.balance -= amount;  // Списываем
  pot += amount;             // Добавляем в банк
}
```

#### Нет кошелька
```typescript
// СТАЛО (React Native):
// 1. TON Wallet Service
import TonWalletService from './services/TonWalletService';

// 2. Методы
connectWallet(address)
depositFunds(amount)  // TON → Game balance
withdrawFunds(amount) // Game balance → TON
```

#### Линейный геймплей
```typescript
// БЫЛО: Только тап на карту

// СТАЛО: 
// 1. Ставки перед раундом
// 2. Стратегия ботов
determineBotBet()     // Умные ставки ботов
selectBotCard()       // Тактический выбор карт

// 3. Экономические решения
// Игрок выбирает сколько поставить
```

---

### 2. ✅ Новые возможности

#### Система балансов

```typescript
interface Player {
  balance: number;     // Текущий баланс
  bet: number;        // Ставка в раунде
  tricks: number;     // Взятки
  points: number;     // Очки
}

// Цикл экономики:
1. balance -= bet         // Ставка
2. pot += bet            // В банк
3. Игра → winner         // Играем
4. winner.balance += pot // Победитель получает всё
```

#### Сохранение данных

```typescript
// AsyncStorage - persistent storage
loadUserData() {
  balance = await AsyncStorage.getItem('userBalance');
  wallet = await AsyncStorage.getItem('tonWalletAddress');
}

saveUserData() {
  await AsyncStorage.setItem('userBalance', balance);
}

// Данные не теряются при перезапуске!
```

#### TON интеграция

```typescript
// 1. Подключение кошелька
TonWalletService.connectWallet(address);

// 2. Депозит
await TonWalletService.deposit(amount);
depositFunds(amount); // Обновляем баланс

// 3. Вывод
await TonWalletService.withdraw(amount);
withdrawFunds(amount);
```

#### Умные боты

```typescript
// Стратегия ставок
determineBotBet(balance, minBet, maxBet) {
  // Бот ставит от minBet до balance/2
  const maxPossible = Math.min(maxBet, balance / 2);
  return random(minBet, maxPossible);
}

// Стратегия игры
selectBotCard(hand, leadSuit, trumpSuit) {
  // 1. Если есть масть - играем умно
  // 2. Если нет - козырь или сброс
  // 3. Анализ карт на столе
}
```

---

### 3. 🎮 UX улучшения

#### Модальные окна

```typescript
// Ставки
<Modal visible={showBetModal}>
  <TextInput value={betAmount} />
  <QuickBets amounts={[50, 100, 200, 500]} />
  <Button onPress={placeBet}>Поставить</Button>
</Modal>

// Валидация
if (amount < minBet || amount > maxBet) {
  showError();
  vibrate('error');
}
```

#### Звуки и вибрация

```typescript
// Нативные звуки
SoundService.playSound('bet');
SoundService.playSound('win');
SoundService.playSound('chip');

// Тактильный отклик
SoundService.vibrate('light');
SoundService.vibrate('success');
SoundService.vibrate('error');
```

#### Лог игры

```typescript
// Реал-тайм логирование
addLog('🎮 Игра началась');
addLog('Бот 1 поставил 150 ₽');
addLog('Вы сходили: 7♦');
addLog('🏆 Бот 2 взял взятку');

// Автоскролл к последнему
<ScrollView ref={logRef}>
  {gameLog.map(msg => <Text>{msg}</Text>)}
</ScrollView>
```

---

### 4. 📱 React Native специфика

#### Навигация

```typescript
// Stack Navigator
<Stack.Navigator>
  <Stack.Screen name="Menu" />
  <Stack.Screen name="Wallet" />
  <Stack.Screen name="Game" />
  <Stack.Screen name="Result" />
</Stack.Navigator>

// Переходы
navigation.navigate('Game');
navigation.goBack();
```

#### State Management (Zustand)

```typescript
// Глобальное состояние
export const useGameStore = create((set, get) => ({
  players: [],
  pot: 0,
  userBalance: 1000,
  
  // Actions
  placeBet: (playerId, amount) => { ... },
  playCard: (playerId, cardIndex) => { ... },
  endGame: () => { ... },
}));

// Использование
const { players, pot, placeBet } = useGameStore();
```

#### Стили (StyleSheet)

```typescript
// Оптимизированные стили
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b2d',
  },
  card: {
    width: 70,
    height: 100,
    borderRadius: 8,
  }
});
```

#### Градиенты

```typescript
// LinearGradient вместо CSS
<LinearGradient
  colors={['#6a11cb', '#2575fc']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
>
  <Text>Текст</Text>
</LinearGradient>
```

---

### 5. 🔐 Безопасность

#### Валидация

```typescript
// Проверка ставок
if (amount < minBet || amount > maxBet) {
  return error;
}
if (amount > player.balance) {
  return error;
}

// Проверка ходов
if (!isValidMove(card, leadSuit)) {
  return error;
}
```

#### Authoritative сервер (для мультиплеера)

```typescript
// TODO: Добавить серверную валидацию
// 1. Клиент отправляет ход
// 2. Сервер проверяет валидность
// 3. Сервер отправляет обновление всем
// 4. Клиент только отображает
```

---

### 6. 🎯 Что дальше?

#### Мультиплеер

```typescript
// WebSocket подключение
import io from 'socket.io-client';

const socket = io('wss://game-server.com');

socket.on('gameUpdate', (state) => {
  updateGameState(state);
});

socket.emit('playCard', { cardIndex });
```

#### Смарт-контракт

```solidity
// TON FunC contract
contract RamsGame {
  // Эскроу ставок
  mapping(address => uint) public bets;
  
  // Распределение выигрыша
  function distributePot(address winner) {
    uint pot = getTotalPot();
    winner.transfer(pot);
  }
}
```

#### Jetton токен

```typescript
// Собственная монета игры
contract RamsToken {
  name: "RAMS",
  symbol: "RMS",
  decimals: 9,
  
  // Mint для победителей
  // Burn для ставок
  // Transfer между игроками
}
```

---

## 🚀 Запуск

### Быстрый старт

```bash
cd C:\App\RAMS\RamsGame
npm install
npm start
npm run android  # или npm run ios
```

### Первый запуск

1. Создайте игру
2. Сделайте ставку (50-500 ₽)
3. Играйте
4. Победитель забирает банк!

### Тестирование экономики

```typescript
// В консоли
const state = useGameStore.getState();
console.log('Balance:', state.userBalance);
console.log('Pot:', state.pot);
console.log('Players:', state.players);
```

---

## 📊 Сравнение

| Функция | HTML | React Native |
|---------|------|--------------|
| Экономика | ❌ | ✅ |
| Ставки | ❌ | ✅ |
| Кошелёк | ❌ | ✅ |
| Сохранение | ❌ | ✅ |
| Нативные фичи | ❌ | ✅ |
| Мультиплеер | ❌ | 🚧 |
| Смарт-контракты | ❌ | 🚧 |

**Готовность:** 80% для MVP, 50% для полного релиза

---

Сделано с 🔥 для реального геймплея!
