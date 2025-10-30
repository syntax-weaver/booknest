import { requireAdmin } from "./auth.js";
import { read, write, findById, saveOrUpdate, removeById } from "./storage.js";
import { sidebarReady } from "./loaders/sidebarLoader.js";
await sidebarReady;

requireAdmin();
loadProducts();
applyFilters();
applySearch();
applyTableActions();
showProductDetails();

function showProductDetails() {
  const tableBody = document.getElementById("products-body");

  tableBody.addEventListener("click", function (event) {
    const row = event.target.closest("tr");
    if (!row) return;

    if (event.target.closest("button")) return;

    console.log(row);
    const productId = row.dataset.id;
    const product = findById("products", productId);

    let seller = null;
    if (product?.sellerId) {
      seller = findById("bookstoreUsers", product.sellerId);
    }
    // const seller = findById('users', product.sellerId);

    const modalEl = document.getElementById("book-modal");
    const modal = new bootstrap.Modal(modalEl);

    const modalBody = modalEl.querySelector(".modal-body");
    const modalFooter = modalEl.querySelector(".modal-footer");

    // clear previous content.
    modalBody.innerHTML = "";
    modalFooter.innerHTML = "";

    // populate modal body.
    populateBody(modal, modalBody, product, seller);

    // populate modal footer
    populateFooter(modal, modalFooter, product);

    modal.show();
  });
}

function populateBody(modal, modalBody, product, seller) {
  const cover = product?.covers?.small || product?.image;
  const title = product?.title || "Untitled";
  const author =
    product?.author || (product?.authors?.[0]?.name ?? "Unknown Author");
  const price = product?.price || "N/A";
  const description = product?.description || "No description available.";
  const sellerName = seller?.fullName || "admin";

  modalBody.innerHTML = `
    <div class="d-flex flex-column flex-md-row align-items-center">
    <!-- Book cover -->
    <div class="me-md-4 mb-3 mb-md-0">
        <img src="${cover}" alt="Book Cover" class="img-fluid rounded" style="max-width: 150px;">
    </div>

    <!-- Book details -->
    <div>
        <h5 class="fw-bold mb-2">${title}</h5>
        <p class="mb-1"><strong>Author:</strong> ${author}</p>
        <p class="mb-1"><strong>Description:</strong> ${description}</p>
        <p class="mb-1"><strong>Price:</strong> $${price}</p>
        <p class="mb-1"><strong>Seller:</strong> ${sellerName}</p>
        <p class="mb-1"><strong>Status:</strong> 
        <span class="badge bg-${statusColor(product.active)}">
        ${
          product.active === 2
            ? "approved"
            : product.active === 1
            ? "pending"
            : "rejected"
        }
      </span>
        </p>
    </div>
</div>

    `;
}

function populateFooter(modal, footer, product) {
  if (product.active === 1) {
    const approveBtn = createButton(
      "Approve",
      "btn btn-success btn-sm approve-btn"
    );
    approveBtn.addEventListener("click", function () {
      changeStatus(product.id, 2);
      modal.hide();
    });
    footer.appendChild(approveBtn);

    const rejectBtn = createButton(
      "Reject",
      "btn btn-warning btn-sm reject-btn"
    );
    rejectBtn.addEventListener("click", function () {
      changeStatus(product.id, 0);
      modal.hide();
    });
    footer.appendChild(rejectBtn);
  }

  const deleteBtn = createButton("Delete", "btn btn-danger btn-sm delete-btn");
  deleteBtn.addEventListener("click", function () {
    deleteProduct(product.id);
    modal.hide();
  });
  footer.appendChild(deleteBtn);

  // close button.
  const closeBtn = createButton("Close", "btn btn-secondary btn-sm", [
    "data-bs-dismiss",
    "modal",
  ]);
  footer.appendChild(closeBtn);
}

function createButton(content, className, attr = []) {
  const btn = document.createElement("button");
  btn.className = className;
  if (attr.length > 0) btn.setAttribute(attr[0], attr[1]);
  btn.textContent = content;
  return btn;
}

function applyTableActions() {
  const tableBody = document.getElementById("products-body");
  tableBody.addEventListener("click", function (event) {
    const target = event.target;
    const row = target.closest("tr");
    if (!row) return;

    const productId = row.dataset.id;
    console.log(productId);

    if (target.classList.contains("approve-btn")) {
      changeStatus(productId, 2);
    } else if (target.classList.contains("reject-btn")) {
      changeStatus(productId, 0);
    } else if (target.classList.contains("delete-btn")) {
      deleteProduct(productId);
    }
  });
}

function applySearch() {
  const searchBox = document.getElementById("search-input");
  searchBox.addEventListener("keyup", filterProducts);
}

function applyFilters() {
  const filterBox = document.getElementById("status-filter");
  filterBox.addEventListener("change", filterProducts);
}

function deleteProduct(id) {
  if (!confirm(`Delete this product permanently`)) return;

  removeById("products", id);
  filterProducts();
}

function changeStatus(id, newStatus) {
  if (!confirm(`Are you sure you want to mark this products as ${newStatus}?`))
    return;

  let products = read("products");
  const index = products.findIndex((p) => p.id === id);
  if (index !== -1) {
    products[index].active = newStatus;
  }
  write("products", products);
  filterProducts();
}

function filterProducts() {
  const filter = document.getElementById("status-filter").value;
  const searchedTitle = document
    .getElementById("search-input")
    .value.toLowerCase();

  let products = read("products"); // => [{}, {}, ...]

  if (filter !== "all") {
    console.log(Number(filter));
    products = products.filter((p) => p.active === Number(filter));
  }
  if (searchedTitle) {
    products = products.filter((p) =>
      p.title.toLowerCase().includes(searchedTitle)
    );
  }

  renderProducts(products);
}

function statusColor(st) {
  switch (st) {
    case 1:
      return "secondary";
    case 2:
      return "success";
    case 0:
      return "danger";
    default:
      return "light";
  }
}

function renderProducts(list) {
  const tbody = document.getElementById("products-body");
  tbody.innerHTML = "";
  // console.log(list[list.length-1])
    const sortedList = [...list].reverse();

  sortedList.forEach((product) => {
    const tableRow = document.createElement("tr");
    const id = product.id;
    const title = product.title;
    const cover = product?.covers?.medium || product?.image;
    let sellerName;
    const sellerId = product?.sellerId;

    if (!sellerId) {
      sellerName = "Admin";
    } else {

      sellerName = findById("bookstoreUsers", sellerId)?.fullName;
    }

    const price = product.price;
    const status = product.active;

    tableRow.dataset.id = id;

    tableRow.innerHTML = `
    <td class="cover"><img src="${cover}" alt="cover of ${title}" style="width:50px; border:0.5px solid black; border-radius:2px;"></td>
    <td class="title">${title}</td>
    <td class="seller">${sellerName}</td>
    <td class="price">$${price}</td>
    <td class="status><span class="badge bg-${statusColor(status)}">${
      product.active === 2
        ? "approved"
        : product.active === 1
        ? "pending"
        : "rejected"
    }</span></td>
    <td class="action">
        <div class="d-flex align-items-center justify-content-around flex-sm-wrap">
            ${
              product.active === 1
                ? `
                <button class="btn btn-sm btn-success shadow-sm me-1 border-dark approve-btn" style="font-size: 0.5rem">Approve</button>
                <button class="btn btn-sm btn-warning shadow-sm me-1 border-dark reject-btn" style="font-size: 0.5rem">Reject</button>
            `
                : ""
            }
            <button class="btn btn-sm btn-danger shadow-sm border-dark delete-btn" style="font-size: 0.5rem">Delete</button>
        </div>
    </td>
`;

    tbody.appendChild(tableRow);
  });
}

function loadProducts() {
  let products = JSON.parse(localStorage.getItem("products") || "[]");

  // Normalize: if no id, use work key or generate one
  products = products.map((p) => {
    if (!p.id) {
      p.id =
        p.keys?.work ||
        p.keys?.edition ||
        "prod_" + Math.random().toString(36).slice(2, 9);
    }
    return p;
  });

  localStorage.setItem("products", JSON.stringify(products));
  renderProducts(products);

  // const products = JSON.parse(localStorage.getItem("products") || []);
  // renderProducts(products);
  filterProducts();
}
