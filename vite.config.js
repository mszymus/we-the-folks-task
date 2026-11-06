import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
	base: "./",
	input: {
		game: resolve(process.cwd(), "variant-a-game/index.html"),
	},
	build: {
		assetsInlineLimit: 0,
	},
});
