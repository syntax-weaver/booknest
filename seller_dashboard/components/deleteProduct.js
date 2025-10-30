import {read, write, findById, saveOrUpdate, removeById} from './storage.js';
import { renderProducts } from './renderCurrentSellerProducts.js';

export function deleteProduct() {
    const container = document.getElementById('products-table-container');
    if(!container) return;

    container.addEventListener('click', function(event) {
        const row = event.target.closest('tr');
        if(!row) return;

        const productId = row.dataset.id;
        
        if(event.target.classList.contains('delete-btn')) {
            if(!confirm('Delete product?')) return;
            removeById('products', productId);
            renderProducts();
        }
    });
}

