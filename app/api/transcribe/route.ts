import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

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
    const audio = formData.get("audio");
    const lang = formData.get("lang");

    if (!(audio instanceof File) || audio.size === 0) {
      return NextResponse.json({ error: "empty_audio" }, { status: 400 });
    }

    const client = new OpenAI({ apiKey });
    const transcription = await client.audio.transcriptions.create({
      file: audio,
      model: "whisper-1",
      language: lang === "ru" ? "ru" : "kk",
    });

    const text = transcription.text?.trim() ?? "";
    if (!text) {
      return NextResponse.json({ error: "no_speech" }, { status: 200 });
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("transcribe error", error);
    return NextResponse.json(
      { error: "Дауысты тану кезінде қате пайда болды." },
      { status: 500 }
    );
  }
}
