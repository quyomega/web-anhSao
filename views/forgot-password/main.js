document.addEventListener("DOMContentLoaded", function () {
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  const macAddressInput = document.getElementById("macAddress");
  const phoneNumberInput = document.getElementById("phoneNumber");
  const verifyBtn = document.querySelector(".verify-btn");
  const backBtn = document.getElementById("backBtn");
  const menuBtn = document.getElementById("menuBtn");
  const successDialog = document.getElementById("successDialog");
  const closeDialogBtn = document.getElementById("closeDialogBtn");
  const confirmBtn = document.getElementById("confirmBtn");
  const defaultPasswordSpan = document.getElementById("defaultPassword");
  function validatePhoneNumber(phone) {
    if (!phone) {
      return "Vui lòng nhập số điện thoại";
    }
    const cleanPhone = phone.replace(/\D/g, "");
    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return "Số điện thoại không hợp lệ";
    }
    return null;
  }

  function validateMACAddress(mac) {
    if (!mac) {
      return "MAC address không hợp lệ";
    }
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    if (!macRegex.test(mac)) {
      return "MAC address không đúng định dạng";
    }

    return null;
  }

  function showError(input, message) {
    const inputGroup = input.closest(".input-group");
    const inputContainer = input.closest(".input-container");

    inputGroup.classList.remove("error", "success");
    inputContainer.classList.remove("error", "success");
    const existingError = inputGroup.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    inputGroup.classList.add("error");
    inputContainer.classList.add("error");

    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;
    inputGroup.appendChild(errorDiv);
  }

  function clearError(input) {
    const inputGroup = input.closest(".input-group");
    const inputContainer = input.closest(".input-container");

    inputGroup.classList.remove("error", "success");
    inputContainer.classList.remove("error", "success");

    const errorMessage = inputGroup.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  function showSuccess(input) {
    const inputGroup = input.closest(".input-group");
    const inputContainer = input.closest(".input-container");

    inputGroup.classList.remove("error");
    inputContainer.classList.remove("error");

    const errorMessage = inputGroup.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  function clearAllErrors() {
    clearError(phoneNumberInput);
  }

  function updateVerifyButton() {
    const phone = phoneNumberInput.value.trim();
    const phoneError = validatePhoneNumber(phone);

    if (phone && !phoneError) {
      verifyBtn.classList.add("valid");
    } else {
      verifyBtn.classList.remove("valid");
    }
  }

  function showLoading(button) {
    button.disabled = true;
    button.classList.add("btn-loading");
    button.innerHTML = '<span class="loading-spinner"></span>Đang xử lý...';
  }

  function hideLoading(button) {
    button.disabled = false;
    button.classList.remove("btn-loading");
    button.innerHTML = "Xác thực";
  }

  function showToast(message, type = "success") {
    const existingToast = document.querySelector(".toast");
    if (existingToast) {
      existingToast.remove();
    }

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

  function showSuccessDialog(password) {
    defaultPasswordSpan.textContent = password;
    successDialog.classList.add("show");
  }

  function hideSuccessDialog() {
    successDialog.classList.remove("show");
  }

  function generateDefaultPassword() {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 9; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  phoneNumberInput.addEventListener("input", function () {
    const phone = this.value.trim();

    let formattedPhone = phone.replace(/\D/g, "");
    if (formattedPhone.length >= 4) {
      formattedPhone = formattedPhone.replace(
        /(\d{4})(\d{3})(\d{3})/,
        "$1 $2 $3"
      );
    }
    this.value = formattedPhone;

    if (phone) {
      const error = validatePhoneNumber(phone);
      if (error) {
        showError(this, error);
      } else {
        showSuccess(this);
      }
    } else {
      clearError(this);
    }

    updateVerifyButton();
  });

  if (backBtn) {
    backBtn.addEventListener("click", function () {
      window.location.href = "../login/index.html";
    });
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      showToast("Menu chức năng sẽ được phát triển", "warning");
    });
  }

  if (closeDialogBtn) {
    closeDialogBtn.addEventListener("click", function () {
      hideSuccessDialog();
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener("click", function () {
      hideSuccessDialog();
      setTimeout(() => {
        window.location.href = "../login/index.html";
      }, 300);
    });
  }

  if (successDialog) {
    successDialog.addEventListener("click", function (e) {
      if (e.target === successDialog) {
        hideSuccessDialog();
      }
    });
  }

  forgotPasswordForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const phone = phoneNumberInput.value.trim();
    const macAddress = macAddressInput.value.trim();

    clearAllErrors();

    let hasError = false;

    const phoneError = validatePhoneNumber(phone);
    if (phoneError) {
      showError(phoneNumberInput, phoneError);
      hasError = true;
    }

    const macError = validateMACAddress(macAddress);
    if (macError) {
      showError(macAddressInput, macError);
      hasError = true;
    }

    if (hasError) {
      return;
    }

    showLoading(verifyBtn);

    setTimeout(() => {
      hideLoading(verifyBtn);

      const defaultPassword = generateDefaultPassword();

      showSuccessDialog(defaultPassword);

      phoneNumberInput.value = "";
      clearAllErrors();
      updateVerifyButton();
    }, 500); 
  });

  phoneNumberInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      forgotPasswordForm.dispatchEvent(new Event("submit"));
    }
  });

  phoneNumberInput.focus();

  macAddressInput.addEventListener("click", function () {
    showToast("Địa chỉ MAC của thiết bị hiện tại", "warning");
  });

  updateVerifyButton();
});
