const form = document.getElementById("bookingForm");
const statusText = document.getElementById("status");
const popup = document.getElementById("popup");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: form.name.value,
    phone: form.phone.value,
    email: form.email.value
  };

  statusText.innerText = "Отправляем...";

  try {
    const response = await fetch("/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      statusText.innerText = result.message;
      return;
    }

    popup.classList.add("show");
    statusText.innerText = result.message;
    form.reset();

  } catch (error) {
    console.error(error);
    statusText.innerText = "Ошибка соединения с сервером";
  }
});

function closePopup() {
  popup.classList.remove("show");
}
