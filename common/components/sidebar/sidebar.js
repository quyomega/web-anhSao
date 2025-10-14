/**
 * Sidebar Component Manager
 * Quản lý việc load và tương tác với sidebar
 */

class SidebarManager {
  constructor() {
    this.sidebar = null;
    this.overlay = null;
    this.menuToggle = null;
    this.currentPage = null;
    this.init();
  }

  init() {
    // Load sidebar HTML
    this.loadSidebar();
  }

  async loadSidebar() {
    try {
      // Tự động detect đường dẫn dựa trên vị trí hiện tại
      const currentPath = window.location.pathname;
      const isInSubFolder =
        currentPath.includes("/") && !currentPath.endsWith("/");
      const basePath = isInSubFolder ? "../../" : "../";
      const sidebarUrl = `${basePath}common/components/sidebar/sidebar.html`;

      console.log("Loading sidebar from:", sidebarUrl);

      const response = await fetch(sidebarUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const sidebarHTML = await response.text();

      // Tạo container cho sidebar
      const sidebarContainer = document.createElement("div");
      sidebarContainer.innerHTML = sidebarHTML;

      // Thêm sidebar vào body
      document.body.insertBefore(
        sidebarContainer.firstElementChild,
        document.body.firstElementChild
      );
      document.body.insertBefore(
        sidebarContainer.lastElementChild,
        document.body.firstElementChild
      );

      // Khởi tạo các element references
      this.sidebar = document.getElementById("sidebar");
      this.overlay = document.getElementById("sidebarOverlay");
      this.menuToggle = document.getElementById("menuToggle");

      console.log("Sidebar elements:", {
        sidebar: !!this.sidebar,
        overlay: !!this.overlay,
        menuToggle: !!this.menuToggle,
      });

      // Set active page
      this.setActivePage();

      // Bind events
      this.bindEvents();

      console.log("Sidebar loaded successfully");
    } catch (error) {
      console.error("Lỗi khi load sidebar:", error);
      // Fallback: tạo sidebar cơ bản nếu không load được file
      this.createFallbackSidebar();
    }
  }

  createFallbackSidebar() {
    console.log("Creating fallback sidebar");

    // Tạo sidebar HTML cơ bản
    const sidebarHTML = `
      <div class="sidebar" id="sidebar">
        <div class="sidebar-header">
          <div class="logo">
            <img src="../../common/assets/images/atc-logo.png" alt="ATC Logo" class="logo-image" />
          </div>
          <div class="company-name">ATC Petro</div>
        </div>
        <div class="sidebar-menu">
          <div class="menu-item active" data-page="address-mac">
            <div class="menu-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <div class="menu-text">Địa chỉ MAC</div>
          </div>
          <div class="menu-item" data-page="register-pump-nozzle">
            <div class="menu-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 2h6l4 6.5L9 8.5H3V2z"></path>
                <path d="M9 8.5H15l4 6.5L15 15.5H9V8.5z"></path>
                <path d="M15 15.5H21l2 4.5L21 20H15v-4.5z"></path>
              </svg>
            </div>
            <div class="menu-text">Khai báo vòi bơm</div>
          </div>
        </div>
      </div>
      <div class="sidebar-overlay" id="sidebarOverlay"></div>
    `;

    // Thêm vào body
    document.body.insertAdjacentHTML("afterbegin", sidebarHTML);

    // Khởi tạo references
    this.sidebar = document.getElementById("sidebar");
    this.overlay = document.getElementById("sidebarOverlay");
    this.menuToggle = document.getElementById("menuToggle");

    // Bind events
    this.bindEvents();

    console.log("Fallback sidebar created");
  }

  setActivePage() {
    // Lấy tên trang hiện tại từ URL hoặc data attribute
    const currentPath = window.location.pathname;
    const currentPage =
      currentPath.split("/").pop().replace(".html", "") || "address-mac";

    // Xóa active class cũ
    const activeItems = this.sidebar.querySelectorAll(".menu-item.active");
    activeItems.forEach((item) => item.classList.remove("active"));

    // Thêm active class cho trang hiện tại
    const currentMenuItem = this.sidebar.querySelector(
      `[data-page="${currentPage}"]`
    );
    if (currentMenuItem) {
      currentMenuItem.classList.add("active");
    }

    this.currentPage = currentPage;
  }

  bindEvents() {
    // Toggle sidebar
    if (this.menuToggle) {
      this.menuToggle.addEventListener("click", () => {
        this.toggleSidebar();
      });
    }

    // Đóng sidebar khi click overlay
    if (this.overlay) {
      this.overlay.addEventListener("click", () => {
        this.closeSidebar();
      });
    }

    // Navigation
    const menuItems = this.sidebar.querySelectorAll(".menu-item[data-page]");
    menuItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        const page = item.getAttribute("data-page");
        if (page && page !== this.currentPage) {
          this.navigateToPage(page);
        }
      });
    });
  }

  toggleSidebar() {
    console.log("Toggle sidebar clicked");
    if (this.sidebar) {
      this.sidebar.classList.toggle("active");
      if (this.overlay) {
        this.overlay.classList.toggle("active");
      }
      console.log("Sidebar classes:", this.sidebar.className);
    } else {
      console.error("Sidebar element not found");
    }
  }

  closeSidebar() {
    if (this.sidebar) {
      this.sidebar.classList.remove("active");
      if (this.overlay) {
        this.overlay.classList.remove("active");
      }
    }
  }

  navigateToPage(page) {
    // Đóng sidebar trước khi navigate
    this.closeSidebar();

    // Navigate đến trang mới
    const pageUrls = {
      "address-mac": "../address-mac/index.html",
      "register-pump-nozzle": "../register-pump-nozzle/index.html",
      "fuel-config": "../fuel-config/index.html",
      "fuel-price-config": "../fuel-price-config/index.html",
      "pump-info": "../pump-info/index.html",
      "pump-logs": "../pump-logs/index.html",
      "wifi-config": "../wifi-config/index.html",
      "time-sync": "../time-sync/index.html",
      "change-password": "../change-password/index.html",
      logout: "../login/index.html",
    };

    if (pageUrls[page]) {
      window.location.href = pageUrls[page];
    }
  }
}

// Khởi tạo sidebar khi DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  window.sidebarManager = new SidebarManager();
});
