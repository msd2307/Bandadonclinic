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
    const response = await fetch("/book", {
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
    console.error(error);
    statusText.innerText = "Ошибка отправки. Попробуйте позже.";
  }
});
