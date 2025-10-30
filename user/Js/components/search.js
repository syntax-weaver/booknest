export function setupSearchComponents() {
    const searchWrappers = document.querySelectorAll('.search-wrapper');

    searchWrappers.forEach(wrapper => {
        const toggle = wrapper.querySelector('.search-toggle');
        const input = wrapper.querySelector('.search-input');

        toggle.addEventListener('click', function() {
            input.classList.toggle('show');
            if(input.classList.contains('show')) {
                input.focus();
            } else {
                input.blur();
            }
        });

        // click outside to close.
        document.addEventListener('click', function(e) {
            if(!wrapper.contains(e.target)) {
                input.classList.remove('show');
                input.blur();
            }
        });

        // press Esc to close.
        document.addEventListener('keydown', function(e) {
            if(e.key === 'Escape') {
                input.classList.remove('show');
                input.blur();
            }
        });
    });
}