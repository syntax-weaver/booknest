export function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

export function requireAdmin() {
    const user = getCurrentUser();
    if(!user || !user.active) {
        // window.location.href = 'login.html';
    } else if(user.role !== 'admin') {
        window.location.href = '../index.html';
    }
}