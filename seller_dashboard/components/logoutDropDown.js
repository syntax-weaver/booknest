import { read } from "./storage.js";

export function logoutDropDown() {
    const current = read('currentUser');
    // console.log(current);
    if(current) {
        const userAccountIcon = document.getElementById('user-account');
        // console.log(userAccountIcon);
        userAccountIcon.innerHTML = `
        <div class="dropdown">
            <a class="nav-link text-decoration-none dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">username</a>
            <ul class="dropdown-menu">
                <li><button class="btn btn-small logout-btn">logout</button></li>
                
            </ul>
        </div>
        `;

    }
    const test = document.querySelector('.logout-btn');
    console.log(test);
}