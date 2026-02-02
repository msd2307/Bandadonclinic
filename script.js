const modal = document.getElementById("modal");

function openModal(){
  modal.style.display="flex";
}

function closeModal(){
  modal.style.display="none";
}

const phoneInput=document.getElementById("phone");
if(phoneInput){
IMask(phoneInput,{mask:"+{7} (000) 000-00-00"});
}

const form=document.getElementById("contactForm");
const status=document.getElementById("status");

if(form){
form.addEventListener("submit",async e=>{
e.preventDefault();
status.textContent="Отправка...";
const res=await fetch("/send",{method:"POST",headers:{"Content-Type":"application/json"},
body:JSON.stringify({
name:document.getElementById("name").value,
phone:phoneInput.value,
email:document.getElementById("email").value
})
});
status.textContent=res.ok?"Заявка отправлена!":"Ошибка отправки";
});
}
