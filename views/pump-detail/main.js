const pumpDetailData = {
  A: {
    pumpId: "A",
    status: "Running",
    pumpType: "E5 RON 92-II",
    money: "26.200",
    liter: "1",
    price: "26.500",
    datalogVolume: "1023",
    newestVolume: "901",
    counterVolume: "900",
    recordCount: "904 / 904",
    timestamp: "13/10/25 - 11:37:20",
  },
  B: {
    pumpId: "B",
    status: "Stopped",
    pumpType: "RON 95-III",
    money: "210.000",
    liter: "10",
    price: "21.000",
    datalogVolume: "2150",
    newestVolume: "2100",
    counterVolume: "2095",
    recordCount: "2100 / 2100",
    timestamp: "17/10/25 - 09:44:15",
  },
  C: {
    pumpId: "C",
    status: "Running",
    pumpType: "RON 95-IV",
    money: "322.500",
    liter: "15",
    price: "21.500",
    datalogVolume: "3200",
    newestVolume: "3150",
    counterVolume: "3145",
    recordCount: "3200 / 3200",
    timestamp: "15/10/25 - 14:08:30",
  },
  D: {
    pumpId: "D",
    status: "Maintenance",
    pumpType: "RON 92",
    money: "400.000",
    liter: "20",
    price: "20.000",
    datalogVolume: "4100",
    newestVolume: "4000",
    counterVolume: "3995",
    recordCount: "4100 / 4100",
    timestamp: "14/10/25 - 08:12:45",
  },
  E: {
    pumpId: "E",
    status: "Running",
    pumpType: "Dầu hỏa",
    money: "525.000",
    liter: "35",
    price: "15.000",
    datalogVolume: "5300",
    newestVolume: "5250",
    counterVolume: "5245",
    recordCount: "5300 / 5300",
    timestamp: "13/10/25 - 07:38:20",
  },
};

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

document.addEventListener("DOMContentLoaded", function () {
  initializeElements();
  setupEventListeners();

  const selectedPumpId = sessionStorage.getItem("selectedPumpId");
  if (selectedPumpId && pumpDetailData[selectedPumpId]) {
    currentPumpId = selectedPumpId;
    if (pumpDropdown) {
      pumpDropdown.value = selectedPumpId;
    }
    sessionStorage.removeItem("selectedPumpId");
  }

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
      navigateRecords(-currentStep);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      navigateRecords(currentStep);
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

function loadPumpData(pumpId) {
  const data = pumpDetailData[pumpId];
  if (!data) {
    showToast(`Không tìm thấy dữ liệu cho bơm ${pumpId}`, "error");
    return;
  }

  if (pumpStatus) {
    pumpStatus.textContent = data.status;
    pumpStatus.className = `status-badge ${data.status.toLowerCase()}`;
  }

  if (pumpType) {
    pumpType.textContent = data.pumpType;
  }

  if (moneyValue) {
    moneyValue.textContent = data.money;
  }
  if (literValue) {
    literValue.textContent = data.liter;
  }
  if (priceValue) {
    priceValue.textContent = data.price;
  }

  if (datalogVolume) {
    datalogVolume.textContent = data.datalogVolume;
  }
  if (newestVolume) {
    newestVolume.textContent = data.newestVolume;
  }
  if (counterVolume) {
    counterVolume.textContent = data.counterVolume;
  }

  if (recordCount) {
    recordCount.textContent = data.recordCount;
  }
  if (timestamp) {
    timestamp.textContent = data.timestamp;
  }
}

function navigateRecords(direction) {
  const currentRecord = parseInt(recordCount.textContent.split(" / ")[0]);
  const totalRecords = parseInt(recordCount.textContent.split(" / ")[1]);

  let newRecord = currentRecord + direction;

  if (newRecord < 1) {
    newRecord = 1;
    showToast("Đã đến bản ghi đầu tiên", "warning");
  } else if (newRecord > totalRecords) {
    newRecord = totalRecords;
    showToast("Đã đến bản ghi cuối cùng", "warning");
  } else {
    showToast(`Chuyển đến bản ghi ${newRecord}`, "info");
  }

  if (recordCount) {
    recordCount.textContent = `${newRecord} / ${totalRecords}`;
  }

  updateTimestamp();

  updateVolumeData(newRecord);
}

function updateTimestamp() {
  if (timestamp) {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear()).slice(-2);
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    timestamp.textContent = `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
  }
}

function updateVolumeData(recordNumber) {
  const data = pumpDetailData[currentPumpId];
  if (!data) return;

  const baseDatalog = parseInt(data.datalogVolume);
  const baseNewest = parseInt(data.newestVolume);
  const baseCounter = parseInt(data.counterVolume);

  const variation = (recordNumber % 10) - 5;

  if (datalogVolume) {
    datalogVolume.textContent = baseDatalog + variation;
  }
  if (newestVolume) {
    newestVolume.textContent = baseNewest + variation;
  }
  if (counterVolume) {
    counterVolume.textContent = baseCounter + variation;
  }
}

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
