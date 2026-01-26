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

  statusText.innerText = "Отправка...";
  statusText.style.color = "black";

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
    console.log("Server response:", result);

    if (result.success === true) {
      statusText.innerText = result.message;
      statusText.style.color = "green";
      form.reset();
    } else {
      statusText.innerText = result.message || "Ошибка отправки";
      statusText.style.color = "red";
    }

  } catch (error) {
    console.error("Fetch error:", error);
    statusText.innerText = "Ошибка соединения с сервером";
    statusText.style.color = "red";
  }
});
