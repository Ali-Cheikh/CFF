Swal.fire({
  html: `<div class="welcome"><div style="font-family:cursive">Welcome To<br>Cheikh Family Farm</div><h2 style="color:green;font-size:100%">STORE</h2></div>`,
  allowOutsideClick: false,
  showConfirmButton: false,
  timer: 100,
  backdrop: "white",
  width: "100%",
  willOpen: () => {
    Swal.showLoading();
  },
});

const products = [
  {
    name: "0.25 ltr Bottle",
    price: 4.5,
    image: "/product/25.png",
    intro: "Extra Virgin Olive Oil 0.25ltr Bottle 0.3 Acidity",
    category: "olive , zit , zaytoun",
  },
  {
    name: "0.5 ltr Bottle",
    price: 7.5,
    image: "/product/5.png",
    intro: "Extra Virgin Olive Oil 0.5ltr Bottle 0.3 Acidity",
    category: "olive , zit , zaytoun",
  },
  {
    name: "1 ltr Bottle",
    price: 16,
    image: "/product/1.avif",
    intro: "Extra Virgin Olive Oil 1ltr Bottle 0.3 Acidity",
    category: "olive , zit , zaytoun",
  },
  {
    name: "2 ltr Bottle",
    price: 30,
    image: "/product/2.avif",
    intro: "Extra Virgin Olive Oil 2ltr Bottle 0.3 Acidity",
    category: "olive , zit , zaytoun",
  },
  {
    name: "5 ltr Bottle",
    price: 80,
    image: "/product/5.avif",
    intro: "Extra Virgin Olive Oil 5ltr Bottle 0.3 Acidity",
    category: "olive , zit , zaytoun",
  },
  {
    name: "عسل جبلي / سدر / كلتوس / خروب",
    price: 30,
    image: "/product/3sal.jpg",
    intro: "عسل جبلي / سدر / كلتوس / خروب",
    category: "3asal",
  },
];

const shoppingCart = [];
let cartButton = document.querySelector(".navbar-text.btn.btn-warning i");

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 350 ||
    document.documentElement.scrollTop > 400
  ) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function SearchFunction() {
  const input = document.getElementById("myInput");
  const filter = input.value.toLowerCase();
  const productList = document.getElementById("product-list");
  const products = productList.getElementsByClassName("product");
  let noResults = true;

  // Clear previous no results message
  const existingMessage = document.getElementById("no-results-message");
  if (existingMessage) existingMessage.remove();

  Array.from(products).forEach((product) => {
    const title = product.querySelector("h5").textContent.toLowerCase();
    const category = product.querySelector("h6").textContent.toLowerCase();

    if (title.includes(filter) || category.includes(filter)) {
      product.style.display = "";
      noResults = false;
    } else {
      product.style.display = "none";
    }
  });

  if (noResults && filter) {
    const noResultsMessage = document.createElement("h3");
    noResultsMessage.id = "no-results-message";
    noResultsMessage.innerHTML = `
          <div class="container mt-5">
              <center>No products found matching "${input.value}"</center>
          </div>`;
    noResultsMessage.style.color = "red";
    productList.appendChild(noResultsMessage);
  }
}

function filterByCategory() {
  const selectedCategories = Array.from(
    document.querySelectorAll('#category-filter input[type="checkbox"]:checked')
  ).map((cb) => cb.value.toUpperCase());
  const products = document.querySelectorAll("#product-list .product");
  products.forEach((product) => {
    const category = product.querySelector("h6").innerText.toUpperCase();
    if (
      selectedCategories.length === 0 ||
      selectedCategories.includes(category)
    ) {
      product.style.display = "";
    } else {
      product.style.display = "none";
    }
  });
}

displayProducts();
function displayProducts() {
  const productListDiv = document.getElementById("product-list");
  productListDiv.innerHTML = "";

  products.forEach((product) => {
    const productCard = `
          <div class="col-lg-4 col-md-6 col-sm-6 mb-4 product fade-in" data-category="${product.category}">
              <div class="card bg-dark text-white product-card">
                  <div class="image-container">
                      <img src="${product.image}" class="card-img-top lazy-load" alt="${product.name}" loading="lazy" onclick="description('${product.intro}', '${product.image}', '${product.name}', '${product.price}')">
                  </div>
                  <div class="card-body">
                      <h6 class="category-tag">${product.category}</h6>
                      <h5 class="card-title">${product.name}</h5>
                      <hr class="divider">
                      <div class="price-section">
                          <p class="card-text">Price: ${product.price} <small><b>دت</b></small></p>
                          <button class="btn btn-primary add-to-cart-btn" onclick="confirmAddToCart('${product.name}', ${product.price}, '${product.intro}', '${product.image}')">
                              <i class="fas fa-cart-plus"></i> Add to Cart
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      `;
    productListDiv.insertAdjacentHTML("beforeend", productCard);
  });

  // Initialize lazy loading
  initializeLazyLoading();
}

// Add this new function for lazy loading
function initializeLazyLoading() {
  const lazyImages = document.querySelectorAll(".lazy-load");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.classList.add("loaded");
        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach((img) => imageObserver.observe(img));
}

document.head.appendChild(style);

function description(intro, image, productName, price) {
  Swal.fire({
    title: `<h2> ${productName}</h2>`,
    html: `
        <div style="display: flex; align-items: center;">
            <div style="flex: 1; padding-right: 20px;">
                <img src="${image}" style="width: 100%; height: 100%; object">
            </div>
            <div style="flex: 1; border-left:dashed">
                <p>${intro}</p> <br> <span style='border: solid 0.5px blue;border-radius:25%;padding:2px;color:blue;background-color:cyan'><small><b>دت</b></small>${price}</span>
            </div>
        </div>
            `,
    backdrop: "#f333333",
    showConfirmButton: false,
    background: "#f4f4f4",
  });
}

function confirmAddToCart(productName, price, intro, image) {
  Swal.fire({
    title: "Add to Cart",
    html: `
            <div style="display: flex; align-items: center;">
                <div style="flex: 1; padding-right: 20px;">
                    <img src="${image}" alt="${productName}" style="width: 100%;">
                    <h5>${productName}</h5>
                </div>
                <div style="flex: 1;">
                    <p>${intro}</p>
                    <input type="number" id="quantity" class="swal2-input" placeholder="Quantity" min="1" max="10" value="1" style="width: 100%;">
                    <button class="swal2-confirm swal2-styled" onclick="addToCart('${productName}', ${price}, document.getElementById('quantity').value)">Add to Cart</button>
                </div>
            </div>
        `,
    showConfirmButton: false,
    background: "#f4f4f4",
  });
}

function addToCart(productName, price, quantity) {
  const existingProductIndex = shoppingCart.findIndex(
    (item) => item.productName === productName
  );
  if (existingProductIndex !== -1) {
    shoppingCart[existingProductIndex].count += parseInt(quantity);
  } else {
    shoppingCart.push({ productName, price, count: parseInt(quantity) });
  }
  console.log("Shopping Cart:", shoppingCart);

  // Change the cart button icon
  cartButton.classList.remove("fa-shopping-cart");
  cartButton.classList.add("fa-cart-plus");

  Swal.fire({
    icon: "success",
    title: `<h3> ${productName}</h3>`,
    text: `Added ${quantity} to Cart.`,
    showConfirmButton: false,
    timer: 1000,
  });
}

function openCart() {
  let cartContent = "";
  if (shoppingCart.length === 0) {
    cartContent += "<p>Your cart is empty.</p>";
    // Change the cart button icon back to the regular icon
    cartButton.classList.remove("fa-cart-plus");
    cartButton.classList.add("fa-shopping-cart");
  } else {
    shoppingCart.forEach((item) => {
      cartContent += `
                <div>
                    <p style="display:inline-block">
                    <button class="btn btn-danger" onclick="removeFromCart('${item.productName}')"><i class="fa-close"></i></button>
                    <big><u>${item.productName}</u> :</big> ${item.price} <small><b>دت</b></small> <span style='border: solid 0.5px blue;border-radius:25%;padding:2px;color:blue;background-color:cyan'> =>
                        <input type="number" min="1" value="${item.count}" onchange="updateCount('${item.productName}', this.value)" style="width:40px" controls="true"></span>
                    </p>
                </div>
            `;
    });
    cartContent += `
            <div>
                <button class="btn btn-primary" onclick="checkout()" width="100%">Buy <i class="fa-paper-plane"></i></button>
            </div>
        `;
  }
  Swal.fire({
    title: "Your Cart",
    html: cartContent,
    confirmButtonText: "✕",
    confirmButtonColor: "#fc5d",
    customClass: {
      confirmButton: "close-button",
    },
  });
}

function removeFromCart(productName) {
  const index = shoppingCart.findIndex(
    (item) => item.productName === productName
  );
  if (index !== -1) {
    shoppingCart.splice(index, 1);
    openCart(); // Update the cart display after removal
  }
  // Check if cart is empty to change the icon back
  if (shoppingCart.length === 0) {
    cartButton.classList.remove("fa-cart-plus");
    cartButton.classList.add("fa-shopping-cart");
  }
}

function updateCount(productName, newCount) {
  const index = shoppingCart.findIndex(
    (item) => item.productName === productName
  );
  if (index !== -1) {
    shoppingCart[index].count = parseInt(newCount);
  }
}

function promptUserData(callback) {
  Swal.fire({
    title: "Enter Your Name",
    input: "text",
    inputPlaceholder: "Full Name",
    confirmButtonText: "Next",
    confirmButtonColor: "#F9ff",
    inputValidator: (value) => {
      if (!value) {
        return "Please enter your name";
      }
      const nameRegex = /^[a-zA-Z\s]*$/;
      if (!nameRegex.test(value)) {
        return "Invalid Name";
      }
    },
  }).then((nameResult) => {
    if (nameResult.isConfirmed) {
      Swal.fire({
        title: "Enter Your Phone Number",
        input: "tel",
        inputPlaceholder: "Phone Number",
        confirmButtonText: "Next",
        confirmButtonColor: "#F9ff",
        inputValidator: (value) => {
          if (!value) {
            return "Please enter your phone number";
          }
          const phoneRegex = /\d{2}\d{3}\d{3}/; // Modified regex to allow numbers, spaces, and '+'
          if (!phoneRegex.test(value)) {
            return "Example 50 101 300";
          }
        },
      }).then((phoneResult) => {
        if (phoneResult.isConfirmed) {
          Swal.fire({
            title: "Select Your City",
            html: `
            <div style="display: flex; align-items: center;">
              <div style="flex: 1">
                <select id="city-select" class="swal2-select">
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
              <div style="flex: 1;">
                <input id="location-input" class="swal2-input" placeholder="Enter your location">
              </div>
            </div>
              `,
            confirmButtonText: "Buy 💰",
            showCancelButton: false,
            preConfirm: () => {
              const selectedCity = document.getElementById("city-select").value;
              const location = document.getElementById("location-input").value;
              if (!selectedCity || !location) {
                Swal.showValidationMessage(
                  "Please select a city and enter your location"
                );
              }
              return { selectedCity, location };
            },
          }).then((result) => {
            if (result.isConfirmed) {
              const userData = {
                name: nameResult.value,
                phone: phoneResult.value,
                location: `City: ${result.value.selectedCity}.\nWhere: ${result.value.location}`,
              };
              callback(userData);
            }
          });
        }
      });
    }
  });
}

function checkout() {
  // Check if the cart is empty
  if (shoppingCart.length === 0) {
    Swal.fire({
      title: "Error!",
      text: "Your cart is empty. Please add some products before checking out.",
      icon: "error",
    });
    return;
  }

  // Calculate total price
  const totalPrice = shoppingCart.reduce(
    (total, item) => total + item.price * item.count,
    0
  );

  // Prompt for user data
  promptUserData((userData) => {
    Swal.fire({
      title: "Confirm Purchase",
      html: `
        <p>Total Price: ${totalPrice} دت<br>Are you sure you want to proceed with the purchase?</p>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      confirmButtonColor: "green",
      cancelButtonText: "Cancel",
      cancelButtonColor: "#6c757d",
    }).then((result) => {
      if (result.isConfirmed) {
        shoppingCart.forEach((item) => {
          sendProductToGoogleSheets(
            item.productName,
            item.price,
            item.count,
            userData
          );
        });

        // Clear the shopping cart after successful checkout
        shoppingCart.length = 0;
        cartButton.classList.remove("fa-cart-plus");
        cartButton.classList.add("fa-shopping-cart");
      }
    });
  });
}
// Function to send a product along with user data to Google Sheets
function sendProductToGoogleSheets(productName, price, count, userData) {
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
    "https://script.google.com/macros/s/AKfycbzCUNhrWCZB9rGyO4VedSkorhSgCPCkqXeGYrqumu2rDunP5m6G4jgY--h-Mu6jXNwX/exec";

  const formData = new FormData();
  formData.append("productName", productName);
  formData.append("price", price);
  formData.append("count", count);
  formData.append("phone", userData.phone);
  formData.append("name", userData.name);
  formData.append("location", userData.location);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", scriptUrl);
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log("Product sent successfully:", productName);
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
      console.error("Error sending product:", productName);
    }
  };
  xhr.onerror = function () {
    console.error("Error sending product:", productName);
  };
  xhr.send(formData);
}
