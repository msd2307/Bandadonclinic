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
const TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const ADMIN_LOGIN = process.env.ADMIN_LOGIN;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const bot = new TelegramBot(TOKEN, { polling: false });

// ===== DB =====
const db = new sqlite3.Database("./patients.db");

db.run(`
CREATE TABLE IF NOT EXISTS patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

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
app.post("/book", (req, res) => {
  const { name, phone, email } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: "Введите имя и телефон" });
  }

  db.run(
    "INSERT INTO patients (name, phone, email) VALUES (?, ?, ?)",
    [name, phone, email],
    (err) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ message: "Ошибка базы данных" });
      }

      // ✅ всегда сразу отвечаем клиенту
      res.json({ message: "Заявка успешно отправлена!" });

      // Telegram отдельно
      const tgMessage = `🦷 Новая заявка!
Имя: ${name}
Телефон: ${phone}
Email: ${email || "-"}`;

      bot.sendMessage(CHAT_ID, tgMessage)
        .catch(err => console.error("Telegram error:", err));
    }
  );
});

// ===== PATIENTS =====
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

// ===== ADMIN =====
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
