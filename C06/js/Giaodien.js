/* === PHẦN 1: LOGIC RENDER SẢN PHẨM === */

/**
 * Tạo HTML cho một thẻ sản phẩm
 * @param {object} product - Đối tượng sản phẩm
 * @returns {string} - Chuỗi HTML
 */
function createProductCard(product) {
    const description = product.description_short ? `<p class="text-gray-600 mb-4">${product.description_short}</p>` : '<p class="text-gray-600 mb-4">&nbsp;</p>';
    const price = Number(product.price).toLocaleString('vi-VN') + ' VNĐ';

    // === Sửa lỗi ngôn ngữ ===
    const stock = globalInventory.get(product.id) || 0;
    let stockHtml = '';
    let cartButtonHtml = '';

    if (stock > 0) {
        // Tách label (có data-key) và value (không có data-key) ra 2 span
        stockHtml = `
            <p class="text-sm text-gray-500">
                <span data-key="Stock">Tồn kho:</span>
                <span class="font-semibold text-green-600"> ${stock}</span>
            </p>`;
        
        cartButtonHtml = `<button class="text-white bg-indigo-600 py-2 px-4 rounded-lg add-to-cart" data-key="AToCard">Thêm vào giỏ</button>`;
    } else {
        // "Hết hàng" là một chuỗi đơn, không có số, nên giữ nguyên
        stockHtml = `<p class="text-sm text-red-500 font-bold" data-key="OutOfStock">Hết hàng</p>`;
        cartButtonHtml = `<button class="text-white bg-gray-400 py-2 px-4 rounded-lg cursor-not-allowed" disabled data-key="OutOfStock">Hết hàng</button>`;
    }

    return `
    <div class="product-card bg-white rounded-lg shadow-md overflow-hidden group" data-category="${product.category}" data-id="${product.id}">
        <div class="relative overflow-hidden">
            <a href="chitiet.html?id=${product.id}" class="block">
                <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover group-hover:scale-110 smooth-transition">
            </a>
            <div class="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 smooth-transition">
                ${cartButtonHtml}
            </div>
        </div>
        <div class="p-6">
            <h3 class="text-xl font-semibold mb-2" data-name="${product.name}">${product.name}</h3>
            ${description}
            <p class="text-2xl font-bold text-indigo-600">${price}</p>
            
            <div class="mt-3">
                ${stockHtml}
            </div>
            
            <a href="chitiet.html?id=${product.id}" class="btn btn-outline-primary flex justify-center mt-3 mt-3 xem-chi-tiet" data-key="ViewDetails">Xem chi tiết</a>
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
    
    // Nếu mảng rỗng, gán innerHTML (để xóa sản phẩm cũ)
    if (!products || products.length === 0) {
        grid.innerHTML = "<p class='text-center col-span-full'>Không có sản phẩm nào để hiển thị. Vui lòng thêm sản phẩm ở trang Admin.</p>";
    } else {
        grid.innerHTML = products.map(createProductCard).join('');
    }
}


/* === PHẦN 2: LOGIC KHỞI TẠO (CHẠY KHI TẢI TRANG) === */

let allProductCards = []; // Biến global để lưu trữ các thẻ DOM
let currentPage = 1;
const productsPerPage = 8; // số sản phẩm mỗi trang
let globalInventory = new Map(); 

// Tạo một biến cục bộ để lưu trữ dữ liệu sản phẩm,
// thay vì phụ thuộc vào 'allProducts' (chỉ tải 1 lần) từ 'products.js'
let currentProductData = [];

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Kiểm tra 'allProducts' (từ products.js) và 'allCategories' (từ categories.js)
    if (typeof allProducts === 'undefined') {
        console.error("'allProducts' is not defined. Make sure 'products.js' is loaded first.");
        const grid = document.getElementById("product-grid");
        if(grid) grid.innerHTML = "<p class='text-red-500 text-center col-span-full'>Lỗi: Không thể tải dữ liệu sản phẩm.</p>";
        return;
    }
    if (typeof allCategories === 'undefined') {
        console.error("'allCategories' is not defined. Make sure 'categories.js' is loaded first.");
    }

    // 2. Sao chép dữ liệu ban đầu vào biến cục bộ
    //    Chúng ta dùng biến 'allProducts' (từ products.js) làm dữ liệu ban đầu
    currentProductData = [...allProducts];

    // 3. Tính tồn kho (dựa trên dữ liệu cục bộ)
    globalInventory = calculateAllInventory(currentProductData);

    // 4. Render sản phẩm (dựa trên dữ liệu cục bộ)
    renderProducts(currentProductData);

    // 5. Tự động gọi hàm render icon của Lucide
    lucide.createIcons();

    // 6. Lấy danh sách các thẻ DOM vừa render
    allProductCards = Array.from(document.querySelectorAll(".product-card"));

    // 7. Khởi tạo Phân trang
    initializePagination();

    // 8. Gắn sự kiện cho các chức năng khác
    loadCategoryFilter(); // Sẽ dùng 'allCategories'
    initializeFilters();
    initializeSearch();
    initializeLoginUI();
    initializeAddToCart();
    initializeLanguageToggle();
    initializeMobileMenu();

    // Khởi chạy bộ lắng nghe thay đổi
    initializeStorageListener();
});

/**
 * Gắn sự kiện cho Lọc
 */
function initializeFilters() {
    const categorySelect = document.getElementById("filter-category");
    const priceSelect = document.getElementById("filter-price");
    
    if (categorySelect) categorySelect.addEventListener("change", applyFiltersAndSearch);
    if (priceSelect) priceSelect.addEventListener("change", applyFiltersAndSearch);
}

/**
 * Gắn sự kiện cho Tìm kiếm
 */
function initializeSearch() {
    const searchInput = document.querySelector('#search');
    if (searchInput) searchInput.addEventListener('input', applyFiltersAndSearch);
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
    
    const productGrid = document.getElementById("product-grid");
    if (!productGrid) return;

    productGrid.addEventListener('click', (e) => {
        if (!e.target.classList.contains('add-to-cart')) {
            return;
        }
        
        e.preventDefault();
        e.stopPropagation();

        const btn = e.target;

        // 1. Kiểm tra nút bị vô hiệu hóa (HẾT HÀNG)
        if (btn.disabled) {
            alert("Sản phẩm này hiện đã hết hàng!");
            return;
        }
        
        const card = btn.closest('.product-card');
        if (!card) return;
        
        const id = card.dataset.id;

        // 2. Kiểm tra tồn kho thực tế
        const stock = globalInventory.get(id) || 0;
        if (stock <= 0) {
            alert("Sản phẩm này hiện đã hết hàng!");
            // Cập nhật lại UI nút lỡ như có lỗi
            btn.disabled = true;
            btn.textContent = "Hết hàng";
            btn.classList.remove("bg-indigo-600");
            btn.classList.add("bg-gray-400", "cursor-not-allowed");
            return;
        }

        if (localStorage.getItem("isLoggedIn") !== "true") {
            alert("Bạn cần đăng nhập để mua hàng!");
            window.location.href = "dangnhap.html";
            return;
        }

        const product = currentProductData.find(p => p.id === id); // Sửa: Dùng currentProductData
        if (!product) {
            console.error("Không tìm thấy sản phẩm với ID:", id);
            return;
        }

        let cart = getCart();
        const existing = cart.find(it => it.id === id);
        
        // === KIỂM TRA SỐ LƯỢNG TRONG GIỎ ===
        const qtyInCart = existing ? existing.qty : 0;
        if (qtyInCart >= stock) {
            alert("Bạn đã thêm số lượng tối đa của sản phẩm này vào giỏ hàng.");
            return;
        }
        
        if(existing){
            existing.qty = (existing.qty || 1) + 1;
        } else {
            cart.push({ id: product.id, name: product.name, price: product.price, qty: 1, image: product.image });
        }
        saveCart(cart);

        updateHeaderCartCount(); 

        const cartCountEl = document.getElementById("cart-count");
        if (cartCountEl) {
            cartCountEl.style.transform = "scale(1.3)";
            setTimeout(() => (cartCountEl.style.transform = "scale(1)"), 150);
        }
    });
}


/**
 * Gắn sự kiện cho Đa ngôn ngữ (ĐÃ CẬP NHẬT)
 */
function initializeLanguageToggle() {
    let currentLang = "vi";
    const langToggleBtns = document.querySelectorAll('[data-role="lang-switcher"]'); 

    const translations = {
        vi: {
            Home: "Trang Chủ",
            Products: "Sản Phẩm",
            About: "Về Chúng Tôi",
            Contact: "Liên Hệ",
            "hero-title": "Bộ Sưu Tập Đồng Hồ Đẳng Cấp",
            "hero-sub": "Khẳng định phong cách và vị thế của bạn với những chiếc đồng hồ tinh xảo nhất.",
            explore: "Khám Phá Ngay",
            Login: "Đăng nhập",
            AToCard: "Thêm vào giỏ",
            Profile: "Thông tin cá nhân",
            OrderHistory: "Đơn hàng đã đặt",
            Logout: "Đăng xuất",
            SearchPlaceholder: "Tìm kiếm...",
            FeaturedProducts: "Sản Phẩm Nổi Bật",
            FeaturedProductsSub: "Những mẫu đồng hồ được yêu thích nhất tại WatchTime",
            Category: "Thể loại:",
            All: "Tất cả",
            MenWatch: "Đồng hồ Nam",
            WomenWatch: "Đồng hồ Nữ",
            CoupleWatch: "Đồng hồ Đôi",
            AllPrices: "Tất cả giá",
            PriceUnder5: "Dưới 5 triệu",
            PriceUnder10: "Dưới 10 triệu",
            PriceUnder15: "Dưới 15 triệu",
            PriceUnder20: "Dưới 20 triệu",
            PriceOver20: "Trên 20 triệu",
            AboutWatchTime: "Về WatchTime",
            AboutP1: "WatchTime được thành lập với niềm đam mê cháy bỏng dành cho những cỗ máy thời gian. Chúng tôi cam kết mang đến cho khách hàng những sản phẩm đồng hồ chính hãng từ các thương hiệu hàng đầu thế giới, cùng với dịch vụ khách hàng chuyên nghiệp và tận tâm.",
            AboutP2: "Mỗi chiếc đồng hồ tại WatchTime không chỉ là một công cụ xem giờ, mà còn là một tác phẩm nghệ thuật, một người bạn đồng hành và một lời khẳng định cho phong cách cá nhân của bạn.",
            FooterSlogan: "Nơi thời gian và phong cách hội tụ. Cung cấp đồng hồ chính hãng, uy tín và chất lượng.",
            FooterLinks: "Liên kết",
            FooterContact: "Thông Tin Liên Hệ",
            Address: "123 Đường ABC, Quận 1, TP. Hồ Chí Minh",
            Copyright: "© 2024 WatchTime. Đã đăng ký bản quyền.",
            Stock: "Tồn kho:",
            OutOfStock: "Hết hàng",
            ViewDetails: "Xem chi tiết"
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
            Profile: "Profile",
            OrderHistory: "Order History",
            Logout: "Logout",
            SearchPlaceholder: "Search...",
            FeaturedProducts: "Featured Products",
            FeaturedProductsSub: "The most popular watch models at WatchTime",
            Category: "Category:",
            All: "All",
            MenWatch: "Men's Watches",
            WomenWatch: "Women's Watches",
            CoupleWatch: "Couple's Watches",
            AllPrices: "All Prices",
            PriceUnder5: "Under 5 mil",
            PriceUnder10: "Under 10 mil",
            PriceUnder15: "Under 15 mil",
            PriceUnder20: "Under 20 mil",
            PriceOver20: "Over 20 mil",
            AboutWatchTime: "About WatchTime",
            AboutP1: "WatchTime was founded with a burning passion for timepieces. We are committed to providing customers with genuine watch products from the world's leading brands, along with professional and dedicated customer service.",
            AboutP2: "Each watch at WatchTime is not just a time-telling tool, but also a work of art, a companion, and a statement of your personal style.",
            FooterSlogan: "Where time and style converge.Providing genuine, reputable, and quality watches.",
            FooterLinks: "Links",
            FooterContact: "Contact Info",
            Address: "123 ABC Street, District 1, Ho Chi Minh City",
            Copyright: "© 2024 WatchTime. All rights reserved.",
            Stock: "Stock:",
            OutOfStock: "Out of Stock",
            ViewDetails: "View Details"
        },
    };

    function updateLanguage() {
        const lang = translations[currentLang];
        document.querySelectorAll("[data-key]").forEach((el) => {
            const key = el.getAttribute("data-key");
            
            if (key === "SearchPlaceholder" && el.tagName === "INPUT") {
                if (lang[key]) el.placeholder = lang[key];
            }
            else {
                if (lang[key]) el.textContent = lang[key];
            }
        });
    }

    // Đưa hàm updateLanguage ra ngoài để code khác có thể gọi
    window.runLanguageUpdater = updateLanguage;

    if (langToggleBtns.length > 0) {
        langToggleBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                currentLang = currentLang === "vi" ? "en" : "vi";
                langToggleBtns.forEach(b => b.textContent = currentLang === "vi" ? "VI" : "EN");
                updateLanguage();
            });
        });
    }
}


/* === PHẦN 3: CÁC HÀM TIỆN ÍCH (Lọc, Phân trang, Login) === */

/**
 * TẢI DYNAMIC: Tải danh sách loại sản phẩm
 */
function loadCategoryFilter() {
    const categorySelect = document.getElementById('filter-category');
    if (!categorySelect) return;

    // === Xóa các option cũ (trừ option "Tất cả") ===
    const options = categorySelect.querySelectorAll('option:not([value="all"])');
    options.forEach(o => o.remove());
    // === KẾT THÚC NÂNG CẤP ===

    // 1. Kiểm tra biến global 'allCategories' (từ file categories.js)
    if (typeof allCategories === 'undefined' || allCategories.length === 0) {
        console.error("Lỗi: Biến 'allCategories' không tồn tại hoặc bị rỗng.");
        return;
    }

    // 2. Lặp qua mảng allCategories và tạo <option>
    allCategories.forEach(category => {
        const option = document.createElement('option');
        
        option.value = category.id;
        option.textContent = category.name;
        option.dataset.key = category.name; // Giữ lại để đổi ngôn ngữ

        categorySelect.appendChild(option);
    });
}


/**
 * Lọc và tìm kiếm kết hợp
 */
function applyFiltersAndSearch() {
    const category = document.getElementById("filter-category").value;
    const priceRange = document.getElementById("filter-price").value;
    const searchTerm = document.querySelector('#search').value.toLowerCase().trim();

    // THAY ĐỔI: Đổi tên biến để rõ nghĩa hơn
    let filterMatchedProducts = []; // Danh sách lọc theo Category và Price

    // === BƯỚC 1: Lọc theo Category và Price ===
    allProductCards.forEach((product) => {
        const productCategory = product.dataset.category;
        const priceText = product.querySelector(".text-indigo-600").textContent.replace(/[^\d]/g, "");
        const price = parseFloat(priceText);
        // THAY ĐỔI: Không cần lấy 'name' ở bước này nữa

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
        // THAY ĐỔI: Bỏ điều kiện 'matchSearch' khỏi đây
        
        // THAY ĐỔI: Chỉ kiểm tra 2 điều kiện lọc
        if (matchCategory && matchPrice) {
            filterMatchedProducts.push(product);
        }
    });

    // === BƯỚC 2: Xử lý tìm kiếm (Search) dựa trên yêu cầu mới ===
    
    // THAY ĐỔI: (Đây là phần logic mới hoàn toàn)
    // 1. Mặc định, danh sách cuối cùng là danh sách đã lọc (Cat/Price)
    let finalProductList = filterMatchedProducts;

    // 2. Chỉ chạy tìm kiếm nếu người dùng có nhập chữ
    if (searchTerm.length > 0) {
        // 3. Thử lọc tìm kiếm từ danh sách BƯỚC 1
        const searchMatchedProducts = filterMatchedProducts.filter(product => {
            const name = product.querySelector("h3").innerText.toLowerCase();
            return name.includes(searchTerm);
        });

        // 4. Chỉ cập nhật danh sách cuối cùng NẾU tìm kiếm có kết quả
        if (searchMatchedProducts.length > 0) {
            finalProductList = searchMatchedProducts;
        }
        // 5. Nếu không (tìm sai), finalProductList sẽ giữ nguyên kết quả của BƯỚC 1
    }
    
    // === BƯỚC 3: Render dựa trên danh sách cuối cùng ===
    currentPage = 1;
    
    // THAY ĐỔI: Sử dụng 'finalProductList' thay vì 'filteredProducts'
    showPage(currentPage, finalProductList); 
    renderPagination(finalProductList);
}


/**
 * Khởi tạo Phân trang
 */
function initializePagination() {
    showPage(currentPage, allProductCards);
    renderPagination(allProductCards);
}

/**
 * Hiển thị sản phẩm cho một trang cụ thể
 */
function showPage(page, productList) {
    // Tắt tất cả sản phẩm đang có trong DOM
    allProductCards.forEach((card) => {
        card.style.display = "none";
    });

    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;
    const pageProducts = productList.slice(start, end);
    
    const grid = document.getElementById("product-grid");
    
    // Nâng cấp: Không xóa grid.innerHTML
    // Chỉ hiển thị các card trong trang này
    if (pageProducts.length > 0) {
        pageProducts.forEach(card => {
            card.style.display = "block";
            // Đảm bảo card có trong grid (cho lần render đầu tiên)
            if (!grid.contains(card)) {
                    grid.appendChild(card);
            }
        });
    } else {
        // Nếu không có sản phẩm nào (do lọc), hiển thị thông báo
        // Xóa các sản phẩm cũ (nếu có)
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild);
        }
        grid.innerHTML = "<p class='text-center col-span-full text-gray-600'>Không tìm thấy sản phẩm nào khớp với bộ lọc.</p>";
    }
}


/**
 * Vẽ lại các nút phân trang
 */
function renderPagination(productList) {
    const paginationContainer = document.getElementById("pagination");
    if (!paginationContainer) return;

    const totalPages = Math.ceil(productList.length / productsPerPage);
    const currentHeight = paginationContainer.offsetHeight;
    if (currentHeight > 0) {
        paginationContainer.style.minHeight = `${currentHeight}px`;
    }
    paginationContainer.innerHTML = "";

    if (totalPages <= 1) {
        paginationContainer.style.minHeight = 'auto';
        return;
    }//Nếu có 1 trang thì không cần phân trang

    // Nút "Trước"
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "←";
    prevBtn.className = `px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-300 text-gray-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`;
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage, productList);
            renderPagination(productList);
            scrollToProductTop();
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
            renderPagination(productList);
            scrollToProductTop();
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
            renderPagination(productList);
            scrollToProductTop();
        }
    };
    paginationContainer.appendChild(nextBtn);
    paginationContainer.style.minHeight = 'auto';
}

/**
 * Cuộn màn hình lên đầu lưới sản phẩm
 */
/**
 * Cuộn màn hình lên đầu lưới sản phẩm (ĐÃ NÂNG CẤP CHO MOBILE)
 */
function scrollToProductTop() {
    // 1. Tìm element mục tiêu
    let targetElement = document.querySelector('[data-key="FeaturedProducts"]');
    if (!targetElement) {
        targetElement = document.getElementById("product-grid");
    }

    if (targetElement) {
        // 2. Lấy chiều cao của header (nếu có)
        // Chúng ta giả định header của bạn là <header>
        // Nếu nó là một ID khác (ví dụ: #main-nav), hãy thay 'header' bên dưới
        const header = document.querySelector('header'); 
        const headerHeight = header ? header.offsetHeight : 0;

        // 3. Tính toán vị trí
        // Lấy vị trí của element so với top của toàn bộ trang
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        
        // Vị trí cuộn cuối cùng, trừ đi chiều cao header và thêm 1 chút đệm (10px)
        const offsetPosition = elementPosition - headerHeight - 10; 

        // 4. Sử dụng window.scrollTo() - đáng tin cậy hơn 'scrollIntoView'
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth' 
            // Nếu 'smooth' vẫn giật, hãy thử đổi thành 'auto'
        });
    }
}

/**
 * Quản lý đăng nhập / avatar / đăng xuất
 */
function initializeLoginUI() {
    const loginLink = document.querySelector('a[href="dangnhap.html"]');
    const userAvatar = document.getElementById("user-avatar");
    const userMenu = document.getElementById("user-menu");
    
  // Thêm cho menu mobile
    const mobileLoginLink = document.querySelector('#mobile-menu a[href="dangnhap.html"]');
    const mobileUserMenu = document.getElementById('mobile-user-menu');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');

    if (!loginLink || !userAvatar || !userMenu) {
        console.warn("Một số element của UI đăng nhập không tìm thấy.");
        return;
    }
    
    const logoutBtn = userMenu.querySelector("a[href='#']");
    const infoBtn = userMenu.querySelector("a[href='xuathongtin.html']");
    const historyBtn = userMenu.querySelector("a[href='lichsu.html']");

    let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    function updateLoginUI() {
    if (isLoggedIn) {
      // Desktop
      loginLink.classList.add("hidden"); // Chỉ ẩn nút đăng nhập
        userAvatar.classList.remove("hidden");
        userAvatar.classList.add("flex");

      // Mobile
        if(mobileLoginLink) mobileLoginLink.classList.add("hidden");
        if(mobileUserMenu) mobileUserMenu.classList.remove("hidden");
        
    } else {
      // Desktop
      loginLink.classList.remove("hidden"); // Chỉ hiện nút đăng nhập
        userAvatar.classList.add("hidden");

      // Mobile
        if(mobileLoginLink) mobileLoginLink.classList.remove("hidden");
        if(mobileUserMenu) mobileUserMenu.classList.add("hidden");
    }
    }

    updateLoginUI();

    userAvatar.addEventListener("click", function (e) {
    e.stopPropagation();
    userMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", function (e) {
    if (!userAvatar.contains(e.target) && !userMenu.contains(e.target)) {
        userMenu.classList.add("hidden");
    }
    });
// Hàm đăng xuất
    function doLogout() {
        if (confirm("Bạn có chắc muốn đăng xuất?")) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("watchtime_cart");
        isLoggedIn = false;
        updateLoginUI();
        userMenu.classList.add("hidden");
        updateHeaderCartCount();
        window.location.reload();
    }
    }

    if(logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
        e.preventDefault();
        doLogout();
    });
    }
  // Gắn sự kiện cho nút logout mobile
    if(mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            doLogout();
        });
    }

    if (infoBtn) {
    infoBtn.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "xuathongtin.html";
    });
    }
    
    if (historyBtn) {
    historyBtn.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "lichsu.html";
    });
    }
}

/**
 * Gắn sự kiện cho menu mobile (hamburger)
 */
function initializeMobileMenu() {
    const menuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    if (!menuBtn || !mobileMenu) {
        // Tìm nút hamburger trong index.html gốc
        const hamburgerBtn = document.querySelector('button.md\\:hidden[data-lucide="menu"]');
        if(hamburgerBtn) {
                console.warn("Nút menu mobile thiếu ID 'mobile-menu-btn'.");
             // Nếu người dùng muốn chức năng mobile, họ cần thêm ID vào HTML
        } else {
                console.warn("Không tìm thấy nút hoặc menu mobile.");
        }
        return;
    }

    menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle("hidden");
    });

    // Đóng menu khi nhấp vào một link
    mobileMenu.querySelectorAll("a").forEach(link => {
        // Không đóng menu nếu là link đăng xuất/thông tin (vì chúng không cuộn trang)
        if(link.getAttribute('href') === '#' || link.getAttribute('href') === 'xuathongtin.html' || link.getAttribute('href') === 'lichsu.html') {
            return;
        }
        
        link.addEventListener("click", () => {
            mobileMenu.classList.add("hidden");
        });
    });
    
    // Đóng menu khi bấm ra ngoài
    document.addEventListener("click", function (e) {
        if (!mobileMenu.classList.contains('hidden') && !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            mobileMenu.classList.add("hidden");
        }
    });
}


/**
 * Đồng bộ cart-count từ localStorage
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
    
    document.addEventListener('DOMContentLoaded', updateHeaderCount);
    window.updateHeaderCartCount = updateHeaderCount;
})();
// Hiệu ứng xuất hiện khi cuộn
window.addEventListener('scroll', function() {
    const cards = document.querySelectorAll('.product-card');
  const triggerBottom = window.innerHeight * 0.85;

    cards.forEach(card => {
    const cardTop = card.getBoundingClientRect().top;
    if (cardTop < triggerBottom) {
        card.classList.add('show');
    } else {
        card.classList.remove('show');
    }
    });
});


/* === PHẦN 4: CODE TÍNH TỒN KHO === */
const IMPORTS_KEY = 'watchtime_imports';
const ORDERS_KEY = 'allOrders';

/**
 * Hàm helper để đọc data từ LocalStorage
 */
function getStorageData(key, defaultValue = []) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        console.error(`Lỗi khi đọc ${key}:`, e);
        return defaultValue;
    }
}

/**
 * TÍNH TOÁN TỒN KHO
 * Chấp nhận một mảng sản phẩm làm tham số
 */
function calculateAllInventory(productsToCalc) {
    // Lấy TẤT CẢ phiếu nhập/xuất đã hoàn thành
    const allImports = getStorageData(IMPORTS_KEY, []).filter(i => i.status === 'Đã hoàn thành'); 
    const allOrders = getStorageData(ORDERS_KEY, []).filter(o => o.status === 'Đã giao'); 
    
    const inventoryMap = new Map();

    productsToCalc.forEach(prod => {
        const id = prod.id;
        let tongNhap = 0;
        let tongXuat = 0;

        // 1. Tính toán Nhập
        allImports.forEach(imp => {
            const item = imp.items.find(i => i.productId === id);
            if (item) {
                tongNhap += item.qty;
            }
        });

        // 2. Tính toán Xuất
        allOrders.forEach(order => {
            const item = order.items.find(i => i.id === id); 
            if (item) {
                tongXuat += item.qty;
            }
        });
        
        // 3. Tính Tồn
        const ton = tongNhap - tongXuat;
        inventoryMap.set(id, ton);
    });
    
    return inventoryMap;
}

/* === PHẦN 5: TỰ ĐỘNG CẬP NHẬT (NÂNG CẤP) === */

/**
 * (Helper) Hàm này thực hiện refresh lại toàn bộ lưới sản phẩm
 */
function runFullProductUpdate() {
    // 1. Tính toán lại tồn kho (dựa trên 'currentProductData' đã được cập nhật)
    globalInventory = calculateAllInventory(currentProductData);
    
    // 2. Vẽ lại toàn bộ thẻ HTML
    renderProducts(currentProductData);
    
    // 3. Lấy lại tham chiếu đến các thẻ MỚI
    allProductCards = Array.from(document.querySelectorAll(".product-card"));
    
    // 4. Áp dụng lại bộ lọc/tìm kiếm (hàm này sẽ tự xử lý phân trang)
    applyFiltersAndSearch();

    // 5. Cập nhật lại icon và ngôn ngữ cho các thẻ MỚI
    lucide.createIcons();
    if (typeof window.runLanguageUpdater === 'function') {
        window.runLanguageUpdater();
    }
}

/**
 * Xử lý các thay đổi từ localStorage
 */
function handleStorageChange(e) {
    if (!e.key) return; // Bỏ qua nếu không có key
    
    console.log(`Phát hiện thay đổi localStorage từ tab khác: ${e.key}`);

    switch (e.key) {
        // TRƯỜNG HỢP 1: ADMIN SỬA THỂ LOẠI
        case CATEGORY_KEY:
            // 1. Lấy dữ liệu thể loại mới
            const newCategories = getStorageData(CATEGORY_KEY);
            // 2. Cập nhật biến global (mà file categories.js đã tạo)
            window.allCategories = newCategories;
            // 3. Vẽ lại chỉ bộ lọc <select>
            loadCategoryFilter();
            // 4. Cập nhật ngôn ngữ cho bộ lọc
            if (typeof window.runLanguageUpdater === 'function') {
                window.runLanguageUpdater();
            }
            break;

        // TRƯỜNG HỢP 2: ADMIN SỬA SẢN PHẨM
        case PRODUCTS_KEY:
            // 1. Lấy dữ liệu sản phẩm mới
            const newProducts = getStorageData(PRODUCTS_KEY);
            // 2. Cập nhật biến dữ liệu cục bộ
            currentProductData = newProducts;
            // 3. Chạy refresh toàn bộ lưới sản phẩm
            runFullProductUpdate();
            break;

        // TRƯỜNG HỢP 3: ADMIN NHẬP HÀNG HOẶC USER MUA HÀNG
        case IMPORTS_KEY:
        case ORDERS_KEY:
            // Chỉ cần tính lại tồn kho và refresh lưới (sản phẩm không đổi)
            runFullProductUpdate();
            break;
    }
}

/**
 * Khởi chạy bộ lắng nghe
 */
function initializeStorageListener() {
    window.addEventListener('storage', handleStorageChange);
}
/* === PHẦN 6: XỬ LÝ TỰ ĐỘNG PHÁT VIDEO (MOBILE) === */
document.addEventListener('DOMContentLoaded', () => {
  const video = document.querySelector('video');
  const playVideo = () => {
    video.play().catch(()=>{});
    document.removeEventListener('touchstart', playVideo);
    document.removeEventListener('click', playVideo);
  };
  document.addEventListener('touchstart', playVideo);
  document.addEventListener('click', playVideo);
});