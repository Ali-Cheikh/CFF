// DOM Elements
const productList = document.getElementById('product-list');
const searchInput = document.getElementById('search-input');
const noResults = document.getElementById('no-results');
const cartButton = document.getElementById('cart-button');
const cartCount = document.getElementById('cart-count');
const loadingScreen = document.getElementById('loading-screen');

// Shopping Cart
let shoppingCart = JSON.parse(localStorage.getItem('cart')) || [];

// Remove the hardcoded products array and replace with:

let products = []; // We'll load products from JSON

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen after 1.5s
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }, 1500);
    
    // Load products first
    loadProducts().then(() => {
        displayProducts();
        updateCartCount();
    });
});

// Function to load products from JSON
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        products = await response.json();
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to empty array or handle error appropriately
        products = [];
        
        // Show error message to user
        Swal.fire({
            title: 'Error Loading Products',
            text: 'Could not load product information. Please try again later.',
            icon: 'error'
        });
    }
}
// Display products
function displayProducts(filter = '') {
    productList.innerHTML = '';
    
    const filteredProducts = products.filter(product => {
        const searchTerm = filter.toLowerCase();
        return (
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.some(cat => cat.toLowerCase().includes(searchTerm))
        );
    });
    
    if (filteredProducts.length === 0) {
        noResults.classList.remove('hidden');
        return;
    }
    
    noResults.classList.add('hidden');
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = `product-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${product.featured ? 'featured border-2 border-amber-400' : ''}`;
        productCard.innerHTML = `
            <div class="relative">
                <img src="${product.image}" alt="${product.name}" 
                     class="w-full h-48 object-cover cursor-pointer" 
                     onclick="showProductDetails(${product.id})">
                ${product.featured ? 
                    '<span class="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">FEATURED</span>' : ''}
                <span class="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    ${product.category[0].toUpperCase()}
                </span>
            </div>
            <div class="p-4">
                <h3 class="font-bold text-lg text-gray-800 mb-1">${product.name}</h3>
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">${product.description}</p>
                <div class="flex justify-between items-center">
                    <span class="font-bold text-green-700">${product.price} د.ت</span>
                    <button onclick="addToCartPrompt(${product.id})" 
                            class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-sm transition-colors">
                        <i class="fas fa-cart-plus mr-1"></i> Add
                    </button>
                </div>
            </div>
        `;
        productList.appendChild(productCard);
    });
}

// Search functionality
searchInput.addEventListener('input', (e) => {
    displayProducts(e.target.value);
});

// Show product details
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    Swal.fire({
        title: `<h2 class="text-2xl font-bold text-green-800">${product.name}</h2>`,
        html: `
            <div class="flex flex-col md:flex-row gap-6">
                <div class="md:w-1/2">
                    <img src="${product.image}" alt="${product.name}" class="w-full rounded-lg shadow-md">
                </div>
                <div class="md:w-1/2">
                    <p class="text-gray-700 mb-4">${product.description}</p>
                    <div class="bg-green-50 p-4 rounded-lg mb-4">
                        <div class="flex justify-between items-center mb-2">
                            <span class="font-semibold">Price:</span>
                            <span class="text-green-700 font-bold">${product.price} د.ت</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="font-semibold">Category:</span>
                            <span class="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">${product.category[0].toUpperCase()}</span>
                        </div>
                    </div>
                    <button onclick="addToCartPrompt(${product.id}, Swal.close)" 
                            class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors">
                        <i class="fas fa-cart-plus mr-2"></i> Add to Cart
                    </button>
                </div>
            </div>
        `,
        showConfirmButton: false,
        background: '#f8fafc',
        width: '800px'
    });
}

// Add to cart prompt
function addToCartPrompt(productId, callback) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    Swal.fire({
        title: `<h3 class="text-xl font-bold text-green-800">Add ${product.name} to Cart</h3>`,
        html: `
            <div class="flex flex-col md:flex-row gap-6 items-center">
                <div class="md:w-1/3">
                    <img src="${product.image}" alt="${product.name}" class="w-full rounded-lg shadow-md">
                </div>
                <div class="md:w-2/3">
                    <div class="mb-4">
                        <label for="quantity" class="block text-gray-700 mb-2">Quantity:</label>
                        <input type="number" id="quantity" min="1" value="1" 
                               class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    </div>
                    <div class="bg-green-50 p-3 rounded-lg mb-4">
                        <div class="flex justify-between">
                            <span class="font-semibold">Total:</span>
                            <span class="text-green-700 font-bold" id="total-price">${product.price} د.ت</span>
                        </div>
                    </div>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Add to Cart',
        cancelButtonText: 'Cancel',
        background: '#f8fafc',
        didOpen: () => {
            const quantityInput = document.getElementById('quantity');
            const totalPrice = document.getElementById('total-price');
            
            quantityInput.addEventListener('input', () => {
                const quantity = parseInt(quantityInput.value) || 1;
                totalPrice.textContent = `${(product.price * quantity).toFixed(2)} د.ت`;
            });
        },
        preConfirm: () => {
            const quantity = parseInt(document.getElementById('quantity').value) || 1;
            addToCart(product, quantity);
            if (callback) callback();
        }
    });
}

// Add to cart
function addToCart(product, quantity = 1) {
    const existingItem = shoppingCart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        shoppingCart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    updateCartCount();
    saveCartToLocalStorage();
    
    // Show success notification
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });
    
    Toast.fire({
        icon: 'success',
        title: `${quantity} ${product.name} added to cart`
    });
}

// Update cart count
function updateCartCount() {
    const count = shoppingCart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
    count > 0 ? cartCount.classList.remove('hidden') : cartCount.classList.add('hidden');
}

// Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(shoppingCart));
}

// Open cart
function openCart() {
    if (shoppingCart.length === 0) {
        Swal.fire({
            title: 'Your Cart is Empty',
            html: '<p class="text-gray-600">Looks like you haven\'t added anything to your cart yet.</p>',
            icon: 'info',
            confirmButtonText: 'Browse Products',
            background: '#f8fafc'
        });
        return;
    }
    
    let cartContent = `
        <div class="max-h-96 overflow-y-auto pr-2">
            <div class="divide-y divide-gray-200">
                ${shoppingCart.map(item => `
                    <div class="py-4 flex items-start">
                        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg mr-4">
                        <div class="flex-1">
                            <h4 class="font-bold text-gray-800">${item.name}</h4>
                            <div class="flex justify-between items-center mt-2">
                                <span class="text-green-700 font-bold">${item.price} د.ت × ${item.quantity}</span>
                                <span class="font-bold">${(item.price * item.quantity).toFixed(2)} د.ت</span>
                            </div>
                            <div class="flex items-center mt-2">
                                <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" 
                                        class="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300">
                                    <i class="fas fa-minus text-xs"></i>
                                </button>
                                <span class="mx-2 w-8 text-center">${item.quantity}</span>
                                <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" 
                                        class="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300">
                                    <i class="fas fa-plus text-xs"></i>
                                </button>
                                <button onclick="removeFromCart(${item.id})" 
                                        class="ml-auto text-red-500 hover:text-red-700">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="border-t border-gray-200 pt-4 mt-4">
            <div class="flex justify-between items-center mb-4">
                <span class="font-bold text-lg">Total:</span>
                <span class="text-green-700 font-bold text-xl">
                    ${shoppingCart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)} د.ت
                </span>
            </div>
            <button onclick="checkout()" 
                    class="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition-colors">
                Proceed to Checkout
            </button>
        </div>
    `;
    
    Swal.fire({
        title: '<h2 class="text-2xl font-bold text-gray-800">Your Shopping Cart</h2>',
        html: cartContent,
        showConfirmButton: false,
        background: '#f8fafc',
        width: '600px'
    });
}

// Update item quantity
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = shoppingCart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCartToLocalStorage();
        updateCartCount();
        openCart(); // Refresh cart view
    }
}

// Remove from cart
function removeFromCart(productId) {
    shoppingCart = shoppingCart.filter(item => item.id !== productId);
    saveCartToLocalStorage();
    updateCartCount();
    
    if (shoppingCart.length === 0) {
        Swal.close();
    } else {
        openCart(); // Refresh cart view
    }
}

// Checkout process
function checkout() {
    Swal.fire({
        title: '<h2 class="text-2xl font-bold text-gray-800">Checkout</h2>',
        html: `
            <div class="text-left">
                <div class="mb-6">
                    <h3 class="font-bold text-lg mb-2">Order Summary</h3>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        ${shoppingCart.map(item => `
                            <div class="flex justify-between py-2 border-b border-gray-200">
                                <span>${item.name} × ${item.quantity}</span>
                                <span class="font-semibold">${(item.price * item.quantity).toFixed(2)} د.ت</span>
                            </div>
                        `).join('')}
                        <div class="flex justify-between pt-2 font-bold">
                            <span>Total</span>
                            <span class="text-green-700">
                                ${shoppingCart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)} د.ت
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="mb-4">
                    <h3 class="font-bold text-lg mb-2">Contact Information</h3>
                    <div class="space-y-3">
                        <div>
                            <label for="name" class="block text-gray-700 mb-1">Full Name</label>
                            <input type="text" id="name" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required>
                        </div>
                        <div>
                            <label for="phone" class="block text-gray-700 mb-1">Phone Number</label>
                            <input type="tel" id="phone" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required>
                        </div>
                        <div>
                            <label for="city" class="block text-gray-700 mb-1">City</label>
                            <select id="city" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                <option value="Tunis">Tunis</option>
                                <option value="Sfax">Sfax</option>
                                <option value="Sousse">Sousse</option>
                                <option value="Kairouan">Kairouan</option>
                                <option value="Bizerte">Bizerte</option>
                                <option value="Gabes">Gabes</option>
                                <option value="Ariana">Ariana</option>
                                <option value="Gafsa">Gafsa</option>
                                <option value="Monastir">Monastir</option>
                                <option value="Manouba">Manouba</option>
                                <option value="Ben Arous">Ben Arous</option>
                                <option value="Kasserine">Kasserine</option>
                                <option value="Medenine">Medenine</option>
                                <option value="Mahdia">Mahdia</option>
                                <option value="Zaghouan">Zaghouan</option>
                                <option value="Beja">Beja</option>
                                <option value="Jendouba">Jendouba</option>
                                <option value="Nabeul">Nabeul</option>
                                <option value="Kebili">Kebili</option>
                                <option value="Siliana">Siliana</option>
                                <option value="Tataouine">Tataouine</option>
                                <option value="Tozeur">Tozeur</option>
                                <option value="Kef">Kef</option>
                            </select>
                        </div>
                        <div>
                            <label for="address" class="block text-gray-700 mb-1">Delivery Address</label>
                            <textarea id="address" rows="2" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required></textarea>
                        </div>
                    </div>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Place Order',
        cancelButtonText: 'Continue Shopping',
        background: '#f8fafc',
        preConfirm: () => {
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const city = document.getElementById('city').value;
            const address = document.getElementById('address').value.trim();
            
            if (!name || !phone || !address) {
                Swal.showValidationMessage('Please fill in all required fields');
                return false;
            }
            
            if (!/^[0-9]{8,15}$/.test(phone)) {
                Swal.showValidationMessage('Please enter a valid phone number');
                return false;
            }
            
            return { name, phone, city, address };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            processOrder(result.value);
        }
    });
}

// Process order
function processOrder(customerInfo) {
    Swal.fire({
        title: 'Processing Your Order...',
        html: '<div class="loading-spinner mx-auto my-4"></div><p class="text-gray-600">Please wait while we process your order</p>',
        showConfirmButton: false,
        allowOutsideClick: false,
        background: '#f8fafc'
    });
    
    // Prepare order data
    const order = {
        customer: customerInfo,
        items: shoppingCart,
        total: shoppingCart.reduce((total, item) => total + (item.price * item.quantity), 0),
        date: new Date().toISOString()
    };
    
    // In a real app, you would send this to your backend
    setTimeout(() => {
        Swal.fire({
            title: 'Order Placed Successfully!',
            html: `
                <div class="text-center">
                    <i class="fas fa-check-circle text-5xl text-green-500 mb-4"></i>
                    <p class="text-gray-700 mb-4">Thank you for your order, ${customerInfo.name}!</p>
                    <p class="text-gray-600">We'll contact you shortly at ${customerInfo.phone} to confirm delivery details.</p>
                </div>
            `,
            confirmButtonText: 'Continue Shopping',
            background: '#f8fafc'
        }).then(() => {
            // Clear cart
            shoppingCart = [];
            saveCartToLocalStorage();
            updateCartCount();
        });
        
        // Here you would typically send the order to your backend
        sendOrderToServer(order);
    }, 2000);
}

// Original backend communication function - unchanged
function sendOrderToServer(order) {
    Swal.fire({
        title: "Sending...",
        titleColor: "#fc1111",
        text: "Please wait while your purchase is being processed.",
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading();
        },
    });

    const scriptUrl =
        "https://script.google.com/macros/s/AKfycbymGGA8tEmahFqSJ-kGmSFFWZB2xK5S381XwBGpSRqF0GooUPNZ0bByP3b1X1QjoaXa/exec";

    const formData = new FormData();
    formData.append("productName", order.items.map(item => `${item.name} (${item.quantity})`).join(", "));
    formData.append("price", order.total);
    formData.append("count", order.items.reduce((total, item) => total + item.quantity, 0));
    formData.append("phone", order.customer.phone);
    formData.append("name", order.customer.name);
    formData.append("location", `${order.customer.city} - ${order.customer.address}`);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", scriptUrl);
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log("Order sent successfully");
            Swal.fire({
                title: "Demand Reached",
                text: "Your purchase was successful. We'll contact you soon.",
                imageUrl: "https://cffstore.vercel.app/img/logo-remove.png",
                imageAlt: "Custom Success Icon",
                showConfirmButton: false,
                timer: 2500,
                icon: null,
                background: "#ffff33db",
            });
        } else {
            console.error("Error sending order");
            Swal.fire({
                title: "Error",
                text: "There was an issue processing your order. Please try again.",
                icon: "error"
            });
        }
    };
    xhr.onerror = function () {
        console.error("Error sending order");
        Swal.fire({
            title: "Connection Error",
            text: "There was a problem connecting to our servers. Please check your connection and try again.",
            icon: "error"
        });
    };
    xhr.send(formData);
}