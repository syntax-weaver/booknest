let orders = JSON.parse(localStorage.getItem("order")) || [];
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("view-details")) {
    let orderIndex = e.target.getAttribute("data-bs-index");
    let order = orders[orderIndex];

    // Target modal body
    // -----------------------
    let modalBody = document.querySelector("#orderDetailsModal .modal-body");
    // to clear old content
    modalBody.innerHTML = "";

    // Order Items
    // -----------------------
    order.book_info.forEach((book) => {
      let bookPrice = parseFloat(book.price) || 0;
      let bookQty = parseInt(book.quantity) || 1;
      let lineTotal = bookPrice * bookQty;
      modalBody.innerHTML += `
              <div class="d-flex align-items-center border-bottom pb-3 mb-3">
                <img src="${book.covers.large}" alt="${
        book.title
      }" class="rounded me-3" width="60" height="60">
                <div>
                  <div class="fw-semibold">${book.title}</div>
                  <small class="text-muted">by ${
                    book.authors?.map((a) => a.name).join(", ") || "N/A"
                  }</small>
                </div>
                <div class="ms-auto text-end">
                  <div>${book.quantity} pcs</div>
                  <div class="fw-bold">$${lineTotal.toFixed(2)}</div>
                </div>
              </div>
            `;
    });
    // Info Rows
    //-----------------------
    modalBody.innerHTML += `
          <div class="row mb-3">
            <div class="col-md-6">
              <p class="mb-1 text-muted">Created at</p>
              <p>${order.order_date || "N/A"}</p>
            </div>
            <div class="col-md-6">
              <p class="mb-1 text-muted">Delivery Services</p>
              <p>${order.order_delivery || "Standard"}</p>
            </div>
            <div class="col-md-6">
              <p class="mb-1 text-muted">Payment method</p>
              <p>${order.form_info.paymentMethod || "N/A"}</p>
            </div>
            <div class="col-md-6">
              <p class="mb-1 text-muted">Status</p>
              <p class="text-success fw-semibold">${
                order.status || "Processing"
              }</p>
            </div>
          </div>
        `;

    // Customer Info
    // -----------------------
    modalBody.innerHTML += `
          <div class="border-top border-bottom py-3 mb-3">
            <p class="mb-1 text-muted">Customer name</p>
            <p>${order.form_info.inputFName || "N/A"} ${
      order.form_info.inputLName || "N/A"
    }</p>
            <p class="mb-1 text-muted">Email</p>
            <p><a href="#">${order.form_info.inputEmail || "N/A"}</a></p>
            <p class="mb-1 text-muted">Phone</p>
            <p>${order.form_info.inputcontact || "N/A"}</p>
            <p class="mb-1 text-muted">Address</p>
            <p>${order.form_info.inputAddress || "N/A"}</p>
          </div>
        `;

    // Timeline
    // ------------------------
    modalBody.innerHTML += `
          <div class="mb-4">
            <h6 class="fw-semibold">Timeline</h6>
            <ul class="list-unstyled ps-3">
              <li class="mb-3">
                <div class="d-flex align-items-start">
                  <span class="me-2 mt-1 text-primary"><i class="bi bi-circle-fill"></i></span>
                  <div>
                    <strong>${order.order_status || "Processing"}</strong>
                    <p class="text-muted small mb-0">The order is being prepared (products are being packed)</p>
                  </div>
                </div>
              </li>
              <li>
                <div class="d-flex align-items-start">
                  <span class="me-2 mt-1 text-muted"><i class="bi bi-circle"></i></span>
                  <div>
                    <strong>Order Placed</strong>
                    <p class="text-muted small mb-0">Order has been successfully placed by the customer</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        `;
    console.log(order);

    let summary = order.order_summary || {
      subtotal: 0,
      delivery: 0,
      discount: 0,
      total: 0,
    };

    // Payment Summary
    // ---------------------------
    modalBody.innerHTML += `
          <div class="border-top pt-3">
            <h6 class="fw-semibold">Payment</h6>
            <div class="d-flex justify-content-between">
              <span>Subtotal</span>
              <span>$${Number(summary.subtotal).toFixed(2)}</span>
            </div>
            <div class="d-flex justify-content-between">
              <span>Discount</span>
              <span>$${Number(summary.discount).toFixed(2)}</span>
            </div>
            <div class="d-flex justify-content-between fw-bold mt-2">
              <span>Total</span>
              <span>$${Number(summary.total).toFixed(2)}</span>
            </div>
          </div>
        `;
  }
});
