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
