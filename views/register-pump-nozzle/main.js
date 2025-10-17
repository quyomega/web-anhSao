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

  function startPump() {
    isRunning = true;
    statusElement.textContent = "Running";
    statusElement.className = "status-tag running";
    controlButton.textContent = "Stop";
    controlButton.className = "stop-button";

    formInputs.forEach((input) => {
      input.disabled = true;
    });
  }

  function stopPump() {
    isRunning = false;
    statusElement.textContent = "Stop";
    statusElement.className = "status-tag stopped";
    controlButton.textContent = "Start";
    controlButton.className = "start-button";

    formInputs.forEach((input) => {
      input.disabled = false;
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

  controlButton.addEventListener("click", function (e) {
    if (!isRunning && !validateForm()) {
      e.preventDefault();
      return;
    }
  });

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
    const savedData = localStorage.getItem("pumpConfig");
    if (savedData) {
      const formData = JSON.parse(savedData);
      document.getElementById("id").value = formData.id || "1";
      document.getElementById("lineServer").value =
        formData.lineServer || "1234";
      document.getElementById("pumpList").value =
        formData.pumpList || "A, B, C, D";
      document.getElementById("serialPort").value =
        formData.serialPort || "COM4";
      document.getElementById("baudRate").value = formData.baudRate || "19200";
    }
  }

  formInputs.forEach((input) => {
    input.addEventListener("change", saveFormData);
    input.addEventListener("input", saveFormData);
  });

  loadFormData();

  document.querySelector(".menu-icon").addEventListener("click", function () {
  });
});
