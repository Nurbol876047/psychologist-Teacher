import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Мұғалімнің нақты хабарламасын ЕШҚАШАН Telegram-ға жібермейміз — тек
// анонимді оқиға логы (қай фильм ұсынылғаны). Бұл сайттың құпиялылық
// уәдесімен сәйкес келеді (жеке деректер сақталмайды/жіберілмейді).
export async function POST(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  try {
    const { text } = (await req.json()) as { text?: string };
    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "empty" }, { status: 400 });
    }

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: text.slice(0, 500) }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "telegram_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "telegram_failed" }, { status: 502 });
  }
}
