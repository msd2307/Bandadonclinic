document.addEventListener("DOMContentLoaded", () => {

  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modalContent");
  const burger = document.getElementById("burger");
  const navMenu = document.getElementById("navMenu");
  const form = document.getElementById("contactForm");
  const status = document.getElementById("status");
  const phoneInput = document.getElementById("phone");

  let isSending = false;

  // ===== MODAL =====
  if (modal && modalContent) {

    window.openModal = () => {
      modal.style.display = "flex";
      setTimeout(() => {
        modalContent.classList.add("show");
      }, 10);
      document.body.style.overflow = "hidden";
    };

    window.closeModal = () => {
      modalContent.classList.remove("show");
      setTimeout(() => {
        modal.style.display = "none";
        document.body.style.overflow = "";
      }, 300);
    };

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  // ===== BURGER =====
  if (burger && navMenu) {
    burger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }

  // ===== PHONE MASK =====
  if (phoneInput && window.IMask) {
    IMask(phoneInput, { mask: "+{7} (000) 000-00-00" });
  }

  // ===== FORM SEND =====
  if (form) {

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (isSending) return;

      const name = document.getElementById("name").value.trim();
      const phone = phoneInput ? phoneInput.value.trim() : "";
      const emailEl = document.getElementById("email");
      const email = emailEl ? emailEl.value.trim() : "";
      const submitBtn = form.querySelector("button[type='submit']");

      if (!name || phone.length < 10) {
        status.textContent = "Введите имя и корректный телефон";
        status.style.color = "red";
        return;
      }

      isSending = true;
      submitBtn.disabled = true;
      submitBtn.textContent = "Отправка...";
      status.textContent = "";

      try {
        const res = await fetch("/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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

      submitBtn.disabled = false;
      submitBtn.textContent = "Отправить";
      isSending = false;
    });
  }

  // ===== SCROLL ANIMATIONS =====
  const elements = document.querySelectorAll(".fade-in, .fade-up");

  if (elements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    }, { threshold: 0.2 });

    elements.forEach(el => observer.observe(el));
  }

});
