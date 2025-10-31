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
            
            // DỮ LIỆU MẪU ĐÃ SỬA LẠI THEO ẢNH BẠN TẢI LÊN
            const defaultProducts = [
                { id: "sp001", name: "Đồng Hồ Nam Olevs Mặt Xanh", price: 4500000, image: "../images/ảnh đồng hồ nam 1.jpg", category: "nam", description_short: "Mẫu đồng hồ cơ tự động, mặt kính sapphire.", description_long: "Trải nghiệm sự tinh tế với mẫu đồng hồ cơ tự động Olevs. Mặt kính sapphire chống trầy xước tuyệt đối, vỏ thép không gỉ 316L, khả năng chống nước 5ATM."},
                { id: "sp002", name: "Đồng Hồ Nữ Đính Đá", price: 3200000, image: "../images/time_city.webp", category: "nu", description_short: "Thiết kế đính đá sang trọng, dây silicone.", description_long: "Mẫu đồng hồ Quartz (chạy pin) với thiết kế lộng lẫy, viền đính đá Swarovski lấp lánh. Dây đeo silicone đen mang lại vẻ đẹp hiện đại và sang trọng."},
                { id: "sp003", name: "Đồng Hồ Nam CRRJU Đen Vàng", price: 5800000, image: "../images/ảnh đồng hồ nam 2.jpg", category: "nam", description_short: "Chronograph, chống nước 10ATM, dây thép đen.", description_long: "Dành cho người đàn ông năng động. Chức năng Chronograph (bấm giờ thể thao) chính xác, khả năng chống nước lên đến 10ATM (100m). Vỏ thép mạ PVD đen chắc chắn, phối các chi tiết vàng kim sang trọng."},
                { id: "sp004", name: "Đồng Hồ Nam Fossil Dây Da", price: 3100000, image: "../images/ảnh 8.jpg", category: "nam", description_short: "Mặt số La Mã, dây da bê.", description_long: "Ghi dấu kỷ niệm với cặp đồng hồ tinh tế. Cả hai đều sử dụng máy Quartz Nhật Bản bền bỉ. Thiết kế đồng điệu với mặt số La Mã cổ điển, vỏ mạ PVD vàng sang trọng."},
                { id: "sp005", name: "Đồng Hồ Nam Fossil Đen", price: 6200000, image: "../images/ảnh đồng hồ nam 3.jpg", category: "nam", description_short: "Mặt to, Chronograph, dây thép đen.", description_long: "Sự kết hợp hoàn hảo giữa cổ điển và hiện đại. Mặt đồng hồ to bản, chức năng Chronograph. Dây thép đen tuyền mang lại vẻ nam tính và mạnh mẽ."}
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