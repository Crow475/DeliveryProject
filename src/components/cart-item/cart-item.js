const cartItemTemplate = document.createElement("template");

const resp = await fetch("/components/cart-item/cart-item.html");
const htmlRequested = await resp.text();

cartItemTemplate.innerHTML = htmlRequested;

class CartItem extends HTMLElement {
    static observedAttributes = [
        "name",
        "price",
        "quantity",
        "image",
        "restaurant-id",
        "item-id",
    ];

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(cartItemTemplate.content.cloneNode(true));

        const cartItemIncreaseButton = this.shadowRoot.getElementById(
            "cartItemIncreaseButton",
        );

        const cartItemDecreaseButton = this.shadowRoot.getElementById(
            "cartItemDecreaseButton",
        );

        cartItemDecreaseButton.addEventListener("click", () => {
            const cart = localStorage.getItem("cart");
            const cartObject = JSON.parse(cart).cart;
            const restaurantInCart = cartObject.find(
                (restaurant) =>
                    restaurant.restaurantId ===
                    parseInt(this.getAttribute("restaurant-id")),
            );

            const itemInCart = restaurantInCart.items.find(
                (item) => item.id === parseInt(this.getAttribute("item-id")),
            );

            if (itemInCart.quantity > 1) {
                itemInCart.quantity -= 1;
                restaurantInCart.items = restaurantInCart.items.map((item) =>
                    item.id === itemInCart.id ? itemInCart : item,
                );
            } else {
                restaurantInCart.items = restaurantInCart.items.filter(
                    (item) => item.id !== itemInCart.id,
                );
            }

            if (restaurantInCart.items.length === 0) {
                cartObject.splice(
                    0,
                    cartObject.length,
                    ...cartObject.filter(
                        (restaurant) =>
                            restaurant.restaurantId !==
                            restaurantInCart.restaurantId,
                    ),
                );
            } else {
                cartObject.splice(
                    0,
                    cartObject.length,
                    ...cartObject.map((restaurant) =>
                        restaurant.restaurantId ===
                        restaurantInCart.restaurantId
                            ? restaurantInCart
                            : restaurant,
                    ),
                );
            }

            localStorage.setItem("cart", JSON.stringify({ cart: cartObject }));
            window.dispatchEvent(new Event("cart-updated"));

            console.log("Cart after decrease:", cartObject);
        });

        cartItemIncreaseButton.addEventListener("click", () => {
            const cart = localStorage.getItem("cart");
            const cartObject = JSON.parse(cart).cart;
            const restaurantInCart = cartObject.find(
                (restaurant) =>
                    restaurant.restaurantId ===
                    parseInt(this.getAttribute("restaurant-id")),
            );

            const itemInCart = restaurantInCart.items.find(
                (item) => item.id === parseInt(this.getAttribute("item-id")),
            );

            if (itemInCart) {
                if (itemInCart.quantity < 99) {
                    itemInCart.quantity += 1;
                    restaurantInCart.items = restaurantInCart.items.map(
                        (item) =>
                            item.id === itemInCart.id ? itemInCart : item,
                    );
                }
            }

            cartObject.splice(
                0,
                cartObject.length,
                ...cartObject.map((restaurant) =>
                    restaurant.restaurantId === restaurantInCart.restaurantId
                        ? restaurantInCart
                        : restaurant,
                ),
            );

            localStorage.setItem("cart", JSON.stringify({ cart: cartObject }));
            window.dispatchEvent(new Event("cart-updated"));
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "name") {
            const nameElement = this.shadowRoot.getElementById("cartItemName");
            nameElement.textContent = newValue;
        }

        if (name === "price") {
            const priceElement =
                this.shadowRoot.getElementById("cartItemPrice");
            priceElement.textContent = `${parseFloat(newValue).toFixed(2)}\$`;
        }

        if (name === "quantity") {
            const quantityElement =
                this.shadowRoot.getElementById("cartItemQuantity");
            quantityElement.textContent = `x${newValue}`;
        }

        if (name === "image") {
            const imageElement =
                this.shadowRoot.getElementById("cartItemImage");
            imageElement.src = newValue;
        }

        if (name === "restaurant-id") {
            const itemElement = this.shadowRoot.getElementById("cartItemRoot");

            itemElement.setAttribute("data-restaurant-id", newValue);
        }

        if (name === "item-id") {
            const itemElement = this.shadowRoot.getElementById("cartItemRoot");

            itemElement.setAttribute("data-item-id", newValue);
        }
    }
}

customElements.define("cart-item-element", CartItem);
