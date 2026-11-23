
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
});

function getCart() {
    try {
        return JSON.parse(localStorage.getItem("cz_cart")) || [];
    } catch {
        return [];
    }
}

function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    if (!cartCount) return;

    const totalItems = getCart().reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );

    cartCount.textContent = totalItems;
}
