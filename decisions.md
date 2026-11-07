# Technical Decisions

## Variant A — Gut Run

### Game structure

- I used DOM elements instead of Canvas because the provided graphics were already prepared as separate image layers. This made positioning and styling easier.
- I kept the player at a fixed horizontal position and moved the background and obstacles from right to left.
- I used `requestAnimationFrame()` and delta time to keep movement consistent across different frame rates.

### Collision detection

- I used rectangular hitboxes with smaller collision areas because the images contain transparent space around the characters and obstacles.
- Obstacle positions are calculated relative to the moving background.

### Responsive layout

- The game uses a logical size of 360 × 640 pixels.
- I scale the game proportionally to avoid stretching the graphics. The outer container fills the viewport with a background.

### Audio and animations

- Audio starts after user interaction to follow browser autoplay rules.
- The game and audio pause when the browser tab is hidden.
- I used GSAP timelines for the start and endcard animations, while the game movement is handled separately with JavaScript.

### Build and assets

- I chose Vite to make development easier and prepare a production build.
- I used `import.meta.glob()` to include obstacle images that are created dynamically in JavaScript.

## Variant B — Fireplace

To be added after completing Variant B.
