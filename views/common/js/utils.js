function showToast(message, type = "success") {
  const existingToast = document.querySelector(".toast");
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const iconMap = {
    success: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    error: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    warning: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 6.66667V10M10 13.3333H10.0083M18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  };

  toast.innerHTML = `
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()" aria-label="Đóng">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
    `;

  document.body.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.animation = "slideOutRight 0.3s ease-in";
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }
  }, 4000);
}

function showLoading(button) {
  if (button) {
    button.disabled = true;
    button.classList.add("btn-loading");
    const originalText = button.innerHTML;
    button.setAttribute("data-original-text", originalText);
    button.innerHTML = "⏳ Đang xử lý...";
  }
}

function hideLoading(button) {
  if (button) {
    button.disabled = false;
    button.classList.remove("btn-loading");
    const originalText = button.getAttribute("data-original-text");
    if (originalText) {
      button.innerHTML = originalText;
      button.removeAttribute("data-original-text");
    }
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^(\+84|84|0)[1-9][0-9]{8,9}$/;
  return re.test(phone.replace(/\s/g, ""));
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function formatDate(date, format = "dd/mm/yyyy") {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  if (format === "dd/mm/yyyy") {
    return `${day}/${month}/${year}`;
  } else if (format === "yyyy-mm-dd") {
    return `${year}-${month}-${day}`;
  }
  return d.toLocaleDateString("vi-VN");
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

const FormValidator = {
  showError: function (input, message) {
    const inputGroup = input.closest(".input-group");
    if (inputGroup) {
      inputGroup.classList.add("error");

      let errorMsg = inputGroup.querySelector(".error-message");
      if (!errorMsg) {
        errorMsg = document.createElement("div");
        errorMsg.className = "error-message";
        inputGroup.appendChild(errorMsg);
      }
      errorMsg.textContent = message;
    }
  },

  clearError: function (input) {
    const inputGroup = input.closest(".input-group");
    if (inputGroup) {
      inputGroup.classList.remove("error");
      const errorMsg = inputGroup.querySelector(".error-message");
      if (errorMsg) {
        errorMsg.remove();
      }
    }
  },

  clearAllErrors: function (form) {
    const errorGroups = form.querySelectorAll(".input-group.error");
    errorGroups.forEach((group) => {
      group.classList.remove("error");
      const errorMsg = group.querySelector(".error-message");
      if (errorMsg) {
        errorMsg.remove();
      }
    });
  },

  validateRequired: function (inputs) {
    let isValid = true;
    inputs.forEach((input) => {
      if (!input.value.trim()) {
        this.showError(input, "Trường này là bắt buộc");
        isValid = false;
      } else {
        this.clearError(input);
      }
    });
    return isValid;
  },
};

const Storage = {
  set: function (key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {}
  },

  get: function (key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      return null;
    }
  },

  remove: function (key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {}
  },

  clear: function () {
    try {
      localStorage.clear();
    } catch (error) {}
  },
};

const Navigation = {
  goTo: function (url) {
    window.location.href = url;
  },

  goToWithDelay: function (url, delay = 1000) {
    setTimeout(() => {
      this.goTo(url);
    }, delay);
  },

  goBack: function () {
    window.history.back();
  },

  reload: function () {
    window.location.reload();
  },
};
