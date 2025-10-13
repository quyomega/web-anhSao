// Utility functions cho ứng dụng ATC.Petro

// Hiển thị toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconMap = {
        'success': '✅',
        'error': '❌', 
        'warning': '⚠️'
    };
    toast.innerHTML = `${iconMap[type] || 'ℹ️'} ${message}`;
    
    document.body.appendChild(toast);
    
    // Tự động xóa sau 3 giây
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Hiển thị loading
function showLoading(button) {
    if (button) {
        button.disabled = true;
        button.classList.add('btn-loading');
        const originalText = button.innerHTML;
        button.setAttribute('data-original-text', originalText);
            button.innerHTML = '⏳ Đang xử lý...';
    }
}

// Ẩn loading
function hideLoading(button) {
    if (button) {
        button.disabled = false;
        button.classList.remove('btn-loading');
        const originalText = button.getAttribute('data-original-text');
        if (originalText) {
            button.innerHTML = originalText;
            button.removeAttribute('data-original-text');
        }
    }
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate phone number (Vietnam)
function validatePhone(phone) {
    const re = /^(\+84|84|0)[1-9][0-9]{8,9}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Format currency (VND)
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Format date
function formatDate(date, format = 'dd/mm/yyyy') {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    if (format === 'dd/mm/yyyy') {
        return `${day}/${month}/${year}`;
    } else if (format === 'yyyy-mm-dd') {
        return `${year}-${month}-${day}`;
    }
    return d.toLocaleDateString('vi-VN');
}

// Debounce function
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

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Form validation helpers
const FormValidator = {
    // Hiển thị lỗi
    showError: function(input, message) {
        const inputGroup = input.closest('.input-group');
        if (inputGroup) {
            inputGroup.classList.add('error');
            
            let errorMsg = inputGroup.querySelector('.error-message');
            if (!errorMsg) {
                errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                inputGroup.appendChild(errorMsg);
            }
            errorMsg.textContent = message;
        }
    },

    // Xóa lỗi
    clearError: function(input) {
        const inputGroup = input.closest('.input-group');
        if (inputGroup) {
            inputGroup.classList.remove('error');
            const errorMsg = inputGroup.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        }
    },

    // Xóa tất cả lỗi
    clearAllErrors: function(form) {
        const errorGroups = form.querySelectorAll('.input-group.error');
        errorGroups.forEach(group => {
            group.classList.remove('error');
            const errorMsg = group.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    },

    // Validate required fields
    validateRequired: function(inputs) {
        let isValid = true;
        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showError(input, 'Trường này là bắt buộc');
                isValid = false;
            } else {
                this.clearError(input);
            }
        });
        return isValid;
    }
};

// Local storage helpers
const Storage = {
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Storage set error:', error);
        }
    },

    get: function(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Storage get error:', error);
            return null;
        }
    },

    remove: function(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Storage remove error:', error);
        }
    },

    clear: function() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Storage clear error:', error);
        }
    }
};

// Navigation helpers
const Navigation = {
    // Chuyển trang
    goTo: function(url) {
        window.location.href = url;
    },

    // Chuyển trang với delay
    goToWithDelay: function(url, delay = 1000) {
        setTimeout(() => {
            this.goTo(url);
        }, delay);
    },

    // Quay lại trang trước
    goBack: function() {
        window.history.back();
    },

    // Reload trang
    reload: function() {
        window.location.reload();
    }
};
