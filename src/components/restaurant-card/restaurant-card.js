const rcardTemplate = document.createElement("template");

const resp = await fetch("./components/restaurant-card/restaurant-card.html");
const htmlrequested = await resp.text();

rcardTemplate.innerHTML = htmlrequested;

class RestaurantCard extends HTMLElement {
    static observedAttributes = [
        "title",
        "description",
        "link",
        "image",
        "rating",
        "delivery-price",
    ];

    constructor() {
        super();
        const shadowRoot = this.attachShadow({
            mode: "open",
        });
        shadowRoot.appendChild(rcardTemplate.content.cloneNode(true));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "title") {
            const titleElement = this.shadowRoot.getElementById("rcardTitle");
            titleElement.textContent = newValue;
        }

        if (name === "description") {
            const descriptionElement =
                this.shadowRoot.getElementById("rcardDescription");
            descriptionElement.textContent = newValue;
        }

        if (name === "link") {
            const linkElement = this.shadowRoot.getElementById("rcard");
            linkElement.href = newValue;
        }

        if (name === "image") {
            const imageElement = this.shadowRoot.getElementById("rcardImage");
            imageElement.src = newValue;
        }

        if (name === "rating") {
            const ratingElement = this.shadowRoot.getElementById("rcardRating");
            ratingElement.textContent = newValue;
        }

        if (name === "delivery-price") {
            const deliveryPriceElement =
                this.shadowRoot.getElementById("rcardDeliveryPrice");
            deliveryPriceElement.textContent = `${newValue}\$`;
        }
    }
}

customElements.define("restaurant-card-element", RestaurantCard);
