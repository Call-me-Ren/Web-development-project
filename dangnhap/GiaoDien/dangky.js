// Ẩn/hiện mật khẩu
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

// Tạo danh sách ngày/tháng/năm
const daySelect = document.getElementById("day");
const monthSelect = document.getElementById("month");
const yearSelect = document.getElementById("year");

for (let d = 1; d <= 31; d++)
  daySelect.innerHTML += `<option value="${d}">${d}</option>`;
for (let m = 1; m <= 12; m++)
  monthSelect.innerHTML += `<option value="${m}">${m}</option>`;
const currentYear = new Date().getFullYear();
for (let y = currentYear; y >= 1900; y--)
  yearSelect.innerHTML += `<option value="${y}">${y}</option>`;

// Xử lý khi nhấn Đăng ký
document.getElementById("btnRegister").addEventListener("click", (e) => {
  e.preventDefault();

  const firstname = document.getElementById("firstname").value.trim();
  const lastname = document.getElementById("lastname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const repassword = document.getElementById("repassword").value.trim();
  const number = document.getElementById("number").value.trim();
  const address = document.getElementById("address").value.trim();
  const day = parseInt(daySelect.value);
  const month = parseInt(monthSelect.value);
  const year = parseInt(yearSelect.value);
  const genderInput = document.querySelector('input[name="gender"]:checked');
  const gender = genderInput ? genderInput.value : "";

  // Kiểm tra thông tin trống
  if (
    !firstname ||
    !lastname ||
    !email ||
    !password ||
    !repassword ||
    !number ||
    !address ||
    !day ||
    !month ||
    !year ||
    !gender
  ) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  // Kiểm tra mật khẩu khớp
  if (password !== repassword) {
    alert("Mật khẩu nhập lại không khớp!");
    return;
  }

  // Kiểm tra ngày hợp lệ
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
    daysInMonth[1] = 29;
  if (day > daysInMonth[month - 1]) {
    alert(`Ngày ${day}/${month}/${year} không hợp lệ!`);
    return;
  }

  // Kiểm tra email đã tồn tại
  if (localStorage.getItem(email)) {
    alert("Tài khoản này đã tồn tại, vui lòng đăng nhập!");
    window.location.href = "dangnhap.html";
    return;
  }

  // Lưu thông tin người dùng
  const user = {
    firstname,
    lastname,
    email,
    password,
    number,
    address,
    birthday: `${day}/${month}/${year}`,
    gender,
  };
  localStorage.setItem(email, JSON.stringify(user));

  alert("Đăng ký thành công! Hãy đăng nhập nhé!");
  window.location.href = "dangnhap.html";
});
