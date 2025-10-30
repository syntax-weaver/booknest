export async function loadHTMl(id, path) {
  const targetElement = document.querySelector(`#${id}`);
  if (!targetElement) throw new Error(`missing sidebar element in your file`);
  const res = await fetch(path, { cache: "no-cache" });
  if (!res.ok) throw new Error(`missing sidebar file`);
  const html = await res.text();
  targetElement.innerHTML = html;
  document
    .getElementById("sidebar-toggle")
    .addEventListener("click", toggleSidebar);
  setActive();
  return targetElement;
}

export const sidebarReady = await loadHTMl(
  "sidebar",
  "/seller_dashboard/partials/sidebar.html"
);

function toggleSidebar() {
  const toggleIcon = document.getElementById("sidebar-toggle");
  const sidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main-content");
  const sidebarHeader = document.querySelector(".sidebar-header"); // Add this line
  if (sidebar && mainContent) {
    sidebar.classList.toggle("collapsed");
    mainContent.classList.toggle("collapsed");
    if (sidebarHeader) {
      sidebarHeader.classList.toggle("collapsed"); // Collapse header too
    }
  }
  if (sidebar.classList.contains("collapsed")) {
    toggleIcon.style.transform = "rotate(90deg)";
  } else {
    toggleIcon.style.transform = "rotate(-90deg)";
  }
  toggleIcon.style.transition = "transform 0.3s ease"; // smooth rotation
}
function setActive() {
  // Highlight active link based on current page
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll("a").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active"); // Bootstrap has a built-in "active" class
    } else {
      link.classList.remove("active");
    }
  });
  document.getElementById("logout").addEventListener("click", logout);
}
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "/user/home.html";
}
