# We The Folks — Junior Frontend Task

This repository contains my recruitment task for the Junior Frontend Engineer position at We The Folks.

**Technologies:** HTML, SCSS, JavaScript, GSAP and Vite.

## Variant A — Gut Run

Gut Run is a mobile mini-game where the player moves through a scrolling gut and avoids obstacles.

The game includes:

- Tap-to-jump controls, gravity and collision detection.
- Bacteria and text obstacles that appear once per run.
- Win and fail screens, with a replay option after losing.
- Music, sound effects and a mute button.
- GSAP animations and automatic pause when the tab is hidden.

The layout is based on the original 360 × 640 design and scales to different screen sizes.

## How to run

Run these commands in the project folder:

```bash
npm install
npm run dev
```

Then open `/variant-a-game/index.html` in the local Vite server.

To check the production version, use `npm run build` and `npm run preview`.

## What I would improve

With more time, I would add a visual debug mode for collision boxes and test the game on more physical mobile devices.

The current collision system uses smaller rectangular hitboxes instead of checking the exact shape of each image.

## AI usage

I used AI mainly as a learning tool when I needed help understanding JavaScript concepts, ser APIs or parts of the implementation. I also used online documentation, including MDN, and tested the solutions in the browser.

For example, the first version used `pointerdown` to start the game, but Firefox blocked the initial audio playback. I changed the input handling to `click` and tested the result.

## Variant B — Fireplace

In progress.

## Technical decisions

See [DECISIONS.md](./DECISIONS.md) for the main implementation choices.
