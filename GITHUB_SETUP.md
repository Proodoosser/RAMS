# ⚙️ Настройка GitHub Repository

Инструкции по настройке репозитория https://github.com/Proodoosser/RAMS

---

## 1️⃣ Основные настройки (Settings → General)

### Repository name
```
RAMS
```

### Description
```
🎮 Космический Рамс - React Native игра с TON кошельком | Полная экономика, ставки, умные боты | Android/iOS
```

### Website
```
https://github.com/Proodoosser/RAMS
```

### Topics (Add topics)
```
react-native, typescript, expo, ton-blockchain, card-game, gaming, 
mobile-app, android, ios, blockchain, web3, zustand, ton-wallet, 
gambling, cryptocurrency
```

### Features
- ✅ Wikis (включить для документации)
- ✅ Issues (включить для багов)
- ✅ Sponsorships (опционально)
- ✅ Discussions (включить для сообщества)
- ✅ Projects (для roadmap)

### Pull Requests
- ✅ Allow merge commits
- ✅ Allow squash merging
- ✅ Allow rebase merging
- ✅ Always suggest updating pull request branches
- ✅ Automatically delete head branches

---

## 2️⃣ Ветки (Settings → Branches)

### Default branch
```
main
```

### Branch protection rule для `main`:

**Settings → Branches → Add rule**

Branch name pattern: `main`

Настройки защиты:
- ✅ Require a pull request before merging
  - Required approvals: 1
- ✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging
- ✅ Require linear history
- ✅ Include administrators (опционально)

---

## 3️⃣ Issues (Settings → Issues)

### Issue templates
Уже созданы в `.github/ISSUE_TEMPLATE/`:
- ✅ bug_report.md
- ✅ feature_request.md

### Labels (создать)

**Bugs:**
```
bug          - 🐛 Something isn't working (red)
critical     - 🔥 Critical bug (dark red)
security     - 🔒 Security issue (purple)
```

**Features:**
```
enhancement  - ✨ New feature (green)
feature      - 🎯 Feature request (light green)
ui/ux        - 🎨 UI/UX improvement (pink)
```

**Development:**
```
documentation - 📝 Documentation (blue)
refactoring   - ♻️ Code refactoring (cyan)
performance   - ⚡ Performance improvement (yellow)
testing       - ✅ Testing (orange)
```

**Status:**
```
wip           - 🚧 Work in progress (yellow)
help-wanted   - 🆘 Help wanted (green)
good-first-issue - 👋 Good for newcomers (light blue)
duplicate     - 🔄 Duplicate (grey)
wontfix       - ❌ Won't fix (white)
```

**Priority:**
```
priority-high    - 🔴 High priority (red)
priority-medium  - 🟡 Medium priority (yellow)
priority-low     - 🟢 Low priority (green)
```

**Components:**
```
ton-integration  - 💳 TON wallet (blue)
game-logic       - 🎮 Game logic (purple)
ui               - 📱 User interface (pink)
backend          - 🔧 Backend (grey)
```

---

## 4️⃣ Discussions

### Settings → Discussions → Enable Discussions

Категории для создания:
- 💡 **Ideas** - Предложения и идеи
- 🙏 **Q&A** - Вопросы и ответы
- 📣 **Announcements** - Объявления
- 🎮 **Gameplay** - Обсуждение геймплея
- 💻 **Development** - Техническое обсуждение
- 🎨 **Design** - UI/UX дизайн

---

## 5️⃣ Projects (для Roadmap)

### Создать проект "RAMS Roadmap"

**Settings → Projects → New project**

#### Board columns:
```
📋 Backlog
🎯 Planned
🚧 In Progress
✅ Done
❌ Cancelled
```

#### Добавить issues:

**Q4 2025:**
- [ ] Релиз v1.0.0 MVP
- [ ] Публикация в Google Play
- [ ] Бета-тестирование

**Q1 2026:**
- [ ] Мультиплеер (WebSocket)
- [ ] Смарт-контракт TON
- [ ] iOS релиз

**Q2 2026:**
- [ ] Рейтинговая система
- [ ] Турниры
- [ ] NFT карты

---

## 6️⃣ Releases

### Создать первый релиз v1.0.0

**Releases → Create a new release**

```
Tag version: v1.0.0
Release title: 🚀 RAMS v1.0.0 - MVP Release
Target: main
```

**Description:**
```markdown
## 🎉 Первый релиз RAMS Game!

### ✨ Что включено

#### Основной функционал
- 🎮 Полная реализация игры "Рамс"
- 💰 Экономическая система (балансы, ставки, банк)
- 🎯 Фаза ставок перед каждым раундом
- 🤖 Умные боты с продуманной стратегией

#### TON Интеграция
- 💳 Подключение TON кошелька
- 💸 Депозит средств (testnet)
- 💰 Вывод средств (testnet)
- 🔍 Проверка баланса

#### UI/UX
- 📱 4 экрана (Меню, Игра, Кошелёк, Результаты)
- 🎨 Красивый дизайн с градиентами
- 🔊 Звуковые эффекты
- 📳 Тактильная обратная связь

### 📦 Файлы для скачивания

- `RAMS-v1.0.0.apk` - Android APK (скоро)
- `RAMS-v1.0.0-source.zip` - Исходный код

### 📖 Документация

- [Как играть](QUICKSTART.md)
- [Установка для разработчиков](README.md)
- [Contributing Guide](CONTRIBUTING.md)

### 🐛 Known Issues

- TON депозит/вывод - заглушки (требуется смарт-контракт)
- Нет мультиплеера (только боты)
- Звуковые файлы отсутствуют (нужно создать)

### ⬆️ Как обновиться

Для разработчиков:
```bash
git pull origin main
npm install
npm start
```

### 🙏 Благодарности

Спасибо всем, кто поддержал проект!

---

**Full Changelog**: https://github.com/Proodoosser/RAMS/blob/main/CHANGELOG.md
```

---

## 7️⃣ GitHub Pages (опционально)

### Для документации

**Settings → Pages**

Source: `Deploy from a branch`
Branch: `main` / `docs` folder

---

## 8️⃣ Security (Settings → Security)

### Security policy
Уже создан: `SECURITY.md`

### Dependabot
**Settings → Security → Code security and analysis**

Включить:
- ✅ Dependency graph
- ✅ Dependabot alerts
- ✅ Dependabot security updates
- ✅ Dependabot version updates (создать `.github/dependabot.yml`)

### Code scanning
Включить:
- ✅ CodeQL analysis (опционально)

---

## 9️⃣ Actions (CI/CD)

### Создать `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx expo export
```

---

## 🔟 README.md Badges

Добавлено в README.md:
```markdown
[![React Native](https://img.shields.io/badge/React%20Native-0.73-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-50.0-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![TON](https://img.shields.io/badge/TON-Integrated-0088CC.svg)](https://ton.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
```

---

## 1️⃣1️⃣ Social Preview

### Settings → General → Social preview

**Создать изображение 1280x640px:**

```
Фон: Градиент #6a11cb → #2575fc
Текст: "RAMS - Космический Рамс"
Подзаголовок: "React Native | TON Blockchain"
Иконки: ♠️ ♥️ ♦️ ♣️
```

Загрузить в Settings → Social preview

---

## 1️⃣2️⃣ Collaborators (опционально)

**Settings → Collaborators**

Добавить доверенных разработчиков с правами:
- `Write` - для основных контрибьюторов
- `Maintain` - для мейнтейнеров
- `Admin` - для со-владельцев

---

## 1️⃣3️⃣ Webhooks (опционально)

### Для интеграций

**Settings → Webhooks → Add webhook**

Примеры:
- Discord notifications
- Telegram bot
- CI/CD triggers

---

## ✅ Чеклист настройки

Отметьте выполненные пункты:

### Основное
- [ ] Description заполнено
- [ ] Topics добавлены
- [ ] README.md с badges
- [ ] LICENSE файл
- [ ] SECURITY.md

### Templates
- [ ] Bug report template
- [ ] Feature request template
- [ ] Pull request template
- [ ] Contributing guide
- [ ] Code of conduct

### GitHub Features
- [ ] Issues включены
- [ ] Discussions включены
- [ ] Projects созданы
- [ ] Wiki настроена (опционально)
- [ ] GitHub Pages (опционально)

### Protection
- [ ] Branch protection rules
- [ ] Dependabot включен
- [ ] Security policy

### CI/CD
- [ ] GitHub Actions workflow
- [ ] Automated tests
- [ ] Automated builds

### Community
- [ ] Labels созданы
- [ ] Roadmap в Projects
- [ ] First release published
- [ ] Social preview image

---

## 🎯 Результат

После настройки репозиторий будет иметь:

✅ Профессиональный внешний вид
✅ Структурированные issues и PRs
✅ Защищённую main ветку
✅ Автоматические проверки
✅ Прозрачный roadmap
✅ Активное сообщество

---

**Дата создания**: 10 ноября 2025  
**Обновлено**: 10 ноября 2025
