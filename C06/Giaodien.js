/* === PHẦN 1: LOGIC RENDER SẢN PHẨM === */

/**
 * Tạo HTML cho một thẻ sản phẩm
 * @param {object} product - Đối tượng sản phẩm
 * @returns {string} - Chuỗi HTML
 */
/**
 * Tạo HTML cho một thẻ sản phẩm (Đã sửa canh đều nút bấm)
 */
/**
 * Tạo HTML cho một thẻ sản phẩm (ĐÃ SỬA: KHÔNG MỜ ẢNH, HOVER HIỆN CHỮ HẾT HÀNG)
 */
/**
 * Tạo HTML cho một thẻ sản phẩm (ĐÃ SỬA: NÚT THÊM GIỎ, HẾT HÀNG MÀU XÁM, KHÔNG CLICK ĐƯỢC)
 */
function createProductCard(product) {
    const description = product.description_short ? 
        `<p class="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">${product.description_short}</p>` : 
        '<p class="text-gray-500 text-sm mb-4 flex-grow">&nbsp;</p>';
        
    const price = Number(product.price).toLocaleString('vi-VN') + '₫';
    const stock = globalInventory.get(product.id) || 0;

    let actionHtml = '';
    let overlayHtml = '';
    let opacityClass = '';
    let clickEventClass = ''; 

    if (stock > 0) {
        // CÒN HÀNG
        actionHtml = `
            <div class="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                <div class="text-lg font-bold text-indigo-600">${price}</div>
                <button class="add-to-cart bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-1">
                    <i data-lucide="shopping-cart" class="w-4 h-4"></i> Thêm
                </button>
            </div>`;
            
        // Overlay khi hover (Xem chi tiết)
        overlayHtml = `
            <div class="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-all duration-300 pointer-events-none"></div>
            <div class="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block">
                <a href="chitiet.html?id=${product.id}" class="block w-full bg-white text-indigo-600 text-center py-3 font-bold shadow-lg rounded-lg hover:bg-gray-50">Xem chi tiết</a>
            </div>`;
            
    } else {
        // HẾT HÀNG
        actionHtml = `
            <div class="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <div class="text-lg font-bold text-gray-400 line-through">${price}</div>
                <span class="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded border border-red-100">Hết hàng</span>
            </div>`;
            
        // Nhãn Hết hàng chéo giữa ảnh
        overlayHtml = `
            <div class="absolute inset-0 bg-white/50 flex items-center justify-center pointer-events-none">
                <span class="bg-gray-800 text-white font-bold px-4 py-2 rounded shadow-xl transform -rotate-12 uppercase tracking-wider text-sm">Hết hàng</span>
            </div>`;
        
        opacityClass = "grayscale opacity-80 cursor-not-allowed";
        clickEventClass = "pointer-events-none"; 
    }

    return `
    <div class="product-card bg-white border border-gray-100 rounded-xl hover:shadow-xl transition-all duration-300 flex flex-col h-full group relative overflow-hidden" data-category="${product.category}" data-id="${product.id}">
        
        <div class="relative h-64 overflow-hidden bg-gray-50 ${opacityClass}">
            <a href="chitiet.html?id=${product.id}" class="block h-full ${clickEventClass}">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500">
            </a>
            ${overlayHtml}
        </div>
        
        <div class="p-4 flex flex-col flex-grow">
            <div class="text-xs text-gray-400 mb-1 uppercase tracking-wider font-semibold">${product.category}</div>
            <h3 class="text-base font-bold text-gray-900 mb-2 line-clamp-1 hover:text-indigo-600 transition-colors">
                <a href="chitiet.html?id=${product.id}" class="${clickEventClass}">${product.name}</a>
            </h3>
            
            ${description}
            
            ${actionHtml}
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

/* === PHẦN 2: LOGIC KHỞI TẠO (ĐÃ CẬP NHẬT ĐỂ CHIA TRANG) === */

/* === PHẦN 2: LOGIC KHỞI TẠO (ĐÃ CẬP NHẬT LẦN CUỐI) === */
document.addEventListener("DOMContentLoaded", () => {
    
    if (typeof allProducts === 'undefined') {
        console.error("Thiếu products.js");
        return;
    }
    
    currentProductData = [...allProducts];
    globalInventory = calculateAllInventory(currentProductData); // Tính toán tồn kho (đã có logic 3 cái hết hàng)
    lucide.createIcons();
    initializeLoginUI();
    initializeLanguageToggle();
    initializeMobileMenu();
    initializeStorageListener();
    updateHeaderCartCount();

    // --- PHÂN BIỆT XỬ LÝ GIỮA CÁC TRANG ---

    const shopGrid = document.getElementById("product-grid");     
    const homeGrid = document.getElementById("featured-grid");    

    // === TRƯỜNG HỢP 1: TRANG SẢN PHẨM (sanpham.html) ===
    if (shopGrid) {
        renderProducts(currentProductData); 
        allProductCards = Array.from(document.querySelectorAll(".product-card"));
        
        initializePagination();
        loadCategoryFilter();
        initializeFilters();
        initializeSearch();
        initializeAddToCart();

        // QUAN TRỌNG: Gọi hàm này ngay lập tức để đẩy hàng hết xuống cuối
        applyFiltersAndSearch();
    }

    // === TRƯỜNG HỢP 2: TRANG CHỦ (index.html) ===
    if (homeGrid) {
        // 1. Lọc: Chỉ lấy những sản phẩm CÒN HÀNG (stock > 0)
        const inStockProducts = currentProductData.filter(p => {
            const stock = globalInventory.get(p.id) || 0;
            return stock > 0;
        });

        // 2. Lấy 8 sản phẩm đầu tiên từ danh sách ĐÃ LỌC
        const featuredProducts = inStockProducts.slice(0, productsPerPage); 
        
        // 3. Render
        if (featuredProducts.length === 0) {
            homeGrid.innerHTML = "<p class='text-center col-span-full'>Tạm thời hết hàng.</p>";
        } else {
            homeGrid.innerHTML = featuredProducts.map(createProductCard).join('');
        }
        
        attachClickEventToGrid(homeGrid);
    }
});

/**
 * Hàm hỗ trợ: Gắn sự kiện mua hàng cho bất kỳ lưới sản phẩm nào (Dùng cho trang chủ)
 */
function attachClickEventToGrid(gridElement) {
    if (!gridElement) return;
    
    const CART_KEY = 'watchtime_cart';
    function getCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch(e){ return []; } }
    function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

    gridElement.addEventListener('click', (e) => {
        // Tìm nút có class .add-to-cart
        const btn = e.target.closest('.add-to-cart') || (e.target.classList.contains('add-to-cart') ? e.target : null);
        
        if (!btn) return;
        
        e.preventDefault(); e.stopPropagation();
        
        if (btn.disabled) { alert("Sản phẩm này hiện đã hết hàng!"); return; }
        
        const card = btn.closest('.product-card');
        const id = card.dataset.id;
        const stock = globalInventory.get(id) || 0;
        
        if (localStorage.getItem("isLoggedIn") !== "true") {
            alert("Bạn cần đăng nhập để mua hàng!");
            window.location.href = "dangnhap.html";
            return;
        }

        if (stock <= 0) { alert("Hết hàng!"); return; }
        
        const product = currentProductData.find(p => p.id === id);
        let cart = getCart();
        const existing = cart.find(it => it.id === id);
        const qtyInCart = existing ? existing.qty : 0;
        
        if (qtyInCart >= stock) { alert("Đã đạt giới hạn tồn kho!"); return; }
        
        if(existing) existing.qty++; else cart.push({ ...product, qty: 1 });
        saveCart(cart);
        
        // Hiệu ứng giỏ hàng nhảy lên
        updateHeaderCartCount();
        const cartCountEl = document.getElementById("cart-count");
        if (cartCountEl) {
            cartCountEl.style.transform = "scale(1.3)";
            setTimeout(() => (cartCountEl.style.transform = "scale(1)"), 150);
        }
    });
}
// Cần sửa lại hàm initializeAddToCart cũ để nó dùng logic chung này, 
// hoặc đơn giản là trong initializeAddToCart cũ, gọi attachClickEventToGrid(document.getElementById("product-grid"));

/**
 * Gắn sự kiện cho Lọc
 */
/**
 * Gắn sự kiện cho Tìm kiếm (ĐÃ SỬA: ĐỒNG BỘ HEADER VÀ BODY)
 */
/**
 * Gắn sự kiện cho Tìm kiếm (ĐÃ SỬA: ĐỒNG BỘ HEADER VÀ BODY VÀ GỌI HÀM LỌC CHO BODY)
 */
function initializeSearch() {
    const headerSearch = document.getElementById('search');      // Input trên Header
    const bodySearch = document.getElementById('search-input');  // Input bộ lọc giữa trang (chỉ có ở sanpham.html)

    if (headerSearch) {
        // Sự kiện 1: Khi gõ chữ vào header
        headerSearch.addEventListener('input', (e) => {
            const val = e.target.value;

            // 1. Nếu đang ở trang sản phẩm (có ô tìm kiếm body), copy giá trị xuống dưới
            if (bodySearch) {
                bodySearch.value = val;
                
                // 2. Gọi hàm lọc ngay lập tức
                if (typeof applyFiltersAndSearch === "function") {
                    applyFiltersAndSearch();
                }
            }
        });

        // Sự kiện 2: Khi nhấn Enter trên header
        headerSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                // Nếu đang ở trang khác, chuyển hướng sang trang sản phẩm
                if (!bodySearch) {
                    // Nếu cần truyền keyword sang trang mới, bạn nên dùng URL parameter
                    // Vd: window.location.href = "sanpham.html?search=" + headerSearch.value;
                    window.location.href = "sanpham.html"; 
                } else {
                    // Nếu đang ở trang sản phẩm, focus xuống ô search dưới
                    bodySearch.focus();
                }
            }
        });
    }
    
    // === BỔ SUNG QUAN TRỌNG: Gắn sự kiện cho ô search thân trang (bodySearch) ===
    if (bodySearch) {
        bodySearch.addEventListener('input', (e) => {
            // Đồng bộ: Copy giá trị lên header
            if(headerSearch) {
                headerSearch.value = e.target.value;
            }
            // Gọi hàm lọc ngay lập tức khi gõ vào ô search thân trang
            if (typeof applyFiltersAndSearch === "function") {
                applyFiltersAndSearch();
            }
        });
    }
}

/**
 * Gắn sự kiện cho Tìm kiếm
 */
/**
 * Gắn sự kiện cho Tìm kiếm (ĐÃ SỬA: ĐỒNG BỘ HEADER VÀ BODY)
 */

/**
 * Gắn sự kiện cho các nút "Thêm vào giỏ" 
 */
/**
 * Gắn sự kiện cho các nút "Thêm vào giỏ"
 * (Sử dụng hàm chung attachClickEventToGrid)
 */
function initializeAddToCart() {
    const productGrid = document.getElementById("product-grid");
    if (!productGrid) return;
    
    // Gắn sự kiện mua hàng cho lưới sản phẩm
    attachClickEventToGrid(productGrid);
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
 * Khởi tạo sự kiện cho Lọc (Category và Price)
 */
function initializeFilters() {
    const applyBtn = document.getElementById("btn-filter-apply");
    const clearBtn = document.getElementById("btn-filter-clear");
    const categorySelect = document.getElementById("filter-category");
    const priceMin = document.getElementById("price-min");
    const priceMax = document.getElementById("price-max");
    const searchInputEl = document.getElementById("search-input"); // Cần lấy thêm search input

    // Sự kiện 1: Áp dụng Lọc khi nhấn nút
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            applyFiltersAndSearch();
        });
    }

    // Sự kiện 2: Xóa Lọc khi nhấn nút
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            // Reset các giá trị lọc về mặc định
            if (categorySelect) categorySelect.value = "all";
            if (priceMin) priceMin.value = "";
            if (priceMax) priceMax.value = "";
            
            // Xóa ô tìm kiếm thân trang và header (đồng bộ)
            if(searchInputEl) searchInputEl.value = ""; 
            const headerSearch = document.getElementById('search');
            if(headerSearch) headerSearch.value = "";
            
            // Gọi hàm lọc để reset lưới sản phẩm
            applyFiltersAndSearch();
        });
    }

    // Sự kiện 3: Lọc ngay khi thay đổi Category
    if (categorySelect) {
        categorySelect.addEventListener('change', applyFiltersAndSearch);
    }
    
    // Sự kiện 4: Lọc khi nhấn Enter trong ô Giá
    [priceMin, priceMax].forEach(input => {
        if(input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    applyFiltersAndSearch();
                }
            });
        }
    });
}
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
/**
 * Lọc, Tìm kiếm VÀ SẮP XẾP (Đẩy hết hàng xuống cuối)
 */
function applyFiltersAndSearch() {
    // 1. Lấy giá trị từ các ô input mới
    const category = document.getElementById("filter-category").value;
    
    // Lưu ý: ID input tìm kiếm bây giờ là "search-input"
    const searchInputEl = document.getElementById("search-input");
    const searchTerm = searchInputEl ? searchInputEl.value.toLowerCase().trim() : "";
    
    let minPrice = document.getElementById("price-min").value;
    let maxPrice = document.getElementById("price-max").value;

    // Chuyển đổi sang số (nếu rỗng thì gán mặc định)
    minPrice = minPrice ? parseFloat(minPrice) : 0;
    maxPrice = maxPrice ? parseFloat(maxPrice) : Infinity;

    let currentList = allProductCards; 

    // 2. Lọc danh sách
    currentList = currentList.filter(card => {
        const productCategory = card.dataset.category;
        // Lấy giá tiền, xóa hết ký tự '₫', dấu chấm để so sánh
        const priceText = card.querySelector(".text-lg").textContent.replace(/[^\d]/g, "");
        const price = parseFloat(priceText);
        
        const productName = card.querySelector("h3").innerText.toLowerCase();

        const matchCategory = category === "all" || productCategory === category;
        const matchSearch = productName.includes(searchTerm);
        const matchPrice = price >= minPrice && price <= maxPrice;

        return matchCategory && matchSearch && matchPrice;
    });

    // 3. Sắp xếp: Đẩy sản phẩm hết hàng xuống dưới cùng
    currentList.sort((a, b) => {
        const idA = a.dataset.id;
        const idB = b.dataset.id;
        const stockA = globalInventory.get(idA) || 0;
        const stockB = globalInventory.get(idB) || 0;

        if (stockA > 0 && stockB <= 0) return -1;
        if (stockA <= 0 && stockB > 0) return 1;
        return 0;
    });
    
    // 4. Hiển thị kết quả
    currentPage = 1;
    showPage(currentPage, currentList); 
    renderPagination(currentList);
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
/**
 * Hiển thị sản phẩm cho một trang cụ thể (ĐÃ SỬA: VẼ LẠI THỨ TỰ DOM)
 */
function showPage(page, productList) {
    const grid = document.getElementById("product-grid");
    if (!grid) return;

    // 1. Ẩn tất cả thẻ trong bộ nhớ đệm (để tránh lỗi logic)
    allProductCards.forEach((card) => {
        card.style.display = "none";
    });

    // 2. Tính toán các sản phẩm của trang hiện tại
    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;
    const pageProducts = productList.slice(start, end);
    
    // 3. Xóa sạch grid hiện tại để sắp xếp lại vị trí
    // (Cách này đảm bảo hàng hết sẽ nằm đúng vị trí cuối cùng về mặt hiển thị)
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }

    // 4. Thêm lại các thẻ vào grid theo đúng thứ tự đã sort
    if (pageProducts.length > 0) {
        pageProducts.forEach(card => {
            card.style.display = "flex"; // Dùng flex để khớp với css 'flex flex-col'
            grid.appendChild(card);
        });
    } else {
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
/**
 * Quản lý đăng nhập / avatar / đăng xuất / hiển thị tên
 */
/**
 * Quản lý đăng nhập / avatar / đăng xuất / hiển thị tên (ĐÃ SỬA: QUẢN LÝ CẢ 2 NÚT LOGIN/REGISTER)
 */
function initializeLoginUI() {
    // Lấy các element từ DOM
    const loginRegisterButtons = document.getElementById("login-register-buttons"); // Khối chứa 2 nút Login/Register MỚI
    const loginBtn = document.getElementById("header-login-btn");                  // Nút Đăng nhập
    const registerBtn = document.getElementById("header-register-btn");            // Nút Đăng ký
    
    const userInfoArea = document.getElementById("user-info-area");     // Khu vực chứa Tên + Avatar
    const welcomeText = document.getElementById("user-welcome-text");   // Chỗ hiển thị "Chào..."
    const userAvatar = document.getElementById("user-avatar");
    const userMenu = document.getElementById("user-menu");
    const menuUserName = document.getElementById("menu-user-name");     // Tên trong menu xổ xuống
    
    // Element mobile (giữ nguyên logic cũ)
    const mobileLoginLink = document.querySelector('#mobile-menu a[href="dangnhap.html"]');
    const mobileRegisterLink = document.querySelector('#mobile-menu a[href="dangky.html"]'); // Thêm nút đăng ký mobile
    const mobileUserMenu = document.getElementById('mobile-user-menu');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    const desktopLogoutBtn = document.getElementById('logout-btn-desktop');

    // Kiểm tra trạng thái đăng nhập
    let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    let currentUser = null;
    
    try {
        currentUser = JSON.parse(localStorage.getItem("currentUser"));
    } catch (e) {
        currentUser = null;
    }

    // --- HÀM CẬP NHẬT GIAO DIỆN ---
    function updateLoginUI() {
        if (isLoggedIn && currentUser) {
            // === ĐÃ ĐĂNG NHẬP ===
            
            // 1. Ẩn khối chứa Đăng nhập/Đăng ký
            if(loginRegisterButtons) loginRegisterButtons.classList.add("hidden");

            // 2. Hiện khu vực User (Tên + Avatar)
            if(userInfoArea) {
                userInfoArea.classList.remove("hidden");
                userInfoArea.classList.add("flex");
            }

            // 3. Hiển thị tên chào mừng
            let displayName = "Khách hàng";
            if (currentUser.lastname && currentUser.firstname) {
                displayName = `${currentUser.lastname} ${currentUser.firstname}`;
            } else if (currentUser.lastname) {
                displayName = currentUser.lastname;
            } else if (currentUser.firstname) {
                displayName = currentUser.firstname;
            } else if (currentUser.email) {
                displayName = currentUser.email.split('@')[0]; // Lấy phần trước @
            }

            if(welcomeText) welcomeText.textContent = `Chào, ${displayName}`;
            if(menuUserName) menuUserName.textContent = displayName;

            // Mobile: Ẩn link Đăng nhập/Đăng ký, Hiện menu User
            if(mobileLoginLink) mobileLoginLink.classList.add("hidden");
            if(mobileRegisterLink) mobileRegisterLink.classList.add("hidden");
            if(mobileUserMenu) mobileUserMenu.classList.remove("hidden");

        } else {
            // === CHƯA ĐĂNG NHẬP ===
            
            // 1. Hiện khối chứa Đăng nhập/Đăng ký
            if(loginRegisterButtons) loginRegisterButtons.classList.remove("hidden");

            // 2. Ẩn khu vực User
            if(userInfoArea) {
                userInfoArea.classList.add("hidden");
                userInfoArea.classList.remove("flex");
            }

            // Mobile: Hiện link Đăng nhập/Đăng ký, Ẩn menu User
            if(mobileLoginLink) mobileLoginLink.classList.remove("hidden");
            if(mobileRegisterLink) mobileRegisterLink.classList.remove("hidden");
            if(mobileUserMenu) mobileUserMenu.classList.add("hidden");
        }
    }

    // Chạy hàm cập nhật ngay khi tải trang
    updateLoginUI();

    // --- CÁC SỰ KIỆN CLICK ---

    // 1. Toggle Menu khi nhấn vào Avatar hoặc Tên
    if(userInfoArea) {
        userInfoArea.addEventListener("click", function (e) {
            e.stopPropagation();
            if(userMenu) userMenu.classList.toggle("hidden");
        });
    }

    // 2. Đóng menu khi click ra ngoài
    document.addEventListener("click", function (e) {
        if (userMenu && !userMenu.classList.contains("hidden")) {
            if (!userInfoArea.contains(e.target) && !userMenu.contains(e.target)) {
                userMenu.classList.add("hidden");
            }
        }
    });

    // 3. Hàm xử lý Đăng xuất chung
    function doLogout() {
        if (confirm("Bạn có chắc muốn đăng xuất?")) {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("currentUser");
            window.location.reload(); 
        }
    }

    // Gắn sự kiện đăng xuất (Desktop & Mobile)
    if(desktopLogoutBtn) {
        desktopLogoutBtn.addEventListener("click", (e) => { e.preventDefault(); doLogout(); });
    }
    if(mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener("click", (e) => { e.preventDefault(); doLogout(); });
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
/**
 * TÍNH TOÁN TỒN KHO (ĐÃ SỬA ĐỂ DEMO CÓ SẴN HÀNG)
 */
/**
 * TÍNH TOÁN TỒN KHO (ĐÃ SỬA: 3 SẢN PHẨM ĐẦU TIÊN HẾT HÀNG ĐỂ DEMO)
 */
function calculateAllInventory(productsToCalc) {
    const allImports = getStorageData(IMPORTS_KEY, []).filter(i => i.status === 'Đã hoàn thành'); 
    const allOrders = getStorageData(ORDERS_KEY, []).filter(o => o.status === 'Đã giao'); 
    
    const inventoryMap = new Map();

    productsToCalc.forEach((prod, index) => { // Thêm tham số index
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

        // === LOGIC MỚI: DEMO 3 CÁI HẾT HÀNG ===
        if (allImports.length === 0) {
            // Nếu chưa có dữ liệu nhập hàng (lần đầu chạy)
            // Cho 3 sản phẩm đầu tiên (index 0, 1, 2) có số lượng là 0
            if (index < 3) {
                tongNhap = 0; 
            } else {
                tongNhap = 50; // Các sản phẩm còn lại có 50
            }
        }
        // =======================================

        // 2. Tính toán Xuất
        allOrders.forEach(order => {
            const item = order.items.find(i => i.id === id); 
            if (item) {
                tongXuat += item.qty;
            }
        });
        
        // 3. Tính Tồn
        let ton = tongNhap - tongXuat;
        if (ton < 0) ton = 0; // Đảm bảo không âm
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
