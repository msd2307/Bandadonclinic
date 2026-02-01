function scrollToForm(){
  document.getElementById("form").scrollIntoView({behavior:"smooth"});
}

document.getElementById("contactForm").addEventListener("submit", async e=>{
  e.preventDefault();

  const form = e.target;
  const data = {
    name: form.name.value,
    phone: form.phone.value,
    email: form.email.value
  };

  const res = await fetch("/send",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(data)
  });

  if(res.ok){
    document.getElementById("status").innerText="Заявка отправлена!";
    form.reset();
  } else {
    document.getElementById("status").innerText="Ошибка отправки";
  }
});
