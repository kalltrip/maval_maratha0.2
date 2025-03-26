document.addEventListener("DOMContentLoaded", function () {
    console.log("Loading rice data...");

    // Fetch rice data from rice.json
    fetch("../json/rice.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load rice.json: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("rice JSON Loaded Successfully", data);
            populatericeMenu(data);
        })
        .catch(error => console.error("Error fetching rice.json:", error));
});

// Function to populate rice menu dynamically
function populatericeMenu(data) {
    const container = document.getElementById("rice-menu");

    if (!container) {
        console.error("Container with ID 'rice-menu' not found.");
        return;
    }

    data.forEach(dish => {
        const dishElement = document.createElement("div");
        dishElement.classList.add("dish");

        dishElement.innerHTML = `
            <i class="fa fa-circle" style="font-size:14px; color: ${dish.veg ? 'green' : 'red'};">
                <span class="${dish.veg ? 'vegetarian' : 'non-vegetarian'}">
                    ${dish.veg ? 'VEGETARIAN' : 'NON-VEGETARIAN'}
                </span>
            </i>
            <div class="dish-content">
                <div class="dish-details">
                    <div class="dish-header">
                        <span class="dish-name">${dish.name}</span>
                    </div>
                    <div class="dish-pricing">
                        <span class="dish-price">Rs ${dish.price} </span>
                    </div>
                    <span class="dish-rating">${generateStars(dish.rating)} (${dish.rating})</span>
                    <p>${dish.description}</p>
                </div>
                <img src="${dish.image}" alt="${dish.name}" class="lazy-img" loading="lazy"/>
            </div>
        `;

        container.appendChild(dishElement);
    });

    console.log("rice Menu Loaded Successfully");
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
// Function to generate star ratings
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
