const elements = document.querySelectorAll(".fade-up");

function showOnScroll(){
  const trigger = window.innerHeight * 0.85;

  elements.forEach(el=>{
    const top = el.getBoundingClientRect().top;
    if(top < trigger){
      el.classList.add("show");
    }
  });
}

window.addEventListener("scroll", showOnScroll);
showOnScroll();

function scrollToForm(){
  document.getElementById("form").scrollIntoView({behavior:"smooth"});
}

async function send(){
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;

  const res = await fetch("/send",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({name,phone,email})
  });

  if(res.ok){
    document.getElementById("msg").innerText="✅ Заявка отправлена!";
  } else {
    document.getElementById("msg").innerText="❌ Ошибка отправки";
  }
}
function scrollToForm() {
  document.getElementById("form").scrollIntoView({ behavior: "smooth" });
}

// animation on scroll
const elements = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

elements.forEach(el => observer.observe(el));
