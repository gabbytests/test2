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
  
    console.log("Cart elements check:");
    console.log("cartIcon:", !!cartIcon);
    console.log("cartCount:", !!cartCount);
    console.log("cartSidebar:", !!cartSidebar);
    console.log("closeCartBtn:", !!closeCartBtn);
    console.log("cartItemsContainer:", !!cartItemsContainer);
    console.log("cartTotal:", !!cartTotal);
    console.log("checkoutBtn:", !!checkoutBtn);
    console.log("removeAllBtn:", !!removeAllBtn);
  
    const cartNotification = document.createElement("div");
    cartNotification.id = "cart-notification";
    cartNotification.style.cssText = `
      position: fixed; top: 80px; right: 20px; background: #0071e3; color: white;
      padding: 10px 15px; border-radius: 10px; font-size: 14px; font-weight: bold;
      display: none; opacity: 0; transition: opacity 0.3s ease; z-index: 1000;
    `;
    document.body.appendChild(cartNotification);
  
    function showNotification(message) {
      cartNotification.textContent = message;
      cartNotification.style.display = "block";
      cartNotification.style.opacity = "1";
      setTimeout(() => {
        cartNotification.style.opacity = "0";
        setTimeout(() => cartNotification.style.display = "none", 300);
      }, 1500);
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
  
    // Sidebar toggle
    if (cartIcon && cartSidebar) {
      cartIcon.addEventListener("click", (e) => {
        e.preventDefault();
        cartSidebar.classList.add("cart-visible");
        console.log("Cart sidebar opened via cart-icon click");
      });
    } else {
      console.error("Cart icon or sidebar missing, cannot attach open listener");
    }
  
    if (closeCartBtn && cartSidebar) {
      closeCartBtn.addEventListener("click", () => {
        cartSidebar.classList.remove("cart-visible");
        console.log("Cart sidebar closed via close button");
      });
    }
  
    if (cartSidebar && cartIcon) {
      document.addEventListener("click", (e) => {
        if (!cartSidebar.contains(e.target) && e.target !== cartIcon) {
          cartSidebar.classList.remove("cart-visible");
          console.log("Cart sidebar closed via outside click");
        }
      });
    }
  
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        window.location.href = "/checkout.html"; // Adjust path if needed
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
      console.log("Products loaded, attaching listeners");
      attachCartListeners();
    });
  
    setTimeout(() => {
      if (document.querySelectorAll(".add-to-cart").length > 0) {
        console.log("Fallback: attaching listeners after delay");
        attachCartListeners();
      }
      if (cartIcon && cartSidebar && !cartIcon.onclick) {
        console.log("Fallback: reattaching cart icon listener");
        cartIcon.addEventListener("click", () => {
          cartSidebar.classList.add("cart-visible");
          console.log("Cart sidebar opened via fallback");
        });
      }
    }, 2000);
  });