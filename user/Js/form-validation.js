let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartRow = document.getElementById('cart-row');
// Get summary saved from cart page
let orderSummary = JSON.parse(localStorage.getItem("orderSummary")) || {
    subtotal: 0,
    delivery: 0,
    discount: 0,
    total: 0
};

let subtotalEl = document.getElementById('subtotal');
if (subtotalEl) subtotalEl.textContent = `$${Number(orderSummary.subtotal).toFixed(2)}`;

let deliveryEl = document.getElementById('delivery');
if (deliveryEl) deliveryEl.textContent = `$${Number(orderSummary.delivery).toFixed(2)}`;

let discountEl = document.getElementById('discount');
if (discountEl) discountEl.textContent = `$${Number(orderSummary.discount).toFixed(2)}`;

let totalEl = document.getElementById('total');
if (totalEl) totalEl.textContent = `$${Number(orderSummary.total).toFixed(2)}`;


cart.forEach(book => {
    cartRow.innerHTML += `
        <div class="col-9 d-flex justify-content-between" data-isbn="${book.title}">
            <img class="col-4"  style="height: fit-content;" src="${book.covers?.large || ''}"" alt="${book.title}">
            <div class="col-7">
                <p>${book.title}</p>
                <p><small>by ${book.authors?.map(a => a.name).join(", ") || "Unknown"}</small></p>
                <p> ${book.quantity} pieces</p>
            </div>
        </div>
        <p class="col-3"> ${(book.price * book.quantity).toFixed(2)}</p>
        `

});


document.addEventListener("DOMContentLoaded", () => {
    const confirmBtn = document.getElementById("modal-btn2");
    const modalElement = document.getElementById("exampleModalToggle");
    const modal = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
    });

    // Validation rules for each field
    const fields = {
        inputFName:
        {
            validator: v => /^[A-Za-z]{2,}$/.test(v),
            message: "Please enter a valid first name."
        },
        inputLName:
        {
            validator: v => /^[A-Za-z]{2,}$/.test(v),
            message: "Please enter a valid last name."
        },
        inputEmail4: {
            validator: v => /^[^\s@]+@[^\s@]+\.com+$/.test(v),
            message: "Please enter a valid email."
        },
        inputcontact: {
            validator: v => /^\+?\d{11}$/.test(v),
            message: "Please enter a valid contact number."
        },
        inputAddress: {
            validator: v => v.trim().length > 5,
            message: "Please enter a valid address."
        },
        inputCountry: {
            validator: v => /^[A-Za-z ]+$/.test(v),
            message: "Please enter a valid country."
        },
        inputCity: {
            validator: v => /^[A-Za-z ]+$/.test(v),
            message: "Please enter a valid city."
        },
        inputState: {
            validator: v => /^[A-Za-z ]+$/.test(v),
            message: "Please enter a valid state."
        },
        inputZip: {
            validator: v => /^\d{4,10}$/.test(v),
            message: "Please enter a valid ZIP code."
        },
        formNameOnCard: {
            validator: v => /^[A-Za-z ]{3,}$/.test(v),
            message: "Please enter the name on the card."
        },
        formCardNumber: {
            validator: v => /^\d{16}$/.test(v.replace(/\s+/g, "")),
            message: "Please enter a valid credit card number."
        },
        formExpiration: {
            validator: v => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v),
            message: "Please enter a valid expiration date (MM/YY)."
        },
        formCVV: {
            validator: v => /^\d{3}$/.test(v),
            message: "Please enter a valid CVV."
        }
    };

    // Add invalid feedback elements & live validation
    Object.keys(fields).forEach(id => {
        const input = document.getElementById(id);
        const feedback = document.createElement("div");
        feedback.className = "invalid-feedback";
        feedback.textContent = fields[id].message;
        input.insertAdjacentElement("afterend", feedback);

        input.addEventListener("input", () => validateField(id));
    });

    function validateField(id) {
        const input = document.getElementById(id);
        const { validator } = fields[id];
        const value = input.value.trim();
        if (!value || !validator(value)) {
            input.classList.add("is-invalid");
            input.classList.remove("is-valid");
            return false;
        } else {
            input.classList.remove("is-invalid");
            input.classList.add("is-valid");
            return true;
        }
    }

    function validateAll() {
        return Object.keys(fields).every(id => validateField(id));
    }

    // Payment method selection
    const paymentMethods = document.querySelectorAll(".payment-method .col-6, .payment-method .col-lg-3");
    let selectedMethod = null;

    paymentMethods.forEach(method => {
        method.addEventListener("click", () => {
            paymentMethods.forEach(m => m.classList.remove("bg-primary", "text-white"));
            method.classList.add("bg-primary", "text-white");
            selectedMethod = method;
        });
    });

    // Confirm button click → validate then show modal
    confirmBtn.addEventListener("click", () => {
        const isFormValid = validateAll();
        const isPaymentChosen = !!selectedMethod;

        if (!isFormValid) {
            alert("Please fill in all fields correctly.");
            return;
        }

        if (!isPaymentChosen) {
            alert("Please select a payment method.");
            return;
        }

        // saving the data in the localstorage
        let form = document.getElementById("payment-form");
        // Get book detail from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Get user info from localStorage
        let user = JSON.parse(localStorage.getItem("bookstoreUsers")) || [];
        // Use new FormData() to get form data
        let formData = new FormData(form);
        let formObj = {};
        // Loop through formData inputs with forEach to save the data in the object
        formData.forEach((value, key) => {
            formObj[key] = value;
        });

        // Combine everything into one object to save it into localstorage
        let orderData = {
            user_info: user,
            book_info: cart,
            form_info: formObj,
            order_summary: orderSummary,   
            order_date: new Date().toLocaleString(),
            order_delivery: 'Express',
            order_status: 'Processing',
        };

        // Get existing orders or initialize as empty array
        let existingOrders = JSON.parse(localStorage.getItem('order')) || [];
        if (!Array.isArray(existingOrders)) {
            // reset if it's not an array
            existingOrders = []; 
        }
        // Push the new order
        existingOrders.push(orderData);
        // Save combined data in localStorage under order and save the updated data
        localStorage.setItem('order', JSON.stringify(existingOrders));
        localStorage.removeItem('cart');
        console.log(existingOrders);
        // If all good show modal
        modal.show();
    });

    let doneBtn = document.getElementById('done');
    let form = document.getElementById('payment-form');

    doneBtn.addEventListener('click', () => {
        form.reset();
        window.location.href = 'home.html';

    })
});

