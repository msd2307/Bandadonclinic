const form = document.getElementById("bookingForm");
const statusText = document.getElementById("status");

const popup = document.getElementById("popup");
const closePopupBtn = document.getElementById("closePopup");

let lastSubmitTime = 0;
const COOLDOWN = 30000; // 30 секунд защита от спама

// ===== POPUP =====
function showPopup() {
  popup.classList.remove("hidden");
}

function hidePopup() {
  popup.classList.add("hidden");
}

closePopupBtn.addEventListener("click", hidePopup);

// ===== ANIMATION REVEAL =====
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  reveals.forEach(el => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    const elementVisible = 100;

    if (elementTop < windowHeight - elementVisible) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// ===== VALIDATION =====
function validatePhone(phone) {
  const phoneRegex = /^\+?[0-9\s\-()]{10,15}$/;
  return phoneRegex.test(phone);
}

function validateEmail(email) {
  if (email.trim() === "") return true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ===== FORM SUBMIT =====
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const now = Date.now();
  if (now - lastSubmitTime < COOLDOWN) {
    statusText.textContent = "⏳ Подождите 30 секунд перед повторной отправкой.";
    statusText.style.color = "red";
    return;
  }

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();

  if (name.length < 2) {
    statusText.textContent = "Введите корректное имя";
    statusText.style.color = "red";
    return;
  }

  if (!validatePhone(phone)) {
    statusText.textContent = "Введите корректный номер телефона";
    statusText.style.color = "red";
    return;
  }

  if (!validateEmail(email)) {
    statusText.textContent = "Введите корректный email";
    statusText.style.color = "red";
    return;
  }

  statusText.textContent = "Отправка...";
  statusText.style.color = "black";

  try {
    const response = await fetch("/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, phone, email })
    });

    if (!response.ok) {
      throw new Error("Ошибка сервера");
    }

    form.reset();
    statusText.textContent = "";
    showPopup();
    lastSubmitTime = now;

  } catch (error) {
    statusText.textContent = "Ошибка отправки. Попробуйте позже.";
    statusText.style.color = "red";
  }
});
