const navbarTemplate = document.createElement("template");

const resp = await fetch("./components/navbar/navbar.html");
const htmlrequested = await resp.text();

navbarTemplate.innerHTML = htmlrequested;

class Navbar extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(navbarTemplate.content);

        const navbar = shadowRoot.getElementById("navbar");

        const navbarHeight = navbar.offsetHeight;

        const themeSwitchDropdown = shadowRoot.getElementById(
            "themeSwitchDropdown",
        );
        const themeSwitchButton =
            shadowRoot.getElementById("themeSwitchButton");

        const mobileMenuButton = shadowRoot.getElementById("mobileMenuButton");
        const mobileMenu = shadowRoot.getElementById("mobileMenu");
        const mobileMenuCloseButton = shadowRoot.getElementById(
            "mobileMenuCloseButton",
        );

        const navbarDefaultClassName =
            "sticky top-2 left-6 z-50 mb-2 flex w-[calc(100vw-3rem)] flex-row justify-between rounded-4xl shadow-sm bg-zinc-300 dark:bg-zinc-800 px-2 py-2 transition-all duration-300 font-geist";
        const navbarScrolledClassName =
            "sticky top-0 left-0 z-50 mb-2 flex w-full flex-row justify-between rounded-none bg-zinc-300 shadow-sm dark:bg-zinc-800 px-2 py-2 transition-all duration-300 font-geist";

        navbar.className = navbarDefaultClassName;

        window.addEventListener("scroll", function (event) {
            if (window.scrollY > navbarHeight) {
                if (navbar.classList.contains("dark")) {
                    navbar.className = navbarScrolledClassName;
                    navbar.classList.add("dark");
                } else {
                    navbar.className = navbarScrolledClassName;
                }
            } else {
                if (navbar.classList.contains("dark")) {
                    navbar.className = navbarDefaultClassName;
                    navbar.classList.add("dark");
                } else {
                    navbar.className = navbarDefaultClassName;
                }
            }
        });

        mobileMenuButton.addEventListener("click", function (event) {
            if (mobileMenu.classList.contains("hidden")) {
                mobileMenu.classList.remove("hidden");
            } else {
                mobileMenu.classList.add("hidden");
            }
        });

        mobileMenuCloseButton.addEventListener("click", function (event) {
            mobileMenu.classList.add("hidden");
        });

        themeSwitchButton.addEventListener("click", function (event) {
            if (themeSwitchDropdown.classList.contains("hidden")) {
                themeSwitchDropdown.classList.remove("hidden");
            } else {
                themeSwitchDropdown.classList.add("hidden");
            }
        });

        // window.addEventListener("click", function (event) {
        //     if (
        //         !themeSwitchButton.contains(event.target) &&
        //         !themeSwitchDropdown.contains(event.target)
        //     ) {
        //         themeSwitchDropdown.classList.add("hidden");
        //     }
        // });

        const themeSwitchDark = shadowRoot.getElementById("themeSwitch-dark");
        const themeSwitchLight = shadowRoot.getElementById("themeSwitch-light");
        const themeSwitchAuto = shadowRoot.getElementById("themeSwitch-auto");
        const themeSwitchMobileDark = shadowRoot.getElementById(
            "themeSwitchMobile-dark",
        );
        const themeSwitchMobileLight = shadowRoot.getElementById(
            "themeSwitchMobile-light",
        );
        const themeSwitchMobileAuto = shadowRoot.getElementById(
            "themeSwitchMobile-auto",
        );

        if (!("theme" in localStorage)) {
            console.log("No theme in localStorage");
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                darken();
            } else {
                lighten();
            }

            themeSwitchAuto.checked = true;
            themeSwitchMobileAuto.checked = true;
        }

        if (localStorage.getItem("theme") === "dark") {
            darken();
            themeSwitchDark.checked = true;
            themeSwitchMobileDark.checked = true;
        } else if (localStorage.getItem("theme") === "light") {
            lighten();
            themeSwitchLight.checked = true;
            themeSwitchMobileLight.checked = true;
        }

        themeSwitchDark.addEventListener("click", function (event) {
            setTheme("dark");
        });

        themeSwitchLight.addEventListener("click", function (event) {
            setTheme("light");
        });

        themeSwitchAuto.addEventListener("click", function (event) {
            resetTheme();
        });

        themeSwitchMobileDark.addEventListener("click", function (event) {
            setTheme("dark");
        });
        themeSwitchMobileLight.addEventListener("click", function (event) {
            setTheme("light");
        });
        themeSwitchMobileAuto.addEventListener("click", function (event) {
            resetTheme();
        });

        function setTheme(theme) {
            if (theme === "dark") {
                localStorage.setItem("theme", "dark");
                themeSwitchDark.checked = true;
                themeSwitchMobileDark.checked = true;
                darken();
            } else if (theme === "light") {
                localStorage.setItem("theme", "light");
                themeSwitchLight.checked = true;
                themeSwitchMobileLight.checked = true;
                lighten();
            }
        }

        function resetTheme() {
            const root = document.documentElement;

            root.classList.remove("dark");
            navbar.classList.remove("dark");
            mobileMenu.classList.remove("dark");
            localStorage.removeItem("theme");

            themeSwitchAuto.checked = true;
            themeSwitchMobileAuto.checked = true;

            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                darken();
            } else {
                lighten();
            }
        }

        function darken() {
            customElements.whenDefined("category-card-element").then(() => {
                const root = document.documentElement;
                const ccards = document.querySelectorAll(
                    "category-card-element",
                );
                const themeSwitchIcon =
                    shadowRoot.getElementById("themeSwitchIcon");

                root.classList.add("dark");
                navbar.classList.add("dark");
                mobileMenu.classList.add("dark");

                ccards.forEach((ccard) => {
                    ccard.shadowRoot
                        .getElementById("ccard")
                        .classList.add("dark");
                });

                themeSwitchIcon.src = "./icons/moon.svg";
            });
        }

        function lighten() {
            customElements.whenDefined("category-card-element").then(() => {
                const root = document.documentElement;
                const ccards = document.querySelectorAll(
                    "category-card-element",
                );
                const themeSwitchIcon =
                    shadowRoot.getElementById("themeSwitchIcon");

                root.classList.remove("dark");
                navbar.classList.remove("dark");
                mobileMenu.classList.remove("dark");

                ccards.forEach((ccard) => {
                    ccard.shadowRoot
                        .getElementById("ccard")
                        .classList.remove("dark");
                });

                themeSwitchIcon.src = "./icons/sun.svg";
            });
        }
    }
}

customElements.define("navbar-element", Navbar);
