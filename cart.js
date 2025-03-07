document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  console.log("Cart initialized:", cart);

  const cartIcon = document.getElementById("cart-icon");
  const cartCount = document.getElementById("cart-count");
  const cartSidebar = document.getElementById("cart-sidebar");
  const closeCartBtn = document.getElementById("close-cart");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");
  const removeAllBtn = document.getElementById("remove-all-btn");

  // Check all required elements
  if (!cartIcon) console.error("Cart icon not found!");
  if (!cartCount) console.error("Cart count not found!");
  if (!cartSidebar) console.error("Cart sidebar not found!");
  if (!closeCartBtn) console.error("Close cart button not found!");
  if (!cartItemsContainer) console.error("Cart items container not found!");
  if (!cartTotal) console.error("Cart total not found!");
  if (!checkoutBtn) console.error("Checkout button not found!");
  if (!removeAllBtn) console.error("Remove all button not found!");

  const cartNotification = document.createElement("div");
  cartNotification.id = "cart-notification";
  cartNotification.style.cssText = `
      position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-20px); 
      background: rgba(0, 0, 0, 0.85); color: white; padding: 15px 20px; border-radius: 12px; 
      font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'San Francisco', sans-serif;
      display: flex; align-items: center; gap: 15px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      opacity: 0; transition: opacity 0.3s ease, transform 0.3s ease; z-index: 1000; max-width: 350px;
  `;
  document.body.appendChild(cartNotification);

  function showNotification(message) {
      cartNotification.innerHTML = `
          <span>${message}</span>
          <button id="view-cart-btn" style="
              background: rgba(255, 255, 255, 0.2); color: white; border: none; 
              padding: 6px 12px; border-radius: 8px; font-size: 12px; cursor: pointer;
              transition: background 0.2s ease;">View Cart</button>
      `;
      cartNotification.style.display = "flex";
      cartNotification.style.opacity = "1";
      cartNotification.style.transform = "translateX(-50%) translateY(0)";
      setTimeout(() => {
          cartNotification.style.opacity = "0";
          cartNotification.style.transform = "translateX(-50%) translateY(-20px)";
          setTimeout(() => cartNotification.style.display = "none", 300);
      }, 3000); // Stays visible for 3 seconds

      // Add event listener to View Cart button
      const viewCartBtn = document.getElementById("view-cart-btn");
      if (viewCartBtn) {
          viewCartBtn.addEventListener("click", () => {
              window.location.href = "cart.html"; // Redirect to cart.html
              cartNotification.style.opacity = "0";
              cartNotification.style.transform = "translateX(-50%) translateY(-20px)";
              setTimeout(() => cartNotification.style.display = "none", 300);
          });
      }
  }

  function updateCartCount() {
      if (!cartCount) return;
      const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
      cartCount.textContent = itemCount;
      if (cartIcon) {
          cartIcon.classList.add("cart-bounce");
          setTimeout(() => cartIcon.classList.remove("cart-bounce"), 500);
      }
  }

  function updateCartDisplay() {
      if (!cartItemsContainer || !cartTotal) return;
      cartItemsContainer.innerHTML = "";
      let total = 0;
      cart.forEach((item, index) => {
          total += item.price * item.quantity;
          const cartItem = document.createElement("div");
          cartItem.classList.add("cart-item");
          cartItem.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 12px; border-bottom: 1px solid #e0e0e0;";
          const imageUrl = item.image || "https://via.placeholder.com/50";
          cartItem.innerHTML = `
              <div style="display: flex; align-items: center; gap: 12px;">
                  <img src="${imageUrl}" alt="${item.name}" style="width: 50px; height: 50px; border-radius: 10px; object-fit: cover;">
                  <div>
                      <p style="margin: 0; font-weight: 600;">${item.name}</p>
                      <p style="margin: 0; font-size: 12px;">$${item.price.toFixed(2)}</p>
                  </div>
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                  <button class="decrease-quantity" data-index="${index}">-</button>
                  <span>${item.quantity}</span>
                  <button class="increase-quantity" data-index="${index}">+</button>
              </div>
          `;
          cartItemsContainer.appendChild(cartItem);
      });
      cartTotal.textContent = `Total: $${total.toFixed(2)}`;
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();

      document.querySelectorAll(".increase-quantity").forEach(btn => {
          btn.addEventListener("click", (e) => {
              const idx = e.target.getAttribute("data-index");
              cart[idx].quantity++;
              updateCartDisplay();
          });
      });

      document.querySelectorAll(".decrease-quantity").forEach(btn => {
          btn.addEventListener("click", (e) => {
              const idx = e.target.getAttribute("data-index");
              if (cart[idx].quantity > 1) cart[idx].quantity--;
              else cart.splice(idx, 1);
              updateCartDisplay();
          });
      });
  }

  function attachCartListeners() {
      const buttons = document.querySelectorAll(".add-to-cart");
      console.log("Found add-to-cart buttons:", buttons.length);
      if (buttons.length === 0) console.warn("No add-to-cart buttons found!");
      buttons.forEach(button => {
          button.addEventListener("click", () => {
              const id = button.getAttribute("data-product-id");
              console.log("Adding product ID:", id);
              const products = JSON.parse(localStorage.getItem("products")) || [];
              const product = products.find(p => p.id === id);
              if (!product) {
                  console.error("Product not found for ID:", id);
                  showNotification("Product not found!");
                  return;
              }
              const existing = cart.find(item => item.id === id);
              if (existing) existing.quantity++;
              else cart.push({ ...product, quantity: 1 });
              console.log("Cart updated:", cart);
              updateCartDisplay();
              showNotification(`${product.name} added to cart`);
          });
      });
  }

  if (cartIcon) {
      cartIcon.addEventListener("click", () => {
          if (cartSidebar) {
              cartSidebar.classList.add("cart-visible");
              console.log("Cart sidebar opened");
          } else {
              console.error("Cart sidebar not available to open!");
          }
      });
  }

  if (closeCartBtn) {
      closeCartBtn.addEventListener("click", () => {
          if (cartSidebar) {
              cartSidebar.classList.remove("cart-visible");
              console.log("Cart sidebar closed");
          }
      });
  }

  document.addEventListener("click", (e) => {
      if (cartSidebar && cartIcon && !cartSidebar.contains(e.target) && e.target !== cartIcon) {
          cartSidebar.classList.remove("cart-visible");
      }
  });

  if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
          window.location.href = "cart.html"; // Updated to cart.html for consistency
      });
  }

  if (removeAllBtn) {
      removeAllBtn.addEventListener("click", () => {
          cart = [];
          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartDisplay();
      });
  }

  updateCartDisplay();

  window.addEventListener("productsLoaded", () => {
      console.log("Products loaded event received, attaching cart listeners");
      attachCartListeners();
  });

  // Fallback: try attaching listeners after a short delay if event missed
  setTimeout(() => {
      if (document.querySelectorAll(".add-to-cart").length > 0 && !window.cartListenersAttached) {
          console.log("Fallback: attaching cart listeners after delay");
          attachCartListeners();
          window.cartListenersAttached = true;
      }
  }, 2000);
});