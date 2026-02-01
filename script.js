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


const form = document.getElementById("bookingForm");
const statusText = document.getElementById("status");

const phoneInput = document.getElementById("phone");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");

// ===== PHONE MASK =====
phoneInput.addEventListener("input", () => {
  let x = phoneInput.value.replace(/\D/g, "").slice(1);

  let formatted = "+7 (";
  if (x.length > 0) formatted += x.substring(0, 3);
  if (x.length >= 3) formatted += ") ";
  if (x.length > 3) formatted += x.substring(3, 6);
  if (x.length >= 6) formatted += "-";
  if (x.length > 6) formatted += x.substring(6, 8);
  if (x.length >= 8) formatted += "-";
  if (x.length > 8) formatted += x.substring(8, 10);

  phoneInput.value = formatted;
});

// ===== POPUP =====
function showPopup() {
  popup.classList.remove("hidden");
}

closePopup.addEventListener("click", () => {
  popup.classList.add("hidden");
});

// ===== FORM SEND =====
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = phoneInput.value.trim();
  const email = document.getElementById("email").value.trim();

  statusText.textContent = "Отправка...";

  try {
    const response = await fetch("/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, phone, email })
    });

    const result = await response.json();

    if (!response.ok) {
      statusText.textContent = result.error || "Ошибка отправки";
      return;
    }

    statusText.textContent = "";
    showPopup();
    form.reset();

  } catch (err) {
    console.error(err);
    statusText.textContent = "Ошибка соединения с сервером";
  }
});
