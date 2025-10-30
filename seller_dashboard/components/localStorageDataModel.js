seedUsers = [
    {
        "id": "u_seller_1",
        "name": "xxxx Seller",
        "email": "ali@example.com",
        "role": "seller",
        "passwordHash": "...", 
        "storeName": "AliBooks",
        "profileImage": "../images/book1.jpg"
    }, 

];

seedProducts = [
    {
        "id": "p_001",
        "sellerId": "u_seller_1",
        "title": "Eloquent JS",
        "author": "Marijn H.",
        "price": 29.99,
        "stock": 10,
        "category": "Programming",
        "image": "../images/book1.jpg",
        "description": "Great JS book",
        "visible": true,
        "status": 'pending', 
        "createdAt": "2025-08-10T12:34:00Z"
    },
    {
        "id": "p_002",
        "sellerId": "u_seller_1",
        "title": "Eloquent JS",
        "author": "Marijn H.",
        "price": 29.99,
        "stock": 10,
        "category": "Programming",
        "image": "../images/book2.jpg",
        "description": "Great JS book",
        "visible": true,
        "status": 'pending',
        "createdAt": "2025-08-11T12:34:00Z"
    },
    {
        "id": "p_003",
        "sellerId": "u_seller_1",
        "title": "Eloquent JS",
        "author": "Marijn H.",
        "price": 29.99,
        "stock": 10,
        "category": "Programming",
        "image": "../images/book3.jpg",
        "description": "Great JS book",
        "visible": true,
        "status": 'pending',
        "createdAt": "2025-08-12T12:34:00Z"
    },
    {
        "id": "p_004",
        "sellerId": "u_seller_1",
        "title": "Eloquent JS",
        "author": "Marijn H.",
        "price": 29.99,
        "stock": 10,
        "category": "Programming",
        "image": "../images/book4.jpg",
        "description": "Great JS book",
        "visible": true,
        "status": 'pending',
        "createdAt": "2025-08-13T12:34:00Z"
    }
];

seedOrders = 
    {
        "id": "o_1001",
        "customerId": "u_customer_1",
        "items": [
          {"productId":"p_001","title":"Eloquent JS","price":29.99,"qty":1,"sellerId":"u_seller_1"}
        ],
        "total": 29.99,
        // "shipping": {...},
        "status": "pending", // pending, processing, shipped, delivered, cancelled
        "createdAt":"2025-08-09T17:00:00Z"
    }
;

seedCurrentUser = [
    {
        "id":"u_seller_1",
        "role":"seller",
        "name":"Seller",
        "profileImage": "../images/book1.jpg"
    }
];

localStorage.setItem('users', JSON.stringify(seedUsers));
localStorage.setItem('products', JSON.stringify(seedProducts));
localStorage.setItem('orders', JSON.stringify(seedOrders));
localStorage.setItem('currentUser', JSON.stringify(seedCurrentUser));

console.log('Seed data added!');

if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify(seedUsers));
}
if (!localStorage.getItem('products')) {
  localStorage.setItem('products', JSON.stringify(seedProducts));
}
if (!localStorage.getItem('orders')) {
  localStorage.setItem('orders', JSON.stringify(seedOrders));
}
if (!localStorage.getItem('currentUser')) {
  localStorage.setItem('currentUser', JSON.stringify(seedCurrentUser));
}
console.log('Seeded (if empty).');


  
