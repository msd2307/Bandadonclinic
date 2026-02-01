// MODAL
function openModal(){
  document.getElementById("modal").style.display="flex";
}

function closeModal(){
  document.getElementById("modal").style.display="none";
}

// PHONE MASK
var phoneMask = IMask(
  document.getElementById('phone'),
  { mask: '+{7} (000) 000-00-00' }
);

// FORM SEND
document.getElementById("contactForm").addEventListener("submit", async function(e){
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;

  const res = await fetch("/send",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({name,phone,email})
  });

  if(res.ok){
    document.getElementById("status").innerText="Заявка отправлена!";
    this.reset();
  } else {
    document.getElementById("status").innerText="Ошибка отправки";
  }
});

// FADE IN ON SCROLL
const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("show");
    }
  });
});

document.querySelectorAll(".fade-in").forEach(el=>{
  observer.observe(el);
});
