export default async function handler(req, res) {
  const body = await req.json();
  const user = body.inline_query?.from || body.message?.from;
  const text = body.inline_query?.query || body.message?.text;
  if (!user || !text) return new Response("Invalid", { status: 400 });

  const sessionId = `${user.id}_${Date.now()}`;

  const flowiseRes = await fetch(`${process.env.FLOWISE_BASE_URL}/api/v1/prediction/${process.env.FLOWISE_FLOW_ID}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: text,
      overrideConfig: {
        sessionId: sessionId,
      },
    }),
  });

  const data = await flowiseRes.json();
  return new Response(JSON.stringify({ reply: data.text || "Нет ответа" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}