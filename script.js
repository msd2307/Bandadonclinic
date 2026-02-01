// ===== АНИМАЦИИ reveal =====
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


// ===== АНТИСПАМ =====
let lastSubmitTime = 0;
const COOLDOWN = 10000; // 10 секунд


// ===== ФОРМА =====
const form = document.getElementById("bookingForm");
const statusText = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const now = Date.now();
  if (now - lastSubmitTime < COOLDOWN) {
    statusText.innerText = "Подождите 10 секунд перед повторной отправкой";
    return;
  }

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();

  // ===== ВАЛИДАЦИЯ =====
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !phone) {
    statusText.innerText = "Введите имя и телефон";
    return;
  }

  if (!phoneRegex.test(phone)) {
    statusText.innerText = "Введите корректный номер телефона";
    return;
  }

  if (email && !emailRegex.test(email)) {
    statusText.innerText = "Введите корректный email";
    return;
  }

  statusText.innerText = "Отправка...";

  try {
      const response = await fetch("/book", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
});

const result = await response.json();

if (response.ok) {
  showPopup();
  form.reset();
} else {
  status.textContent = result.message || "Ошибка отправки";
}

const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");

function showPopup() {
  popup.classList.remove("hidden");
}

closePopup.addEventListener("click", () => {
  popup.classList.add("hidden");
});
