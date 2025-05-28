const fitemTemplate = document.createElement("template");

const resp = await fetch("/components/food-item/food-item.html");
const htmlrequested = await resp.text();

fitemTemplate.innerHTML = htmlrequested;

class FoodItem extends HTMLElement {
    static observedAttributes = [
        "item-id",
        "restaurant-id",
        "name",
        "description",
        "price",
        "image",
    ];

    constructor() {
        super();
        const shadowRoot = this.attachShadow({
            mode: "open",
        });
        shadowRoot.appendChild(fitemTemplate.content.cloneNode(true));

        const addToCartButton = shadowRoot.getElementById("fitem-add-to-cart");

        addToCartButton.addEventListener("click", () => {
            fetch("/data/items.json")
                .then((response) => response.json())
                .then((data) => {
                    const itemId = this.getAttribute("item-id");
                    const restaurantId = this.getAttribute("restaurant-id");

                    const item = data.byRestaurant
                        .find(
                            (restaurant) =>
                                restaurant.restaurantId ===
                                parseInt(restaurantId),
                        )
                        .items.find((item) => item.id === parseInt(itemId));

                    console.log("Adding item to cart:", item);

                    const cart = localStorage.getItem("cart");

                    const newItem = {
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: 1,
                        image: item.image,
                        restaurantId: parseInt(restaurantId),
                    };

                    if (cart) {
                        const cartObject = JSON.parse(cart).cart;
                        const existingRestaurant = cartObject.find(
                            (restaurant) =>
                                restaurant.restaurantId ===
                                parseInt(restaurantId),
                        );

                        if (existingRestaurant) {
                            const existingItem = existingRestaurant.items.find(
                                (cartItem) => cartItem.id === item.id,
                            );

                            if (existingItem) {
                                if (existingItem.quantity < 99) {
                                    existingItem.quantity += 1;
                                }
                            } else {
                                existingRestaurant.items.push(newItem);
                            }
                        } else {
                            cartObject.push({
                                restaurantId: parseInt(restaurantId),
                                items: [newItem],
                            });
                        }

                        localStorage.setItem(
                            "cart",
                            JSON.stringify({ cart: cartObject }),
                        );

                        window.dispatchEvent(new Event("cart-updated"));
                    } else {
                        const cartObject = [
                            {
                                restaurantId: parseInt(restaurantId),
                                items: [newItem],
                            },
                        ];

                        localStorage.setItem(
                            "cart",
                            JSON.stringify({ cart: cartObject }),
                        );

                        window.dispatchEvent(new Event("cart-updated"));
                    }
                });
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "name") {
            const nameElement = this.shadowRoot.getElementById("fitem-name");
            nameElement.textContent = newValue;
        }

        if (name === "description") {
            const descriptionElement =
                this.shadowRoot.getElementById("fitem-description");
            descriptionElement.textContent = newValue;
        }

        if (name === "price") {
            const priceElement = this.shadowRoot.getElementById("fitem-price");
            priceElement.textContent = `${newValue}\$`;
        }

        if (name === "image") {
            const imageElement = this.shadowRoot.getElementById("fitem-image");
            imageElement.src = newValue;
        }

        if (name === "item-id") {
            const itemElement = this.shadowRoot.getElementById("fitem");
            itemElement.setAttribute("data-item-id", newValue);
        }

        if (name === "restaurant-id") {
            const itemElement = this.shadowRoot.getElementById("fitem");
            itemElement.setAttribute("data-restaurant-id", newValue);
        }
    }
}

customElements.define("food-item-element", FoodItem);
