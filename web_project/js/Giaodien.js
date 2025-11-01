/* === PHẦN 1: LOGIC RENDER SẢN PHẨM === */
/* Chúng ta giả định file 'products.js' đã cung cấp 
  một biến global tên là 'allProducts'
  ví dụ: const allProducts = [ { id: 'sp001', name: '...', ... }, ... ];
*/

/**
 * Tạo HTML cho một thẻ sản phẩm
 * @param {object} product - Đối tượng sản phẩm từ allProducts
 * @returns {string} - Chuỗi HTML
 */
function createProductCard(product) {
    // Định dạng mô tả ngắn (nếu có)
    const description = product.description_short ? `<p class="text-sm text-gray-600 mb-2 truncate">${product.description_short}</p>` : '';
    
    // Định dạng giá
    const price = Number(product.price).toLocaleString('vi-VN') + '₫';

    return `
    <div class="product-card bg-white rounded-lg shadow-lg overflow-hidden flex flex-col" data-category="${product.category}" data-id="${product.id}">
        
        <a href="chitiet.html?id=${product.id}" class="block hover:opacity-90 smooth-transition">
            <img src="${product.image}" alt="${product.name}" class="w-full h-56 object-cover">
            <div class="p-4">
                <h3 class="text-lg font-bold text-gray-800 truncate" data-name="${product.name}">${product.name}</h3>
                ${description}
            </div>
        </a>

        <div class="p-4 border-t border-gray-200 mt-auto">
            <div class="flex justify-between items-center">
                <p class="text-lg font-bold text-indigo-600">${price}</p>
                
                <button class="add-to-cart bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 smooth-transition" data-key="AToCard">
                    Thêm vào giỏ
                </button>
            </div>
        </div>
    </div>
    `;
}

/**
 * Render tất cả sản phẩm vào lưới
 * @param {Array} products - Mảng sản phẩm để render
 */
function renderProducts(products) {
    const grid = document.getElementById("product-grid");
    if (!grid) {
        console.error("Không tìm thấy #product-grid.");
        return;
    }
    
    if (products.length === 0) {
        grid.innerHTML = "<p class='text-center col-span-full'>Không có sản phẩm nào để hiển thị.</p>";
    } else {
        grid.innerHTML = products.map(createProductCard).join('');
    }
}


/* === PHẦN 2: LOGIC KHỞI TẠO (CHẠY KHI TẢI TRANG) === */

let allProductCards = []; // Biến global để lưu trữ các thẻ DOM
let currentPage = 1;
const productsPerPage = 8; // số sản phẩm mỗi trang

document.addEventListener("DOMContentLoaded", () => {
    // 1. Render tất cả sản phẩm từ 'allProducts' (file products.js)
    if (typeof allProducts !== 'undefined') {
        renderProducts(allProducts);
    } else {
        console.error("'allProducts' is not defined. Make sure 'products.js' is loaded and correct.");
        const grid = document.getElementById("product-grid");
        if(grid) grid.innerHTML = "<p class='text-red-500 text-center col-span-full'>Lỗi: Không thể tải dữ liệu sản phẩm.</p>";
        return;
    }

    // 2. Tự động gọi hàm render icon của Lucide
    lucide.createIcons();

    // 3. Lấy danh sách các thẻ DOM vừa render
    allProductCards = Array.from(document.querySelectorAll(".product-card"));

    // 4. Khởi tạo Phân trang (dựa trên code cũ của bạn)
    initializePagination();

    // 5. Gắn sự kiện cho các chức năng khác
    initializeFilters();
    initializeSearch();
    initializeLoginUI(); // (Code cũ của bạn)
    initializeAddToCart(); // (Code cũ của bạn, gắn sự kiện cho nút)
    initializeLanguageToggle(); // (Code cũ của bạn)
});

/**
 * Gắn sự kiện cho Lọc và Tìm kiếm
 */
function initializeFilters() {
    document.getElementById("filter-category").addEventListener("change", applyFiltersAndSearch);
    document.getElementById("filter-price").addEventListener("change", applyFiltersAndSearch);
}

function initializeSearch() {
    document.querySelector('#search').addEventListener('input', applyFiltersAndSearch);
}

/**
 * Gắn sự kiện cho các nút "Thêm vào giỏ"
 */
function initializeAddToCart() {
    const CART_KEY = 'watchtime_cart';

    function getCart(){
        try{ return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch(e){ return []; }
    }
    function saveCart(cart){ 
        localStorage.setItem(CART_KEY, JSON.stringify(cart)); 
    }
    
    // Gắn sự kiện cho TẤT CẢ nút add-to-cart
    document.querySelectorAll('.add-to-cart').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Ngăn link (nếu có)
            e.stopPropagation(); // Ngăn sự kiện nổi bọt lên thẻ <a> cha

            if (localStorage.getItem("isLoggedIn") !== "true") {
                alert("Bạn cần đăng nhập để mua hàng!");
                window.location.href = "dangnhap.html";
                return;
            }

            // Tìm thẻ .product-card cha gần nhất
            const card = btn.closest('.product-card');
            if (!card) return;
            
            // Lấy thông tin từ thẻ
            const id = card.dataset.id;
            const name = card.querySelector('[data-name]').textContent;
            const priceText = card.querySelector('.text-indigo-600').textContent;
            const price = parseFloat(priceText.replace(/[^\d]/g, ""));

            let cart = getCart();
            const existing = cart.find(it => it.id === id);
            
            if(existing){
                existing.qty = (existing.qty || 1) + 1;
            } else {
                cart.push({ id, name, price, qty: 1 });
            }
            saveCart(cart);

            // Cập nhật số lượng trên header
            updateHeaderCartCount(); // Hàm này đã có ở dưới

            // Hiệu ứng nhỏ
            const cartCountEl = document.getElementById("cart-count");
            if (cartCountEl) {
                cartCountEl.style.transform = "scale(1.3)";
                setTimeout(() => (cartCountEl.style.transform = "scale(1)"), 150);
            }
        });
    });
}

/* === PHẦN 3: CÁC HÀM TIỆN ÍCH (Lấy từ code gốc của bạn) === */

/**
 * Lọc và tìm kiếm kết hợp
 */
function applyFiltersAndSearch() {
    const category = document.getElementById("filter-category").value;
    const priceRange = document.getElementById("filter-price").value;
    const searchTerm = document.querySelector('#search').value.toLowerCase().trim();

    let filteredProducts = [];

    allProductCards.forEach((product) => {
        const productCategory = product.dataset.category;
        const priceText = product.querySelector(".text-indigo-600").textContent.replace(/[^\d]/g, "");
        const price = parseFloat(priceText);
        const name = product.querySelector("h3").innerText.toLowerCase();

        // --- Kiểm tra theo loại ---
        const matchCategory = category === "all" || productCategory === category;

        // --- Kiểm tra theo giá ---
        let matchPrice = true;
        switch (priceRange) {
            case "5": matchPrice = price < 5000000; break;
            case "10": matchPrice = price < 10000000; break;
            case "15": matchPrice = price < 15000000; break;
            case "20": matchPrice = price < 20000000; break;
            case "over20": matchPrice = price >= 20000000; break;
            default: matchPrice = true;
        }

        // --- Kiểm tra theo tên tìm kiếm ---
        const matchSearch = name.includes(searchTerm);

        // --- Kết hợp ---
        if (matchCategory && matchPrice && matchSearch) {
            product.style.display = "block"; // Hiển thị nếu khớp
            filteredProducts.push(product);
        } else {
            product.style.display = "none"; // Ẩn nếu không khớp
        }
    });
// --- Nếu KHÔNG có sản phẩm nào khớp theo tên tìm kiếm ---
    if (filteredProducts.length === 0) {
        allProductCards.forEach((product) => {
            const productCategory = product.dataset.category;
            const priceText = product.querySelector(".text-indigo-600").textContent.replace(/[^\d]/g, "");
            const price = parseFloat(priceText);

            const matchCategory = category === "all" || productCategory === category;
            let matchPrice = true;
            switch (priceRange) {
                case "5": matchPrice = price < 5000000; break;
                case "10": matchPrice = price < 10000000; break;
                case "15": matchPrice = price < 15000000; break;
                case "20": matchPrice = price < 20000000; break;
                case "over20": matchPrice = price >= 20000000; break;
                default: matchPrice = true;
            }

            if (matchCategory && matchPrice) {
                product.style.display = "block"; // Hiển thị lại toàn bộ trong phạm vi lọc
            } else {
                product.style.display = "none";
            }
        });
    }

    // Sau khi lọc, áp dụng lại phân trang cho KẾT QUẢ ĐÃ LỌC
    currentPage = 1; // Reset về trang 1
    showPage(currentPage, filteredProducts); // Hiển thị trang 1 của kết quả lọc
    renderPagination(filteredProducts); // Vẽ lại nút phân trang cho kết quả lọc
}


/**
 * Khởi tạo Phân trang
 */
function initializePagination() {
    // Hiển thị trang đầu tiên (của tất cả sản phẩm)
    showPage(currentPage, allProductCards);
    // Vẽ các nút phân trang (cho tất cả sản phẩm)
    renderPagination(allProductCards);
}

/**
 * Hiển thị sản phẩm cho một trang cụ thể
 * @param {number} page - Số trang muốn hiển thị
 * @param {Array} productList - Danh sách các thẻ DOM sản phẩm (đã lọc hoặc tất cả)
 */
function showPage(page, productList) {
    // Ẩn tất cả sản phẩm trong danh sách
    productList.forEach((card) => {
        card.style.display = "none";
    });

    // Hiển thị sản phẩm của trang hiện tại
    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;
    const pageProducts = productList.slice(start, end);
    
    pageProducts.forEach(card => {
        card.style.display = "block"; // 'block' hoặc 'flex' tùy thuộc vào CSS
    });
}

/**
 * Vẽ lại các nút phân trang
 * @param {Array} productList - Danh sách các thẻ DOM sản phẩm (để tính tổng số trang)
 */
function renderPagination(productList) {
    const paginationContainer = document.getElementById("pagination");
    if (!paginationContainer) return;

    const totalPages = Math.ceil(productList.length / productsPerPage);
    paginationContainer.innerHTML = ""; // Xóa nút cũ

    if (totalPages <= 1) return; // Không cần phân trang nếu chỉ có 1 trang

    // Nút "Trước"
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "←";
    prevBtn.className = `px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-300 text-gray-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`;
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage, productList);
            renderPagination(productList); // Cập nhật lại nút
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
            showPage(currentPage, productList);
            renderPagination(productList); // Cập nhật lại nút
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
            showPage(currentPage, productList);
            renderPagination(productList); // Cập nhật lại nút
        }
    };
    paginationContainer.appendChild(nextBtn);
}


/**
 * Quản lý đăng nhập / avatar / đăng xuất
 */
function initializeLoginUI() {
    const loginLink = document.querySelector('a[href="dangnhap.html"]');
    const userAvatar = document.getElementById("user-avatar");
    const userMenu = document.getElementById("user-menu");
    
  // Kiểm tra nếu các element tồn tại
    if (!loginLink || !userAvatar || !userMenu) {
        console.warn("Một số element của UI đăng nhập không tìm thấy.");
        return;
    }
    
    const logoutBtn = userMenu.querySelector("a:last-child");
    const infoBtn = userMenu.querySelector("a:first-child");

    let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    function updateLoginUI() {
    if (isLoggedIn) {
        loginLink.classList.add("hidden");
        userAvatar.classList.remove("hidden");
        userAvatar.classList.add("flex");
    } else {
        loginLink.classList.remove("hidden");
        userAvatar.classList.add("hidden");
      localStorage.removeItem("isLoggedIn"); // Đảm bảo dọn dẹp
    }
    }

    updateLoginUI();

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
    localStorage.removeItem("currentUser");
    localStorage.removeItem("watchtime_cart"); // Xóa giỏ hàng khi đăng xuất
    isLoggedIn = false;
    updateLoginUI();
    userMenu.classList.add("hidden");
    updateHeaderCartCount(); // Cập nhật giỏ hàng về 0
    });

  // Khi click "Thông tin cá nhân"
    infoBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "xuathongtin.html";
    });
}


/**
 * Đồng bộ cart-count từ localStorage (Code gốc của bạn)
 */
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
