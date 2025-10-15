// Main JavaScript cho trang cấu hình nhiên liệu ATC Petro

// Đợi DOM load xong
document.addEventListener("DOMContentLoaded", function () {
  // Lấy các elements
  const fuelConfigList = document.getElementById("fuelConfigList");
  const addConfigBtn = document.getElementById("addConfigBtn");
  const addConfigSection = document.getElementById("addConfigSection");
  const configForm = document.getElementById("configForm");
  const cancelBtn = document.getElementById("cancelBtn");
  const saveBtn = document.getElementById("saveBtn");
  const pumpIdInput = document.getElementById("pumpId");
  const fuelTypeSelect = document.getElementById("fuelType");

  // State management
  let fuelConfigs = [];
  let editingConfigId = null;
  let overlay = null;

  // Khởi tạo dữ liệu mẫu
  const sampleData = [
    { id: 1, pumpId: "A", fuelType: "Xăng RON 95" },
    { id: 2, pumpId: "B", fuelType: "Xăng RON 92" },
    { id: 3, pumpId: "C", fuelType: "Dầu Diesel" },
    { id: 4, pumpId: "D", fuelType: "Dầu DO" },
  ];

  // Load dữ liệu từ localStorage hoặc sử dụng dữ liệu mẫu
  function loadFuelConfigs() {
    const savedConfigs = Storage.get("fuelConfigs");
    fuelConfigs = savedConfigs || sampleData;
    renderFuelConfigs();
  }

  // Render danh sách cấu hình nhiên liệu
  function renderFuelConfigs() {
    if (fuelConfigs.length === 0) {
      fuelConfigList.innerHTML = `
                <div class="empty-state">
                    <svg class="empty-state-icon" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <path d="M2.5 5.83333C2.5 4.91286 3.24619 4.16667 4.16667 4.16667H15.8333C16.7538 4.16667 17.5 4.91286 17.5 5.83333V14.1667C17.5 15.0871 16.7538 15.8333 15.8333 15.8333H4.16667C3.24619 15.8333 2.5 15.0871 2.5 14.1667V5.83333Z" stroke="currentColor" stroke-width="1.5"/>
                        <path d="M2.5 7.5H17.5" stroke="currentColor" stroke-width="1.5"/>
                        <path d="M6.66667 10.8333H13.3333" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                    <div class="empty-state-title">Chưa có cấu hình nhiên liệu</div>
                    <div class="empty-state-description">Nhấn "Thêm cấu hình" để bắt đầu</div>
                </div>
            `;
      return;
    }

    fuelConfigList.innerHTML = fuelConfigs
      .map(
        (config) => `
            <div class="fuel-config-item" data-id="${config.id}">
                <div class="fuel-config-content">
                    <div class="fuel-config-info">
                        <div class="fuel-config-row">
                            <div class="fuel-config-label">Pump ID (Mã vòi bơm):</div>
                            <div class="fuel-config-value">${config.pumpId}</div>
                        </div>
                        <div class="fuel-config-row">
                            <div class="fuel-config-label">Nhiên liệu:</div>
                            <div class="fuel-config-value fuel-type">${config.fuelType}</div>
                        </div>
                    </div>
                    <div class="fuel-config-actions">
                        <button class="edit-btn" onclick="editConfig(${config.id})" title="Chỉnh sửa">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M9.29289 1.66976C9.6081 1.70164 9.85429 1.96792 9.85441 2.2915C9.85441 2.61519 9.60816 2.88135 9.29289 2.91325L9.22941 2.9165H7.68726C5.82211 2.91655 4.67869 3.29332 3.98608 3.98584C3.29352 4.6784 2.91682 5.8219 2.91675 7.68701V12.3127C2.91679 14.1778 3.29357 15.3212 3.98608 16.0138C4.67867 16.7064 5.82201 17.0831 7.68726 17.0832H12.3129C14.1782 17.0831 15.3215 16.7064 16.0141 16.0138C16.7066 15.3212 17.0834 14.1778 17.0834 12.3127V10.7705C17.0836 10.4255 17.3634 10.1455 17.7084 10.1455C18.0535 10.1455 18.3332 10.4255 18.3334 10.7705V12.3127C18.3334 14.3012 17.9395 15.8559 16.8979 16.8976C15.8562 17.9393 14.3015 18.3331 12.3129 18.3332H7.68726C5.69869 18.3331 4.14398 17.9393 3.1023 16.8976C2.0607 15.8559 1.66679 14.3012 1.66675 12.3127V7.68701C1.66682 5.69855 2.06065 4.1437 3.1023 3.10205C4.14398 2.06045 5.69876 1.66655 7.68726 1.6665H9.22941L9.29289 1.66976Z" fill="#2E3747"/>
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M14.3311 1.67952C15.2589 1.5885 16.1787 1.9964 17.0924 2.90999C18.0059 3.8236 18.4139 4.74352 18.3228 5.67122C18.2348 6.56602 17.6947 7.30847 17.0924 7.91081L17.0907 7.91243L11.3404 13.6123L11.3347 13.618L11.3339 13.6172C11.1464 13.7984 10.9021 13.9582 10.6658 14.077C10.4894 14.1656 10.289 14.2468 10.0888 14.2975L9.88859 14.3374L7.38045 14.6955L7.3772 14.6963C6.7591 14.7812 6.16705 14.6122 5.75203 14.1991C5.33637 13.785 5.16671 13.1929 5.25724 12.5715L5.61532 10.0658C5.65269 9.79793 5.75576 9.51763 5.87492 9.28044C5.99421 9.04309 6.15578 8.79623 6.34204 8.60986L6.34367 8.60824L11.0621 3.9305C11.1236 3.75442 11.2617 3.60951 11.4495 3.54557L12.0916 2.90999L12.3243 2.68783C12.8821 2.17975 13.5481 1.75648 14.3311 1.67952ZM7.22502 9.49284L7.22583 9.49365C7.16226 9.55735 7.07276 9.68182 6.99227 9.84196C6.91171 10.0024 6.86569 10.1481 6.85311 10.2383L6.8523 10.2399L6.49422 12.7489L6.49341 12.7505C6.45163 13.0359 6.53604 13.2149 6.6342 13.3128C6.73334 13.4114 6.91599 13.4965 7.20386 13.4577L9.712 13.0996L9.78687 13.0841C9.87097 13.0623 9.98257 13.0208 10.1042 12.9596C10.2649 12.8788 10.3948 12.7879 10.4656 12.7196L14.6973 8.5236C13.2582 7.87965 12.0991 6.74382 11.4307 5.32373L7.22502 9.49284ZM14.4532 2.92383C14.0478 2.96371 13.6267 3.19333 13.1723 3.60579L12.9753 3.79378L12.9737 3.79541L12.387 4.37646C12.9337 5.85208 14.1112 7.01466 15.6064 7.5446L15.6658 7.56331L16.2102 7.02458C16.7398 6.49459 17.0329 6.0118 17.0785 5.54915C17.1208 5.11865 16.9614 4.54665 16.2086 3.79378C15.4557 3.04091 14.8837 2.88158 14.4532 2.92383Z" fill="#2E3747"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `
      )
      .join("");
  }

  // Hiện form thêm cấu hình
  function showAddForm() {
    // Tạo overlay nếu chưa có
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "add-config-overlay";
      document.body.appendChild(overlay);
    }

    // Hiện overlay và form
    overlay.classList.add("show");
    addConfigSection.style.display = "block";
    setTimeout(() => {
      addConfigSection.classList.add("show");
    }, 10);

    pumpIdInput.focus();
  }

  // Ẩn form thêm cấu hình
  function hideAddForm() {
    addConfigSection.classList.remove("show");
    if (overlay) {
      overlay.classList.remove("show");
    }

    setTimeout(() => {
      addConfigSection.style.display = "none";
    }, 300);
  }

  // Bắt đầu chỉnh sửa cấu hình
  function startEdit(config) {
    editingConfigId = config.id;
    pumpIdInput.value = config.pumpId;
    fuelTypeSelect.value = config.fuelType;
    saveBtn.textContent = "Cập nhật";
    showAddForm();
  }

  // Hủy chỉnh sửa
  function cancelEdit() {
    editingConfigId = null;
    configForm.reset();
    saveBtn.textContent = "Thêm cấu hình";
    FormValidator.clearAllErrors(configForm);
    hideAddForm();
  }

  // Thêm cấu hình mới
  function addConfig(configData) {
    const newId = Math.max(...fuelConfigs.map((c) => c.id), 0) + 1;
    const newConfig = {
      id: newId,
      pumpId: configData.pumpId,
      fuelType: configData.fuelType,
    };

    fuelConfigs.push(newConfig);
    Storage.set("fuelConfigs", fuelConfigs);
    renderFuelConfigs();
    showToast("Thêm cấu hình thành công", "success");
  }

  // Cập nhật cấu hình
  function updateConfig(configData) {
    const index = fuelConfigs.findIndex((c) => c.id === editingConfigId);
    if (index !== -1) {
      fuelConfigs[index] = {
        ...fuelConfigs[index],
        pumpId: configData.pumpId,
        fuelType: configData.fuelType,
      };
      Storage.set("fuelConfigs", fuelConfigs);
      renderFuelConfigs();
      showToast("Cập nhật cấu hình thành công", "success");
    }
  }

  // Xóa cấu hình
  function deleteConfig(id) {
    if (confirm("Bạn có chắc chắn muốn xóa cấu hình này?")) {
      fuelConfigs = fuelConfigs.filter((c) => c.id !== id);
      Storage.set("fuelConfigs", fuelConfigs);
      renderFuelConfigs();
      showToast("Xóa cấu hình thành công", "success");
    }
  }

  // Chỉnh sửa cấu hình
  function editConfig(id) {
    const config = fuelConfigs.find((c) => c.id === id);
    if (config) {
      startEdit(config);
    }
  }

  // Validate form
  function validateForm() {
    FormValidator.clearAllErrors(configForm);

    let isValid = true;
    const pumpId = pumpIdInput.value.trim();
    const fuelType = fuelTypeSelect.value.trim();

    if (!pumpId) {
      FormValidator.showError(pumpIdInput, "Vui lòng nhập mã vòi bơm");
      isValid = false;
    } else if (pumpId.length > 10) {
      FormValidator.showError(
        pumpIdInput,
        "Mã vòi bơm không được quá 10 ký tự"
      );
      isValid = false;
    }

    if (!fuelType) {
      FormValidator.showError(fuelTypeSelect, "Vui lòng chọn loại nhiên liệu");
      isValid = false;
    }

    // Kiểm tra trùng lặp Pump ID
    const existingConfig = fuelConfigs.find(
      (c) => c.pumpId === pumpId && c.id !== editingConfigId
    );

    if (existingConfig) {
      FormValidator.showError(pumpIdInput, "Mã vòi bơm này đã tồn tại");
      isValid = false;
    }

    return isValid;
  }

  // Event Listeners
  addConfigBtn.addEventListener("click", showAddForm);
  cancelBtn.addEventListener("click", cancelEdit);

  // Đóng form khi click overlay
  document.addEventListener("click", (e) => {
    if (e.target === overlay) {
      cancelEdit();
    }
  });

  // Xử lý submit form
  configForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = {
      pumpId: pumpIdInput.value,
      fuelType: fuelTypeSelect.value,
    };

    showLoading(saveBtn);

    // Simulate API call
    setTimeout(() => {
      if (editingConfigId) {
        updateConfig(formData);
      } else {
        addConfig(formData);
      }

      hideLoading(saveBtn);
      cancelEdit(); // Reset form and hide form
    }, 500);
  });

  // Xử lý Enter key
  pumpIdInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fuelTypeSelect.focus();
    }
  });

  fuelTypeSelect.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      configForm.dispatchEvent(new Event("submit"));
    }
  });

  // Xử lý Escape key để đóng form
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && addConfigSection.classList.contains("show")) {
      cancelEdit();
    }
  });

  // Khởi tạo
  loadFuelConfigs();

  // Expose functions globally for onclick handlers
  window.editConfig = editConfig;
  window.deleteConfig = deleteConfig;
});
