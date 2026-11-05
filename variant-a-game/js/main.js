import "../sass/main.scss";

let ad,
	playerElement,
	gameState = "start",
	previousTime = null;

const player = {
	offsetY: 0,
	velocityY: 0,
};

const GRAVITY = 900;
const JUMP_FORCE = -300;

const main = () => {
	prepareDOMElements();
	prepareDOMEvents();
};
const prepareDOMElements = () => {
	ad = document.querySelector(".ad");
	playerElement = document.querySelector(".ad__player");
};
const prepareDOMEvents = () => {
	ad.addEventListener("pointerdown", handleInput);
	window.addEventListener("resize", renderPlayer);
};

const startGame = () => {
	gameState = "playing";
	ad.classList.add("ad--playing");

	jump();
	requestAnimationFrame(gameLoop);
};
const jump = () => {
	player.velocityY = JUMP_FORCE;
};
const handleInput = () => {
	if (gameState === "start") {
		startGame();
	} else if (gameState === "playing") {
		jump();
	}
};

const updatePlayer = (deltaTime) => {
	player.velocityY += GRAVITY * deltaTime;
	player.offsetY += player.velocityY * deltaTime;

	const playerTop = 256 + player.offsetY;
	const playerBottom = playerTop + 41;

	if (playerTop <= 168 || playerBottom >= 640) {
		gameState = "fail";
		console.log("Game over: player left the playfield");
	}
};
const renderPlayer = () => {
	const scale = ad.clientHeight / 640;
	const translateY = player.offsetY * scale;

	playerElement.style.transform = `translate3d(0,${translateY}px, 0)`;
};

const gameLoop = (timeStamp) => {
	if (gameState !== "playing") return;

	const deltaTime =
		previousTime === null
			? 0
			: Math.min((timeStamp - previousTime) / 1000, 0.032);
	previousTime = timeStamp;

	updatePlayer(deltaTime);
	renderPlayer();

	if (gameState === "playing") {
		requestAnimationFrame(gameLoop);
	}
};

main();
