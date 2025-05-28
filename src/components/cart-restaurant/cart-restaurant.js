import "/components/cart-item/cart-item";

const cartRestaurantTemplate = document.createElement("template");

const resp = await fetch("/components/cart-restaurant/cart-restaurant.html");
const htmlRequested = await resp.text();

cartRestaurantTemplate.innerHTML = htmlRequested;

class CartRestaurant extends HTMLElement {
    static observedAttributes = ["name", "items"];

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(
            cartRestaurantTemplate.content.cloneNode(true),
        );
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "name") {
            const nameElement =
                this.shadowRoot.getElementById("restaurantName");
            nameElement.textContent = newValue;
        }

        if (name === "items") {
            console.log("Items changed:", newValue);
            const itemsList = this.shadowRoot.getElementById("cartItemsList");
            const itemCountElement =
                this.shadowRoot.getElementById("itemCount");

            itemsList.innerHTML = "";
            const items = JSON.parse(newValue);

            let itemCount = 0;

            items.forEach((item) => {
                const cartItemElement =
                    document.createElement("cart-item-element");

                cartItemElement.setAttribute("name", item.name);
                cartItemElement.setAttribute("price", item.price);
                cartItemElement.setAttribute("quantity", item.quantity);
                cartItemElement.setAttribute(
                    "image",
                    `${import.meta.env.VITE_IMAGE_PATH}${item.image}`,
                );
                cartItemElement.setAttribute(
                    "restaurant-id",
                    item.restaurantId,
                );
                cartItemElement.setAttribute("item-id", item.id);
                itemsList.appendChild(cartItemElement);

                itemCount += item.quantity;
            });

            itemCountElement.textContent = `${itemCount} Item(s)`;
        }
    }
}

customElements.define("cart-restaurant-element", CartRestaurant);
