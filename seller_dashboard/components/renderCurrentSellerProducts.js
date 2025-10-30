import { read, write, findById, saveOrUpdate, removeById } from "./storage.js";

export function renderProducts() {
  const current = JSON.parse(localStorage.getItem("currentUser") || "");
  // console.log('current user data: ', current);
  // if(!current || current.role !== 'seller') return location.href = '../../index.html';

  const products = read("products").filter((p) => p?.sellerId == current.id);
  // console.log('all products of the current seller: ', products);

  const container = document.getElementById("products-table-container");

  if (products.length === 0) {
    container.innerHTML = `<p>No products yet. Click Add Product.</p>`;
    return;
  }

  let html = `
        <table class="table table-responsive table-striped">
            <thead>
                <tr>
                    <th>Book</th>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

  products.forEach((p) => {
    html += `
        <tr data-id="${p.id}">
            <td style="vertical-align:middle;"><img src="${
              p.covers.large
            }" style="width:50px; border:0.5px solid black; border-radius:2px;"/></td>
            <td  style="vertical-align:middle;">${p.title} <br> <small>${
      p.authors[0].name || ""
    }</small></td>
            <td  style="vertical-align:middle;">$${p.price}</td>
            <td  style="vertical-align:middle;">${p.stock}</td>
            <td  style="vertical-align:middle;">
                <button class="btn btn-sm btn-secondary edit-btn shadow-sm border-dark">Edit</button>
                <button class="btn btn-sm btn-danger delete-btn shadow-sm border-dark">Delete</button>
            </td>
        </tr>
        `;
  });

  html += "</tbody></table>";
  container.innerHTML = html;
}
