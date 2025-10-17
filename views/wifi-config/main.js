// Main JavaScript cho trang cấu hình Wifi ATC Petro

// Đợi DOM load xong
document.addEventListener("DOMContentLoaded", function () {
  // Lấy các elements
  const wifiStatusCard = document.getElementById("wifiStatusCard");
  const currentNetworkSpan = document.getElementById("currentNetwork");
  const connectionStatusSpan = document.getElementById("connectionStatus");
  const signalStrengthSpan = document.getElementById("signalStrength");
  const disconnectBtn = document.getElementById("disconnectBtn");
  const wifiNetworksList = document.getElementById("wifiNetworksList");
  const scanWifiBtn = document.getElementById("scanWifiBtn");
  const wifiConfigSection = document.getElementById("wifiConfigSection");
  const wifiConfigForm = document.getElementById("wifiConfigForm");
  const cancelWifiBtn = document.getElementById("cancelWifiBtn");
  const connectWifiBtn = document.getElementById("connectWifiBtn");
  const wifiNameInput = document.getElementById("wifiName");
  const wifiPasswordInput = document.getElementById("wifiPassword");
  const passwordToggle = document.getElementById("passwordToggle");

  // State management
  let wifiNetworks = [];
  let currentConnection = null;
  let selectedNetwork = null;
  let overlay = null;
  let isScanning = false;

  // Dữ liệu mẫu cho các mạng wifi
  const sampleWifiNetworks = [
    {
      id: 1,
      ssid: "EVG - KY THUAT",
      security: "WPA2",
      signal: 4,
      connected: false,
      frequency: "2.4GHz",
    },
    {
      id: 2,
      ssid: "EVG - KINH DOANH",
      security: "WPA2",
      signal: 3,
      connected: false,
      frequency: "2.4GHz",
    },
    {
      id: 3,
      ssid: "EVG - 5G",
      security: "WPA2",
      signal: 4,
      connected: false,
      frequency: "5GHz",
    },
    {
      id: 4,
      ssid: "EVG - 2.4G",
      security: "WPA2",
      signal: 2,
      connected: false,
      frequency: "2.4GHz",
    },
    {
      id: 5,
      ssid: "EVG - 5",
      security: "WPA2",
      signal: 3,
      connected: false,
      frequency: "5GHz",
    },
  ];

  // Load dữ liệu từ localStorage hoặc sử dụng dữ liệu mẫu
  function loadWifiData() {
    const savedNetworks = Storage.get("wifiNetworks");
    const savedConnection = Storage.get("currentWifiConnection");

    wifiNetworks = savedNetworks || sampleWifiNetworks;
    currentConnection = savedConnection || null;

    updateWifiStatus();
    renderWifiNetworks();
  }

  // Cập nhật trạng thái wifi hiện tại
  function updateWifiStatus() {
    if (currentConnection) {
      currentNetworkSpan.textContent = currentConnection.ssid;
      connectionStatusSpan.textContent = "Đã kết nối";
      connectionStatusSpan.className = "wifi-status-value connected";
      signalStrengthSpan.textContent = getSignalStrengthText(
        currentConnection.signal
      );
      disconnectBtn.style.display = "block";
    } else {
      currentNetworkSpan.textContent = "Chưa kết nối";
      connectionStatusSpan.textContent = "Ngắt kết nối";
      connectionStatusSpan.className = "wifi-status-value disconnected";
      signalStrengthSpan.textContent = "--";
      disconnectBtn.style.display = "none";
    }
  }

  // Render danh sách mạng wifi
  function renderWifiNetworks() {
    if (wifiNetworks.length === 0) {
      wifiNetworksList.innerHTML = `
        <div class="empty-state">
          <svg class="empty-state-icon" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M7.61413 15.0173C9.05702 13.9033 10.9507 13.9033 12.3936 15.0173C12.6668 15.2283 12.7176 15.6206 12.5067 15.8938C12.2958 16.1666 11.9033 16.2175 11.6302 16.0069C10.6373 15.2403 9.37037 15.2403 8.37748 16.0069C8.10431 16.2173 7.71182 16.1668 7.50101 15.8938C7.2902 15.6207 7.3412 15.2283 7.61413 15.0173Z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M5.6016 12.1959C8.25493 10.1408 11.7382 10.1408 14.3915 12.1959C14.6643 12.4073 14.7142 12.8003 14.503 13.0732C14.2916 13.346 13.8986 13.3959 13.6257 13.1847C11.4229 11.4785 8.56931 11.4784 6.36657 13.1847C6.09378 13.3957 5.70144 13.3457 5.49011 13.0732C5.27894 12.8003 5.32879 12.4072 5.6016 12.1959Z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M4.15303 9.38258C7.69258 6.64974 12.3151 6.64977 15.8547 9.38258C16.1278 9.59352 16.1787 9.98585 15.9678 10.259C15.7568 10.5321 15.3637 10.5822 15.0905 10.3713C12.001 7.98628 8.00579 7.98603 4.91638 10.3713C4.64318 10.5821 4.2508 10.5322 4.03991 10.259C3.82907 9.98591 3.88005 9.59356 4.15303 9.38258Z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M1.91019 6.69947C6.80636 2.91855 13.1941 2.91844 18.0902 6.69947C18.3633 6.91035 18.414 7.30276 18.2033 7.57594C17.9925 7.84899 17.6 7.89967 17.3269 7.68906C12.8807 4.25544 7.11971 4.25555 2.67354 7.68906C2.40036 7.89967 2.00795 7.84899 1.79708 7.57594C1.5863 7.30275 1.63708 6.9104 1.91019 6.69947Z" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <div class="empty-state-title">Không tìm thấy mạng wifi</div>
          <div class="empty-state-description">Nhấn "Quét mạng wifi" để tìm kiếm</div>
        </div>
      `;
      return;
    }

    wifiNetworksList.innerHTML = wifiNetworks
      .map(
        (network) => `
          <div class="wifi-network-item ${
            network.connected ? "connected" : ""
          }" data-id="${network.id}">
            <div class="wifi-network-content">
              <div class="wifi-network-info">
                <div class="wifi-network-name">${network.ssid}</div>
                <div class="wifi-network-details">
                  <div class="wifi-network-security">
                    ${getSecurityIcon(network.security)}
                    <span>${network.security}</span>
                  </div>
                  <div class="wifi-network-signal">
                    ${getSignalStrengthBars(network.signal)}
                    <span>${network.frequency}</span>
                  </div>
                </div>
              </div>
              <div class="wifi-network-actions">
                <button class="connect-btn" onclick="connectToWifi(${
                  network.id
                })" title="Kết nối">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.61413 15.0173C9.05702 13.9033 10.9507 13.9033 12.3936 15.0173C12.6668 15.2283 12.7176 15.6206 12.5067 15.8938C12.2958 16.1666 11.9033 16.2175 11.6302 16.0069C10.6373 15.2403 9.37037 15.2403 8.37748 16.0069C8.10431 16.2173 7.71182 16.1668 7.50101 15.8938C7.2902 15.6207 7.3412 15.2283 7.61413 15.0173Z" fill="#2E3747"/>
                    <path d="M5.6016 12.1959C8.25493 10.1408 11.7382 10.1408 14.3915 12.1959C14.6643 12.4073 14.7142 12.8003 14.503 13.0732C14.2916 13.346 13.8986 13.3959 13.6257 13.1847C11.4229 11.4785 8.56931 11.4784 6.36657 13.1847C6.09378 13.3957 5.70144 13.3457 5.49011 13.0732C5.27894 12.8003 5.32879 12.4072 5.6016 12.1959Z" fill="#2E3747"/>
                    <path d="M4.15303 9.38258C7.69258 6.64974 12.3151 6.64977 15.8547 9.38258C16.1278 9.59352 16.1787 9.98585 15.9678 10.259C15.7568 10.5321 15.3637 10.5822 15.0905 10.3713C12.001 7.98628 8.00579 7.98603 4.91638 10.3713C4.64318 10.5821 4.2508 10.5322 4.03991 10.259C3.82907 9.98591 3.88005 9.59356 4.15303 9.38258Z" fill="#2E3747"/>
                    <path d="M1.91019 6.69947C6.80636 2.91855 13.1941 2.91844 18.0902 6.69947C18.3633 6.91035 18.414 7.30276 18.2033 7.57594C17.9925 7.84899 17.6 7.89967 17.3269 7.68906C12.8807 4.25544 7.11971 4.25555 2.67354 7.68906C2.40036 7.89967 2.00795 7.84899 1.79708 7.57594C1.5863 7.30275 1.63708 6.9104 1.91019 6.69947Z" fill="#2E3747"/>
                  </svg>
                </button>
                <button class="info-btn" onclick="showWifiInfo(${
                  network.id
                })" title="Thông tin">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10 1.66667C5.4 1.66667 1.66667 5.4 1.66667 10C1.66667 14.6 5.4 18.3333 10 18.3333C14.6 18.3333 18.3333 14.6 18.3333 10C18.3333 5.4 14.6 1.66667 10 1.66667ZM10 15C9.54 15 9.16667 14.6267 9.16667 14.1667C9.16667 13.7067 9.54 13.3333 10 13.3333C10.46 13.3333 10.8333 13.7067 10.8333 14.1667C10.8333 14.6267 10.46 15 10 15ZM10.8333 11.6667C10.8333 12.1267 10.46 12.5 10 12.5C9.54 12.5 9.16667 12.1267 9.16667 11.6667V6.66667C9.16667 6.20667 9.54 5.83333 10 5.83333C10.46 5.83333 10.8333 6.20667 10.8333 6.66667V11.6667Z" fill="#2E3747"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        `
      )
      .join("");
  }

  // Lấy icon bảo mật
  function getSecurityIcon(security) {
    if (security === "WPA2" || security === "WPA3") {
      return `
        <svg class="security-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1C5.5 1 3.5 3 3.5 5.5V7C3.5 7.8 4.2 8.5 5 8.5H11C11.8 8.5 12.5 7.8 12.5 7V5.5C12.5 3 10.5 1 8 1ZM8 2.5C9.7 2.5 11 3.8 11 5.5V7H5V5.5C5 3.8 6.3 2.5 8 2.5Z" fill="#666"/>
          <path d="M6.5 9.5C6.5 9.2 6.7 9 7 9H9C9.3 9 9.5 9.2 9.5 9.5V12.5C9.5 12.8 9.3 13 9 13H7C6.7 13 6.5 12.8 6.5 12.5V9.5Z" fill="#666"/>
        </svg>
      `;
    }
    return `
      <svg class="security-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1C5.5 1 3.5 3 3.5 5.5V7C3.5 7.8 4.2 8.5 5 8.5H11C11.8 8.5 12.5 7.8 12.5 7V5.5C12.5 3 10.5 1 8 1ZM8 2.5C9.7 2.5 11 3.8 11 5.5V7H5V5.5C5 3.8 6.3 2.5 8 2.5Z" fill="#666"/>
        <path d="M6.5 9.5C6.5 9.2 6.7 9 7 9H9C9.3 9 9.5 9.2 9.5 9.5V12.5C9.5 12.8 9.3 13 9 13H7C6.7 13 6.5 12.8 6.5 12.5V9.5Z" fill="#666"/>
      </svg>
    `;
  }

  // Lấy thanh cường độ tín hiệu
  function getSignalStrengthBars(signal) {
    const bars = [];
    for (let i = 1; i <= 4; i++) {
      bars.push(
        `<div class="signal-bar ${i <= signal ? "active" : ""}"></div>`
      );
    }
    return `<div class="signal-strength">${bars.join("")}</div>`;
  }

  // Lấy text cường độ tín hiệu
  function getSignalStrengthText(signal) {
    const strengthMap = {
      1: "Yếu",
      2: "Trung bình",
      3: "Tốt",
      4: "Rất tốt",
    };
    return strengthMap[signal] || "Không xác định";
  }

  // Hiện form cấu hình wifi
  function showWifiConfigForm(network) {
    selectedNetwork = network;
    wifiNameInput.value = network.ssid;
    wifiPasswordInput.value = "";
    wifiPasswordInput.placeholder =
      network.security === "Open" ? "Không cần mật khẩu" : "Nhập mật khẩu wifi";
    wifiPasswordInput.required = network.security !== "Open";

    // Tạo overlay nếu chưa có
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "wifi-config-overlay";
      document.body.appendChild(overlay);
    }

    // Hiện overlay và form
    overlay.classList.add("show");
    wifiConfigSection.style.display = "block";
    setTimeout(() => {
      wifiConfigSection.classList.add("show");
    }, 10);

    // Focus vào password input nếu cần
    if (network.security !== "Open") {
      setTimeout(() => {
        wifiPasswordInput.focus();
      }, 100);
    }
  }

  // Ẩn form cấu hình wifi
  function hideWifiConfigForm() {
    wifiConfigSection.classList.remove("show");
    if (overlay) {
      overlay.classList.remove("show");
    }

    setTimeout(() => {
      wifiConfigSection.style.display = "none";
    }, 300);

    selectedNetwork = null;
  }

  // Kết nối đến wifi
  function connectToWifi(networkId) {
    const network = wifiNetworks.find((n) => n.id === networkId);
    if (!network) return;

    if (network.security === "Open") {
      // Kết nối trực tiếp nếu không có mật khẩu
      performConnection(network, "");
    } else {
      // Hiện form nhập mật khẩu
      showWifiConfigForm(network);
    }
  }

  // Thực hiện kết nối
  function performConnection(network, password) {
    showLoading(connectWifiBtn);

    // Simulate API call
    setTimeout(() => {
      // Ngắt kết nối hiện tại nếu có
      if (currentConnection) {
        const currentNetwork = wifiNetworks.find(
          (n) => n.id === currentConnection.id
        );
        if (currentNetwork) {
          currentNetwork.connected = false;
        }
      }

      // Kết nối mạng mới
      const targetNetwork = wifiNetworks.find((n) => n.id === network.id);
      if (targetNetwork) {
        targetNetwork.connected = true;
        currentConnection = {
          id: network.id,
          ssid: network.ssid,
          signal: network.signal,
          connectedAt: new Date().toISOString(),
        };
      }

      // Lưu vào localStorage
      Storage.set("wifiNetworks", wifiNetworks);
      Storage.set("currentWifiConnection", currentConnection);

      // Cập nhật UI
      updateWifiStatus();
      renderWifiNetworks();
      hideWifiConfigForm();
      hideLoading(connectWifiBtn);

      showToast(`Đã kết nối thành công đến ${network.ssid}`, "success");
    }, 2000);
  }

  // Ngắt kết nối wifi
  function disconnectWifi() {
    if (!currentConnection) return;

    showLoading(disconnectBtn);

    // Simulate API call
    setTimeout(() => {
      const currentNetwork = wifiNetworks.find(
        (n) => n.id === currentConnection.id
      );
      if (currentNetwork) {
        currentNetwork.connected = false;
      }

      currentConnection = null;

      // Lưu vào localStorage
      Storage.set("wifiNetworks", wifiNetworks);
      Storage.set("currentWifiConnection", null);

      // Cập nhật UI
      updateWifiStatus();
      renderWifiNetworks();
      hideLoading(disconnectBtn);

      showToast("Đã ngắt kết nối wifi", "success");
    }, 1000);
  }

  // Quét mạng wifi
  function scanWifiNetworks() {
    if (isScanning) return;

    isScanning = true;
    scanWifiBtn.classList.add("scanning");
    scanWifiBtn.disabled = true;
    scanWifiBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM10 16C6.69 16 4 13.31 4 10C4 6.69 6.69 4 10 4C13.31 4 16 6.69 16 10C16 13.31 13.31 16 10 16Z" fill="white"/>
        <path d="M10 6C8.34 6 7 7.34 7 9C7 10.66 8.34 12 10 12C11.66 12 13 10.66 13 9C13 7.34 11.66 6 10 6ZM10 10.5C9.17 10.5 8.5 9.83 8.5 9C8.5 8.17 9.17 7.5 10 7.5C10.83 7.5 11.5 8.17 11.5 9C11.5 9.83 10.83 10.5 10 10.5Z" fill="white"/>
      </svg>
      Đang quét...
    `;

    // Simulate scanning
    setTimeout(() => {
      // Randomize signal strength for demo
      wifiNetworks.forEach((network) => {
        network.signal = Math.floor(Math.random() * 4) + 1;
      });

      // Lưu vào localStorage
      Storage.set("wifiNetworks", wifiNetworks);

      // Cập nhật UI
      renderWifiNetworks();

      // Reset button
      isScanning = false;
      scanWifiBtn.classList.remove("scanning");
      scanWifiBtn.disabled = false;
      scanWifiBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7.61413 15.0173C9.05702 13.9033 10.9507 13.9033 12.3936 15.0173C12.6668 15.2283 12.7176 15.6206 12.5067 15.8938C12.2958 16.1666 11.9033 16.2175 11.6302 16.0069C10.6373 15.2403 9.37037 15.2403 8.37748 16.0069C8.10431 16.2173 7.71182 16.1668 7.50101 15.8938C7.2902 15.6207 7.3412 15.2283 7.61413 15.0173Z" fill="white"/>
          <path d="M5.6016 12.1959C8.25493 10.1408 11.7382 10.1408 14.3915 12.1959C14.6643 12.4073 14.7142 12.8003 14.503 13.0732C14.2916 13.346 13.8986 13.3959 13.6257 13.1847C11.4229 11.4785 8.56931 11.4784 6.36657 13.1847C6.09378 13.3957 5.70144 13.3457 5.49011 13.0732C5.27894 12.8003 5.32879 12.4072 5.6016 12.1959Z" fill="white"/>
          <path d="M4.15303 9.38258C7.69258 6.64974 12.3151 6.64977 15.8547 9.38258C16.1278 9.59352 16.1787 9.98585 15.9678 10.259C15.7568 10.5321 15.3637 10.5822 15.0905 10.3713C12.001 7.98628 8.00579 7.98603 4.91638 10.3713C4.64318 10.5821 4.2508 10.5322 4.03991 10.259C3.82907 9.98591 3.88005 9.59356 4.15303 9.38258Z" fill="white"/>
          <path d="M1.91019 6.69947C6.80636 2.91855 13.1941 2.91844 18.0902 6.69947C18.3633 6.91035 18.414 7.30276 18.2033 7.57594C17.9925 7.84899 17.6 7.89967 17.3269 7.68906C12.8807 4.25544 7.11971 4.25555 2.67354 7.68906C2.40036 7.89967 2.00795 7.84899 1.79708 7.57594C1.5863 7.30275 1.63708 6.9104 1.91019 6.69947Z" fill="white"/>
        </svg>
        Quét mạng wifi
      `;

      showToast("Đã cập nhật danh sách mạng wifi", "success");
    }, 3000);
  }

  // Hiện thông tin wifi
  function showWifiInfo(networkId) {
    const network = wifiNetworks.find((n) => n.id === networkId);
    if (!network) return;

    const info = `
Tên mạng: ${network.ssid}
Bảo mật: ${network.security}
Tần số: ${network.frequency}
Cường độ tín hiệu: ${getSignalStrengthText(network.signal)}
Trạng thái: ${network.connected ? "Đã kết nối" : "Chưa kết nối"}
    `.trim();

    alert(info);
  }

  // Toggle hiển thị mật khẩu
  function togglePasswordVisibility() {
    const isPassword = wifiPasswordInput.type === "password";
    wifiPasswordInput.type = isPassword ? "text" : "password";

    // Thay đổi icon
    const icon = passwordToggle.querySelector("svg");
    if (isPassword) {
      icon.innerHTML = `
        <path d="M10 3.75C6.25 3.75 3.125 6.25 1.25 10C3.125 13.75 6.25 16.25 10 16.25C13.75 16.25 16.875 13.75 18.75 10C16.875 6.25 13.75 3.75 10 3.75ZM10 14.375C7.5 14.375 5.625 12.5 5.625 10C5.625 7.5 7.5 5.625 10 5.625C12.5 5.625 14.375 7.5 14.375 10C14.375 12.5 12.5 14.375 10 14.375Z" fill="#666"/>
        <path d="M10 7.5C8.625 7.5 7.5 8.625 7.5 10C7.5 11.375 8.625 12.5 10 12.5C11.375 12.5 12.5 11.375 12.5 10C12.5 8.625 11.375 7.5 10 7.5Z" fill="#666"/>
        <path d="M2.5 2.5L17.5 17.5" stroke="#666" stroke-width="2" stroke-linecap="round"/>
      `;
    } else {
      icon.innerHTML = `
        <path d="M10 3.75C6.25 3.75 3.125 6.25 1.25 10C3.125 13.75 6.25 16.25 10 16.25C13.75 16.25 16.875 13.75 18.75 10C16.875 6.25 13.75 3.75 10 3.75ZM10 14.375C7.5 14.375 5.625 12.5 5.625 10C5.625 7.5 7.5 5.625 10 5.625C12.5 5.625 14.375 7.5 14.375 10C14.375 12.5 12.5 14.375 10 14.375Z" fill="#666"/>
        <path d="M10 7.5C8.625 7.5 7.5 8.625 7.5 10C7.5 11.375 8.625 12.5 10 12.5C11.375 12.5 12.5 11.375 12.5 10C12.5 8.625 11.375 7.5 10 7.5Z" fill="#666"/>
      `;
    }
  }

  // Event Listeners
  scanWifiBtn.addEventListener("click", scanWifiNetworks);
  disconnectBtn.addEventListener("click", disconnectWifi);
  cancelWifiBtn.addEventListener("click", hideWifiConfigForm);
  passwordToggle.addEventListener("click", togglePasswordVisibility);

  // Đóng form khi click overlay
  document.addEventListener("click", (e) => {
    if (e.target === overlay) {
      hideWifiConfigForm();
    }
  });

  // Xử lý submit form
  wifiConfigForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!selectedNetwork) return;

    const password = wifiPasswordInput.value.trim();

    // Validate password for secured networks
    if (selectedNetwork.security !== "Open" && !password) {
      showToast("Vui lòng nhập mật khẩu", "error");
      wifiPasswordInput.focus();
      return;
    }

    performConnection(selectedNetwork, password);
  });

  // Xử lý Enter key
  wifiPasswordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      wifiConfigForm.dispatchEvent(new Event("submit"));
    }
  });

  // Xử lý Escape key để đóng form
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && wifiConfigSection.classList.contains("show")) {
      hideWifiConfigForm();
    }
  });

  // Khởi tạo
  loadWifiData();

  // Expose functions globally for onclick handlers
  window.connectToWifi = connectToWifi;
  window.showWifiInfo = showWifiInfo;
});
