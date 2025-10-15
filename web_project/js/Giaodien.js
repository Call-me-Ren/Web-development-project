
// Tự động gọi hàm render icon của Lucide
    lucide.createIcons();

// Lọc sản phẩm
function filterProducts() {
    const category = document.getElementById("filter-category").value;
    const priceRange = document.getElementById("filter-price").value;
    const products = document.querySelectorAll(".product-card");

    products.forEach((product) => {
        const productCategory = product.dataset.category;
        const priceText = product.querySelector(".text-indigo-600").textContent.replace(/[^\d]/g, "");
        const price = parseFloat(priceText); // ví dụ: 450000000

        // --- Kiểm tra theo loại ---
        const matchCategory = category === "all" || productCategory === category;

        // --- Kiểm tra theo giá ---
        let matchPrice = true;
        switch (priceRange) {
            case "5":
                matchPrice = price < 5000000;
                break;
            case "10":
                matchPrice = price < 10000000;
                break;
            case "15":
                matchPrice = price < 15000000;
                break;
            case "20":
                matchPrice = price < 20000000;
                break;
            case "over20":
                matchPrice = price >= 20000000;
                break;
            default:
                matchPrice = true; // tất cả
        }

        // --- Kết hợp cả 2 điều kiện ---
        if (matchCategory && matchPrice) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}

// --- Gắn sự kiện cho cả 2 ô lọc ---
document.getElementById("filter-category").addEventListener("change", filterProducts);
document.getElementById("filter-price").addEventListener("change", filterProducts);

// Lấy ô tìm kiếm
const searchInput = document.querySelector('#search');

// Lấy tất cả sản phẩm
const products = document.querySelectorAll('.product-card');

// Lắng nghe khi người dùng gõ
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase().trim();

  products.forEach(product => {
    const name = product.querySelector('[data-name]').dataset.name.toLowerCase();

    // Kiểm tra có chứa từ khóa hay không
    if (name.includes(searchTerm)) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
});

// Đăng nhập
document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.getElementById("login-btn");
  const userAvatar = document.getElementById("user-avatar");

  // Giả lập đăng nhập
  loginBtn.addEventListener("click", function () {
    // Ẩn nút đăng nhập
    loginBtn.classList.add("hidden");

    // Hiện avatar người dùng
    userAvatar.classList.remove("hidden");
    userAvatar.classList.add("flex");

    // Sau này, nếu có thông tin người dùng thực
    // bạn có thể thay ảnh động:
    // userAvatar.querySelector("img").src = userInfo.avatarUrl;
  });
});

// Hiển thị menu người dùng khi click vào avatar
document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.getElementById("login-btn");
  const userAvatar = document.getElementById("user-avatar");
  const userMenu = document.getElementById("user-menu");

  // Khi bấm Đăng nhập → ẩn nút, hiện avatar
  loginBtn.addEventListener("click", function () {
    loginBtn.classList.add("hidden");
    userAvatar.classList.remove("hidden");
    userAvatar.classList.add("flex");
  });

  // Khi bấm vào avatar → bật/tắt menu
  userAvatar.addEventListener("click", function () {
    userMenu.classList.toggle("hidden");
  });

  // Khi bấm ra ngoài → ẩn menu
  document.addEventListener("click", function (e) {
    if (!userAvatar.contains(e.target)) {
      userMenu.classList.add("hidden");
    }
  });
});

let isLoggedIn = false;
let cartCount = 0;

// --- Đăng nhập ---
const loginBtn = document.getElementById("login-btn");
const userAvatar = document.getElementById("user-avatar");

if (loginBtn) {
    loginBtn.addEventListener("click", () => {
    isLoggedIn = true;
    loginBtn.classList.add("hidden");
    userAvatar.classList.remove("hidden");
    });
}

// --- Đăng xuất ---
const logoutBtn = document.querySelector("#user-menu a:last-child");
if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    isLoggedIn = false;
    loginBtn.classList.remove("hidden");
    userAvatar.classList.add("hidden");
    cartCount = 0;
    document.getElementById("cart-count").textContent = cartCount;
    });
}

// --- Thêm vào giỏ hàng ---
document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", function (e) {
    e.preventDefault();

    if (!isLoggedIn) {
        alert("Bạn cần đăng nhập để mua hàng!");
        return;
    }

    // Nếu đã đăng nhập thì cho thêm sản phẩm
    cartCount++;
    const cartCountEl = document.getElementById("cart-count");
    cartCountEl.textContent = cartCount;

   // Hiệu ứng phóng to nhỏ nhanh khi thêm
    cartCountEl.style.transform = "scale(1.3)";
    cartCountEl.style.transition = "transform 0.2s ease";

    setTimeout(() => {
    cartCountEl.style.transform = "scale(1)";
    }, 150);
    });
});
