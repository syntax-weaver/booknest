import { navbarReady } from "./navbarLoader.js";


// Wait for navbar
await navbarReady;


    // localStorage.clear();
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartItems = document.getElementById('cartItem');

    renderCart();
    updateOrderSummary();

    function renderCart() {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartItems.innerHTML = '';

        if (cart.length === 0) {
            showEmptyCart();
            updateOrderSummary();
            return;
        }

        cart.forEach(book => {
            cartItems.innerHTML += `
            <div class="row g-0 mb-3" data-title="${book.title}">
                <div class="book-img col-12 col-md-3 col-lg-2 d-flex justify-content-center align-items-center">
                    <img class="my-3" src="${book.covers?.large || ''}" alt="${book.title}">
                </div>

                <div class="col-12 col-md-7 col-lg-8">
                    <div class="card-body">
                        <h4 class="card-title">${book.title}</h4>
                        <p class="card-text"><small class="text-body-secondary">by ${book.authors?.map(a => a.name).join(", ") || "Unknown"}</small></p>
                        <p class="card-text fw-bold price fs-5" data-title="${book.title}">
                              $${(book.price * book.quantity).toFixed(2)}
                        </p>

                        <div class="input-group me-3 mb-2" style="width: 120px;">
                            <button class="btn btn-outline-secondary decrease" data-title="${book.title}">-</button>
                            <input type="text" class="form-control text-center qty-input" min="1" max="10" value="${book.quantity}" data-title="${book.title}">
                            <button class="btn btn-outline-secondary increase" data-title="${book.title}"">+</button>
                        </div>
                    </div>
                </div>

                <div class="icons col-12 col-md-2 d-flex align-items-center justify-content-center">
                    <div class="fav-icon border-0 rounded border-dark-subtle me-1">
                        <i class="fa-solid fa-heart"></i>
                    </div>
                    <div class="trash-icon border-0 rounded border-dark-subtle ms-1">
                        <i class="fa-solid fa-trash"></i>
                    </div>
                </div>
            </div>
            `;
        });

        attachQuantityListeners();
        attachRemoveListeners();
        attachFavListeners();
    }


    // -----------------------------------------------------------------------------------------------------------------------------
    // quantity selector----increase
    // ------------------------------------
    function attachQuantityListeners() {
        document.querySelectorAll('.increase').forEach(btn => {
            btn.addEventListener('click', () => {
                let bTitle = btn.dataset.title;
                let input = document.querySelector(`.qty-input[data-title="${bTitle}"]`);
                let current = parseInt(input.value) || 1;
                if (current < 10) {
                    input.value = current + 1;
                    updateQuantityInLocalStorage(bTitle, current + 1);
                    // updateOrderSummary();
                }
            });
        });

        // -----------------------------------------------------------------------------------------------------------------------------
        // decrease selector
        // ------------------------------------
        document.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', () => {
                let bTitle = btn.dataset.title;
                let input = document.querySelector(`.qty-input[data-title="${bTitle}"]`);
                let current = parseInt(input.value) || 1;
                if (current > 1) {
                    input.value = current - 1;
                    updateQuantityInLocalStorage(bTitle, current - 1);
                    // updateOrderSummary();
                }
            });
        });
    }

    // -----------------------------------------------------------------------------------------------------------------------------
    // save the updated value in localstorage
    // ----------------------------------------
    function updateQuantityInLocalStorage(title, newQty) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let item = cart.find(b => b.title === title);
        if (item) {
            item.quantity = newQty;
            localStorage.setItem('cart', JSON.stringify(cart));
            //Update item total price in cart row
            let priceEl = document.querySelector(`.price[data-title="${title}"]`);
            if (priceEl) {
                priceEl.textContent = `$${(item.price * item.quantity).toFixed(2)}`;
            }
            updateOrderSummary();
        }
    }



    // -----------------------------------------------------------------------------------------------------------------------------
    // remove button
    // ------------------------------------
    function attachRemoveListeners() {
        document.querySelectorAll('.trash-icon').forEach(btn => {
            btn.addEventListener('click', () => {
                let row = btn.closest('.row');
                let title = row.dataset.title;

                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart = cart.filter(book => book.title !== title);
                localStorage.setItem('cart', JSON.stringify(cart));

                renderCart();
                updateOrderSummary();
            });
        });
    }

    //// -----------------------------------------------------------------------------------------------------------------------------
    // update the summary by zeros if there is no items
    // -------------------------------------------------
    function updateOrderSummary() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;
    let delivery = 0;
    let discount = 0;

    if (cart.length > 0) {
        subtotal = cart.reduce((sum, book) => sum + (book.price * book.quantity), 0); 
        delivery = 50;
        discount = 20;
    }

    // Update DOM
    let subtotalEl = document.getElementById('subtotal');
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;

    let deliveryEl = document.getElementById('delivery');
    if (deliveryEl) deliveryEl.textContent = `$${delivery}`;

    let discountEl = document.getElementById('discount');
    if (discountEl) discountEl.textContent = `$${discount}`;

    let totalEl = document.getElementById('total');
    if (totalEl) totalEl.textContent = `$${(subtotal + delivery - discount).toFixed(2)}`;

    // Save in localStorage
    localStorage.setItem("orderSummary", JSON.stringify({
        subtotal: subtotal,   // keep as number
        delivery,
        discount,
        total: subtotal + delivery - discount
    }));
}



    // -----------------------------------------------------------------------------------------------------------------------------
    // empty cart image will appear if the cart is empty
    // ------------------------------------
    function showEmptyCart() {
        cartItems.innerHTML = `
        <div class="text-center">
            <img id="empty-cart-image" src="Assets/imgs/pngwing.com.png" alt="Your cart is empty" style="width: 50%; height: fit-content;" />
            <h2>Your cart is empty</h2>
        </div>
        `;
    }


    // -----------------------------------------------------------------------------------------------------------------------------
    // favourite button
    // ------------------------------------
    function attachFavListeners() {
        document.querySelectorAll('.fav-icon').forEach(icon => {
            icon.addEventListener('click', () => {
                let row = icon.closest('.row');
                let title = row.dataset.title;

                // Get cart so we can find the clicked book
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                let book = cart.find(b => b.title === title);
                if (!book) return;

                // Get current favourites
                let favourite = JSON.parse(localStorage.getItem('fav')) || [];
                let exists = favourite.some(f => f.title === title);

                if (exists) {
                    // Remove if already in favourites
                    favourite = favourite.filter(f => f.title !== title);
                    // to reset icon color
                    icon.querySelector('i').style.color = '';
                } else {
                    // Add if not in favourites
                    favourite.push({ ...book });
                    //for multible items that when we do loop
                    icon.querySelectorAll('i').forEach(i => i.style.color = 'red');
                }

                localStorage.setItem('fav', JSON.stringify(favourite));
            });
        });
    }



    // ---------------------------------------------------------------------------------------------
    // to redirect to checkout page
    // -----------------------------------
    let checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn.addEventListener('click', () => {
        

        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            // JSON.parse(sessionStorage.getItem("currentUser"));

        if (!currentUser) {
            // Save the current page before redirect
            localStorage.setItem("redirectAfterLogin", "payment.html");
            window.location.href = "log_reg.html"; // your login page
        } else {
                if (currentUser.role === "user") {
                // Normal user → go to checkout
                window.location.href = "payment.html"; 
            }
        };

    });

