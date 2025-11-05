// Dữ liệu mẫu cho API
const mockPumpDetailData = {
  pump_id: "A",
  status: "Running",
  pump_type: "E5 RON 92-II",
  money_vnd: 26200,
  liter: 1,
  price_vnd: 26500,
  datalog_volume: 1023,
  newest_volume: 901,
  counter_volume: 900,
  current_record: 904,
  total_records: 904,
  timestamp: "13/10/25 - 11:37:20",
};

const mockPumpList = ["A", "B", "C", "D", "E"];

let pumpDropdown;
let pumpStatus;
let pumpType;
let moneyValue;
let literValue;
let priceValue;
let datalogVolume;
let newestVolume;
let counterVolume;
let recordCount;
let timestamp;
let prevBtn;
let nextBtn;
let stepInput;
let stepValue;

let currentPumpId = "A";
let currentStep = 1;
let currentRecordIndex = null;
let totalRecords = 0;

document.addEventListener("DOMContentLoaded", function () {
  initializeElements();
  setupEventListeners();

  // Load danh sách pump IDs từ API
  loadPumpList();

  const selectedPumpId = sessionStorage.getItem("selectedPumpId");
  if (selectedPumpId) {
    currentPumpId = selectedPumpId;
    if (pumpDropdown) {
      pumpDropdown.value = selectedPumpId;
    }
    sessionStorage.removeItem("selectedPumpId");
  }

  // Load dữ liệu pump detail
  loadPumpData(currentPumpId);
});

function initializeElements() {
  pumpDropdown = document.getElementById("pumpDropdown");
  pumpStatus = document.getElementById("pumpStatus");
  pumpType = document.getElementById("pumpType");
  moneyValue = document.getElementById("moneyValue");
  literValue = document.getElementById("literValue");
  priceValue = document.getElementById("priceValue");
  datalogVolume = document.getElementById("datalogVolume");
  newestVolume = document.getElementById("newestVolume");
  counterVolume = document.getElementById("counterVolume");
  recordCount = document.getElementById("recordCount");
  timestamp = document.getElementById("timestamp");
  prevBtn = document.getElementById("prevBtn");
  nextBtn = document.getElementById("nextBtn");
  stepInput = document.getElementById("stepInput");
  stepValue = document.getElementById("stepValue");
}

function setupEventListeners() {
  if (pumpDropdown) {
    pumpDropdown.addEventListener("change", function () {
      currentPumpId = this.value;
      loadPumpData(currentPumpId);
      showToast(`Đã chuyển sang bơm ${currentPumpId}`, "success");
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      navigateRecords(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      navigateRecords(1);
    });
  }

  if (stepInput) {
    stepInput.addEventListener("change", function () {
      currentStep = parseInt(this.value) || 1;
      showToast(`Đã đặt bước nhảy: ${currentStep}`, "info");
    });
  }

  if (stepValue) {
    stepValue.addEventListener("change", function () {
      currentStep = parseInt(this.value) || 1;
      stepInput.value = currentStep;
      showToast(`Đã đặt bước nhảy: ${currentStep}`, "info");
    });
  }
}

function formatNumber(num) {
  return new Intl.NumberFormat("vi-VN").format(num);
}

function loadPumpList() {
  fetch("/api/pump-list")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Không thể tải danh sách bơm");
      }
      return response.json();
    })
    .then((data) => {
      processPumpListData(data);
    })
    .catch((error) => {
      console.error("Lỗi khi tải danh sách bơm:", error);
      // Sử dụng dữ liệu mẫu
      processPumpListData({ pump_ids: mockPumpList });
    });
}

function processPumpListData(data) {
  if (pumpDropdown && data && data.pump_ids && Array.isArray(data.pump_ids)) {
    // Xóa các option cũ (trừ option đầu tiên nếu có)
    pumpDropdown.innerHTML = "";
    
    // Thêm các pump IDs từ API
    data.pump_ids.forEach((pumpId) => {
      const option = document.createElement("option");
      option.value = pumpId;
      option.textContent = pumpId;
      pumpDropdown.appendChild(option);
    });

    // Set giá trị hiện tại
    if (currentPumpId && data.pump_ids.includes(currentPumpId)) {
      pumpDropdown.value = currentPumpId;
    }
  }
}

function loadPumpData(pumpId, recordIndex = null) {
  // Hiển thị loading state
  if (pumpStatus) pumpStatus.textContent = "Loading...";
  if (pumpType) pumpType.textContent = "...";
  if (moneyValue) moneyValue.textContent = "...";
  if (literValue) literValue.textContent = "...";
  if (priceValue) priceValue.textContent = "...";

  // Tạo URL với query parameters
  let apiUrl = `/api/pump-detail?pump_id=${encodeURIComponent(pumpId)}`;
  if (recordIndex !== null) {
    apiUrl += `&record_index=${encodeURIComponent(recordIndex)}`;
  }

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Không thể tải chi tiết bơm");
      }
      return response.json();
    })
    .then((data) => {
      processPumpDetailData(data);
    })
    .catch((error) => {
      console.error("Lỗi khi tải chi tiết bơm:", error);
      console.log("Sử dụng dữ liệu mẫu để test...");
      // Sử dụng dữ liệu mẫu khi API lỗi
      processPumpDetailData(mockPumpDetailData);
      showToast("Đang sử dụng dữ liệu mẫu (API chưa hoạt động)", "info");
    });
}

function processPumpDetailData(data) {
  if (!data) {
    showToast("Không có dữ liệu", "error");
    return;
  }

  // Cập nhật status
  if (pumpStatus) {
    const status = data.status || "Unknown";
    pumpStatus.textContent = status;
    pumpStatus.className = `status-badge ${status.toLowerCase()}`;
  }

  // Cập nhật pump type
  if (pumpType) {
    pumpType.textContent = data.pump_type || "N/A";
  }

  // Cập nhật money, liter, price
  if (moneyValue) {
    moneyValue.textContent = data.money_vnd 
      ? formatNumber(data.money_vnd) 
      : (data.money || "0");
  }
  if (literValue) {
    literValue.textContent = data.liter || "0";
  }
  if (priceValue) {
    priceValue.textContent = data.price_vnd 
      ? formatNumber(data.price_vnd) 
      : (data.price || "0");
  }

  // Cập nhật volume data
  if (datalogVolume) {
    datalogVolume.textContent = data.datalog_volume || "0";
  }
  if (newestVolume) {
    newestVolume.textContent = data.newest_volume || "0";
  }
  if (counterVolume) {
    counterVolume.textContent = data.counter_volume || "0";
  }

  // Cập nhật record count và timestamp
  currentRecordIndex = data.current_record || data.currentRecord || 1;
  totalRecords = data.total_records || data.totalRecords || 1;

  if (recordCount) {
    recordCount.textContent = `${currentRecordIndex} / ${totalRecords}`;
  }
  if (timestamp) {
    timestamp.textContent = data.timestamp || formatCurrentTimestamp();
  }
}

function formatCurrentTimestamp() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
}

function navigateRecords(direction) {
  if (currentRecordIndex === null || totalRecords === 0) {
    showToast("Đang tải dữ liệu...", "warning");
    return;
  }

  // Tính toán record mới dựa trên currentStep
  const step = direction > 0 ? currentStep : -currentStep;
  let newRecord = currentRecordIndex + step;

  if (newRecord < 1) {
    newRecord = 1;
    showToast("Đã đến bản ghi đầu tiên", "warning");
  } else if (newRecord > totalRecords) {
    newRecord = totalRecords;
    showToast("Đã đến bản ghi cuối cùng", "warning");
  }

  // Gọi API để lấy dữ liệu record mới
  loadPumpData(currentPumpId, newRecord);
}

// Hàm updateTimestamp và updateVolumeData đã được tích hợp vào processPumpDetailData
// Không cần thiết nữa vì dữ liệu đến từ API

function showToast(message, type = "info") {
  const existingToast = document.querySelector(".toast");
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icon = getToastIcon(type);

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 3000);
}

function getToastIcon(type) {
  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };
  return icons[type] || icons.info;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

window.PumpDetailApp = {
  loadPumpData,
  navigateRecords,
  showToast,
  formatCurrency,
  formatDate,
};
