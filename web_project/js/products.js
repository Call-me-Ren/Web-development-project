// js/products.js

// Key này PHẢI KHỚP với key trong file js/admin.js
const PRODUCTS_KEY = 'watchtime_products';

// Đọc dữ liệu sản phẩm từ localStorage
function getProductsFromStorage() {
    try {
        const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY));
        
        // Nếu localStorage trống (lần đầu chạy), tạo dữ liệu mẫu
        if (!products || products.length === 0) {
            console.warn("localStorage 'watchtime_products' trống! Đang tạo dữ liệu mẫu.");
            const defaultProducts = [
                { id: "sp001", name: "Đồng Hồ Nam Lịch Lãm", price: 4500000, image: "../images/dong-ho-nam-1.jpg", category: "nam", description_short: "Mẫu đồng hồ cơ tự động.", description_long: "Trải nghiệm sự tinh tế..."},
                { id: "sp002", name: "Đồng Hồ Nữ Thanh Lịch", price: 3200000, image: "../images/dong-ho-nu-1.jpg", category: "nu", description_short: "Thiết kế tối giản, đính đá.", description_long: "Mẫu đồng hồ Quartz..."},
                { id: "sp003", name: "Đồng Hồ Nam Thể Thao", price: 5800000, image: "../images/dong-ho-nam-2.jpg", category: "nam", description_short: "Chronograph, chống nước 10ATM.", description_long: "Dành cho người đàn ông năng động..."},
                { id: "sp004", name: "Đồng Hồ Đôi Tinh Tế", price: 7100000, image: "../images/dong-ho-doi-1.jpg", category: "doi", description_short: "Cặp đồng hồ Quartz.", description_long: "Ghi dấu kỷ niệm..."},
                { id: "sp005", name: "Đồng Hồ Nữ Dây Da", price: 2900000, image: "../images/dong-ho-nu-2.jpg", category: "nu", description_short: "Mặt vuông cổ điển.", description_long: "Sự kết hợp hoàn hảo..."}
            ];
            // Lưu dữ liệu mẫu này vào localStorage
            localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
            return defaultProducts;
        }
        
        // Nếu có dữ liệu, trả về
        return products;

    } catch (e) {
        console.error("Lỗi khi đọc sản phẩm từ localStorage:", e);
        return []; // Trả về mảng rỗng nếu lỗi
    }
}

// Cung cấp biến global 'allProducts' mà Giaodien.js và chitiet.html đang dùng
const allProducts = getProductsFromStorage();