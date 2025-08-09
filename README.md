# Simple Telegram WebApp

Простое веб-приложение для Telegram с счетчиком кликов и отображением процента вклада пользователя.

## Возможности

- 🎯 Глобальный счетчик кликов всех пользователей
- 📊 Отображение процента вклада текущего пользователя
- 🎨 Современный дизайн с анимациями
- 📱 Адаптивная верстка для мобильных устройств
- 🔄 Автоматическое обновление статистики
- 🚀 Автоматический деплой через GitHub Actions

## Технологии

- **Frontend**: HTML5, CSS3, JavaScript, Telegram WebApp API
- **Backend**: Node.js, Express.js
- **База данных**: SQLite
- **Деплой**: GitHub Actions, PM2
- **Стиль**: Modern glassmorphism UI

## Автоматический деплой

Приложение автоматически деплоится на сервер при пуше в ветку `main`.

### Необходимые секреты в GitHub:

- `LEWD_MONKEY_HOST` - IP адрес сервера
- `LEWD_MONKEY_USERNAME` - имя пользователя SSH
- `LEWD_MONKEY_SSH_KEY` - приватный SSH ключ
- `LEWD_MONKEY_SSH_PORT` - порт SSH (обычно 22)

### Что происходит при деплое:

1. ✅ Установка Node.js (если не установлен)
2. ✅ Установка PM2 (если не установлен)
3. ✅ Создание структуры директорий
4. ✅ Клонирование/обновление репозитория
5. ✅ Установка зависимостей
6. ✅ Настройка PM2 конфигурации
7. ✅ Запуск/перезапуск приложения
8. ✅ Настройка автозапуска

## Структура проекта

```
/opt/webapps/simple-tg-webapp/
├── server.js              # Node.js сервер
├── index.html             # Frontend приложения
├── package.json           # Зависимости
├── ecosystem.config.js    # PM2 конфигурация
├── public/               # Статические файлы
└── clicks.db             # SQLite база данных
```

## API

- `GET /` - Главная страница приложения
- `GET /api/stats` - Получение статистики кликов
- `POST /api/click` - Регистрация клика пользователя

## Логи

Логи приложения доступны через PM2:

```bash
pm2 logs simple-tg-webapp
pm2 monit
```

Файлы логов:
- `/var/log/pm2/simple-tg-webapp.log` - общие логи
- `/var/log/pm2/simple-tg-webapp-error.log` - ошибки
- `/var/log/pm2/simple-tg-webapp-out.log` - вывод приложения

## Управление приложением

```bash
# Статус приложения
pm2 status

# Перезапуск
pm2 restart simple-tg-webapp

# Остановка
pm2 stop simple-tg-webapp

# Просмотр логов
pm2 logs simple-tg-webapp
```

## Использование с Telegram

1. Создайте бота через @BotFather
2. Настройте WebApp URL на ваш домен
3. Добавьте кнопку WebApp в меню бота

## Лицензия

MIT