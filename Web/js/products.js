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
            
            // DỮ LIỆU MẪU ĐÃ ĐƯỢC RÚT GỌN CÒN 5 SẢN PHẨM
            const defaultProducts = [
                { 
                  id: "sp_ben10", 
                  name: "BEN 10 OMNITRIX", 
                  price: 999999999, 
                  image: "../images/ben10.webp", 
                  category: "nam", 
                  description_short: "Chỉ dành cho người được chọn...", 
                  description_long: "Chỉ dành cho người được chọn hoặc người có đủ tiền mua."
                },
                { 
                  id: "sp_conan", 
                  name: "Đồng hồ Conan", 
                  price: 67000000, 
                  image: "../images/conan.jpg", 
                  category: "nu", // File gốc của bạn để là 'nu'
                  description_short: "Trang bị cơ bản của thám tử.", 
                  description_long: "Trang bị cơ bản của thám tử lừng danh. Có thể bắn kim gây mê."
                },
                { 
                  id: "sp_doraemon", 
                  name: "Time stop watch", 
                  price: 8500000, 
                  image: "../images/doraemon.jpg", 
                  category: "nam", 
                  description_short: "Chất lượng Nhật Bản.", 
                  description_long: "Chất lượng Nhật Bản, bền bỉ với thời gian. Bảo bối của Doraemon."
                },
                { 
                  id: "sp_oip", 
                  name: "Đồng hồ OIP", 
                  price: 4200000, 
                  image: "../images/oip.webp", 
                  category: "doi", 
                  description_short: "Thiết kế hầm hố.", 
                  description_long: "Thiết kế hầm hố, chống va đập tuyệt đối. Đến từ The Amazing World of Gumball."
                },
                { 
                  id: "sp_timecity", 
                  name: "Đồng hồ Time City", 
                  price: 696500000, 
                  image: "../images/time_city.webp", 
                  category: "doi", 
                  description_short: "Chỉ dành cho giới thượng lưu.", 
                  description_long: "Chỉ dành cho giới thượng lưu. Thiết kế đính kim cương toàn bộ."
                }
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