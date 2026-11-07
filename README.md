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

I mainly used ChatGPT to help me solve problems when I couldn't find a clear solution in MDN documentation or other online resources. I also used it as a learning tool to understand how to implement certain features and how they work.

For example, ChatGPT helped me understand and solve an audio playback issue related to the difference between pointerdown and click events. After changing the event to click, the audio worked correctly on the first interaction.

## Variant B — Fireplace

Fireplace is a desktop advertisement made of three separate parts: a top banner and two side banners.

Each part works as an independent HTML page. I also created a preview page using iframes to show the complete layout.

**Features:**

- A continuous background across all three banners.
- GSAP animations for logos, text panels, headlines and CTA buttons.
- A coordinated animation sequence using `postMessage()` in the preview.
- A subtle CTA animation that stops after a short time.
- Clickout support and reduced motion handling.

To view the complete advertisement, open `/variant-b-fireplace/preview.html` in the local Vite server.

## Technical decisions

See [DECISIONS.md](./DECISIONS.md) for the main implementation choices.
