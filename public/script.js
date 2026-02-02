document.addEventListener("DOMContentLoaded",()=>{

const modal=document.getElementById("modal");
const burger=document.getElementById("burger");
const navMenu=document.getElementById("navMenu");

// modal
window.openModal=()=>modal.style.display="flex";
window.closeModal=()=>modal.style.display="none";

// burger
if(burger){
burger.addEventListener("click",()=>{
navMenu.classList.toggle("active");
});
}

// mask
const phone=document.getElementById("phone");
if(phone){
IMask(phone,{mask:"+{7} (000) 000-00-00"});
}

// animations
const elements=document.querySelectorAll(".fade-in,.fade-up");
const observer=new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
entry.target.classList.add("show");
}
});
},{threshold:0.2});

elements.forEach(el=>observer.observe(el));

});
