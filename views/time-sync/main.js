document.addEventListener("DOMContentLoaded", function () {
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

  let currentTime = new Date();
  let selectedPumpId = "A";

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

    timePicker.value = timeString;
    datePicker.value = now.toISOString().split("T")[0];
  }

  function showTimePicker() {
    timePickerOverlay.style.display = "flex";

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

  function hideTimePicker() {
    timePickerOverlay.style.display = "none";
  }

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

  function showMessage(message, type = "success") {
    const existingMessage = document.querySelector(".sync-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    const messageEl = document.createElement("div");
    messageEl.className = `sync-message ${type}`;
    messageEl.textContent = message;

    document.body.appendChild(messageEl);

    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.remove();
      }
    }, 3000);
  }

  function simulateSync(pumpIds, isAll = false) {
    const button = isAll ? syncAllBtn : syncOneBtn;
    const originalText = button.textContent;

    button.classList.add("loading");
    button.disabled = true;
    button.textContent = isAll ? "Đang đồng bộ tất cả..." : "Đang đồng bộ...";

    setTimeout(() => {
      button.classList.remove("loading");
      button.disabled = false;
      button.textContent = originalText;

      const pumpList = Array.isArray(pumpIds) ? pumpIds.join(", ") : pumpIds;
      const message = isAll
        ? `Đồng bộ thời gian thành công cho tất cả vòi bơm (${pumpList})`
        : `Đồng bộ thời gian thành công cho vòi bơm ${pumpList}`;

      showMessage(message, "success");

    }, 2000);
  }

  function syncOnePump() {
    const selectedPump = pumpIdSelect.value;
    simulateSync(selectedPump, false);
  }

  function syncAllPumps() {
    const allPumps = Array.from(pumpIdSelect.options).map(
      (option) => option.value
    );
    simulateSync(allPumps, true);
  }

  function validateTimeInput() {
    if (!timeInput.value || timeInput.value.trim() === "") {
      showMessage("Vui lòng chọn thời gian để đồng bộ", "error");
      return false;
    }
    return true;
  }

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

  timePickerOverlay.addEventListener("click", (e) => {
    if (e.target === timePickerOverlay) {
      hideTimePicker();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && timePickerOverlay.style.display === "flex") {
      hideTimePicker();
    }
  });

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

  pumpIdSelect.addEventListener("change", (e) => {
    selectedPumpId = e.target.value;
  });
  initializeCurrentTime();
});
