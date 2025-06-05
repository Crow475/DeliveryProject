const checkoutDiscountTemplate = document.createElement("template");

const resp = await fetch(
    "/components/checkout-discount/checkout-discount.html",
);
const htmlRequested = await resp.text();

checkoutDiscountTemplate.innerHTML = htmlRequested;

class CheckoutDiscount extends HTMLElement {
    static observedAttributes = ["name", "percent", "amount"];

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(
            checkoutDiscountTemplate.content.cloneNode(true),
        );
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "name") {
            const nameElement = this.shadowRoot.getElementById("codiName");
            nameElement.textContent = newValue;
        }
        if (name === "percent") {
            const percentElement =
                this.shadowRoot.getElementById("codiPercent");
            percentElement.textContent = `${newValue}%`;
        }
        if (name === "amount") {
            const amountElement = this.shadowRoot.getElementById("codiAmount");
            amountElement.textContent = `${newValue}$`;
        }
    }
}

customElements.define("checkout-discount-element", CheckoutDiscount);
