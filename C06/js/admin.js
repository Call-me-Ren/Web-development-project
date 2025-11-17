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

/* --- CẤU HÌNH KEYS (CHỈ GIỮ KEY LIÊN QUAN ĐẾN USER) --- */
const PRODUCTS_KEY = 'watchtime_products'; // Key sản phẩm gốc
const ORDERS_KEY = 'allOrders'; 
const IMPORTS_KEY = 'watchtime_imports'; 
const CATEGORY_KEY = 'watchtime_categories'; // Bổ sung key Category


/* --- HÀM CHUNG --- */
function checkAdminLogin() {
    const isAdminLoggedIn = sessionStorage.getItem("isAdminLoggedIn");
    if (isAdminLoggedIn !== "true") {
        alert("Bạn phải đăng nhập với tư cách Admin để truy cập trang này!");
        window.location.href = "index.html";
    }
    // BƯỚC MỚI: Thêm lắng nghe storage để buộc logout khi bị khóa
    checkAndEnforceAdminLogout();
}
function attachLogoutEvent() {
    const logoutBtn = document.getElementById("admin-logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("Bạn có chắc muốn đăng xuất?")) {
                sessionStorage.removeItem("isAdminLoggedIn");
                sessionStorage.removeItem("admin_session_key"); // Xóa key session Admin
                window.location.href = "index.html";
            }
        });
    }
}
// Giữ các hàm định dạng chung nếu cần
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
            // Loại bỏ tất cả logic khởi tạo mặc định cho các file khác
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
    
    // BỔ SUNG: Nếu lưu PRODUCTS_KEY hoặc CATEGORY_KEY hoặc ORDERS_KEY
    // ta cần kích hoạt lại lắng nghe để client cập nhật giao diện
    if (key === PRODUCTS_KEY || key === CATEGORY_KEY || key === ORDERS_KEY) {
        // Cần kích hoạt sự kiện 'storage' ở các tab khác
        // Bằng cách đơn giản nhất là ghi đè lại chính key đó (dù giá trị đã giống)
        localStorage.setItem(key, JSON.stringify(data));
    }
}

// BỔ SUNG: Hàm kiểm tra và buộc đăng xuất Admin (dùng khi tài khoản bị khóa)
function checkAndEnforceAdminLogout() {
    const adminKey = 'quanly1_user'; 
    const adminData = getFromStorage(adminKey, null);
    
    if (adminData && adminData.isLocked === true) {
        sessionStorage.removeItem("isAdminLoggedIn");
        sessionStorage.removeItem("admin_session_key");
        alert("Tài khoản quản trị đã bị khóa! Buộc đăng xuất.");
        window.location.href = "index.html";
    }
}


/* ================================================================
  PHẦN 1: QUẢN LÝ NGƯỜI DÙNG (GIỮ LẠI TOÀN BỘ LOGIC)
================================================================
*/
(function initializeQuanLyUser() {
    const defaultUsers = [
        { key: 'quanly1_user', username: 'quanly1', password: 'abcd1234', firstname: 'Quản', lastname: 'Lý', isLocked: false, number: '0123456789', address: 'Hà Nội', isAdmin: true },
        { key: 'khachhang1', username: 'khachhang1', password: '123456', firstname: 'Khách', lastname: 'Hàng 1', isLocked: false, number: 'Chưa có', address: 'Chưa có', isAdmin: false },
        { key: 'khachhang2', username: 'khachhang2', password: '123456', firstname: 'Khách', lastname: 'Hàng 2 (Khóa)', isLocked: true, number: 'Chưa có', address: 'Chưa có', isAdmin: false },
        { key: 'khachhang3', username: 'khachhang3', password: '123456', firstname: 'Khách', lastname: 'Hàng 3', isLocked: false, number: 'Chưa có', address: 'Chưa có', isAdmin: false }
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
                email: user.username.includes('@') ? user.username : undefined,
                isAdmin: user.isAdmin
            };
            const storageKey = user.key; 
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
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (localStorage.getItem(key) && localStorage.getItem(key).includes('password')) { 
            try {
                const user = JSON.parse(localStorage.getItem(key));
                if (user.password) {
                    const username = user.username || key; 
                    const isAdmin = user.isAdmin || key.endsWith('_admin') || key === 'quanly1_user';
                    users.push({ ...user, username: username, storageKey: key, password: user.password, isAdmin: isAdmin });
                }
            } catch (e) { console.warn(`Không thể parse user data cho key: ${key}`); }
        }
    }
    
    users = users.filter(u => u.storageKey !== 'admin'); 

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
        
        if (username.includes('@')) {
            alert("Tên tài khoản không được chứa ký tự '@'!");
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
            firstname: accountType === 'admin' ? 'Quản' : 'Người dùng',
            lastname: accountType === 'admin' ? 'Lý' : 'mới',
            number: 'Chưa có', 
            address: 'Chưa có', 
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
 * Hoàn thành Phiếu nhập (Chỉ trạng thái và KICK LẮNG NGHE cho Client)
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
    
    // YÊU CẦU: Cập nhật tồn kho (được xử lý gián tiếp)
    // Client-side (Giaodien.js) có listener cho IMPORTS_KEY, khi key này thay đổi 
    // thì hàm calculateAllInventory và runFullProductUpdate sẽ tự động chạy
    // để tính lại tồn kho (Nhập - Xuất) và cập nhật lưới sản phẩm.
    
    // KICK: Gửi tín hiệu thay đổi IMPORTS_KEY (thay đổi giá trị)
    localStorage.setItem(IMPORTS_KEY, JSON.stringify(allImports));
    
    alert(`Đã hoàn thành phiếu nhập ${importId}! Tồn kho đã được cập nhật.`);
};

/* ================================================================
  PHẦN 3: QUẢN LÝ GIÁ BÁN (LOGIC MỚI)
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
    
    // Lấy thông tin giá vốn và tính lại Giá bán
    // Logic tính giá vốn/giá bán nên được đặt trong hàm calculateProductPrices ở file quanly_giaban.html
    // Tuy nhiên, ta cần lưu margin vào đây để giá bán được tính lại chính xác.

    allProducts[index].margin = newMargin;

    // --- Tính lại giá bán (Tạm thời) ---
    // Vì không có hàm tính giá vốn ở đây, ta chỉ cập nhật margin và kích hoạt lắng nghe
    // (Lắng nghe của Giaodien.js sẽ tính lại Giá bán chính xác)
    
    // Để Giá bán được hiển thị đúng trong Bảng giá, ta buộc phải tính lại nó ở đây:
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
        // Giá bán = Giá vốn * (1 + % Margin)
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
  PHẦN 4: QUẢN LÝ ĐƠN HÀNG (LOGIC MỚI)
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
        // KICK: Gửi tín hiệu thay đổi ORDERS_KEY để Giaodien.js tự động cập nhật tồn kho
        localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));
    }
    
    // Lưu ý: Cập nhật lại giao diện bảng sẽ được thực hiện ở file HTML gọi hàm này.
};a