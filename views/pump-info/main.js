// Main JavaScript cho trang thông tin vòi bơm ATC Petro

// Đợi DOM load xong
document.addEventListener("DOMContentLoaded", function () {
  // Lấy các elements
  const pumpList = document.getElementById("pumpList");
  const searchInput = document.getElementById("searchInput");

  // State management
  let allPumpData = [];
  let filteredPumpData = [];

  // Dữ liệu mẫu cho thông tin vòi bơm
  const samplePumpData = [
    {
      id: 1,
      pumpId: "A",
      fuelType: "RON 95-III",
      pumpType: "ATMC",
      pumpSign: "PDM221-2014",
      pumpSerial: "01234",
      sellCodeHeader: "01234ATC",
    },
    {
      id: 2,
      pumpId: "B",
      fuelType: "RON 92-II",
      pumpType: "ATMC",
      pumpSign: "PDM221-2014",
      pumpSerial: "01234",
      sellCodeHeader: "01234ATC",
    },
    {
      id: 3,
      pumpId: "C",
      fuelType: "Dầu DO",
      pumpType: "ATMC",
      pumpSign: "PDM221-2014",
      pumpSerial: "01234",
      sellCodeHeader: "01234ATC",
    },
    {
      id: 4,
      pumpId: "D",
      fuelType: "Xăng E5",
      pumpType: "ATMC",
      pumpSign: "PDM221-2014",
      pumpSerial: "01235",
      sellCodeHeader: "01235ATC",
    },
    {
      id: 5,
      pumpId: "E",
      fuelType: "Xăng E10",
      pumpType: "ATMC",
      pumpSign: "PDM221-2014",
      pumpSerial: "01236",
      sellCodeHeader: "01236ATC",
    },
  ];

  // Load dữ liệu từ localStorage hoặc sử dụng dữ liệu mẫu
  function loadPumpData() {
    const savedData = Storage.get("pumpInfoData");
    allPumpData = savedData || samplePumpData;
    filteredPumpData = [...allPumpData];
    renderPumpList();
  }

  // Render danh sách thông tin vòi bơm
  function renderPumpList() {
    if (filteredPumpData.length === 0) {
      pumpList.innerHTML = `
        <div class="empty-state">
          <svg class="empty-state-icon" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" stroke-width="1.5"/>
            <polyline points="3.27,6.96 12,12.01 20.73,6.96" stroke="currentColor" stroke-width="1.5"/>
            <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <div class="empty-state-title">Không tìm thấy vòi bơm</div>
          <div class="empty-state-description">Thử tìm kiếm với từ khóa khác</div>
        </div>
      `;
      return;
    }

    pumpList.innerHTML = filteredPumpData
      .map(
        (pump) =>
          `
          <div class="pump-card" data-id="${pump.id}">
            
            <div class="pump-info-row">
              <div class="pump-info-label">
                <span class="pump-label-eng">Pump ID</span>
                <span class="pump-label-vn">(ID vòi bơm):</span>
              </div>
              <div class="pump-info-value pump-id">${pump.pumpId}</div>
            </div>
             
            <div class="pump-info-row">
              <div class="pump-info-label">
                <span class="pump-label-eng">Fuel type</span>
                <span class="pump-label-vn">(Loại nhiên liệu):</span>
              </div>
              <div class="pump-info-value fuel-type">${pump.fuelType}</div>
            </div>

            <div class="pump-info-row">
              <div class="pump-info-label">
                <span class="pump-label-eng">Pump type</span>
                <span class="pump-label-vn">(Loại trụ bơm):</span>
              </div>
              <div class="pump-info-value pump-type">${pump.pumpType}</div>
            </div>

            <div class="pump-info-row">
              <div class="pump-info-label">
                <span class="pump-label-eng">Pump sign</span>
                <span class="pump-label-vn">(Ký hiệu trụ bơm):</span>
              </div>
              <div class="pump-info-value">${pump.pumpSign}</div>
            </div>

            <div class="pump-info-row">
              <div class="pump-info-label">
                <span class="pump-label-eng">Pump serial</span>
                <span class="pump-label-vn">(Số serial trụ bơm):</span>
              </div>
              <div class="pump-info-value serial">${pump.pumpSerial}</div>
            </div>

            <div class="pump-info-row">
              <div class="pump-info-label">
                <span class="pump-label-eng">Sell code header</span>
                <span class="pump-label-vn">(Mã bán hàng):</span>
              </div>
              <div class="pump-info-value sell-code">${pump.sellCodeHeader}</div>
            </div>

          </div>
        `
      )
      .join("");
  }

  // Tìm kiếm vòi bơm
  function searchPumps(searchTerm) {
    if (!searchTerm.trim()) {
      filteredPumpData = [...allPumpData];
    } else {
      const term = searchTerm.toLowerCase().trim();
      filteredPumpData = allPumpData.filter(
        (pump) =>
          pump.pumpId.toLowerCase().includes(term) ||
          pump.fuelType.toLowerCase().includes(term) ||
          pump.pumpType.toLowerCase().includes(term) ||
          pump.pumpSign.toLowerCase().includes(term) ||
          pump.pumpSerial.toLowerCase().includes(term) ||
          pump.sellCodeHeader.toLowerCase().includes(term)
      );
    }
    renderPumpList();
  }

  // Debounced search function
  const debouncedSearch = debounce(searchPumps, 300);

  // Event Listeners
  searchInput.addEventListener("input", function (e) {
    const searchTerm = e.target.value;
    debouncedSearch(searchTerm);
  });

  // Xử lý Enter key trong search
  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const searchTerm = e.target.value;
      searchPumps(searchTerm);
    }
  });

  // Xử lý Escape key để clear search
  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      e.target.value = "";
      searchPumps("");
      e.target.blur();
    }
  });

  // Kiểm tra đăng nhập
  const user = Storage.get("user");
  if (!user) {
    showToast("Vui lòng đăng nhập", "warning");
    setTimeout(() => {
      Navigation.goTo("../login/index.html");
    }, 1500);
    return;
  }

  // Khởi tạo
  loadPumpData();

  // Expose functions globally if needed
  window.searchPumps = searchPumps;
  window.loadPumpData = loadPumpData;
});
