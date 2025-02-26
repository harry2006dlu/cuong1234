const cartItems = [];
const cartList = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');
const checkoutButton = document.getElementById('checkout');

// Cập nhật giỏ hàng
function updateCart() {
    // Xóa các item trong giỏ hàng
    cartList.innerHTML = '';
    let total = 0;
    
    // Thêm các sản phẩm vào giỏ hàng
    cartItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.price} VND`;
        cartList.appendChild(li);
        total += item.price;
    });
    
    // Cập nhật tổng giá trị
    totalPriceElement.textContent = `Tổng giá: ${total} VND`;
    
    // Kích hoạt nút thanh toán nếu có sản phẩm trong giỏ
    checkoutButton.disabled = cartItems.length === 0;
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(product) {
    cartItems.push(product);
    updateCart();
}

// Xử lý sự kiện khi nhấn nút "Thêm vào giỏ"
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const productElement = button.closest('.product');
        const productId = productElement.getAttribute('data-id');
        const productName = productElement.querySelector('h3').textContent;
        const productPrice = parseInt(productElement.querySelector('p').textContent.replace('Giá: ', '').replace(' VND', ''));
        
        const product = { id: productId, name: productName, price: productPrice };
        addToCart(product);
    });
});

// Xử lý sự kiện khi nhấn nút "Thanh toán"
checkoutButton.addEventListener('click', () => {
    alert('Cảm ơn bạn đã mua hàng!');
    cartItems.length = 0; // Xóa giỏ hàng
    updateCart();
});
