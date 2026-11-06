import { render } from "sass";
import "../sass/main.scss";

let ad,
	playerElement,
	gutElement,
	gameObstaclesElement,
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
const obstacles = [
	{ file: "bac1.png", x: 430, y: 220, width: 62.5 },
	{ file: "txt1.png", x: 548, y: 400, width: 23 },
	{ file: "bac2.png", x: 666, y: 240, width: 21.5 },
	{ file: "txt2.png", x: 784, y: 400, width: 34 },
	{ file: "bac3.png", x: 902, y: 300, width: 79 },
	{ file: "txt3.png", x: 1020, y: 440, width: 23.5 },
	{ file: "bac4.png", x: 1138, y: 230, width: 69 },
	{ file: "txt4.png", x: 1256, y: 420, width: 29 },
	{ file: "bac5.png", x: 1374, y: 220, width: 53.5 },
	{ file: "txt5.png", x: 1492, y: 400, width: 30 },
	{ file: "bac6.png", x: 1610, y: 270, width: 50 },
	{ file: "txt6.png", x: 1728, y: 430, width: 20.5 },
	{ file: "txt7.png", x: 1846, y: 230, width: 29.5 },
	{ file: "txt8.png", x: 1964, y: 420, width: 18.5 },
	{ file: "txt9.png", x: 2082, y: 230, width: 25.5 },
];
const main = () => {
	prepareDOMElements();
	createObstacles();
	prepareDOMEvents();
};
const prepareDOMElements = () => {
	ad = document.querySelector(".ad");
	playerElement = ad.querySelector(".ad__player");
	gutElement = ad.querySelector(".ad__gut");
	gameObstaclesElement = ad.querySelector(".ad__game-obstacles");
};
const prepareDOMEvents = () => {
	ad.addEventListener("pointerdown", handleInput);
	window.addEventListener("resize", handleResize);
};

const createObstacles = () => {
	gameObstaclesElement.replaceChildren();

	obstacles.forEach((obstacle) => {
		const img = document.createElement("img");

		img.src = `./assets/01_game/${obstacle.file}`;
		Image.alt = "";
		img.classList.add("ad__game-obstacle");

		obstacle.element = img;
		gameObstaclesElement.append(img);
	});
	renderObstacles();
};

const handleResize = () => {
	renderPlayer();
	renderWorld();
	renderObstacles();
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

const renderObstacles = () => {
	const scale = ad.clientHeight / GAME_HEIGHT;

	obstacles.forEach((obstacle) => {
		const screenX = obstacle.x - world.offsetX;

		obstacle.element.style.width = `${obstacle.width * scale}px`;

		obstacle.element.style.transform = `translate3d(${screenX * scale}px,${obstacle.y * scale}px, 0)`;
	});
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
	renderObstacles();

	if (gameState === "playing") {
		requestAnimationFrame(gameLoop);
	}
};

main();
