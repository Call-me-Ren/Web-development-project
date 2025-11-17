$(document).ready(function () {
  // ================== TẠO TÀI KHOẢN MẶC ĐỊNH CHO LẦN ĐẦU CHẠY ==================
  // Đã sửa: Sử dụng một tên đăng nhập mẫu không có định dạng email
  const defaultUsername = "usertest1"; 
  if (!localStorage.getItem(defaultUsername)) {
    const defaultUser = {
      username: defaultUsername, // Đã sửa: Dùng defaultUsername làm tên đăng nhập
      password: "123456", 
      firstname: "User",
      lastname: "Test",
      number: "0901234567",
      address: "123 Nguyễn Trãi, Quận 1, TP.HCM",
      birthday: "01/01/1990", 
      gender: "Nam", 
    };
    localStorage.setItem(defaultUsername, JSON.stringify(defaultUser));
    console.log(
      `Tài khoản mẫu '${defaultUsername}' (pass: 123456) đã được tạo.`
    );
  }
  // =============================================================================

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

    // Lấy tên đăng nhập từ input đầu tiên và mật khẩu từ input thứ hai trong form
    const username = $(this).find("input:eq(0)").val().trim();
    const password = $(this).find("input:eq(1)").val().trim();

    $(".error-message").remove();

    if (!username || !password) {
      $("#form-login").prepend(
        '<p class="error-message">Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!</p>'
      );
      return;
    }

    const userData = localStorage.getItem(username); // Dùng username làm key
    if (!userData) {
      $("#form-login").prepend(
        '<p class="error-message">Tài khoản không tồn tại! Vui lòng đăng ký trước.</p>'
      );
      return;
    }

    const user = JSON.parse(userData);

    if (password === user.password) {
      // Đã sửa: Lưu toàn bộ đối tượng user, không dùng email
      localStorage.setItem("currentUser", JSON.stringify(user)); 
      localStorage.setItem("isLoggedIn", "true");

      window.location.href = "index.html"; 
      return; 
    } else {
      $("#form-login").prepend(
        '<p class="error-message">Sai mật khẩu! Vui lòng thử lại.</p>'
      );
    }
  });

  // ================== Quên mật khẩu (ĐÃ BỎ VALIDATION EMAIL) ==================
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
    
    // === ĐÃ BỎ: Kiểm tra định dạng Email ===
    
    // === BỔ SUNG: Kiểm tra độ dài mật khẩu mới ===
    if (newPassword.length < 6) {
        $("#form-reset").prepend(
            '<p class="error-message">Mật khẩu mới phải có ít nhất 6 ký tự!</p>'
        );
        return;
    }

    if (newPassword !== confirmPassword) {
      $("#form-reset").prepend(
        '<p class="error-message">Mật khẩu nhập lại không khớp!</p>'
      );
      return;
    }

    const userData = localStorage.getItem(username); // Dùng username làm key
    if (!userData) {
      $("#form-reset").prepend(
        '<p class="error-message">Tài khoản không tồn tại!</p>'
      );
      return;
    }

    const user = JSON.parse(userData);
    user.password = newPassword;
    localStorage.setItem(username, JSON.stringify(user));

    alert("Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.");
    window.location.href = "dangnhap.html"; // Trở lại trang đăng nhập
  });
});