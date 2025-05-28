import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    root: "src",
    build: {
        base: "",
        outDir: "../dist",
        emptyOutDir: true,
        target: "es2022",
        rollupOptions: {
            input: {
                main: "src/index.html",
                navbar: "src/components/navbar/navbar.html",
                cart_dialog: "src/components/cart-dialog/cart-dialog.html",
                cartItem: "src/components/cart-item/cart-item.html",
                cartRestaurant:
                    "src/components/cart-restaurant/cart-restaurant.html",
                categoryCard: "src/components/category-card/category-card.html",
                restaurantCard:
                    "src/components/restaurant-card/restaurant-card.html",
                foodItem: "src/components/food-item/food-item.html",
                footer: "src/components/footer/footer.html",
                about: "src/about/index.html",
                catalog: "src/catalog/index.html",
                restaurant: "src/restaurant/index.html",
                promotions_welcome: "src/promotions/welcome/index.html",
                promotions_burgers25: "src/promotions/burgers25/index.html",
            },
        },
    },
    plugins: [tailwindcss()],
});
