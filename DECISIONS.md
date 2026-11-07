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

### Layout

- I used three separate HTML files because each banner needs to work independently.
- I used CSS Grid and iframes to create a preview of the complete advertisement.
- I chose the provided cropped background images instead of the large background file. This helped me keep the correct sizes and avoid loading an unnecessary image.

### Animations

- I used GSAP timelines to animate the logos, headlines, text panels and CTA buttons.
- I used fixed animation timings to keep the three banners visually coordinated.
- In the preview, I used `postMessage()` to start all animations together.
- I kept the background static to avoid visible gaps between the banners.
- I limited the CTA animation time and supported reduced motion settings.

### Assets

- I used the provided 2x graphics at half their original dimensions.
- I prepared transparent copies of some graphic layers because their black backgrounds covered other elements.
- The final production size was checked after building the project with Vite.
