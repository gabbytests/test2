if (localStorage.getItem("authenticated") !== "true") {
    window.location.href = "login.html";
  }
  
  const db = firebase.database();
  const productsRef = db.ref('products');
  
  function displayProducts() {
    const productList = document.getElementById("productList");
    productList.innerHTML = "Loading products...";
    productsRef.on('value', (snapshot) => {
      productList.innerHTML = "";
      const products = snapshot.val();
      if (products) {
        Object.keys(products).forEach(id => {
          const product = products[id];
          const div = document.createElement("div");
          div.className = "product-item";
          div.innerHTML = `
            <img src="${product.image || ''}" alt="${product.name}">
            <div class="product-info">
              <div class="name">${product.name}</div>
              <div class="price">$${product.price.toFixed(2)}</div>
            </div>
            <div class="actions">
              <button onclick="editProduct('${id}')">Edit</button>
              <button onclick="deleteProduct('${id}')">Delete</button>
            </div>
          `;
          productList.appendChild(div);
        });
      } else {
        productList.innerHTML = "No products found.";
      }
    }, (error) => {
      console.error("Error fetching products:", error);
      productList.innerHTML = "Failed to load products.";
      showNotification("Error loading products: " + error.message, true);
    });
  }
  
  function saveProduct(event) {
    event.preventDefault();
    const id = document.getElementById("productId").value || Date.now().toString();
    const name = document.getElementById("productName").value;
    const price = parseFloat(document.getElementById("productPrice").value);
    const fileInput = document.getElementById("productImage");
    const file = fileInput.files[0];
  
    if (!name || isNaN(price)) {
      showNotification("Please enter a valid name and price", true);
      return;
    }
  
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const image = e.target.result;
        productsRef.child(id).set({ id, name, price, image })
          .then(() => {
            showNotification("Product saved successfully");
            clearForm();
          })
          .catch(error => {
            console.error("Error saving product:", error);
            showNotification("Error saving product: " + error.message, true);
          });
      };
      reader.onerror = function() {
        showNotification("Error reading image file", true);
      };
      reader.readAsDataURL(file);
    } else {
      productsRef.child(id).once('value', (snapshot) => {
        const existing = snapshot.val();
        const image = existing ? existing.image : "";
        productsRef.child(id).set({ id, name, price, image })
          .then(() => {
            showNotification("Product updated successfully");
            clearForm();
          })
          .catch(error => {
            console.error("Error updating product:", error);
            showNotification("Error updating product: " + error.message, true);
          });
      });
    }
  }
  
  function editProduct(id) {
    productsRef.child(id).once('value', (snapshot) => {
      const product = snapshot.val();
      if (product) {
        document.getElementById("productId").value = product.id;
        document.getElementById("productName").value = product.name;
        document.getElementById("productPrice").value = product.price;
        document.getElementById("imagePreview").src = product.image || "";
        document.getElementById("imagePreview").style.display = product.image ? "block" : "none";
      }
    }, (error) => {
      console.error("Error fetching product for edit:", error);
      showNotification("Error loading product: " + error.message, true);
    });
  }
  
  function deleteProduct(id) {
    productsRef.child(id).remove()
      .then(() => showNotification("Product deleted successfully"))
      .catch(error => {
        console.error("Error deleting product:", error);
        showNotification("Error deleting product: " + error.message, true);
      });
  }
  
  function clearForm() {
    document.getElementById("product-form").reset();
    document.getElementById("productId").value = "";
    document.getElementById("imagePreview").style.display = "none";
  }
  
  function updatePreview() {
    const fileInput = document.getElementById("productImage");
    const file = fileInput.files[0];
    const preview = document.getElementById("imagePreview");
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        preview.src = e.target.result;
        preview.style.display = "block";
      };
      reader.onerror = function() {
        showNotification("Error previewing image", true);
      };
      reader.readAsDataURL(file);
    }
  }
  
  function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.toggle('error', isError);
    notification.style.display = 'block';
    notification.style.opacity = '1';
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => notification.style.display = 'none', 300);
    }, 2000);
  }
  
  document.getElementById("product-form").addEventListener("submit", saveProduct);
  displayProducts();