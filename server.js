const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// 🔐 логин / пароль админа
const ADMIN_LOGIN = "admin";
const ADMIN_PASSWORD = "12345";

// база данных
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

// логин
app.post("/login", (req, res) => {
  const { login, password } = req.body;

  if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

// сохранить заявку
app.post("/book", (req, res) => {
  const { name, phone, email } = req.body;

  db.run(
    "INSERT INTO patients (name, phone, email) VALUES (?, ?, ?)",
    [name, phone, email],
    () => {

      const message = `🦷 Новая заявка!
Имя: ${name}
Телефон: ${phone}
Email: ${email || "-"}`;

      bot.sendMessage(CHAT_ID, message);

      res.json({ message: "Заявка отправлена и отправлена в Telegram" });
    }
  );
});


// получить всех
app.get("/patients", (req, res) => {
  db.all("SELECT * FROM patients ORDER BY created_at DESC", (err, rows) => {
    res.json(rows);
  });
});

// удалить пациента
app.delete("/patients/:id", (req, res) => {
  db.run("DELETE FROM patients WHERE id = ?", [req.params.id], () => {
    res.json({ success: true });
  });
});

// экспорт CSV
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
  console.log("Server running on port " + PORT);
});


const TelegramBot = require("node-telegram-bot-api");

const TOKEN = "8573049252:AAEphvfstHv9QL4LdJlDeq8F9HWLaVLHFe0";
const CHAT_ID = "7520455883";

const bot = new TelegramBot(TOKEN, { polling: false });
