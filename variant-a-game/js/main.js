import { render } from "sass";
import "../sass/main.scss";

let ad,
	playerElement,
	gutElement,
	gameObstaclesElement,
	animationFrameId = null,
	isPaused = false,
	soundsToResume = [],
	failCtaBtn,
	replayBtn,
	winCtaBtn,
	muteBtn,
	sounds,
	isMuted = false,
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
const clickTag = window.clickTag;
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
	prepareAudio();
	updateScale();
	createObstacles();
	prepareDOMEvents();
};
const prepareDOMElements = () => {
	ad = document.querySelector(".ad");
	playerElement = ad.querySelector(".ad__player");
	gutElement = ad.querySelector(".ad__gut");
	gameObstaclesElement = ad.querySelector(".ad__game-obstacles");
	failCtaBtn = ad.querySelector(".ad__fail-btn--cta");
	replayBtn = ad.querySelector(".ad__fail-btn--replay");
	winCtaBtn = ad.querySelector(".ad__win-cta");
	muteBtn = ad.querySelector(".ad__mute-btn");
};
const prepareDOMEvents = () => {
	ad.addEventListener("click", handleInput);
	window.addEventListener("resize", handleResize);
	failCtaBtn.addEventListener("click", handleClickout);
	replayBtn.addEventListener("click", restartGame);
	winCtaBtn.addEventListener("click", handleClickout);
	muteBtn.addEventListener("pointerdown", (e) => {
		e.stopPropagation();
	});
	muteBtn.addEventListener("click", toggleMute);
	document.addEventListener("visibilitychange", handleVisibilitychange);
};
const handleClickout = () => {
	window.open(clickTag, "_blank", "noopener, noreferrer");
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
const handleInput = (e) => {
	if (e.target.closest("button")) return;
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

	stopAllSounds();
	playSound(sounds.music);

	jump();
	isPaused = false;
	animationFrameId = requestAnimationFrame(gameLoop);
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
const chcekWinCondition = () => {
	const reachedEnd = world.offsetX >= world.maxOffset;

	const allObstaclesPassed = obstacles.every((obstacle) => {
		const obstacleRight = obstacle.x + obstacle.width - world.offsetX;
		return obstacleRight <= PLAYER_X;
	});
	if (reachedEnd && allObstaclesPassed) {
		finishGame();
	}
};
const endGame = (reason) => {
	if (gameState !== "playing") return;
	gameState = "fail";
	ad.classList.add("ad--fail");

	stopAllSounds();
	playSound(sounds.crash);
	playSound(sounds.fail);

	console.log(`Game over ${reason}`);
};
const finishGame = () => {
	if (gameState !== "playing") return;
	gameState = "win";
	ad.classList.add("ad--win");

	stopAllSounds();
	playSound(sounds.cheer);
	playSound(sounds.applause);
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
const resetGame = () => {
	if (animationFrameId !== null) {
		cancelAnimationFrame(animationFrameId);
		animationFrameId = null;
	}
	isPaused = false;
	soundsToResume = [];

	stopAllSounds();
	gameState = "start";
	previousTime = null;

	player.offsetY = 0;
	player.velocityY = 0;

	world.offsetX = 0;
	ad.classList.remove("ad--playing", "ad--fail", "ad--win");

	renderPlayer();
	renderWorld();
	renderObstacles();
};
const restartGame = () => {
	resetGame();
	startGame();
};

const gameLoop = (timeStamp) => {
	animationFrameId = null;
	if (gameState !== "playing" || isPaused) return;

	const deltaTime =
		previousTime === null
			? 0
			: Math.min((timeStamp - previousTime) / 1000, 0.032);
	previousTime = timeStamp;

	updatePlayer(deltaTime);

	if (gameState === "playing") {
		updateWorld(deltaTime);
		chceckObstacleCollisions();
		if (gameState === "playing") {
			chcekWinCondition();
		}
	}

	renderPlayer();
	renderWorld();
	renderObstacles();

	if (gameState === "playing" && !isPaused) {
		animationFrameId = requestAnimationFrame(gameLoop);
	}
};
const prepareAudio = () => {
	sounds = {
		music: new Audio(
			new URL(
				"../assets/music/background_music/Funny Game Loop.mp3",
				import.meta.url,
			).href,
		),
		crash: new Audio(
			new URL("../assets/music/crash/Cartoon Crash Boing.mp3", import.meta.url)
				.href,
		),
		fail: new Audio(
			new URL("../assets/music/endcard_fail/Fail.mp3", import.meta.url).href,
		),
		cheer: new Audio(
			new URL(
				"../assets/music/endcard_win/Celebrative Happy Woohoo Cheer 2.mp3",
				import.meta.url,
			).href,
		),
		applause: new Audio(
			new URL("../assets/music/endcard_win/applause.mp3", import.meta.url).href,
		),
	};

	sounds.music.loop = true;
	sounds.music.volume = 0.25;
	sounds.crash.volume = 0.5;
	sounds.fail.volume = 0.4;
	sounds.cheer.volume = 0.6;
	sounds.applause.volume = 0.4;
};
const playSound = (audio) => {
	if (isMuted || document.hidden) return;
	audio.play().catch((error) => {
		console.warn("Audio playback failed: ", error.name);
	});
};
const stopAllSounds = () => {
	Object.values(sounds).forEach((audio) => {
		audio.pause();
		audio.currentTime = 0;
	});
};
const toggleMute = () => {
	isMuted = !isMuted;

	Object.values(sounds).forEach((audio) => {
		audio.muted = isMuted;
	});
	muteBtn.textContent = isMuted ? "Ton aus" : "Ton an";
	muteBtn.setAttribute("aria-pressed", String(isMuted));

	if (!isMuted && gameState === "playing" && sounds.music.paused) {
		playSound(sounds.music);
	}
};
const pausedGame = () => {
	soundsToResume = Object.values(sounds).filter((audio) => !audio.paused);
	soundsToResume.forEach((audio) => {
		audio.pause();
	});

	if (gameState !== "playing") return;
	isPaused = true;
	if (animationFrameId !== null) {
		cancelAnimationFrame(animationFrameId);
		animationFrameId = null;
	}
	previousTime = null;
};
const resumeGame = () => {
	if (gameState === "playing" && isPaused) {
		isPaused = false;
		previousTime = null;

		animationFrameId = requestAnimationFrame(gameLoop);
	}
	soundsToResume.forEach((audio) => {
		if (!isMuted) {
			playSound(audio);
		}
	});
	soundsToResume = [];
};
const handleVisibilitychange = () => {
	if (document.hidden) {
		pausedGame();
	} else {
		resumeGame();
	}
};

main();
