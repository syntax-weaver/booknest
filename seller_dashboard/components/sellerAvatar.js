import { findById } from "./storage.js";

export function sellerAvatar() {
    const current = JSON.parse(localStorage.getItem('currentUser'));
    // console.log(current);
    if(current) {
        document.getElementById('seller-name').textContent = current.fullName;
        // document.getElementById('seller-image').src = findById('users', current.id).profileImage;
    }
}