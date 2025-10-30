// ==========================
// Sidebar Load
// ==========================
import { sidebarReady } from "./loaders/sidebarLoader.js";
await sidebarReady; // Wait for sidebar to load

// ==========================
// Initialize Weekly Charts (Last 7 Days)
// ==========================
const initializeCharts = () => {
  const localData = fetchLocalData(); // Fetch data from LocalStorage
  const orders = localData.order || []; // Orders data
  const users = localData.users || []; // Users data

  // Helper: generate last 7 days as dates
  const getLast7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push(d);
    }
    return days;
  };

  // Last 7 days setup
  const last7Days = getLast7Days();
  const labels = last7Days.map((d) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  );
  const last7Keys = last7Days.map((d) => d.toISOString().split("T")[0]);

  // Arrays for data
  const salesPerDay = new Array(7).fill(0);
  const usersPerDay = new Array(7).fill(0);
  const sellersPerDay = new Array(7).fill(0);

  // Calculate sales per day
  orders.forEach((order) => {
    if (!order.order_date || !order.book_info) return;
    const date = new Date(order.order_date);
    const dateKey = date.toISOString().split("T")[0];
    const dayIndex = last7Keys.indexOf(dateKey);
    if (dayIndex === -1) return; // skip if not in last 7 days

    const totalOrderPrice = order.book_info.reduce(
      (sum, book) => sum + (parseFloat(book.price) || 0),
      0
    );
    salesPerDay[dayIndex] += totalOrderPrice;
  });

  // Count new users and sellers by day
  users.forEach((user) => {
    if (!user.createdAt) return;
    const date = new Date(user.createdAt);
    const dateKey = date.toISOString().split("T")[0];
    const dayIndex = last7Keys.indexOf(dateKey);
    if (dayIndex === -1) return; // skip if not in last 7 days

    if (user.role === "seller") {
      sellersPerDay[dayIndex] += 1;
    } else {
      usersPerDay[dayIndex] += 1;
    }
  });

  // Sales Chart (Line)
  const salesCanvas = document.getElementById("salesChart");
  if (salesCanvas) {
    new Chart(salesCanvas.getContext("2d"), {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Sales (Last 7 Days)",
            data: salesPerDay,
            backgroundColor: "rgba(67, 97, 238, 0.1)",
            borderColor: "#4361ee",
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: "#f0f0f0" } },
          x: { grid: { display: false } },
        },
      },
    });
  }

  // Users Chart (Bar)
  const usersCanvas = document.getElementById("usersChart");
  if (usersCanvas) {
    new Chart(usersCanvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "New Users",
            data: usersPerDay,
            backgroundColor: "#4895ef",
            borderRadius: 6,
          },
          {
            label: "New Sellers",
            data: sellersPerDay,
            backgroundColor: "#3f37c9",
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
            labels: { usePointStyle: true, pointStyle: "circle" },
          },
        },
        scales: {
          y: { beginAtZero: true, grid: { color: "#f0f0f0" } },
          x: { grid: { display: false } },
        },
      },
    });
  }
};

// ==========================
// LocalStorage Keys
// ==========================
const STORAGE_KEYS = {
  ADMINS: "bookstoreAdmins",
  USERS: "bookstoreUsers",
  CURRENT_USER: "currentUser",
  ORDER: "order",
  ORDER_SUMMARY: "orderSummary",
  PRODUCTS: "products",
};

// ==========================
// Fetch Local Data
// ==========================
const fetchLocalData = () => {
  try {
    return {
      admins: JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMINS) || "[]"),
      users: JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]"),
      currentUser: JSON.parse(
        localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || "{}"
      ),
      order: JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDER) || "[]"),
      orderSummary: JSON.parse(
        localStorage.getItem(STORAGE_KEYS.ORDER_SUMMARY) || "[]"
      ),
      products: JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || "[]"),
    };
  } catch (error) {
    console.error("Error parsing localStorage data:", error);
    return {
      admins: [],
      users: [],
      currentUser: {},
      order: [],
      orderSummary: [],
      products: [],
    };
  }
};

// ==========================
// Update Stat Cards
// ==========================
const updateStatCard = (index, value) => {
  const card = document.querySelector(`.stat-card:nth-child(${index})`);
  if (card) card.querySelector(".number").textContent = value;
};

// ==========================
// Update Notifications Badge
// ==========================
const updateUnreadNotificationsBadge = (notifications) => {
  const badge = document.querySelector(".notifications .badge");
  const bellIcon = document.querySelector(".notifications i");

  if (!badge || !bellIcon) return;

  const unreadCount = notifications.filter((n) => n.isNew).length;
  badge.textContent = unreadCount;
  badge.style.display = unreadCount > 0 ? "flex" : "none";
  bellIcon.classList.toggle("ringing", unreadCount > 0);
};

// ==========================
// Render Notifications
// ==========================
const renderNotifications = (list) => {
  const container = document.getElementById("notificationsList");
  if (!container) return;
  container.innerHTML = list.length
    ? ""
    : "<p class='no-notifications'>No new notifications</p>";

  list.slice(0, 3).forEach((notification) => {
    const el = document.createElement("div");
    el.className = "notification";
    el.innerHTML = `
            <div class="notification-avatar">
                <i class="${notification.icon || "fas fa-bell"}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">
                    ${notification.title || ""}
                    ${
                      notification.isNew ? '<span class="badge">New</span>' : ""
                    }
                </div>
                <div class="notification-message">${
                  notification.message || ""
                }</div>
                <div class="notification-time">
                    <i class="far fa-clock"></i> ${notification.time || ""}
                </div>
            </div>`;
    container.appendChild(el);
  });
};

// ==========================
// New Users Notifications
// ==========================
const appendNewUsersNotifications = (users) => {
  const list = document.getElementById("notificationsList");
  if (!list) return;

  const newUsers = users
    .filter((u) => u.role !== "seller" && u.status === "active")
    .slice(0, 3);

  newUsers.forEach((user) => {
    const userName = user.name || user.fullName || "Unknown User";
    const userEmail = user.email || "No email";
    const joinTime = new Date(user.joinDate || user.createdAt || Date.now());
    const timeText = formatTimeDifference(joinTime);

    const el = document.createElement("div");
    el.className = "notification";
    el.innerHTML = `
            <div class="notification-avatar"><i class="fas fa-user"></i></div>
            <div class="notification-content">
                <div class="notification-title">
                    New User ${
                      user.isNew !== false
                        ? '<span class="badge">New</span>'
                        : ""
                    }
                </div>
                <div class="notification-message">${userName} (${userEmail}) has registered.</div>
                <div class="notification-time"><i class="far fa-clock"></i> ${timeText}</div>
            </div>`;
    list.appendChild(el);
  });
};

// ==========================
// Approved Sellers Notifications
// ==========================
const appendApprovedSellersNotifications = (users) => {
  const list = document.getElementById("notificationsList");
  if (!list) return;

  const newSellers = users
    .filter((u) => u.role === "seller" && u.status === "active")
    .slice(0, 3);

  newSellers.forEach((seller) => {
    const sellerName = seller.name || seller.fullName || "Unknown Seller";
    const sellerEmail = seller.email || "No email";
    const joinTime = new Date(
      seller.createdAt || seller.joinDate || Date.now()
    );
    const timeText = formatTimeDifference(joinTime);

    const el = document.createElement("div");
    el.className = "notification";
    el.innerHTML = `
            <div class="notification-avatar"><i class="fas fa-user-tie"></i></div>
            <div class="notification-content">
                <div class="notification-title">
                    New Seller ${
                      seller.isNew !== false
                        ? '<span class="badge">New</span>'
                        : ""
                    }
                </div>
                <div class="notification-message">${sellerName} (${sellerEmail}) has been approved as a seller.</div>
                <div class="notification-time"><i class="far fa-clock"></i> ${timeText}</div>
            </div>`;
    list.appendChild(el);
  });
};

// ==========================
// Pending Sellers Notifications
// ==========================
const appendPendingSellersNotifications = (users) => {
  const list = document.getElementById("notificationsList");
  if (!list) return;

  const pendingSellers = users
    .filter((u) => u.role === "seller" && u.status === "pending")
    .slice(0, 3);

  pendingSellers.forEach((seller) => {
    const sellerName = seller.name || seller.fullName || "Unknown Seller";
    const sellerEmail = seller.email || "No email";
    const joinTime = new Date(
      seller.createdAt || seller.joinDate || Date.now()
    );
    const timeText = formatTimeDifference(joinTime);

    const el = document.createElement("div");
    el.className = "notification";
    el.innerHTML = `
            <div class="notification-avatar"><i class="fas fa-user-clock"></i></div>
            <div class="notification-content">
                <div class="notification-title">&nbsp;
                    Pending Seller ${
                      seller.isNew !== false
                        ? '<span class="badge">New</span>'
                        : ""
                    }
                </div>
                <div class="notification-message">${sellerName} (${sellerEmail}) is waiting for approval.</div>
                <div class="notification-time"><i class="far fa-clock"></i> ${timeText}</div>
            </div>`;
    list.appendChild(el);
  });
};

// ==========================
// Books Notifications
// ==========================
const appendBooksNotifications = (books, status, titleText) => {
  const list = document.getElementById("notificationsList");
  if (!list) return;

  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");

  const filteredBooks = books
    .filter((b) => b.active === status)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3);

  filteredBooks.forEach((book) => {
    const bookName = book.title || "Unknown Book";
    const bookPrice = book.price ? `$${book.price}` : "Unknown price";
    const createdAt = new Date(book.createdAt || Date.now());
    const timeText = formatTimeDifference(createdAt);

    const seller = users.find((u) => u.id === book.sellerId);
    const sellerEmail = seller ? seller.email : "Unknown Email";

    const el = document.createElement("div");
    el.className = "notification";
    el.innerHTML = `
            <div class="notification-avatar"><i class="fas fa-book"></i></div>
            <div class="notification-content">
                <div class="notification-title">
                    ${titleText} ${
      book.isNew !== false ? '<span class="badge">New</span>' : ""
    }
                </div>
                <div class="notification-message">${bookName} by ${sellerEmail} priced at ${bookPrice}</div>
                <div class="notification-time"><i class="far fa-clock"></i> ${timeText}</div>
            </div>`;
    list.appendChild(el);
  });
};

// ==========================
// Format Time Difference
// ==========================
const formatTimeDifference = (date) => {
  if (!date || isNaN(date.getTime())) return "Just now";
  const now = new Date();
  const diffMs = now - date;
  if (diffMs < 60_000) return "Just now";
  if (diffMs < 3_600_000) return `${Math.floor(diffMs / 60_000)} minutes ago`;
  if (diffMs < 86_400_000) return `${Math.floor(diffMs / 3_600_000)} hours ago`;
  return `${Math.floor(diffMs / 86_400_000)} days ago`;
};

// ==========================
// Update Orders Table
// ==========================
const updateOrdersTable = (orders) => {
  const tbody = document.getElementById("ordersTbody");
  if (!tbody) return;

  tbody.innerHTML = orders.length
    ? ""
    : "<tr><td colspan='7' class='no-orders'>No recent orders</td></tr>";

  const parseDate = (dateStr) => (dateStr ? new Date(dateStr) : new Date(0));

  orders
    .slice()
    .sort((a, b) => parseDate(b.order_date) - parseDate(a.order_date))
    .slice(0, 3)
    .forEach((order, index) => {
      if (order.book_info && Array.isArray(order.book_info)) {
        order.book_info.forEach((book) => {
          tbody.innerHTML += `
                        <tr>
                            <td>${index + 1}</td>
                            <td><img src="${
                              book.covers?.large || ""
                            }" alt="" width="50"> ${book.title || "N/A"}</td>
                            <td>${order.form_info?.inputFName || "N/A"} ${
            order.form_info?.inputLName || "N/A"
          }</td>
                            <td>${order.order_date || "N/A"}</td>
                            <td>${order.user_info?.[0]?.fullName || "N/A"}</td>
                            <td><span class="badge bg-info">${
                              order.status || "Processing"
                            }</span></td>
                        </tr>
                    `;
        });
      }
    });
};

// ==========================
// Update Books Table
// ==========================
const updateBooksTable = (products) => {
  const tbody = document.querySelector("#booksTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  const parseDate = (dateStr) => (dateStr ? new Date(dateStr) : new Date(0));

  products
    .filter((p) => p.active == 2)
    .slice()
    .sort((a, b) => parseDate(b.createdAt) - parseDate(a.createdAt))
    .slice(0, 3)
    .forEach((book, index) => {
      tbody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td><img src="${
                      book.covers?.large || ""
                    }" alt="" width="50"> ${book.title || "N/A"}</td>
                    <td>${
                      book.authors?.map((a) => a.name).join(", ") || "N/A"
                    }</td>
                    <td>${book.price || "N/A"}</td>
                    <td>${book.stock || 0}</td>
                    <td>${book.createdAt || "N/A"}</td>
                </tr>
            `;
    });
};

// ==========================
// Update Dashboard
// ==========================
const updateDashboardWithLocalData = () => {
  const localData = fetchLocalData();

  const sellersCount = localData.users.filter(
    (u) => u.role === "seller" && u.status === "active"
  ).length;
  const usersCount = localData.users.filter(
    (u) => u.role !== "seller" && u.status === "active"
  ).length;
  const pendingBooksCount = localData.products.filter(
    (b) => b.active === 1
  ).length;
  const approvedBooksCount = localData.products.filter(
    (b) => b.active === 2
  ).length;

  updateStatCard(1, sellersCount);
  updateStatCard(2, usersCount);
  updateStatCard(3, pendingBooksCount);
  updateStatCard(4, approvedBooksCount);

  const notificationsList = document.getElementById("notificationsList");
  if (notificationsList) notificationsList.innerHTML = "";

  const allNotifications = [];

  const newUsers = localData.users
    .filter((u) => u.role !== "seller" && u.status === "active")
    .slice(0, 3);
  newUsers.forEach((u) =>
    allNotifications.push({
      title: "New User",
      message: `${u.name || u.fullName} registered`,
      isNew: u.isNew !== false,
    })
  );

  const pendingSellers = localData.users
    .filter((u) => u.role === "seller" && u.status === "pending")
    .slice(0, 3);
  pendingSellers.forEach((s) =>
    allNotifications.push({
      title: "Pending Seller",
      message: `${s.name || s.fullName} is waiting approval`,
      isNew: s.isNew !== false,
    })
  );

  const approvedSellers = localData.users
    .filter((u) => u.role === "seller" && u.status === "active")
    .slice(0, 3);
  approvedSellers.forEach((s) =>
    allNotifications.push({
      title: "New Seller",
      message: `${s.name || s.fullName} approved`,
      isNew: s.isNew !== false,
    })
  );

  const pendingBooks = localData.products
    .filter((b) => b.active === 1)
    .slice(0, 3);
  pendingBooks.forEach((b) =>
    allNotifications.push({
      title: "Pending Book",
      message: `${b.title} pending approval`,
      isNew: b.isNew !== false,
    })
  );

  const approvedBooks = localData.products
    .filter((b) => b.active === 2)
    .slice(0, 3);
  approvedBooks.forEach((b) =>
    allNotifications.push({
      title: "Approved Book",
      message: `${b.title} approved`,
      isNew: b.isNew !== false,
    })
  );

  appendNewUsersNotifications(localData.users);
  appendPendingSellersNotifications(localData.users);
  appendApprovedSellersNotifications(localData.users);
  appendBooksNotifications(localData.products, 1, "Pending Book");
  appendBooksNotifications(localData.products, 2, "Approved Book");

  updateUnreadNotificationsBadge(allNotifications);

  updateOrdersTable(localData.order);
  updateBooksTable(localData.products);
};

// ==========================
// Initialize Page
// ==========================
const initializePage = () => {
  initializeCharts();
  updateDashboardWithLocalData();
};

// Update dashboard when LocalStorage changes
window.addEventListener("storage", (event) => {
  if (Object.values(STORAGE_KEYS).includes(event.key)) {
    updateDashboardWithLocalData();
  }
});

// Expose dashboard functions
window.DASH = {
  refresh: updateDashboardWithLocalData,
  fetchData: fetchLocalData,
};

initializePage();

// ==========================
// Get Pending Books
// ==========================
const getPendingBooks = () => {
  const localData = fetchLocalData();
  return localData.products.filter((p) => p.active === 1);
};

// ==========================
// Mark Notifications as Read
// ==========================
const bellIconWrapper = document.querySelector(".notifications");
if (bellIconWrapper) {
  bellIconWrapper.addEventListener("click", () => {
    document
      .querySelectorAll("#notificationsList .notification .badge")
      .forEach((badge) => {
        if (badge.textContent.trim() === "New") {
          badge.remove();
        }
      });

    const badge = document.querySelector(".notifications .badge");
    if (badge) {
      badge.textContent = "0";
      badge.style.display = "none";
    }

    let data = fetchLocalData();
    let updatedUsers = data.users.map((u) => ({ ...u, isNew: false }));
    let updatedProducts = data.products.map((p) => ({ ...p, isNew: false }));

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
    localStorage.setItem(
      STORAGE_KEYS.PRODUCTS,
      JSON.stringify(updatedProducts)
    );
  });
}
