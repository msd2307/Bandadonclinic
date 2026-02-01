const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ====== ENV ======
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// ====== MIDDLEWARE ======
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ====== ANTI SPAM (IP LIMIT) ======
const requests = {};

function rateLimit(req, res, next) {
  const ip = req.ip;
  const now = Date.now();

  if (!requests[ip]) {
    requests[ip] = [];
  }

  requests[ip] = requests[ip].filter(time => now - time < 60000);

  if (requests[ip].length >= 3) {
    return res.status(429).json({ error: "Слишком много запросов" });
  }

  requests[ip].push(now);
  next();
}

// ====== VALIDATION ======
function validatePhone(phone) {
  return /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(phone);
}

function validateEmail(email) {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ====== FORM ENDPOINT ======
app.post("/send", rateLimit, async (req, res) => {
  const { name, phone, email } = req.body;

  if (!name || name.length < 2) {
    return res.status(400).json({ error: "Некорректное имя" });
  }

  if (!validatePhone(phone)) {
    return res.status(400).json({ error: "Некорректный телефон" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Некорректный email" });
  }

  const message = `
🦷 Новая заявка:

👤 Имя: ${name}
📞 Телефон: ${phone}
📧 Email: ${email || "не указан"}
`;

  try {
    const telegramURL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    await fetch(telegramURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message
      })
    });

    res.json({ success: true });

  } catch (err) {
    console.error("Ошибка Telegram:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// ====== START ======
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
