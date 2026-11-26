const cartContainer = document.querySelector(".cart-items");

let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

const shippingFee = 1000;

function formatPrice(price) {
    return "\u20A6" + Number(price).toLocaleString("en-NG");
}

function parsePrice(price) {
    return Number(String(price).replace(/,/g, "")) || 0;
}

function saveCart() {
    localStorage.setItem("cartItems", JSON.stringify(cart));
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

function resolveImagePath(image) {
    const value = String(image ?? "").trim();
    if (!value) return "images/icon.png";

    if (/^(data:|blob:|https?:)/i.test(value)) return value;

    let path = value.replace(/\\/g, "/").replace(/^\/+/, "");
    while (path.startsWith("../")) path = path.slice(3);

    if (!path.toLowerCase().startsWith("images/")) {
        path = "images/" + path.replace(/^\.?\//, "");
    }

    return encodeURI(path);
}

function displayCart() {
    cartContainer.innerHTML = "";
    if (cart.length === 0) {
        cartContainer.innerHTML = `<div class="empty-cart"> <i class="fa-solid fa-cart-shopping"></i>
        <h3>Your cart is empty!</h3>
        <p>You haven't added any products to your cart yet.</p>
        <a href="explore.html">Start Shopping</a>
        </div>`;

        updateSummary();
        return;
    }
    cart.forEach((product, index) => {
        const quantity = Math.max(1, Number(product.quantity) || 1);
        const price = parsePrice(product.price);
        const imagePath = resolveImagePath(product.image);

        const item = document.createElement("div");
        item.className = "cart-item";
        item.innerHTML = `<img src="${escapeHTML(imagePath)}" alt="${escapeHTML(product.name)}">

                <div class = "product-info">
                <h3>${escapeHTML(product.name)}</h3> <p>${escapeHTML(product.description || "Quality product")}</p> <strong>${formatPrice(price)}</strong> 
                </div>

                <div class="quantity-control">
                <button data-action = "decrease" data-index = "${index}">-</button> <span>${quantity}</span>
                <button data-action= "increase" data-index = "${index}">+</button>
                </div>

                <div class="item-price">
                ${formatPrice(price * quantity)}
                </div>

                <button class="remove-item" data-action = "remove" data-index = "${index}" aria-label = "Remove ${escapeHTML(product.name)}"><p class= "fa-regular fa-trash-can">🗑️</p>
                </button>
        `;

        cartContainer.appendChild(item);

        const itemImage = item.querySelector("img");
        itemImage.addEventListener("error", function () {
            if (!this.dataset.fallbackApplied) {
                this.dataset.fallbackApplied = "true";
                this.src = "images/icon.png";
            }
        });
    });

    updateSummary();
}

function updateSummary() {
    const subtotal = cart.reduce((sum, product) => {
        return sum + parsePrice(product.price) * Math.max(1, Number(product.quantity) || 1);
    }, 0);

    const shipping = cart.length > 0 ? shippingFee : 0;

    const total = subtotal + shipping;

    document.getElementById("subtotal").textContent = formatPrice(subtotal);

    document.getElementById("shipping").textContent = formatPrice(shipping);

    document.getElementById("total").textContent = formatPrice(total);

    document.querySelector(".item-count").textContent = cart.reduce((sum, product) =>
        sum + Math.max(1, Number(product.quantity) || 1), 0);
}

cartContainer.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const index = Number(button.dataset.index);
    const action = button.dataset.action;

    if (!cart[index]) return;
    if (action === "increase") {
        cart[index].quantity = (Number(cart[index].quantity) || 1) + 1;
    } else if (action === "decrease") {
        cart[index].quantity = Math.max(1, (Number(cart[index].quantity) || 1) - 1);
    }
    else if (action === "remove") {
        cart.splice(index, 1);
    }

    saveCart();
    displayCart();
});

document.getElementById("clear-cart").addEventListener("click", function () {
    if (cart.length === 0) return;
    if (confirm("Are you sure you want to clear your cart")) {
        cart = [];

        saveCart();
        displayCart();
    }
});

document.getElementById("checkout").addEventListener("click", function (event) {
    event.preventDefault();
    if (cart.length === 0) {
        window.location.href = "explore.html";
        alert("Your cart is empty. Please add items to your cart before proceeding to checkout.");
        return;
    }
    window.location.href = "checkout.html";
});

displayCart();