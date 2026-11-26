document.querySelectorAll(".hamburger[aria-controls]").forEach(button => {
    const navigation = document.getElementById(button.getAttribute("aria-controls"));
    if (!navigation) return;

    function setMenuOpen(isOpen) {
        navigation.classList.toggle("open", isOpen);
        navigation.hidden = window.innerWidth <= 700 && !isOpen;
        button.classList.toggle("active", isOpen);
        button.setAttribute("aria-expanded", String(isOpen));
        button.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    }

    setMenuOpen(false);

    button.addEventListener("click", () => {
        setMenuOpen(button.getAttribute("aria-expanded") !== "true");
    });

    navigation.querySelectorAll("a, button").forEach(item => {
        item.addEventListener("click", () => setMenuOpen(false));
    });

    document.addEventListener("click", event => {
        if (!navigation.contains(event.target) && !button.contains(event.target)) {
            setMenuOpen(false);
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
            setMenuOpen(false);
            button.focus();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 700) {
            setMenuOpen(false);
        }
    });
});

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

    const totalQuantity = cart.reduce(
        (sum, product) => sum + (Number(product.quantity) || 0),
        0
    );

    document.querySelectorAll(".cart-count").forEach(count => {
        count.textContent = totalQuantity;
    });
}

updateCartCount();

