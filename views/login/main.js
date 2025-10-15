// Main JavaScript cho trang đăng nhập ATC Petro

// Đợi DOM load xong
document.addEventListener("DOMContentLoaded", function () {
  // Lấy các elements
  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");
  const loginBtn = document.querySelector(".login-btn");

  // Toggle hiển thị mật khẩu
  togglePassword.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    console.log("Toggle password clicked"); // Debug

    const currentType = passwordInput.getAttribute("type");
    const newType = currentType === "password" ? "text" : "password";

    console.log("Current type:", currentType, "New type:", newType); // Debug

    passwordInput.setAttribute("type", newType);

    // Thay đổi icon bằng cách thay đổi innerHTML
    if (newType === "text") {
      // Icon mắt bị gạch (hiện mật khẩu - click để ẩn)
      togglePassword.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="2" fill="none"></path>
                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2"></line>
            `;
      console.log("Changed to eye-slash icon"); // Debug
    } else {
      // Icon mắt bình thường (ẩn mật khẩu - click để hiện)
      togglePassword.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" fill="none"></path>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"></circle>
            `;
      console.log("Changed to normal eye icon"); // Debug
    }

    // Focus lại vào input để đảm bảo cursor vẫn ở đó
    passwordInput.focus();
  });

  // Xử lý submit form
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Lấy giá trị input
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Clear errors trước đó
    FormValidator.clearAllErrors(loginForm);

    // Validate
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

    // Hiển thị loading
    showLoading(loginBtn);

    // Kiểm tra thông tin đăng nhập (demo)
    if (username === "admin" && password === "admin123") {
      hideLoading(loginBtn);

      // Lưu thông tin đăng nhập
      Storage.set("user", {
        username: username,
        loginTime: new Date().toISOString(),
      });

      // Redirect đến trang Địa chỉ MAC ngay lập tức
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

  // Xử lý Enter key
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

  // Focus vào username khi load trang
  usernameInput.focus();

  // Kiểm tra nếu đã đăng nhập
  const user = Storage.get("user");
  if (user) {
    // Có thể redirect đến trang chính nếu đã đăng nhập
    console.log("User đã đăng nhập:", user);
  }
});
