const modal = document.getElementById("modal");
const mobileMenu = document.getElementById("mobileMenu");

function openModal(){
  modal.classList.add("active");
}

function closeModal(){
  modal.classList.remove("active");
}

function toggleMenu(){
  mobileMenu.classList.toggle("active");
}

// phone mask
const phoneInput = document.getElementById("phone");
if(phoneInput){
  IMask(phoneInput,{ mask:"+{7} (000) 000-00-00" });
}

// fade-in animation
const elements = document.querySelectorAll(".fade-in");
const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("show");
    }
  });
},{threshold:0.2});
elements.forEach(el=>observer.observe(el));

// smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
  anchor.addEventListener("click",function(e){
    e.preventDefault();
    document.querySelector(this.getAttribute("href"))
      .scrollIntoView({behavior:"smooth"});
    mobileMenu.classList.remove("active");
  });
});

// form submit
const form = document.getElementById("contactForm");
const status = document.getElementById("status");

if(form){
form.addEventListener("submit", async e=>{
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = phoneInput.value;
  const email = document.getElementById("email").value;

  status.textContent="Отправка...";

  const res = await fetch("/send",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({name,phone,email})
  });

  if(res.ok){
    status.textContent="Заявка отправлена!";
    form.reset();
  } else {
    status.textContent="Ошибка отправки";
  }
});
}

window.addEventListener("click",e=>{
  if(e.target===modal){ closeModal(); }
});
// Mobile menu
function toggleMenu() {
  document.getElementById("mobileMenu").classList.toggle("active");
}

// Modal
function openModal() {
  document.getElementById("modal").classList.add("active");
}

function closeModal() {
  document.getElementById("modal").classList.remove("active");
}

// Scroll animation
const elements = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
},{ threshold:0.2 });

elements.forEach(el => observer.observe(el));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    e.preventDefault();
    document.querySelector(this.getAttribute('href'))
      .scrollIntoView({behavior:'smooth'});
  });
});
