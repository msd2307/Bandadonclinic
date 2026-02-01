const form = document.getElementById("bookingForm");
const statusText = document.getElementById("status");
const submitBtn = document.querySelector("button");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();

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

  submitBtn.disabled = true;

  try {
    const response = await fetch("/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email })
    });

    const result = await response.json();
    statusText.innerText = result.message;
    form.reset();

    setTimeout(() => {
      submitBtn.disabled = false;
    }, 30000);

  } catch (error) {
    statusText.innerText = "Ошибка отправки. Попробуйте позже.";
    submitBtn.disabled = false;
  }
});
