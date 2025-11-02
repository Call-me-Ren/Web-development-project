// js/admin.js

/* --- CẤU HÌNH KEYS --- */
const CATEGORY_KEY = 'watchtime_categories';
const PRODUCTS_KEY = 'watchtime_products';
const ORDERS_KEY = 'allOrders';
const IMPORTS_KEY = 'watchtime_imports';
const INVENTORY_KEY = 'watchtime_inventory';
const PROFIT_MARGIN_KEY = 'watchtime_profit_margin'; // Key % lợi nhuận

/* --- HÀM CHUNG --- */
function checkAdminLogin() {
    const isAdminLoggedIn = sessionStorage.getItem("isAdminLoggedIn");
    if (isAdminLoggedIn !== "true") {
        alert("Bạn phải đăng nhập với tư cách Admin để truy cập trang này!");
        window.location.href = "admin_login.html";
    }
}
function attachLogoutEvent() {
    const logoutBtn = document.getElementById("admin-logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("Bạn có chắc muốn đăng xuất?")) {
                sessionStorage.removeItem("isAdminLoggedIn");
                window.location.href = "admin_login.html";
            }
        });
    }
}
function formatVND(n) { return Number(n).toLocaleString('vi-VN') + '₫'; }
function formatDate(isoString) {
    if (!isoString) return 'Không rõ';
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/* --- HÀM HELPER ĐỌC/GHI LOCALSTORAGE --- */
function getFromStorage(key, defaultValue = []) {
    try {
        const data = localStorage.getItem(key);
        if (data === null) {
            // Khởi tạo dữ liệu mặc định nếu chưa có
            if (key === CATEGORY_KEY) {
                const defaultCategories = [{ id: 'nam', name: 'Đồng hồ Nam' }, { id: 'nu', name: 'Đồng hồ Nữ' }, { id: 'doi', name: 'Đồng hồ Đôi' }];
                saveToStorage(key, defaultCategories); return defaultCategories;
            }
            if (key === PRODUCTS_KEY) {
                // DỮ LIỆU MẪU ĐÃ ĐƯỢC RÚT GỌN CÒN 5 SẢN PHẨM
                const defaultProducts = [
                    { 
                      id: "sp_ben10", 
                      name: "BEN 10 OMNITRIX", 
                      price: 999999999, 
                      image: "../images/ben10.webp", 
                      category: "nam", 
                      description_short: "Chỉ dành cho người được chọn...", 
                      description_long: "Chỉ dành cho người được chọn hoặc người có đủ tiền mua."
                    },
                    { 
                      id: "sp_conan", 
                      name: "Đồng hồ Conan", 
                      price: 67000000, 
                      image: "../images/conan.jpg", 
                      category: "nu", 
                      description_short: "Trang bị cơ bản của thám tử.", 
                      description_long: "Trang bị cơ bản của thám tử lừng danh. Có thể bắn kim gây mê."
                    },
                    { 
                      id: "sp_doraemon", 
                      name: "Time stop watch", 
                      price: 8500000, 
                      image: "../images/doraemon.jpg", 
                      category: "nam", 
                      description_short: "Chất lượng Nhật Bản.", 
                      description_long: "Chất lượng Nhật Bản, bền bỉ với thời gian. Bảo bối của Doraemon."
                    },
                    { 
                      id: "sp_oip", 
                      name: "Đồng hồ OIP", 
                      price: 4200000, 
                      image: "../images/oip.webp", 
                      category: "doi", 
                      description_short: "Thiết kế hầm hố.", 
                      description_long: "Thiết kế hầm hố, chống va đập tuyệt đối. Đến từ The Amazing World of Gumball."
                    },
                    { 
                      id: "sp_timecity", 
                      name: "Đồng hồ Time City", 
                      price: 696500000, 
                      image: "../images/time_city.webp", 
                      category: "doi", 
                      description_short: "Chỉ dành cho giới thượng lưu.", 
                      description_long: "Chỉ dành cho giới thượng lưu. Thiết kế đính kim cương toàn bộ."
                    }
                ];
                saveToStorage(key, defaultProducts); return defaultProducts;
            }
             if (key === INVENTORY_KEY) {
                const defaultInventory = {};
                saveToStorage(key, defaultInventory); return defaultInventory;
            }
             if (key === PROFIT_MARGIN_KEY) {
                saveToStorage(key, 50); return 50; // Mặc định 50%
            }
            saveToStorage(key, defaultValue);
            return defaultValue;
        }
        if (key === PROFIT_MARGIN_KEY) return parseFloat(data);
        if (key === INVENTORY_KEY) return JSON.parse(data);
        
        return JSON.parse(data); 
    } catch (e) {
        console.error(`Lỗi khi đọc ${key}:`, e);
        if (key === INVENTORY_KEY) return {};
        if (key === PROFIT_MARGIN_KEY) return 50;
        return defaultValue;
    }
}
function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}


/* ================================================================
  PHẦN 1: QUẢN LÝ KHÁCH HÀNG
================================================================
*/
function loadUserTable() {
    const tableBody = document.getElementById("user-table-body");
    if (!tableBody) return; 
    tableBody.innerHTML = ""; 
    let users = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.includes('@') && key !== 'currentUser' && localStorage.getItem(key).includes('password')) {
            try {
                const user = JSON.parse(localStorage.getItem(key));
                user.email = key; 
                users.push(user);
            } catch (e) { console.warn(`Không thể parse user data cho key: ${key}`); }
        }
    }
    if (users.length === 0) { tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Không tìm thấy khách hàng nào.</td></tr>'; return; }
    users.forEach(user => {
        const tr = document.createElement("tr");
        const isLocked = user.isLocked || false;
        tr.innerHTML = `<td>${user.email}</td><td>${user.firstname || ''} ${user.lastname || ''}</td><td>${user.number || 'Chưa có'}</td><td>${user.address || 'Chưa có'}</td><td style="color: ${isLocked ? 'red' : 'green'}; font-weight: bold;">${isLocked ? 'Đã khóa' : 'Hoạt động'}</td><td><button class="btn-action btn-reset" data-email="${user.email}">Reset MK</button><button class="btn-action btn-toggle-lock" data-email="${user.email}">${isLocked ? 'Mở khóa' : 'Khóa'}</button></td>`;
        tableBody.appendChild(tr);
    });
    attachTableActions();
}
function attachTableActions() {
    document.querySelectorAll(".btn-reset").forEach(btn => {
        btn.addEventListener("click", () => {
            const email = btn.dataset.email;
            if (confirm(`Bạn có chắc muốn reset mật khẩu cho ${email}?\nMật khẩu mới sẽ là '123456'.`)) {
                resetUserPassword(email, '123456');
            }
        });
    });
    document.querySelectorAll(".btn-toggle-lock").forEach(btn => {
        btn.addEventListener("click", () => {
            const email = btn.dataset.email;
            const action = btn.textContent.trim();
            if (confirm(`Bạn có chắc muốn ${action} tài khoản ${email}?`)) {
                toggleUserLock(email);
            }
        });
    });
}
function resetUserPassword(email, newPassword) {
    try {
        const userData = JSON.parse(localStorage.getItem(email));
        if (userData) { userData.password = newPassword; localStorage.setItem(email, JSON.stringify(userData)); alert(`Đã reset mật khẩu cho ${email} thành '123456'.`); }
    } catch (e) { alert("Có lỗi xảy ra khi reset mật khẩu."); }
}
function toggleUserLock(email) {
     try {
        const userData = JSON.parse(localStorage.getItem(email));
        if (userData) { userData.isLocked = !userData.isLocked; localStorage.setItem(email, JSON.stringify(userData)); alert(`Đã ${userData.isLocked ? 'khóa' : 'mở khóa'} tài khoản ${email}.`); loadUserTable(); }
    } catch (e) { alert("Có lỗi xảyá."); }
}


/* ================================================================
  PHẦN 2: QUẢN LÝ LOẠI SẢN PHẨM
================================================================
*/
function getCategories() { return getFromStorage(CATEGORY_KEY); }
function saveCategories(categories) { saveToStorage(CATEGORY_KEY, categories); }
function loadCategoryTable() {
    const tableBody = document.getElementById("category-table-body");
    if (!tableBody) return; 
    const categories = getCategories();
    tableBody.innerHTML = ""; 
    categories.forEach(cat => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${cat.id}</td><td>${cat.name}</td><td><button class="btn-action btn-edit" data-id="${cat.id}" data-name="${cat.name}">Sửa</button><button class="btn-action btn-delete" data-id="${cat.id}">Xóa</button></td>`;
        tableBody.appendChild(tr);
    });
    attachCategoryActionButtons();
}
function attachCategoryActionButtons() {
    document.querySelectorAll("#category-table-body .btn-edit").forEach(btn => {
        btn.addEventListener("click", () => {
            document.getElementById("form-title").textContent = "Sửa loại sản phẩm";
            document.getElementById("category-id").value = btn.dataset.id; 
            document.getElementById("category-name").value = btn.dataset.name;
            document.getElementById("category-key").value = btn.dataset.id;
            document.getElementById("category-key").readOnly = true; 
            document.getElementById("btn-cancel-edit").classList.remove("hidden");
            window.scrollTo(0, 0); 
        });
    });
    document.querySelectorAll("#category-table-body .btn-delete").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            if (confirm(`Bạn có chắc muốn xóa loại sản phẩm '${id}'?`)) { deleteCategory(id); }
        });
    });
}
function attachCategoryFormEvents() {
    const form = document.getElementById("category-form");
    if (!form) return;
    document.getElementById("btn-cancel-edit").addEventListener("click", () => { resetCategoryForm(); });
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("category-name").value.trim();
        const key = document.getElementById("category-key").value.trim();
        const editingId = document.getElementById("category-id").value; 
        if (!name || !key) { alert("Vui lòng nhập đầy đủ Tên và Key!"); return; }
        if (editingId) { updateCategory(key, name); } 
        else { addCategory(key, name); }
    });
}
function resetCategoryForm() {
    document.getElementById("form-title").textContent = "Thêm loại sản phẩm mới";
    document.getElementById("category-id").value = ""; 
    document.getElementById("category-name").value = "";
    document.getElementById("category-key").value = "";
    document.getElementById("category-key").readOnly = false; 
    document.getElementById("btn-cancel-edit").classList.add("hidden");
}
function addCategory(id, name) {
    let categories = getCategories();
    const exists = categories.some(cat => cat.id === id);
    if (exists) { alert("Lỗi: Key (ID) này đã tồn tại."); return; }
    categories.push({ id, name });
    saveCategories(categories);
    alert("Thêm loại sản phẩm thành công!");
    loadCategoryTable(); 
    resetCategoryForm(); 
}
function updateCategory(id, newName) {
    let categories = getCategories();
    const index = categories.findIndex(cat => cat.id === id);
    if (index === -1) { alert("Lỗi: Không tìm thấy loại sản phẩm."); return; }
    categories[index].name = newName;
    saveCategories(categories);
    alert("Cập nhật thành công!");
    loadCategoryTable(); 
    resetCategoryForm(); 
}
function deleteCategory(id) {
    let categories = getCategories();
    const newCategories = categories.filter(cat => cat.id !== id);
    if (categories.length === newCategories.length) { alert("Lỗi: Không tìm thấy loại SP."); return; }
    saveCategories(newCategories);
    alert("Xóa thành công!");
    loadCategoryTable(); 
}


/* ================================================================
  PHẦN 3: QUẢN LÝ SẢN PHẨM
================================================================
*/
function getProducts() { return getFromStorage(PRODUCTS_KEY); }
function saveProducts(products) { saveToStorage(PRODUCTS_KEY, products); }
function loadCategoriesIntoSelect() {
    const select = document.getElementById("product-category");
    if (!select) return;
    const categories = getCategories();
    select.innerHTML = '<option value="">-- Chọn loại --</option>'; 
    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id; 
        option.textContent = cat.name; 
        select.appendChild(option);
    });
}
function loadProductTable() {
    const tableBody = document.getElementById("product-table-body");
    if (!tableBody) return;
    const products = getProducts();
    const categories = getCategories(); 
    tableBody.innerHTML = "";
    if (products.length === 0) { tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Chưa có sản phẩm nào.</td></tr>'; return; }
    products.forEach(prod => {
        const category = categories.find(c => c.id === prod.category);
        const categoryName = category ? category.name : 'Không rõ';
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${prod.id}</td><td><img src="${prod.image}" alt="${prod.name}"></td><td>${prod.name}</td><td>${categoryName}</td><td>${formatVND(prod.price)}</td><td><button class="btn-action btn-edit" data-id="${prod.id}">Sửa</button><button class="btn-action btn-delete" data-id="${prod.id}">Xóa</button></td>`;
        tableBody.appendChild(tr);
    });
    attachProductActionButtons();
}
function attachProductActionButtons() {
    document.querySelectorAll("#product-table-body .btn-edit").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            const products = getProducts();
            const product = products.find(p => p.id === id);
            if (!product) return;
            document.getElementById("product-form-title").textContent = "Sửa sản phẩm";
            document.getElementById("product-id").value = product.id;
            document.getElementById("product-id").readOnly = true; 
            document.getElementById("product-name").value = product.name;
            document.getElementById("product-category").value = product.category;
            document.getElementById("product-price").value = product.price;
            document.getElementById("product-image").value = product.image;
            document.getElementById("product-desc-short").value = product.description_short || '';
            document.getElementById("product-desc-long").value = product.description_long || '';
            document.getElementById("btn-cancel-product-edit").classList.remove("hidden");
            window.scrollTo(0, 0); 
        });
    });
    document.querySelectorAll("#product-table-body .btn-delete").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            if (confirm(`Bạn có chắc muốn xóa sản phẩm có mã '${id}'?`)) { deleteProduct(id); }
        });
    });
}
function attachProductFormEvents() {
    const form = document.getElementById("product-form");
    if (!form) return;
    document.getElementById("btn-cancel-product-edit").addEventListener("click", () => { resetProductForm(); });
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("product-id").value.trim();
        const isEditing = document.getElementById("product-id").readOnly;
        const product = { id: id, name: document.getElementById("product-name").value.trim(), category: document.getElementById("product-category").value, price: parseFloat(document.getElementById("product-price").value), image: document.getElementById("product-image").value.trim(), description_short: document.getElementById("product-desc-short").value.trim(), description_long: document.getElementById("product-desc-long").value.trim(), };
        if (!product.id || !product.name || !product.category || !product.price || !product.image) { alert("Vui lòng nhập đầy đủ các trường!"); return; }
        saveProduct(product, isEditing);
    });
}
function resetProductForm() {
    document.getElementById("product-form-title").textContent = "Thêm sản phẩm mới";
    document.getElementById("product-id").value = "";
    document.getElementById("product-id").readOnly = false;
    document.getElementById("product-name").value = "";
    document.getElementById("product-category").value = "";
    document.getElementById("product-price").value = "";
    document.getElementById("product-image").value = "";
    document.getElementById("product-desc-short").value = "";
    document.getElementById("product-desc-long").value = "";
    document.getElementById("btn-cancel-product-edit").classList.add("hidden");
}
function saveProduct(product, isEditing) {
    let products = getProducts();
    if (isEditing) {
        const index = products.findIndex(p => p.id === product.id);
        if (index === -1) { alert("Lỗi: Không tìm thấy sản phẩm."); return; }
        products[index] = product; 
        alert("Cập nhật sản phẩm thành công!");
    } else {
        const exists = products.some(p => p.id === product.id);
        if (exists) { alert("Lỗi: Mã sản phẩm (ID) này đã tồn tại."); return; }
        products.push(product); 
        alert("Thêm sản phẩm mới thành công!");
    }
    saveProducts(products); 
    loadProductTable(); 
    resetProductForm(); 
}
function deleteProduct(id) {
    let products = getProducts();
    const newProducts = products.filter(p => p.id !== id);
    if (products.length === newProducts.length) { alert("Lỗi: Không tìm thấy sản phẩm."); return; }
    saveProducts(newProducts);
    alert("Xóa sản phẩm thành công!");
    loadProductTable(); 
}


/* ================================================================
  PHẦN 4: QUẢN LÝ ĐƠN HÀNG
================================================================
*/
function getAllOrders() { return getFromStorage(ORDERS_KEY); }
function saveAllOrders(orders) { saveToStorage(ORDERS_KEY, orders); }
function loadOrderTable(filterDateStart = '', filterDateEnd = '', filterStatus = '') {
    const tableBody = document.getElementById("order-table-body");
    if (!tableBody) return;
    let orders = getAllOrders();
    orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    if (filterStatus) { orders = orders.filter(o => o.status === filterStatus); }
    if (filterDateStart) { const startDate = new Date(filterDateStart); startDate.setHours(0, 0, 0, 0); orders = orders.filter(o => new Date(o.orderDate) >= startDate); }
    if (filterDateEnd) { const endDate = new Date(filterDateEnd); endDate.setHours(23, 59, 59, 999); orders = orders.filter(o => new Date(o.orderDate) <= endDate); }
    tableBody.innerHTML = "";
    if (orders.length === 0) { tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Không tìm thấy đơn hàng nào khớp.</td></tr>'; return; }
    orders.forEach(order => {
        const tr = document.createElement("tr");
        const itemsHtml = order.items.map(item => `<li>${item.name} (SL: ${item.qty}) - ${formatVND(item.price * item.qty)}</li>`).join('');
        const statusOptions = ['Mới đặt (COD)', 'Đã thanh toán (Chờ xử lý)', 'Đã xử lý', 'Đã giao', 'Hủy'];
        const statusHtml = `<select class="order-status-select" data-order-id="${order.id}">${statusOptions.map(status => `<option value="${status}" ${order.status === status ? 'selected' : ''}>${status}</option>`).join('')}</select>`;
        tr.innerHTML = `<td>${order.id}</td><td>${formatDate(order.orderDate)}</td><td>${order.customer.name}<div class="details">${order.customer.phone}<br>${order.userEmail}</div></td><td><div class="details"><ul>${itemsHtml}</ul></div></td><td style="font-weight: bold; color: #c026d3;">${formatVND(order.total)}</td><td>${statusHtml}</td>`;
        tableBody.appendChild(tr);
    });
    attachStatusChangeEvents();
}
function attachOrderFilterEvents() {
    const filterBtn = document.getElementById("filter-btn");
    if (filterBtn) {
        filterBtn.addEventListener("click", () => {
            const dateStart = document.getElementById("filter-date-start").value;
            const dateEnd = document.getElementById("filter-date-end").value;
            const status = document.getElementById("filter-status").value;
            loadOrderTable(dateStart, dateEnd, status);
        });
    }
}
function attachStatusChangeEvents() {
    document.querySelectorAll(".order-status-select").forEach(select => {
        select.addEventListener("change", (e) => {
            const orderId = e.target.dataset.orderId;
            const newStatus = e.target.value;
            if (confirm(`Bạn có chắc muốn cập nhật trạng thái đơn hàng ${orderId} thành "${newStatus}"?`)) {
                updateOrderStatus(orderId, newStatus);
            } else {
                attachOrderFilterEvents();
                document.getElementById("filter-btn").click();
            }
        });
    });
}
function updateOrderStatus(orderId, newStatus) {
    let orders = getAllOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) { alert("Lỗi: Không tìm thấy đơn hàng!"); return; }
    const oldStatus = orders[index].status;
    orders[index].status = newStatus;
    saveAllOrders(orders);
    alert("Cập nhật trạng thái thành công!");
    if (newStatus === 'Đã giao' && oldStatus !== 'Đã giao') {
        updateInventoryOnOrderCompletion(orders[index]);
    }
}


/* ================================================================
  PHẦN 5: QUẢN LÝ NHẬP HÀNG & TỒN KHO (I.5 & I.8)
================================================================
*/
let currentImportItems = []; // Biến tạm
function getImports() { return getFromStorage(IMPORTS_KEY); }
function saveImports(imports) { saveToStorage(IMPORTS_KEY, imports); }
function getInventory() { return getFromStorage(INVENTORY_KEY, {}); }
function saveInventory(inventory) { saveToStorage(INVENTORY_KEY, inventory); }
function loadProductsIntoSelect(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    const products = getProducts();
    select.innerHTML = '<option value="">-- Chọn sản phẩm --</option>';
    products.forEach(prod => {
        const option = document.createElement("option");
        option.value = prod.id;
        option.textContent = `${prod.name} (${prod.id})`;
        select.appendChild(option);
    });
}
function loadImportTable() {
    const tableBody = document.getElementById("import-table-body");
    if (!tableBody) return;
    let imports = getImports();
    imports.sort((a, b) => new Date(b.date) - new Date(a.date));
    tableBody.innerHTML = "";
    if (imports.length === 0) { tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Chưa có phiếu nhập nào.</td></tr>'; return; }
    imports.forEach(imp => {
        const tr = document.createElement("tr");
        const itemsHtml = imp.items.map(item => `<li>${item.productName} (Mã: ${item.productId}) - SL: ${item.qty} - Giá nhập: ${formatVND(item.costPrice)}</li>`).join('');
        const isCompleted = imp.status === 'Đã hoàn thành';
        tr.innerHTML = `<td>${imp.id}</td><td>${formatDate(imp.date)}</td><td><div class="details"><ul>${itemsHtml}</ul></div></td><td style="font-weight: bold; color: ${isCompleted ? 'green' : 'blue'}">${imp.status}</td><td><button class="btn-action btn-complete" data-id="${imp.id}" ${isCompleted ? 'disabled' : ''}>${isCompleted ? 'Đã hoàn thành' : 'Hoàn thành'}</button></td>`;
        tableBody.appendChild(tr);
    });
    attachImportActionButtons();
}
function attachImportActionButtons() {
    document.querySelectorAll("#import-table-body .btn-complete").forEach(btn => {
        btn.addEventListener("click", () => {
            if (btn.disabled) return;
            const id = btn.dataset.id;
            if (confirm(`Bạn có chắc muốn "Hoàn thành" phiếu nhập ${id}?\nThao tác này sẽ cập nhật Tồn kho và Giá vốn.`)) {
                completeImport(id);
            }
        });
    });
}
function attachImportFormEvents() {
    const form = document.getElementById("import-form");
    if (!form) return;
    const addBtn = document.getElementById("btn-add-item");
    addBtn.addEventListener("click", () => {
        const productSelect = document.getElementById("import-product");
        const productId = productSelect.value;
        const productName = productSelect.options[productSelect.selectedIndex].text;
        const qty = parseInt(document.getElementById("import-qty").value);
        const costPrice = parseFloat(document.getElementById("import-cost-price").value);
        if (!productId || !qty || !costPrice) { alert("Vui lòng chọn sản phẩm, nhập số lượng và giá nhập!"); return; }
        if (qty <= 0 || costPrice <= 0) { alert("Số lượng và giá nhập phải lớn hơn 0!"); return; }
        currentImportItems.push({ productId, productName, qty, costPrice });
        renderImportItemsList();
        productSelect.value = "";
        document.getElementById("import-qty").value = 1;
        document.getElementById("import-cost-price").value = "";
    });
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (currentImportItems.length === 0) { alert("Bạn phải thêm ít nhất 1 sản phẩm vào phiếu nhập!"); return; }
        let imports = getImports();
        const newImport = { id: 'PN' + Date.now(), date: new Date().toISOString(), items: currentImportItems, status: 'Mới tạo' };
        imports.push(newImport);
        saveImports(imports);
        alert(`Tạo phiếu nhập ${newImport.id} thành công!`);
        currentImportItems = [];
        renderImportItemsList();
        loadImportTable();
    });
}
function renderImportItemsList() {
    const itemList = document.getElementById("import-items-list");
    if (!itemList) return;
    itemList.innerHTML = "";
    currentImportItems.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${item.productName} (SL: ${item.qty}, Giá: ${formatVND(item.costPrice)})</span><button data-index="${index}">Xóa</button>`;
        li.querySelector('button').addEventListener('click', () => {
            currentImportItems.splice(index, 1); 
            renderImportItemsList();
        });
        itemList.appendChild(li);
    });
}
function completeImport(importId) {
    let imports = getImports();
    const index = imports.findIndex(imp => imp.id === importId);
    if (index === -1) { alert("Lỗi: Không tìm thấy phiếu nhập!"); return; }
    const imp = imports[index];
    if (imp.status === 'Đã hoàn thành') return;
    let inventory = getInventory();
    imp.items.forEach(item => {
        const id = item.productId;
        if (!inventory[id]) { inventory[id] = { nhap: 0, xuat: 0, giaVon: 0 }; }
        inventory[id].nhap += item.qty;
        inventory[id].giaVon = item.costPrice; // Cập nhật giá vốn mới nhất
    });
    imp.status = 'Đã hoàn thành';
    saveInventory(inventory);
    saveImports(imports);
    alert(`Đã hoàn thành phiếu nhập ${importId}. Tồn kho và giá vốn đã được cập nhật.`);
    loadImportTable();
}
function updateInventoryOnOrderCompletion(order) {
    let inventory = getInventory();
    let updated = false;
    order.items.forEach(item => {
        // ID sản phẩm trong giỏ hàng chính là ID sản phẩm
        const id = item.id; 
        if (!inventory[id]) { inventory[id] = { nhap: 0, xuat: 0, giaVon: 0 }; }
        inventory[id].xuat += item.qty;
        updated = true;
    });
    if (updated) { saveInventory(inventory); console.log(`Đã cập nhật kho cho đơn ${order.id}.`); }
}
/**
 * Tải bảng Tồn Kho (I.8)
 */
function loadInventoryTable() {
    const tableBody = document.getElementById("inventory-table-body");
    if (!tableBody) return;
    
    const products = getProducts();
    const inventory = getInventory();
    tableBody.innerHTML = "";
    
    products.forEach(prod => {
        const id = prod.id;
        const inv = inventory[id] || { nhap: 0, xuat: 0 }; 
        const ton = inv.nhap - inv.xuat;
        
        let status = '<span class="text-success">Còn hàng</span>';
        if (ton <= 0) { status = '<span class="text-danger">Hết hàng</span>'; }
        else if (ton <= 5) { status = '<span class="text-warning">Sắp hết</span>'; }

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <div class="product-info">
                    <img src="${prod.image}" alt="${prod.name}">
                    <div>
                        <strong>${prod.name}</strong>
                        <div class="details" style="font-size: 0.8rem; color: #64748b;">${prod.id}</div>
                    </div>
                </div>
            </td>
            <td style="font-weight: 500; color: #16a34a;">${inv.nhap}</td>
            <td style="font-weight: 500; color: #ef4444;">${inv.xuat}</td>
            <td style="font-weight: bold; font-size: 1.1rem;">${ton}</td>
            <td>${status}</td>
        `;
        tableBody.appendChild(tr);
    });
}

/* ================================================================
  PHẦN 7: QUẢN LÝ GIÁ BÁN (I.6)
================================================================
*/
function getProfitMargin() { return getFromStorage(PROFIT_MARGIN_KEY, 50); }
function saveProfitMargin(margin) { saveToStorage(PROFIT_MARGIN_KEY, margin); }
/**
 * Tải bảng Giá vốn - Giá bán
 */
function loadPriceTable() {
    const tableBody = document.getElementById("price-table-body");
    if (!tableBody) return;

    const products = getProducts();
    const inventory = getInventory();
    const profitMargin = getProfitMargin() / 100; // 50 -> 0.5
    
    tableBody.innerHTML = "";

    products.forEach(prod => {
        const id = prod.id;
        const inv = inventory[id] || { giaVon: 0 };
        const giaVon = inv.giaVon;
        const giaBanDeXuat = giaVon * (1 + profitMargin);
        
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <strong>${prod.name}</strong>
                <div class="details" style="font-size: 0.8rem; color: #64748b;">${prod.id}</div>
            </td>
            <td class="text-cost">${formatVND(giaVon)}</td>
            <td class="text-profit">${profitMargin * 100}%</td>
            <td class="text-final-price">${formatVND(giaBanDeXuat)}</td>
            <td class="text-final-price">${formatVND(prod.price)}</td>
        `;
        tableBody.appendChild(tr);
    });
}
/**
 * Gắn sự kiện cho form % lợi nhuận
 */
function loadAndAttachProfitForm() {
    const form = document.getElementById("profit-form");
    if (!form) return;
    
    const input = document.getElementById("profit-margin");
    input.value = getProfitMargin(); // Hiển thị % đã lưu

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const newMargin = parseFloat(input.value);
        if (isNaN(newMargin) || newMargin < 0) {
            alert("Vui lòng nhập một số dương!");
            return;
        }
        
        saveProfitMargin(newMargin);
        alert("Đã lưu tỉ lệ lợi nhuận mới!");
        loadPriceTable(); // Tải lại bảng với % mới
    });
}