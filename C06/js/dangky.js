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
  // Đã sửa: Lấy giá trị từ input có id="email" nhưng coi nó là username
  const username = document.getElementById("email").value.trim(); 
  const password = document.getElementById("password").value.trim();
  const repassword = document.getElementById("repassword").value.trim();
  const number = document.getElementById("number").value.trim();
  const address = document.getElementById("address").value.trim();
  const day = parseInt(daySelect.value);
  const month = parseInt(monthSelect.value);
  const year = parseInt(yearSelect.value);
  const genderInput = document.querySelector('input[name="gender"]:checked');
  const gender = genderInput ? genderInput.value : "";

  // 1. Kiểm tra thông tin trống
  if (
    !firstname ||
    !lastname ||
    !username || // Dùng username thay vì email
    !password ||
    !repassword ||
    !number ||
    !address ||
    isNaN(day) || 
    isNaN(month) || 
    isNaN(year) || 
    !gender
  ) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  // 2. Bổ sung: Kiểm tra Họ và Tên (Tối thiểu 2 ký tự)
  if (firstname.length < 2 || lastname.length < 2) {
      alert("Họ và Tên phải có ít nhất 2 ký tự!");
      return;
  }
  
  // 3. Đã bỏ: Kiểm tra định dạng Email
  
  // 4. Bổ sung: Kiểm tra mật khẩu (Tối thiểu 6 ký tự)
  if (password.length < 6) {
    alert("Mật khẩu phải có ít nhất 6 ký tự!");
    return;
  }

  // 5. Kiểm tra mật khẩu khớp
  if (password !== repassword) {
    alert("Mật khẩu nhập lại không khớp!");
    return;
  }
  
  // 6. Bổ sung: Kiểm tra Tên đăng nhập (Tối thiểu 3 ký tự)
  if (username.length < 3) {
      alert("Tên đăng nhập phải có ít nhất 3 ký tự!");
      return;
  }
  
  // 7. Bổ sung: Kiểm tra Số điện thoại (chỉ chứa số, 10-11 ký tự)
  const phoneRegex = /^\d{10,11}$/;
  if (!phoneRegex.test(number)) {
      alert("Số điện thoại không hợp lệ! Vui lòng nhập 10 hoặc 11 chữ số.");
      return;
  }
  
  // 8. Bổ sung: Kiểm tra Địa chỉ (Tối thiểu 5 ký tự)
  if (address.length < 5) {
      alert("Địa chỉ phải có ít nhất 5 ký tự!");
      return;
  }

  // 9. Kiểm tra ngày hợp lệ
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
    daysInMonth[1] = 29;
  if (day > daysInMonth[month - 1]) {
    alert(`Ngày ${day}/${month}/${year} không hợp lệ!`);
    return;
  }

  // 10. Kiểm tra tên đăng nhập đã tồn tại
  if (localStorage.getItem(username)) { // Dùng username làm key
    alert("Tài khoản này đã tồn tại, vui lòng đăng nhập!");
    window.location.href = "dangnhap.html"; 
    return;
  }

  // 11. Lưu thông tin người dùng
  const user = {
    firstname,
    lastname,
    username, // Lưu tên đăng nhập
    password,
    number,
    address,
    birthday: `${day}/${month}/${year}`,
    gender,
  };
  localStorage.setItem(username, JSON.stringify(user)); // Dùng username làm key

  alert("Đăng ký thành công! Hãy đăng nhập nhé!");
  window.location.href = "dangnhap.html"; 
});