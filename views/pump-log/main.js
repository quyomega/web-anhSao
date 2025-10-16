// Sample data for pump logs
const pumpLogData = [
  {
    stt: "01",
    pumpId: "A",
    fuel: "DO 0.0001S-V",
    liter: "5 Lít",
    price: "15.000₫",
    money: "75.000₫",
    time: "15/08/2017 4:52",
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
    time: "16/08/2013 9:44",
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
    time: "18/09/2016 2:08",
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
    time: "07/05/2016 8:12",
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
    time: "28/10/2012 7:38",
    count: "9",
    status: "Fail",
    totalLiter: "35 Lít",
    totalAmount: "525.000₫",
    pumpSerial: "100A1B5",
  },
];

// DOM elements
let tabButtons;
let tabPanels;
let filterBtn;
let pumpLogTableBody;

// Filter section elements
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

// Filter state
let currentDate = new Date();
let selectedStartDate = null;
let selectedEndDate = null;
let isSelectingRange = false;

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  initializeElements();
  setupEventListeners();
  renderPumpLogTable();
});

// Initialize DOM elements
function initializeElements() {
  tabButtons = document.querySelectorAll(".tab-btn");
  tabPanels = document.querySelectorAll(".tab-panel");
  filterBtn = document.getElementById("filterBtn");
  pumpLogTableBody = document.getElementById("pumpLogTableBody");

  // Filter section elements
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

// Setup event listeners
function setupEventListeners() {
  // Tab switching
  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab");
      switchTab(targetTab);
    });
  });

  // Filter button
  if (filterBtn) {
    filterBtn.addEventListener("click", function () {
      showFilterSection();
    });
  }

  // Filter section event listeners
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

  // Initialize date picker
  initializeDatePicker();
}

// Switch between tabs
function switchTab(targetTab) {
  // Remove active class from all tabs and panels
  tabButtons.forEach((btn) => btn.classList.remove("active"));
  tabPanels.forEach((panel) => panel.classList.remove("active"));

  // Add active class to selected tab and panel
  const activeButton = document.querySelector(`[data-tab="${targetTab}"]`);
  const activePanel = document.getElementById(targetTab);

  if (activeButton) activeButton.classList.add("active");
  if (activePanel) activePanel.classList.add("active");

  // Update toggle switch position
  const tabGroup = document.querySelector(".tab-group");
  if (tabGroup) {
    if (targetTab === "current-log") {
      tabGroup.classList.add("switch-right");
    } else {
      tabGroup.classList.remove("switch-right");
    }
  }

  // Show toast notification
  showToast(`Đã chuyển sang tab ${getTabDisplayName(targetTab)}`, "success");
}

// Get display name for tab
function getTabDisplayName(tabId) {
  const names = {
    "log-list": "Danh sách log bơm",
    "current-log": "Log bơm hiện tại",
  };
  return names[tabId] || tabId;
}

// Render pump log table
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

// Show filter section
function showFilterSection() {
  if (filterSection && filterOverlay) {
    filterSection.style.display = "block";
    filterOverlay.classList.add("show");
    setTimeout(() => {
      filterSection.classList.add("show");
    }, 10);
  }
}

// Hide filter section
function hideFilterSection() {
  if (filterSection && filterOverlay) {
    filterSection.classList.remove("show");
    filterOverlay.classList.remove("show");
    setTimeout(() => {
      filterSection.style.display = "none";
    }, 300);
  }
}

// Toggle date picker
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

// Initialize date picker
function initializeDatePicker() {
  // Set default date range (current month)
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  selectedStartDate = firstDay;
  selectedEndDate = lastDay;

  updateDateRangeText();
}

// Change month in date picker
function changeMonth(direction) {
  currentDate.setMonth(currentDate.getMonth() + direction);
  renderDatePicker();
}

// Render date picker
function renderDatePicker() {
  if (!currentMonth || !datePickerDays) return;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Update month display
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

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  // Clear previous days
  datePickerDays.innerHTML = "";

  // Generate calendar days
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const dayElement = document.createElement("div");
    dayElement.className = "date-day";
    dayElement.textContent = date.getDate();

    // Check if date is in current month
    if (date.getMonth() !== month) {
      dayElement.classList.add("other-month");
    }

    // Check if date is in selected range
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

    // Add click event
    dayElement.addEventListener("click", () => selectDate(date));

    datePickerDays.appendChild(dayElement);
  }
}

// Select date
function selectDate(date) {
  if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
    // Start new selection
    selectedStartDate = new Date(date);
    selectedEndDate = null;
    isSelectingRange = true;
  } else {
    // Complete range selection
    if (date < selectedStartDate) {
      selectedEndDate = new Date(selectedStartDate);
      selectedStartDate = new Date(date);
    } else {
      selectedEndDate = new Date(date);
    }
    isSelectingRange = false;
    updateDateRangeText();
    // Hide date picker after selection
    setTimeout(() => {
      datePicker.style.display = "none";
      dateRangeInput.classList.remove("active");
    }, 200);
  }

  renderDatePicker();
}

// Update date range text
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

// Reset filters
function resetFilters() {
  // Reset date range to current month
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  selectedStartDate = firstDay;
  selectedEndDate = lastDay;
  updateDateRangeText();

  // Re-render date picker
  renderDatePicker();

  showToast("Đã đặt lại bộ lọc", "success");
}

// Apply filters
function applyFilters() {
  // Apply filters to data
  let filteredData = [...pumpLogData];

  // Filter by date range
  if (selectedStartDate && selectedEndDate) {
    filteredData = filteredData.filter((log) => {
      const logDate = new Date(
        log.time.split(" ")[0].split("/").reverse().join("-")
      );
      return logDate >= selectedStartDate && logDate <= selectedEndDate;
    });
  }

  // Render filtered results
  renderFilteredTable(filteredData);

  // Hide section
  hideFilterSection();

  // Show success message
  const filterCount = filteredData.length;
  showToast(`Đã áp dụng bộ lọc. Tìm thấy ${filterCount} kết quả`, "success");
}

// Filter pump logs
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
      // Filter by today's date (simplified)
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
      // Similar date filtering logic
      break;
    default:
      // Show all data
      break;
  }

  // Re-render table with filtered data
  renderFilteredTable(filteredData);
}

// Render filtered table
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

// Show toast notification
function showToast(message, type = "info") {
  // Remove existing toast
  const existingToast = document.querySelector(".toast");
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast element
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icon = getToastIcon(type);

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
  `;

  // Add to document
  document.body.appendChild(toast);

  // Auto remove after 3 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 3000);
}

// Get toast icon based on type
function getToastIcon(type) {
  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };
  return icons[type] || icons.info;
}

// Utility function to format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

// Utility function to format date
function formatDate(date) {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// Export functions for potential use in other modules
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
};
