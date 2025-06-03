import "/components/checkout-item/checkout-item.js";

const checkoutRestaurantTemplate = document.createElement("template");

const resp = await fetch(
    "/components/checkout-restaurant/checkout-restaurant.html",
);
const htmlRequested = await resp.text();

checkoutRestaurantTemplate.innerHTML = htmlRequested;

class CheckoutRestaurant extends HTMLElement {
    static observedAttributes = ["name", "items"];

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(
            checkoutRestaurantTemplate.content.cloneNode(true),
        );
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "name") {
            const nameElement =
                this.shadowRoot.getElementById("restaurantName");
            nameElement.textContent = newValue;
        }
        if (name === "items") {
            const itemList =
                this.shadowRoot.getElementById("checkoutItemsList");
            const itemTotalElement =
                this.shadowRoot.getElementById("itemTotal");
            itemList.innerHTML = "";

            const items = JSON.parse(newValue);
            let itemTotal = 0;

            items.forEach((item) => {
                const checkoutItemElement = document.createElement(
                    "checkout-item-element",
                );

                checkoutItemElement.setAttribute("name", item.name);
                checkoutItemElement.setAttribute("price", item.price);
                checkoutItemElement.setAttribute("quantity", item.quantity);

                itemList.appendChild(checkoutItemElement);

                itemTotal += parseFloat(item.price) * parseInt(item.quantity);
            });

            itemTotalElement.textContent = `${itemTotal.toFixed(2)}$`;
        }
    }
}

customElements.define("checkout-restaurant-element", CheckoutRestaurant);
