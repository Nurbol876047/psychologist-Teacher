import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const SYSTEM_PROMPT =
  "Сен — мектеп психологысың, мұғалімдерді қолдайсың. Жылы, құрметпен, қысқа жауап бер. Диагноз қойма, дәрі ұсынба. Хабарлама қай тілде жазылса (қазақша немесе орысша), сол тілде жауап бер.";

export async function POST(req: NextRequest) {
  try {
    const { message } = (await req.json()) as { message?: string };

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "empty_message" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY орнатылмаған. .env.local файлын тексеріңіз." },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content?.trim() ?? "";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("chat error", error);
    return NextResponse.json(
      { error: "Жауап алу кезінде қате пайда болды. Кейінірек қайталап көріңіз." },
      { status: 500 }
    );
  }
}
