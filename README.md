# We The Folks — Junior Frontend Engineer Task

Recruitment task built using HTML, SCSS, JavaScript, GSAP and Vite.

## Variant A — Gut Run

A mobile tap-to-jump game. The player controls a character moving through a scrolling gut while avoiding bacteria and text obstacles.

**Features:**

- Gravity-based movement and tap controls
- 15 obstacles, each appearing once per run
- Collision detection with reduced hitboxes
- Fail and win endcards
- Replay and CTA clickouts
- Background music, sound effects and mute control
- GSAP animations
- Pause and resume on tab visibility changes
- Responsive layout based on the 360 × 640 design

## How to run

```bash
npm install
npm run dev
```

Open `/variant-a-game/index.html` in the local Vite server.

To test the production version:

```bash
npm run build
npm run preview
```

## Technical decisions

See [DECISIONS.md](./DECISIONS.md).

## Known limitations and possible improvements

- Collision detection uses simplified rectangular hitboxes rather than pixel-perfect collision detection.
- A visual hitbox debug mode could make obstacle tuning easier.
- Further testing on physical mobile devices would help confirm cross-browser consistency.

## AI usage

I used ChatGPT to understand browser APIs, GSAP, collision detection and game state management, and to discuss implementation approaches. I reviewed and tested the suggested code rather than accepting it without changes.

For example, the original obstacle coordinates suggested by AI did not match the gameplay layout. I adjusted their positions manually and tested them in the game.

## Variant B — Fireplace

To be added after completing the desktop variant.
