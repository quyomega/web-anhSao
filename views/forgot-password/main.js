// Main JavaScript cho trang quên mật khẩu ATC Petro

// Đợi DOM load xong
document.addEventListener("DOMContentLoaded", function () {
  // Lấy các elements
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

  // Validation functions
  function validatePhoneNumber(phone) {
    if (!phone) {
      return "Vui lòng nhập số điện thoại";
    }

    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, "");

    // Check if phone number is valid (Vietnamese format)
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

    // MAC address format validation
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    if (!macRegex.test(mac)) {
      return "MAC address không đúng định dạng";
    }

    return null;
  }

  function showError(input, message) {
    const inputGroup = input.closest(".input-group");
    const inputContainer = input.closest(".input-container");

    // Remove existing error
    inputGroup.classList.remove("error", "success");
    inputContainer.classList.remove("error", "success");
    const existingError = inputGroup.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    // Add error class and message
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
    // Remove existing toast
    const existingToast = document.querySelector(".toast");
    if (existingToast) {
      existingToast.remove();
    }

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

  // Real-time validation for phone number
  phoneNumberInput.addEventListener("input", function () {
    const phone = this.value.trim();

    // Format phone number as user types
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

  // Back button click handler
  if (backBtn) {
    backBtn.addEventListener("click", function () {
      window.location.href = "../login/index.html";
    });
  }

  // Menu button click handler
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      showToast("Menu chức năng sẽ được phát triển", "warning");
    });
  }

  // Dialog handlers
  if (closeDialogBtn) {
    closeDialogBtn.addEventListener("click", function () {
      hideSuccessDialog();
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener("click", function () {
      hideSuccessDialog();
      // Redirect to login page
      setTimeout(() => {
        window.location.href = "../login/index.html";
      }, 300);
    });
  }

  // Close dialog when clicking outside
  if (successDialog) {
    successDialog.addEventListener("click", function (e) {
      if (e.target === successDialog) {
        hideSuccessDialog();
      }
    });
  }

  // Xử lý submit form
  forgotPasswordForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Lấy giá trị input
    const phone = phoneNumberInput.value.trim();
    const macAddress = macAddressInput.value.trim();

    // Clear errors trước đó
    clearAllErrors();

    // Validate
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

    // Hiển thị loading
    showLoading(verifyBtn);

    // Simulate API call
    setTimeout(() => {
      hideLoading(verifyBtn);

      // Generate default password
      const defaultPassword = generateDefaultPassword();

      // Show success dialog with password
      showSuccessDialog(defaultPassword);

      // Clear form (except MAC address)
      phoneNumberInput.value = "";
      clearAllErrors();
      updateVerifyButton();
    }, 2000); // Simulate 2 second delay
  });

  // Xử lý Enter key
  phoneNumberInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      forgotPasswordForm.dispatchEvent(new Event("submit"));
    }
  });

  // Focus vào phone number input khi load trang
  phoneNumberInput.focus();

  // MAC Address click handler (show info)
  macAddressInput.addEventListener("click", function () {
    showToast("Địa chỉ MAC của thiết bị hiện tại", "warning");
  });

  // Initialize button state
  updateVerifyButton();
});
