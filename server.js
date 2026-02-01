const express = require("express");
const path = require("path");

// fetch для Node
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

// ===== ENV =====
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ===== ANTI SPAM =====
const requests = {};

function rateLimit(req, res, next) {
  const ip = req.ip;
  const now = Date.now();

  if (!requests[ip]) requests[ip] = [];

  requests[ip] = requests[ip].filter(time => now - time < 60000);

  if (requests[ip].length >= 3) {
    return res.status(429).json({ error: "Слишком много заявок. Подождите минуту." });
  }

  requests[ip].push(now);
  next();
}

// ===== VALIDATION =====
function validatePhone(phone) {
  return /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(phone);
}

function validateEmail(email) {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===== FORM =====
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

  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
    return res.status(500).json({ error: "Telegram не настроен" });
  }

  const message = `
🦷 Новая заявка:

👤 Имя: ${name}
📞 Телефон: ${phone}
📧 Email: ${email || "не указан"}
`;

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message
      })
    });

    res.json({ message: "Заявка успешно отправлена!" });

  } catch (err) {
    console.error("Telegram error:", err);
    res.status(500).json({ error: "Ошибка отправки" });
  }
});

// ===== START =====
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
