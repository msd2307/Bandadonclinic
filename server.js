const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ===== ADMIN =====
const ADMIN_LOGIN = "admin";
const ADMIN_PASSWORD = "12345";

// ===== TELEGRAM (из ENV) =====
const TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

if (!TOKEN || !CHAT_ID) {
  console.error("❌ BOT_TOKEN или CHAT_ID не заданы в Environment Variables");
}

const bot = new TelegramBot(TOKEN, { polling: false });

// ===== DATABASE =====
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

// ===== LOGIN =====
app.post("/login", (req, res) => {
  const { login, password } = req.body;

  if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
    return res.json({ success: true });
  } else {
    return res.status(401).json({ success: false });
  }
});

// ===== BOOK FORM =====
app.post("/book", async (req, res) => {
  const { name, phone, email } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: "Заполните имя и телефон" });
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
        return res.json({ message: "Заявка успешно отправлена!" });
      } catch (e) {
        console.error("Telegram error:", e);
        return res.json({ message: "Заявка сохранена, Telegram временно недоступен" });
      }
    }
  );
});

// ===== GET PATIENTS =====
app.get("/patients", (req, res) => {
  db.all("SELECT * FROM patients ORDER BY created_at DESC", (err, rows) => {
    if (err) return res.status(500).json([]);
    res.json(rows);
  });
});

// ===== DELETE PATIENT =====
app.delete("/patients/:id", (req, res) => {
  db.run("DELETE FROM patients WHERE id = ?", [req.params.id], () => {
    res.json({ success: true });
  });
});

// ===== EXPORT CSV =====
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

// ===== ADMIN PAGE =====
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("✅ Server running on port " + PORT);
});
