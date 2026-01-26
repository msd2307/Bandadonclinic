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
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
const button = form.querySelector("button");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  button.disabled = true;
  button.innerText = "Отправляем...";

  const data = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value
  };

  try {
    const response = await fetch("/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    popup.classList.remove("hidden");
    form.reset();

  } catch (error) {
    alert("Ошибка отправки. Попробуйте позже.");
  }

  button.disabled = false;
  button.innerText = "Отправить заявку";
});

closePopup.addEventListener("click", () => {
  popup.classList.add("hidden");
});
