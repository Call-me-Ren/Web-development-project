/* === PHẦN 1: LOGIC RENDER SẢN PHẨM === */

/**
 * Tạo HTML cho một thẻ sản phẩm
 * @param {object} product - Đối tượng sản phẩm từ allProducts
 * @returns {string} - Chuỗi HTML
 */
function createProductCard(product) {
    const description = product.description_short ? `<p class="text-gray-600 mb-4">${product.description_short}</p>` : '<p class="text-gray-600 mb-4">&nbsp;</p>';
    const price = Number(product.price).toLocaleString('vi-VN') + ' VNĐ';

    // === BẮT ĐẦU THAY ĐỔI: LOGIC TỒN KHO ===
    const stock = globalInventory.get(product.id) || 0;
    let stockHtml = '';
    let cartButtonHtml = '';

    if (stock > 0) {
        // Nếu còn hàng, hiển thị số lượng và nút 'Thêm vào giỏ'
        stockHtml = `<p><span data-key="Stock">Tồn kho:</span> <span> ${stock}</span></p>`;
        cartButtonHtml = `<button class="text-white bg-indigo-600 py-2 px-4 rounded-lg add-to-cart" data-key="AToCard">Thêm vào giỏ</button>`;
    } else {
        // Nếu hết hàng, hiển thị thông báo và vô hiệu hóa nút
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
                ${cartButtonHtml} </div>
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
let globalInventory = new Map(); // Biến global lưu tồn kho

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Kiểm tra 'allProducts' đã tải chưa
    if (typeof allProducts !== 'undefined') {
        // Tốt, 'allProducts' đã có
    } else {
        console.error("'allProducts' is not defined. Make sure 'products.js' is loaded first and correct.");
        const grid = document.getElementById("product-grid");
        if(grid) grid.innerHTML = "<p class='text-red-500 text-center col-span-full'>Lỗi: Không thể tải dữ liệu sản phẩm.</p>";
        return;
    }
    // TÍNH TOÁN TỒN KHO CHO TẤT CẢ SẢN PHẨM
    globalInventory = calculateAllInventory();

    // 1. Render sản phẩm lên giao diện
    renderProducts(allProducts);

    // 2. Tự động gọi hàm render icon của Lucide
    lucide.createIcons();

    // 3. Lấy danh sách các thẻ DOM vừa render
    allProductCards = Array.from(document.querySelectorAll(".product-card"));

    // 4. Khởi tạo Phân trang
    initializePagination();

    // 5. Gắn sự kiện cho các chức năng khác
    loadCategoryFilter();
    initializeFilters();
    initializeSearch();
    initializeLoginUI();
    initializeAddToCart(); // Hàm này cũng được cập nhật
    initializeLanguageToggle(); // Hàm này cũng được cập nhật
    initializeMobileMenu();
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


        // 1. Kiểm tra nút bị vô hiệu hóa
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

        const product = allProducts.find(p => p.id === id);
        if (!product) {
            console.error("Không tìm thấy sản phẩm với ID:", id);
            return;
        }

        let cart = getCart();
        const existing = cart.find(it => it.id === id);
        
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
            ViewDetails: "Xem chi tiết",
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
            ViewDetails: "View Details",
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

    window.runLanguageUpdater = updateLanguage;

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
 * TẢI DYNAMIC: Tải danh sách loại sản phẩm từ LocalStorage
 */
function loadCategoryFilter() {
    const categorySelect = document.getElementById('filter-category');
    if (!categorySelect) return;
    const KEY_NAME = 'watchtime_categories';
    const categories = JSON.parse(localStorage.getItem(KEY_NAME)) || [];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        option.dataset.key = category.name;
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

    let filteredProducts = [];

    allProductCards.forEach((product) => {
        const productCategory = product.dataset.category;
        const priceText = product.querySelector(".text-indigo-600").textContent.replace(/[^\d]/g, "");
        const price = parseFloat(priceText);
        const name = product.querySelector("h3").innerText.toLowerCase();

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
        const matchSearch = name.includes(searchTerm);

        if (matchCategory && matchPrice && matchSearch) {
            filteredProducts.push(product);
        }
        product.style.display = "none";
    });


        if (filteredProducts.length === 0 && searchTerm !== "") {
        filteredProducts = allProductCards.filter((product) => {
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
            }
            return matchCategory && matchPrice;
        });
    }

    currentPage = 1;
    showPage(currentPage, filteredProducts);
    renderPagination(filteredProducts);
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
    productList.forEach((card) => {
        card.style.display = "none";
    });

    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;
    const pageProducts = productList.slice(start, end);
    
    const grid = document.getElementById("product-grid");
    
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
    
    if (pageProducts.length > 0) {
        pageProducts.forEach(card => {
            card.style.display = "block";
            grid.appendChild(card);
        });
    } else {
        if (productList.length === 0 && allProductCards.length > 0) {
            grid.innerHTML = "<p class='text-center col-span-full text-gray-600'>Không tìm thấy sản phẩm nào khớp với bộ lọc.</p>";
        }
    }
}


/**
 * Vẽ lại các nút phân trang
 */
function renderPagination(productList) {
    const paginationContainer = document.getElementById("pagination");
    if (!paginationContainer) return;

    const totalPages = Math.ceil(productList.length / productsPerPage);
    paginationContainer.innerHTML = "";

    if (totalPages <= 1) return; //Nếu có 1 trang thì không cần phân trang

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
 *  Gắn sự kiện cho menu mobile (hamburger)
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

    // Tùy chọn: Đóng menu khi nhấp vào một link
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
        // Kiểm tra null/undefined trước khi parse
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        console.error(`Lỗi khi đọc ${key}:`, e);
        return defaultValue;
    }
}

/**
 * TÍNH TOÁN TỒN KHO
 * Tính tồn kho thực tế cho tất cả sản phẩm.
 */
function calculateAllInventory() {
    // Lấy tất cả sản phẩm (từ biến global 'allProducts' hoặc từ localStorage)
    const products = (typeof allProducts !== 'undefined' && allProducts.length > 0) 
                    ? allProducts 
                   : getStorageData(PRODUCTS_KEY, []); // Giờ sẽ dùng biến PRODUCTS_KEY toàn cục

    // Lấy TẤT CẢ phiếu nhập/xuất đã hoàn thành
    const allImports = getStorageData(IMPORTS_KEY, []).filter(i => i.status === 'Đã hoàn thành'); // Dùng IMPORTS_KEY toàn cục
    const allOrders = getStorageData(ORDERS_KEY, []).filter(o => o.status === 'Đã giao'); // Dùng ORDERS_KEY toàn cục
    
    const inventoryMap = new Map();

    products.forEach(prod => {
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
            // Tìm item trong đơn hàng
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
/* === PHẦN 5: TỰ ĐỘNG CẬP NHẬT TỒN KHO (THÊM MỚI) === */
window.addEventListener('storage', function(e) {
    // Chỉ chạy khi tab admin (imports) hoặc tab thanh toán (orders) thay đổi dữ liệu
    if (e.key === IMPORTS_KEY || e.key === ORDERS_KEY) {
        
        console.log('Phát hiện thay đổi kho từ tab khác, đang tự động cập nhật...');
        
        // 1. Tính toán lại tồn kho
        globalInventory = calculateAllInventory();
        
        // 2. Vẽ lại toàn bộ thẻ HTML (để cập nhật số tồn kho)
        renderProducts(allProducts);
        
        // 3. Lấy lại tham chiếu đến các thẻ MỚI
        allProductCards = Array.from(document.querySelectorAll(".product-card"));
        
        // 4. Áp dụng lại bộ lọc/tìm kiếm (hàm này sẽ tự xử lý phân trang)
        // Điều này giữ nguyên bộ lọc của người dùng
        applyFiltersAndSearch();

        // 5. Cập nhật lại icon và ngôn ngữ cho các thẻ MỚI
        lucide.createIcons();
        if (typeof window.runLanguageUpdater === 'function') {
            window.runLanguageUpdater();
        }
    }
});