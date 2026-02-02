const modal = document.getElementById("modal");

function openModal() {
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
}

// phone mask
const phoneInput = document.getElementById("phone");
IMask(phoneInput, {
  mask: "+{7} (000) 000-00-00"
});

// form submit
const form = document.getElementById("contactForm");
const status = document.getElementById("status");

form.addEventListener("submit", async e=>{
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = phoneInput.value;
  const email = document.getElementById("email").value;

  status.textContent = "Отправка...";

  const res = await fetch("/send",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ name, phone, email })
  });

  if(res.ok){
    status.textContent = "Заявка отправлена!";
    form.reset();
  } else {
    status.textContent = "Ошибка отправки";
  }
});
