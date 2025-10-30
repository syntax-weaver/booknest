import { navbarReady } from "./navbarLoader.js";

// Wait for navbar
await navbarReady;

let params = new URLSearchParams(window.location.search);
let btitle = params.get("title");
console.log(btitle);
// if (btitle) {
//     bookDetails(btitle);
// }
// ;

const bookInformation = JSON.parse(localStorage.getItem("products")) || [];
let book;
// var btitle = "The Mystery of the Blue Train";

for (let i = 0; i < bookInformation.length; i++) {
  if (bookInformation[i].title == btitle) {
    book = bookInformation[i];
  }
}
function renderBookDetails(book) {
  let detailRow = document.getElementById("detailRow");
  detailRow.innerHTML = `
        <!-- Left Column: Image -->
                <div class="col-md-4 text-center">
                    <img src="${book?.covers?.large ?? book.image}" alt="${
    book.title
  }" class="book-image">
                </div>
                <!-- Right Column: Info -->
                <div class="col-md-8">
                    <h2 class="fw-bold">${book.title}</h2>
                    <!-- Rating and Socials -->
                    <div class="d-flex align-items-center mb-3 flex-wrap">
                        <div class="me-3">
                            <span class="rating-stars">★★★★☆</span>
                            <span class="fw-bold">4.0</span>
                        </div>
                        <div class="me-3 text-muted">235 Reviews</div>
                        <div class="me-3 text-muted">456k Likes</div>
                    </div>
                    <!-- Description -->
                    <p>${
                      book.description?.value ||
                      book.description ||
                      "No description provided"
                    }</p>
                    <!-- Author, Publisher, Year -->
                    <div class="d-flex flex-wrap mb-3">
                        <div>
                            <ul class="me-4">
                                <li>Author</li>
                                <li>${
                                  book.authors?.map((a) => a.name).join(", ") ||
                                  "Unknown"
                                }</li>
                            </ul>
                        </div>
                        <ul class="me-4">
                            <li>Publisher</li>
                            <li>${
                              book?.publish?.publishers
                                ?.map((p) => p.name)
                                .join(", ") || "Unknown"
                            }</li>
                        </ul>
                        <ul>
                            <li>Year</li>
                            <li>${book?.publish?.date}</li>
                        </ul>
                    </div>
                    <p>Stock: <span id="stock">${book.stock}</span></p>
                    <!-- Price -->
                    <div class="mb-4">
                        <h3 class="d-inline fw-bold">$ ${book.price}</h3>
                    </div>
                    <!-- Quantity + Add to Cart -->
                    <div class="d-flex align-items-center flex-wrap">
                        <div class="input-group me-3 mb-2" style="width: 120px;">
                            <button class="btn btn-outline-secondary decrease">-</button>
                            <input type="text" class="form-control text-center" min="1" max="10" value="" id="qty">
                            <button class="btn btn-outline-secondary increase">+</button>
                        </div>
                        <div class="icons d-flex align-items-center justify-content-center">
                            <div class="cart-icon border rounded border-dark-subtle me-1" id="cart">
                                <i class="fa-solid fa-cart-shopping"></i>
                            </div>
                            <div class="trash-icon border rounded border-dark-subtle ms-1" id="fav">
                                <i class="fa-solid fa-heart" id="favIcon"></i>
                            </div>
                        </div>
                    </div>
                </div>
`;
}
renderBookDetails(book);
showRecommendedBooks(book);
attachEventsHandlers(book);
// ------------------------------------------------------------------------------
// for quantity selector
// ----------------------------
// we did it all as function so we can use it in both book coming from home and cataloge and the recommened books
function attachEventsHandlers(book) {
  let qtyInput = document.getElementById("qty");
  let increaseBtn = document.querySelector(".increase");
  let decreaseBtn = document.querySelector(".decrease");

  qtyInput.value = 1;

  increaseBtn.addEventListener("click", () => {
    let currentQuantity = parseInt(qtyInput.value) || 1;
    if (currentQuantity < 10) {
      qtyInput.value = currentQuantity + 1;
    }
  });

  decreaseBtn.addEventListener("click", () => {
    let currentQuantity = parseInt(qtyInput.value) || 1;
    if (currentQuantity > 1) {
      qtyInput.value = currentQuantity - 1;
    }
  });

  // ---------------------------------------------------------------------------------------------------------------------
  // for add to cart button
  // and for preparing data to be saved in cart
  // ---------------------------------------------

  let cartIcon = document.getElementById("cart");
  cartIcon.addEventListener("click", () => {
    let bookQuantity = parseInt(qtyInput.value) || 1;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existingBook = cart.find((item) => item.title === book.title);
    if (existingBook) {
      existingBook.quantity = (existingBook.quantity || 0) + bookQuantity;
      alert(
        `Quantity updated! Now you have ${existingBook.quantity} of this book in your cart.`
      );
    } else {
      cart.push({ ...book, quantity: bookQuantity });
      alert("book added to cart!");
    }
    //to save the updated cart
    localStorage.setItem("cart", JSON.stringify(cart));
  });

  // ---------------------------------------------------------------------------------------------------------------------
  // for add to favourite button
  // and for preparing data to be saved in favourite list
  // --------------------------------------------------------
  let favIcon = document.getElementById("fav");
  let favourite = JSON.parse(localStorage.getItem("fav")) || [];

  // helper to update heart color
  function updateHeartColor(isFav) {
    // favIcon.querySelector('i').style.color = isFav ? 'red' : '';
    const heart = favIcon.querySelector("i");
    if (heart) heart.style.color = isFav ? "red" : "";
  }
  // set initial state
  updateHeartColor(favourite.some((item) => item.title === book.title));
  // toggle to remove the book from favourites list if exits and if not it will be added
  favIcon.addEventListener("click", () => {
    let isFav = favourite.some((item) => item.title === book.title);
    if (isFav) {
      // to remove from favourites list
      favourite = favourite.filter((item) => item.title !== book.title);
    } else {
      //to add to favourites list
      favourite.push({ ...book });
    }
    // save in localstorage
    localStorage.setItem("fav", JSON.stringify(favourite));
    // update style
    updateHeartColor(!isFav);
  });
}

// ---------------------------------------------------------------------------------------------------------------------
// for recommeded books using api
// ---------------------------------
function showRecommendedBooks(currentBook) {
  let bookInformation = JSON.parse(localStorage.getItem("products")) || [];

  // filter related books
  let relatedBooks = bookInformation.filter((b) => {
    if (!b.subjects || !currentBook.subjects) return false;
    return b.subjects.some((subj) => currentBook.subjects.includes(subj));
  });
  // remove the current book
  relatedBooks = relatedBooks.filter((b) => b.title !== currentBook.title);

  // shuffle to get random everytime we refresh
  for (let i = relatedBooks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [relatedBooks[i], relatedBooks[j]] = [relatedBooks[j], relatedBooks[i]];
  }

  // Pick 6 random books
  let randomSix = relatedBooks.slice(0, 6);

  // Render
  let relatedHTML = "";
  randomSix.forEach((b) => {
    const cover =
      b.covers?.large ||
      b.covers?.medium ||
      b.covers?.small ||
      "placeholder.jpg";
    relatedHTML += `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-4">
                <div class="card h-100 recommended-book" data-title="${
                  b.title
                }">
                    <img src="${cover}" class="card-img-top img-fluid" alt="${
      b.title
    } style="height: 250px;">
                    <div class="card-body">
                        <h6 class="text-truncate">${b.title}</h6>
                        <p>by ${
                          b.authors?.map((a) => a.name).join(", ") || "Unknown"
                        }</p>
                    </div>
                    
                </div>
            </div>
        `;
  });

  document.getElementById("recom-book").innerHTML = relatedHTML;

  // Add click listeners
  document.querySelectorAll(".recommended-book").forEach((card) => {
    card.addEventListener("click", () => {
      let clickedTitle = card.dataset.title;
      let clickedBook = bookInformation.find((b) => b.title === clickedTitle);
      if (clickedBook) {
        // Re-render book details
        renderBookDetails(clickedBook);
        // Re-render recommended books based on new book
        showRecommendedBooks(clickedBook);
        // for all action as cart fav and quantity
        attachEventsHandlers(clickedBook);
        // to scrollto the top of the page
        document.getElementById("detailRow").scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}
