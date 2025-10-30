export function setupFavIcon() {
  let total;
  const cartIcon = document.getElementById("user-fav");
  const cartDropdown = document.getElementById("fav-dropdown");
  cartIcon.addEventListener("click", function () {
    const cart = JSON.parse(localStorage.getItem("fav")) || [];
    let html = ``;
    if (cart.length === 0) {
      cartDropdown.innerHTML = `<li class="text-light dropdown-item-text">Your favourite is empty</li>`;
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
    window.location.href = "favourite.html";
  });
}
