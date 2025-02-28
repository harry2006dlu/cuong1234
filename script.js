let cart = [];

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.parentElement.getAttribute('data-id');
        const productName = this.parentElement.querySelector('p').innerText;
        const productPrice = parseInt(this.parentElement.querySelector('p').nextElementSibling.innerText.replace('Giá: ', '').replace(' VND', ''));

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        let productIndex = cart.findIndex(item => item.id === productId);
        if (productIndex === -1) {
            // Thêm mới sản phẩm vào giỏ hàng
            cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
        } else {
            // Nếu đã có, tăng số lượng
            cart[productIndex].quantity++;
        }

        updateCart();
    });
});

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    const checkoutButton = document.getElementById('checkout');

    // Cập nhật giỏ hàng
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Giỏ hàng của bạn đang trống!</p>';
        checkoutButton.disabled = true;
    } else {
        cartItems.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `<p>${item.name} x ${item.quantity} - ${item.price * item.quantity} VND</p>`;
            cartItems.appendChild(itemDiv);
            total += item.price * item.quantity;
        });
        totalPrice.innerText = `Tổng tiền: ${total} VND`;
        checkoutButton.disabled = false;
    }
}

document.getElementById('checkout').addEventListener('click', function() {
    alert("Chức năng thanh toán qua Momo sẽ được thực hiện tại đây. Hãy thử lại sau.");
});


