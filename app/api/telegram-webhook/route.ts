import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { isCrisisMessage } from "@/lib/crisisDetect";
import { CRISIS_CONTACTS } from "@/config/help";

export const runtime = "nodejs";

// Telegram-бот әрдайым ТЕК ҚАЗАҚ ТІЛІНДЕ жауап береді (пайдаланушы қай
// тілде жазса да) — сайттың негізгі чатынан айырмашылығы осында.
const SYSTEM_PROMPT = `Сен — мұғалімдерге арналған жанашыр психолог-көмекшісің, Telegram арқылы сөйлесесің.
МАҢЫЗДЫ ЕРЕЖЕ: пайдаланушы қай тілде жазса да, сен жауапты ТЕК ҚАЗАҚ ТІЛІНДЕ бересің, басқа тілге ешқашан ауыспайсың.
Әр жауабыңда міндетті түрде екі бөлік болсын:
1) Жанашырлық пен қолдау сезілетін жылы, утешительный сөздер;
2) осы жағдайда нақты көмектесетін, қолдануға оңай кеңес.
Жауабың қысқа әрі жүрекжарды болсын (шамамен 4-6 сөйлем). Диагноз қойма, дәрі ұсынба, медициналық кеңес берме.`;

interface TelegramUpdate {
  message?: {
    chat?: { id?: number };
    text?: string;
  };
}

function buildCrisisReply(): string {
  const lines = [
    "Хабарламаңызда алаңдатарлық белгілер байқалды. Өтінеміз, жалғыз қалмаңыз — маманмен байланысыңыз:",
    "",
    ...CRISIS_CONTACTS.map((c) => `• ${c.label_kk}: ${c.phone}`),
  ];
  return lines.join("\n");
}

async function sendTelegramMessage(token: string, chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

export async function POST(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  let update: TelegramUpdate;
  try {
    update = (await req.json()) as TelegramUpdate;
  } catch {
    return NextResponse.json({ ok: true });
  }

  const chatId = update.message?.chat?.id;
  const text = update.message?.text;

  if (!chatId || !text) {
    return NextResponse.json({ ok: true });
  }

  if (text === "/start") {
    await sendTelegramMessage(
      token,
      chatId,
      "Сәлеметсіз бе! Мен — мұғалімдерге арналған жанашыр көмекшімін. Не мазалап тұрғанын жазыңыз, бірге ойласайық."
    );
    return NextResponse.json({ ok: true });
  }

  if (isCrisisMessage(text)) {
    await sendTelegramMessage(token, chatId, buildCrisisReply());
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    await sendTelegramMessage(token, chatId, "Кешіріңіз, қазір жауап дайындау мүмкін болмай тұр.");
    return NextResponse.json({ ok: true });
  }

  try {
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text },
      ],
      temperature: 0.8,
    });
    const reply =
      completion.choices[0]?.message?.content?.trim() ||
      "Кешіріңіз, жауап дайындай алмадым. Қайталап жазыңызшы.";
    await sendTelegramMessage(token, chatId, reply);
  } catch {
    await sendTelegramMessage(token, chatId, "Кешіріңіз, қате пайда болды. Сәлден соң қайталап көріңізші.");
  }

  return NextResponse.json({ ok: true });
}
