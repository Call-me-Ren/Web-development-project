/* Admin interactions: sidebar toggle, submenu, dynamic content rendering, image preview */

(() => {
  // Elements
  const menu = document.querySelector(".menu");
  const mainContent = document.getElementById("mainContent");
  const pageTitle = document.getElementById("pageTitle");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const app = document.querySelector(".app");

  // Simple templates for main content (strings)
  const templates = {
    dashboard: `
      <div class="card-grid">
        <div class="card">
          <h3>Thống kê nhanh</h3>
          <p class="small">Doanh thu, đơn hàng, khách hàng — demo data.</p>
        </div>
        <div class="card">
          <h3>Hoạt động gần đây</h3>
          <p class="small">Không có hoạt động mới.</p>
        </div>
      </div>
    `,
    "orders-list": `
      <div>
        <h3 class="small right">Bộ lọc</h3>
        <div style="margin:12px 0;">
          <form class="flex" onsubmit="return false;">
            <input type="date" name="start" />
            <input type="date" name="end" />
            <select name="status">
              <option value="">--Trạng thái--</option>
              <option value="new">Mới</option>
              <option value="processed">Đã xử lý</option>
            </select>
            <button class="main-btn">Tra cứu</button>
          </form>
        </div>

        <div class="card" style="overflow:auto;">
          <table class="table" style="min-width:900px">
            <thead><tr><th>ID</th><th>Khách</th><th>SDT</th><th>Địa chỉ</th><th>Ghi chú</th><th>Ngày</th><th>Trạng thái</th><th>Tùy chỉnh</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>Nguyễn Văn A</td><td>0123456789</td><td>HCM</td><td>Giao nhanh</td><td>2025-10-31</td><td>Mới</td><td><a href="#" class="small">Chi tiết</a> | <a href="#" class="small">Xóa</a></td></tr>
              <tr><td>2</td><td>Trần Thị B</td><td>0987654321</td><td>HN</td><td>COD</td><td>2025-10-30</td><td>Đã xử lý</td><td><a href="#" class="small">Chi tiết</a> | <a href="#" class="small">Xóa</a></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `,
    "orders-detail": `
      <div>
        <h3>Chi tiết đơn hàng</h3>
        <div class="card">
          <table class="table">
            <thead><tr><th>ID</th><th>Ảnh</th><th>Sản phẩm</th><th>Giá</th><th>Số lượng</th><th>Thành tiền</th></tr></thead>
            <tbody>
              <tr><td>1</td><td><img src="image.avif" alt="" style="width:70px" /></td><td>Đồng hồ Casio</td><td>120.000</td><td>2</td><td>240.000</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `,
    "product-list": `
      <div>
        <h3>Danh sách sản phẩm</h3>
        <div class="card" style="overflow:auto">
          <table class="table">
            <thead><tr><th>ID</th><th>Ảnh</th><th>Tên</th><th>Giá</th><th>Giá KM</th><th>Ngày</th><th>Tùy chỉnh</th></tr></thead>
            <tbody>
              <tr><td>1</td><td><img src="image.avif" alt="" style="width:60px" /></td><td>Đồng hồ Casio</td><td>120.000</td><td>60.000</td><td>2025-10-01</td><td><a href="#" class="small">Sửa</a> | <a href="#" class="small">Xóa</a></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `,
    "product-add": `
      <div>
        <h3>Thêm sản phẩm</h3>
        <div class="card" style="display:grid;grid-template-columns:1fr 320px;gap:16px">
          <div>
            <input class="input" placeholder="Tên sản phẩm" />
            <div style="display:flex;gap:12px;margin-top:10px">
              <input class="input" placeholder="Giá bán" />
              <input class="input" placeholder="Giá khuyến mãi" />
            </div>
            <textarea class="input" placeholder="Mô tả" style="height:120px;margin-top:10px"></textarea>
            <div style="margin-top:12px"><button class="main-btn">Lưu sản phẩm</button></div>
          </div>

          <div>
            <label class="small">Ảnh đại diện</label>
            <input id="fileMain" type="file" accept="image/*" style="display:block;margin:8px 0" />

            <div id="previewMain" style="min-height:140px;border:1px dashed #e6eef2;border-radius:8px;padding:8px;display:flex;align-items:center;justify-content:center">Chưa có ảnh</div>

            <label class="small" style="margin-top:12px;display:block">Ảnh chi tiết</label>
            <input id="fileMany" type="file" accept="image/*" multiple style="display:block;margin:8px 0" />
            <div id="previewMany" style="display:flex;gap:8px;flex-wrap:wrap"></div>
          </div>
        </div>
      </div>
    `,
    "product-stock": `
      <div>
        <h3>Quản lý tồn kho</h3>
        <div class="card" style="overflow:auto">
          <table class="table">
            <thead><tr><th>ID</th><th>Sản phẩm</th><th>Nhập</th><th>Xuất</th><th>Tồn</th><th>Trạng thái</th></tr></thead>
            <tbody>
              <tr><td>SP01</td><td>Dầu nhớt</td><td>100</td><td>85</td><td>15</td><td>Cảnh báo</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `,
    "order-list": `
      <div>
        <h3>Phiếu nhập hàng</h3>
        <div class="card">
          <table class="table">
            <thead><tr><th>ID</th><th>Ảnh</th><th>Tên</th><th>Giá nhập</th><th>Số lượng</th><th>Ngày</th></tr></thead>
            <tbody><tr><td>1</td><td><img src="image.avif" style="width:70px" /></td><td>Đồng hồ</td><td>120.000</td><td>3</td><td>2025-10-27</td></tr></tbody>
          </table>
        </div>
      </div>
    `,
    "order-add": `
      <div>
        <h3>Thêm phiếu nhập</h3>
        <div class="card">
          <input class="input" placeholder="Tên sản phẩm" />
          <div style="display:flex;gap:8px;margin-top:10px">
            <input class="input" placeholder="Giá nhập" />
            <input class="input" placeholder="Số lượng" />
          </div>
          <div style="margin-top:12px"><button class="main-btn">Thêm phiếu</button></div>
        </div>
      </div>
    `,
  };

  // initial render
  function render(key, title) {
    const content = templates[key] || templates.dashboard;
    pageTitle.textContent =
      title || (key === "dashboard" ? "Dashboard" : titleFromKey(key));
    mainContent.style.opacity = 0;
    setTimeout(() => {
      mainContent.innerHTML = content;
      mainContent.style.opacity = 1;
      afterRender(key);
    }, 160);
  }

  function titleFromKey(k) {
    return k.replace(/[-_]/g, " ").replace(/\b\w/g, (s) => s.toUpperCase());
  }

  // After rendering, wire up any dynamic widgets (file preview)
  function afterRender(key) {
    // Preview main image
    const fileMain = document.getElementById("fileMain");
    const previewMain = document.getElementById("previewMain");
    if (fileMain && previewMain) {
      fileMain.addEventListener("change", (e) => {
        const f = e.target.files[0];
        if (!f) return (previewMain.innerHTML = "Chưa có ảnh");
        const url = URL.createObjectURL(f);
        previewMain.innerHTML = `<img src="${url}" style="max-width:100%;max-height:130px;border-radius:8px" />`;
      });
    }

    // Preview multiple images
    const fileMany = document.getElementById("fileMany");
    const previewMany = document.getElementById("previewMany");
    if (fileMany && previewMany) {
      fileMany.addEventListener("change", (e) => {
        previewMany.innerHTML = "";
        [...e.target.files].forEach((file) => {
          const url = URL.createObjectURL(file);
          const img = document.createElement("img");
          img.src = url;
          img.style.width = "80px";
          img.style.height = "80px";
          img.style.objectFit = "cover";
          img.style.borderRadius = "6px";
          previewMany.appendChild(img);
        });
        if (e.target.files.length === 0) previewMany.innerHTML = "Chưa có ảnh";
      });
    }
  }

  // Handle menu interactions (toggle submenus + active state)
  menu.addEventListener("click", (e) => {
    const btn = e.target.closest(".menu-btn");
    if (!btn) return;

    const item = btn.closest(".menu-item");
    // Toggle sub
    if (item.classList.contains("has-sub")) {
      const isOpen = item.classList.contains("open");
      // close others
      document
        .querySelectorAll(".menu-item.has-sub")
        .forEach((it) => it.classList.remove("open"));
      if (!isOpen) item.classList.add("open");
      // set active visual
      document
        .querySelectorAll(".menu-item")
        .forEach((it) => it.classList.remove("active"));
      item.classList.add("active");
      return;
    }

    // simple item without sub: set active
    document
      .querySelectorAll(".menu-item")
      .forEach((it) => it.classList.remove("active"));
    item.classList.add("active");
    const key = item.dataset.key || "dashboard";
    render(key, btn.querySelector("span")?.textContent || titleFromKey(key));
  });

  // menu-link clicks (sub items)
  document.addEventListener("click", (e) => {
    const link = e.target.closest(".menu-link");
    if (!link) return;
    e.preventDefault();
    const target = link.dataset.target;
    // remove active from all and set on parent
    document
      .querySelectorAll(".menu-item")
      .forEach((it) => it.classList.remove("active"));
    const parent = link.closest(".menu-item");
    if (parent) parent.classList.add("active");
    // title
    render(target, link.textContent.trim());
  });

  // Sidebar collapse for small screens
  sidebarToggle.addEventListener("click", () => {
    app.classList.toggle("sidebar-collapsed");
    if (app.classList.contains("sidebar-collapsed")) {
      app.style.gridTemplateColumns = "76px 1fr";
    } else {
      app.style.gridTemplateColumns = "";
    }
  });

  // initial page
  render("dashboard", "Dashboard");
})();
