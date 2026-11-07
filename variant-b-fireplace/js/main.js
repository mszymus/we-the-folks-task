import { gsap } from "gsap";
import "../sass/main.scss";

const clickTag = window.clickTag || "https://example.com/landing";
const prepareClickout = () => {
	const clickout = document.querySelector(".fireplace__link");
	if (!clickout) return;
	clickout.href = clickTag;
};

const reduceMotion = window.matchMedia(
	"(prefers-reduced-motion: reduce)",
).matches;

const startCtaPulse = () => {
	const pulse = gsap.to(".fireplace__cta", {
		scale: 1.03,
		duration: 1.2,
		repeat: -1,
		yoyo: true,
		ease: "sine.inOut",
	});
	gsap.delayedCall(25, () => {
		pulse.kill();
		gsap.set(".fireplace__cta", { scale: 1 });
	});
};

const animateFireplace = () => {
	if (reduceMotion) return;

	const timeline = gsap.timeline();
	if (document.querySelector(".fireplace--top")) {
		timeline
			.from(
				".fireplace__headline--first",
				{
					opacity: 0,
					y: 10,
					duration: 0.7,
					ease: "power2.out",
				},
				0.5,
			)
			.from(
				".fireplace__headline--second",
				{
					opacity: 0,
					y: 10,
					duration: 0.7,
					ease: "power2.out",
				},
				1.3,
			)
			.from(
				".fireplace__headline--third",
				{
					opacity: 0,
					y: 10,
					duration: 0.7,
					ease: "power2.out",
				},
				2.1,
			);
	} else {
		timeline
			.from(
				".fireplace__logo",
				{
					opacity: 0,
					scale: 0.97,
					duration: 0.8,
					ease: "power2.out",
				},
				0.4,
			)
			.from(
				".fireplace__panel",
				{
					opacity: 0,
					y: 20,
					duration: 0.8,
					ease: "power2.out",
				},
				1.5,
			)
			.from(
				".fireplace__copy",
				{
					opacity: 0,
					y: 12,
					duration: 0.7,
					ease: "power2.out",
				},
				2.2,
			)
			.from(
				".fireplace__cta",
				{
					opacity: 0,
					scale: 0.9,
					duration: 0.6,
					ease: "back.out(1.4)",
				},
				3.1,
			)
			.call(startCtaPulse, [], 3.7);
	}
};
const main = () => {
	const preview = document.querySelector(".preview");
	if (preview) {
		window.addEventListener("load", () => {
			const frames = preview.querySelectorAll("iframe");
			frames.forEach((frame) => {
				frame.contentWindow.postMessage(
					"fireplace-start",
					window.location.origin,
				);
			});
		});
		return;
	}
	prepareClickout();
	const sync = new URLSearchParams(window.location.search).get("sync");

	if (sync === "1") {
		window.addEventListener("message", (event) => {
			if (event.origin !== window.location.origin) return;
			if (event.data !== "fireplace-start") return;
			animateFireplace();
		});
	} else {
		animateFireplace();
	}
};
main();
