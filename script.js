(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var nav = document.getElementById("site-nav");
  var toggle = document.querySelector(".nav-toggle");
  var yearEl = document.getElementById("year");
  var form = document.getElementById("contact-form");
  var formStatus = document.getElementById("form-status");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function setNavOpen(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNavOpen(!nav.classList.contains("is-open"));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setNavOpen(false);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = header ? header.offsetHeight : 0;
      var y = target.getBoundingClientRect().top + window.scrollY - top - 8;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });

  function showFieldError(field, message) {
    var wrap = field.closest(".form-field");
    if (!wrap) return;
    var err = wrap.querySelector(".form-error");
    field.classList.toggle("invalid", Boolean(message));
    if (err) err.textContent = message || "";
  }

  function validateField(field) {
    var name = field.name;
    var v = (field.value || "").trim();
    if (field.hasAttribute("required") && !v) {
      showFieldError(field, "필수 항목입니다.");
      return false;
    }
    if (name === "email" && v) {
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      if (!ok) {
        showFieldError(field, "올바른 이메일 형식이 아닙니다.");
        return false;
      }
    }
    showFieldError(field, "");
    return true;
  }

  if (form && formStatus) {
    form.querySelectorAll("input, textarea").forEach(function (el) {
      el.addEventListener("blur", function () {
        validateField(el);
      });
      el.addEventListener("input", function () {
        if (el.classList.contains("invalid")) validateField(el);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      formStatus.textContent = "";
      formStatus.classList.remove("success");

      var fields = form.querySelectorAll("input, textarea");
      var allOk = true;
      fields.forEach(function (f) {
        if (!validateField(f)) allOk = false;
      });
      if (!allOk) return;

      formStatus.textContent = "전송되었습니다. (데모: 실제 서버 연동 시 여기서 전송 처리)";
      formStatus.classList.add("success");
      form.reset();
      fields.forEach(function (f) {
        f.classList.remove("invalid");
        var wrap = f.closest(".form-field");
        if (wrap) {
          var err = wrap.querySelector(".form-error");
          if (err) err.textContent = "";
        }
      });
    });
  }
})();
