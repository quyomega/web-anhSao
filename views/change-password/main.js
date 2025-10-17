// Main JavaScript cho trang đổi mật khẩu ATC Petro

// Đợi DOM load xong
document.addEventListener("DOMContentLoaded", function () {
  // Lấy các elements
  const changePasswordForm = document.getElementById("changePasswordForm");
  const usernameInput = document.getElementById("username");
  const phoneInput = document.getElementById("phone");
  const oldPasswordInput = document.getElementById("oldPassword");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const changePasswordBtn = document.getElementById("changePasswordBtn");

  // Toggle password visibility elements
  const toggleOldPassword = document.getElementById("toggleOldPassword");
  const toggleNewPassword = document.getElementById("toggleNewPassword");
  const toggleConfirmPassword = document.getElementById(
    "toggleConfirmPassword"
  );

  // Toggle hiển thị mật khẩu cũ
  toggleOldPassword.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    togglePasswordVisibility(oldPasswordInput, toggleOldPassword);
  });

  // Toggle hiển thị mật khẩu mới
  toggleNewPassword.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    togglePasswordVisibility(newPasswordInput, toggleNewPassword);
  });

  // Toggle hiển thị xác nhận mật khẩu
  toggleConfirmPassword.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    togglePasswordVisibility(confirmPasswordInput, toggleConfirmPassword);
  });

  // Function để toggle password visibility
  function togglePasswordVisibility(input, toggleIcon) {
    const currentType = input.getAttribute("type");
    const newType = currentType === "password" ? "text" : "password";

    input.setAttribute("type", newType);

    // Thay đổi icon
    if (newType === "text") {
      // Icon mắt bị gạch (hiện mật khẩu - click để ẩn)
      toggleIcon.innerHTML = `
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="2" fill="none"></path>
        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2"></line>
      `;
    } else {
      // Icon mắt bình thường (ẩn mật khẩu - click để hiện)
      toggleIcon.innerHTML = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" fill="none"></path>
        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"></circle>
      `;
    }

    // Focus lại vào input
    input.focus();
  }

  // Validate form real-time
  function validateForm() {
    const username = usernameInput.value.trim();
    const phone = phoneInput.value.trim();
    const oldPassword = oldPasswordInput.value.trim();
    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    // Kiểm tra tất cả fields đã được điền
    const allFieldsFilled =
      username && phone && oldPassword && newPassword && confirmPassword;

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu khớp nhau
    const passwordsMatch =
      newPassword && confirmPassword && newPassword === confirmPassword;

    // Kiểm tra mật khẩu mới khác mật khẩu cũ
    const newPasswordDifferent =
      newPassword && oldPassword && newPassword !== oldPassword;

    // Kiểm tra độ dài mật khẩu mới (ít nhất 6 ký tự)
    const newPasswordValid = newPassword && newPassword.length >= 6;

    // Kiểm tra số điện thoại hợp lệ (10-11 số)
    const phoneValid = phone && /^[0-9]{10,11}$/.test(phone.replace(/\s/g, ""));

    if (
      allFieldsFilled &&
      passwordsMatch &&
      newPasswordDifferent &&
      newPasswordValid &&
      phoneValid
    ) {
      changePasswordBtn.classList.add("active");
      changePasswordBtn.disabled = false;
    } else {
      changePasswordBtn.classList.remove("active");
      changePasswordBtn.disabled = true;
    }
  }

  // Add event listeners for real-time validation
  [
    usernameInput,
    phoneInput,
    oldPasswordInput,
    newPasswordInput,
    confirmPasswordInput,
  ].forEach((input) => {
    input.addEventListener("input", validateForm);
    input.addEventListener("blur", validateForm);
  });

  // Format phone number input
  phoneInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length > 0) {
      if (value.length <= 3) {
        value = value;
      } else if (value.length <= 6) {
        value = value.slice(0, 3) + " " + value.slice(3);
      } else if (value.length <= 10) {
        value =
          value.slice(0, 3) + " " + value.slice(3, 6) + " " + value.slice(6);
      } else {
        value =
          value.slice(0, 3) +
          " " +
          value.slice(3, 6) +
          " " +
          value.slice(6, 10);
      }
    }
    e.target.value = value;
    validateForm();
  });

  // Xử lý submit form
  changePasswordForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Lấy giá trị input
    const username = usernameInput.value.trim();
    const phone = phoneInput.value.trim();
    const oldPassword = oldPasswordInput.value.trim();
    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    // Clear errors trước đó
    FormValidator.clearAllErrors(changePasswordForm);

    // Validate
    let hasError = false;

    if (!username) {
      FormValidator.showError(usernameInput, "Vui lòng nhập username");
      hasError = true;
    }

    if (!phone) {
      FormValidator.showError(phoneInput, "Vui lòng nhập số điện thoại");
      hasError = true;
    } else if (!/^[0-9]{10,11}$/.test(phone.replace(/\s/g, ""))) {
      FormValidator.showError(phoneInput, "Số điện thoại không hợp lệ");
      hasError = true;
    }

    if (!oldPassword) {
      FormValidator.showError(oldPasswordInput, "Vui lòng nhập mật khẩu cũ");
      hasError = true;
    }

    if (!newPassword) {
      FormValidator.showError(newPasswordInput, "Vui lòng nhập mật khẩu mới");
      hasError = true;
    } else if (newPassword.length < 6) {
      FormValidator.showError(
        newPasswordInput,
        "Mật khẩu mới phải có ít nhất 6 ký tự"
      );
      hasError = true;
    } else if (newPassword === oldPassword) {
      FormValidator.showError(
        newPasswordInput,
        "Mật khẩu mới phải khác mật khẩu cũ"
      );
      hasError = true;
    }

    if (!confirmPassword) {
      FormValidator.showError(
        confirmPasswordInput,
        "Vui lòng nhập lại mật khẩu mới"
      );
      hasError = true;
    } else if (confirmPassword !== newPassword) {
      FormValidator.showError(
        confirmPasswordInput,
        "Mật khẩu xác nhận không khớp"
      );
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Hiển thị loading
    showLoading(changePasswordBtn);

    // Simulate API call (thay thế bằng API thực tế)
    setTimeout(() => {
      hideLoading(changePasswordBtn);

      // Demo: Kiểm tra thông tin (thay thế bằng logic thực tế)
      if (username === "admin" && oldPassword === "admin123") {
        // Thành công
        showToast("Đổi mật khẩu thành công!", "success");

        // Clear form
        changePasswordForm.reset();
        validateForm();

        // Redirect về trang login sau 2 giây
        setTimeout(() => {
          Navigation.goTo("../login/index.html");
        }, 2000);
      } else {
        // Thất bại
        showToast("Username hoặc mật khẩu cũ không đúng", "error");
        FormValidator.showError(
          oldPasswordInput,
          "Username hoặc mật khẩu cũ không đúng"
        );
      }
    }, 1500);
  });

  // Xử lý Enter key navigation
  usernameInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      phoneInput.focus();
    }
  });

  phoneInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      oldPasswordInput.focus();
    }
  });

  oldPasswordInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      newPasswordInput.focus();
    }
  });

  newPasswordInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      confirmPasswordInput.focus();
    }
  });

  confirmPasswordInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      if (changePasswordBtn.classList.contains("active")) {
        changePasswordForm.dispatchEvent(new Event("submit"));
      }
    }
  });

  // Focus vào username khi load trang
  usernameInput.focus();

  // Menu toggle functionality
  const menuToggle = document.getElementById("menuToggle");
  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      // Toggle sidebar hoặc menu functionality
      console.log("Menu toggle clicked");
      // Có thể thêm logic mở sidebar ở đây
    });
  }
});

// Utility functions (nếu chưa có trong utils.js)
function showLoading(button) {
  button.classList.add("btn-loading");
  button.disabled = true;
}

function hideLoading(button) {
  button.classList.remove("btn-loading");
  button.disabled = false;
}

function showToast(message, type = "info") {
  // Remove existing toasts
  const existingToasts = document.querySelectorAll(".toast");
  existingToasts.forEach((toast) => toast.remove());

  // Create new toast
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

  // Auto remove after 3 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 3000);
}
