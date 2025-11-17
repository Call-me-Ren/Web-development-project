$(document).ready(function () {
    // ================== TẠO TÀI KHOẢN MẶC ĐỊNH CHO LẦN ĐẦU CHẠY ==================
    const defaultUsername = "user";
    if (!localStorage.getItem(defaultUsername)) {
        const defaultUser = {
            username: defaultUsername, 
            password: "123456", 
            firstname: "User",
            lastname: "Test",
            number: "0901234567",
            address: "123 Nguyễn Trãi, Quận 1, TP.HCM"
        };
        localStorage.setItem(defaultUsername, JSON.stringify(defaultUser));
        console.log(`Tài khoản mẫu '${defaultUsername}' (pass: 123456) đã được tạo.`);
    }
    // LƯU Ý: Tài khoản Admin (quanly1_user) được khởi tạo trong admin.js

    // ================== Ẩn/hiện mật khẩu ==================
    $("#eye").click(function () {
        $(this).toggleClass("open");
        $(this).children("i").toggleClass("fa-eye-slash fa-eye");

        let input = $(this).prev();
        input.attr("type", $(this).hasClass("open") ? "text" : "password");
    });

    // ================== Xử lý đăng nhập ==================
    $("#form-login").submit(function (e) {
        e.preventDefault();

        // Lấy tên đăng nhập và mật khẩu
        const username = $(this).find("input:eq(0)").val().trim(); 
        const password = $(this).find("input:eq(1)").val().trim();
        const storageKey = username.includes('@') ? username : username; // Key lưu trữ là username

        $(".error-message").remove();

        if (!username || !password) {
            $("#form-login").prepend(
                '<p class="error-message">Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!</p>'
            );
            return;
        }

        const userData = localStorage.getItem(storageKey);
        // THỬ TÌM VỚI KEY ADMIN NẾU KHÔNG TÌM THẤY VỚI USERNAME
        const adminKey = username === 'quanly1' ? 'quanly1_user' : null;
        const finalKey = userData ? storageKey : adminKey;
        
        const finalUserData = localStorage.getItem(finalKey);

        if (!finalUserData) {
            $("#form-login").prepend(
                '<p class="error-message">Tài khoản không tồn tại! Vui lòng đăng ký trước.</p>'
            );
            return;
        }

        const user = JSON.parse(finalUserData);
        
        // KIỂM TRA PHÂN QUYỀN ĐĂNG NHẬP NGƯỜI DÙNG: CHẶN ADMIN
        // Admin chỉ log được ở /admin/index.html (quanly1_user là key của Admin)
        if (finalKey === 'quanly1_user') {
             $("#form-login").prepend(
                '<p class="error-message">Tài khoản này chỉ dùng để quản trị (Admin)!</p>'
            );
            return;
        }

        if (password === user.password) {
            localStorage.setItem("currentUser", JSON.stringify(user));
            localStorage.setItem("isLoggedIn", "true");
            
            window.location.href = "index.html"; // Chuyển hướng đến index.html
            return;
        } else {
            $("#form-login").prepend(
                '<p class="error-message">Sai mật khẩu! Vui lòng thử lại.</p>'
            );
        }
    });

    // ================== Quên mật khẩu ==================
    $("#form-reset").submit(function (e) {
        e.preventDefault();

        const username = $("#reset-username").val().trim();
        const newPassword = $("#reset-password").val().trim();
        const confirmPassword = $("#reset-password-confirm").val().trim();

        $(".error-message").remove();

        if (!username || !newPassword || !confirmPassword) {
            $("#form-reset").prepend(
                '<p class="error-message">Vui lòng nhập đầy đủ thông tin!</p>'
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            $("#form-reset").prepend(
                '<p class="error-message">Mật khẩu nhập lại không khớp!</p>'
            );
            return;
        }
        
        const storageKey = username;

        const userData = localStorage.getItem(storageKey);
        if (!userData) {
            $("#form-reset").prepend(
                '<p class="error-message">Tài khoản không tồn tại!</p>'
            );
            return;
        }

        const user = JSON.parse(userData);
        user.password = newPassword;
        localStorage.setItem(storageKey, JSON.stringify(user));

        alert("Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.");
        window.location.href = "dangnhap.html"; // Trở lại trang đăng nhập
    });
});