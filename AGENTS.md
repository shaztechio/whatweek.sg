# Repository Guidelines

## Project Structure & Module Organization

- `src/` holds all app sources.
- `src/js` contains term logic.
- `src/styles` stores PostCSS modules.
- `src/assets` keeps vendor bundles (Add to Homescreen).
- Static shell files belong in `public/`.
- `npm run build` outputs to `dist/`.
- Mirror `test/` filenames to match `src/`.
- Ignore generated artifacts such as `coverage/` and `caprover.tar`.

## Build, Test, and Development Commands

- Run `npm install` once per clone.
- Use `npm run dev` for a hot-reloading dev server at <http://localhost:5173>.
- Build with `npm run build`; preview the result using `npm run preview`.
- Surface ESLint issues with `npm run lint`.
- Apply quick fixes using `npm run lint:fix`.
- Run `npm run format` (Prettier) to align styles.
- Deploy with `npm run caprover:deploy` after building the tarball.

## Coding Style & Naming Conventions

- Follow ESLint (Airbnb Base) and Prettier defaults.
- Write ES modules with 2-space indentation and single quotes.
- Keep trailing commas where Prettier applies them.
- Choose descriptive names such as `calculateWeekOffset` and `terms.2025.js`.
- Add new term data in files named `src/js/terms.YYYY.js`.
- Store PostCSS in `src/styles`; prefer utility or flat BEM selectors.

## Testing Guidelines

- Use Vitest with setup in `test/vitest.setup.js`.
- Name test files `*.test.js`.
- Run `npm test` before pushing; it executes headlessly with V8 coverage.
- Maintain 100% statement and branch coverage (report in `coverage/`).
- Inject helpers such as `testDate` into `main` to avoid brittle time checks.

## Commit & Pull Request Guidelines

- Write imperative commit subjects (e.g., `Add term data for 2026`).
- Reference issue IDs or PR numbers when relevant (e.g., `(#123)`).
- Keep PRs focused with a summary and validation steps.
- Include screenshots for UI tweaks and note configuration updates.
- Request review after CI, lint, and tests succeed locally.
