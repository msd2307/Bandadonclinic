const modal = document.getElementById("modal");

function openModal() {
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
}

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

// phone mask
const phoneInput = document.getElementById("phone");
IMask(phoneInput, { mask: "+{7} (000) 000-00-00" });

// fade in
const elements = document.querySelectorAll(".fade-in");
const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("show");
    }
  });
});
elements.forEach(el=>observer.observe(el));

// stats animation
const statNumbers = document.querySelectorAll(".stat-number");
const statsObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const el = entry.target;
      const target = +el.dataset.target;
      let current = 0;
      const step = target / 100;

      const timer = setInterval(()=>{
        current += step;
        if(current >= target){
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current);
        }
      },20);

      statsObserver.unobserve(el);
    }
  });
});
statNumbers.forEach(num=>statsObserver.observe(num));

// form submit
const form = document.getElementById("contactForm");
const status = document.getElementById("status");

form.addEventListener("submit", async e=>{
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = phoneInput.value;
  const email = document.getElementById("email").value;

  status.textContent = "Отправка...";

  try {
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
  } catch {
    status.textContent = "Ошибка соединения";
  }
});
