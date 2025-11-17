// FILE: products.js

// Key để lưu vào bộ nhớ trình duyệt (dùng cho trang Admin sau này)
const PRODUCTS_KEY = 'watchtime_products';

// DANH SÁCH SẢN PHẨM GỐC
const defaultData = [
    { 
        id: "sp_ben10", name: "BEN 10 OMNITRIX", price: 999999999, 
        image: "images/ben10.webp", category: "nam", 
        description_short: "Chỉ dành cho người được chọn...", 
        description_long: "Chỉ dành cho người được chọn hoặc người có đủ tiền mua."
    },
    { 
        id: "sp_conan", name: "Đồng hồ Conan", price: 67000000, 
        image: "images/conan.jpg", category: "nu", 
        description_short: "Trang bị cơ bản của thám tử.", 
        description_long: "Trang bị cơ bản của thám tử lừng danh. Có thể bắn kim gây mê."
    },
    { 
        id: "sp_doraemon", name: "Time stop watch", price: 8500000, 
        image: "images/doraemon.jpg", category: "nam", 
        description_short: "Chất lượng Nhật Bản.", 
        description_long: "Chất lượng Nhật Bản, bền bỉ với thời gian. Bảo bối của Doraemon."
    },
    { 
        id: "sp_oip", name: "Đồng hồ OIP", price: 4200000, 
        image: "images/oip.webp", category: "doi", 
        description_short: "Thiết kế hầm hố.", 
        description_long: "Thiết kế hầm hố, chống va đập tuyệt đối. Đến từ The Amazing World of Gumball."
    },
    { 
        id: "sp_timecity", name: "Đồng hồ Time City", price: 696500000, 
        image: "images/time_city.webp", category: "doi", 
        description_short: "Chỉ dành cho giới thượng lưu.", 
        description_long: "Chỉ dành cho giới thượng lưu. Thiết kế đính kim cương toàn bộ."
    },
    { 
        id: "sp_casio_001", name: "Casio G-Shock GA-2100", price: 3500000, 
        image: "images/ảnh đồng hồ nam 1.jpg", category: "nam", 
        description_short: "Thiết kế bát giác mạnh mẽ.", 
        description_long: "Đồng hồ G-Shock GA-2100 với viền bát giác, mỏng nhẹ và độ bền cao."
    },
    { 
        id: "sp_daniel_001", name: "Daniel Wellington Petite", price: 4200000, 
        image: "images/ảnh đồng hồ nam 2.jpg", category: "nu", 
        description_short: "Tinh tế và thanh lịch.", 
        description_long: "Mẫu DW Petite với mặt đồng hồ nhỏ nhắn, dây lưới sang trọng cho phái nữ."
    },
    { 
        id: "sp_seiko_001", name: "Seiko 5 Sports", price: 7800000, 
        image: "images/ảnh đồng hồ nam 3.jpg", category: "nam", 
        description_short: "Cỗ máy cơ tự động bền bỉ.", 
        description_long: "Dòng Seiko 5 Sports huyền thoại, máy cơ Automatic, khả năng chống nước tốt."
    },
    { 
        id: "sp_citizen_001", name: "Citizen Eco-Drive Pair", price: 9500000, 
        image: "images/xanhhong.jpg", category: "doi", 
        description_short: "Đồng hồ cặp năng lượng ánh sáng.", 
        description_long: "Bộ đôi đồng hồ Citizen sử dụng công nghệ Eco-Drive, không cần thay pin."
    },
    { 
        id: "sp_tissot_001", name: "Tissot Le Locle Nữ", price: 14500000, 
        image: "images/nhatban.jpg", category: "nu", 
        description_short: "Vẻ đẹp Thụy Sỹ cổ điển.", 
        description_long: "Đồng hồ Tissot Le Locle Automatic, mặt số la mã, mang đậm phong cách châu Âu."
    }
];

// Hàm kiểm tra và lấy dữ liệu
function initProducts() {
    // 1. Kiểm tra xem trong LocalStorage đã có dữ liệu chưa (do Admin sửa)
    const stored = localStorage.getItem(PRODUCTS_KEY);
    
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (parsed.length > 0) return parsed;
        } catch (e) {
            console.log("Lỗi data cũ, reset về mặc định");
        }
    }

    // 2. Nếu chưa có, lưu danh sách gốc vào và trả về danh sách gốc
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultData));
    return defaultData;
}

// BIẾN TOÀN CỤC QUAN TRỌNG: Các file khác sẽ gọi biến này để lấy sản phẩm
const allProducts = initProducts();