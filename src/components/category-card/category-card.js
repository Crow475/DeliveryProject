const ccardTEmplate = document.createElement("template");

const resp = await fetch("./components/category-card/category-card.html");
const htmlrequested = await resp.text();

ccardTEmplate.innerHTML = htmlrequested;

class CategoryCard extends HTMLElement {
    static observedAttributes = [
        "title",
        "description",
        "icon",
        "color",
        "shadow",
        "link",
    ];

    constructor() {
        super();
        const shadowRoot = this.attachShadow({
            mode: "open",
        });
        shadowRoot.appendChild(ccardTEmplate.content.cloneNode(true));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "title") {
            const titleElement = this.shadowRoot.getElementById("ccardTitle");
            titleElement.textContent = newValue;
        }

        if (name === "description") {
            const descriptionElement =
                this.shadowRoot.getElementById("ccardDescription");
            descriptionElement.textContent = newValue;
        }

        if (name === "icon") {
            const iconElement = this.shadowRoot.getElementById("ccardIcon");
            iconElement.src = newValue;
        }

        if (name === "color") {
            const bgClassRegex = new RegExp("bg-\S*", "g");
            const hoverShadowRegexp =
                /hover:shadow-[a-zA-z]+-(?:\d{2,3})\/\d{2,3}/g;

            const colorElement =
                this.shadowRoot.getElementById("ccardIconContainer");

            if (colorElement.className.match(bgClassRegex)) {
                colorElement.className = colorElement.className.replaceAll(
                    bgClassRegex,
                    "",
                );

                colorElement.classList.add(newValue);
            }
        }

        if (name === "shadow") {
            const hoverShadowRegexp =
                /hover:shadow-[a-zA-z]+-(?:\d{2,3})\/\d{2,3}/g;
            const cardElement = this.shadowRoot.getElementById("ccard");

            if (cardElement.className.match(hoverShadowRegexp)) {
                cardElement.className = cardElement.className.replaceAll(
                    hoverShadowRegexp,
                    "",
                );

                cardElement.classList.add(newValue);
            }
        }

        if (name === "link") {
            const linkElement = this.shadowRoot.getElementById("ccardLink");
            linkElement.href = newValue;
        }
    }
}

customElements.define("category-card-element", CategoryCard);
