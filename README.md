# whatweek.sg

Determines if the school week is odd or even (Singapore).

See [Repository Guidelines](AGENTS.md) for contributor instructions.

To add a new academic year, create `src/js/terms.YYYY.js` with the term data. The loader automatically uses the highest available year, so no extra wiring is needed.

These files are in the `public` folder:

- captain-definition
- Dockerfile
- manifest.json

## Dev

- run `npm run dev`
- this will hot reload any of your `src` assets

## Unit tests

- run `npm test`
- they should be at 100% coverage

## Browser tests

- run `npm run test:e2e:install` once to download the Playwright browsers
- run `npm run test:e2e` to execute the end-to-end suite against a preview build
- the suite boots a production preview, then verifies the homepage renders the week state, date label, and add-to-homescreen button across Chromium, Firefox, and WebKit
- use `npm run test:e2e:headed` for a visible Chromium session while developing tests

## Offline support

The build pipeline ships a PWA service worker (via `vite-plugin-pwa`) that precaches core assets and serves the app offline. The cache updates automatically when a fresh build is deployed.
