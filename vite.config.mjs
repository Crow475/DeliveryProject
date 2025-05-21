import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    root: "src",
    build: {
        outDir: "../dist",
        emptyOutDir: true,
        target: "es2022",
        rollupOptions: {
            input: {
                main: "src/index.html",
                navbar: "src/components/navbar/navbar.html",
                categoryCard: "src/components/category-card/category-card.html",
                about: "src/about.html",
            },
        },
    },
    plugins: [tailwindcss()],
});
