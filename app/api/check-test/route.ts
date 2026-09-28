import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];
const ALLOWED_PDF_TYPES = ["application/pdf"];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_PDF_TYPES];
const MAX_FILE_BYTES = 15 * 1024 * 1024;

const RESULT_SCHEMA = {
  type: "object",
  properties: {
    summary: {
      type: "object",
      properties: {
        total: { type: "integer" },
        correct: { type: "integer" },
        incorrect: { type: "integer" },
        score_percent: { type: "integer" },
        overall_comment: { type: "string" },
      },
      required: ["total", "correct", "incorrect", "score_percent", "overall_comment"],
      additionalProperties: false,
    },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          number: { type: "string" },
          question: { type: "string" },
          given_answer: { type: "string" },
          is_correct: { type: "boolean" },
          correct_answer: { type: "string" },
          explanation: { type: "string" },
        },
        required: ["number", "question", "given_answer", "is_correct", "correct_answer", "explanation"],
        additionalProperties: false,
      },
    },
  },
  required: ["summary", "items"],
  additionalProperties: false,
};

const SYSTEM_PROMPT_KK = `Сен — тәжірибелі пән мұғалімісің әрі тест тексеруші сарапшысың. Саған тест тапсырмалары мен оларға берілген жауаптар бейнеленген құжат (сурет немесе PDF) не мәтін беріледі.

Тапсырма:
1. Құжаттағы әр сұрақты және оған берілген жауапты анықта (құжат бірнеше беттен тұрса, барлық беттерді қара).
2. Өз біліміңмен әр сұрақтың дұрыс жауабын анықтап, берілген жауапты соған сәйкестендіріп тексер.
3. Жауап дұрыс болса — is_correct: true, қате болса — false, дұрыс жауапты correct_answer өрісіне жаз және қысқаша, түсінікті түсіндірме бер (дұрыс жауапта да қысқаша түсіндірме жаз).
4. Сұрақтарды құжаттағы ретімен нөмірле (number өрісі — жол түрінде, мысалы "1").
5. summary өрісінде жалпы дұрыс/қате санын, пайызын және қысқаша жалпы пікірді жаз.

Егер құжатта сұрақ/жауап анықталмаса, items бос массив болсын және overall_comment өрісінде себебін түсіндір.`;

const SYSTEM_PROMPT_RU = `Ты — опытный учитель-предметник и эксперт по проверке тестов. Тебе передают документ (изображение или PDF) или текст с тестовыми вопросами и данными на них ответами.

Задача:
1. Определи каждый вопрос и ответ, данный на него в документе (если документ многостраничный — учти все страницы).
2. Используя свои знания, определи правильный ответ на каждый вопрос и сравни с данным ответом.
3. Если ответ верный — is_correct: true, если неверный — false, укажи правильный ответ в поле correct_answer и дай краткое понятное объяснение (для верных ответов тоже дай короткое пояснение).
4. Пронумеруй вопросы в том порядке, в котором они идут в документе (поле number — строка, например "1").
5. В summary укажи общее число верных/неверных ответов, процент и краткий общий комментарий.

Если в документе не удалось распознать вопросы/ответы, верни пустой массив items и объясни причину в overall_comment.`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY орнатылмаған. .env.local файлын тексеріңіз." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const text = formData.get("text");
    const lang = formData.get("lang") === "ru" ? "ru" : "kk";

    const hasText = typeof text === "string" && text.trim().length > 0;
    const hasFile = file instanceof File && file.size > 0;

    if (!hasText && !hasFile) {
      return NextResponse.json({ error: "empty_input" }, { status: 400 });
    }

    const contentParts: Array<
      | { type: "input_text"; text: string }
      | { type: "input_image"; image_url: string; detail: "auto" }
      | { type: "input_file"; filename: string; file_data: string }
    > = [];

    if (hasFile) {
      const uploaded = file as File;
      if (!ALLOWED_TYPES.includes(uploaded.type)) {
        return NextResponse.json({ error: "unsupported_file_type" }, { status: 400 });
      }
      if (uploaded.size > MAX_FILE_BYTES) {
        return NextResponse.json({ error: "file_too_large" }, { status: 400 });
      }
      const buffer = Buffer.from(await uploaded.arrayBuffer());
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${uploaded.type};base64,${base64}`;

      if (ALLOWED_IMAGE_TYPES.includes(uploaded.type)) {
        contentParts.push({ type: "input_image", image_url: dataUrl, detail: "auto" });
      } else {
        contentParts.push({
          type: "input_file",
          filename: uploaded.name || "test.pdf",
          file_data: dataUrl,
        });
      }
    }

    contentParts.push({
      type: "input_text",
      text: hasText
        ? (lang === "ru"
            ? `Вот текст теста с ответами для проверки:\n\n${(text as string).trim()}`
            : `Мынау — тексеруге арналған тест мәтіні мен жауаптар:\n\n${(text as string).trim()}`)
        : lang === "ru"
        ? "Проверь тест в приложенном документе."
        : "Тіркелген құжаттағы тестті тексер.",
    });

    const client = new OpenAI({ apiKey });

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: lang === "ru" ? SYSTEM_PROMPT_RU : SYSTEM_PROMPT_KK }],
        },
        { role: "user", content: contentParts },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "test_check_result",
          schema: RESULT_SCHEMA,
          strict: true,
        },
      },
      temperature: 0.2,
    });

    const raw = response.output_text?.trim() ?? "";

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Тестті талдау кезінде қате пайда болды. Қайталап көріңіз." },
        { status: 500 }
      );
    }

    return NextResponse.json({ result: parsed });
  } catch (error) {
    console.error("check-test error", error);
    return NextResponse.json(
      { error: "Тестті тексеру кезінде қате пайда болды. Кейінірек қайталап көріңіз." },
      { status: 500 }
    );
  }
}
