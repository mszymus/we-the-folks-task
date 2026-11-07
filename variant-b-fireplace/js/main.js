import "../sass/main.scss";
const clickTag = window.clickTag || "https://example.com/landing";
const prepareClickout = () => {
	const clickout = document.querySelector(".fireplace__link");
	if (!clickout) return;
	clickout.href = clickTag;
};

prepareClickout();
