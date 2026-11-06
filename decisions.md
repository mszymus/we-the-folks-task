# Technical Decisions

## Variant A — Gut Run

### Technology

- Vanilla JavaScript for game logic and DOM manipulation.
- SCSS with BEM naming for styling.
- GSAP for introductory and endcard animations.
- Vite for local development and production builds.

### Game implementation

- Chose DOM elements instead of Canvas because the supplied assets consist mainly of image layers.
- Used `requestAnimationFrame()` with delta time to update movement independently of frame rate.
- Kept the player's horizontal position fixed and moved the background and obstacles horizontally.
- Used gravity and jump velocity for vertical movement.

### Collision detection

- Used rectangular hitboxes with padding to avoid collisions with transparent image areas.
- Converted obstacle positions from world coordinates to screen coordinates.
- Adjusted obstacle positions manually to improve gameplay and visual alignment.

### Responsive layout

- Used 360 × 640 as the logical coordinate system.
- Scaled the game proportionally to preserve the original graphics.
- Used a full-viewport outer container to provide background coverage on different screen sizes.

### Audio and animation

- Used the native Audio API with browser autoplay restrictions.
- Started audio after user interaction.
- Added mute handling and stopped or resumed game activity when tab visibility changes.
- Used GSAP timelines to coordinate entrance animations.
- Respected `prefers-reduced-motion` for decorative animations.

### Build and assets

- Used Vite to bundle JavaScript, SCSS and referenced graphics.
- Used `import.meta.glob()` to include dynamically generated obstacle images in the production build.
- Asset compression: record any compression performed and the final production size after verification.

## Variant B — Fireplace

To be completed with the implementation of Variant B.
