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

// mask
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

// why cards animation
const whyCards = document.querySelectorAll(".why-card");
const whyObserver = new IntersectionObserver(entries=>{
  entries.forEach((entry,i)=>{
    if(entry.isIntersecting){
      setTimeout(()=>entry.target.classList.add("show"), i*150);
    }
  });
});
whyCards.forEach(card=>whyObserver.observe(card));

// stats
const statNumbers = document.querySelectorAll(".stat-number");
const statsObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const el = entry.target;
      const target = +el.dataset.target;
      let current = 0;
      const step = target/100;
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

