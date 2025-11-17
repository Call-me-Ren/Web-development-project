// FILE: products.js

// 🔑 KEY CONSTANT: Key dùng để lưu trữ dữ liệu sản phẩm trong Local Storage
const PRODUCTS_KEY = 'watchtime_products';

// 📚 DANH SÁCH SẢN PHẨM GỐC (DEFAULT DATA)
const defaultData = [
    {
        id: "sp_ben10",
        name: "BEN 10 OMNITRIX",
        price: 999999999,
        image: "images/ben10.webp",
        category: "nam",
        description_short: "Chỉ dành cho người được chọn...",
        // Chiếc đồng hồ huyền thoại, khóa mở sức mạnh 10 siêu anh hùng.
        description_long: "Chiếc đồng hồ Omnitrix huyền thoại, phiên bản giới hạn. Không chỉ hiển thị thời gian, đây là chìa khóa mở ra sức mạnh của 10 siêu anh hùng ngoài hành tinh. Chỉ dành cho Người Được Chọn hoặc bất kỳ ai sẵn sàng chi trả con số 'khủng' này để sở hữu món bảo vật vô giá."
    },
    {
        id: "sp_conan",
        name: "Đồng hồ Conan",
        price: 67000000,
        image: "images/conan.jpg",
        category: "nu",
        description_short: "Trang bị cơ bản của thám tử.",
        // Mô phỏng hoàn hảo, tích hợp kim gây mê và độ chính xác Thụy Sỹ.
        description_long: "Phiên bản mô phỏng hoàn hảo chiếc đồng hồ đeo tay của Thám tử lừng danh Conan. Thiết kế thể thao, mặt kính chống lóa, và đặc biệt tích hợp Kim gây mê siêu nhỏ (tính năng chỉ có trong truyện!) giúp bạn luôn chủ động trong mọi tình huống. Độ chính xác chuẩn Thụy Sỹ."
    },
    {
        id: "sp_doraemon",
        name: "Time stop watch",
        price: 8500000,
        image: "images/doraemon.jpg",
        category: "nam",
        description_short: "Chất lượng Nhật Bản.",
        // Lấy cảm hứng từ bảo bối của Doraemon, bền bỉ và độc đáo.
        description_long: "Được lấy cảm hứng từ Bảo bối của Doraemon, chiếc đồng hồ này cho phép bạn 'kiểm soát' thời gian (trên mặt số). Thiết kế cơ học tinh xảo, chất liệu thép không gỉ, đạt tiêu chuẩn chất lượng Nhật Bản, đảm bảo bền bỉ 'cùng với thời gian', xứng đáng là món đồ sưu tầm độc đáo."
    },
    {
        id: "sp_oip",
        name: "Đồng hồ OIP",
        price: 4200000,
        image: "images/oip.webp",
        category: "doi",
        description_short: "Thiết kế hầm hố.",
        // Mạnh mẽ, chống va đập tuyệt đối, phong cách Gumball vui vẻ.
        description_long: "Mẫu đồng hồ OIP với thiết kế hầm hố, mạnh mẽ, dành cho những cặp đôi cá tính, yêu thích phiêu lưu. Vỏ bảo vệ chuyên dụng cung cấp khả năng chống va đập tuyệt đối và chống nước vượt trội. Lấy cảm hứng từ The Amazing World of Gumball, mang lại phong cách vui vẻ, nổi bật."
    },
    {
        id: "sp_timecity",
        name: "Đồng hồ Time City",
        price: 696500000,
        image: "images/time_city.webp",
        category: "doi",
        description_short: "Chỉ dành cho giới thượng lưu.",
        // Vàng 18K và kim cương, khẳng định vị thế giới thượng lưu.
        description_long: "Tuyệt phẩm chế tác Time City, biểu tượng của sự xa hoa và đẳng cấp. Vỏ và dây đeo được làm từ vàng trắng 18K và nạm kín kim cương tự nhiên chất lượng cao. Chiếc đồng hồ này không chỉ xem giờ mà còn là lời khẳng định vị thế giới thượng lưu của người sở hữu. Phiên bản cặp đôi độc quyền."
    },
    {
        id: "sp_casio_001",
        name: "Casio G-Shock GA-2100",
        price: 3500000,
        image: "images/ảnh đồng hồ nam 1.jpg",
        category: "nam",
        description_short: "Thiết kế bát giác mạnh mẽ.",
        // Casioak bát giác, Carbon Core Guard, bền bỉ và mỏng nhẹ.
        description_long: "Mẫu G-Shock GA-2100 được mệnh danh là 'Casioak' với thiết kế bát giác độc đáo và độ mỏng kỷ lục trong dòng G-Shock. Được trang bị cấu trúc Carbon Core Guard, chiếc đồng hồ này cực kỳ bền bỉ nhưng vẫn rất nhẹ, là lựa chọn hoàn hảo cho phong cách năng động, hiện đại."
    },
    {
        id: "sp_daniel_001",
        name: "Daniel Wellington Petite",
        price: 4200000,
        image: "images/ảnh đồng hồ nam 2.jpg",
        category: "nu",
        description_short: "Tinh tế và thanh lịch.",
        // Tối giản Bắc Âu, dây lưới sang trọng, phụ kiện không thể thiếu.
        description_long: "Đồng hồ DW Petite mang đến vẻ đẹp tối giản, tinh tế và thanh lịch chuẩn phong cách Bắc Âu. Mặt đồng hồ nhỏ nhắn, kết hợp với dây lưới (mesh) bằng thép không gỉ sang trọng, ôm tay. Dễ dàng kết hợp với mọi trang phục, là phụ kiện không thể thiếu của phái nữ hiện đại."
    },
    {
        id: "sp_seiko_001",
        name: "Seiko 5 Sports",
        price: 7800000,
        image: "images/ảnh đồng hồ nam 3.jpg",
        category: "nam",
        description_short: "Cỗ máy cơ tự động bền bỉ.",
        // Seiko 5 huyền thoại, máy Automatic, chống nước 100m.
        description_long: "Dòng Seiko 5 Sports huyền thoại với lịch sử gần 60 năm, nổi tiếng về độ bền và tin cậy. Sở hữu bộ máy cơ Automatic (tự động lên dây) mạnh mẽ, mặt kính Hardlex chống trầy và khả năng chống nước 100m. Hoàn hảo cho người yêu thích đồng hồ cơ và phong cách thể thao, phiêu lưu."
    },
    {
        id: "sp_citizen_001",
        name: "Citizen Eco-Drive Pair",
        price: 9500000,
        image: "images/xanhhong.jpg",
        category: "doi",
        description_short: "Đồng hồ cặp năng lượng ánh sáng.",
        // Công nghệ Eco-Drive không cần pin, biểu tượng tình yêu bền vững.
        description_long: "Bộ đôi đồng hồ Citizen sử dụng công nghệ Eco-Drive độc quyền, hấp thụ mọi nguồn ánh sáng để tạo năng lượng, vĩnh viễn không cần thay pin. Thiết kế thanh lịch, mặt số màu xanh/hồng lãng mạn, là món quà ý nghĩa thể hiện sự bền vững và trọn vẹn trong tình yêu đôi lứa."
    },
    {
        id: "sp_tissot_001",
        name: "Tissot Le Locle Nữ",
        price: 14500000,
        image: "images/nhatban.jpg",
        category: "nu",
        description_short: "Vẻ đẹp Thụy Sỹ cổ điển.",
        // Tissot Thụy Sỹ, máy Automatic, mặt Guilloché, quý phái vượt thời gian.
        description_long: "Mẫu Tissot Le Locle nữ, mang đậm phong cách cổ điển, được đặt theo tên quê hương của Tissot tại Thụy Sỹ. Bộ máy cơ Automatic chất lượng cao, mặt số chạm khắc họa tiết Guilloché tinh xảo và cọc số La Mã sang trọng. Chiếc đồng hồ này là biểu tượng của sự quý phái và thẩm mỹ vượt thời gian."
    }
];

// 🛠️ FUNCTION: Kiểm tra LocalStorage và khởi tạo dữ liệu sản phẩm
function initProducts() {
    // 1. Kiểm tra LocalStorage
    const stored = localStorage.getItem(PRODUCTS_KEY);

    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            // Trả về dữ liệu nếu tồn tại và hợp lệ (có ít nhất 1 sản phẩm)
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        } catch (e) {
            // Log lỗi khi JSON không hợp lệ
            console.error("Lỗi data cũ trong LocalStorage, đang reset về mặc định:", e);
        }
    }

    // 2. Nếu không có dữ liệu hợp lệ, lưu danh sách gốc và trả về nó
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultData));
    return defaultData;
}

// 🌍 GLOBAL VARIABLE: Biến toàn cục chứa danh sách sản phẩm đã được khởi tạo
const allProducts = initProducts();