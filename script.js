// Анимации reveal
const reveals = document.querySelectorAll('.reveal');

function reveal() {
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 120) {
      el.classList.add('active');
    }
  });
}
window.addEventListener('scroll', reveal);
reveal();


// Форма отправки
const form = document.getElementById("bookingForm");
const statusText = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value
  };

  try {
    const response = await fetch("http://localhost:3000/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    statusText.innerText = result.message;
    form.reset();

  } catch (error) {
    statusText.innerText = "Ошибка отправки. Попробуйте позже.";
  }
});

const TelegramBot = require("node-telegram-bot-api");

const TOKEN = "8573049252:AAEphvfstHv9QL4LdJlDeq8F9HWLaVLHFe0";
const CHAT_ID = "7520455883";

const bot = new TelegramBot(TOKEN, { polling: false });
