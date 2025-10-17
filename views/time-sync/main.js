// Main JavaScript cho trang đồng bộ thời gian ATC Petro

// Đợi DOM load xong
document.addEventListener("DOMContentLoaded", function () {
  // Lấy các elements
  const pumpIdSelect = document.getElementById("pumpIdSelect");
  const timeInput = document.getElementById("timeInput");
  const syncOneBtn = document.getElementById("syncOneBtn");
  const syncAllBtn = document.getElementById("syncAllBtn");
  const timePickerOverlay = document.getElementById("timePickerOverlay");
  const timePickerClose = document.getElementById("timePickerClose");
  const timePicker = document.getElementById("timePicker");
  const datePicker = document.getElementById("datePicker");
  const cancelTimeBtn = document.getElementById("cancelTimeBtn");
  const confirmTimeBtn = document.getElementById("confirmTimeBtn");

  // State management
  let currentTime = new Date();
  let selectedPumpId = "A";

  // Khởi tạo thời gian hiện tại
  function initializeCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString("vi-VN", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const dateString = now.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    currentTime = now;
    timeInput.value = `${timeString} - ${dateString}`;

    // Set default values for time picker
    timePicker.value = timeString;
    datePicker.value = now.toISOString().split("T")[0];
  }

  // Hiển thị time picker modal
  function showTimePicker() {
    timePickerOverlay.style.display = "flex";

    // Set current values
    const timeString = currentTime.toLocaleTimeString("vi-VN", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const dateString = currentTime.toISOString().split("T")[0];

    timePicker.value = timeString;
    datePicker.value = dateString;
  }

  // Ẩn time picker modal
  function hideTimePicker() {
    timePickerOverlay.style.display = "none";
  }

  // Cập nhật thời gian từ time picker
  function updateTimeFromPicker() {
    const timeValue = timePicker.value;
    const dateValue = datePicker.value;

    if (timeValue && dateValue) {
      const [hours, minutes, seconds] = timeValue.split(":");
      const [year, month, day] = dateValue.split("-");

      currentTime = new Date(year, month - 1, day, hours, minutes, seconds);

      const timeString = currentTime.toLocaleTimeString("vi-VN", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const dateString = currentTime.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      timeInput.value = `${timeString} - ${dateString}`;
    }

    hideTimePicker();
  }

  // Hiển thị thông báo
  function showMessage(message, type = "success") {
    // Remove existing message
    const existingMessage = document.querySelector(".sync-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create new message
    const messageEl = document.createElement("div");
    messageEl.className = `sync-message ${type}`;
    messageEl.textContent = message;

    document.body.appendChild(messageEl);

    // Auto remove after 3 seconds
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.remove();
      }
    }, 3000);
  }

  // Simulate sync process
  function simulateSync(pumpIds, isAll = false) {
    const button = isAll ? syncAllBtn : syncOneBtn;
    const originalText = button.textContent;

    // Show loading state
    button.classList.add("loading");
    button.disabled = true;
    button.textContent = isAll ? "Đang đồng bộ tất cả..." : "Đang đồng bộ...";

    // Simulate API call
    setTimeout(() => {
      // Remove loading state
      button.classList.remove("loading");
      button.disabled = false;
      button.textContent = originalText;

      // Show success message
      const pumpList = Array.isArray(pumpIds) ? pumpIds.join(", ") : pumpIds;
      const message = isAll
        ? `Đồng bộ thời gian thành công cho tất cả vòi bơm (${pumpList})`
        : `Đồng bộ thời gian thành công cho vòi bơm ${pumpList}`;

      showMessage(message, "success");

      // Log to console for debugging
      console.log(`Time sync completed for pump(s): ${pumpList}`);
      console.log(`Sync time: ${timeInput.value}`);
    }, 2000);
  }

  // Đồng bộ 1 ID
  function syncOnePump() {
    const selectedPump = pumpIdSelect.value;
    simulateSync(selectedPump, false);
  }

  // Đồng bộ tất cả ID
  function syncAllPumps() {
    const allPumps = Array.from(pumpIdSelect.options).map(
      (option) => option.value
    );
    simulateSync(allPumps, true);
  }

  // Validate time input
  function validateTimeInput() {
    if (!timeInput.value || timeInput.value.trim() === "") {
      showMessage("Vui lòng chọn thời gian để đồng bộ", "error");
      return false;
    }
    return true;
  }

  // Event Listeners
  timeInput.addEventListener("click", showTimePicker);

  timePickerClose.addEventListener("click", hideTimePicker);
  cancelTimeBtn.addEventListener("click", hideTimePicker);
  confirmTimeBtn.addEventListener("click", updateTimeFromPicker);

  syncOneBtn.addEventListener("click", () => {
    if (validateTimeInput()) {
      syncOnePump();
    }
  });

  syncAllBtn.addEventListener("click", () => {
    if (validateTimeInput()) {
      syncAllPumps();
    }
  });

  // Đóng modal khi click overlay
  timePickerOverlay.addEventListener("click", (e) => {
    if (e.target === timePickerOverlay) {
      hideTimePicker();
    }
  });

  // Xử lý phím Escape để đóng modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && timePickerOverlay.style.display === "flex") {
      hideTimePicker();
    }
  });

  // Xử lý phím Enter trong time picker
  timePicker.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      updateTimeFromPicker();
    }
  });

  datePicker.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      updateTimeFromPicker();
    }
  });

  // Cập nhật selected pump ID khi thay đổi
  pumpIdSelect.addEventListener("change", (e) => {
    selectedPumpId = e.target.value;
    console.log(`Selected pump ID: ${selectedPumpId}`);
  });

  // Khởi tạo
  initializeCurrentTime();

  // Log initial state
  console.log("Time sync page initialized");
  console.log(`Initial pump ID: ${selectedPumpId}`);
  console.log(`Initial time: ${timeInput.value}`);
});
