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

        // Đóng sidebar (bằng nút X hoặc click vào khu vực dimmed)
        closeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            sidebar.classList.remove("show");
            main.classList.remove("dimmed");
        });
        main.addEventListener("click", () => {
            if (sidebar.classList.contains("show")) {
                sidebar.classList.remove("show");
                main.classList.remove("dimmed");
            }
        });
    }
}
/* --- KẾT THÚC HÀM MỚI --- */


// js/admin.js

/* --- CẤU HÌNH KEYS --- */
const PRODUCTS_KEY = 'watchtime_products'; 
const ORDERS_KEY = 'allOrders'; 
const IMPORTS_KEY = 'watchtime_imports'; 
const CATEGORY_KEY = 'watchtime_categories'; 


/* --- HÀM CHUNG --- */
function checkAdminLogin() {
    const isAdminLoggedIn = sessionStorage.getItem("isAdminLoggedIn");
    if (isAdminLoggedIn !== "true") {
        // alert("Bạn phải đăng nhập với tư cách Admin để truy cập trang này!");
        window.location.href = "index.html";
    }
    checkAndEnforceAdminLogout();
}
function attachLogoutEvent() {
    const logoutBtn = document.getElementById("admin-logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("Bạn có chắc muốn đăng xuất?")) {
                sessionStorage.removeItem("isAdminLoggedIn");
                sessionStorage.removeItem("admin_session_key"); 
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
        if (data === null || data === undefined) {
            saveToStorage(key, defaultValue);
            return defaultValue;
        }
        return JSON.parse(data); 
    } catch (e) {
        console.error(`Lỗi khi đọc ${key}:`, e);
        return defaultValue;
    }
}
function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    
    // Kích hoạt sự kiện 'storage' ở các tab khác
    if (key === PRODUCTS_KEY || key === CATEGORY_KEY || key === ORDERS_KEY || key === IMPORTS_KEY) {
        localStorage.setItem(key, JSON.stringify(data));
    }
}

// BỔ SUNG: Hàm kiểm tra và buộc đăng xuất Admin (dùng khi tài khoản bị khóa)
function checkAndEnforceAdminLogout() {
    const adminKey = 'quanly1_user'; 
    const adminData = getFromStorage(adminKey, null);
    
    if (adminData && adminData.isLocked === true && sessionStorage.getItem("isAdminLoggedIn") === "true") {
        sessionStorage.removeItem("isAdminLoggedIn");
        sessionStorage.removeItem("admin_session_key");
        alert("Tài khoản quản trị đã bị khóa! Buộc đăng xuất.");
        window.location.href = "index.html";
    }
}

/* ================================================================
  PHẦN 0: KHỞI TẠO DỮ LIỆU MẶC ĐỊNH CHO ADMIN (QUAN TRỌNG)
================================================================
*/
(function initializeDefaultAdminData() {
    // Khởi tạo tài khoản Admin/User
    const defaultUsers = [
        { key: 'quanly1_user', username: 'quanly1', password: 'abcd1234', firstname: 'Quản', lastname: 'Lý', isLocked: false, isAdmin: true },
        // User 1 (Hoạt động)
        { key: 'khachhang1', username: 'khachhang1', password: '123456', firstname: 'Khách', lastname: 'Hàng 1', isLocked: false, isAdmin: false },
        // User 2 (Hoạt động)
        { key: 'khachhang2', username: 'khachhang2', password: '123456', firstname: 'Khách', lastname: 'Hàng 2', isLocked: false, isAdmin: false },
        // User 3 (Đã khóa)
        { key: 'khachhang3', username: 'khachhang3', password: '123456', firstname: 'Khách', lastname: 'Hàng 3', isLocked: true, isAdmin: false },
        // User 4 (Hoạt động)
        { key: 'khachhang4', username: 'khachhang4', password: '123456', firstname: 'Khách', lastname: 'Hàng 4', isLocked: false, isAdmin: false },
    ];
    defaultUsers.forEach(user => {
        if (!localStorage.getItem(user.key)) {
            // SỬA: Đảm bảo có đủ trường cho việc hiển thị thông tin cá nhân và kiểm tra đăng nhập
            localStorage.setItem(user.key, JSON.stringify({...user, email: user.username, number: '0123456789', address: '123 Nguyễn Trãi, TP.HCM', gender: 'Nam'}));
        }
    });

    // Khởi tạo Category mặc định (Nếu file products.js/categories.js chưa chạy)
    if (!localStorage.getItem(CATEGORY_KEY) || getFromStorage(CATEGORY_KEY, []).length === 0) {
        const categories = [
            { id: 'nam', name: 'Đồng hồ Nam', margin: 50 }, 
            { id: 'nu', name: 'Đồng hồ Nữ', margin: 55 }, 
            { id: 'doi', name: 'Đồng hồ Đôi', margin: 50 }
        ];
        saveToStorage(CATEGORY_KEY, categories);
    }
    
    // Khởi tạo Đơn hàng mẫu (Vì products.js không làm)
    if (!localStorage.getItem(ORDERS_KEY) || getFromStorage(ORDERS_KEY, []).length === 0) {
        const mockOrder = {
            id: 'ORD_1700000001',
            userEmail: 'khachhang1',
            customer: { name: 'Khách Hàng 1', phone: '0123456789', address: '123 Nguyễn Trãi, TP.HCM' },
            // Dùng ID sản phẩm có tồn kho mẫu (sp_ben10)
            items: [
                { id: 'sp_ben10', name: 'BEN 10 OMNITRIX', price: 999999999, qty: 1 },
            ],
            total: 999999999,
            status: 'Mới đặt', 
            createdAt: new Date('2025-01-15').toISOString()
        };
        saveToStorage(ORDERS_KEY, [mockOrder]);
    }
})();


/* ================================================================
  PHẦN 1: QUẢN LÝ NGƯỜI DÙNG (GIỮ LẠI TOÀN BỘ LOGIC)
================================================================
*/
function loadUserTable() {
    const tableBody = document.getElementById("user-table-body");
    if (!tableBody) return; 
    tableBody.innerHTML = ""; 
    let users = [];
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // Chỉ quét các key có vẻ là tài khoản user
        if (localStorage.getItem(key) && localStorage.getItem(key).includes('password') && localStorage.getItem(key).includes('username')) { 
            try {
                const user = JSON.parse(localStorage.getItem(key));
                if (user.password) {
                    const username = user.username || key; 
                    const isAdmin = user.isAdmin || key === 'quanly1_user' || key.endsWith('_admin');
                    users.push({ ...user, username: username, storageKey: key, password: user.password, isAdmin: isAdmin });
                }
            } catch (e) { console.warn(`Không thể parse user data cho key: ${key}`); }
        }
    }
    
    // SỬA: Loại bỏ các key không phải là user chính thức
    users = users.filter(u => u.storageKey !== 'admin' && u.storageKey !== 'currentUser' && u.storageKey !== 'isLoggedIn'); 

    if (users.length === 0) { tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Không tìm thấy người dùng nào.</td></tr>'; return; }
    
    users.forEach(user => {
        const tr = document.createElement("tr");
        const isLocked = user.isLocked || false;
        
        const isAdminAccount = user.isAdmin || user.storageKey === 'quanly1_user' || user.storageKey.endsWith('_admin');
        const adminLabel = isAdminAccount ? ` <span style="background:#dc2626; color:white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; margin-left: 5px;">ADMIN</span>` : '';
        const usernameDisplay = user.username + adminLabel;

        tr.innerHTML = `<td>${usernameDisplay}</td><td>${user.password}</td><td style="color: ${isLocked ? 'red' : 'green'}; font-weight: bold;">${isLocked ? 'Đã khóa' : 'Hoạt động'}</td><td><button class="btn-action btn-doi-mk" data-key="${user.storageKey}">Khởi tạo Mật khẩu</button><button class="btn-action btn-toggle-lock" data-key="${user.storageKey}">${isLocked ? 'Mở khóa' : 'Khoá'}</button></td>`;
        tableBody.appendChild(tr);
    });
    attachTableActions();
}

function attachTableActions() {
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
     if (key === 'quanly1_user') {
        alert("Không thể khóa tài khoản Admin gốc (quanly1)!");
        return;
     }

     try {
        const userData = JSON.parse(localStorage.getItem(key));
        if (userData) { 
            const newLockedState = !userData.isLocked;
            userData.isLocked = newLockedState; 
            localStorage.setItem(key, JSON.stringify(userData)); 
            
            if (newLockedState) {
                // Gửi tín hiệu khóa để buộc logout phiên user
                localStorage.setItem('session_lock_signal', userData.username + Date.now()); 
                alert(`Đã khóa tài khoản '${userData.username}'. Phiên đăng nhập sẽ bị kết thúc.`); 
            } else {
                 alert(`Đã mở khóa tài khoản '${userData.username}'.`); 
            }
            
            loadUserTable(); 
        }
    } catch (e) { alert("Có lỗi xảy ra."); }
}

function attachAddUserFormEvent() {
    const form = document.getElementById("add-user-form");
    if (!form) return;
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const username = document.getElementById("new-user-email").value.trim();
        const password = document.getElementById("new-user-pass").value.trim();
        const accountType = document.querySelector('input[name="account-type"]:checked').value;
        
        if (username.includes('@') || username.includes(' ')) {
            alert("Tên tài khoản không được chứa ký tự '@' hoặc khoảng trắng!");
            return;
        }

        let storageKey = username;
        
        if (accountType === 'admin') {
            storageKey = username === 'quanly1' ? 'quanly1_user' : `${username}_admin`;
        }

        if (localStorage.getItem(storageKey)) {
             alert(`Tài khoản '${username}' đã tồn tại! Vui lòng sử dụng tên khác.`);
             return;
        }
        
        const newUser = {
            username: username, 
            password: password,
            // SỬA: Đảm bảo có trường email để khớp với logic check user
            email: username, 
            firstname: accountType === 'admin' ? 'Quản' : 'Người dùng',
            lastname: accountType === 'admin' ? 'Lý' : 'mới',
            number: 'Chưa có', 
            address: 'Chưa có', 
            gender: 'Chưa rõ',
            isLocked: false,
            isAdmin: accountType === 'admin'
        };
        
        localStorage.setItem(storageKey, JSON.stringify(newUser));
        alert(`Đã thêm tài khoản ${accountType} thành công:\nTK: ${username}\nMK: ${password}`);
        
        form.reset();
        loadUserTable();
    });
}

/* ================================================================
  PHẦN 2: QUẢN LÝ NHẬP HÀNG
================================================================
*/

/**
 * Cập nhật Phiếu nhập (Note, Date, Items)
 */
window.updateImport = function(importId, newDate, newNote, newItems) {
    const allImports = getFromStorage(IMPORTS_KEY, []);
    const index = allImports.findIndex(imp => imp.id === importId);

    if (index === -1) {
        alert("Lỗi: Không tìm thấy phiếu nhập để cập nhật.");
        return;
    }

    // Cập nhật dữ liệu
    allImports[index].importDate = newDate;
    allImports[index].note = newNote;
    allImports[index].items = newItems;
    allImports[index].totalQuantity = newItems.reduce((sum, item) => sum + item.qty, 0);

    saveToStorage(IMPORTS_KEY, allImports);
    alert(`Đã cập nhật phiếu nhập ${importId} thành công!`);
};

/**
 * Hoàn thành Phiếu nhập
 */
window.completeImport = function(importId) {
    const allImports = getFromStorage(IMPORTS_KEY, []);
    const index = allImports.findIndex(imp => imp.id === importId);

    if (index === -1) {
        alert("Lỗi: Không tìm thấy phiếu nhập để hoàn thành.");
        return;
    }
    
    if (allImports[index].status === 'Đã hoàn thành') {
        alert("Phiếu nhập đã được hoàn thành trước đó.");
        return;
    }

    allImports[index].status = 'Đã hoàn thành';
    saveToStorage(IMPORTS_KEY, allImports);
    
    // KICK: Gửi tín hiệu thay đổi IMPORTS_KEY 
    localStorage.setItem(IMPORTS_KEY, JSON.stringify(allImports));
    
    alert(`Đã hoàn thành phiếu nhập ${importId}! Tồn kho đã được cập nhật.`);
};

/* ================================================================
  PHẦN 3: QUẢN LÝ GIÁ BÁN
================================================================
*/

/**
 * Cập nhật Tỉ lệ Lợi nhuận (Margin) và Giá bán (Price) của sản phẩm
 */
window.updateProductMarginAndPrice = function(productId, newMargin) {
    const allProducts = getFromStorage(PRODUCTS_KEY, []);
    const index = allProducts.findIndex(p => p.id === productId);

    if (index === -1) {
        alert("Lỗi: Không tìm thấy sản phẩm để cập nhật giá.");
        return;
    }
    
    allProducts[index].margin = newMargin;

    // --- Tính lại giá bán (để lưu vào products.js) ---
    const allImports = getFromStorage(IMPORTS_KEY, []).filter(i => i.status === 'Đã hoàn thành'); 
    
    let lastImportPrice = 0;
    let latestTimestamp = 0;
    allImports.forEach(imp => {
        imp.items.forEach(item => {
            if (item.productId === productId) {
                if (item.timestamp > latestTimestamp) {
                    latestTimestamp = item.timestamp;
                    lastImportPrice = item.importPrice;
                }
            }
        });
    });

    let newSalePrice = 0;
    if (lastImportPrice > 0) {
        // Giá bán = Giá vốn * (1 + % Margin), làm tròn lên hàng nghìn
        newSalePrice = Math.ceil(lastImportPrice * (1 + (newMargin / 100)) / 1000) * 1000;
    } else {
        // Nếu chưa có giá vốn, dùng giá bán mặc định của sản phẩm
        newSalePrice = allProducts[index].price || 0; 
    }
    
    allProducts[index].price = newSalePrice; // Lưu giá bán mới vào trường `price`
    // ------------------------------------

    saveToStorage(PRODUCTS_KEY, allProducts);
    
    // KICK: Gửi tín hiệu thay đổi PRODUCTS_KEY để cập nhật lưới sản phẩm Client
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(allProducts));
    
    alert(`Đã cập nhật Tỉ lệ Lợi nhuận (${newMargin}%) và Giá bán mới thành công!`);
};

/* ================================================================
  PHẦN 4: QUẢN LÝ ĐƠN HÀNG
================================================================
*/

/**
 * Cập nhật trạng thái đơn hàng (Được gọi từ quanly_donhang.html)
 */
window.updateOrderStatus = function(orderId, newStatus) {
    const allOrders = getFromStorage(ORDERS_KEY, []);
    const index = allOrders.findIndex(o => o.id === orderId);

    if (index === -1) {
        alert("Lỗi: Không tìm thấy đơn hàng để cập nhật.");
        return;
    }
    
    const currentStatus = allOrders[index].status;

    // Ngăn cản thay đổi trạng thái nếu đã Hủy/Đã giao
    if (currentStatus === 'Đã hủy' || currentStatus === 'Đã giao') {
        alert("Không thể thay đổi trạng thái của đơn hàng đã hoàn tất hoặc đã hủy.");
        return;
    }
    
    allOrders[index].status = newStatus;
    saveToStorage(ORDERS_KEY, allOrders); 
    
    // Nếu chuyển sang trạng thái "Đã giao", cần kích hoạt cập nhật tồn kho ở Client
    if (newStatus === 'Đã giao') {
        // KICK: Gửi tín hiệu thay đổi ORDERS_KEY 
        localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));
    }
    
    // Lưu ý: Cập nhật lại giao diện bảng sẽ được thực hiện ở file HTML gọi hàm này.
};