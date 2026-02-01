function scrollToForm() {
  document.getElementById("form").scrollIntoView({ behavior: "smooth" });
}

// анимации
const elements = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

elements.forEach(el => observer.observe(el));

// форма
const form = document.getElementById("contactForm");
const status = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;

  status.textContent = "Отправка...";

  const res = await fetch("/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, email })
  });

  if (res.ok) {
    status.textContent = "✅ Заявка отправлена!";
    form.reset();
  } else {
    status.textContent = "❌ Ошибка отправки";
  }
});
