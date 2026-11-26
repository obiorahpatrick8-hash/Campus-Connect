const categoryFilters = document.querySelectorAll(".category-filter");
const priceFilters = document.querySelectorAll('input[name="price"]');
const products = document.querySelectorAll(".product-card");
const clear = document.getElementById("clear-btn");
const sort = document.getElementById("sorts");

function applyFilters() {
    const selectedCategories = Array.from(categoryFilters)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    const selectedPrice = document.querySelector('input[name="price"]:checked')?.value;

    products.forEach(product => {
        const productCategory = product.dataset.categoryId;
        const price = Number(product.querySelector(".add-to-cart").dataset.price.replace(/,/g, ""));
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(productCategory);
        const matchesPrice = !selectedPrice || selectedPrice === "1" ||
            (selectedPrice === "2" && price <= 50000) ||
            (selectedPrice === "3" && price > 50000 && price <= 100000) ||
            (selectedPrice === "4" && price > 100000 && price <= 200000) ||
            (selectedPrice === "5" && price > 200000);

        product.hidden = !matchesCategory || !matchesPrice;
    });
}

categoryFilters.forEach(filter => {
    filter.addEventListener("change", applyFilters);
});

priceFilters.forEach(filter => {
    filter.addEventListener("change", applyFilters);
});

const requestedCategory = new URLSearchParams(window.location.search).get("category");
const matchingFilter = Array.from(categoryFilters).find(filter => filter.value === requestedCategory);
if (matchingFilter) {
    matchingFilter.checked = true;
    applyFilters();
}

if (clear && sort) {
    clear.addEventListener("click", () => {
        categoryFilters.forEach(filter => {
            filter.checked = false;
        });
        priceFilters.forEach(filter => {
            filter.checked = false;
        });

        applyFilters();
        sort.value = "";
    });
}

document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", function () {
        let cart = JSON.parse(localStorage.getItem("cartItems")) || [];
        const product = {
            id: this.dataset.id,
            name: this.dataset.name,
            price: Number(this.dataset.price.replace(/,/g, "")),
            image: this.dataset.image,
            description: "Quality product",
            quantity: 1
        };

        const existing = cart.find(item => item.id === product.id);
        if(existing) {
            existing.quantity++;
        }else {
            cart.push(product);
        }
        localStorage.setItem("cartItems", JSON.stringify(cart));
        if(typeof updateCartCount === "function") {
            updateCartCount();
        }
    });
});
