const container = document.getElementById("restaurant-cards-container");
const sortSelctor = document.getElementById("sort");
const root = document.documentElement;

fetch("/data/restaurants.json")
    .then((response) => response.json())
    .then((data) => {
        const restaurants = data.restaurants;

        if (document.readyState !== "loading") {
            // console.log("Page already loaded");
            initialLoad();
            displayRestaurants();
        } else {
            document.addEventListener("DOMContentLoaded", function () {
                // console.log("Page loaded");
                initialLoad();
                displayRestaurants();
            });
        }

        sortSelctor.addEventListener("change", (e) => {
            const sortBy = e.target.value;
            if (sortBy === "name") {
                sortByName();
            } else if (sortBy === "rating") {
                sortByRating();
            }

            container.innerHTML = "";
            displayRestaurants();
        });

        function initialLoad() {
            if (!("sortMode" in localStorage)) {
                sortByName();
                sortSelctor.value = "name";
            } else {
                const sortOrder = localStorage.getItem("sortMode");
                if (sortOrder === "name") {
                    sortByName();
                    sortSelctor.value = "name";
                } else if (sortOrder === "rating") {
                    sortByRating();
                    sortSelctor.value = "rating";
                }
            }
        }

        function sortByName() {
            restaurants.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
            localStorage.setItem("sortMode", "name");
        }

        function sortByRating() {
            restaurants.sort((a, b) => {
                return b.rating - a.rating;
            });
            localStorage.setItem("sortMode", "rating");
        }

        function displayRestaurants() {
            restaurants.forEach((restaurant) => {
                const card = document.createElement("restaurant-card-element");
                if (root.classList.contains("dark")) {
                    card.shadowRoot
                        .querySelector("#rcard")
                        .classList.add("dark");
                }
                card.setAttribute("title", restaurant.name);
                card.setAttribute("description", restaurant.description);
                card.setAttribute(
                    "image",
                    `${import.meta.env.VITE_IMAGE_PATH}${restaurant.image}`,
                );
                card.setAttribute("rating", restaurant.rating);
                card.setAttribute("delivery-price", restaurant.deliveryPrice);
                card.setAttribute("link", restaurant.link);
                container.appendChild(card);
            });
        }
    });
