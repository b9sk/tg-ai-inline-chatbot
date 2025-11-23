## ✅ Что осталось сделать (чек-лист)

Вот что еще предстоит сделать для полного запуска проекта:

### 1. Настройка окружения и деплой Backend
*   Заполнить `backend/.env` переменными `FLOWISE_BASE_URL` и `FLOWISE_FLOW_ID`.
*   Задеплоить `backend` на выбранный serverless-хостинг (например, Vercel, Render, Netlify, Deno Deploy, Fly.io, Deta.space).
*   Получить публичный URL для задеплоенного backend.

### 2. Настройка Cloudflare Worker
*   Заполнить `worker/.env` переменными `BOT_TOKEN` (токен Telegram бота) и `BACKEND_URL` (URL вашего задеплоенного backend).
*   Обновить `worker/wrangler.toml` с актуальным `BOT_TOKEN` и `BACKEND_URL`.
*   Задеплоить Cloudflare Worker, используя `npx wrangler deploy`.
*   Получить публичный URL для Cloudflare Worker.

### 3. Настройка Telegram Bot
*   Создать бота через [@BotFather](https://t.me/BotFather).
*   Активировать inline-режим командой `/setinline`.
*   Установить webhook для бота, используя URL вашего Cloudflare Worker: `https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook?url=<YOUR_CLOUDFLARE_WORKER_URL>`.

### 4. Настройка Flowise
*   Убедиться, что Flowise запущен и доступен по `FLOWISE_BASE_URL`.
*   Создать Flow с входами `sessionId` и `question`.
*   Экспортировать `flowId` и указать его в `backend/.env`.

### 5. Тестирование
*   Проверить работу бота в Telegram, отправив inline-запрос `@botname привет`.
*   Проверить продолжение диалога, ответив на сообщение бота.
