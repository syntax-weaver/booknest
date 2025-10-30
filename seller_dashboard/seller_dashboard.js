import { generateUniqueId } from "./components/uniqueIdGenerator.js";
import { renderProducts } from "./components/renderCurrentSellerProducts.js";
import { editProduct } from "./components/editProduct.js";
import { deleteProduct } from "./components/deleteProduct.js";
import { initProductModal } from "./components/productModal.js";
import { addProduct } from "./components/addProduct.js";
import { sellerAvatar } from "./components/sellerAvatar.js";
import { sidebarReady } from "./components/sidebarLoader/sidebar-loader.js";
await sidebarReady;

initProductModal();
renderProducts();
editProduct();
deleteProduct();
addProduct();
sellerAvatar();
