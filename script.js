// Product Data
const products = [
  {
      id: 1,
      name: "Classic ",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      description: "Traditional Cuban with fresh mint"
  },
  {
      id: 2,
      name: "Strawberry ",
      price: 14.99,
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      description: "Sweet strawberry flavor with mint"
  },
  {
      id: 3,
      name: "Coconut ",
      price: 13.99,
      image: "https://images.unsplash.com/photo-1587223075055-82e9a937ddff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      description: "Tropical coconut with fresh lime"
  },
  {
      id: 4,
      name: "Passion Fruit",
      price: 15.99,
      image: "https://images.unsplash.com/photo-1546171753-97d7676e4602?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      description: "Exotic passion fruit blend"
  }
];

// Tiktok shop api
class TikTokProducts {
  constructor() {
      this.productsContainer = document.getElementById('products-grid');
      this.paginationContainer = document.getElementById('pagination');
      this.currentPage = 1;
      this.productsPerPage = 20;
      
      this.init();
  }

  async init() {
      await this.loadProducts();
      this.setupEventListeners();
  }

  async loadProducts(page = 1) {
      try {
          const response = await fetch(`/backend/api/tiktok-products?page=${page}`);
          const data = await response.json();
          
          if (data.products) {
              this.renderProducts(data.products);
              this.renderPagination(data.total_pages);
          }
      } catch (error) {
          console.error('Error loading products:', error);
          this.showError('Failed to load products');
      }
  }

  renderProducts(products) {
      this.productsContainer.innerHTML = products.map(product => `
          <div class="product-card">
              <img src="${product.image}" alt="${product.name}" class="product-image">
              <div class="product-info">
                  <h3>${product.name}</h3>
                  <p class="price">${product.price}</p>
                  <div class="product-stats">
                      <span class="sales">${product.sales_count} sold</span>
                      <span class="rating">${product.rating} ⭐</span>
                  </div>
                  <a href="${product.product_url}" target="_blank" class="buy-button">
                      Buy on TikTok Shop
                  </a>
              </div>
          </div>
      `).join('');
  }

  renderPagination(totalPages) {
      this.paginationContainer.innerHTML = `
          <button class="prev-btn" ${this.currentPage === 1 ? 'disabled' : ''}>
              Previous
          </button>
          <span class="page-info">Page ${this.currentPage} of ${totalPages}</span>
          <button class="next-btn" ${this.currentPage === totalPages ? 'disabled' : ''}>
              Next
          </button>
      `;
  }

  setupEventListeners() {
      this.paginationContainer.addEventListener('click', (e) => {
          if (e.target.classList.contains('prev-btn') && this.currentPage > 1) {
              this.currentPage--;
              this.loadProducts(this.currentPage);
          }
          if (e.target.classList.contains('next-btn')) {
              this.currentPage++;
              this.loadProducts(this.currentPage);
          }
      });
  }

  showError(message) {
      this.productsContainer.innerHTML = `
          <div class="error-message">
              <p>${message}</p>
              <button onclick="location.reload()">Try Again</button>
          </div>
      `;
  }
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
  new TikTokProducts();
});


// DOM Elements
const productsGrid = document.querySelector('.products-grid');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.querySelector('.close');
const cartItems = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.querySelector('.checkout-btn');
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const contactForm = document.getElementById('contact-form');

// Cart Array
let cart = [];

// Display Products
function displayProducts() {
  productsGrid.innerHTML = products.map(product => `
      <div class="product-card">
          <img src="${product.image}" alt="${product.name}" class="product-image">
          <div class="product-info">
              <h3>${product.name}</h3>
              <p>${product.description}</p>
              <p class="price">$${product.price}</p>
              <button onclick="addToCart(${product.id})" class="add-to-cart-btn">
                  Add to Cart
              </button>
          </div>
      </div>
  `).join('');
}

// Cart Functions
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
      existingItem.quantity++;
  } else {
      cart.push({
          ...product,
          quantity: 1
      });
  }

  updateCart();
  showNotification(`Added ${product.name} to cart!`);
}

function updateCart() {
  // Update cart count
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;

  // Update cart items display
  cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-details">
              <h4>${item.name}</h4>
              <p>$${item.price} x ${item.quantity}</p>
          </div>
          <div class="cart-item-controls">
              <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
              <span>${item.quantity}</span>
              <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
              <button onclick="removeFromCart(${item.id})" class="remove-btn">&times;</button>
          </div>
      </div>
  `).join('');

  // Update total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotal.textContent = total.toFixed(2);

  // Save cart to localStorage
  try {
      localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
      console.error("Error saving cart to localStorage", error);
  }
}

function updateQuantity(productId, newQuantity) {
  if (newQuantity < 1) {
      removeFromCart(productId);
      return;
  }

  const cartItem = cart.find(item => item.id === productId);
  if (cartItem) {
      cartItem.quantity = newQuantity;
      updateCart();
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
  showNotification('Item removed from cart!');
}

// Cart Modal
document.querySelector('.cart-icon')?.addEventListener('click', (e) => {
  e.preventDefault();
  cartModal.style.display = 'block';
});

closeCart.addEventListener('click', () => {
  cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === cartModal) {
      cartModal.style.display = 'none';
  }
});

// Mobile Navigation
burger.addEventListener('click', () => {
  nav.classList.toggle('nav-active');
  burger.classList.toggle('toggle');
});

// Notification System
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
      notification.remove();
  }, 3000);
}

// Contact Form
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(contactForm);
  const formObject = Object.fromEntries(formData);

  // Here you would typically send this data to a server
  console.log('Form submitted:', formObject);

  showNotification('Message sent successfully!');
  contactForm.reset();
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
          target.scrollIntoView({
              behavior: 'smooth'
          });
      }
  });
});

// Load cart from localStorage
window.addEventListener('load', () => {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
      cart = JSON.parse(savedCart);
      updateCart();
  }
  displayProducts();
});

// Checkout Function
checkoutBtn?.addEventListener('click', () => {
  if (cart.length === 0) {
      showNotification('Your cart is empty!');
      return;
  }

  showNotification('Proceeding to checkout...');
  setTimeout(() => {
      cart = [];
      updateCart();
      cartModal.style.display = 'none';
      showNotification('Thank you for your purchase!');
  }, 2000);
});

// Add some additional styles dynamically
const style = document.createElement('style');
style.textContent = `
  .notification {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--primary-color);
      color: white;
      padding: 15px 25px;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      animation: slideIn 0.3s ease-out;
      z-index: 1000;
  }

  @keyframes slideIn {
      from {
          transform: translateX(100%);
          opacity: 0;
      }
      to {
          transform: translateX(0);
          opacity: 1;
      }
  }

  .cart-item {
      display: flex;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #eee;
  }

  .cart-item-image {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 5px;
      margin-right: 10px;
  }

  .cart-item-controls button {
      padding: 5px 10px;
      margin: 0 5px;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
      border-radius: 3px;
  }

  .remove-btn {
      color: red;
      border: none !important;
  }

  .add-to-cart-btn {
      background: var(--primary-color);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      transition: background 0.3s;
  }

  .add-to-cart-btn:hover {
      background: var(--secondary-color);
  }
`;

document.head.appendChild(style);
