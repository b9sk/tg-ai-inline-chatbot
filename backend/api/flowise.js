export default async function handler(req, res) {
  // Expecting a Telegram webhook-like body containing either
  // `inline_query` or `message` objects. Preserve previous behavior.
  try {
    const body = req.body || {};
    const user = body.inline_query?.from || body.message?.from;
    const text = body.inline_query?.query || body.message?.text;

    if (!user || !text) {
      return res.status(400).json({
        error: "Invalid payload: missing user or text",
        body
      });
    }

    const sessionId = `${user.id}_${Date.now()}`;

    const flowiseUrl = `${process.env.FLOWISE_BASE_URL}/api/v1/prediction/${process.env.FLOWISE_FLOW_ID}`;

    const flowiseRes = await fetch(flowiseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: text,
        overrideConfig: { sessionId },
      }),
    });

    if (!flowiseRes.ok) {
      const textErr = await flowiseRes.text().catch(() => "");
      console.error("Flowise request failed:", flowiseRes.status, textErr);
      return res.status(502).json({ error: "Flowise service error", status: flowiseRes.status });
    }

    const data = await flowiseRes.json().catch(() => ({}));
    return res.status(200).json({ reply: data.text || "Нет ответа" });
  } catch (err) {
    console.error("/api/flowise error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}