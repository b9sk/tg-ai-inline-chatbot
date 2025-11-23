# ✅ Финальное Техническое Задание (ТЗ)

## Telegram Inline AI Bot

Стек: **Next.js (TypeScript) → Flowise → Gemini API**

---

## 1. Цель

Создать Telegram-бота, который работает **исключительно в inline-режиме**:

```
@botname prompt
```

Бот должен:

* отвечать прямо в том чате, где его вызвали (включая группы, чаты каналов),
* продолжать диалог, **если пользователь отвечает на сообщение бота (reply)**,
* использовать **Flowise** для обработки текста и хранения контекста,
* для inline-запросов всегда создавать **новую сессию**,
* для reply использовать **раньше созданную сессию**.

---

## 2. Ограничения

* Backend: **Next.js (API routes), TypeScript**
* AI: **Gemini API** через Flowise
* Backend **не хранит историю сообщений**
* Backend **не склеивает prompt’ы** — контекст управляется Flowise 
* **Никаких баз данных, файловых хранилищ или внешних сервисов**  

---

## 3. Бизнес-логика

### Inline запрос → новая сессия

Каждый вызов:

```
@botname prompt
```

= создаёт **новую Flowise session**.

SessionId формируется на backend:

```
sessionId = `${telegramUserId}_${Date.now()}`
```

### Reply на сообщение бота → continuation

Если пользователь нажимает **Reply** на сообщение бота:

→ используется **оригинальный sessionId**, привязанный к этому сообщению.

Backend хранит отображение:

```
(botMessageId) → sessionId
```

в обычной `Map<number, string>` (память процесса, без сохранения).

---

## 4. Whitelist поддержка (список чатов) (ОТМЕНА, НЕ БУДЕТ РЕАЛИЗОВАНО)

Файл:

```
/src/config/whitelist.ts
```

Содержит массив id чатов:

```ts
export const allowedChats = [
  -1001234567890, // example group
  123456789,      // private chat
];
```

Если chat_id отсутствует в списке → бот **игнорирует запрос** (не отвечает).

---

## 5. Поток выполнения (User Flow)

### 5.1 Inline

1. Пользователь вводит:

   ```
   @botname prompt
   ```

2. Telegram передаёт `inline_query` на webhook.

3. Backend:

   * проверяет, есть ли чат в `allowedChats`;
   * генерирует `sessionId = userId_timestamp`;
   * делает запрос в Flowise:

     ```
     POST https://flowise/run/<flowId>
     {
       "sessionId": "<sessionId>",
       "question": "<prompt>"
     }
     ```

4. Получает ответ из Flowise.

5. Возвращает Telegram-у inline-ответ (`InlineQueryResultArticle`).

6. Запоминает:

   ```
   botMessageId → sessionId
   ```

### 5.2 Reply (продолжение диалога)

1. Если пользователь отвечает на сообщение бота (reply),
2. backend по `message.reply_to_message.message_id` находит sessionId,
3. отправляет текст в Flowise с этим же sessionId.

---

## 6. Backend Responsibilities

| Что делает backend                               | ✅ |
| ------------------------------------------------ | - |
| Обрабатывает webhook от Telegram                 | ✅ |
| Вызывает Flowise (REST API)                      | ✅ |
| Управляет sessionId (inline/new, reply/continue) | ✅ |
| Проверяет whitelist чатов                        | ✅ |
| Логирование                                      | ✅ |

| Чего backend **не делает** | ❌ |
| -------------------------- | - |
| Не хранит историю чата     | ❌ |
| Не конкатенирует сообщения | ❌ |
| Не хранит данные в БД      | ❌ |

---

## 7. Файловая структура

```
src/
  pages/api/telegram/webhook.ts      // webhook endpoint
  services/
    telegram.ts                      // отправка сообщений, inline ответы
    flowise.ts                       // вызов flowise API
  config/
    whitelist.ts                     // разрешённые чаты
```

---

## 8. Environment variables (.env)

```
BOT_TOKEN=
TELEGRAM_WEBHOOK_URL=
FLOWISE_BASE_URL=
FLOWISE_FLOW_ID=
```

---

## 9. Формат ответа (InlineQueryResultArticle)

```json
{
  "type": "article",
  "id": "uuid",
  "title": "Ответ:",
  "input_message_content": {
    "message_text": "<AI response>"
  }
}
```

---

## 10. Deliverables

| Deliverable                                     | Формат |
| ----------------------------------------------- | ------ |
| GitHub Repo                                     | ✅      |
| Next.js backend (TS)                            | ✅      |
| Flowise зарегистрированный flow (.json экспорт) | ✅      |
| README.md                                       | ✅      |

---


