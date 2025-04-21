// slider.js

const slidesData = [
    {
        id: 1,
        image: "Screen Shot 2025-04-19 at 22.28.55.png",
        title: "Khuyến mãi siêu to!",
    },
    {
        id: 2,
        image: "Screen Shot 2025-04-19 at 22.23.37.png",
        title: "Mua 1 tặng 1 toàn shop",
    },
    {
        id: 3,
        image: "Screen Shot 2025-04-19 at 22.24.04.png",
        title: "Freeship toàn quốc đơn từ 0đ!",
    }
  ];
  
  let currentIndex = 0;
  const slidesEl = document.getElementById("slides");
  
  function renderSlides() {
    slidesEl.innerHTML = slidesData.map(item => `
        <img src="${item.image}" alt="${item.title}">
    `).join("");
  }
  
  function changeSlide(direction) {
    currentIndex += direction;
  
    if (currentIndex < 0) currentIndex = slidesData.length - 1;
    if (currentIndex >= slidesData.length) currentIndex = 0;
  
    slidesEl.style.transform = `translateX(-${currentIndex * 100}%)`;
  }
  
  // Tự động chuyển slide mỗi 5s
  setInterval(() => changeSlide(1), 5000);
  
  // Init
  document.addEventListener("DOMContentLoaded", () => {
    renderSlides();
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
const nav = document.querySelector('.navbar');
const contactForm = document.getElementById('contact-form');
const productsPage= document.getElementById('products-page');
const cartPage= document.getElementById('cart-page');
const aboutPage= document.getElementById('about-page');

// Cart Array
let cart = [];

// Display Products
  // ===== PHẦN ƯU TIÊN: Load sản phẩm trước =====
  
  const API_URL = 'https://dummyjson.com/products';
  const NUM_PRODUCTS_TO_SHOW = 40;
  const CONTAINER_ID = 'homepage-products';
  let statsStarted = false; // đảm bảo chỉ chạy 1 lần

  // Load sản phẩm trước
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById(CONTAINER_ID);

      data.products.slice(0, NUM_PRODUCTS_TO_SHOW).forEach(product => {
        const item = document.createElement('div');
        item.className = 'product';
        item.innerHTML = `
          <img src="${product.thumbnail}" alt="${product.title}">
          <h3>${product.title}</h3>
          <p>${product.price} USD</p>
        `;
        container.appendChild(item);
      });

      // Sau khi render sản phẩm xong, kích hoạt observer
      observeStatsSection();
    });

    function initStatsCounter() {
        const counters = document.querySelectorAll('.stat-number');
      
        counters.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target'));
          const isDecimal = counter.hasAttribute('data-decimal');
      
          let current = 0;
          const step = target / 100;
          
          function updateCount() {
            current += step;
      
            if (current < target) {
              counter.innerText = isDecimal
                ? current.toFixed(1)
                : Math.floor(current);
      
              requestAnimationFrame(updateCount);
            } else {
              counter.innerText = isDecimal
                ? target.toFixed(1)
                : target;
            }
          }
      
          updateCount();
        });
      }
      

  // Observer sẽ gọi hàm này khi user cuộn tới stats-bar
  function observeStatsSection() {
    const statsSection = document.querySelector('.stats-bar');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsStarted) {
          statsStarted = true; // chỉ chạy 1 lần
          initStatsCounter();
        }
      });
    }, ); // 50% hiển thị mới kích hoạt
    
    observer.observe(statsSection);
  }


  // Hàm chạy animation đếm số
  function initStatsCounter() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const isDecimal = counter.hasAttribute('data-decimal');
      let current = 0;
      const step = target / 100;

      const updateCount = () => {
        current += step;
        if (current < target) {
          counter.innerText = isDecimal ? current.toFixed(1) : Math.floor(current);
          counter.classList.add('bounce');
          setTimeout(() => counter.classList.remove('bounce'), 500); // reset lại class để tái dùng

          // 👇 Thêm hiệu ứng mỗi lần số thay đổi
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = isDecimal ? target.toFixed(1) : target;
          counter.classList.add('bounce');
          setTimeout(() => counter.classList.remove('bounce'), 500); // reset lại class để tái dùng


        }
      };

      updateCount();
    });
  }


  // Save cart to localStorage
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error("Error saving cart to localStorage", error);
    }


// Mobile Navigation (toggle navbar khi click vào burger)
document.addEventListener("DOMContentLoaded", function () {
    // Lấy tất cả các phần tử burger (menu) và navbar trên trang
    const burgers = document.querySelectorAll(".burger");  // Lấy tất cả các burger
    const navbars = document.querySelectorAll(".navbar");  // Lấy tất cả các navbar
    const productsPage= document.getElementById('products-page');
    const cartPage= document.getElementById('cart-page');
    const aboutPage= document.getElementById('about-page');

    // Duyệt qua tất cả các burger và navbar
    burgers.forEach((burger, index) => {
        burger.addEventListener("click", function () {
            // Lấy navbar và nav-links tương ứng với burger đang được click
            const navbar = navbars[index];
            const navLinks = navbar.querySelector(".nav-links");
            const navLinkss = navbar.querySelector(".nav-linkss");
            const navLinksz = navbar.querySelector(".nav-linksz");
            const navLinkszz = navbar.querySelector(".nav-linkszz");

            // Thêm hoặc bỏ class 'active' cho navbar và nav-links
            navbar.classList.toggle("active");
            if (navLinks) {
                navLinks.classList.toggle("active");
            }
            navbar.classLists.toggle("active");
            if (navLinkss) {
                navLinkss.classLists.toggle("active");
            }
            
            if (navLinksz) {
                navLinksz.classListz.toggle("active");
            }
            if (navLinkszz) {
                navLinkszz.classListzz.toggle("active");
            }

            // Thêm hoặc bỏ class 'toggle' cho burger để thay đổi hình dạng
            burger.classList.toggle("toggle");
            burger.classLists.toggle("toggle");
            burger.classListz.toggle("toggle");
            burger.classListzz.toggle("toggle");
        });
    });
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
;`

document.head.appendChild(style);
