/* --- HÀM MỚI CHO MENU DI ĐỘNG --- */
function attachMobileMenuEvents() {
    const menuBtn = document.getElementById("admin-menu-btn");
    const closeBtn = document.getElementById("admin-close-btn");
    const sidebar = document.querySelector(".admin-sidebar");
    const main = document.querySelector(".admin-main");

    if (menuBtn && closeBtn && sidebar && main) {
        // Mở sidebar
        menuBtn.addEventListener("click", () => {
            sidebar.classList.add("show");
            main.classList.add("dimmed"); // Thêm hiệu ứng mờ cho nội dung
        });

        // Đóng sidebar (bằng nút X)
        closeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            sidebar.classList.remove("show");
            main.classList.remove("dimmed");
        });
    }
}
/* --- KẾT THÚC HÀM MỚI --- */


// js/admin.js

/* --- CẤU HÌNH KEYS --- */
const CATEGORY_KEY = 'watchtime_categories';
const PRODUCTS_KEY = 'watchtime_products';
const ORDERS_KEY = 'allOrders';
const IMPORTS_KEY = 'watchtime_imports';
const INVENTORY_KEY = 'watchtime_inventory';
// const PROFIT_MARGIN_KEY = 'watchtime_profit_margin'; // SẼ KHÔNG DÙNG KEY NÀY NỮA

/* --- HÀM CHUNG --- */
function checkAdminLogin() {
    const isAdminLoggedIn = sessionStorage.getItem("isAdminLoggedIn");
    if (isAdminLoggedIn !== "true") {
        alert("Bạn phải đăng nhập với tư cách Admin để truy cập trang này!");
        window.location.href = "index.html";
    }
}
function attachLogoutEvent() {
    const logoutBtn = document.getElementById("admin-logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("Bạn có chắc muốn đăng xuất?")) {
                sessionStorage.removeItem("isAdminLoggedIn");
                window.location.href = "index.html";
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
                // CẬP NHẬT: Thêm "margin" (lợi nhuận) mặc định cho loại SP
                const defaultCategories = [
                    { id: 'nam', name: 'Đồng hồ Nam', margin: 50 }, 
                    { id: 'nu', name: 'Đồng hồ Nữ', margin: 55 }, 
                    { id: 'doi', name: 'Đồng hồ Đôi', margin: 50 }
                ];
                saveToStorage(key, defaultCategories); return defaultCategories;
            }
            if (key === PRODUCTS_KEY) {
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
             /* BỎ KEY CŨ
             if (key === PROFIT_MARGIN_KEY) {
                saveToStorage(key, 50); return 50; 
            } */
            saveToStorage(key, defaultValue);
            return defaultValue;
        }
        // if (key === PROFIT_MARGIN_KEY) return parseFloat(data); // Bỏ
        if (key === INVENTORY_KEY) return JSON.parse(data);
        
        return JSON.parse(data); 
    } catch (e) {
        console.error(`Lỗi khi đọc ${key}:`, e);
        if (key === INVENTORY_KEY) return {};
        // if (key === PROFIT_MARGIN_KEY) return 50; // Bỏ
        return defaultValue;
    }
}
function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}


/* ================================================================
  PHẦN 1: QUẢN LÝ NGƯỜI DÙNG (THAY CHO QUẢN LÝ KHÁCH HÀNG)
================================================================
*/
// THÊM: Tự động thêm tài khoản quanly1 và các tài khoản mẫu vào danh sách user
(function initializeQuanLyUser() {
    const defaultUsers = [
        // Tài khoản Quản lý (đã yêu cầu trước)
        { key: 'quanly1_user', username: 'quanly1', password: 'abcd1234', firstname: 'Quản', lastname: 'Lý', isLocked: false, number: '0123456789', address: 'Hà Nội' },
        
        // TÀI KHOẢN MẪU MỚI (Khóa/Không khóa)
        { key: 'khachhang1', username: 'khachhang1', password: '123456', firstname: 'Khách', lastname: 'Hàng 1', isLocked: false, number: 'Chưa có', address: 'Chưa có' },
        { key: 'khachhang2', username: 'khachhang2', password: '123456', firstname: 'Khách', lastname: 'Hàng 2 (Khóa)', isLocked: true, number: 'Chưa có', address: 'Chưa có' },
        { key: 'khachhang3', username: 'khachhang3', password: '123456', firstname: 'Khách', lastname: 'Hàng 3', isLocked: true, number: 'Chưa có', address: 'Chưa có' }
    ];

    defaultUsers.forEach(user => {
        if (!localStorage.getItem(user.key)) {
            const userObj = {
                username: user.username,
                password: user.password,
                firstname: user.firstname,
                lastname: user.lastname,
                isLocked: user.isLocked,
                number: user.number,
                address: user.address,
                // Giữ lại email nếu đây là tài khoản được tạo từ form đăng ký email cũ (nếu có)
                email: user.username.includes('@') ? user.username : undefined 
            };
            // Lưu với key chuẩn, trừ tài khoản quanly1_user
            const storageKey = user.key === 'quanly1_user' ? 'quanly1_user' : user.username; 
            localStorage.setItem(storageKey, JSON.stringify(userObj));
            console.log(`Đã thêm tài khoản mẫu: ${user.username}`);
        }
    });

})();

function loadUserTable() {
    const tableBody = document.getElementById("user-table-body");
    if (!tableBody) return; 
    tableBody.innerHTML = ""; 
    let users = [];
    
    // Logic tìm kiếm user: tìm tất cả các key chứa 'password'
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // Lấy tất cả các object có trường 'password' (để lọc user)
        if (localStorage.getItem(key) && localStorage.getItem(key).includes('password')) { 
            try {
                const user = JSON.parse(localStorage.getItem(key));
                if (user.password) {
                    const username = user.username || key; 
                    users.push({ ...user, username: username, storageKey: key, password: user.password });
                }
            } catch (e) { console.warn(`Không thể parse user data cho key: ${key}`); }
        }
    }
    
    // Lọc bỏ tài khoản Admin hard-code (nếu nó được lưu với key 'admin') để tránh trùng lặp hiển thị
    users = users.filter(u => u.storageKey !== 'admin'); 

    if (users.length === 0) { tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Không tìm thấy người dùng nào.</td></tr>'; return; }
    
    users.forEach(user => {
        const tr = document.createElement("tr");
        const isLocked = user.isLocked || false;
        
        // CHỈ TẠO 4 CỘT: Tên tài khoản, Mật khẩu, Trạng thái, Hành động
        tr.innerHTML = `<td>${user.username}</td><td>${user.password}</td><td style="color: ${isLocked ? 'red' : 'green'}; font-weight: bold;">${isLocked ? 'Đã khóa' : 'Hoạt động'}</td><td><button class="btn-action btn-doi-mk" data-key="${user.storageKey}">Khởi tạo Mật khẩu</button><button class="btn-action btn-toggle-lock" data-key="${user.storageKey}">${isLocked ? 'Mở khóa' : 'Khoá'}</button></td>`;
        tableBody.appendChild(tr);
    });
    attachTableActions();
}
function attachTableActions() {
    // SỬA CHỮA: Cập nhật class CSS cho nút Reset
    document.querySelectorAll(".btn-doi-mk").forEach(btn => {
        // Nút Đổi Mật khẩu giờ được xử lý trong HTML (attachResetPasswordModalEvents)
        // Hành động ở đây chỉ là để ngăn lỗi nếu có
    });
    document.querySelectorAll(".btn-toggle-lock").forEach(btn => {
        btn.addEventListener("click", () => {
            const key = btn.dataset.key;
            const action = btn.textContent.trim();
            if (confirm(`Bạn có chắc muốn ${action} tài khoản này?`)) {
                toggleUserLock(key);
            }
        });
    });
}
// Hàm này là hàm được gọi từ logic Modal trong HTML
window.updateUserPassword = function(key, newPassword) {
    try {
        const userData = JSON.parse(localStorage.getItem(key));
        if (userData) { 
            userData.password = newPassword; 
            localStorage.setItem(key, JSON.stringify(userData)); 
            alert(`Đã khởi tạo mật khẩu thành công! Mật khẩu mới là: ${newPassword}`); 
            loadUserTable(); 
        }
    } catch (e) { 
        alert("Có lỗi xảy ra khi khởi tạo mật khẩu."); 
    }
};

function toggleUserLock(key) {
     try {
        const userData = JSON.parse(localStorage.getItem(key));
        if (userData) { userData.isLocked = !userData.isLocked; localStorage.setItem(key, JSON.stringify(userData)); alert(`Đã ${userData.isLocked ? 'khoá' : 'mở khoá'} tài khoản.`); loadUserTable(); }
    } catch (e) { alert("Có lỗi xảy ra."); }
}

/**
 * THAY ĐỔI: Logic cho form Thêm tài khoản (Không dùng email)
 */
function attachAddUserFormEvent() {
    const form = document.getElementById("add-user-form");
    if (!form) return;
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const username = document.getElementById("new-user-email").value.trim();
        const password = document.getElementById("new-user-pass").value.trim();
        
        // Thêm kiểm tra: không được chứa ký tự '@'
        if (username.includes('@')) {
            alert("Tên tài khoản không được chứa ký tự '@'!");
            return;
        }

        // Tạo key mới trong localStorage
        const storageKey = username; 
        
        if (localStorage.getItem(storageKey)) {
            alert(`Tài khoản ${username} đã tồn tại! Vui lòng sử dụng tên khác.`);
            return;
        }
        
        // Tạo đối tượng user mới với thông tin cơ bản
        // Cấu trúc này phải khớp với cấu trúc mà dangnhap.js mong đợi
        const newUser = {
            username: username, // Lưu tên đăng nhập
            password: password,
            firstname: "Người dùng", 
            lastname: "mới",
            number: "Chưa có",
            address: "Chưa có",
            isLocked: false 
        };
        
        // Lưu vào LocalStorage với key là username
        localStorage.setItem(storageKey, JSON.stringify(newUser));
        
        alert(`Đã thêm tài khoản mới thành công!`);
        
        form.reset();
        loadUserTable();
    });
}


/* ================================================================
  PHẦN 2: QUẢN LÝ LOẠI SẢN PHẨM (Cập nhật)
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
    // CẬP NHẬT: Thêm margin mặc định khi tạo
    categories.push({ id, name, margin: 50 });
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
    // (Lợi nhuận 'margin' không bị thay đổi khi sửa tên)
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
  PHẦN 3: QUẢN LÝ SẢN PHẨM (Giữ nguyên)
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
  PHẦN 4: QUẢN LÝ ĐƠN HÀNG (Giữ nguyên)
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
                // Hoàn tác lại lựa chọn
                const orders = getAllOrders();
                const order = orders.find(o => o.id === orderId);
                e.target.value = order.status;
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
  PHẦN 5: QUẢN LÝ NHẬP HÀNG (Đã cập nhật ở P1)
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

/**
 * CẬP NHẬT TỪ P1: Gắn sự kiện cho bộ lọc phiếu nhập
 */
function attachImportFilterEvents() {
    const filterBtn = document.getElementById("filter-btn");
    if (filterBtn) {
        filterBtn.addEventListener("click", () => {
            const dateStart = document.getElementById("filter-date-start").value;
            const dateEnd = document.getElementById("filter-date-end").value;
            const status = document.getElementById("filter-status").value;
            loadImportTable(dateStart, dateEnd, status);
        });
    }
}

/**
 * CẬP NHẬT TỪ P1: Thêm logic lọc, thêm nút "Sửa"
 */
function loadImportTable(filterDateStart = '', filterDateEnd = '', filterStatus = '') {
    const tableBody = document.getElementById("import-table-body");
    if (!tableBody) return;
    
    let imports = getImports();
    imports.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Lọc
    if (filterStatus) { imports = imports.filter(o => o.status === filterStatus); }
    if (filterDateStart) { const startDate = new Date(filterDateStart); startDate.setHours(0, 0, 0, 0); imports = imports.filter(o => new Date(o.date) >= startDate); }
    if (filterDateEnd) { const endDate = new Date(filterDateEnd); endDate.setHours(23, 59, 59, 999); imports = imports.filter(o => new Date(o.date) <= endDate); }

    tableBody.innerHTML = "";
    if (imports.length === 0) { tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Không tìm thấy phiếu nhập nào.</td></tr>'; return; }
    
    imports.forEach(imp => {
        const tr = document.createElement("tr");
        const itemsHtml = imp.items.map(item => `<li>${item.productName} (Mã: ${item.productId}) - SL: ${item.qty} - Giá nhập: ${formatVND(item.costPrice)}</li>`).join('');
        const isCompleted = imp.status === 'Đã hoàn thành';
        
        tr.innerHTML = `
            <td>${imp.id}</td>
            <td>${formatDate(imp.date)}</td>
            <td><div class="details"><ul>${itemsHtml}</ul></div></td>
            <td style="font-weight: bold; color: ${isCompleted ? 'green' : 'blue'}">${imp.status}</td>
            <td>
                <button class="btn-action btn-edit" data-id="${imp.id}" ${isCompleted ? 'disabled' : ''}>Sửa</button>
                <button class="btn-action btn-complete" data-id="${imp.id}" ${isCompleted ? 'disabled' : ''}>${isCompleted ? 'Đã hoàn thành' : 'Hoàn thành'}</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
    
    attachImportActionButtons();
}

/**
 * CẬP NHẬT TỪ P1: Thêm sự kiện cho nút "Sửa"
 */
function attachImportActionButtons() {
    // Nút Hoàn thành
    document.querySelectorAll("#import-table-body .btn-complete").forEach(btn => {
        btn.addEventListener("click", () => {
            if (btn.disabled) return;
            const id = btn.dataset.id;
            if (confirm(`Bạn có chắc muốn "Hoàn thành" phiếu nhập ${id}?\nThao tác này sẽ cập nhật Tồn kho và Giá vốn.`)) {
                completeImport(id);
            }
        });
    });

    // Nút Sửa
    document.querySelectorAll("#import-table-body .btn-edit").forEach(btn => {
        btn.addEventListener("click", () => {
            if (btn.disabled) return;
            const id = btn.dataset.id;
            const imports = getImports();
            const imp = imports.find(i => i.id === id);
            if (!imp) return;

            // Đổ dữ liệu lên form
            document.getElementById("import-form-title").textContent = `Sửa phiếu nhập: ${id}`;
            document.getElementById("editing-import-id").value = id;
            currentImportItems = [...imp.items]; // Sao chép mảng
            renderImportItemsList();
            
            // Hiện nút "Hủy sửa"
            document.getElementById("btn-cancel-import-edit").classList.remove("hidden");
            document.querySelector("#import-form .btn-submit").textContent = "Lưu thay đổi";

            window.scrollTo(0, 0); // Cuộn lên đầu
        });
    });
}

/**
 * CẬP NHẬT TỪ P1: Hàm reset form nhập
 */
function resetImportForm() {
    currentImportItems = [];
    renderImportItemsList();
    document.getElementById("import-form-title").textContent = "Tạo phiếu nhập hàng mới";
    document.getElementById("editing-import-id").value = "";
    document.getElementById("btn-cancel-import-edit").classList.add("hidden");
    document.querySelector("#import-form .btn-submit").textContent = "Tạo Phiếu Nhập";
    
    // Xóa các trường nhập
    document.getElementById("import-product").value = "";
    document.getElementById("import-qty").value = 1;
    document.getElementById("import-cost-price").value = "";
}

/**
 * CẬP NHẬT TỪ P1: Thêm logic Sửa, Hủy
 */
function attachImportFormEvents() {
    const form = document.getElementById("import-form");
    if (!form) return;
    
    // Nút Hủy
    document.getElementById("btn-cancel-import-edit").addEventListener("click", resetImportForm);

    // Nút Thêm SP vào list
    const addBtn = document.getElementById("btn-add-item");
    addBtn.addEventListener("click", () => {
        const productSelect = document.getElementById("import-product");
        const productId = productSelect.value;
        const productName = productSelect.options[productSelect.selectedIndex].text;
        const qty = parseInt(document.getElementById("import-qty").value);
        const costPrice = parseFloat(document.getElementById("import-cost-price").value);
        
        if (!productId || !qty || !costPrice) { alert("Vui lòng chọn sản phẩm, nhập số lượng và giá nhập!"); return; }
        if (qty <= 0 || costPrice <= 0) { alert("Số lượng và giá nhập phải lớn hơn 0!"); return; }
        
        const existingItem = currentImportItems.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.qty += qty;
            existingItem.costPrice = costPrice; // Cập nhật giá mới
        } else {
            currentImportItems.push({ productId, productName, qty, costPrice });
        }
        
        renderImportItemsList();
        
        productSelect.value = "";
        document.getElementById("import-qty").value = 1;
        document.getElementById("import-cost-price").value = "";
    });

    // Nút Submit Form (Lưu / Tạo mới)
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (currentImportItems.length === 0) { alert("Bạn phải thêm ít nhất 1 sản phẩm vào phiếu nhập!"); return; }
        
        const editingId = document.getElementById("editing-import-id").value;
        let imports = getImports();

        if (editingId) {
            // Chế độ CẬP NHẬT
            const index = imports.findIndex(imp => imp.id === editingId);
            if (index === -1) { alert("Lỗi: Không tìm thấy phiếu nhập để cập nhật."); return; }
            
            imports[index].items = currentImportItems; 
            saveImports(imports);
            alert(`Cập nhật phiếu nhập ${editingId} thành công!`);

        } else {
            // Chế độ TẠO MỚI
            const newImport = { 
                id: 'PN' + Date.now(), 
                date: new Date().toISOString(), 
                items: currentImportItems, 
                status: 'Mới tạo' 
            };
            imports.push(newImport);
            saveImports(imports);
            alert(`Tạo phiếu nhập ${newImport.id} thành công!`);
        }
        
        resetImportForm();
        loadImportTable(); // Tải lại bảng
    });
}

function renderImportItemsList() {
    const itemList = document.getElementById("import-items-list");
    if (!itemList) return;
    itemList.innerHTML = "";
    
    if(currentImportItems.length === 0) {
        itemList.innerHTML = "<li>Chưa có sản phẩm nào...</li>";
        return;
    }

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
        const id = item.id; 
        if (!inventory[id]) { inventory[id] = { nhap: 0, xuat: 0, giaVon: 0 }; }
        inventory[id].xuat += item.qty;
        updated = true;
    });
    if (updated) { saveInventory(inventory); console.log(`Đã cập nhật kho cho đơn ${order.id}.`); }
}


/* ================================================================
  PHẦN 8: QUẢN LÝ TỒN KHO (I.8) - CẬP NHẬT TỪ P3
================================================================
*/

/**
 * CẬP NHẬT TỪ P3: Gắn sự kiện cho bộ lọc tồn kho
 */
function attachInventoryFilterEvents() {
    const filterBtn = document.getElementById("filter-btn");
    if (filterBtn) {
        filterBtn.addEventListener("click", () => {
            const dateStart = document.getElementById("filter-date-start").value;
            const dateEnd = document.getElementById("filter-date-end").value;
            loadInventoryTable(dateStart, dateEnd);
        });
    }
}

/**
 * CẬP NHẬT TỪ P3: Tải bảng Tồn Kho
 * - Chấp nhận bộ lọc ngày
 * - Tính toán Nhập/Xuất/Tồn dựa trên ngày
 */
function loadInventoryTable(filterDateStart = '', filterDateEnd = '') {
    const tableBody = document.getElementById("inventory-table-body");
    if (!tableBody) return;
    
    const products = getProducts();
    // Lấy TẤT CẢ phiếu nhập/xuất đã hoàn thành
    const allImports = getImports().filter(i => i.status === 'Đã hoàn thành');
    const allOrders = getAllOrders().filter(o => o.status === 'Đã giao');
    
    tableBody.innerHTML = "";

    // Xác định mốc thời gian
    // Mốc bắt đầu (cho Nhập/Xuất TRONG KỲ)
    const startDate = filterDateStart ? new Date(filterDateStart) : new Date('1970-01-01');
    if(filterDateStart) startDate.setHours(0, 0, 0, 0);

    // Mốc kết thúc (cho TỒN CUỐI KỲ và Nhập/Xuất TRONG KỲ)
    const endDate = filterDateEnd ? new Date(filterDateEnd) : new Date('2999-12-31');
    if(filterDateEnd) endDate.setHours(23, 59, 59, 999);

    
    products.forEach(prod => {
        const id = prod.id;
        
        let nhapTrongKy = 0;
        let xuatTrongKy = 0;
        let tongNhap = 0;
        let tongXuat = 0;

        // 1. Tính toán Nhập
        allImports.forEach(imp => {
            const importDate = new Date(imp.date);
            const item = imp.items.find(i => i.productId === id);
            if (item) {
                // Tính tổng nhập đến cuối kỳ (để tính tồn)
                if (importDate <= endDate) {
                    tongNhap += item.qty;
                }
                // Tính tổng nhập trong kỳ (để hiển thị)
                if (importDate >= startDate && importDate <= endDate) {
                    nhapTrongKy += item.qty;
                }
            }
        });

        // 2. Tính toán Xuất
        allOrders.forEach(order => {
            const orderDate = new Date(order.orderDate);
            const item = order.items.find(i => i.id === id); // item.id là productId trong giỏ hàng
            if (item) {
                // Tính tổng xuất đến cuối kỳ (để tính tồn)
                if (orderDate <= endDate) {
                    tongXuat += item.qty;
                }
                // Tính tổng xuất trong kỳ (để hiển thị)
                if (orderDate >= startDate && orderDate <= endDate) {
                    xuatTrongKy += item.qty;
                }
            }
        });

        // 3. Tính Tồn (Tồn cuối kỳ = Tổng nhập từ trước đến 'endDate' - Tổng xuất từ trước đến 'endDate')
        const ton = tongNhap - tongXuat;
        
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
            <td style="font-weight: 500; color: #16a34a;">${nhapTrongKy}</td>
            <td style="font-weight: 500; color: #ef4444;">${xuatTrongKy}</td>
            <td style="font-weight: bold; font-size: 1.1rem;">${ton}</td>
            <td>${status}</td>
        `;
        tableBody.appendChild(tr);
    });
}

/* ================================================================
  PHẦN 7: QUẢN LÝ GIÁ BÁN (I.6) - CẬP NHẬT TỪ P2
================================================================
*/

/**
 * CẬP NHẬT TỪ P2: Tải bảng Giá vốn - Giá bán
 * - Logic lợi nhuận giờ sẽ lấy theo từng loại SP
 */
function loadPriceTable() {
    const tableBody = document.getElementById("price-table-body");
    if (!tableBody) return;

    const products = getProducts();
    const inventory = getInventory();
    const categories = getCategories(); // Lấy danh sách loại SP
    
    tableBody.innerHTML = "";

    products.forEach(prod => {
        const id = prod.id;
        const inv = inventory[id] || { giaVon: 0 };
        const giaVon = inv.giaVon;
        
        // CẬP NHẬT LOGIC LẤY LỢI NHUẬN
        const category = categories.find(c => c.id === prod.category);
        const profitMarginPercent = (category && category.margin) ? category.margin : 50; // Mặc định 50% nếu loại SP không có
        const profitMargin = profitMarginPercent / 100; // 50 -> 0.5
        
        const giaBanDeXuat = giaVon * (1 + profitMargin);
        
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <strong>${prod.name}</strong>
                <div class="details" style="font-size: 0.8rem; color: #64748b;">${prod.id}</div>
            </td>
            <td class="text-cost">${formatVND(giaVon)}</td>
            <td class="text-profit">${profitMarginPercent}%</td>
            <td class="text-final-price">${formatVND(giaBanDeXuat)}</td>
            <td class="text-final-price">${formatVND(prod.price)}</td>
        `;
        tableBody.appendChild(tr);
    });
}
/**
 * CẬP NHẬT TỪ P2: Gắn sự kiện cho form % lợi nhuận
 * - Thay vì 1 input, giờ sẽ render 1 list input cho từng loại SP
 */
function loadAndAttachProfitForm() {
    const form = document.getElementById("profit-form");
    const listContainer = document.getElementById("category-profit-list");
    if (!form || !listContainer) return;
    
    const categories = getCategories();
    listContainer.innerHTML = ""; // Xóa list cũ

    // Render danh sách các loại SP
    categories.forEach(cat => {
        const div = document.createElement("div");
        div.className = "form-group-inline"; // Dùng class mới
        div.innerHTML = `
            <label for="margin-${cat.id}">${cat.name}</label>
            <input type="number" id="margin-${cat.id}" data-id="${cat.id}" value="${cat.margin || 50}" min="0">
        `;
        listContainer.appendChild(div);
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        let categories = getCategories(); // Lấy bản mới nhất
        const inputs = listContainer.querySelectorAll("input[type='number']");
        
        inputs.forEach(input => {
            catId = input.dataset.id;
            newMargin = parseFloat(input.value);
            
            index = categories.findIndex(c => c.id === catId);
            if (index !== -1 && !isNaN(newMargin)) {
                categories[index].margin = newMargin;
            }
        });
        
        saveCategories(categories); // Lưu lại mảng categories đã cập nhật
        alert("Đã lưu tỉ lệ lợi nhuận cho các loại sản phẩm!");
        loadPriceTable(); // Tải lại bảng giá bán
    });
}