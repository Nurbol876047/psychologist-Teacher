// Тек локальды әзірлеу үшін көмекші скрипт: Telegram-нан жаңа хабарламаларды
// getUpdates арқылы сұрап тұрып, /api/telegram-webhook эндпойнтіне жібереді.
// Production-да мұның қажеті жоқ — сол жерде setWebhook қолданылады
// (публикалық HTTPS домен қажет, localhost үшін ол жоқ).
import fs from "node:fs";
import path from "node:path";

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  const content = fs.readFileSync(envPath, "utf8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
  }
  return env;
}

const env = loadEnvLocal();
const token = env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error("TELEGRAM_BOT_TOKEN .env.local файлында табылмады");
  process.exit(1);
}

const base = `https://api.telegram.org/bot${token}`;
const webhookUrl = process.env.LOCAL_WEBHOOK_URL || "http://localhost:3000/api/telegram-webhook";
let offset = 0;

console.log("Telegram polling басталды... (Ctrl+C — тоқтату)");

async function poll() {
  for (;;) {
    try {
      const res = await fetch(`${base}/getUpdates?timeout=25&offset=${offset}`);
      const data = await res.json();
      if (data.ok) {
        for (const update of data.result) {
          offset = update.update_id + 1;
          if (update.message?.text) {
            console.log("Жаңа хабарлама:", update.message.text);
            await fetch(webhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(update),
            });
          }
        }
      }
    } catch (err) {
      console.error("Polling қатесі:", err instanceof Error ? err.message : err);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

poll();
