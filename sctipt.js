const form = document.getElementById("contactForm");
const status = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: form.name.value,
    phone: form.phone.value,
    email: form.email.value
  };

  const res = await fetch("/send", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(data)
  });

  if(res.ok){
    status.innerText = "Заявка отправлена!";
    form.reset();
  } else {
    status.innerText = "Ошибка отправки";
  }
});

function scrollToForm(){
  document.getElementById("form").scrollIntoView({behavior:"smooth"});
}
