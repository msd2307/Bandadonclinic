const modal = document.getElementById("modal");

function openModal(){ modal.style.display="flex"; }
function closeModal(){ modal.style.display="none"; }

// phone mask
IMask(document.getElementById("phone"),{
  mask:"+{7} (000) 000-00-00"
});

// animation
const items=document.querySelectorAll(".fade-in");
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting) e.target.classList.add("show");
  });
});
items.forEach(i=>obs.observe(i));

// form
const form=document.getElementById("contactForm");
const status=document.getElementById("status");

form.addEventListener("submit",async e=>{
  e.preventDefault();

  const name=document.getElementById("name").value;
  const phone=document.getElementById("phone").value;
  const email=document.getElementById("email").value;

  status.textContent="Отправка...";

  const res=await fetch("/send",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({name,phone,email})
  });

  if(res.ok){
    status.textContent="Заявка отправлена!";
    form.reset();
  } else {
    status.textContent="Ошибка";
  }
});
