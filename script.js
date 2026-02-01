// MODAL
const modal = document.getElementById("modal");

function openModal(){
  modal.style.display="flex";
}

function closeModal(){
  modal.style.display="none";
}

// FAQ
function toggleFAQ(el){
  const p = el.nextElementSibling;
  p.style.display = p.style.display==="block" ? "none" : "block";
}

// MASK
var phoneMask = IMask(
  document.getElementById('phone'), {
    mask: '+{7} (000) 000-00-00'
  }
);

// FORM SEND
const form = document.getElementById("contactForm");
const status = document.getElementById("status");

form.addEventListener("submit", async (e)=>{
  e.preventDefault();

  const data = {
    name: name.value,
    phone: phone.value,
    email: email.value
  };

  status.innerText = "Отправка...";

  const res = await fetch("/send",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(data)
  });

  if(res.ok){
    status.innerText="Заявка отправлена!";
    form.reset();
    setTimeout(closeModal,1500);
  } else {
    status.innerText="Ошибка отправки";
  }
});

// SCROLL ANIMATION
const faders = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("show");
    }
  });
},{threshold:0.2});

faders.forEach(el=>observer.observe(el));
