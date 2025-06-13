const container = document.getElementById("restaurant-cards-container");
const sortSelctor = document.getElementById("sort");
const categorySelector = document.getElementById("category");
const filterFreeDelivery = document.getElementById("freeDelivery");
const root = document.documentElement;

fetch("/data/restaurants.json")
    .then((response) => response.json())
    .then((data) => {
        fetch("/data/categories.json")
            .then((response) => response.json())
            .then((categoriesData) => {
                const restaurants = data.restaurants;
                let renderedRestaurants = [];

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
                    updateRestaurantList(
                        e.target.value,
                        localStorage.getItem("filterFreeDelivery") === "true",
                        parseInt(localStorage.getItem("categoryId")),
                    );
                });

                filterFreeDelivery.addEventListener("change", (e) => {
                    updateRestaurantList(
                        localStorage.getItem("sortMode"),
                        e.target.checked,
                        parseInt(localStorage.getItem("categoryId")),
                    );
                });

                categorySelector.addEventListener("change", (e) => {
                    updateRestaurantList(
                        localStorage.getItem("sortMode"),
                        localStorage.getItem("filterFreeDelivery") === "true",
                        parseInt(e.target.value, 10),
                    );
                });

                function initialLoad() {
                    const allCategoriesOption =
                        document.createElement("option");
                    allCategoriesOption.value = 0;
                    allCategoriesOption.text = "All";
                    categorySelector.appendChild(allCategoriesOption);

                    categoriesData.categories.forEach((category) => {
                        const option = document.createElement("option");
                        option.value = category.id;
                        option.text = category.title;

                        categorySelector.appendChild(option);
                    });

                    if (!("filterFreeDelivery" in localStorage)) {
                        filterFreeDeliveries(false);
                        filterFreeDelivery.checked = false;
                    } else {
                        const freeDeliveryValue =
                            localStorage.getItem("filterFreeDelivery");
                        const isFreeDelivery = freeDeliveryValue === "true";

                        filterFreeDeliveries(isFreeDelivery);
                        filterFreeDelivery.checked = isFreeDelivery;
                    }

                    if (!("categoryId" in localStorage)) {
                        filterByCategory(0);
                        categorySelector.value = 0;
                    } else {
                        const categoryId = localStorage.getItem("categoryId");
                        categorySelector.value = categoryId;
                        filterByCategory(parseInt(categoryId));
                    }

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

                function updateRestaurantList(
                    sortValue,
                    freeDeliveryValue,
                    categoryId,
                ) {
                    renderedRestaurants = restaurants;
                    filterFreeDeliveries(freeDeliveryValue);
                    console.log(freeDeliveryValue);

                    if (categoryId !== undefined) {
                        filterByCategory(categoryId);
                    }

                    if (sortValue === "name") {
                        sortByName();
                    } else if (sortValue === "rating") {
                        sortByRating();
                    }

                    container.innerHTML = "";
                    displayRestaurants();
                }

                function filterFreeDeliveries(value) {
                    if (value) {
                        renderedRestaurants = restaurants.filter(
                            (restaurant) => {
                                return (
                                    parseFloat(restaurant.deliveryPrice) === 0
                                );
                            },
                        );
                        localStorage.setItem("filterFreeDelivery", "true");
                    } else {
                        renderedRestaurants = restaurants;
                        localStorage.setItem("filterFreeDelivery", "false");
                    }
                }

                function filterByCategory(categoryId) {
                    if (categoryId === 0) {
                        renderedRestaurants = renderedRestaurants;
                    } else {
                        renderedRestaurants = renderedRestaurants.filter(
                            (restaurant) => {
                                return restaurant.categoryId === categoryId;
                            },
                        );
                    }
                    localStorage.setItem("categoryId", categoryId);
                }

                function sortByName() {
                    renderedRestaurants = renderedRestaurants.sort((a, b) => {
                        return a.name.localeCompare(b.name);
                    });
                    localStorage.setItem("sortMode", "name");
                }

                function sortByRating() {
                    renderedRestaurants = renderedRestaurants.sort((a, b) => {
                        return b.rating - a.rating;
                    });
                    localStorage.setItem("sortMode", "rating");
                }

                function displayRestaurants() {
                    renderedRestaurants.forEach((restaurant) => {
                        const card = document.createElement(
                            "restaurant-card-element",
                        );
                        if (root.classList.contains("dark")) {
                            card.shadowRoot
                                .querySelector("#rcard")
                                .classList.add("dark");
                        }
                        card.setAttribute("title", restaurant.name);
                        card.setAttribute(
                            "description",
                            restaurant.description,
                        );
                        card.setAttribute(
                            "image",
                            `${import.meta.env.VITE_IMAGE_PATH}${restaurant.image}`,
                        );
                        card.setAttribute("rating", restaurant.rating);
                        card.setAttribute(
                            "delivery-price",
                            restaurant.deliveryPrice,
                        );
                        card.setAttribute("link", restaurant.link);
                        container.appendChild(card);
                    });
                }
            });
    });
