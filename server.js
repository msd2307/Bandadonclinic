require("dotenv").config();
const express = require("express");
const path = require("path");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req,res)=>{
  res.sendFile(path.join(__dirname,"index.html"));
});

app.post("/send", async (req,res)=>{
  const { name, phone, email } = req.body;

  try {
    // Google Sheets
    await fetch(process.env.GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        secret: process.env.GOOGLE_SCRIPT_SECRET,
        name,
        phone,
        email
      })
    });

    // Telegram
    const text = `🦷 Новая заявка:
Имя: ${name}
Телефон: ${phone}
Email: ${email || "-"}`;

    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text
      })
    });

    res.json({ success:true });

  } catch (err) {
    console.error("Ошибка отправки:", err);
    res.status(500).json({ success:false });
  }
});

app.listen(PORT,()=>{
  console.log("Server running on port", PORT);
});
