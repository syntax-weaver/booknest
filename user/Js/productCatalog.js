import { navbarReady } from "./navbarLoader.js";

// Wait for navbar
await navbarReady;

const params = new URLSearchParams(window.location.search);
console.log(params);
const subject = params.get("catagory") ?? params.get("category");
console.log("Subject:", subject);

// Get products from storage
function productsJson() {
  const fetchedProducts = JSON.parse(localStorage.getItem("products") || "[]");
  if (!subject) return fetchedProducts;

  const filtered = fetchedProducts.filter(
    (p) => Array.isArray(p.subjects) && p.subjects.includes(subject)
  );

  if (filtered.length > 0) return filtered;

  alert(`There are no ${subject} books available right now. Showing all.`);
  return fetchedProducts;
}

// Build catalog
function getProducts() {
  const products = productsJson();
  for (const product of products) {
    try {
      if (product.active == 2) {
        const coverSrc = getCover(product);
        addCard(product, coverSrc);
      }
    } catch (e) {
      console.error("Error with product:", product, e);
    }
  }
}
getProducts();

// Helpers
function getCover(product) {
  return product.covers?.large ?? product.image;
}

function addCard(product, src) {
  const mainWrapper = document.getElementById("row");

  const cardWrapper = document.createElement("div");
  cardWrapper.className = "col-12 col-md-6 col-lg-3 mb-4";

  const card = document.createElement("div");
  card.className = "card h-100 elegant-card";
  card.setAttribute("data-price", product.price);

  const cardHeader = document.createElement("div");
  cardHeader.className = "card-header";
  cardHeader.innerHTML = `<img src="${src}" alt="Book" class="card-img-top">`;

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";
  cardBody.innerHTML = `
    <p>Author: ${product.authors?.[0]?.name ?? product.author}</p>
    <p>Title: ${product?.title}</p>
    <p>Price: ${product.price}$</p>
  `;

  card.addEventListener("dblclick", function (e) {
    window.location.href = `product-details.html?title=${product.title}`;
  });

  const cardFooter = document.createElement("div");
  cardFooter.className =
    "card-footer d-flex flex-row justify-content-center align-items-center";

  const addToCart = document.createElement("button");
  addToCart.className = "btn";
  addToCart.textContent = "Add to Cart";
  addToCart.addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const ix = cart.findIndex((item) => item.title === product.title);

    if (ix > -1) cart[ix].quantity += 1;
    else cart.push({ ...product, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
  });

  cardFooter.appendChild(addToCart);
  card.appendChild(cardHeader);
  card.appendChild(cardBody);
  card.appendChild(cardFooter);
  cardWrapper.appendChild(card);
  mainWrapper.appendChild(cardWrapper);
}
