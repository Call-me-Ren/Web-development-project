
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

// 🎯 Quản lý đăng nhập / avatar / đăng xuất
document.addEventListener("DOMContentLoaded", function () {
  const loginLink = document.querySelector('a[href="dangnhap.html"]');
  const userAvatar = document.getElementById("user-avatar");
  const userMenu = document.getElementById("user-menu");
  const logoutBtn = userMenu.querySelector("a:last-child");
  const infoBtn = userMenu.querySelector("a:first-child");

  // Kiểm tra trạng thái đăng nhập
  let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  function updateLoginUI() {
    if (isLoggedIn) {
      loginLink.classList.add("hidden");
      userAvatar.classList.remove("hidden");
      userAvatar.classList.add("flex");
    } else {
      loginLink.classList.remove("hidden");
      userAvatar.classList.add("hidden");
      localStorage.removeItem("isLoggedIn");
    }
  }

  updateLoginUI();

  // Khi đăng nhập từ trang khác quay lại
  if (window.location.href.includes("dangnhap.html")) {
    localStorage.setItem("isLoggedIn", "true");
    isLoggedIn = true;
    updateLoginUI();
  }

  // Khi bấm avatar -> mở menu
  userAvatar.addEventListener("click", function (e) {
    e.stopPropagation();
    userMenu.classList.toggle("hidden");
  });

  // Khi click ra ngoài -> đóng menu
  document.addEventListener("click", function (e) {
    if (!userAvatar.contains(e.target) && !userMenu.contains(e.target)) {
      userMenu.classList.add("hidden");
    }
  });

  // Khi click "Đăng xuất"
  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("isLoggedIn");
    isLoggedIn = false;
    updateLoginUI();
    userMenu.classList.add("hidden");
    cartCount = 0;
    const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) {
    cartCountEl.textContent = cartCount;
  }
  });

  // Khi click "Thông tin cá nhân"
  infoBtn.addEventListener("click", function () {
    window.location.href = "xuathongtin.html";
  });
});


// --------------------------------------------------------------------
// Giỏ hàng
let cartCount = 0;
document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    if (localStorage.getItem("isLoggedIn") !== "true") {
      alert("Bạn cần đăng nhập để mua hàng!");
      return;
    }

    cartCount++;
    const cartCountEl = document.getElementById("cart-count");
    cartCountEl.textContent = cartCount;

    // Hiệu ứng nhỏ
    cartCountEl.style.transform = "scale(1.3)";
    setTimeout(() => (cartCountEl.style.transform = "scale(1)"), 150);
  });
});


// --------------------------------------------------------------------
// Đa ngôn ngữ
let currentLang = "vi";
const langToggleBtn = document.querySelector(".btn");

const translations = {
  vi: {
    Home: "Trang Chủ",
    Products: "Sản Phẩm",
    About: "Về Chúng Tôi",
    Contact: "Liên Hệ",
    "hero-title": "Bộ Sưu Tập Đồng Hồ Đẳng Cấp",
    "hero-sub": "Khẳng định phong cách và vị thế của bạn với những chiếc đồng hồ tinh xảo nhất.",
    explore: "Khám Phá Ngay",
  },
  en: {
    Home: "Home",
    Products: "Products",
    About: "About Us",
    Contact: "Contact",
    "hero-title": "Luxury Watch Collection",
    "hero-sub": "Define your style and status with the finest timepieces.",
    explore: "Explore Now",
  },
};

function updateLanguage() {
  const lang = translations[currentLang];
  document.querySelectorAll("[data-key]").forEach((el) => {
    const key = el.getAttribute("data-key");
    if (lang[key]) el.textContent = lang[key];
  });
}

langToggleBtn.addEventListener("click", () => {
  currentLang = currentLang === "vi" ? "en" : "vi";
  langToggleBtn.textContent = currentLang === "vi" ? "VI" : "EN";
  updateLanguage();
});
