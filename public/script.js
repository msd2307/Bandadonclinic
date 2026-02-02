document.addEventListener("DOMContentLoaded",()=>{

const modal=document.getElementById("modal");
const burger=document.getElementById("burger");
const navMenu=document.getElementById("navMenu");

window.openModal=()=>modal.style.display="flex";
window.closeModal=()=>modal.style.display="none";

// burger menu
burger.addEventListener("click",()=>{
burger.classList.toggle("active");
navMenu.classList.toggle("active");
});

navMenu.querySelectorAll("a").forEach(link=>{
link.addEventListener("click",()=>{
burger.classList.remove("active");
navMenu.classList.remove("active");
});
});

// mask
const phone=document.getElementById("phone");
if(phone) IMask(phone,{mask:"+{7} (000) 000-00-00"});

// animations
const elements=document.querySelectorAll(".fade-in,.fade-up");
const observer=new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting) entry.target.classList.add("show");
});
});
elements.forEach(el=>observer.observe(el));

});
