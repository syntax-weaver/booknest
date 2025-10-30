import { sidebarReady } from "./loaders/sidebarLoader.js";
await sidebarReady;
// Load users from localStorage
function getUsers() {
  const users = JSON.parse(localStorage.getItem('bookstoreUsers')) || [];
  return users.filter(user => user.status === "active" || user.status === "inactive");
}

// Load seller requests from localStorage
function getSellerRequests() {
  let users = JSON.parse(localStorage.getItem('bookstoreUsers')) || [];
  let pendingUsers = users.filter(user => user.status === "pending");

  return pendingUsers.length > 0 ? pendingUsers : [];
}

// Render Users Table
function renderUsersTable() {
  const tbody = document.querySelector('#userTable tbody');
  tbody.innerHTML = '';
  const filter = document.getElementById('userFilter').value;
  getUsers().forEach(user => {
    if (filter !== 'all' && user.role !== filter) return;
    const tr = document.createElement('tr');
    tr.setAttribute('data-role', user.role);
    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.fullName}</td>
      <td>${capitalize(user.role)}</td>
      <td class="${user.status === 'active' ? 'status-active' : 'status-inactive'}">${capitalize(user.status)}</td>
      <td class="text-center">
        <button class="btn btn-sm ${user.status === 'active' ? 'btn-warning' : 'btn-success'} toggle-status">
          ${user.status === 'active' ? 'Deactivate' : 'Activate'}
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  bindUserEvents();
}

// Render Seller Requests Table
function renderSellerRequests() {
  const tbody = document.querySelector('#sellerApprovalTable tbody');
  tbody.innerHTML = '';
  getSellerRequests().forEach(req => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td id ="ID">${req.id}</td>
      <td>${req.fullName}</td>
      <td>${capitalize(req.role)}</td>
      <td class="text-center">
        <button class="btn btn-primary btn-sm approve-seller">Approve as Seller</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  bindApprovalEvents();
}

// Toggle Status
function bindUserEvents() {
  document.querySelectorAll('.toggle-status').forEach(btn => {
    btn.addEventListener('click', function () {
      const row = this.closest('tr');
      const userId = row.querySelector('td').textContent;
      console.log(userId)
      let users = getUsers();
      let user = users.find(u => u.id == userId);
      user.status = (user.status === 'active') ? 'inactive' : 'active';
      localStorage.setItem('bookstoreUsers', JSON.stringify(users));
      ////Start Current user Change Status
      let current = JSON.parse(localStorage.getItem("currentUser")) || [];
      if(current.status == 'active'){
        localStorage.removeItem("currentUser");
      }else{
        console.log(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      
      ///End Section 
      renderUsersTable();
    });
  });
}

// Approve Seller
// Approve Seller
function bindApprovalEvents() {
  document.querySelectorAll('.approve-seller').forEach(btn => {
    btn.addEventListener('click', function () {
      const row = this.closest('tr');
      const userId = row.querySelector('td').textContent;

      // Get all users (active, inactive, pending, etc.)
      let allUsers = JSON.parse(localStorage.getItem('bookstoreUsers')) || [];

      // Find the request in allUsers
      let reqIndex = allUsers.findIndex(u => u.id == userId && u.status === "pending");

      if (reqIndex !== -1) {
        // Update request → active seller
        allUsers[reqIndex].role = "seller";
        allUsers[reqIndex].status = "active";
        allUsers[reqIndex].status = "inactive";


        // Save back to localStorage
        localStorage.setItem('bookstoreUsers', JSON.stringify(allUsers));

        // Re-render tables
        renderUsersTable();
        renderSellerRequests();
      }
    });
  });
}

// Utility: Capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Filter event
document.getElementById('userFilter').addEventListener('change', renderUsersTable);

// Initial render
renderUsersTable();
renderSellerRequests();
