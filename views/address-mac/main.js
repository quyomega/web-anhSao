document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const copyButton = document.getElementById("copyButton");
  const macAddress = document.getElementById("macAddress");

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

  copyButton.addEventListener("click", function () {
    const macText = macAddress.textContent;

    navigator.clipboard
      .writeText(macText)
      .then(function () {
        showToast("Đã sao chép thành công !!!", "success");

        copyButton.style.transform = "scale(0.95)";
        setTimeout(() => {
          copyButton.style.transform = "scale(1)";
        }, 150);
      })
      .catch(function (err) {
        showToast("Không thể copy địa chỉ MAC", "error");
      });
  });

  const menuItems = document.querySelectorAll(".sidebar .menu-item");
  menuItems.forEach((item) => {
    item.addEventListener("click", function () {
      const menuText = this.querySelector(".menu-text").textContent;

      menuItems.forEach((menuItem) => menuItem.classList.remove("active"));

      this.classList.add("active");

      switch (menuText) {
        case "Địa chỉ MAC":
          break;
        case "Khai báo vòi bơm":
          Navigation.goTo("../register-pump-nozzle/index.html");
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

  copyButton.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-2px)";
    this.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
  });

  copyButton.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
    this.style.boxShadow = "none";
  });
  function process_response(data) {
    if (data && data.mac) {
      document.getElementById("macAddress").innerText = data.mac;
    }
  }
  fetch("api/mac")
    .then((r) => r.json())
    .then((data) => {
      process_response(data);
    })
    .catch((err) => console.error(err));

  setTimeout(() => {
    process_response({ mac: "Test API " });
  }, 2000);
});
