document.addEventListener("DOMContentLoaded", () => {

  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modalContent");
  const burger = document.getElementById("burger");
  const navMenu = document.getElementById("navMenu");

  // ===== MODAL ANIMATION =====
  window.openModal = () => {
    modal.style.display = "flex";
    setTimeout(() => {
      modalContent.classList.add("show");
    }, 10);
  };

  window.closeModal = () => {
    modalContent.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  };

  // Close modal when click outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // ===== BURGER MENU =====
  if (burger) {
    burger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }

  // ===== PHONE MASK =====
  const phone = document.getElementById("phone");
  if (phone) {
    IMask(phone, { mask: "+{7} (000) 000-00-00" });
  }

  // ===== FORM SEND =====
  const form = document.getElementById("contactForm");
  const status = document.getElementById("status");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const email = document.getElementById("email").value.trim();

      if (!name || !phone) {
        status.textContent = "Заполните имя и телефон";
        status.style.color = "red";
        return;
      }

      status.textContent = "Отправка...";
      status.style.color = "black";

      try {
        const res = await fetch("/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ name, phone, email })
        });

        const data = await res.json();

        if (data.success) {
          status.textContent = "Заявка отправлена!";
          status.style.color = "green";
          form.reset();

          setTimeout(() => {
            closeModal();
            status.textContent = "";
          }, 1500);

        } else {
          status.textContent = "Ошибка отправки";
          status.style.color = "red";
        }

      } catch (err) {
        console.error("SEND ERROR:", err);
        status.textContent = "Сервер недоступен";
        status.style.color = "red";
      }
    });
  }

  // ===== SCROLL ANIMATIONS =====
  const elements = document.querySelectorAll(".fade-in, .fade-up");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.2 });

  elements.forEach(el => observer.observe(el));

});
