document.addEventListener("DOMContentLoaded", function () {
  const wifiNetworksList = document.getElementById("wifiNetworksList");
  const wifiConnectedSection = document.getElementById("wifiConnectedSection");
  const wifiConnectedCard = document.getElementById("wifiConnectedCard");
  const wifiDialogOverlay = document.getElementById("wifiDialogOverlay");
  const wifiDialogTitle = document.getElementById("wifiDialogTitle");
  const wifiDialogClose = document.getElementById("wifiDialogClose");
  const wifiPasswordInput = document.getElementById("wifiPasswordInput");
  const passwordToggle = document.getElementById("passwordToggle");
  const cancelBtn = document.getElementById("cancelBtn");
  const connectBtn = document.getElementById("connectBtn");

  let wifiNetworks = [];
  let selectedNetwork = null;
  let connectedNetwork = null;

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

  function loadWifiData() {
    wifiNetworks = sampleWifiNetworks;
    renderWifiNetworks();
    renderConnectedWifi();
  }

  function renderWifiNetworks() {
    wifiNetworksList.innerHTML = wifiNetworks
      .map(
        (network) => `
          <div class="wifi-network-item ${
            network.connected ? "connected" : ""
          }" data-id="${network.id}" onclick="selectWifiNetwork(${network.id})">
            <div class="wifi-network-name">${network.ssid}</div>
            <div class="wifi-network-actions">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                <path d="M5.08789 10.8374C5.50822 10.88 5.83659 11.2351 5.83659 11.6667C5.83659 12.0982 5.50822 12.4534 5.08789 12.4959L5.00326 12.5H4.99512C4.53502 12.4998 4.16178 12.1268 4.16178 11.6667C4.16178 11.2065 4.53502 10.8335 4.99512 10.8333H5.00326L5.08789 10.8374Z" fill="#2E3747"/>
                <path d="M8.42204 10.8374C8.84237 10.88 9.17074 11.2351 9.17074 11.6667C9.17074 12.0982 8.84237 12.4534 8.42204 12.4959L8.3374 12.5H8.32926C7.86917 12.4998 7.49593 12.1268 7.49593 11.6667C7.49593 11.2065 7.86917 10.8335 8.32926 10.8333H8.3374L8.42204 10.8374Z" fill="#2E3747"/>
                <path d="M11.7562 10.8374C12.1765 10.88 12.5049 11.2351 12.5049 11.6667C12.5049 12.0982 12.1765 12.4534 11.7562 12.4959L11.6715 12.5H11.6634C11.2033 12.4998 10.8301 12.1268 10.8301 11.6667C10.8301 11.2065 11.2033 10.8335 11.6634 10.8333H11.6715L11.7562 10.8374Z" fill="#2E3747"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.33333 0C10.5236 0 11.9913 0.592112 12.8825 1.69841C13.7502 2.77558 13.9583 4.20844 13.9583 5.625V6.74316C16.0865 7.01169 16.6667 8.05221 16.6667 10.8333V12.5C16.6667 15.8333 15.8333 16.6667 12.5 16.6667H4.16667C0.833333 16.6667 0 15.8333 0 12.5V10.8333C0 8.05221 0.580138 7.01169 2.70833 6.74316V5.625C2.70833 4.20844 2.91649 2.77558 3.78418 1.69841C4.6754 0.592112 6.14311 0 8.33333 0ZM4.16667 7.91667C2.49107 7.91667 1.94461 8.1563 1.71712 8.38379C1.48963 8.61128 1.25 9.15773 1.25 10.8333V12.5C1.25 14.1756 1.48963 14.7221 1.71712 14.9495C1.94461 15.177 2.49107 15.4167 4.16667 15.4167H12.5C14.1756 15.4167 14.7221 15.177 14.9495 14.9495C15.177 14.7221 15.4167 14.1756 15.4167 12.5V10.8333C15.4167 9.15773 15.177 8.61128 14.9495 8.38379C14.7221 8.1563 14.1756 7.91667 12.5 7.91667H4.16667ZM8.33333 1.25C6.35697 1.25 5.32461 1.77887 4.75749 2.48291C4.16695 3.21614 3.95833 4.28332 3.95833 5.625V6.66992C4.02668 6.66916 4.0961 6.66667 4.16667 6.66667H12.5C12.5706 6.66667 12.64 6.66916 12.7083 6.66992V5.625C12.7083 4.28332 12.4997 3.21614 11.9092 2.48291C11.3421 1.77887 10.3097 1.25 8.33333 1.25Z" fill="#2E3747"/>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10.0888 12.4621C10.5067 12.5061 10.8334 12.8701 10.8334 13.3125C10.8333 13.7548 10.5067 14.1189 10.0888 14.1629L10.0042 14.167H9.99683C9.5389 14.167 9.16686 13.7844 9.16675 13.3125C9.16675 12.8405 9.53883 12.4572 9.99683 12.4572H10.0042L10.0888 12.4621Z" fill="#304FFD"/>
                <path d="M10.0009 5.83366C10.3444 5.83366 10.6226 6.12091 10.6226 6.47494V10.7482C10.6226 11.1022 10.3444 11.3895 10.0009 11.3895C9.6574 11.3895 9.37916 11.1022 9.37915 10.7482V6.47494C9.37915 6.12091 9.65739 5.83366 10.0009 5.83366Z" fill="#304FFD"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0001 1.66699C14.5834 1.66699 18.3334 5.41699 18.3334 10.0003C18.3334 14.5837 14.5834 18.3337 10.0001 18.3337C5.41675 18.3337 1.66675 14.5837 1.66675 10.0003C1.66675 5.41699 5.41675 1.66699 10.0001 1.66699ZM10.0001 2.91699C6.1071 2.91699 2.91675 6.10735 2.91675 10.0003C2.91675 13.8933 6.1071 17.0837 10.0001 17.0837C13.8931 17.0837 17.0834 13.8933 17.0834 10.0003C17.0834 6.10735 13.8931 2.91699 10.0001 2.91699Z" fill="#304FFD"/>
              </svg>
            </div>
          </div>
        `
      )
      .join("");
  }

  function renderConnectedWifi() {
    if (connectedNetwork) {
      wifiConnectedSection.style.display = "block";
      wifiConnectedCard.innerHTML = `
        <div class="wifi-connected-item">
          <div class="wifi-connected-info">
            <svg class="wifi-connected-checkmark" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="#304FFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="wifi-connected-name">${connectedNetwork.ssid}</div>
          </div>
          <div class="wifi-connected-actions">
            <svg class="wifi-connected-info-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10.0888 12.4621C10.5067 12.5061 10.8334 12.8701 10.8334 13.3125C10.8333 13.7548 10.5067 14.1189 10.0888 14.1629L10.0042 14.167H9.99683C9.5389 14.167 9.16686 13.7844 9.16675 13.3125C9.16675 12.8405 9.53883 12.4572 9.99683 12.4572H10.0042L10.0888 12.4621Z" fill="#304FFD"/>
              <path d="M10.0009 5.83366C10.3444 5.83366 10.6226 6.12091 10.6226 6.47494V10.7482C10.6226 11.1022 10.3444 11.3895 10.0009 11.3895C9.6574 11.3895 9.37916 11.1022 9.37915 10.7482V6.47494C9.37915 6.12091 9.65739 5.83366 10.0009 5.83366Z" fill="#304FFD"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0001 1.66699C14.5834 1.66699 18.3334 5.41699 18.3334 10.0003C18.3334 14.5837 14.5834 18.3337 10.0001 18.3337C5.41675 18.3337 1.66675 14.5837 1.66675 10.0003C1.66675 5.41699 5.41675 1.66699 10.0001 1.66699ZM10.0001 2.91699C6.1071 2.91699 2.91675 6.10735 2.91675 10.0003C2.91675 13.8933 6.1071 17.0837 10.0001 17.0837C13.8931 17.0837 17.0834 13.8933 17.0834 10.0003C17.0834 6.10735 13.8931 2.91699 10.0001 2.91699Z" fill="#304FFD"/>
            </svg>
          </div>
        </div>
      `;
    } else {
      wifiConnectedSection.style.display = "none";
    }
  }

  function showWifiPasswordDialog(network) {
    selectedNetwork = network;
    wifiDialogTitle.textContent = network.ssid;
    wifiPasswordInput.value = "";
    connectBtn.disabled = true;
    wifiDialogOverlay.style.display = "flex";
    wifiPasswordInput.focus();
  }

  function hideWifiPasswordDialog() {
    wifiDialogOverlay.style.display = "none";
    selectedNetwork = null;
    wifiPasswordInput.value = "";
    connectBtn.disabled = true;
  }

  function validatePassword() {
    const password = wifiPasswordInput.value.trim();
    connectBtn.disabled = password.length < 8;
  }

  function togglePasswordVisibility() {
    const isPassword = wifiPasswordInput.type === "password";
    wifiPasswordInput.type = isPassword ? "text" : "password";

    const icon = passwordToggle.querySelector("svg");
    if (isPassword) {
      icon.innerHTML = `

        <path fill-rule="evenodd" clip-rule="evenodd" d="M17.2663 1.85005C17.5104 1.60597 17.906 1.60597 18.1501 1.85005C18.3941 2.09413 18.3941 2.48979 18.1501 2.73384L2.7334 18.1505C2.48934 18.3945 2.09368 18.3945 1.84961 18.1505C1.60554 17.9064 1.60556 17.5108 1.84961 17.2667L4.41471 14.7008L4.30648 14.6097C3.60627 14.0101 2.85522 13.2724 2.28499 12.4173L2.28581 12.4165C1.85931 11.7777 1.66651 10.9621 1.6665 10.1834C1.66654 9.40444 1.85907 8.5883 2.28581 7.9495C4.1185 5.19731 6.8002 3.54194 9.73779 3.54194C11.1983 3.54196 13.0513 3.78172 14.4961 4.61942L17.2663 1.85005ZM9.73779 4.79194C7.30331 4.79194 4.97758 6.16067 3.32503 8.64286C3.067 9.02913 2.91654 9.58831 2.9165 10.1834C2.91651 10.7042 3.03135 11.1971 3.23307 11.5709L3.32503 11.7231L3.5415 12.0291C3.99393 12.6305 4.55604 13.1769 5.11702 13.6575L5.30257 13.8129L7.23617 11.8793C6.87766 11.3645 6.66653 10.7402 6.6665 10.0638C6.6665 8.30082 8.09204 6.87528 9.85498 6.87528C10.5371 6.87529 11.1432 7.13364 11.6307 7.48482L13.5732 5.54227C12.4507 4.99169 11.0104 4.79196 9.73779 4.79194ZM9.85498 8.12528C8.7824 8.12528 7.9165 8.99117 7.9165 10.0638C7.91652 10.3743 7.99104 10.6653 8.12077 10.9248L10.7217 8.38244C10.4475 8.22067 10.1519 8.12529 9.85498 8.12528Z" fill="#858A93"/>
        <path d="M15.7819 6.18111C16.0503 5.96415 16.4438 6.00551 16.6608 6.27388C16.9548 6.63738 17.2436 7.02855 17.5104 7.44657L17.5869 7.57189C17.9571 8.21164 18.1248 9.00024 18.1248 9.75532C18.1248 10.5606 17.9341 11.4038 17.5104 12.0641L17.5096 12.0633C15.6757 14.9306 12.9855 16.6669 10.0259 16.6669C9.12663 16.6669 8.24394 16.5014 7.40625 16.1958L7.0498 16.0566L6.99202 16.0289C6.71388 15.8777 6.59058 15.5371 6.71533 15.2387C6.84036 14.9402 7.16987 14.7891 7.47298 14.8815L7.5332 14.9034L7.83431 15.0214C8.54278 15.28 9.28101 15.4169 10.0259 15.4169C12.4585 15.4169 14.7931 13.9923 16.4574 11.3903L16.4582 11.3894L16.5518 11.2267C16.7576 10.8295 16.8748 10.3069 16.8748 9.75532C16.8748 9.12489 16.7218 8.53203 16.4582 8.12121L16.4574 8.11958C16.2203 7.74806 15.9592 7.39501 15.6883 7.06001C15.4714 6.79163 15.5136 6.39813 15.7819 6.18111Z" fill="#858A93"/>
        <path d="M11.8854 10.3038C11.948 9.96443 12.2736 9.74004 12.613 9.80252C12.9523 9.86514 13.1767 10.1907 13.1143 10.5301C12.8559 11.9307 11.7219 13.0648 10.3213 13.323C9.98196 13.3855 9.65642 13.161 9.59375 12.8217C9.53126 12.4823 9.75565 12.1568 10.0951 12.0942C10.9858 11.9299 11.721 11.1946 11.8854 10.3038Z" fill="#858A93"/>
        `;
    } else {
      icon.innerHTML = `
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.2815 3.33789C13.1807 3.43905 15.8695 5.09952 17.7587 7.90902C18.1375 8.4705 18.3289 9.22099 18.3332 9.97363V10.0249C18.3291 10.7778 18.1376 11.5286 17.7587 12.0903C15.8084 14.9906 13.0062 16.6663 9.9999 16.6663L9.71833 16.6615C6.81918 16.5602 4.13031 14.8998 2.24111 12.0903C1.52264 11.0253 1.47799 9.28021 2.10684 8.13037L2.24111 7.90902C4.19133 5.00878 6.99368 3.33309 9.9999 3.33301L10.2815 3.33789ZM9.9999 4.58301C7.56975 4.58308 5.19908 5.8923 3.44635 8.36393L3.27871 8.60645L3.2779 8.60807C3.06555 8.92283 2.91657 9.42456 2.91657 9.99967C2.91657 10.5029 3.03072 10.9496 3.2014 11.2643L3.2779 11.3913L3.27871 11.3929L3.44635 11.6354C5.19908 14.1071 7.56975 15.4163 9.9999 15.4163C12.5084 15.4163 14.9535 14.0214 16.7211 11.3929L16.7219 11.3913L16.7984 11.2643C16.9691 10.9496 17.0832 10.5029 17.0832 9.99967C17.0832 9.4245 16.9343 8.92283 16.7219 8.60807L16.7211 8.60645C14.9535 5.97795 12.5084 4.58301 9.9999 4.58301Z" fill="#858A93"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.1538 7.02034C11.732 7.10022 12.9834 8.40136 12.9834 9.99967L12.9794 10.1535C12.8995 11.7316 11.5983 12.983 10 12.9831L9.84623 12.979C8.31894 12.9018 7.09798 11.6808 7.02071 10.1535L7.01664 9.99967C7.01666 8.34973 8.35009 7.01628 10 7.01628L10.1538 7.02034ZM10 8.26628C9.04043 8.26628 8.26666 9.04007 8.26664 9.99967C8.26668 10.9593 9.04044 11.7331 10 11.7331C10.9596 11.733 11.7334 10.9592 11.7334 9.99967C11.7334 9.04011 10.9596 8.26635 10 8.26628Z" fill="#858A93"/> 
        `;
    }
  }

  function connectToWifi() {
    if (!selectedNetwork || connectBtn.disabled) return;

    const password = wifiPasswordInput.value.trim();

    connectBtn.disabled = true;
    connectBtn.textContent = "Đang kết nối...";

    setTimeout(() => {
      if (connectedNetwork) {
        const currentNetwork = wifiNetworks.find(
          (n) => n.id === connectedNetwork.id
        );
        if (currentNetwork) {
          currentNetwork.connected = false;
        }
      }

      const targetNetwork = wifiNetworks.find(
        (n) => n.id === selectedNetwork.id
      );
      if (targetNetwork) {
        targetNetwork.connected = true;
        connectedNetwork = {
          id: selectedNetwork.id,
          ssid: selectedNetwork.ssid,
          signal: selectedNetwork.signal,
        };
      }

      renderWifiNetworks();
      renderConnectedWifi();
      hideWifiPasswordDialog();
      connectBtn.textContent = "Kết nối";
    }, 2000);
  }

  wifiPasswordInput.addEventListener("input", validatePassword);
  passwordToggle.addEventListener("click", togglePasswordVisibility);
  wifiDialogClose.addEventListener("click", hideWifiPasswordDialog);
  cancelBtn.addEventListener("click", hideWifiPasswordDialog);
  connectBtn.addEventListener("click", connectToWifi);

  wifiDialogOverlay.addEventListener("click", (e) => {
    if (e.target === wifiDialogOverlay) {
      hideWifiPasswordDialog();
    }
  });

  wifiPasswordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !connectBtn.disabled) {
      connectToWifi();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && wifiDialogOverlay.style.display === "flex") {
      hideWifiPasswordDialog();
    }
  });

  function showWifiInfo(networkId) {
    const network = wifiNetworks.find((n) => n.id === networkId);
    if (!network) return;

    const info = `
      Tên mạng: ${network.ssid}
      Bảo mật: ${network.security}
      Tần số: ${network.frequency}
      Cường độ tín hiệu: ${network.signal}/4
      Trạng thái: ${network.connected ? "Đã kết nối" : "Chưa kết nối"}
    `.trim();

    alert(info);
  }

  loadWifiData();

  window.selectWifiNetwork = function (networkId) {
    const network = wifiNetworks.find((n) => n.id === networkId);
    if (network) {
      showWifiPasswordDialog(network);
    }
  };
  window.showWifiInfo = showWifiInfo;
});
