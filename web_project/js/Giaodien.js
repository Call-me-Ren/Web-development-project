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

    products.forEach(product => {
    const name = product.querySelector("h3").innerText.toLowerCase();

    // Kiểm tra có chứa từ khóa hay không
    if (name.includes(searchTerm)) {
        product.style.display = 'block';
    } else {
        product.style.display = 'none';
    }
    });
});

/* SEARCH-AS-YOU-TYPE + AUTOCOMPLETE + FILTER FOR .product-card
   Dán đoạn này vào cuối Giaodien.js hoặc trước </body>.
*/
(function(){
  // CONFIG
  const SEARCH_INPUT_ID = 'search'; // id input tìm kiếm của bạn
  const CARD_SELECTOR = '.product-card'; // selector product card
  const NAME_SEL = '[data-name]'; // selector cho tên nếu bạn dùng data-name
  const SUGGEST_LIMIT = 8;
  const DEBOUNCE_MS = 180;

  // helpers
  function normalizeText(s){
    if(!s) return '';
    // bỏ dấu, chuyển thường
    try{
      // dùng Unicode normalize nếu trình duyệt hỗ trợ
      return s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    }catch(e){
      // fallback: thay các dấu phổ biến (đơn giản)
      return s.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/gi,'a')
              .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/gi,'e')
              .replace(/ì|í|ị|ỉ|ĩ/gi,'i')
              .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/gi,'o')
              .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/gi,'u')
              .replace(/ỳ|ý|ỵ|ỷ|ỹ/gi,'y')
              .replace(/đ/gi,'d').toLowerCase();
    }
  }
  function debounce(fn, t){ let to; return (...a)=>{ clearTimeout(to); to=setTimeout(()=>fn(...a), t); }; }

  // build product index from DOM
  const cards = Array.from(document.querySelectorAll(CARD_SELECTOR));
  const products = cards.map(card=>{
    // read name: prefer data-name, fallback to H3 text or innerText
    const nameEl = card.querySelector(NAME_SEL) || card.querySelector('h3') || card.querySelector('h2');
    const name = nameEl ? (nameEl.getAttribute('data-name') || nameEl.textContent.trim()) : card.textContent.trim().slice(0,40);
    const descEl = card.querySelector('p') || null;
    const desc = descEl ? descEl.textContent.trim() : '';
    const category = card.dataset.category || card.getAttribute('data-category') || '';
    // price: try to parse numeric from an element with class 'text-indigo-600' or .price
    let price = 0;
    const priceEl = card.querySelector('.text-indigo-600') || card.querySelector('.price') || card.querySelector('.product-price');
    if(priceEl) price = Number(String(priceEl.textContent).replace(/[^\d]/g,'')) || 0;
    return {
      id: card.dataset.id || (name + Math.random().toString(36).slice(2,8)),
      name,
      nameNorm: normalizeText(name),
      desc,
      descNorm: normalizeText(desc),
      category,
      categoryNorm: normalizeText(category),
      price,
      card
    };
  });

  // create suggestions dropdown UI anchored to search input
  const searchInput = document.getElementById(SEARCH_INPUT_ID);
  if(!searchInput) return console.warn('Search input not found:', SEARCH_INPUT_ID);

  // ensure parent is positioned
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  wrapper.className = 'search-wrapper';
  // wrap input with wrapper
  const parent = searchInput.parentNode;
parent.replaceChild(wrapper, searchInput);
  wrapper.appendChild(searchInput);

  const sugBox = document.createElement('div');
  sugBox.className = 'search-suggestions hidden';
  sugBox.setAttribute('role','listbox');
  wrapper.appendChild(sugBox);

  let activeIndex = -1;
  function clearSuggestions(){
    sugBox.innerHTML = '';
    sugBox.classList.add('hidden');
    activeIndex = -1;
  }

  function showSuggestions(items, query){
    sugBox.innerHTML = '';
    if(!items || items.length === 0){
      const no = document.createElement('div');
      no.className = 'no-results';
      no.textContent = query ? 'Không tìm thấy sản phẩm phù hợp.' : 'Gõ để tìm sản phẩm...';
      sugBox.appendChild(no);
      sugBox.classList.remove('hidden');
      return;
    }
    items.slice(0, SUGGEST_LIMIT).forEach((p, i)=>{
      const it = document.createElement('div');
      it.className = 'item';
      it.setAttribute('role','option');
      it.dataset.index = i;
      it.innerHTML = `<div style="flex:1"><div class="name">${escapeHtml(p.name)}</div>
                      <div class="note" style="font-size:12px;color:#6b7280">${p.category ? escapeHtml(p.category) + ' • ' : ''}${p.price ? (p.price.toLocaleString('vi-VN') + '₫') : ''}</div></div>`;
      it.addEventListener('click', ()=>{
        focusProduct(p);
        clearSuggestions();
      });
      sugBox.appendChild(it);
    });
    sugBox.classList.remove('hidden');
  }

  // filtering function: returns matching product objects (best ordering: name match startsWith, includes, desc match)
  function searchProducts(query){
    const q = normalizeText(query || '');
    if(!q) return products.slice(); // return all
    const starts = [], includes = [], descMatches = [];
    for(const p of products){
      if(p.nameNorm.startsWith(q)) starts.push(p);
      else if(p.nameNorm.includes(q)) includes.push(p);
      else if(p.descNorm.includes(q) || p.categoryNorm.includes(q)) descMatches.push(p);
    }
    return starts.concat(includes, descMatches);
  }

  // highlight & filter cards on page
  function filterCards(matches){
    const matchSet = new Set(matches.map(m=>m.card));
    for(const p of products){
      if(matchSet.has(p.card)) p.card.style.display = '';
      else p.card.style.display = 'none';
    }
  }

  function focusProduct(product){
    // scroll to product and add temporary highlight
    const el = product.card;
    if(!el) return;
    el.scrollIntoView({behavior:'smooth', block:'center'});
    el.style.outline = '3px solid rgba(37,99,235,0.25)';
    setTimeout(()=> el.style.outline = '', 1800);
  }

  // keyboard navigation for suggestions
  function setActive(idx){
    const items = Array.from(sugBox.querySelectorAll('.item'));
    items.forEach(it => it.classList.remove('active'));
    if(idx >= 0 && idx < items.length){
      items[idx].classList.add('active');
      items[idx].scrollIntoView({block:'nearest'});
      activeIndex = idx;
    } else activeIndex = -1;
  }
// main input handler
  const onInput = debounce(function(ev){
    const q = searchInput.value.trim();
    const results = searchProducts(q);
    // show suggestions
    showSuggestions(results, q);
    // filter cards
    if(!q) {
      // show all
      products.forEach(p => p.card.style.display = '');
    } else {
      filterCards(results);
    }
  }, DEBOUNCE_MS);

  // bind events
  searchInput.addEventListener('input', onInput);

  searchInput.addEventListener('keydown', function(e){
    const items = sugBox.querySelectorAll('.item');
    if(sugBox.classList.contains('hidden')) return;
    if(e.key === 'ArrowDown'){ e.preventDefault(); setActive((activeIndex+1) % items.length); }
    else if(e.key === 'ArrowUp'){ e.preventDefault(); setActive((activeIndex-1 + items.length) % items.length); }
    else if(e.key === 'Enter'){ 
      // if an item active, pick it; otherwise if text present and results exist pick first
      e.preventDefault();
      if(activeIndex >= 0 && items[activeIndex]) items[activeIndex].click();
      else {
        const q = searchInput.value.trim();
        if(q){
          const res = searchProducts(q);
          if(res.length) focusProduct(res[0]);
          clearSuggestions();
        }
      }
    } else if(e.key === 'Escape'){ clearSuggestions(); }
  });

  // click outside closes suggestions
  document.addEventListener('click', function(e){
    if(!wrapper.contains(e.target)) clearSuggestions();
  });

  // helper: escape html
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

})();

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
