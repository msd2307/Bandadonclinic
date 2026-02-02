document.addEventListener("DOMContentLoaded",()=>{

const modal = document.getElementById("modal");
const form = document.getElementById("contactForm");
const status = document.getElementById("status");

function openModal() {
  modal.style.display = "flex";
}
function closeModal() {
  modal.style.display = "none";
}

window.openModal = openModal;
window.closeModal = closeModal;

// close by background
modal.addEventListener("click", e=>{
  if(e.target === modal) closeModal();
});

// mask
const phoneInput = document.getElementById("phone");
if(phoneInput){
  IMask(phoneInput, { mask: "+{7} (000) 000-00-00" });
}

// animation
const elements = document.querySelectorAll(".fade-in");
const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("show");
    }
  });
});
elements.forEach(el=>observer.observe(el));

// submit
form.addEventListener("submit", async e=>{
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = phoneInput.value;
  const email = document.getElementById("email").value.trim();

  if(!name || phone.length < 10){
    status.textContent="Заполните имя и телефон";
    return;
  }

  status.textContent="Отправка...";

  try {
    const res = await fetch("/send",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ name, phone, email })
    });

    if(res.ok){
      status.textContent="Заявка отправлена!";
      form.reset();
    } else {
      status.textContent="Ошибка сервера";
    }

  } catch {
    status.textContent="Нет соединения с сервером";
  }
});

});
