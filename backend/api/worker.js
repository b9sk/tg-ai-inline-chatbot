const BOT_TOKEN = process.env.BOT_TOKEN;
const BACKEND_URL = process.env.BACKEND_URL;

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