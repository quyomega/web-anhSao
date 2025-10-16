// MAC Address page main JavaScript

document.addEventListener("DOMContentLoaded", function () {
  // Lấy các elements
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const copyButton = document.getElementById("copyButton");
  const macAddress = document.getElementById("macAddress");

  // Toggle sidebar
  menuToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleSidebar();
  });

  // Đóng sidebar khi click overlay
  sidebarOverlay.addEventListener("click", function () {
    closeSidebar();
  });

  // Đóng sidebar khi click ra ngoài
  document.addEventListener("click", function (e) {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      closeSidebar();
    }
  });

  // Copy MAC address
  copyButton.addEventListener("click", function () {
    const macText = macAddress.textContent;

    // Copy to clipboard
    navigator.clipboard
      .writeText(macText)
      .then(function () {
        showToast("Đã copy địa chỉ MAC!", "success");

        // Thêm hiệu ứng visual
        copyButton.style.transform = "scale(0.95)";
        setTimeout(() => {
          copyButton.style.transform = "scale(1)";
        }, 150);
      })
      .catch(function (err) {
        console.error("Lỗi khi copy:", err);
        showToast("Không thể copy địa chỉ MAC", "error");
      });
  });

  // Xử lý menu items trong sidebar
  const menuItems = document.querySelectorAll(".sidebar .menu-item");
  menuItems.forEach((item) => {
    item.addEventListener("click", function () {
      const menuText = this.querySelector(".menu-text").textContent;

      // Xóa active class từ tất cả items
      menuItems.forEach((menuItem) => menuItem.classList.remove("active"));

      // Thêm active class cho item được click
      this.classList.add("active");

      // Xử lý các menu items
      switch (menuText) {
        case "Địa chỉ MAC":
          // Đã ở trang này rồi
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

      // Đóng sidebar sau khi click
      closeSidebar();
    });
  });

  // Hàm toggle sidebar
  function toggleSidebar() {
    sidebar.classList.toggle("open");
    sidebarOverlay.classList.toggle("show");
  }

  // Hàm đóng sidebar
  function closeSidebar() {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("show");
  }

  // Hàm xử lý đăng xuất
  function handleLogout() {
    // Xóa thông tin user
    Storage.remove("user");

    // Redirect về trang login ngay lập tức
    Navigation.goTo("../login/index.html");
  }

  // Kiểm tra nếu chưa đăng nhập
  const user = Storage.get("user");
  if (!user) {
    showToast("Vui lòng đăng nhập", "warning");
    setTimeout(() => {
      Navigation.goTo("../login/index.html");
    }, 1500);
  }

  // Thêm hiệu ứng hover cho copy button
  copyButton.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-2px)";
    this.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
  });

  copyButton.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
    this.style.boxShadow = "none";
  });
});
