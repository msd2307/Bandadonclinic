const popup=document.getElementById("popup");
const form=document.getElementById("form");
const phone=document.getElementById("phone");
const status=document.getElementById("status");

function openForm(){popup.classList.remove("hidden");}
function closeForm(){popup.classList.add("hidden");}

// phone mask
phone.addEventListener("input",()=>{
  let x=phone.value.replace(/\D/g,"");
  let f="+7 (";
  if(x.length>0)f+=x.substring(0,3);
  if(x.length>=3)f+=") ";
  if(x.length>3)f+=x.substring(3,6);
  if(x.length>=6)f+="-";
  if(x.length>6)f+=x.substring(6,8);
  if(x.length>=8)f+="-";
  if(x.length>8)f+=x.substring(8,10);
  phone.value=f;
});

form.addEventListener("submit",async e=>{
  e.preventDefault();
  status.textContent="Отправка...";
  const res=await fetch("/send",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      name:document.getElementById("name").value,
      phone:phone.value,
      email:document.getElementById("email").value
    })
  });
  if(res.ok){
    status.textContent="Спасибо! Мы свяжемся с вами";
    setTimeout(closeForm,2000);
    form.reset();
  }else{
    status.textContent="Ошибка отправки";
  }
});

// reviews slider
let i=0;
const reviews=document.querySelectorAll(".review");
setInterval(()=>{
  reviews.forEach(r=>r.classList.remove("active"));
  i=(i+1)%reviews.length;
  reviews[i].classList.add("active");
},3000);
