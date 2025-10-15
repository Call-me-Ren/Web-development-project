
// Tự động gọi hàm render icon của Lucide
    lucide.createIcons();
// Thêm giỏ hàng
    let count = 0;
    const cartCount = document.getElementById("cart-count");
    const addButtons = document.querySelectorAll(".add-to-cart");
    addButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        count++;
        cartCount.textContent = count;
        // hiệu ứng nhỏ khi thêm
        cartCount.style.transform = "scale(1.3)";
        setTimeout(() => cartCount.style.transform = "scale(1)", 150);
     });
});