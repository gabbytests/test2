if (localStorage.getItem("authenticated") !== "true") {
    window.location.href = "login.html";
  }
  
  let products = JSON.parse(localStorage.getItem("products")) || [];
  
  function displayProducts() {
    const productList = document.getElementById("productList");
    productList.innerHTML = "";
    products.forEach(product => {
      const div = document.createElement("div");
      div.className = "product-item";
      div.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">
          <div class="name">${product.name}</div>
          <div class="price">$${product.price.toFixed(2)}</div>
        </div>
        <div class="actions">
          <button onclick="editProduct('${product.id}')">Edit</button>
          <button onclick="deleteProduct('${product.id}')">Delete</button>
        </div>
      `;
      productList.appendChild(div);
    });
  }
  
  function saveProduct(event) {
    event.preventDefault();
    const id = document.getElementById("productId").value || Date.now().toString();
    const name = document.getElementById("productName").value;
    const price = parseFloat(document.getElementById("productPrice").value);
    const fileInput = document.getElementById("productImage");
    const file = fileInput.files[0];
  
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const image = e.target.result;
        const existing = products.find(p => p.id === id);
        if (existing) {
          Object.assign(existing, { name, price, image });
        } else {
          products.push({ id, name, price, image });
        }
        localStorage.setItem("products", JSON.stringify(products));
        displayProducts();
        clearForm();
      };
      reader.readAsDataURL(file);
    } else if (document.getElementById("productId").value) {
      // If editing and no new file, keep existing image
      const existing = products.find(p => p.id === id);
      if (existing) {
        Object.assign(existing, { name, price });
        localStorage.setItem("products", JSON.stringify(products));
        displayProducts();
        clearForm();
      }
    }
  }
  
  function editProduct(id) {
    const product = products.find(p => p.id === id);
    document.getElementById("productId").value = product.id;
    document.getElementById("productName").value = product.name;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("imagePreview").src = product.image;
    document.getElementById("imagePreview").style.display = "block";
  }
  
  function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
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
      reader.readAsDataURL(file);
    } else {
      preview.style.display = "none";
    }
  }
  
  document.getElementById("product-form").addEventListener("submit", saveProduct);
  displayProducts();