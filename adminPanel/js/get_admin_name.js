const currentAdmin = JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser"));

const adminNameElement = document.getElementById("adminName");
if (adminNameElement) {
    if (currentAdmin && currentAdmin.role === "admin") {
        adminNameElement.innerHTML = `
            <h4>${currentAdmin.fullName || "Admin"}</h4>
            <span>System Admin</span>
        `;
    } else {
        adminNameElement.innerHTML = `
            <h4>Admin not defined</h4>
            <span>System Admin</span>
        `;
    }
}