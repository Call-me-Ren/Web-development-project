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
        description_short: "Chỉ dành cho người được chọn.",
        description_long: "Đây là chiếc đồng hồ viễn tưởng huyền thoại, Omnitrix, đến từ series hoạt hình Ben 10. Đây là vật phẩm sưu tầm tối thượng cho fan Ben 10.",
        // ✨ THUỘC TÍNH MỚI CHO TRÌNH BÀY ĐẸP
        specs: [
            { 
                label: "Thiết kế", 
                value: "Thiết kế hầm hố với vỏ ngoài màu xanh lá phát quang và các chi tiết cơ khí màu trắng/xám kim loại. Mặt đồng hồ có biểu tượng đồng hồ cát đặc trưng." 
            },
            { 
                label: "Tính năng", 
                value: "Mô phỏng được các chức năng cốt lõi của Omnitrix, bao gồm: ánh sáng xanh lá, âm thanh, và cơ chế bật nắp." 
            },
            { 
                label: "Chất liệu", 
                value: "Nhựa tổng hợp cao cấp, các chi tiết làm từ kim loại nhẹ (cho phiên bản cao cấp)." 
            },
            { 
                label: "Mục đích", 
                value: "Sưu tầm, cosplay, và trang trí." 
            }
        ]
    },
    {
        id: "sp_conan",
        name: "Đồng hồ Conan",
        price: 67000000,
        image: "images/conan.jpg",
        category: "nu",
        description_short: "Trang bị biểu tượng của thám tử.",
        description_long: "Đây là trang bị cơ bản, mang tính biểu tượng của thám tử lừng danh Conan - chiếc Đồng hồ Gây Mê. Là vật phẩm sưu tầm cao cấp, dành riêng cho fan hâm mộ.",
        specs: [
            { 
                label: "Thiết kế", 
                value: "Đồng hồ điện tử cổ điển, vỏ kim loại màu bạc. Mặt đồng hồ đơn giản, có nắp bật." 
            },
            { 
                label: "Tính năng", 
                value: "Đặc trưng là cơ chế bật lên để mô phỏng chức năng ngắm và bắn kim gây mê (có thể có cơ chế bật kim, phát ra ánh sáng đỏ mô phỏng tia laser). Chức năng xem giờ cơ bản." 
            },
            { 
                label: "Chất liệu", 
                value: "Vỏ và dây kim loại (thép không gỉ) tạo cảm giác chắc chắn." 
            },
            { 
                label: "Mục đích", 
                value: "Sưu tầm, trưng bày." 
            }
        ]
    },
    {
        id: "sp_doraemon",
        name: "Time stop watch",
        price: 8500000,
        image: "images/doraemon.jpg",
        category: "nam",
        description_short: "Bảo bối thần kỳ của Doraemon.",
        description_long: "Time stop watch là bảo bối thần kỳ nổi tiếng của Doraemon. Sản phẩm được mô tả là có 'chất lượng Nhật Bản, bền bỉ với thời gian.'",
        specs: [
            { 
                label: "Thiết kế", 
                value: "Hình dáng của một chiếc đồng hồ bấm giờ (stop watch) cổ điển, màu đỏ và vàng nổi bật. Mặt số có kim chỉ tốc độ/trạng thái ngưng đọng thời gian." 
            },
            { 
                label: "Tính năng", 
                value: "Dùng như một chiếc đồng hồ bấm giờ thông thường hoặc là vật trang trí có ánh sáng và âm thanh mô phỏng chức năng ngưng đọng thời gian." 
            },
            { 
                label: "Chất liệu", 
                value: "Vỏ kim loại nhẹ, bền bỉ, được hoàn thiện bằng lớp sơn bóng." 
            },
            { 
                label: "Bộ máy", 
                value: "Cơ chế Quartz hoặc cơ khí đơn giản (tùy phiên bản mô phỏng)." 
            }
        ]
    },
    {
        id: "sp_oip",
        name: "Đồng hồ OIP",
        price: 4200000,
        image: "images/oip.webp",
        category: "doi",
        description_short: "Nhân vật biểu tượng Gumball.",
        description_long: "Đồng hồ OIP là phiên bản sưu tầm độc đáo, tái hiện hình ảnh nhân vật đồng hồ đáng yêu và hài hước từ bộ phim hoạt hình The Amazing World of Gumball.",
        specs: [
            { 
                label: "Thiết kế", 
                value: "Hình dáng mặt tròn, màu cam rực rỡ, tay và chân tạo hình sống động, mang đậm phong cách hoạt hình." 
            },
            { 
                label: "Chất liệu Vỏ", 
                value: "Nhựa ABS cao cấp, được thiết kế hầm hố, chống va đập tuyệt đối, bền màu." 
            },
            { 
                label: "Kích thước", 
                value: "Đường kính mặt khoảng 10cm. Kích thước tổng thể phù hợp để đặt trên bàn học, kệ sách hoặc bàn làm việc." 
            },
            { 
                label: "Bộ máy", 
                value: "Quartz (Pin) đơn giản, đảm bảo hiển thị giờ, phút, giây cơ bản." 
            },
            { 
                label: "Mục đích", 
                value: "Sưu tầm, trang trí." 
            }
        ]
    },
    {
        id: "sp_timecity",
        name: "Đồng hồ Time City",
        price: 696500000,
        image: "images/time_city.webp",
        category: "doi",
        description_short: "Dòng Luxe Diamond giới thượng lưu.",
        description_long: "Đồng hồ Time City Luxe Diamond là một tuyệt tác chế tác, thể hiện đẳng cấp vượt trội và sự xa hoa tinh tế, chỉ dành cho giới thượng lưu.",
        specs: [
            { 
                label: "Thiết kế", 
                value: "Mặt đồng hồ nổi bật với vòng tròn kim cương được sắp xếp tỉ mỉ, tạo hiệu ứng thị giác lấp lánh như xoáy nước ánh kim cương." 
            },
            { 
                label: "Chất liệu Đính kết", 
                value: "Kim cương tự nhiên (Full Diamond) được đính kết thủ công trên toàn bộ vỏ." 
            },
            { 
                label: "Vỏ (Case)", 
                value: "Chế tác từ kim loại quý (Vàng trắng hoặc Thép không gỉ cao cấp) được đánh bóng." 
            },
            { 
                label: "Dây đeo (Strap)", 
                value: "Dây cao su tự nhiên màu đen tuyền, tạo độ tương phản sang trọng với kim cương và mang lại sự thoải mái khi đeo." 
            },
            { 
                label: "Bộ máy (Movement)", 
                value: "Swiss Quartz hoặc Automatic cao cấp, đảm bảo độ chính xác tuyệt đối." 
            },
            { 
                label: "Kính", 
                value: "Kính Sapphire nguyên khối, chống trầy xước." 
            }
        ]
    },
    {
        id: "sp_casio_001",
        name: "Casio G-Shock GA-2100",
        price: 3500000,
        image: "images/ảnh đồng hồ nam 1.jpg",
        category: "nam",
        description_short: "Thiết kế bát giác mạnh mẽ.",
        description_long: "Mẫu G-Shock GA-2100 được mệnh danh là 'Casioak' với thiết kế bát giác độc đáo và độ mỏng kỷ lục trong dòng G-Shock. Được trang bị cấu trúc Carbon Core Guard, chiếc đồng hồ này cực kỳ bền bỉ nhưng vẫn rất nhẹ.",
        specs: [
            { 
                label: "Thiết kế", 
                value: "Thiết kế bát giác mạnh mẽ (Casioak), màu đen mờ (matte black) toàn bộ." 
            },
            { 
                label: "Bộ máy", 
                value: "Khả năng cao là máy Quartz Chronograph. Chức năng bấm giờ thể thao (Chronograph)." 
            },
            { 
                label: "Chất liệu", 
                value: "Vỏ thép không gỉ được phủ lớp PVD đen, kính khoáng cường lực." 
            },
            { 
                label: "Khả năng chống nước", 
                value: "Theo mặt đồng hồ, có in 100 METERS (tương đương 10 ATM), có thể dùng khi bơi lội nông." 
            }
        ]
    },
    {
        id: "sp_daniel_001",
        name: "Daniel Wellington Petite",
        price: 4200000,
        image: "images/ảnh đồng hồ nam 2.jpg",
        category: "nu",
        description_short: "Tinh tế và thanh lịch.",
        description_long: "Đồng hồ DW Petite mang đến vẻ đẹp tối giản, tinh tế và thanh lịch chuẩn phong cách Bắc Âu. Mặt đồng hồ nhỏ nhắn, kết hợp với dây lưới (mesh) bằng thép không gỉ sang trọng.",
        specs: [
            { 
                label: "Thiết kế", 
                value: "Mặt số và dây đeo thép không gỉ nguyên khối được mạ PVD màu đen. Các chi tiết kim và cọc số màu vàng kim nổi bật." 
            },
            { 
                label: "Chức năng", 
                value: "Là đồng hồ Chronograph (bấm giờ thể thao) với ba mặt số phụ (sub-dials) và ô lịch ngày nằm ở vị trí 3 giờ." 
            },
            { 
                label: "Bộ máy", 
                value: "Quartz (Pin) đảm bảo độ chính xác cao." 
            },
            { 
                label: "Chất liệu", 
                value: "Vỏ và dây thép không gỉ, mặt kính khoáng cứng chịu lực tốt." 
            }
        ]
    },
    {
        id: "sp_seiko_001",
        name: "Seiko 5 Sports",
        price: 7800000,
        image: "images/ảnh đồng hồ nam 3.jpg",
        category: "nam",
        description_short: "Cỗ máy cơ tự động bền bỉ.",
        description_long: "Dòng Seiko 5 Sports huyền thoại với lịch sử gần 60 năm, nổi tiếng về độ bền và tin cậy. Hoàn hảo cho người yêu thích đồng hồ cơ và phong cách thể thao, phiêu lưu.",
        specs: [
            { 
                label: "Thiết kế", 
                value: "Mang phong cách quân đội (military) và thể thao mạnh mẽ, với thiết kế vỏ lớn, màu đen mờ (matte black) toàn bộ. Mặt số có kết cấu sần, cọc số lớn dễ đọc." 
            },
            { 
                label: "Bộ máy", 
                value: "Sở hữu bộ máy cơ Automatic (tự động lên dây) mạnh mẽ." 
            },
            { 
                label: "Tính năng", 
                value: "Chức năng bấm giờ thể thao (Chronograph) và ô hiển thị lịch ngày tại vị trí 4 giờ. Khả năng chống nước 100m." 
            },
            { 
                label: "Chất liệu", 
                value: "Vỏ thép không gỉ được phủ lớp PVD đen, kính khoáng cường lực." 
            }
        ]
    },
    {
        id: "sp_citizen_001",
        name: "Citizen Eco-Drive Pair",
        price: 9500000,
        image: "images/xanhhong.jpg",
        category: "doi",
        description_short: "Đồng hồ cặp năng lượng ánh sáng.",
        description_long: "Bộ đôi đồng hồ Citizen sử dụng công nghệ Eco-Drive độc quyền, hấp thụ mọi nguồn ánh sáng để tạo năng lượng, vĩnh viễn không cần thay pin. Là món quà ý nghĩa thể hiện sự bền vững và trọn vẹn trong tình yêu đôi lứa.",
        specs: [
            { 
                label: "Thiết kế", 
                value: "Thiết kế cổ điển, vỏ và dây đeo làm từ thép không gỉ sáng bóng. Phiên bản Nam: Mặt số màu xanh dương đậm. Phiên bản Nữ: Mặt số màu hồng phấn, dịu dàng." 
            },
            { 
                label: "Mặt số", 
                value: "Cọc số đơn giản và có một viên đá đính ở vị trí 12 giờ, tạo điểm nhấn sang trọng." 
            },
            { 
                label: "Bộ máy", 
                value: "Công nghệ Eco-Drive, sử dụng pin sạc bằng năng lượng ánh sáng." 
            },
            { 
                label: "Khả năng chống nước", 
                value: "Chống nước sinh hoạt cơ bản." 
            }
        ]
    },
    {
        id: "sp_tissot_001",
        name: "Tissot Le Locle Nữ",
        price: 14500000,
        image: "images/nhatban.jpg",
        category: "nu",
        description_short: "Họa tiết hoa anh đào tinh xảo.",
        description_long: "Mẫu đồng hồ này mang vẻ đẹp lãng mạn và thời trang với họa tiết hoa anh đào tinh xảo in trên mặt số. Phù hợp với những người phụ nữ yêu thích sự tinh tế, nữ tính và muốn một món phụ kiện nhẹ nhàng mang hơi hướng Á Đông.",
        specs: [
            { 
                label: "Thiết kế", 
                value: "Vỏ tròn mỏng, dây đeo lưới (mesh) màu kim loại súng (Gunmetal) thời trang, ôm sát cổ tay." 
            },
            { 
                label: "Mặt số", 
                value: "Màu xám than chì (hoặc nâu xám) tối giản, nổi bật là họa tiết hoa anh đào (floral) được chạm khắc hoặc in mờ với màu vàng hồng (rose gold)." 
            },
            { 
                label: "Cọc số", 
                value: "Sử dụng cọc chấm tròn tối giản, không gây rối mắt, làm nổi bật họa tiết hoa." 
            },
            { 
                label: "Bộ máy", 
                value: "Quartz (Pin) mỏng nhẹ, dễ sử dụng." 
            },
            { 
                label: "Chất liệu", 
                value: "Vỏ và dây thép không gỉ, mặt kính khoáng." 
            }
        ]
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