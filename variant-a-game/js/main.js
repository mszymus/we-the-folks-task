import "../sass/main.scss";

let ad,
	playerElement,
	gutElement,
	gameState = "start",
	previousTime = null;

const GAME_WIDTH = 360;
const GAME_HEIGHT = 640;
const GRAVITY = 900;
const JUMP_FORCE = -300;
const WORLD_SPEED = 100;
const WORLD_WIDTH = 2528;

const player = {
	offsetY: 0,
	velocityY: 0,
};
const world = {
	offsetX: 0,
	maxOffset: WORLD_WIDTH - GAME_WIDTH,
};

const main = () => {
	prepareDOMElements();
	prepareDOMEvents();
};
const prepareDOMElements = () => {
	ad = document.querySelector(".ad");
	playerElement = ad.querySelector(".ad__player");
	gutElement = ad.querySelector(".ad__gut");
};
const prepareDOMEvents = () => {
	ad.addEventListener("pointerdown", handleInput);
	window.addEventListener("resize", handleResize);
};

const handleResize = () => {
	renderPlayer();
	renderWorld();
};
const handleInput = () => {
	if (gameState === "start") {
		startGame();
	} else if (gameState === "playing") {
		jump();
	}
};
const startGame = () => {
	gameState = "playing";
	previousTime = null;
	ad.classList.add("ad--playing");

	jump();
	requestAnimationFrame(gameLoop);
};
const jump = () => {
	player.velocityY = JUMP_FORCE;
};

const updatePlayer = (deltaTime) => {
	player.velocityY += GRAVITY * deltaTime;
	player.offsetY += player.velocityY * deltaTime;

	const playerTop = 256 + player.offsetY;
	const playerBottom = playerTop + 41;

	if (playerTop <= 168 || playerBottom >= GAME_HEIGHT) {
		gameState = "fail";
		console.log("Game over: player left the playfield");
	}
};
const updateWorld = (deltaTime) => {
	world.offsetX += WORLD_SPEED * deltaTime;
	if (world.offsetX >= world.maxOffset) {
		world.offsetX = world.maxOffset;
	}
};
const renderPlayer = () => {
	const scale = ad.clientHeight / GAME_HEIGHT;
	const translateY = player.offsetY * scale;

	playerElement.style.transform = `translate3d(0,${translateY}px, 0)`;
};

const renderWorld = () => {
	const scale = ad.clientHeight / GAME_HEIGHT;
	const translateX = -world.offsetX * scale;
	gutElement.style.transform = `translate3d(${translateX}px, 0, 0)`;
};

const gameLoop = (timeStamp) => {
	if (gameState !== "playing") return;

	const deltaTime =
		previousTime === null
			? 0
			: Math.min((timeStamp - previousTime) / 1000, 0.032);
	previousTime = timeStamp;

	updatePlayer(deltaTime);
	updateWorld(deltaTime);

	renderPlayer();
	renderWorld();

	if (gameState === "playing") {
		requestAnimationFrame(gameLoop);
	}
};

main();
