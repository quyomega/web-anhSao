document.addEventListener("DOMContentLoaded", function () {
  const controlButton = document.getElementById("controlButton");
  const statusElement = document.getElementById("status");
  const formInputs = document.querySelectorAll("input, select");
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  let isRunning = false;

  menuToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleSidebar();
  });

  sidebarOverlay.addEventListener("click", function () {
    closeSidebar();
  });

  document.addEventListener("click", function (e) {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      closeSidebar();
    }
  });

  const menuItems = document.querySelectorAll(".sidebar .menu-item");
  menuItems.forEach((item) => {
    item.addEventListener("click", function () {
      const menuText = this.querySelector(".menu-text").textContent;

      menuItems.forEach((menuItem) => menuItem.classList.remove("active"));
      this.classList.add("active");

      switch (menuText) {
        case "Địa chỉ MAC":
          Navigation.goTo("../address-mac/index.html");
          break;
        case "Khai báo vòi bơm":
          break;
        case "Cấu hình nhiên liệu":
          showToast("Chức năng đang phát triển", "warning");
          break;
        case "Cấu hình giá nhiên liệu":
          showToast("Chức năng đang phát triển", "warning");
          break;
        case "Thông tin vòi bơm":
          Navigation.goTo("../pump-info/index.html");
          break;
        case "Danh sách log bơm":
          showToast("Chức năng đang phát triển", "warning");
          break;
        case "Cấu hình Wifi":
          showToast("Chức năng đang phát triển", "warning");
          break;
        case "Đồng bộ thời gian":
          showToast("Chức năng đang phát triển", "warning");
          break;
        case "Đổi mật khẩu":
          showToast("Chức năng đang phát triển", "warning");
          break;
        case "Đăng xuất":
          handleLogout();
          break;
      }

      closeSidebar();
    });
  });

  function toggleSidebar() {
    sidebar.classList.toggle("open");
    sidebarOverlay.classList.toggle("show");
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("show");
  }

  function handleLogout() {
    Storage.remove("user");
    Navigation.goTo("../login/index.html");
  }

  const user = Storage.get("user");
  if (!user) {
    showToast("Vui lòng đăng nhập", "warning");
    setTimeout(() => {
      Navigation.goTo("../login/index.html");
    }, 1500);
  }

  controlButton.addEventListener("click", function () {
    if (isRunning) {
      stopPump();
    } else {
      startPump();
    }
  });

  function getFormData() {
    return {
      id: parseInt(document.getElementById("id").value) || 1,
      line_server_name: document.getElementById("lineServer").value,
      pump_id_list: document.getElementById("pumpList").value,
      serial_port: document.getElementById("serialPort").value,
      baud_rate: parseInt(document.getElementById("baudRate").value) || 9600,
    };
  }

  function updatePumpStatus(status) {
    const formData = getFormData();
    // Lấy trạng thái hiện tại từ UI (statusElement) để đảm bảo đúng
    const currentStatusText = statusElement.textContent.trim().toLowerCase();
    const currentStatusFromUI =
      currentStatusText === "running" ? "running" : "stop";
    // Ưu tiên status được truyền vào, nếu không có thì dùng trạng thái từ UI
    const statusToSend = status || currentStatusFromUI;
    const dataToSend = {
      ...formData,
      status: statusToSend,
    };

    return fetch("/api/pump_status", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể cập nhật trạng thái");
        }
        return response.json();
      })
      .then((data) => {
        showToast(
          status === "running"
            ? "Đã khởi động vòi bơm thành công"
            : "Đã dừng vòi bơm thành công",
          "success"
        );
        return data;
      })
      .catch((err) => {
        console.error("Lỗi khi cập nhật trạng thái:", err);
        showToast("Không thể cập nhật trạng thái", "error");
        throw err;
      });
  }

  function startPump() {
    if (!validateForm()) {
      return;
    }

    controlButton.disabled = true;
    controlButton.textContent = "Đang xử lý...";

    updatePumpStatus("running")
      .then(() => {
        isRunning = true;
        statusElement.textContent = "Running";
        statusElement.className = "status-tag running";
        controlButton.textContent = "Stop";
        controlButton.className = "stop-button";
        controlButton.disabled = false;

        formInputs.forEach((input) => {
          input.disabled = true;
        });
      })
      .catch(() => {
        controlButton.disabled = false;
        controlButton.textContent = "Start";
        controlButton.className = "start-button";
      });
  }

  function stopPump() {
    controlButton.disabled = true;
    controlButton.textContent = "Đang xử lý...";

    updatePumpStatus("stop")
      .then(() => {
        isRunning = false;
        statusElement.textContent = "Stop";
        statusElement.className = "status-tag stopped";
        controlButton.textContent = "Start";
        controlButton.className = "start-button";
        controlButton.disabled = false;

        formInputs.forEach((input) => {
          input.disabled = false;
        });
      })
      .catch(() => {
        controlButton.disabled = false;
        controlButton.textContent = "Stop";
        controlButton.className = "stop-button";
      });
  }

  function validateForm() {
    const id = document.getElementById("id").value;
    const lineServer = document.getElementById("lineServer").value;
    const pumpList = document.getElementById("pumpList").value;

    if (!id.trim()) {
      alert("Vui lòng nhập ID");
      return false;
    }

    if (!lineServer.trim()) {
      alert("Vui lòng nhập Line server name");
      return false;
    }

    if (!pumpList.trim()) {
      alert("Vui lòng nhập Pump ID list");
      return false;
    }

    return true;
  }

  function saveFormData() {
    const formData = {
      id: document.getElementById("id").value,
      lineServer: document.getElementById("lineServer").value,
      pumpList: document.getElementById("pumpList").value,
      serialPort: document.getElementById("serialPort").value,
      baudRate: document.getElementById("baudRate").value,
    };
    localStorage.setItem("pumpConfig", JSON.stringify(formData));
  }

  function loadFormData() {
    fetch("/api/pump_status")
      .then((response) => response.json())
      .then((data) => {
        if (data.id !== undefined) {
          document.getElementById("id").value = data.id;
        }
        if (data.line_server_name) {
          document.getElementById("lineServer").value = data.line_server_name;
        }
        if (data.pump_id_list) {
          document.getElementById("pumpList").value = data.pump_id_list;
        }
        if (data.serial_port) {
          document.getElementById("serialPort").value = data.serial_port;
        }
        if (data.baud_rate) {
          document.getElementById("baudRate").value = data.baud_rate;
        }
        // Cập nhật status từ API
        if (data.status) {
          if (data.status === "running") {
            isRunning = true;
            statusElement.textContent = "Running";
            statusElement.className = "status-tag running";
            controlButton.textContent = "Stop";
            controlButton.className = "stop-button";
            formInputs.forEach((input) => {
              input.disabled = true;
            });
          } else {
            isRunning = false;
            statusElement.textContent = "Stop";
            statusElement.className = "status-tag stopped";
            controlButton.textContent = "Start";
            controlButton.className = "start-button";
            formInputs.forEach((input) => {
              input.disabled = false;
            });
          }
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải dữ liệu từ API:", err);
        showToast("Không thể tải dữ liệu từ server", "error");
        const savedData = localStorage.getItem("pumpConfig");
        if (savedData) {
          const formData = JSON.parse(savedData);
          document.getElementById("id").value = formData.id || "1";
          document.getElementById("lineServer").value =
            formData.lineServer || "1";
          document.getElementById("pumpList").value = formData.pumpList || "A";
          document.getElementById("serialPort").value =
            formData.serialPort || "COM4";
          document.getElementById("baudRate").value =
            formData.baudRate || "19200";
        }
      });
  }

  formInputs.forEach((input) => {
    input.addEventListener("change", saveFormData);
    input.addEventListener("input", saveFormData);
  });

  loadFormData();

  document
    .querySelector(".menu-icon")
    .addEventListener("click", function () {});
});
