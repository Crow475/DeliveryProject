const fitemTemplate = document.createElement("template");

const resp = await fetch("/components/food-item/food-item.html");
const htmlrequested = await resp.text();

fitemTemplate.innerHTML = htmlrequested;

class FoodItem extends HTMLElement {
    static observedAttributes = [
        "item-id",
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
    }
}

customElements.define("food-item-element", FoodItem);
