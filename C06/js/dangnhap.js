$(document).ready(function () {
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

    const username = $(".form-group input[type='text']").val().trim();
    const password = $(".form-group input[type='password']").val().trim();

    $(".error-message").remove();

    if (!username || !password) {
      $("#form-login").prepend(
        '<p class="error-message">Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!</p>'
      );
      return;
    }

    const userData = localStorage.getItem(username);
    if (!userData) {
      $("#form-login").prepend(
        '<p class="error-message">Tài khoản không tồn tại! Vui lòng đăng ký trước.</p>'
      );
      return;
    }

    const user = JSON.parse(userData);

    if (password === user.password) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");
      alert("Đăng nhập thành công!");
      window.location.href = "index.html"; // Chuyển hướng đến index.html (cùng folder index/)
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

    const userData = localStorage.getItem(username);
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
    window.location.href = "dangnhap.html"; // Trở lại trang đăng nhập (cùng folder index/)
  });
});