const seedUsers = [
    { id: 'u_1', name: 'Seller One', role: 'seller', active: true },
    { id: 'u_2', name: 'Seller Two', role: 'seller', active: true },
    { id: 'u_99', name: 'Admin', role: 'admin', active: true }
  ];
  
  const seedProducts = [
    { id: 'p_101', title: 'Clean Code', sellerId: 'u_1', price: 20.00, status: 'pending' },
    { id: 'p_102', title: 'JavaScript: The Good Parts', sellerId: 'u_1', price: 15.50, status: 'approved' },
    { id: 'p_103', title: 'Eloquent JavaScript', sellerId: 'u_2', price: 18.75, status: 'rejected' }
  ];
  
  localStorage.setItem('users', JSON.stringify(seedUsers));
  localStorage.setItem('products', JSON.stringify(seedProducts));
  console.log('Seed data added!');
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(seedUsers));
  }
  if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(seedProducts));
  }
  console.log('Seeded (if empty).');
  if (!localStorage.getItem('currentUser')) {
    localStorage.setItem('currentUser', JSON.stringify({ id: 'u_99', name: 'Admin', role: 'admin', active: true }));
  }
    
  