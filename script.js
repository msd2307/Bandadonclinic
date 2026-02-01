// ===== Reveal animation =====
const reveals = document.querySelectorAll(".reveal");

function reveal() {
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 120) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", reveal);
reveal();

// ===== Popup =====
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");

function showPopup() {
  popup.classList.remove("hidden");
}

closePopup.addEventListener("click", () => {
  popup.classList.add("hidden");
});

// ===== Form =====
const form = document.getElementById("bookingForm");
const statusText = document.getElementById("status");

let canSend = true;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!canSend) {
    statusText.innerText = "Подождите 30 секунд перед повторной отправкой";
    return;
  }

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();

  const phoneRegex = /^\+?[0-9\s\-()]{10,15}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!phoneRegex.test(phone)) {
    statusText.innerText = "Введите корректный номер телефона";
    return;
  }

  if (email && !emailRegex.test(email)) {
    statusText.innerText = "Введите корректный email";
    return;
  }

  const data = { name, phone, email };

  try {
    const response = await fetch("/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    statusText.innerText = result.message;

    if (result.success) {
      showPopup();
      form.reset();
      canSend = false;
      setTimeout(() => canSend = true, 30000);
    }

  } catch (error) {
    statusText.innerText = "Ошибка соединения с сервером";
  }
});
