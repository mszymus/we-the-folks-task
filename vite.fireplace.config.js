import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
	base: "./",

	input: {
		top: resolve(process.cwd(), "variant-b-fireplace/top.html"),
		left: resolve(process.cwd(), "variant-b-fireplace/left.html"),
		right: resolve(process.cwd(), "variant-b-fireplace/right.html"),
		preview: resolve(process.cwd(), "variant-b-fireplace/preview.html"),
	},

	build: {
		outDir: "dist-fireplace",
		assetsInlineLimit: 0,
	},
});
