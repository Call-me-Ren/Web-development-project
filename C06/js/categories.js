// js/categories.js

// Key này PHẢI KHỚP với key trong file js/admin.js
const CATEGORY_KEY = 'watchtime_categories';

/**
 * Hàm này sẽ:
 * 1. Thử đọc danh mục từ localStorage (do admin cài đặt).
 * 2. Nếu không có, nó sẽ tạo một danh sách mặc định (Nam, Nữ, Đôi).
 * 3. Lưu danh sách (mới hoặc mặc định) vào localStorage.
 */
function getCategoriesFromStorage() {
    let categories = [];
    try {
        // 1. Thử đọc từ localStorage
        const storedCategories = localStorage.getItem(CATEGORY_KEY);
        
        if (storedCategories) {
            categories = JSON.parse(storedCategories);
        }

        // 2. Nếu localStorage trống, tạo dữ liệu mặc định
        if (!categories || categories.length === 0) {
            console.warn("localStorage 'watchtime_categories' trống! Đang tạo dữ liệu mặc định.");
            
            categories = [
                { id: 'nam', name: 'Đồng hồ Nam', margin: 50 }, 
                { id: 'nu', name: 'Đồng hồ Nữ', margin: 55 }, 
                { id: 'doi', name: 'Đồng hồ Đôi', margin: 50 }
            ];
            
            // 3. Lưu lại danh sách mặc định này vào localStorage
            // Lần sau, admin vào cũng sẽ thấy 3 mục này
            localStorage.setItem(CATEGORY_KEY, JSON.stringify(categories));
        }
        
        return categories;

    } catch (e) {
        console.error("Lỗi khi đọc danh mục (categories) từ localStorage:", e);
        return []; // Trả về mảng rỗng nếu lỗi
    }
}

// Cung cấp biến global 'allCategories' cho file Giaodien.js sử dụng
const allCategories = getCategoriesFromStorage();