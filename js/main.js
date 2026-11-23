

// =====================================
// MODA FIT - CATÁLOGO Y CARRITO
// =====================================

// PRODUCTOS DE DEMOSTRACIÓN

const products = [
    {
        id: 1,
        name: "Conjunto deportivo",
        category: "Mujer",
        price: 32000,
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600",
        description: "Estilo y comodidad para entrenar."
    },
    {
        id: 2,
        name: "Remera masculina",
        category: "Hombre",
        price: 18000,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
        description: "Un básico para todos los días."
    },
    {
        id: 3,
        name: "Zapatillas deportivas",
        category: "Calzado",
        price: 55000,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
        description: "Comodidad para cada paso."
    },
    {
        id: 4,
        name: "Cartera urbana",
        category: "Accesorios",
        price: 28000,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600",
        description: "Un complemento para tu estilo."
    },
    {
        id: 5,
        name: "Proteína deportiva",
        category: "Nutrición",
        price: 48000,
        image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600",
        description: "Producto de nutrición deportiva."
    },
    {
        id: 6,
        name: "Calza deportiva",
        category: "Mujer",
        price: 25000,
        image: "https://images.unsplash.com/photo-1506629905607-d9d6d9e2b7a8?w=600",
        description: "Prenda deportiva de uso diario."
    }
];


// RECUPERAR CARRITO GUARDADO
function loadCart() {
    try {
        const savedCart = localStorage.getItem("modaFitCart");

        if (!savedCart) return [];

        const parsedCart = JSON.parse(savedCart);

        if (!Array.isArray(parsedCart)) return [];

        return parsedCart.filter(item =>
            item &&
            Number.isFinite(item.id) &&
            Number.isFinite(item.price) &&
            Number.isFinite(item.quantity) &&
            item.quantity > 0
        );

    } catch (error) {
        console.warn("Error al recuperar el carrito:", error);
        return [];
    }
}

let cart = loadCart();
let selectedCategory = "Todos";

// ELEMENTOS HTML

const productsContainer = document.getElementById("products-container");
const searchInput = document.getElementById("product-search");
const filterButtons = document.querySelectorAll(".filter-btn");

const cartOverlay = document.getElementById("cart-overlay");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

// FORMATO DE PRECIOS

function formatPrice(price) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    }).format(price);
}

// NORMALIZAR TEXTO PARA BÚSQUEDAS

function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// MOSTRAR PRODUCTOS

function renderProducts() {

    const search = normalizeText(searchInput.value.trim());

    const filteredProducts = products.filter(product => {

        const matchesCategory =
            selectedCategory === "Todos" ||
            product.category === selectedCategory;

        const searchableText = normalizeText(
            `${product.name} ${product.category} ${product.description}`
        );

        const matchesSearch = searchableText.includes(search);

        return matchesCategory && matchesSearch;
    });

    productsContainer.innerHTML = "";

    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = `
            <div class="empty-products">
                <h3>No encontramos productos</h3>
                <p>Probá con otra búsqueda o categoría.</p>
            </div>
        `;
        return;
    }

    filteredProducts.forEach(product => {

        const card = document.createElement("article");
        card.className = "product-card";

        card.innerHTML = `
            <img
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
            >

            <div class="product-info">
                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <div class="product-bottom">
                    <strong>${formatPrice(product.price)}</strong>

                    <button
                        class="add-cart-btn"
                        data-id="${product.id}"
                        type="button"
                    >
                        <i class="fas fa-cart-plus"></i>
                        Agregar
                    </button>
                </div>
            </div>
        `;

        const image = card.querySelector("img");

        image.addEventListener("error", () => {
            image.alt = "Imagen no disponible";
            image.classList.add("image-error");
        });

        productsContainer.appendChild(card);
    });
}

// AGREGAR PRODUCTOS AL CARRITO

function addToCart(id) {

    const product = products.find(item => item.id === id);

    if (!product) return;

    const existingProduct = cart.find(item => item.id === id);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    renderCart();
}



// =====================================
// MOSTRAR CARRITO Y GUARDAR
// =====================================

function renderCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="cart-empty">Tu carrito está vacío.</p>
        `;
    }

    cart.forEach(item => {

        const row = document.createElement("div");
        row.className = "cart-item";

        row.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>${formatPrice(item.price)} x ${item.quantity}</p>
            </div>

            <div class="cart-actions">
                <button data-action="decrease" data-id="${item.id}" type="button">−</button>
                <span>${item.quantity}</span>
                <button data-action="increase" data-id="${item.id}" type="button">+</button>
                <button data-action="remove" data-id="${item.id}" aria-label="Eliminar" type="button">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        cartItems.appendChild(row);
    });

    // BOTÓN PARA VACIAR TODO EL CARRITO
    if (cart.length > 0) {
        const clearButton = document.createElement("button");
        clearButton.className = "clear-cart-btn";
        clearButton.dataset.action = "clear";
        clearButton.type = "button";
        clearButton.textContent = "Vaciar carrito";

        cartItems.appendChild(clearButton);
    }

    const totalQuantity = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = formatPrice(totalPrice);

    try {
        localStorage.setItem("modaFitCart", JSON.stringify(cart));
    } catch (error) {
        console.warn("No se pudo guardar el carrito.");
    }
}

// =====================================
// MODIFICAR CANTIDADES Y ELIMINAR
// =====================================

function changeQuantity(id, action) {

    if (action === "clear") {
        if (confirm("¿Querés eliminar todos los productos del carrito?")) {
            cart = [];
        }
        renderCart();
        return;
    }

    const item = cart.find(product => product.id === id);

    if (!item) return;

    if (action === "increase") {
        item.quantity++;
    }

    if (action === "decrease") {
        item.quantity--;

        if (item.quantity <= 0) {
            cart = cart.filter(product => product.id !== id);
        }
    }

    if (action === "remove") {
        cart = cart.filter(product => product.id !== id);
    }

    renderCart();
}


// EVENTOS DEL CATÁLOGO

productsContainer.addEventListener("click", event => {

    const button = event.target.closest(".add-cart-btn");

    if (button) {
        addToCart(Number(button.dataset.id));
    }
});

// EVENTOS DE FILTROS

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        selectedCategory = button.dataset.category;

        renderProducts();
    });
});

// BUSCADOR

searchInput.addEventListener("input", renderProducts);

// ABRIR Y CERRAR CARRITO

document.getElementById("cart-toggle").addEventListener("click", () => {
    cartOverlay.classList.add("active");
});

document.getElementById("close-cart").addEventListener("click", () => {
    cartOverlay.classList.remove("active");
});

cartOverlay.addEventListener("click", event => {
    if (event.target === cartOverlay) {
        cartOverlay.classList.remove("active");
    }
});

// EVENTOS DE CANTIDADES DEL CARRITO

cartItems.addEventListener("click", event => {

    const button = event.target.closest("button[data-action]");

    if (!button) return;

    changeQuantity(
        Number(button.dataset.id),
        button.dataset.action
    );
});


// =====================================
// FINALIZAR PEDIDO POR WHATSAPP
// =====================================

document.getElementById("checkout-btn").addEventListener("click", () => {

    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const orderDetails = cart.map(item => {
        return `• ${item.name}
  Cantidad: ${item.quantity}
  Precio: ${formatPrice(item.price * item.quantity)}`;
    }).join("\n\n");

    const message = `¡Hola, Moda Fit! Quiero realizar el siguiente pedido:

${orderDetails}

TOTAL: ${formatPrice(totalPrice)}

Quedo a la espera de la confirmación. ¡Gracias!`;

    const phone = "5493863691296";

    const whatsappURL =
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank", "noopener,noreferrer");

});


// INICIALIZAR TIENDA

renderProducts();
renderCart();


