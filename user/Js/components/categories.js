export async function renderCategories() {
    const slider = document.querySelector('.cat-slider');
    slider.innerHTML = '';

    const categories = [
        { name: "Fiction", image: "../../Assets/images/fiction.jpg" },
        { name: "Non-Fiction", image: "../../Assets/images/non-fiction.jpg" },
        { name: "Mystery & Thriller", image: "../../Assets/images/mystery_and_thriller.jpg" },
        { name: "Fantasy", image: "../../Assets/images/science-fiction_and_fantasy.jpg" },
        { name: "Romance", image: "../../Assets/images/romance.jpg" },
        { name: "Biographies & Memoirs", image: "../../Assets/images/biographies_and_memoirs.jpg" }, 
        { name: "Self-Help & Personal Dev.", image:  "../../Assets/images/self_helping_and_personal_dev.jpg"}, 
        { name: "Children’s Books", image:  "../../Assets/images/children's_books.jpg"}, 
        { name: "History", image:  "../../Assets/images/history.jpg"}, 
        { name: "Educational & Academic", image: "../../Assets/images/educational_and_academic.jpg" }, 
    ];
// ---------------------------------------------------------------------------------------
    const catDropDown = document.getElementById('cat-drop-down');
    catDropDown.innerHTML = '';
    let catHtml = ``;
    categories.slice(0, 4).forEach(cat => {
        catHtml += `<li>
        <a
          class="dropdown-item"
          href="productCatalog.html?catagory=${cat.name}"
          >${cat.name}</a>`;
    });
    catDropDown.innerHTML += catHtml;
// ---------------------------------------------------------------------------------------

    for (const category of categories) {
        try {
            slider.style.setProperty('--cat-width', '200px');
            slider.style.setProperty('--cat-height', '100px');
            slider.style.setProperty('--cat-quantity', categories.length);

            const list = document.createElement('div');
            list.className = 'cat-list';
            let html = '';
            let catPosition = 0;
            categories.forEach(cat => {
                catPosition++;
                html += `<div class="cat-item" style="--cat-position: ${catPosition}" data-cat="${cat.name}"><img src= ${cat.image} alt=""><p class="cat-name">${cat.name}</p></div>`;
            });
            list.innerHTML = html;
            slider.appendChild(list);

            // add click listeners
            list.querySelectorAll('.cat-item').forEach(item => {
                item.addEventListener('click', function() {
                    const cat = this.dataset.cat;
                    window.location.href = `productCatalog.html?catagory=${encodeURIComponent(cat)}`;
                });
            });
            

            


        } catch(error) {
            console.error(`Failed to load category ${category.name}: `, error);
        }
    }


}