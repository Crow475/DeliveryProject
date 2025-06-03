const checkoutDeliveryTemplate = document.createElement("template");

const resp = await fetch(
    "/components/checkout-delivery/checkout-delivery.html",
);
const htmlRequested = await resp.text();

checkoutDeliveryTemplate.innerHTML = htmlRequested;

class CheckoutDelivery extends HTMLElement {
    static observedAttributes = ["name", "price"];

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(
            checkoutDeliveryTemplate.content.cloneNode(true),
        );
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "name") {
            const nameElement = this.shadowRoot.getElementById("codeName");
            nameElement.textContent = newValue;
        }
        if (name === "price") {
            const priceElement = this.shadowRoot.getElementById("codePrice");
            priceElement.textContent = `${newValue}$`;
        }
    }
}

customElements.define("checkout-delivery-element", CheckoutDelivery);
