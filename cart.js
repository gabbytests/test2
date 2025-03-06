let cart = JSON.parse(localStorage.getItem("cart")) || [];
let products = JSON.parse(localStorage.getItem("products")) || [];

document.addEventListener("DOMContentLoaded", () => {
  const cartIcon = document.getElementById("cart-icon");
  const cartCount = document.getElementById("cart-count");
  const cartSidebar = document.getElementById("cart-sidebar");
  const closeCartBtn = document.getElementById("close-cart");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");

  const cartNotification = document.createElement("div");
  cartNotification.id = "cart-notification";
  cartNotification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: #0071e3;
    color: white;
    padding: 10px 15px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: bold;
    display: none;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    z-index: 1000;
  `;
  document.body.appendChild(cartNotification);

  function showNotification(message) {
    cartNotification.textContent = message;
    cartNotification.style.display = "block";
    cartNotification.style.opacity = "1";
    cartNotification.style.transform = "translateY(0)";
    setTimeout(() => {
      cartNotification.style.opacity = "0";
      cartNotification.style.transform = "translateY(-10px)";
      setTimeout(() => cartNotification.style.display = "none", 300);
    }, 1500);
  }

  function updateCartCount() {
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = itemCount;
    cartIcon.classList.add("cart-bounce");
    setTimeout(() => cartIcon.classList.remove("cart-bounce"), 500);
  }

  function updateCartDisplay() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      const product = products.find(p => p.id === item.id) || item;
      total += product.price * item.quantity;
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.style.display = "flex";
      cartItem.style.alignItems = "center";
      cartItem.style.justifyContent = "space-between";
      cartItem.style.padding = "12px";
      cartItem.style.borderBottom = "1px solid #e0e0e0";

      const imageUrl = product.image || "https://via.placeholder.com/50";
      cartItem.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${imageUrl}" alt="${product.name}" style="width: 50px; height: 50px; border-radius: 10px; object-fit: cover;">
          <div class="cart-item-info">
            <p class="cart-item-name" style="margin: 0; font-weight: 600; font-size: 14px; color: #333;">${product.name}</p>
            <p class="cart-item-price" style="margin: 0; font-size: 12px; color: #666;">$${product.price}</p>
          </div>
        </div>
        <div class="cart-item-quantity" style="display: flex; align-items: center; gap: 6px; background: #f5f5f5; padding: 4px 10px; border-radius: 10px;">
          <button class="decrease-quantity" data-index="${index}" style="width: 22px; height: 22px; border-radius: 50%; background: #ddd; border: none; font-size: 12px; cursor: pointer;">-</button>
          <span style="font-weight: bold; font-size: 14px;">${item.quantity}</span>
          <button class="increase-quantity" data-index="${index}" style="width: 22px; height: 22px; border-radius: 50%; background: #ddd; border: none; font-size: 12px; cursor: pointer;">+</button>
        </div>
      `;
      cartItemsContainer.appendChild(cartItem);
    });

    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

    document.querySelectorAll(".increase-quantity").forEach(button => {
      button.addEventListener("click", (e) => {
        const idx = e.currentTarget.getAttribute("data-index");
        cart[idx].quantity++;
        updateCartDisplay();
      });
    });

    document.querySelectorAll(".decrease-quantity").forEach(button => {
      button.addEventListener("click", (e) => {
        const idx = e.currentTarget.getAttribute("data-index");
        if (cart[idx].quantity > 1) {
          cart[idx].quantity--;
        } else {
          cart.splice(idx, 1);
        }
        updateCartDisplay();
      });
    });
  }

  window.initializeCartListeners = function() {
    document.querySelectorAll(".add-to-cart").forEach(button => {
      button.removeEventListener("click", addToCartHandler); // Remove old listeners
      button.addEventListener("click", addToCartHandler);
    });
  };

  function addToCartHandler(e) {
    e.preventDefault();
    const btn = e.currentTarget;
    const id = btn.getAttribute("data-product-id");
    const name = btn.getAttribute("data-name");
    const price = parseFloat(btn.getAttribute("data-price"));
    const image = btn.getAttribute("data-image") || "";

    if (!name || isNaN(price) || !id) return;

    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ id, name, price, quantity: 1, image });
    }

    updateCartDisplay();
    showNotification(`${name} added to cart`);
  }

  cartIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    cartSidebar.classList.add("cart-visible");
  });

  document.addEventListener("click", (event) => {
    if (!cartSidebar.contains(event.target) && event.target !== cartIcon) {
      cartSidebar.classList.remove("cart-visible");
    }
  });

  closeCartBtn.addEventListener("click", () => {
    cartSidebar.classList.remove("cart-visible");
  });

  checkoutBtn.addEventListener("click", () => {
    window.location.href = "checkout.html";
  });

  updateCartDisplay();
  window.initializeCartListeners();
});