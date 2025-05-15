window.addEventListener("DOMContentLoaded", function () {
    if (!("theme" in localStorage)) {
        console.log("No theme in localStorage");
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            darken();
        } else {
            lighten();
        }

        this.document.getElementById("themeSwitch-auto").checked = true;
    }

    if (localStorage.getItem("theme") === "dark") {
        darken();
        this.document.getElementById("themeSwitch-dark").checked = true;
    } else if (localStorage.getItem("theme") === "light") {
        lighten();
        this.document.getElementById("themeSwitch-light").checked = true;
    }
});

function setTheme(theme) {
    if (theme === "dark") {
        localStorage.setItem("theme", "dark");
        this.document.getElementById("themeSwitch-dark").checked = true;
        darken();
    } else if (theme === "light") {
        localStorage.setItem("theme", "light");
        this.document.getElementById("themeSwitch-light").checked = true;
        lighten();
    }
}

function resetTheme() {
    const root = document.documentElement;

    root.classList.remove("dark");
    localStorage.removeItem("theme");

    this.document.getElementById("themeSwitch-auto").checked = true;

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        darken();
    } else {
        lighten();
    }
}

function darken() {
    const root = document.documentElement;
    const themeSwitchIcon = document.getElementById("themeSwitchIcon");

    root.classList.add("dark");
    themeSwitchIcon.src = "./icons/moon.svg";
}

function lighten() {
    const root = document.documentElement;
    const themeSwitchIcon = document.getElementById("themeSwitchIcon");

    root.classList.remove("dark");
    themeSwitchIcon.src = "./icons/sun.svg";
}
