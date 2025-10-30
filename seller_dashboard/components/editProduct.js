import {read, write, findById, saveOrUpdate, removeById} from './storage.js';
import { populateProductModal, showProductModal } from './productModal.js';

export function editProduct() {
    const container = document.getElementById('products-table-container');
    if(!container) return;

    container.addEventListener('click', function(event) {
        const row = event.target.closest('tr');
        if(!row) return;

        const productId = row.dataset.id;
        
        if(event.target.classList.contains('edit-btn')) {
            const product = findById('products', productId);
            // console.log(product);
            populateProductModal(product);
            showProductModal();
        }
        
    });
    

}