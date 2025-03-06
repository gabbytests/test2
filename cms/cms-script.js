let storedHash = "$2b$10$5z5Qz5z5Qz5z5Qz5z5Qz5uQz5z5Qz5z5Qz5z5Qz5z5Qz5z5Qz5z5Q"; // Hash for "admin123"

function login() {
  const password = document.getElementById("password").value;
  if (bcrypt.compareSync(password, storedHash)) {
    window.location.href = "dashboard.html";
  } else {
    alert("Incorrect password");
  }
}

// Dashboard functions (keep your existing saveProduct, etc.)
let products = JSON.parse(localStorage.getItem("products")) || [];

function displayProducts() {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";
  products.forEach(product => {
    const div = document.createElement("div");
    div.className = "product-item";
    div.innerHTML = `
      <div style="display: flex; align-items: center;">
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">${product.name} - $${product.price.toFixed(2)}</div>
      </div>
      <div class="actions">
        <button onclick="editProduct('${product.id}')">Edit</button>
        <button onclick="deleteProduct('${product.id}')">Delete</button>
      </div>
    `;
    productList.appendChild(div);
  });
}

function saveProduct() {
  const id = document.getElementById("productId").value || Date.now().toString();
  const name = document.getElementById("productName").value;
  const price = parseFloat(document.getElementById("productPrice").value);
  const image = document.getElementById("productImage").value;
  const existing = products.find(p => p.id === id);
  if (existing) Object.assign(existing, { name, price, image });
  else products.push({ id, name, price, image });
  localStorage.setItem("products", JSON.stringify(products));
  displayProducts();
  clearForm();
}

function deleteProduct(id) {
  products = products.filter(p => p.id !== id);
  localStorage.setItem("products", JSON.stringify(products));
  displayProducts();
}

function clearForm() {
  document.getElementById("productId").value = "";
  document.getElementById("productName").value = "";
  document.getElementById("productPrice").value = "";
  document.getElementById("productImage").value = "";
  document.getElementById("imagePreview").style.display = "none";
}

function updatePreview() {
  const url = document.getElementById("productImage").value;
  const preview = document.getElementById("imagePreview");
  if (url) {
    preview.src = url;
    preview.style.display = "block";
  } else {
    preview.style.display = "none";
  }
}

if (document.getElementById("productList")) displayProducts();