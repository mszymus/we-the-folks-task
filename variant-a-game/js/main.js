import "../sass/main.scss";

let ad,
	gameState = "start";

const main = () => {
	prepareDOMElements();
	prepareDOMEvents();
};
const prepareDOMElements = () => {
	ad = document.querySelector(".ad");
};
const prepareDOMEvents = () => {
	ad.addEventListener("pointerdown", handleInput);
};

const startGame = () => {
	gameState = "playing";
	ad.classList.add("ad--playing");
};
const handleInput = () => {
	if (gameState === "start") {
		startGame();
	}
};

main();
