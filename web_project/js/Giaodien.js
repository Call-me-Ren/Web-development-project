// Tự động gọi hàm render icon của Lucide
    lucide.createIcons();
//Tìm kiếm nâng cao----------------------------------------------------------------------
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
    let found = false; // Kiểm tra xem có sản phẩm nào trùng không

    products.forEach(product => {
        const name = product.querySelector("h3").innerText.toLowerCase();

        if (name.includes(searchTerm) && searchTerm !== "") {
            product.style.display = 'block';
            found = true;
        } else {
            product.style.display = 'none';
        }
    });

    // Nếu không tìm thấy sản phẩm nào khớp hoặc ô trống -> hiện tất cả
    if (!found || searchTerm === "") {
        products.forEach(product => {
            product.style.display = 'block';
        });
    }
});



// Quản lý đăng nhập / avatar / đăng xuất
document.addEventListener("DOMContentLoaded", function () {
  // Cập nhật đường dẫn Đăng nhập trong index.html
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
  // Giả định trang đăng nhập sẽ redirect về index/index.html
  if (window.location.href.includes("dangnhap.html") && localStorage.getItem("isLoggedIn") === "true") {
    // Chỉ cập nhật UI nếu đã đăng nhập thành công
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
    localStorage.removeItem("currentUser"); // Thêm xóa currentUser
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
    window.location.href = "xuathongtin.html"; // Cập nhật đường dẫn
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
// === Giaodien.js: lưu sản phẩm vào localStorage khi bấm "Thêm vào giỏ" ===
(function(){
  function parsePrice(text){
    if(!text) return 0;
    // loại bỏ chữ, dấu, chỉ giữ số
    return Number(String(text).replace(/[^\d]/g,''));
  }

  // key lưu cart
  const CART_KEY = 'watchtime_cart';

  function getCart(){
    try{ return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch(e){ return []; }
  }
  function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

  // thêm nút add-to-cart hiện có => gắn sự kiện
  document.querySelectorAll('.product-card').forEach(card=>{
    const btn = card.querySelector('.add-to-cart');
    if(!btn) return;
    btn.addEventListener('click', ()=> {
      // Lấy id (nếu có), tên, giá
      const id = card.dataset.id || card.querySelector('[data-name]')?.getAttribute('data-name') || card.querySelector('h3')?.textContent?.trim();
      const name = card.querySelector('[data-name]')?.getAttribute('data-name') || card.querySelector('h3')?.textContent?.trim() || 'Sản phẩm';
      // tìm phần hiển thị giá (giả định có class text-indigo-600 chứa số)
      const priceEl = card.querySelector('.text-indigo-600') || card.querySelector('.price') || card.querySelector('p:last-of-type');
      const rawPrice = priceEl ? priceEl.textContent : '';
      const price = parsePrice(rawPrice);

      let cart = getCart();
      const existing = cart.find(it => it.id === id);
      if(existing){
        existing.qty = (existing.qty || 1) + 1;
      } else {
        cart.push({ id, name, price, qty: 1 });
      }
      saveCart(cart);
    });
  });
})();
// Đồng bộ cart-count từ localStorage (dán vào Giaodien.js)
(function syncHeaderCartCount(){
  const CART_KEY = 'watchtime_cart';
  function getCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch(e){ return []; } }
  function updateHeaderCount(){
    const cart = getCart();
    const count = cart.reduce((s,i)=> s + (i.qty || 0), 0);
    const el = document.getElementById('cart-count');
    if(el) el.textContent = count;
  }
  // update ngay khi load
  document.addEventListener('DOMContentLoaded', updateHeaderCount);
  // cung cấp hàm toàn cục để các trang khác gọi khi thay đổi cart
  window.updateHeaderCartCount = updateHeaderCount;
})();

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
    Login:"Đăng nhập",
    AToCard: "Thêm vào giỏ",
  },
  en: {
    Home: "Home",
    Products: "Products",
    About: "About Us",
    Contact: "Contact",
    "hero-title": "Luxury Watch Collection",
    "hero-sub": "Define your style and status with the finest timepieces.",
    explore: "Explore Now",
    Login: "Login",
    AToCard: "Add to Cart",
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


// Phân trang---------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const productsPerPage = 8; // số sản phẩm mỗi trang
    const productCards = Array.from(document.querySelectorAll(".product-card"));
    const paginationContainer = document.getElementById("pagination");

    let currentPage = 1;
    const totalPages = Math.ceil(productCards.length / productsPerPage);

    function showPage(page) {
        // Ẩn tất cả
        productCards.forEach((card, index) => {
            card.style.display = "none";
        });

        // Hiển thị sản phẩm của trang hiện tại
        const start = (page - 1) * productsPerPage;
        const end = start + productsPerPage;
        productCards.slice(start, end).forEach(card => {
            card.style.display = "block";
        });

        // Cập nhật trạng thái nút phân trang
        renderPagination();
    }

    function renderPagination() {
        paginationContainer.innerHTML = "";

        // Nút "Trước"
        const prevBtn = document.createElement("button");
        prevBtn.textContent = "←";
        prevBtn.className = `px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-300 text-gray-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`;
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                showPage(currentPage);
            }
        };
        paginationContainer.appendChild(prevBtn);

        // Nút số trang
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;
            btn.className = `px-3 py-1 rounded-md ${i === currentPage ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`;
            btn.onclick = () => {
                currentPage = i;
                showPage(currentPage);
            };
            paginationContainer.appendChild(btn);
        }

        // Nút "Sau"
        const nextBtn = document.createElement("button");
        nextBtn.textContent = "→";
        nextBtn.className = `px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-300 text-gray-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`;
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                showPage(currentPage);
            }
        };
        paginationContainer.appendChild(nextBtn);
    }

    // Hiển thị trang đầu tiên khi tải
    showPage(currentPage);
});

// === Hiển thị chi tiết sản phẩm tự động đọc từ DOM ===
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('product-detail-overlay');
  const closeBtn = document.getElementById('close-detail');
  const imgEl = document.getElementById('detail-image');
  const nameEl = document.getElementById('detail-name');
  const descEl = document.getElementById('detail-description');
  const categoryEl = document.getElementById('detail-category');
  const priceEl = document.getElementById('detail-price');

  document.querySelectorAll('.xem-chi-tiet').forEach(btn => {
    btn.addEventListener('click', () => {
      // Lấy thẻ cha .product-card
      const card = btn.closest('.product-card');
      if (!card) return;

      const name = card.querySelector('h3')?.textContent?.trim() || 'Không rõ tên';
      const desc = card.querySelector('.text-gray-600')?.textContent?.trim() || 'Không có mô tả';
      const price = card.querySelector('.text-indigo-600')?.textContent?.trim() || '0 VNĐ';
      const category = card.dataset.category || 'Không xác định';
      const img = card.querySelector('img')?.src || '';

      // Gán thông tin vào khung chi tiết
      imgEl.src = img;
      nameEl.textContent = name;
      descEl.textContent = desc;
      categoryEl.textContent = "Thể loại: " + category.charAt(0).toUpperCase() + category.slice(1);
      priceEl.textContent = price;

      // Hiện overlay
      overlay.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  });

  // Đóng overlay
  closeBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  });

  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      overlay.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });
});
