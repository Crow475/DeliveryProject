const navbarTemplate = document.createElement("template");

const resp = await fetch("./components/footer/footer.html");
const htmlrequested = await resp.text();

navbarTemplate.innerHTML = htmlrequested;

class Footer extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = htmlrequested;
    }
}

customElements.define("footer-element", Footer);
