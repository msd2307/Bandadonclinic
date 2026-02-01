require("dotenv").config();
const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

// ===== DB =====
const db = new sqlite3.Database("./db.sqlite");

db.run(`
CREATE TABLE IF NOT EXISTS patients(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  phone TEXT,
  email TEXT,
  created_at TEXT
)
`);

// ===== ROUTES =====
app.get("/", (req,res)=>{
  res.sendFile(path.join(__dirname,"index.html"));
});

app.get("/admin", (req,res)=>{
  res.sendFile(path.join(__dirname,"admin.html"));
});

// ===== LOGIN =====
app.post("/login", async (req,res)=>{
  const { login, password } = req.body;

  if(login !== process.env.ADMIN_LOGIN){
    return res.sendStatus(401);
  }

  const ok = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
  if(!ok){
    return res.sendStatus(401);
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token });
});

// ===== AUTH MIDDLEWARE =====
function auth(req,res,next){
  let token;

  if(req.headers.authorization){
    token = req.headers.authorization.split(" ")[1];
  } else if(req.query.token){
    token = req.query.token;
  }

  if(!token) return res.sendStatus(401);

  try{
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  }catch{
    res.sendStatus(403);
  }
}

// ===== SAVE FORM =====
app.post("/send", async (req,res)=>{
  const {name,phone,email} = req.body;
  const date = new Date().toLocaleString();

  db.run(
    "INSERT INTO patients(name,phone,email,created_at) VALUES(?,?,?,?)",
    [name,phone,email,date]
  );

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

// ===== ADMIN API =====
app.get("/patients", auth, (req,res)=>{
  db.all("SELECT * FROM patients ORDER BY id DESC",(err,rows)=>{
    res.json(rows);
  });
});

app.delete("/patients/:id", auth, (req,res)=>{
  db.run("DELETE FROM patients WHERE id=?",[req.params.id]);
  res.json({success:true});
});

app.get("/export", auth, (req,res)=>{
  db.all("SELECT * FROM patients",(err,rows)=>{
    let csv = "ID,Name,Phone,Email,Date\n";
    rows.forEach(r=>{
      csv += `${r.id},${r.name},${r.phone},${r.email},${r.created_at}\n`;
    });

    res.setHeader("Content-Type","text/csv");
    res.setHeader("Content-Disposition","attachment; filename=patients.csv");
    res.send(csv);
  });
});

// ===== START =====
app.listen(PORT,()=>{
  console.log("Server started on port", PORT);
});
