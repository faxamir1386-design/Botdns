// main.ts
import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

// ======== تنظیمات ربات ========
const TELEGRAM_BOT_TOKEN = "8551884972:AAElCfKOS1sByh4lhZdDH3Nwrcw2egv2NNk";
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// لینک کانال اجباری
const CHANNEL_LINK = "https://t.me/lord_dns";

// ایدی مدیریت
const ADMIN_ID = "@BETER_LORD";

// ======== ساخت کد DNS گیمینگ ========
function generateDNSCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `DNS-${code}`;
}

// ======== ارسال پیام ========
async function sendMessage(chatId: number, text: string, buttons?: any) {
  const payload: any = {
    chat_id: chatId,
    text: text,
    parse_mode: "Markdown",
  };
  
  if (buttons) {
    payload.reply_markup = JSON.stringify({
      inline_keyboard: buttons,
    });
  }

  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// ======== ایجاد دکمه‌ها ========
function createButtons() {
  return [
    [
      { text: "🎮 دریافت کد DNS گیمینگ", callback_data: "get_dns" },
      { text: "📱 همراه اول ایران", url: "https://www.mci.ir" },
    ],
    [
      { text: "📢 کانال اجباری", url: CHANNEL_LINK },
    ],
  ];
}

// ======== سرور اصلی Deno ========
serve(async (req) => {
  try {
    const body = await req.json();

    const chatId = body.message?.chat?.id || body.callback_query?.message?.chat?.id;
    const data = body.callback_query?.data;

    if (!chatId) return new Response("OK");

    // بررسی شروع ربات
    if (body.message?.text?.startsWith("/start")) {
      await sendMessage(
        chatId,
        `سلام! 🎮\nبرای دریافت کد DNS گیمینگ روی دکمه زیر بزن👇\n\n📢 لطفاً حتماً عضو کانال شوید: [کانال](${CHANNEL_LINK})`,
        createButtons()
      );
    }

    // وقتی کاربر روی دکمه دریافت DNS کلیک کرد
    if (data === "get_dns") {
      const code = generateDNSCode();
      await sendMessage(
        chatId,
        `✅ کد DNS شما:\n\n\`${code}\`\n\n📢 عضو کانال اجباری: [کانال](${CHANNEL_LINK})`,
        createButtons()
      );

      // اطلاع به ادمین
      await sendMessage(
        parseInt("0"), // اگر میخوای ایدی عددی ادمین بذار، بعدا تغییر بده
        `کاربر ${chatId} یک کد دریافت کرد: ${code}\nمدیریت: ${ADMIN_ID}`
      );
    }

    return new Response("OK");
  } catch (err) {
    console.error(err);
    return new Response("Error", { status: 500 });
  }
});
