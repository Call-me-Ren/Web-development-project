$(document).ready(function () {
  // Ẩn/hiện mật khẩu
  $("#eye").click(function () {
    $(this).toggleClass("open");
    $(this).children("i").toggleClass("fa-eye-slash fa-eye");

    let input = $(this).prev();
    if ($(this).hasClass("open")) {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
  });

  // Xử lý đăng nhập
  $("#form-login").submit(function (e) {
    e.preventDefault();

    // Lấy dữ liệu
    const username = $(".form-group input[type='text']").val().trim();
    const password = $(".form-group input[type='password']").val().trim();

    // Xóa lỗi cũ nếu có
    $(".error-message").remove();

    // Kiểm tra rỗng
    if (!username || !password) {
      $("#form-login").prepend(
        '<p class="error-message">Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!</p>'
      );
      return;
    }

    // Lấy dữ liệu người dùng đã đăng ký trong localStorage
    const userData = localStorage.getItem(username);

    if (!userData) {
      $("#form-login").prepend(
        '<p class="error-message">Tài khoản không tồn tại! Vui lòng đăng ký trước.</p>'
      );
      return;
    }

    const user = JSON.parse(userData);

    // So sánh mật khẩu
    if (password === user.password) {
      // Đăng nhập thành công
      localStorage.setItem("currentUser", JSON.stringify(user));
      alert("Đăng nhập thành công!");
      window.location.href = "index.html"; // trang web chính sau khi đăng nhập
    } else {
      $("#form-login").prepend(
        '<p class="error-message">Sai mật khẩu! Vui lòng thử lại.</p>'
      );
    }
  });
});
