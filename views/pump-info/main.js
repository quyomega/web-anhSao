document.addEventListener("DOMContentLoaded", function () {
  const pumpList = document.getElementById("pumpList");
  const searchInput = document.getElementById("searchInput");

  let allPumpData = [];
  let filteredPumpData = [];

  const mockApiData = {
    items: [
      {
        pump_id: "A",
        fuel_type: "RON 95-III",
        pump_type: "ATMC",
        pump_sign: "PDM221-2014",
        pump_serial: "01234",
        sell_code_header: "01234ATC",
      },
      {
        pump_id: "B",
        fuel_type: "RON 92-II",
        pump_type: "ATMC",
        pump_sign: "PDM221-2014",
        pump_serial: "01234",
        sell_code_header: "01234ATC",
      },
      {
        pump_id: "C",
        fuel_type: "Dầu DO",
        pump_type: "ATMC",
        pump_sign: "PDM221-2014",
        pump_serial: "01234",
        sell_code_header: "01234ATC",
      },
      {
        pump_id: "D",
        fuel_type: "Xăng E5",
        pump_type: "ATMC",
        pump_sign: "PDM221-2014",
        pump_serial: "01235",
        sell_code_header: "01235ATC",
      },
      {
        pump_id: "E",
        fuel_type: "Xăng E10",
        pump_type: "ATMC",
        pump_sign: "PDM221-2014",
        pump_serial: "01236",
        sell_code_header: "01236ATC",
      },
    ],
  };

  function processApiData(data) {
    if (data && data.items && Array.isArray(data.items)) {
      allPumpData = data.items.map((item, index) => ({
        id: index + 1,
        pumpId: item.pump_id,
        fuelType: item.fuel_type,
        pumpType: item.pump_type,
        pumpSign: item.pump_sign,
        pumpSerial: item.pump_serial,
        sellCodeHeader: item.sell_code_header,
      }));
    } else {
      allPumpData = [];
    }
    filteredPumpData = [...allPumpData];
    renderPumpList();
  }

  function loadPumpData() {
    pumpList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-title">Đang tải dữ liệu...</div>
      </div>
    `;

    fetch("/api/pump-info")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể tải thông tin vòi bơm");
        }
        return response.json();
      })
      .then((data) => {
        processApiData(data);
      })
      .catch((error) => {
        processApiData(mockApiData);
      });
  }

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

  const debouncedSearch = debounce(searchPumps, 300);

  searchInput.addEventListener("input", function (e) {
    const searchTerm = e.target.value;
    debouncedSearch(searchTerm);
  });

  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const searchTerm = e.target.value;
      searchPumps(searchTerm);
    }
  });

  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      e.target.value = "";
      searchPumps("");
      e.target.blur();
    }
  });

  const user = Storage.get("user");
  if (!user) {
    showToast("Vui lòng đăng nhập", "warning");
    setTimeout(() => {
      Navigation.goTo("../login/index.html");
    }, 1500);
    return;
  }

  loadPumpData();

  window.searchPumps = searchPumps;
  window.loadPumpData = loadPumpData;
});
