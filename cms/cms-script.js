const db = firebase.database();
const productsRef = db.ref('products');

function loadProducts() {
    productsRef.on('value', (snapshot) => {
        const products = snapshot.val();
        if (products) {
            localStorage.setItem("products", JSON.stringify(products)); // Store in LocalStorage
            displayProducts(products);
        }
    });
}

function displayProducts(products) {
    const productList = document.getElementById("productList");
    productList.innerHTML = "";
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
            <button class="add-to-cart" data-product-id="${id}">Add to Cart</button>
        `;
        productList.appendChild(div);
    });

    attachAddToCartListeners();
}

function attachAddToCartListeners() {
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-product-id");
            const products = JSON.parse(localStorage.getItem("products")) || {};
            const product = products[id];

            if (product) {
                addToCart(id, product.name, product.price, product.image);
            }
        });
    });
}

loadProducts();
