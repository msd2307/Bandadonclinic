require("dotenv").config();
const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req,res)=>{
  res.sendFile(path.join(__dirname,"index.html"));
});

app.get("/admin", (req,res)=>{
  res.sendFile(path.join(__dirname,"admin.html"));
});

// LOGIN
app.post("/login",(req,res)=>{
  const {login,password} = req.body;

  if(login !== process.env.ADMIN_LOGIN || password !== process.env.ADMIN_PASSWORD){
    return res.sendStatus(401);
  }

  const token = jwt.sign({role:"admin"}, process.env.JWT_SECRET,{expiresIn:"2h"});
  res.json({token});
});

// AUTH
function auth(req,res,next){
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  try{
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  }catch{
    res.sendStatus(403);
  }
}

// SEND FORM → GOOGLE SHEETS
app.post("/send", async (req,res)=>{
  const {name,phone,email} = req.body;

  await fetch(process.env.GOOGLE_SCRIPT_URL,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      secret: process.env.GOOGLE_SCRIPT_SECRET,
      name,phone,email
    })
  });

  // Telegram
  const text = `🦷 Новая заявка:\nИмя: ${name}\nТел: ${phone}\nEmail: ${email||"-"}`;

  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      chat_id:process.env.TELEGRAM_CHAT_ID,
      text
    })
  });

  res.json({success:true});
});

// ADMIN API
app.get("/patients", auth, async (req,res)=>{
  const url = `${process.env.GOOGLE_SCRIPT_URL}?secret=${process.env.GOOGLE_SCRIPT_SECRET}`;
  const r = await fetch(url);
  const data = await r.json();
  res.json(data.reverse());
});

app.listen(PORT,()=>{
  console.log("Server running on port",PORT);
});
