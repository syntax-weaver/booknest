// export function setupStickyMainNavbar() {
//     const mainNavBar = document.querySelector('.main-navbar');
//     const heroSection = document.querySelector('.hero-section');

//     const stickyTriggerOffSet = heroSection.offsetHeight;

//     window.addEventListener('scroll', function() {
//         if(window.scrollY >= stickyTriggerOffSet) {
//             mainNavBar.classList.add('sticky-active');
//         } else {
//             mainNavBar.classList.remove('sticky-active');
//         }
//     });
// }

export function setupStickyMainNavbar() {
  const navbar = document.querySelector(".main-navbar");
  const heroSection = document.querySelector(".hero-section");
  navbar.classList.add("position-absolute");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      navbar.classList.add("sticky-active");
      navbar.classList.remove("position-absolute");
      // heroSection.style.marginTop = `${navbar.offsetHeight}px`;
    } else {
      navbar.classList.remove("sticky-active");
      navbar.classList.add("position-absolute");
      // heroSection.style.marginTop = '0';
    }
  });
}
