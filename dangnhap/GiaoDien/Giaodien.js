document.addEventListener("DOMContentLoaded", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const loginBtn = document.querySelector("a[href='dangnhap.html']");
  const userAvatar = document.getElementById("user-avatar");
  const userMenu = document.getElementById("user-menu");
  const cartCount = document.getElementById("cart-count");

  if (currentUser) {
    const userData = JSON.parse(localStorage.getItem(currentUser.email));

    // Ẩn nút đăng nhập, hiện avatar
    if (loginBtn) loginBtn.classList.add("hidden");
    if (userAvatar) userAvatar.classList.remove("hidden");

    const avatarBtn = userAvatar.querySelector("button");
    avatarBtn.innerHTML = `
      <img src="https://i.pravatar.cc/40" alt="Avatar" class="w-10 h-10 rounded-full border-2 border-indigo-500"/>
      <span class="ml-2 font-medium text-gray-800">${userData.firstname} ${userData.lastname}</span>
    `;

    // Menu user
    userMenu.innerHTML = `
      <div id="user-info-brief" class="px-4 py-2 text-sm text-gray-700 cursor-pointer">
        <p>${userData.firstname} ${userData.lastname}</p>
        <p>${userData.email}</p>
      </div>
      <hr>
      <a href="#" id="logout-btn" class="block px-4 py-2 text-red-600 hover:bg-gray-100">Đăng xuất</a>
    `;

    // Click avatar mở menu
    avatarBtn.addEventListener("click", () => {
      userMenu.classList.toggle("hidden");
    });

    // Click vào info → chuyển sang xemthongtin.html
    const briefInfo = document.getElementById("user-info-brief");
    if (briefInfo) {
      briefInfo.addEventListener("click", () => {
        window.location.href = "xemthongtin.html";
      });
    }

    // Đăng xuất
    document.addEventListener("click", (e) => {
      if (e.target.id === "logout-btn") {
        e.preventDefault();
        if (confirm("Bạn có chắc muốn đăng xuất không?")) {
          localStorage.removeItem("currentUser");
          window.location.reload();
        }
      }
    });

    // Ẩn menu khi click ra ngoài
    document.addEventListener("click", (e) => {
      if (!userAvatar.contains(e.target)) {
        userMenu.classList.add("hidden");
      }
    });

    // Cập nhật giỏ hàng
    const cartKey = currentUser.email + "_cart";
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    if (cartCount) cartCount.textContent = cart.length;
  } else {
    if (loginBtn) loginBtn.classList.remove("hidden");
    if (userAvatar) userAvatar.classList.add("hidden");
  }

  // Xử lý thêm vào giỏ hàng
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", function () {
      const productCard = btn.closest(".product-card");
      const productName = productCard.querySelector("[data-name]").dataset.name;
      muaHang(productName);
    });
  });
});

function muaHang(tenSP) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("⚠️ Vui lòng đăng nhập trước khi mua hàng!");
    window.location.href = "dangnhap.html";
    return;
  }

  const cartKey = currentUser.email + "_cart";
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  cart.push(tenSP);
  localStorage.setItem(cartKey, JSON.stringify(cart));

  const cartCount = document.getElementById("cart-count");
  if (cartCount) cartCount.textContent = cart.length;

  alert(`✅ ${tenSP} đã được thêm vào giỏ hàng của bạn!`);
}
