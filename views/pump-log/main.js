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
      showFilterOptions();
    });
  }
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

    // Add click event to row
    row.addEventListener("click", function () {
      showLogDetails(log);
    });

    // Add hover effect
    row.style.cursor = "pointer";

    pumpLogTableBody.appendChild(row);
  });
}

// Show log details
function showLogDetails(log) {
  const message = `
    Chi tiết log bơm:
    - Pump ID: ${log.pumpId}
    - Nhiên liệu: ${log.fuel}
    - Số lít: ${log.liter}
    - Đơn giá: ${log.price}
    - Thành tiền: ${log.money}
    - Thời gian: ${log.time}
    - Trạng thái: ${log.status}
  `;

  showToast(message, "info");
}

// Show filter options
function showFilterOptions() {
  // Create filter modal or dropdown
  const filterOptions = [
    "Tất cả",
    "Thành công",
    "Thất bại",
    "Hôm nay",
    "Tuần này",
    "Tháng này",
  ];

  // For now, just show a simple alert
  // In a real application, you would create a proper filter modal
  const selectedFilter = prompt(
    "Chọn bộ lọc:\n" +
      filterOptions
        .map((option, index) => `${index + 1}. ${option}`)
        .join("\n") +
      "\n\nNhập số thứ tự:"
  );

  if (
    selectedFilter &&
    selectedFilter >= 1 &&
    selectedFilter <= filterOptions.length
  ) {
    const filterName = filterOptions[selectedFilter - 1];
    showToast(`Đã áp dụng bộ lọc: ${filterName}`, "success");

    // Here you would implement the actual filtering logic
    filterPumpLogs(filterName);
  }
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

    row.addEventListener("click", function () {
      showLogDetails(log);
    });

    row.style.cursor = "pointer";
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
  showLogDetails,
  filterPumpLogs,
  showToast,
  formatCurrency,
  formatDate,
};
