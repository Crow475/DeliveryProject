window.addEventListener("DOMContentLoaded", function () {
    if (!("theme" in localStorage)) {
        console.log("No theme in localStorage");
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            darken();
        } else {
            lighten();
        }

        document.getElementById("themeSwitch-auto").checked = true;
    }

    if (localStorage.getItem("theme") === "dark") {
        darken();
        document.getElementById("themeSwitch-dark").checked = true;
    } else if (localStorage.getItem("theme") === "light") {
        lighten();
        document.getElementById("themeSwitch-light").checked = true;
    }

    const themeSwitchDark = document.getElementById("themeSwitch-dark");
    const themeSwitchLight = document.getElementById("themeSwitch-light");
    const themeSwitchAuto = document.getElementById("themeSwitch-auto");

    themeSwitchDark.addEventListener("click", function (event) {
        setTheme("dark");
    });

    themeSwitchLight.addEventListener("click", function (event) {
        setTheme("light");
    });

    themeSwitchAuto.addEventListener("click", function (event) {
        resetTheme();
    });
});

function setTheme(theme) {
    if (theme === "dark") {
        localStorage.setItem("theme", "dark");
        document.getElementById("themeSwitch-dark").checked = true;
        darken();
    } else if (theme === "light") {
        localStorage.setItem("theme", "light");
        document.getElementById("themeSwitch-light").checked = true;
        lighten();
    }
}

function resetTheme() {
    const root = document.documentElement;

    root.classList.remove("dark");
    localStorage.removeItem("theme");

    document.getElementById("themeSwitch-auto").checked = true;

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
