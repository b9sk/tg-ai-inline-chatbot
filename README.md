# ⚙️ Проект: `telegram-inline-ai-bot`

---

## 🧭 Архитектурное описание Telegram Inline AI Bot

### 1. Общая идея

Бот работает **исключительно в inline-режиме**:

```
@botname prompt
```

Пользователь вводит запрос прямо в Telegram, а бот отвечает в том же чате.
Цель — лёгкий, быстрый и полностью безбазовый AI-бот на связке **Flowise + Gemini API**, управляемый минимальным backend.

### 2. Общая архитектура

```mermaid
graph LR
  A[Telegram] -->|Webhook| B[Cloudflare Worker]
  B -->|HTTP| C[Backend (Serverless API)]
  C -->|REST| D[Flowise]
  D -->|Ответ| C
  C -->|Ответ JSON| B
  B -->|sendMessage / answerInlineQuery| A
```

### Потоки данных

1. Telegram отправляет webhook → **Cloudflare Worker**
2. Worker перенаправляет запрос → **Backend API**
3. Backend:

   * проверяет чат (whitelist);
   * создаёт `sessionId`;
   * обращается к **Flowise**.
4. Ответ возвращается по цепочке назад.

### 3. Роли компонентов

| Компонент                      | Роль                                                           | Примечание                                                   |
| ------------------------------ | -------------------------------------------------------------- | ------------------------------------------------------------ |
| **Telegram API**               | источник событий (`inline_query`, `message`, `callback_query`) | требует публичный HTTPS endpoint                             |
| **Cloudflare Worker**          | принимает webhook, фильтрует и пересылает данные               | мгновенно обрабатывает запросы, идеален для публичного входа |
| **Backend (Node.js / Python)** | техническая прослойка: создаёт `sessionId`, вызывает Flowise   | может быть одной serverless-функцией                         |
| **Flowise**                    | управляет контекстом и вызывает Gemini API                     | не хранит чаты, контексты из `sessionId`                      |

### 4. Ключевые принципы

* **Без БД** — все состояния временные, хранятся в памяти Flowise.
* **Stateless backend** — сервер можно перезапускать без потерь.
* **Whitelisted чаты** — список разрешённых chat_id в коде.
* **Inline only** — бот не работает как обычный чат-бот.
* **Один sessionId на inline-запрос**; reply продолжает предыдущую сессию.

---

## 🗂 Общая структура

```
telegram-inline-ai-bot/
├── worker/
│   ├── worker.js               # Cloudflare Worker (webhook handler)
│   ├── wrangler.toml           # конфиг деплоя
│   └── .env                    # токен бота и адрес backend
│
├── backend/
│   ├── handler.js              # serverless-функция (Node.js)
│   ├── package.json
│   └── .env                    # Flowise config
│
└── README.md
```

---

## 🧱 1. Cloudflare Worker

**`worker/worker.js`:**

```js
const BOT_TOKEN = ENV.BOT_TOKEN;
const BACKEND_URL = ENV.BACKEND_URL;

export default {
  async fetch(request, env) {
    const update = await request.json();
    console.log("Received:", update);

    // передаём апдейт на backend
    const res = await fetch(env.BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    const data = await res.json();

    // Inline запрос
    if (update.inline_query) {
      const answer = {
        inline_query_id: update.inline_query.id,
        results: [
          {
            type: "article",
            id: "1",
            title: "Ответ:",
            input_message_content: {
              message_text: data.reply || "⚠️ Нет ответа",
            },
          },
        ],
      };

      await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/answerInlineQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answer),
      });
    }

    // Reply (обычный message)
    if (update.message && update.message.reply_to_message) {
      const chatId = update.message.chat.id;
      const text = data.reply || "⚠️ Нет ответа";

      await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      });
    }

    return new Response("OK", { status: 200 });
  },
};
```

**`worker/wrangler.toml`:**

```toml
name = "telegram-inline-ai-bot"
main = "worker.js"
compatibility_date = "2025-01-01"

[vars]
BOT_TOKEN = "123456:ABCDEF..."
BACKEND_URL = "https://your-backend-host.vercel.app/api/flowise"
```

---

## 🧠 2. Backend (Node.js serverless API)

**`backend/handler.js`:**

```js
export default async function handler(req, res) {
  const body = await req.json();
  const user = body.inline_query?.from || body.message?.from;
  const text = body.inline_query?.query || body.message?.text;
  if (!user || !text) return new Response("Invalid", { status: 400 });

  const sessionId = `${user.id}_${Date.now()}`;

  const flowiseRes = await fetch(`${process.env.FLOWISE_BASE_URL}/run/${process.env.FLOWISE_FLOW_ID}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, question: text }),
  });

  const data = await flowiseRes.json();
  return new Response(JSON.stringify({ reply: data.text || "Нет ответа" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
```

**`backend/package.json`:**

```json
{
  "name": "flowise-backend",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "start": "node handler.js"
  },
  "dependencies": {}
}
```

**`backend/.env`:**

```
FLOWISE_BASE_URL=https://your-flowise-instance.com
FLOWISE_FLOW_ID=xxxxxxxx
```

> 🔧 Для деплоя на **Vercel** достаточно поместить `handler.js` в `api/flowise.js`.
> Для **Render / Netlify** — указать entrypoint `handler.js`.

---

## ⚡ 3. Настройка Telegram

1. Создай бота через [@BotFather](https://t.me/BotFather).
2. Введи команду:

   ```
   /setinline
   ```

   и активируй inline-режим.
3. Установи webhook:

   ```
   https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook?url=<YOUR_CLOUDFLARE_WORKER_URL>
   ```
4. Проверь, что в ответ пришло `{ "ok": true }`.

---

## 🧩 4. Flowise

* Создай Flow с входами `sessionId` и `question`.
* Экспортируй `flowId` (на вкладке "API").
* Проверь, что твой Flow доступен по POST-запросу:

  ```
  POST https://your-flowise-url.com/run/<flowId>
  {
    "sessionId": "test_123",
    "question": "Привет"
  }
  ```

---

## 📘 5. Пример `.env` (общее)

| Файл           | Переменная         | Значение               |
| -------------- | ------------------ | ---------------------- |
| `worker/.env`  | `BOT_TOKEN`        | токен Telegram         |
| `worker/.env`  | `BACKEND_URL`      | URL serverless backend |
| `backend/.env` | `FLOWISE_BASE_URL` | URL Flowise            |
| `backend/.env` | `FLOWISE_FLOW_ID`  | ID потока Flowise      |

---

## 💡 6. Деплой пошагово

1. Задеплой backend (например, на Vercel → получишь URL вроде `https://flowise-backend.vercel.app/api/flowise`).
2. Укажи этот URL в `worker/wrangler.toml`.
3. Деплой Worker:

   ```bash
   cd worker
   npx wrangler deploy
   ```
4. Установи webhook:

   ```bash
   curl "https://api.telegram.org/bot<token>/setWebhook?url=<worker_url>"
   ```
5. Проверь:
   Введи в Telegram `@botname привет` → должен появиться inline-ответ.

---

## ✅ Итого

| Компонент             | Назначение                                             | Развёртывание          |
| --------------------- | ------------------------------------------------------ | ---------------------- |
| **Cloudflare Worker** | принимает webhook, вызывает backend, отвечает Telegram | Cloudflare (Free)      |
| **Backend (Node)**    | формирует sessionId, обращается к Flowise              | Vercel / Render / Deta |
| **Flowise**           | генерирует ответ через Gemini API                      | Render / Railway / VPS |
