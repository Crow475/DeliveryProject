const checkoutItemTemplate = document.createElement("template");

const resp = await fetch("/components/checkout-item/checkout-item.html");
const htmlRequested = await resp.text();

checkoutItemTemplate.innerHTML = htmlRequested;

class CheckoutItem extends HTMLElement {
    static observedAttributes = ["name", "price", "quantity"];

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(
            checkoutItemTemplate.content.cloneNode(true),
        );
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "name") {
            const nameElement = this.shadowRoot.getElementById("coiItemName");
            nameElement.textContent = newValue;
            console.log("set name yo " + newValue);
        }
        if (name === "price") {
            const priceElement = this.shadowRoot.getElementById("coiItemPrice");
            priceElement.textContent = `${newValue}\$`;
            console.log("set price yo " + newValue);
        }
        if (name === "quantity") {
            const quantityElement =
                this.shadowRoot.getElementById("coiItemQuantity");
            quantityElement.textContent = `x${newValue}`;
            console.log("set quantity yo " + newValue);
        }
    }
}

customElements.define("checkout-item-element", CheckoutItem);
