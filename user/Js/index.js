import { products } from "./startup/loadBooks.js";
await products;
console.log(products);
localStorage.setItem("products", JSON.stringify(products));
window.location.href = "user/home.html";
