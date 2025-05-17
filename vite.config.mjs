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
                about: "src/about.html",
            },
        },
    },
    plugins: [tailwindcss()],
});
