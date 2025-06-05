let cartData = JSON.parse(localStorage.getItem("cart") || '{"cart": []}');
let discountData = null;
const root = document.documentElement;

const discountForm = document.getElementById("discountForm");
const discountCodeInput = document.getElementById("discountCodeInput");
const discountErrorMessage = document.getElementById("discountErrorMessage");

const confirmOrderButton = document.getElementById("confirmOrderButton");
const cancelOrderButton = document.getElementById("cancelOrderButton");

if (document.readyState !== "loading") {
    console.log("Page already loaded");
    window.localStorage.setItem(
        "checkout",
        '{"cart": [], "discounts": [], "total": 0, "location": ""}',
    );
    updateCart();
} else {
    document.addEventListener("DOMContentLoaded", function () {
        console.log("Page loaded");
        window.localStorage.setItem(
            "checkout",
            '{"cart": [], "discounts": [], "total": 0, "location": ""}',
        );
        updateCart();
    });
}

window.addEventListener("cart-updated", function (event) {
    updateCart();
});

discountForm.addEventListener("submit", function (event) {
    event.preventDefault();
    fetch("/data/discounts.json")
        .then((response) => response.json())
        .then((data) => {
            const discountCode = (discountCodeInput.value || "")
                .trim()
                .toUpperCase();

            if (discountCode === "") {
                discountErrorMessage.classList.add("hidden");
                return;
            }

            const discount = data.discounts.find(
                (d) => d.code === discountCode,
            );

            if (discount) {
                discountData = discount;
                discountErrorMessage.classList.add("hidden");
            } else {
                discountData = null;
                discountErrorMessage.classList.remove("hidden");
            }
            updateCart();
        });
});

confirmOrderButton.addEventListener("click", function () {
    alert(localStorage.getItem("checkout"));
    window.localStorage.setItem(
        "checkout",
        '{"cart": [], "discounts": [], "total": 0, "location": ""}',
    );
    window.localStorage.setItem("cart", '{"cart": []}');
    window.location.href = "/";
});

cancelOrderButton.addEventListener("click", function () {
    if (
        confirm(
            "Are you sure you want to cancel your order? This will clear your cart.",
        )
    ) {
        window.localStorage.setItem(
            "checkout",
            '{"cart": [], "discounts": [], "total": 0, "location": ""}',
        );
        window.localStorage.setItem("cart", '{"cart": []}');
        window.location.href = "/";
    }
});

function updateCart() {
    cartData = JSON.parse(localStorage.getItem("cart") || '{"cart": []}');
    let checkoutData = JSON.parse(localStorage.getItem("checkout"));

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

    const checkoutDiscountElement = document.getElementById(
        "checkoutDiscountList",
    );

    if (cartData.cart.length === 0) {
        checkoutRestaurantListElement.innerHTML = `
            <div class="flex flex-col items-center justify-center w-full space-y-2 my-20 md:my-40 text-center">
                <h2 class="font-display text-xl md:text-4xl font-black">Oops! It looks like your cart is empty.</h2>
                <p class="text-sm md:text-lg">Start adding items to your cart to proceed with checkout.</p>
                <a href="/catalog/" class="text-sm md:text-lg text-orange-600 underline">View all restaurants</a>
            </div>
        `;
        checkoutDeliveryList.innerHTML = "";
        itemSubtotalElement.textContent = "0.00$";
        deliverySubtotalElement.textContent = "0.00$";
        checkoutTotalElement.textContent = "0.00$";
    } else {
        checkoutRestaurantListElement.innerHTML = "";
        checkoutDeliveryList.innerHTML = "";

        checkoutData.cart = cartData.cart;

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

                let discountAmount = 0;
                checkoutDiscountElement.innerHTML = "";

                if (discountData) {
                    const checkoutDiscountElementItem = document.createElement(
                        "checkout-discount-element",
                    );

                    checkoutData.discounts.push(discountData);

                    discountAmount = -parseFloat(
                        (
                            (itemSubtotal + deliverySubotal) *
                            (discountData.percentage / 100)
                        ).toFixed(2),
                    );

                    checkoutDiscountElementItem.setAttribute(
                        "name",
                        discountData.name,
                    );
                    checkoutDiscountElementItem.setAttribute(
                        "percent",
                        discountData.percentage,
                    );
                    checkoutDiscountElementItem.setAttribute(
                        "amount",
                        discountAmount.toFixed(2),
                    );

                    checkoutDiscountElement.appendChild(
                        checkoutDiscountElementItem,
                    );
                }

                cartTotal = itemSubtotal + deliverySubotal + discountAmount;

                checkoutData.total = cartTotal.toFixed(2);

                itemSubtotalElement.textContent = `${itemSubtotal.toFixed(2)}$`;
                deliverySubtotalElement.textContent = `${deliverySubotal.toFixed(2)}$`;
                checkoutTotalElement.textContent = `${cartTotal.toFixed(2)}$`;

                localStorage.setItem("checkout", JSON.stringify(checkoutData));
            });
    }
}
