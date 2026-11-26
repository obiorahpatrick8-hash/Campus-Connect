let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

const checkoutProducts = document.querySelector(".checkout-cards");
const shippingInputs = document.querySelectorAll('input[name="delivery"]');
const shippingForm = document.querySelector(".shipping-info .form");

function parsePrice(price) {
    return Number(String(price).replace(/,/g, "")) || 0;
}

function formatPrice(price) {
    return "\u20A6" + Number(price).toLocaleString("en-NG");
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

function getShippingFee() {
    const selected = document.querySelector('input[name="delivery"]:checked');
    if (!selected) return 0;
    return selected.value === "2" ? 2500 : 1000;
}

function updateSummary() {
    const subtotal = cart.reduce((sum, product) => {
        const quantity = Math.max(1, Number(product.quantity) || 1);
        return sum + parsePrice(product.price) * quantity;
    }, 0);
    const shipping = cart.length > 0 ? getShippingFee() : 0;

    document.getElementById("subtotal").textContent = formatPrice(subtotal);
    document.getElementById("shipping").textContent = formatPrice(shipping);
    document.getElementById("total").textContent = formatPrice(subtotal + shipping);

    if (typeof updateCartCount === "function") {
        updateCartCount();
    }
}

function displayCheckoutProducts() {
    if (!checkoutProducts) return;

    checkoutProducts.innerHTML = "";
    if (cart.length === 0) {
        checkoutProducts.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
        updateSummary();
        return;
    }

    cart.forEach(product => {
        const quantity = Math.max(1, Number(product.quantity) || 1);
        const price = parsePrice(product.price);
        const imagePath = resolveImagePath(product.image);
        const item = document.createElement("div");

        item.className = "checkout-product";
        item.innerHTML = `
            <img src="${escapeHTML(imagePath)}" alt="${escapeHTML(product.name)}">
            <div class="product-details">
                <h3>${escapeHTML(product.name)}</h3>
                <p>${escapeHTML(product.description || "Quality product")}</p>
                <div class="product-bottom">
                    <strong class="product-price">${formatPrice(price * quantity)}</strong>
                    <span class="quantity">x${quantity}</span>
                </div>
            </div>
        `;
        checkoutProducts.appendChild(item);
    });

    updateSummary();
}

shippingInputs.forEach(input => {
    input.addEventListener("change", updateSummary);
});

const orderButton = document.querySelector(".order-btn");
const message = document.getElementById("message");
const paymentForm = document.getElementById("pay");

orderButton?.addEventListener("click", () => {
    const delivery = document.querySelector('input[name="delivery"]:checked');
    const payment = document.querySelector('input[name="payment"]:checked');

    if (cart.length === 0) {
        message.textContent = "Your cart is empty.";
        message.style.color = "#e05252";
        return;
    }
    if (shippingForm && !shippingForm.reportValidity()) {
        return;
    }
    if (!delivery) {
        message.textContent = "Please select a delivery method.";
        message.style.color = "#e05252";
        return;
    }
    if (!payment) {
        message.textContent = "Please select a payment method.";
        message.style.color = "#e05252";
        return;
    }
    
    message.textContent = "Processing your order...";
    message.style.color = "green";
    orderButton.disabled = true;

    setTimeout(() => {
        try {
            localStorage.setItem("cartItems", JSON.stringify([]));
        } catch (error) {
            console.error("Unable to clear the saved cart after placing the order.", error);
            message.textContent = "Your order was placed, but your cart could not be cleared.";
            message.style.color = "#e05252";
            orderButton.disabled = false;
            return;
        }

        cart = [];
        displayCheckoutProducts();
        shippingForm?.reset();
        paymentForm?.reset();
        message.textContent = "Your order has been placed.";
        message.style.color = "green";
        orderButton.disabled = false;
        // alert("Your order has been placed. Continue shopping!");
        // window.location.href = "explore.html";
    }, 5000);
});



displayCheckoutProducts();