// --- CÁC HÀM KIỂM TRA HỢP LỆ (VALIDATION) ---

// 1. Kiểm tra chuỗi có phải toàn bộ là số không (0-9)
function isNumeric(input) {
    // Regex: ^[0-9]+$ (Chỉ chấp nhận số)
    return /^[0-9]+$/.test(input);
}

// 2. Kiểm tra Tên đăng nhập (chỉ chấp nhận chữ cái không dấu và số)
function isValidUsername(username) {
    // Regex: ^[a-zA-Z0-9]+$ (Chỉ chấp nhận chữ cái a-z, A-Z và số 0-9)
    return /^[a-zA-Z0-9]+$/.test(username);
}

// --- XỬ LÝ ẨN/HIỆN MẬT KHẨU ---

document.querySelectorAll(".eye").forEach((eyeBtn) => {
    eyeBtn.addEventListener("click", () => {
        const input = document.getElementById(eyeBtn.dataset.target);
        const icon = eyeBtn.querySelector("i");
        if (input.type === "password") {
            input.type = "text";
            icon.classList.replace("fa-eye", "fa-eye-slash");
        } else {
            input.type = "password";
            icon.classList.replace("fa-eye-slash", "fa-eye");
        }
    });
});

// --- KIỂM TRA TÊN ĐĂNG NHẬP (REAL-TIME) ---
document.getElementById('email').addEventListener('input', function() {
    const emailInput = this;
    const value = emailInput.value.trim();

    // 1. Kiểm tra cú pháp (nếu không trống)
    if (value && !isValidUsername(value)) {
        // Tên đăng nhập không hợp lệ
        emailInput.style.border = '2px solid red'; 
    } else {
        // Hợp lệ hoặc trống
        emailInput.style.border = '1px solid #ccd0d5';
    }
    // Gợi ý: Nếu muốn hiển thị thông báo lỗi cụ thể, bạn cần dùng một thẻ <span> trong HTML.
});

// --- KIỂM TRA SỐ ĐIỆN THOẠI (REAL-TIME) ---
document.getElementById('number').addEventListener('input', function() {
    const numberInput = this;
    const value = numberInput.value;

    // Tự động loại bỏ ký tự không phải số ngay khi người dùng gõ
    numberInput.value = value.replace(/[^0-9]/g, '');

    // Kiểm tra và đặt border đỏ nếu có ký tự lạ (chỉ dùng cho mục đích hiển thị trực quan)
    if (value.length > 0 && !isNumeric(value)) {
        numberInput.style.border = '2px solid red';
    } else {
        numberInput.style.border = '1px solid #ccd0d5';
    }
});


// --- XỬ LÝ KHI NHẤN ĐĂNG KÝ (Final Validation) ---
document.getElementById("btnRegister").addEventListener("click", (e) => {
    e.preventDefault();

    const firstname = document.getElementById("firstname").value.trim();
    const lastname = document.getElementById("lastname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const repassword = document.getElementById("repassword").value.trim();
    const number = document.getElementById("number").value.trim();
    const address = document.getElementById("address").value.trim();
    
    const genderInput = document.querySelector('input[name="gender"]:checked');
    const gender = genderInput ? genderInput.value : "";

    // 1. Kiểm tra thông tin trống
    if (
        !firstname ||
        !lastname ||
        !email ||
        !password ||
        !repassword ||
        !number ||
        !address ||
        !gender
    ) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    // 2. Kiểm tra Số điện thoại (Chỉ số)
    if (!isNumeric(number) || number.length < 9) { // Thêm điều kiện độ dài tối thiểu
        alert("Số điện thoại không hợp lệ. Vui lòng chỉ nhập các chữ số (tối thiểu 9 số)!");
        document.getElementById("number").focus();
        document.getElementById("number").style.border = '2px solid red';
        return;
    }

    // 3. Kiểm tra Tên đăng nhập (Chỉ chữ cái và số)
    if (!isValidUsername(email)) {
        alert("Tên đăng nhập không hợp lệ. Chỉ được chứa chữ cái không dấu (a-z) và số (0-9).");
        document.getElementById("email").focus();
        document.getElementById("email").style.border = '2px solid red';
        return;
    }
    
    // 4. Kiểm tra mật khẩu khớp
    if (password !== repassword) {
        alert("Mật khẩu nhập lại không khớp!");
        document.getElementById("repassword").focus();
        document.getElementById("repassword").style.border = '2px solid red';
        return;
    }

    // 5. Kiểm tra email đã tồn tại
    if (localStorage.getItem(email)) {
        alert("Tài khoản này đã tồn tại, vui lòng đăng nhập!");
        window.location.href = "dangnhap.html";
        return;
    }

    // Đặt lại border về bình thường nếu mọi thứ hợp lệ
    document.getElementById("number").style.border = '1px solid #ccd0d5';
    document.getElementById("email").style.border = '1px solid #ccd0d5';
    document.getElementById("repassword").style.border = '1px solid #ccd0d5';

    // 6. Lưu thông tin người dùng
    const user = {
        firstname,
        lastname,
        email,
        password,
        number,
        address,
        gender,
    };
    localStorage.setItem(email, JSON.stringify(user));

    alert("Đăng ký thành công! Hãy đăng nhập nhé!");
    window.location.href = "dangnhap.html";
});