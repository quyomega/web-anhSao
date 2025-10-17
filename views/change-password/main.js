document.addEventListener("DOMContentLoaded", function () {
  const changePasswordForm = document.getElementById("changePasswordForm");
  const usernameInput = document.getElementById("username");
  const phoneInput = document.getElementById("phone");
  const oldPasswordInput = document.getElementById("oldPassword");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const changePasswordBtn = document.getElementById("changePasswordBtn");

  const toggleOldPassword = document.getElementById("toggleOldPassword");
  const toggleNewPassword = document.getElementById("toggleNewPassword");
  const toggleConfirmPassword = document.getElementById(
    "toggleConfirmPassword"
  );

  toggleOldPassword.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    togglePasswordVisibility(oldPasswordInput, toggleOldPassword);
  });

  toggleNewPassword.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    togglePasswordVisibility(newPasswordInput, toggleNewPassword);
  });

  toggleConfirmPassword.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    togglePasswordVisibility(confirmPasswordInput, toggleConfirmPassword);
  });

  function togglePasswordVisibility(input, toggleIcon) {
    const currentType = input.getAttribute("type");
    const newType = currentType === "password" ? "text" : "password";

    input.setAttribute("type", newType);

    if (newType === "text") {
      toggleIcon.innerHTML = `
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="2" fill="none"></path>
        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2"></line>
      `;
    } else {
      toggleIcon.innerHTML = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" fill="none"></path>
        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"></circle>
      `;
    }

    input.focus();
  }

  function validateForm() {
    const username = usernameInput.value.trim();
    const phone = phoneInput.value.trim();
    const oldPassword = oldPasswordInput.value.trim();
    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    const allFieldsFilled =
      username && phone && oldPassword && newPassword && confirmPassword;

    const passwordsMatch =
      newPassword && confirmPassword && newPassword === confirmPassword;

    const newPasswordDifferent =
      newPassword && oldPassword && newPassword !== oldPassword;

    const newPasswordValid = newPassword && newPassword.length >= 6;

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

  phoneInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, ""); 
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

  changePasswordForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const phone = phoneInput.value.trim();
    const oldPassword = oldPasswordInput.value.trim();
    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    FormValidator.clearAllErrors(changePasswordForm);

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

    showLoading(changePasswordBtn);

    setTimeout(() => {
      hideLoading(changePasswordBtn);

      if (username === "admin" && oldPassword === "admin123") {
        showToast("Đổi mật khẩu thành công!", "success");

        changePasswordForm.reset();
        validateForm();

        setTimeout(() => {
          Navigation.goTo("../login/index.html");
        }, 2000);
      } else {
        showToast("Username hoặc mật khẩu cũ không đúng", "error");
        FormValidator.showError(
          oldPasswordInput,
          "Username hoặc mật khẩu cũ không đúng"
        );
      }
    }, 1500);
  });

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

  usernameInput.focus();
  const menuToggle = document.getElementById("menuToggle");
  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
    });
  }
});

function showLoading(button) {
  button.classList.add("btn-loading");
  button.disabled = true;
}

function hideLoading(button) {
  button.classList.remove("btn-loading");
  button.disabled = false;
}

function showToast(message, type = "info") {
  const existingToasts = document.querySelectorAll(".toast");
  existingToasts.forEach((toast) => toast.remove());

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 3000);
}
