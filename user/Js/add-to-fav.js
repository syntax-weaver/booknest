import { navbarReady } from "./navbarLoader.js";


// Wait for navbar
await navbarReady;



    // localStorage.clear();
    let favourite = JSON.parse(localStorage.getItem('fav')) || [];
    console.log(favourite.length)
    let favContainer = document.getElementById('favContainer');

    if (favourite.length === 0) {
        favContainer.innerHTML = `
    <div class="text-center">
            <img id="empty-cart-image" src="Assets/imgs/pngwing.com(1).png" alt="Your favourites list is empty" style="width: 55%; height: fit-content;" />
            <h2>your cart is empty</h2>
    </div>
    `;
        
    }else{
    favContainer.innerHTML = '';
    favourite.forEach(book => {
        favContainer.innerHTML += `
        <div class="row g-0" data-title="${book.title}">
                    <div class="book-img col-12 col-md-3 col-lg-2 d-flex justify-content-center align-items-center">
                        <img class="m-3" src="${book.covers?.large || ''}" alt="${book.title}">
                    </div>
                    
                    <div class="col-12 col-md-7 col-lg-8">
                        <div class="card-body">
                            <h4 class="card-title">${book.title}</h4>
                            <p class="card-text"><small class="text-body-secondary">by ${book.authors?.map(a => a.name).join(", ") || "Unknown"}</small></p>
                            <p class="card-text">${book.description}</p>
                        </div>
                    </div>
                    <div class="icons col-12 col-md-2 d-flex align-items-center justify-content-center">
                        <div class="cart-icon border-0 rounded border-dark-subtle me-1">
                        <i class="fa-solid fa-cart-shopping"></i>
                        </div>
                        <div class="trash-icon border-0 rounded border-dark-subtle ms-1">
                        <i class="fa-solid fa-trash"></i>
                        </div>
                    </div>
                </div>
        `
    });}









    // to remove the whole row or the a book
    document.querySelectorAll('.trash-icon').forEach(btn => {
        btn.addEventListener('click', () => {
            let row = btn.closest('.row');
            let title = row.dataset.title;

            // Remove from array
            favourite = favourite.filter(book => book.title !== title);

            //Save updated array
            localStorage.setItem('fav', JSON.stringify(favourite));

            //Remove from DOM
            row.remove();

            //If list is empty, show message
            if (favourite.length === 0) {
                favContainer.innerHTML = `
                <div class="text-center">
                    <img id="empty-cart-image" src="Assets/imgs/pngwing.com(1).png" 
                         alt="Your favourites list is empty" 
                         style="width: 50%; height: fit-content;" />
                    <h2>Your favourites list is empty</h2>
                </div>
            `;
            }
        });
    });



    document.querySelectorAll('.cart-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            let row = icon.closest('.row');
            let title = row.dataset.title;

            // get favourites to find clicked book
            let favourite = JSON.parse(localStorage.getItem('fav')) || [];
            let book = favourite.find(b => b.title === title);
            if (!book) return;

            // get cart and update or add
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            let existing = cart.find(c => c.title === book.title);

            if (existing) {
                existing.quantity += 1;
                alert(`Quantity updated! Now you have ${existing.quantity} of this book in your cart.`);
            } else {
                cart.push({ ...book, quantity: 1 });
                alert('Book added to cart!');
            }

            localStorage.setItem('cart', JSON.stringify(cart));
        });
    });






