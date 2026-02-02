require("dotenv").config();
const express = require("express");
const path = require("path");
const fetch = (...args) =>
  import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req,res)=>{
  res.sendFile(path.join(__dirname,"public","index.html"));
});

app.post("/send", async (req,res)=>{
  try {
    const { name, phone, email } = req.body;

    if(!name || !phone){
      return res.status(400).json({error:"Invalid data"});
    }

    // Google Sheets
    await fetch(process.env.GOOGLE_SCRIPT_URL,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        secret: process.env.GOOGLE_SCRIPT_SECRET,
        name, phone, email
      })
    });

    // Telegram
    const text = `🦷 Новая заявка\nИмя: ${name}\nТел: ${phone}\nEmail: ${email || "-"}`;

    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text
      })
    });

    res.json({success:true});

  } catch(err){
    console.error("SEND ERROR:", err);
    res.status(500).json({success:false});
  }
});

app.listen(process.env.PORT || 3000, ()=>{
  console.log("Server started");
});
