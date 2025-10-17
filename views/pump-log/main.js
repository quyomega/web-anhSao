const pumpLogData = [
  {
    stt: "01",
    pumpId: "A",
    fuel: "DO 0.0001S-V",
    liter: "5 Lít",
    price: "15.000₫",
    money: "75.000₫",
    time: "16/10/2025 4:52",
    count: "1",
    status: "Success",
    totalLiter: "5 Lít",
    totalAmount: "75.000₫",
    pumpSerial: "100A1B1",
  },
  {
    stt: "02",
    pumpId: "B",
    fuel: "RON 95-III",
    liter: "10 Lít",
    price: "21.000₫",
    money: "210.000₫",
    time: "17/10/2025 9:44",
    count: "3",
    status: "Fail",
    totalLiter: "10 Lít",
    totalAmount: "210.000₫",
    pumpSerial: "100A1B2",
  },
  {
    stt: "03",
    pumpId: "C",
    fuel: "RON 95-IV",
    liter: "15 Lít",
    price: "21.500₫",
    money: "322.500₫",
    time: "15/10/20252:08",
    count: "5",
    status: "Success",
    totalLiter: "15 Lít",
    totalAmount: "322.500₫",
    pumpSerial: "100A1B3",
  },
  {
    stt: "04",
    pumpId: "D",
    fuel: "RON 92",
    liter: "20 Lít",
    price: "20.000₫",
    money: "400.000₫",
    time: "14/10/2025 8:12",
    count: "7",
    status: "Success",
    totalLiter: "20 Lít",
    totalAmount: "400.000₫",
    pumpSerial: "100A1B4",
  },
  {
    stt: "05",
    pumpId: "E",
    fuel: "Dầu hỏa",
    liter: "35 Lít",
    price: "15.000₫",
    money: "525.000₫",
    time: "13/10/2025 7:38",
    count: "9",
    status: "Fail",
    totalLiter: "35 Lít",
    totalAmount: "525.000₫",
    pumpSerial: "100A1B5",
  },
];

const currentLogData = [
  {
    stt: "01",
    pumpId: "A",
    fuel: "DO 0.0001S-V",
    liter: "5 Lít",
    price: "15.000₫",
    money: "75.000₫",
    count: "1",
  },
  {
    stt: "02",
    pumpId: "B",
    fuel: "RON 95-III",
    liter: "10 Lít",
    price: "21.000₫",
    money: "210.000₫",
    count: "3",
  },
  {
    stt: "03",
    pumpId: "C",
    fuel: "RON 95-IV",
    liter: "15 Lít",
    price: "21.500₫",
    money: "322.500₫",
    count: "5",
  },
  {
    stt: "04",
    pumpId: "D",
    fuel: "RON 92",
    liter: "20 Lít",
    price: "20.000₫",
    money: "400.000₫",
    count: "7",
  },
  {
    stt: "05",
    pumpId: "E",
    fuel: "Dầu hỏa",
    liter: "35 Lít",
    price: "15.000₫",
    money: "525.000₫",
    count: "9",
  },
];

let tabButtons;
let tabPanels;
let filterBtn;
let pumpLogTableBody;
let currentLogTableBody;

let filterSection;
let filterOverlay;
let dateRangeInput;
let datePicker;
let dateRangeText;
let currentMonth;
let prevMonthBtn;
let nextMonthBtn;
let datePickerDays;
let resetFilterBtn;
let applyFilterBtn;

let currentDate = new Date();
let selectedStartDate = null;
let selectedEndDate = null;
let isSelectingRange = false;

document.addEventListener("DOMContentLoaded", function () {
  initializeElements();
  setupEventListeners();
  renderPumpLogTable();
  renderCurrentLogTable();
});

function initializeElements() {
  tabButtons = document.querySelectorAll(".tab-btn");
  tabPanels = document.querySelectorAll(".tab-panel");
  filterBtn = document.getElementById("filterBtn");
  pumpLogTableBody = document.getElementById("pumpLogTableBody");
  currentLogTableBody = document.getElementById("currentLogTableBody");

  filterSection = document.getElementById("filterSection");
  filterOverlay = document.getElementById("filterOverlay");
  dateRangeInput = document.getElementById("dateRangeInput");
  datePicker = document.getElementById("datePicker");
  dateRangeText = document.getElementById("dateRangeText");
  currentMonth = document.getElementById("currentMonth");
  prevMonthBtn = document.getElementById("prevMonth");
  nextMonthBtn = document.getElementById("nextMonth");
  datePickerDays = document.getElementById("datePickerDays");
  resetFilterBtn = document.getElementById("resetFilterBtn");
  applyFilterBtn = document.getElementById("applyFilterBtn");
}

function setupEventListeners() {
  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab");
      switchTab(targetTab);
    });
  });

  if (filterBtn) {
    filterBtn.addEventListener("click", function () {
      showFilterSection();
    });
  }

  if (filterOverlay) {
    filterOverlay.addEventListener("click", hideFilterSection);
  }

  if (dateRangeInput) {
    dateRangeInput.addEventListener("click", toggleDatePicker);
  }

  if (prevMonthBtn) {
    prevMonthBtn.addEventListener("click", () => changeMonth(-1));
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener("click", () => changeMonth(1));
  }

  if (resetFilterBtn) {
    resetFilterBtn.addEventListener("click", resetFilters);
  }

  if (applyFilterBtn) {
    applyFilterBtn.addEventListener("click", applyFilters);
  }

  initializeDatePicker();
}

function switchTab(targetTab) {
  tabButtons.forEach((btn) => btn.classList.remove("active"));
  tabPanels.forEach((panel) => panel.classList.remove("active"));

  const activeButton = document.querySelector(`[data-tab="${targetTab}"]`);
  const activePanel = document.getElementById(targetTab);

  if (activeButton) activeButton.classList.add("active");
  if (activePanel) activePanel.classList.add("active");

  const tabGroup = document.querySelector(".tab-group");
  if (tabGroup) {
    if (targetTab === "current-log") {
      tabGroup.classList.add("switch-right");
    } else {
      tabGroup.classList.remove("switch-right");
    }
  }

  showToast(`Đã chuyển sang tab ${getTabDisplayName(targetTab)}`, "success");
}

function getTabDisplayName(tabId) {
  const names = {
    "log-list": "Danh sách log bơm",
    "current-log": "Log bơm hiện tại",
  };
  return names[tabId] || tabId;
}

function renderPumpLogTable() {
  if (!pumpLogTableBody) return;

  pumpLogTableBody.innerHTML = "";

  pumpLogData.forEach((log, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="sticky-col">${log.stt}</td>
      <td class="sticky-col">${log.pumpId}</td>
      <td class="sticky-col fuel-type">${log.fuel}</td>
      <td>${log.liter}</td>
      <td class="currency">${log.price}</td>
      <td class="currency">${log.money}</td>
      <td class="time">${log.time}</td>
      <td>${log.count}</td>
      <td><span class="status-badge ${log.status.toLowerCase()}">${
      log.status
    }</span></td>
      <td>${log.totalLiter}</td>
      <td class="currency">${log.totalAmount}</td>
      <td>${log.pumpSerial}</td>
    `;

    pumpLogTableBody.appendChild(row);
  });
}

function renderCurrentLogTable() {
  if (!currentLogTableBody) return;

  currentLogTableBody.innerHTML = "";

  currentLogData.forEach((log, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="sticky-col">${log.stt}</td>
      <td class="sticky-col">${log.pumpId}</td>
      <td class="sticky-col fuel-type">${log.fuel}</td>
      <td>${log.liter}</td>
      <td class="currency">${log.price}</td>
      <td class="currency">${log.money}</td>
      <td>${log.count}</td>
      <td>
        <button class="action-btn" onclick="viewCurrentLogDetails('${log.stt}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </td>
    `;

    currentLogTableBody.appendChild(row);
  });
}

function showFilterSection() {
  if (filterSection && filterOverlay) {
    filterSection.style.display = "block";
    filterOverlay.classList.add("show");
    setTimeout(() => {
      filterSection.classList.add("show");
    }, 10);
  }
}

function hideFilterSection() {
  if (filterSection && filterOverlay) {
    filterSection.classList.remove("show");
    filterOverlay.classList.remove("show");
    setTimeout(() => {
      filterSection.style.display = "none";
    }, 300);
  }
}

function toggleDatePicker() {
  if (datePicker) {
    const isVisible = datePicker.style.display !== "none";
    if (isVisible) {
      datePicker.style.display = "none";
      dateRangeInput.classList.remove("active");
    } else {
      datePicker.style.display = "block";
      dateRangeInput.classList.add("active");
      renderDatePicker();
    }
  }
}

function initializeDatePicker() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  selectedStartDate = firstDay;
  selectedEndDate = lastDay;

  updateDateRangeText();
}

function changeMonth(direction) {
  currentDate.setMonth(currentDate.getMonth() + direction);
  renderDatePicker();
}

function renderDatePicker() {
  if (!currentMonth || !datePickerDays) return;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];
  currentMonth.textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  datePickerDays.innerHTML = "";

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const dayElement = document.createElement("div");
    dayElement.className = "date-day";
    dayElement.textContent = date.getDate();

    if (date.getMonth() !== month) {
      dayElement.classList.add("other-month");
    }

    if (selectedStartDate && selectedEndDate) {
      if (date >= selectedStartDate && date <= selectedEndDate) {
        if (date.getTime() === selectedStartDate.getTime()) {
          dayElement.classList.add("range-start");
        } else if (date.getTime() === selectedEndDate.getTime()) {
          dayElement.classList.add("range-end");
        } else {
          dayElement.classList.add("in-range");
        }
      }
    }

    dayElement.addEventListener("click", () => selectDate(date));

    datePickerDays.appendChild(dayElement);
  }
}

function selectDate(date) {
  if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
    selectedStartDate = new Date(date);
    selectedEndDate = null;
    isSelectingRange = true;
  } else {
    if (date < selectedStartDate) {
      selectedEndDate = new Date(selectedStartDate);
      selectedStartDate = new Date(date);
    } else {
      selectedEndDate = new Date(date);
    }
    isSelectingRange = false;
    updateDateRangeText();
    setTimeout(() => {
      datePicker.style.display = "none";
      dateRangeInput.classList.remove("active");
    }, 200);
  }

  renderDatePicker();
}

function updateDateRangeText() {
  if (dateRangeText && selectedStartDate && selectedEndDate) {
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    dateRangeText.textContent = `${formatDate(
      selectedStartDate
    )} - ${formatDate(selectedEndDate)}`;
  }
}

function resetFilters() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  selectedStartDate = firstDay;
  selectedEndDate = lastDay;
  updateDateRangeText();

  renderDatePicker();

  showToast("Đã đặt lại bộ lọc", "success");
}

function applyFilters() {
  let filteredData = [...pumpLogData];

  if (selectedStartDate && selectedEndDate) {
    filteredData = filteredData.filter((log) => {
      const logDate = new Date(
        log.time.split(" ")[0].split("/").reverse().join("-")
      );
      return logDate >= selectedStartDate && logDate <= selectedEndDate;
    });
  }

  renderFilteredTable(filteredData);

  hideFilterSection();

  const filterCount = filteredData.length;
  showToast(`Đã áp dụng bộ lọc. Tìm thấy ${filterCount} kết quả`, "success");
}

function filterPumpLogs(filterType) {
  let filteredData = [...pumpLogData];

  switch (filterType) {
    case "Thành công":
      filteredData = pumpLogData.filter((log) => log.status === "Success");
      break;
    case "Thất bại":
      filteredData = pumpLogData.filter((log) => log.status === "Fail");
      break;
    case "Hôm nay":
      filteredData = pumpLogData.filter((log) => {
        const logDate = new Date(
          log.time.split(" ")[0].split("/").reverse().join("-")
        );
        const today = new Date();
        return logDate.toDateString() === today.toDateString();
      });
      break;
    case "Tuần này":
    case "Tháng này":
      break;
    default:
      break;
  }

  renderFilteredTable(filteredData);
}

function renderFilteredTable(data) {
  if (!pumpLogTableBody) return;

  pumpLogTableBody.innerHTML = "";

  if (data.length === 0) {
    pumpLogTableBody.innerHTML = `
      <tr>
        <td colspan="12" style="text-align: center; padding: 40px; color: #6b7280;">
          Không có dữ liệu phù hợp với bộ lọc
        </td>
      </tr>
    `;
    return;
  }

  data.forEach((log, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="sticky-col">${log.stt}</td>
      <td class="sticky-col">${log.pumpId}</td>
      <td class="sticky-col fuel-type">${log.fuel}</td>
      <td>${log.liter}</td>
      <td class="currency">${log.price}</td>
      <td class="currency">${log.money}</td>
      <td class="time">${log.time}</td>
      <td>${log.count}</td>
      <td><span class="status-badge ${log.status.toLowerCase()}">${
      log.status
    }</span></td>
      <td>${log.totalLiter}</td>
      <td class="currency">${log.totalAmount}</td>
      <td>${log.pumpSerial}</td>
    `;

    pumpLogTableBody.appendChild(row);
  });
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

function viewCurrentLogDetails(stt) {
  const log = currentLogData.find((item) => item.stt === stt);
  if (log) {
    navigateToPumpDetail(log.pumpId);
  }
}

function navigateToPumpDetail(pumpId) {
  sessionStorage.setItem("selectedPumpId", pumpId);

  window.location.href = "../pump-detail/index.html";
}

window.PumpLogApp = {
  switchTab,
  filterPumpLogs,
  showToast,
  formatCurrency,
  formatDate,
  showFilterSection,
  hideFilterSection,
  applyFilters,
  resetFilters,
  viewCurrentLogDetails,
};
