export function loadWhyChooseUs() {
    const row = document.querySelector('#why-row');

    const benefits = [
        {
            icon: 'fas fa-shipping-fast',
            title: 'Free & Fast Delivery',
            description: 'Get your favorite books delivered to your doorstep in record time — for free on all orders.'
        },
        {
            icon: 'fas fa-book-open',
            title: 'Curated Collections',
            description: 'Handpicked titles from bestsellers to hidden gems, ensuring quality in every read.'
        },
        {
            icon: 'fas fa-lock',
            title: 'Secure Payments',
            description: 'Your data and transactions are protected with top-grade security measures.'
        },
        {
            icon: 'fas fa-headset',
            title: '24/7 Customer Support',
            description: 'Our friendly team is here to help you anytime, anywhere.'
        }
    ];

    row.innerHTML = '';

    benefits.forEach(benefit => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-3 mb-4';
        col.innerHTML = `
            <div class="why-card text-center p-4 h-100 shadow-sm rounded">
                <div class="why-icon mb-3"><i class="${benefit.icon} fa-2x"></i></div>
                <h5 class="why-card-title mb-2">${benefit.title}</h5>
                <p class="why-card-subtitle text-muted small">${benefit.description}</p>
            </div>
        `;
        row.appendChild(col);
    });


}