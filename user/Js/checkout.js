// to save the payment method into the object 
import { navbarReady } from "./navbarLoader.js";


// Wait for navbar
await navbarReady;


document.querySelectorAll(".payment-option").forEach(option => {
    option.addEventListener("click", () => {
        document.getElementById("paymentMethod").value = option.dataset.method;
        console.log("Payment method set to:", option.dataset.method);
    });
});

