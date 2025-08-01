
let desserts = [];// Arreglo para almacenar los postres cargados desde el servidor

// Función para cargar los postres desde el servidor
async function fetchDesserts() {
    try {
        const response = await fetch('http://localhost:5000/api/desserts', {
            headers: { 'auth-token': localStorage.getItem('token') }
        });
        if (!response.ok) throw new Error('Error fetching desserts');
        desserts = await response.json();
        filteredDesserts = [...desserts];
        filterDesserts();
    } catch (error) {
        console.error(error);
        dessertsGrid.innerHTML = '<p>Error al cargar los postres desde el servidor.</p>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    fetchDesserts();
    updateCartUI();
});

// Variables globales
let cart = [];
let filteredDesserts = [...desserts];
let currentCategory = 'todos';
let searchTerm = '';

// Elementos del DOM
const searchInput = document.getElementById('searchInput');
const categoryFilters = document.getElementById('categoryFilters');
const dessertsGrid = document.getElementById('dessertsGrid');
const resultsText = document.getElementById('resultsText');
const noResults = document.getElementById('noResults');
const cartBtn = document.getElementById('cartBtn');
const cartBadge = document.getElementById('cartBadge');
const cartSidebar = document.getElementById('cartSidebar');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const totalPrice = document.getElementById('totalPrice');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    renderDesserts();
    updateResultsCount();
    updateCartUI();
});

searchInput.addEventListener('input', function(e) {
    searchTerm = e.target.value.toLowerCase();
    filterDesserts();
});

categoryFilters.addEventListener('click', function(e) {
    if (e.target.classList.contains('filter-btn')) {
        // Remover clase active de todos los botones
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Agregar clase active al botón clickeado
        e.target.classList.add('active');
        
        currentCategory = e.target.dataset.category;
        filterDesserts();
    }
});

cartBtn.addEventListener('click', function() {
    cartSidebar.classList.toggle('open');
});

// Funciones principales
function filterDesserts() {
    filteredDesserts = desserts.filter(dessert => {
        const matchesSearch = dessert.name.toLowerCase().includes(searchTerm) ||
                            dessert.description.toLowerCase().includes(searchTerm);
        const matchesCategory = currentCategory === 'todos' || dessert.category === currentCategory;
        
        return matchesSearch && matchesCategory;
    });
    
    renderDesserts();
    updateResultsCount();
}

function renderDesserts() {
    if (filteredDesserts.length === 0) {
        dessertsGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    dessertsGrid.style.display = 'grid';
    noResults.style.display = 'none';
    
    dessertsGrid.innerHTML = filteredDesserts.map(dessert => `
        <div class="dessert-card">
            <img src="${dessert.image}" alt="${dessert.name}" class="dessert-image" 
                 onerror="this.src='https://via.placeholder.com/300x200/f3f4f6/9ca3af?text=Imagen+no+disponible'">
            <div class="dessert-content">
                <div class="dessert-header">
                    <h3 class="dessert-title">${dessert.name}</h3>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <span>${dessert.rating}</span>
                    </div>
                </div>
                <div class="category-badge">${dessert.category}</div>
                <p class="dessert-description">${dessert.description}</p>
                <div class="ingredients">
                    <p class="ingredients-label">Ingredientes:</p>
                    <div class="ingredients-list">
                        ${dessert.ingredients.slice(0, 3).map(ingredient => 
                            `<span class="ingredient-tag">${ingredient}</span>`
                        ).join('')}
                        ${dessert.ingredients.length > 3 ? 
                            `<span class="ingredient-tag">+${dessert.ingredients.length - 3} más</span>` : ''
                        }
                    </div>
                </div>
                <div class="dessert-price">$${dessert.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${dessert.id})">
                    Agregar al Carrito
                </button>
            </div>
        </div>
    `).join('');
}

function updateResultsCount() {
    resultsText.textContent = `Mostrando ${filteredDesserts.length} de ${desserts.length} postres`;
}

function addToCart(dessertId) {
    const dessert = desserts.find(d => d.id === dessertId);
    const existingItem = cart.find(item => item.id === dessertId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...dessert, quantity: 1 });
    }
    
    updateCartUI();
    
    // Mostrar el carrito automáticamente cuando se agrega un item
    if (!cartSidebar.classList.contains('open')) {
        cartSidebar.classList.add('open');
    }
}

function removeFromCart(dessertId) {
    const existingItem = cart.find(item => item.id === dessertId);
    
    if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== dessertId);
    }
    
    updateCartUI();
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Actualizar badge del carrito
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    
    // Actualizar contenido del carrito
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        cartTotal.style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p class="cart-item-price">$${item.price.toFixed(2)} c/u</p>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="addToCart(${item.id})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        totalPrice.textContent = `$${total.toFixed(2)}`;
        cartTotal.style.display = 'block';
    }
}

// Cerrar carrito al hacer click fuera de él
document.addEventListener('click', function(e) {
    if (!cartSidebar.contains(e.target) && !cartBtn.contains(e.target)) {
        cartSidebar.classList.remove('open');
    }
});