import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { TOPICS } from "@/data/topics";

export const runtime = "nodejs";

interface ClassifyResult {
  topicId: number | null;
}

export async function POST(req: NextRequest) {
  try {
    const { message } = (await req.json()) as { message?: string };

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ topicId: null } satisfies ClassifyResult);
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ topicId: null } satisfies ClassifyResult);
    }

    const client = new OpenAI({ apiKey });

    const topicsList = TOPICS.map(
      (t) => `${t.id}. ${t.title_kk} / ${t.title_ru} (ключевые слова: ${[...t.keywords_kk, ...t.keywords_ru].join(", ")})`
    ).join("\n");

    const systemPrompt = `Ты классифицируешь сообщение учителя по одной из ${TOPICS.length} тем психологической поддержки.
Список тем:
${topicsList}

Сообщение может быть написано на казахском или русском языке, с опечатками, заменой букв
(например латиницей вместо кириллицы, "4" вместо "ч" и т.п.), сокращениями или в непрямой форме —
определяй тему по смыслу, а не только по точному совпадению слов.

Если сообщение явно соответствует одной из тем — верни её номер.
Если ни одна тема не подходит — верни null.
Ответь СТРОГО в формате JSON: {"topicId": <число или null>}`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0,
    });

    const text = completion.choices[0]?.message?.content?.trim() ?? "";
    const parsed = JSON.parse(text);
    const topicId =
      typeof parsed.topicId === "number" && TOPICS.some((t) => t.id === parsed.topicId)
        ? parsed.topicId
        : null;

    return NextResponse.json({ topicId } satisfies ClassifyResult);
  } catch (error) {
    console.error("classify error", error);
    return NextResponse.json({ topicId: null } satisfies ClassifyResult);
  }
}
