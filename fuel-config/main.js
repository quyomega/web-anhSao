// Main JavaScript cho trang cấu hình nhiên liệu ATC Petro

// Đợi DOM load xong
document.addEventListener("DOMContentLoaded", function () {
  // Lấy các elements
  const fuelConfigList = document.getElementById("fuelConfigList");
  const addConfigBtn = document.getElementById("addConfigBtn");
  const configModal = document.getElementById("configModal");
  const modalTitle = document.getElementById("modalTitle");
  const configForm = document.getElementById("configForm");
  const modalClose = document.getElementById("modalClose");
  const cancelBtn = document.getElementById("cancelBtn");
  const saveBtn = document.getElementById("saveBtn");
  const pumpIdInput = document.getElementById("pumpId");
  const fuelTypeSelect = document.getElementById("fuelType");

  // State management
  let fuelConfigs = [];
  let editingConfigId = null;

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
                            <div class="fuel-config-value">${
                              config.pumpId
                            }</div>
                        </div>
                        <div class="fuel-config-row">
                            <div class="fuel-config-label">Nhiên liệu:</div>
                            <div class="fuel-config-value fuel-type">${
                              config.fuelType
                            }</div>
                        </div>
                    </div>
                    <div class="fuel-config-actions">
                        <button class="edit-btn" onclick="editConfig(${
                          config.id
                        })" title="Chỉnh sửa">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `
      )
      .join("");
  }

  // Mở modal thêm/sửa cấu hình
  function openModal(config = null) {
    editingConfigId = config ? config.id : null;

    if (config) {
      modalTitle.textContent = "Chỉnh sửa cấu hình nhiên liệu";
      pumpIdInput.value = config.pumpId;
      fuelTypeSelect.value = config.fuelType;
    } else {
      modalTitle.textContent = "Thêm cấu hình nhiên liệu";
      configForm.reset();
    }

    configModal.classList.add("show");
    pumpIdInput.focus();
  }

  // Đóng modal
  function closeModal() {
    configModal.classList.remove("show");
    editingConfigId = null;
    configForm.reset();
    FormValidator.clearAllErrors(configForm);
  }

  // Thêm cấu hình mới
  function addConfig(configData) {
    const newId = Math.max(...fuelConfigs.map((c) => c.id), 0) + 1;
    const newConfig = {
      id: newId,
      pumpId: configData.pumpId.toUpperCase(),
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
        pumpId: configData.pumpId.toUpperCase(),
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
      openModal(config);
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
      (c) =>
        c.pumpId.toUpperCase() === pumpId.toUpperCase() &&
        c.id !== editingConfigId
    );

    if (existingConfig) {
      FormValidator.showError(pumpIdInput, "Mã vòi bơm này đã tồn tại");
      isValid = false;
    }

    return isValid;
  }

  // Event Listeners
  addConfigBtn.addEventListener("click", () => {
    openModal();
  });

  modalClose.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);

  // Đóng modal khi click outside
  configModal.addEventListener("click", (e) => {
    if (e.target === configModal) {
      closeModal();
    }
  });

  // Xử lý submit form
  configForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = {
      pumpId: pumpIdInput.value.trim(),
      fuelType: fuelTypeSelect.value.trim(),
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
      closeModal();
    }, 500);
  });

  // Xử lý Enter key
  pumpIdInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      fuelTypeSelect.focus();
    }
  });

  fuelTypeSelect.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      configForm.dispatchEvent(new Event("submit"));
    }
  });

  // Xử lý Escape key để đóng modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && configModal.classList.contains("show")) {
      closeModal();
    }
  });

  // Khởi tạo
  loadFuelConfigs();

  // Expose functions globally for onclick handlers
  window.editConfig = editConfig;
  window.deleteConfig = deleteConfig;
});
