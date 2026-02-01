require("dotenv").config();

const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ===== ENV =====
const ADMIN_LOGIN = process.env.ADMIN_LOGIN || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "12345";
const TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

if (!TOKEN || !CHAT_ID) {
  console.error("❌ BOT_TOKEN или CHAT_ID не заданы");
}

const bot = new TelegramBot(TOKEN, { polling: false });

// ===== DB =====
const db = new sqlite3.Database("./patients.db");

db.run(`
CREATE TABLE IF NOT EXISTS patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  phone TEXT,
  email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

// ===== антиспам по IP =====
const lastRequest = {};

// ===== LOGIN =====
app.post("/login", (req, res) => {
  const { login, password } = req.body;

  if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

// ===== BOOK =====
app.post("/book", async (req, res) => {
  const { name, phone, email } = req.body;
  const ip = req.ip;

  // антиспам 30 сек
  if (lastRequest[ip] && Date.now() - lastRequest[ip] < 30000) {
    return res.status(429).json({ message: "Подождите 30 секунд перед повторной отправкой" });
  }
  lastRequest[ip] = Date.now();

  // валидация
  if (!name || !phone) {
    return res.status(400).json({ message: "Введите имя и телефон" });
  }

  const phoneRegex = /^\+?[0-9\s\-()]{10,15}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: "Неверный формат телефона" });
  }

  if (email && !emailRegex.test(email)) {
    return res.status(400).json({ message: "Неверный формат email" });
  }

  db.run(
    "INSERT INTO patients (name, phone, email) VALUES (?, ?, ?)",
    [name, phone, email],
    async (err) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ message: "Ошибка базы данных" });
      }

      const message = `🦷 Новая заявка!
Имя: ${name}
Телефон: ${phone}
Email: ${email || "-"}`;

      try {
        await bot.sendMessage(CHAT_ID, message);
        res.json({ success: true, message: "Заявка успешно отправлена!" });
      } catch (e) {
        console.error("Telegram error:", e);
        res.json({ success: true, message: "Заявка сохранена, Telegram временно недоступен" });
      }
    }
  );
});

// ===== ADMIN DATA =====
app.get("/patients", (req, res) => {
  db.all("SELECT * FROM patients ORDER BY created_at DESC", (err, rows) => {
    res.json(rows);
  });
});

app.delete("/patients/:id", (req, res) => {
  db.run("DELETE FROM patients WHERE id = ?", [req.params.id], () => {
    res.json({ success: true });
  });
});

app.get("/export", (req, res) => {
  db.all("SELECT * FROM patients", (err, rows) => {
    let csv = "ID,Имя,Телефон,Email,Дата\n";
    rows.forEach(p => {
      csv += `${p.id},${p.name},${p.phone},${p.email},${p.created_at}\n`;
    });

    res.header("Content-Type", "text/csv");
    res.attachment("patients.csv");
    res.send(csv);
  });
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("✅ Server running on port " + PORT);
});
