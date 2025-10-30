let total;
export function addBookToCart(b) {
  // const current = JSON.parse(localStorage.getItem('currentUser'))[0] || '';
  // if(current) {
  //     const customerId = read('users').find(x => x.name === current.name).id;
  // }
  // const book = {
  //     productId: b.id,
  //     title: b.title,
  //     author: b.author,
  //     image: b.image,
  //     price: b.price,
  //     sellerId: b.sellerId,
  //     qty: 1
  // };

  // get the existing cart from the local storage.
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  console.log(cart);
  // {
  //     id: generateUniqueId('0'),
  //     customerId: customerId?? 'guest',
  //     items: [],
  //      total: 0,
  //      status: 'pending',
  //      createdAt: new Date().toISOString()
  //     };

  // check if the book already exists in the cart.

  if (cart) {
    const existingBook = cart.find((x) => x.title === b.title);
    if (existingBook) {
      existingBook.quantity += 1;
    } else {
      cart.push({ ...b, quantity: 1 }); // add the new book.
    }

    // save back to the local storage.
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log(total);
  }
}

export function setupCartIcon() {
  const cartIcon = document.getElementById("user-cart");
  const cartDropdown = document.getElementById("cart-dropdown");

  cartIcon.addEventListener("click", function () {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let html = ``;
    if (cart.length === 0) {
      cartDropdown.innerHTML = `<li class="text-light dropdown-item-text">Your cart is empty</li>`;
    } else {
      cart.forEach((book) => {
        html += `<li class="text-light dropdown-item-text">${book.title} - $${book.price} (x${book.quantity}) </li>`;
      });
      total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      html += `<li class="text-light dropdown-item-text">Total - ${total} </li>`;
      cartDropdown.innerHTML = html;
    }
  });

  cartIcon.addEventListener("dblclick", function () {
    window.location.href = "cart.html";
  });
}
