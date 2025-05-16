window.addEventListener("DOMContentLoaded", function () {
    const navbar = document.getElementById("navbar");
    const navbarHeight = navbar.offsetHeight;

    const themeSwitchDropdown = document.getElementById("themeSwitchDropdown");
    const themeSwitchButton = document.getElementById("themeSwitchButton");

    const navbarDefaultClassName =
        "sticky top-2 left-6 z-50 mb-2 flex w-[calc(100vw-3rem)] flex-row justify-between rounded-4xl shadow-sm bg-zinc-300 dark:bg-zinc-800 px-2 py-2 transition-all duration-300";
    const navbarScrolledClassName =
        "sticky top-0 left-0 z-50 mb-2 flex w-full flex-row justify-between rounded-none bg-zinc-300 shadow-sm dark:bg-zinc-800 px-2 py-2 transition-all duration-300";

    navbar.className = navbarDefaultClassName;

    window.addEventListener("scroll", function (event) {
        if (window.scrollY > navbarHeight) {
            navbar.className = navbarScrolledClassName;
        } else {
            navbar.className = navbarDefaultClassName;
        }
    });

    themeSwitchButton.addEventListener("click", function (event) {
        if (themeSwitchDropdown.classList.contains("hidden")) {
            themeSwitchDropdown.classList.remove("hidden");
        } else {
            themeSwitchDropdown.classList.add("hidden");
        }
    });

    window.addEventListener("click", function (event) {
        if (
            !themeSwitchButton.contains(event.target) &&
            !themeSwitchDropdown.contains(event.target)
        ) {
            themeSwitchDropdown.classList.add("hidden");
        }
    });
});
