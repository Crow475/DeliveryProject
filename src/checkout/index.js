let cartData = JSON.parse(localStorage.getItem("cart") || '{"cart": []}');
const root = document.documentElement;

if (document.readyState !== "loading") {
    console.log("Page already loaded");
    updateCart();
} else {
    document.addEventListener("DOMContentLoaded", function () {
        console.log("Page loaded");
        updateCart();
    });
}

window.addEventListener("cart-updated", function (event) {
    updateCart();
});

function updateCart() {
    cartData = JSON.parse(localStorage.getItem("cart") || '{"cart": []}');

    const checkoutRestaurantListElement = document.getElementById(
        "checkoutRestaurantList",
    );
    const checkoutDeliveryList = document.getElementById(
        "checkoutDeliveryList",
    );
    const itemSubtotalElement = document.getElementById("itemSubtotalElement");
    const deliverySubtotalElement = document.getElementById(
        "deliverySubtotalElement",
    );
    const checkoutTotalElement = document.getElementById(
        "checkoutTotalElement",
    );

    if (cartData.cart.length === 0) {
        checkoutRestaurantListElement.innerHTML = `
            <div class="flex flex-col items-center justify-center w-full space-y-2 my-40">
                <h2 class="font-display text-4xl font-black">Oops! It looks like your cart is empty.</h2>
                <p class="text-lg">Start adding items to your cart to proceed with checkout.</p>
                <a href="/catalog/" class="text-lg text-orange-600 underline">View all restaurants</a>
            </div>
        `;
        checkoutDeliveryList.innerHTML = "";
        itemSubtotalElement.textContent = "0.00$";
        deliverySubtotalElement.textContent = "0.00$";
        checkoutTotalElement.textContent = "0.00$";
    } else {
        checkoutRestaurantListElement.innerHTML = "";
        checkoutDeliveryList.innerHTML = "";

        fetch("/data/restaurants.json")
            .then((response) => response.json())
            .then((data) => {
                const restaurantList = data.restaurants;
                let itemSubtotal = 0;
                let deliverySubotal = 0;
                let cartTotal = 0;

                cartData.cart.forEach((item) => {
                    const restaurant = restaurantList.find(
                        (r) => r.id === item.restaurantId,
                    );

                    const checkoutRestaurantElement = document.createElement(
                        "checkout-restaurant-element",
                    );

                    if (root.classList.contains("dark")) {
                        const core =
                            checkoutRestaurantElement.shadowRoot.getElementById(
                                "core",
                            );

                        core.classList.add("dark");
                    }

                    checkoutRestaurantElement.setAttribute(
                        "name",
                        restaurant.name,
                    );

                    checkoutRestaurantElement.setAttribute(
                        "items",
                        JSON.stringify(item.items),
                    );

                    checkoutRestaurantListElement.appendChild(
                        checkoutRestaurantElement,
                    );

                    item.items.forEach((cartItem) => {
                        itemSubtotal +=
                            parseFloat(cartItem.price) *
                            parseInt(cartItem.quantity);
                    });

                    const checkoutDeliveryElement = document.createElement(
                        "checkout-delivery-element",
                    );

                    checkoutDeliveryElement.setAttribute(
                        "name",
                        restaurant.name,
                    );

                    checkoutDeliveryElement.setAttribute(
                        "price",
                        restaurant.deliveryPrice,
                    );

                    deliverySubotal += parseFloat(restaurant.deliveryPrice);

                    checkoutDeliveryList.appendChild(checkoutDeliveryElement);
                });

                itemSubtotalElement.textContent = `${itemSubtotal.toFixed(2)}$`;
                deliverySubtotalElement.textContent = `${deliverySubotal.toFixed(2)}$`;
                cartTotal = itemSubtotal + deliverySubotal;
                checkoutTotalElement.textContent = `${cartTotal.toFixed(2)}$`;
            });
    }
}
