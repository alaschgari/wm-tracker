# FIFA World Cup Tracker 2026

A Next.js web app for following the 2026 FIFA World Cup: group standings, match schedule, knockout bracket, and team details — live and available offline.

🇩🇪 [Deutsches README](README.md)

## Features

- **Group stage standings** – up-to-date tables per group
- **Match schedule & results** – match cards with kickoff times
- **Visual knockout tree** – tournament progress from Round of 16 to the final
- **Team details** – modal with squad and team information
- **Fuzzy search** – find teams quickly, even with typos
- **Offline support** – service worker for use without an internet connection
- **Multi-language UI** – built-in translations

## Getting Started

Run the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- [Next.js](https://nextjs.org) (App Router)
- TypeScript
- CSS Modules

## Project Structure

```
src/
  app/           # Next.js App Router, incl. API routes (/api/matches)
  components/    # UI components (Dashboard, GroupStandings, KnockoutBracket, ...)
  data/          # Static data & translations
  services/       # Data access & helpers (calendar, data service)
  types/         # TypeScript type definitions
```
