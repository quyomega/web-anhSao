document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");
  const loginBtn = document.querySelector(".login-btn");

  togglePassword.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const currentType = passwordInput.getAttribute("type");
    const newType = currentType === "password" ? "text" : "password";

    passwordInput.setAttribute("type", newType);

    if (newType === "text") {
      togglePassword.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="2" fill="none"></path>
                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2"></line>
            `;
    } else {
      togglePassword.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" fill="none"></path>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"></circle>
            `;
    }
    passwordInput.focus();
  });

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    FormValidator.clearAllErrors(loginForm);

    let hasError = false;

    if (!username) {
      FormValidator.showError(usernameInput, "Vui lòng nhập tên đăng nhập");
      hasError = true;
    }

    if (!password) {
      FormValidator.showError(passwordInput, "Vui lòng nhập mật khẩu");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    showLoading(loginBtn);

    if (username === "admin" && password === "admin123") {
      hideLoading(loginBtn);

      Storage.set("user", {
        username: username,
        loginTime: new Date().toISOString(),
      });

      Navigation.goTo("../address-mac/index.html");
    } else {
      hideLoading(loginBtn);
      showToast("Tên đăng nhập hoặc mật khẩu không đúng", "error");
      FormValidator.showError(
        passwordInput,
        "Tên đăng nhập hoặc mật khẩu không đúng"
      );
    }
  });

  usernameInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      passwordInput.focus();
    }
  });

  passwordInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      loginForm.dispatchEvent(new Event("submit"));
    }
  });

  usernameInput.focus();

  const user = Storage.get("user");
  if (user) {
  }
});
