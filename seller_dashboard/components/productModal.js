import { saveOrUpdate, findById } from "./storage.js";
import { renderProducts } from "./renderCurrentSellerProducts.js";
import { generateUniqueId } from "./uniqueIdGenerator.js";

let bsModal = null;

export function initProductModal() {
    const el = document.getElementById('product-modal');
    bsModal = new bootstrap.Modal(el);

    // live preview when image url changes.
    const imgInput = document.getElementById('prod-image'); //url input
    const imgPrev = document.getElementById('prod-image-preview'); // img tag
    imgInput.addEventListener('input', () => {
        imgPrev.src = imgInput.value || '';
    });

    // handle save.
    const form = document.getElementById('product-form');
    form.addEventListener('submit', onSubmit);
}

export function populateProductModal(product) {
    // set fields.
    setVal('prod-id', product.id);
    setVal('prod-title', product.title);
    setVal('prod-author', product.authors[0].name || '');
    setVal('prod-price', product.price ?? 0);
    setVal('prod-stock', product.stock ?? 0);
    setVal('prod-image', product.covers.small || '');  // url
    setVal('prod-desc', product.description || '');
    document.getElementById('prod-visible').checked = !!product.visible;

    // preview image.
    const imgPrev = document.getElementById('prod-image-preview');  /// img tag
    imgPrev.src = product.image || '';  
}

export function showProductModal() {
    // console.log(bsModal? true: false);
    bsModal?.show();
}

export function hideProductModal() {
    bsModal?.hide();
}

// ========================================== helpers =============================================
function setVal(id, v) {
    document.getElementById(id).value = v;
}

function getVal(id) {
    return document.getElementById(id).value;
}

function onSubmit(e) {
    e.preventDefault();

    const current = JSON.parse(localStorage.getItem('currentUser') || "null");

    const id = getVal('prod-id');
    const existing = findById('products', id); // the product to be edited

    const updated = {
        id, 
        sellerId: existing?.sellerId || current?.id,
        title: getVal('prod-title').trim(),
        authors: [
            {
                key: generateUniqueId('author'),
                name: getVal('prod-author').trim()
            }
        ], 
        price: parseFloat(getVal('prod-price')) || 0, 
        stock: parseInt(getVal('prod-stock')) || 0, 
        covers: {
            large: getVal('prod-image').trim(), 
            medium: getVal('prod-image').trim(), 
            small: getVal('prod-image').trim()
        }, 
        description: getVal('prod-desc').trim(), 
        visible: document.getElementById('prod-visible').checked, 
        active: 1, 
        createdAt: existing?.createdAt || new Date().toISOString()
    };

    console.log('saving product', updated);
    saveOrUpdate('products', updated);
    hideProductModal();
    renderProducts();
}