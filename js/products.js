
async function loadCategories() {
    const container = document.getElementById("category-list");
    if (!container) return;

    const { data, error } = await supabaseClient
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("name");

    if (error) {
        console.error("Categories error:", error.message);
        container.innerHTML = "<p>Unable to load categories.</p>";
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = "<p>Categories coming soon.</p>";
        return;
    }

    container.innerHTML = data.map(category => `
        <a href="products.html?category=${encodeURIComponent(category.slug)}"
           class="category-card">
            ${category.image_url
                ? `<img src="${escapeHTML(category.image_url)}" alt="${escapeHTML(category.name)}" style="width:65px;height:65px;object-fit:contain;">`
                : `<div style="font-size:35px;">💻</div>`}
            <h3>${escapeHTML(category.name)}</h3>
        </a>
    `).join("");
}

async function loadFeaturedProducts() {
    const container = document.getElementById("featured-products");
    if (!container) return;

    const { data, error } = await supabaseClient
        .from("products")
        .select("*")
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Products error:", error.message);
        container.innerHTML = "<p>Unable to load products.</p>";
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = "<p>Featured products coming soon.</p>";
        return;
    }

    container.innerHTML = data.map(product => {
        const price = Number(product.discount_price ?? product.price);
        const image = product.images?.[0];

        return `
            <div class="product-card">
                ${image
                    ? `<img src="${escapeHTML(image)}" alt="${escapeHTML(product.name)}">`
                    : `<div style="height:190px;display:grid;place-items:center;font-size:55px;">🖥️</div>`}
                <div class="product-info">
                    <h3>${escapeHTML(product.name)}</h3>
                    <p>${escapeHTML(product.brand || "Computer Hardware")}</p>
                    <div class="product-price">
                        Rs. ${price.toLocaleString("en-LK", {
                            minimumFractionDigits: 2
                        })}
                    </div>
                    <p>${Number(product.stock_quantity) > 0
                        ? "In Stock"
                        : "Out of Stock"}</p>
                </div>
            </div>
        `;
    }).join("");
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
    loadFeaturedProducts();
});
