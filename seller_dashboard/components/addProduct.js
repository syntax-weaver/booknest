import { populateProductModal, showProductModal } from "./productModal.js";
import { generateUniqueId } from "./uniqueIdGenerator.js";

export function addProduct() {
    const addBtn = document.getElementById('add-product-button')
    console.log(addBtn)
    addBtn.addEventListener('click', () => {
        
        populateProductModal({
            id: generateUniqueId(),
            sellerId: '',
            title: '',
            authors: [
                {
                    key: '', 
                    name: ''
                }
            ],
            price: 0,
            stock: 0,
            category: '',
            covers: {
                large: '', 
                medium: '', 
                small: ''
            },
            description: '',
            visible: true,
            active: 1, 
            createdAt: new Date().toISOString()
        });
        showProductModal();
    });
}