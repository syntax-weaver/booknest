import { addBookToCart } from "./handleCart.js";

export async function renderNewArrivals() {
  const slider = document.getElementById("new-arrivals-slider");
  const limit = 8;
  try {
    const response = JSON.parse(localStorage.getItem("products"), []);
    let books = response.slice(0, limit);
    // console.log(books)

    slider.innerHTML = "";
    let position = 0;
    books.forEach((book) => {
      position++;

      let cover = book.covers?.medium;
      const title = book?.title;
      const author = book.authors[0]?.name;
      const price = book?.price;

      const card = document.createElement("div");
      card.className =
        "item d-flex flex-column align-items-center rounded text-center p-2";
      card.style.setProperty("--position", position);

      card.innerHTML = `
            <img src="${cover}" alt="book cover" class="book-img img-fluid mb-2"  data-title="${title}" data-author="${author}" data-cover="${cover}">
            <h5 class="book-title"  data-title="${title}" data-author="${author}" data-cover="${cover}">${title}</h5>
            <p class="book-author text-muted mb-1 text-light">${author}</p>
            <p class="book-price fw-semibold mb-1">$${price}</p>
            <button class="btn mt-auto btn-sm add-btn">Add to Cart</button>
            `;

      function goToBookPage(book) {
        const title = book?.dataset.title;
        const author = book?.dataset.author;
        const cover = book?.dataset.cover;
        location.href = `product-details.html?title=${encodeURIComponent(
          title
        )}`;
      }

      card.querySelector(".book-img").addEventListener("click", function () {
        goToBookPage(this);
      });
      card.querySelector(".book-title").addEventListener("click", function () {
        goToBookPage(this);
      });
      card
        .querySelector(".add-btn")
        .addEventListener("click", function (event) {
          event.stopPropagation();

          addBookToCart(book);
        });

      slider.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to load new arrivals: ", error);
  }
}
