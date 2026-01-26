const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ===== Admin credentials 
const ADMIN_LOGIN = process.env.ADMIN_LOGIN 
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD 

// ===== Telegram from env =====
const TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

const bot = new TelegramBot(TOKEN, { polling: false });

// ===== Database =====
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

// ===== Login =====
app.post("/login", (req, res) => {
  const { login, password } = req.body;

  if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Неверные данные" });
  }
});

// ===== Booking =====
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
        return res.status(500).json({ message: "Ошибка сервера" });
      }

      // ✅ сначала ответ клиенту
      res.json({ message: "Заявка успешно отправлена!" });

      // 🔁 потом Telegram (не влияет на ответ)
      const tgMessage = `🦷 Новая заявка!
Имя: ${name}
Телефон: ${phone}
Email: ${email || "-"}`;

      bot.sendMessage(CHAT_ID, tgMessage)
        .then(() => console.log("Telegram sent"))
        .catch(err => console.error("Telegram error:", err));
    }
  );
});

// ===== Get patients =====
app.get("/patients", (req, res) => {
  db.all("SELECT * FROM patients ORDER BY created_at DESC", (err, rows) => {
    if (err) return res.status(500).json([]);
    res.json(rows);
  });
});

// ===== Delete patient =====
app.delete("/patients/:id", (req, res) => {
  db.run("DELETE FROM patients WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
});

// ===== Export CSV =====
app.get("/export", (req, res) => {
  db.all("SELECT * FROM patients", (err, rows) => {
    if (err) return res.status(500).send("DB error");

    let csv = "ID,Имя,Телефон,Email,Дата\n";

    rows.forEach(p => {
      csv += `${p.id},${p.name},${p.phone},${p.email || ""},${p.created_at}\n`;
    });

    res.header("Content-Type", "text/csv");
    res.attachment("patients.csv");
    res.send(csv);
  });
});

// ===== Admin panel =====
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// ===== Server =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
