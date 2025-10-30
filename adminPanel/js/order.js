import { sidebarReady } from "./loaders/sidebarLoader.js";
await sidebarReady;
let orderinfo = JSON.parse(localStorage.getItem("order")) || [];

let tableInfo = document.getElementById("table-info");

orderinfo.forEach((order, index) => {
  order.book_info.forEach((book) => {
    tableInfo.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td><img src="${
                  book.covers?.large || ""
                }" alt="" width="50">  ${book.title || "N/A"}</td>
                <td>${order.form_info.inputFName || "N/A"} ${
      order.form_info.inputLName || "N/A"
    }</td>
                <td>${order.order_date}</td>
                <td>${order.user_info[0].fullName}" </td>
                <td><span class="badge bg-info">Processing</span></td>
                <td><a href="#" data-bs-toggle="modal" data-bs-target="#orderDetailsModal" data-bs-index="${index}" class="view-details">Details</a></td>
            </tr>
        `;
  });
});
