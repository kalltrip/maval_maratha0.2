function fetchJSON(url) {
    return fetch(url)
        .then(response => response.ok ? response.json() : Promise.reject(`Failed to load ${url}`))
        .catch(error => {
            console.error(error);
            return []; // Return empty array to prevent app crash
        });
}

Promise.all([
    fetchJSON("../json/starters_veg.json"),
    fetchJSON("../json/starters_non_veg.json")
]).then(([vegData, nonVegData]) => {
    const startersData = [...vegData, ...nonVegData];
    populatestartersMenu(startersData);
});

function populatestartersMenu(data) {
    const vegContainer = document.getElementById("starters-veg-menu");
    const nonVegContainer = document.getElementById("starters-nonveg-menu");

    if (!vegContainer || !nonVegContainer) {
        console.error("One or more containers (starters-veg-menu, starters-nonveg-menu) not found.");
        return;
    }

    data.forEach(dish => {
        const dishElement = document.createElement("div");
        dishElement.classList.add("dish");

        dishElement.innerHTML = `
            <span class="${dish.veg ? 'vegetarian' : 'non-vegetarian'}">
                ${dish.veg ? 'VEGETARIAN' : 'NON-VEGETARIAN'}
            </span>
            <div class="dish-content">
                <div class="dish-details">
                    <div class="dish-header">
                        <span class="dish-name">${dish.name}</span>
                    </div>
                    <div class="dish-pricing">
                        <span class="dish-price">Rs ${dish.price}</span>
                    </div>
                    <span class="dish-rating">${generateStars(dish.rating)} (${dish.rating})</span>
                    <p>${dish.description}</p>
                </div>
                <img src="${dish.image}" alt="${dish.name}" class="lazy-img" loading="lazy"/>
            </div>
        `;

        // Append to the correct category
        if (dish.veg) {
            vegContainer.appendChild(dishElement);
        } else {
            nonVegContainer.appendChild(dishElement);
        }
    });

    console.log("Starters Menu Loaded Successfully");
}

fetch('../json/header.json')
    .then(response => response.json())
    .then(data => {
        document.querySelector('.restaurant-name').textContent = data.restaurantName;
        document.querySelector('.restaurant-details').textContent = `${data.address} | ${data.contact}`;
    })
    .catch(error => console.error('Error loading header data:', error));

// Function to handle "Read More" functionality
function handleReadMore() {
    if (window.innerWidth >= 480) return;

    document.querySelectorAll(".dish-description").forEach(desc => {
        let shortText = desc.getAttribute("data-short");
        let fullText = desc.getAttribute("data-full");

        desc.innerHTML = shortText + ' <span class="read-more" style="color: #31B404; cursor: pointer;">Read More</span>';

        desc.addEventListener("click", function (event) {
            if (event.target.classList.contains("read-more")) {
                desc.innerHTML = fullText + ' <span class="read-less" style="color: #31B404; cursor: pointer;">Read Less</span>';
            } else if (event.target.classList.contains("read-less")) {
                desc.innerHTML = shortText + ' <span class="read-more" style="color: #31B404; cursor: pointer;">Read More</span>';
            }
        });
    });
}

function generateStars(rating) {
    let fullStars = Math.floor(rating);
    let halfStar = rating % 1 !== 0;
    let starHTML = "";

    for (let i = 0; i < fullStars; i++) {
        starHTML += `<span class="full-star"></span> `;
    }
    if (halfStar) {
        starHTML += `<span class="half-star"></span> `;
    }

    console.log("Generated Stars:", starHTML); // 🔴 Debug log
    return starHTML;
}

function generateVegIcon(isVeg) {
    return `<span class="radio-circle ${isVeg ? 'veg' : 'non-veg'}"></span> 
            <span class="${isVeg ? 'vegetarian' : 'non-vegetarian'}">
                ${isVeg ? 'VEGETARIAN' : 'NON-VEGETARIAN'}
            </span>`;
}
