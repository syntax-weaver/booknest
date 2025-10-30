export function setupAccountIcon() {
  const accountLabel = document.getElementById("user-account");
  const dropdownMenu = document.getElementById("dropdown-menu");
  const currentUser = localStorage.getItem("currentUser");

  dropdownMenu.innerHTML = ""; // clear old items

  if (!currentUser) {
    accountLabel.textContent = "Sign up or Login";

    const parentLink = accountLabel.parentNode;
    parentLink.className = "nav-link";
    parentLink.addEventListener("click", () => {
      window.location.href = "log_reg.html";
    });
  } else {
    const user = JSON.parse(currentUser);
    accountLabel.textContent = `Welcome ${user.fullName}`;

    // ensure account wrapper has correct bootstrap classes
    const accountWrapper = document.getElementById("account");
    accountWrapper.classList.add(
      "dropdown",
      "d-flex",
      "flex-column",
      "justify-content-center",
      "align-items-center"
    );

    // logout item
    const logoutItem = document.createElement("a");
    logoutItem.className = "dropdown-item";
    logoutItem.textContent = "Logout";
    logoutItem.addEventListener("click", () => {
      localStorage.removeItem("fav");
      localStorage.removeItem("cart");
      localStorage.removeItem("currentUser");
      window.location.href = "/user/home.html";
    });

    dropdownMenu.appendChild(logoutItem);
  }
}
