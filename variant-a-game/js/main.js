import { render } from "sass";
import "../sass/main.scss";

let ad,
	playerElement,
	gutElement,
	gameObstaclesElement,
	scale = 1,
	gameState = "start",
	previousTime = null;

const GAME_WIDTH = 360;
const GAME_HEIGHT = 640;
const PLAYER_X = 54;
const PLAYER_START_Y = 256;
const PLAYER_WIDTH = 42;
const PLAYER_HEIGHT = 41;
const PLAYFIELD_TOP = 168;
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
	{ file: "bac1.png", x: 400, y: 260, width: 62.5 },
	{ file: "txt1.png", x: 540, y: 450, width: 23 },
	{ file: "bac2.png", x: 650, y: 240, width: 21.5 },
	{ file: "txt2.png", x: 820, y: 460, width: 34 },
	{ file: "bac3.png", x: 850, y: 260, width: 79 },
	{ file: "txt3.png", x: 980, y: 440, width: 23.5 },
	{ file: "bac4.png", x: 1080, y: 240, width: 69 },
	{ file: "txt4.png", x: 1220, y: 480, width: 29 },
	{ file: "bac5.png", x: 1300, y: 230, width: 53.5 },
	{ file: "txt5.png", x: 1400, y: 380, width: 30 },
	{ file: "bac6.png", x: 1610, y: 530, width: 50 },
	{ file: "txt6.png", x: 1650, y: 235, width: 20.5 },
	{ file: "txt7.png", x: 1746, y: 480, width: 29.5 },
	{ file: "txt8.png", x: 1940, y: 240, width: 18.5 },
	{ file: "txt9.png", x: 2140, y: 400, width: 25.5 },
];
const main = () => {
	prepareDOMElements();
	updateScale();
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
const updateScale = () => {
	scale = ad.clientHeight / GAME_HEIGHT;
};
const createObstacles = () => {
	gameObstaclesElement.replaceChildren();

	obstacles.forEach((obstacle) => {
		const img = document.createElement("img");
		img.style.width = `${(obstacle.width / GAME_WIDTH) * 100}%`;

		img.src = `./assets/01_game/${obstacle.file}`;
		Image.alt = "";
		img.classList.add("ad__game-obstacle");

		obstacle.element = img;
		gameObstaclesElement.append(img);
	});
	renderObstacles();
};

const handleResize = () => {
	updateScale();
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

	const playerTop = PLAYER_START_Y + player.offsetY;
	const playerBottom = playerTop + PLAYER_HEIGHT;

	if (playerTop <= PLAYFIELD_TOP || playerBottom >= GAME_HEIGHT) {
		endGame("out of bounds");
	}
};
const createHitbox = (x, y, width, height, paddingX, paddingY) => {
	return {
		left: x + width * paddingX,
		right: x + width * (1 - paddingX),
		top: y + height * paddingY,
		bottom: y + height * (1 - paddingY),
	};
};
const isColliding = (first, second) => {
	return (
		first.left < second.right &&
		first.right > second.left &&
		first.top < second.bottom &&
		first.bottom > second.top
	);
};
const chceckObstacleCollisions = () => {
	const playerHitbox = createHitbox(
		PLAYER_X,
		PLAYER_START_Y + player.offsetY,
		PLAYER_WIDTH,
		PLAYER_HEIGHT,
		0.18,
		0.18,
	);

	for (const obstacle of obstacles) {
		const image = obstacle.element;

		if (!image.naturalWidth || !image.naturalHeight) {
			continue;
		}

		const obstacleX = obstacle.x - world.offsetX;
		const obstacleHeight =
			(obstacle.width * image.naturalHeight) / image.naturalWidth;

		const isText = obstacle.file.startsWith("txt");

		const obstacleHitbox = createHitbox(
			obstacleX,
			obstacle.y,
			obstacle.width,
			obstacleHeight,
			isText ? 0.18 : 0.22,
			isText ? 0.06 : 0.22,
		);

		if (isColliding(playerHitbox, obstacleHitbox)) {
			endGame(`collision with ${obstacle.file}`);
			break;
		}
	}
};
const endGame = (reason) => {
	if (gameState !== "playing") return;
	gameState = "fail";
	console.log(`Game over ${reason}`);
};
const updateWorld = (deltaTime) => {
	world.offsetX += WORLD_SPEED * deltaTime;
	if (world.offsetX >= world.maxOffset) {
		world.offsetX = world.maxOffset;
	}
};
const renderPlayer = () => {
	const translateY = player.offsetY * scale;

	playerElement.style.transform = `translate3d(0,${translateY}px, 0)`;
};

const renderWorld = () => {
	const translateX = -world.offsetX * scale;
	gutElement.style.transform = `translate3d(${translateX}px, 0, 0)`;
};

const renderObstacles = () => {
	obstacles.forEach((obstacle) => {
		const screenX = obstacle.x - world.offsetX;

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

	if (gameState === "playing") {
		updateWorld(deltaTime);
		chceckObstacleCollisions();
	}

	renderPlayer();
	renderWorld();
	renderObstacles();

	if (gameState === "playing") {
		requestAnimationFrame(gameLoop);
	}
};

main();
