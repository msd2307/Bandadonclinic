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


// ===== POPUP =====
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");

function showPopup() {
  popup.classList.remove("hidden");
}

closePopup.addEventListener("click", () => {
  popup.classList.add("hidden");
});


// ===== МАСКА ТЕЛЕФОНА =====
const phoneInput = document.getElementById("phone");

phoneInput.addEventListener("input", maskPhone);

function maskPhone(e) {
  let x = e.target.value.replace(/\D/g, "").slice(0, 11);

  if (x.startsWith("8")) x = "7" + x.slice(1);

  let formatted = "+7";

  if (x.length > 1) formatted += " (" + x.substring(1, 4);
  if (x.length >= 4) formatted += ")";
  if (x.length >= 4) formatted += " " + x.substring(4, 7);
  if (x.length >= 7) formatted += "-" + x.substring(7, 9);
  if (x.length >= 9) formatted += "-" + x.substring(9, 11);

  e.target.value = formatted;
}


// ===== ФОРМА =====
const form = document.getElementById("bookingForm");
const statusText = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();

  // regex под формат: +7 (999) 999-99-99
  const phoneRegex = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;

  if (!phoneRegex.test(phone)) {
    statusText.innerText = "Введите корректный номер телефона";
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

    statusText.innerText = "";
    showPopup();
    form.reset();

  } catch (error) {
    console.error("Ошибка:", error);
    statusText.innerText = "Ошибка отправки. Попробуйте позже.";
  }
});
