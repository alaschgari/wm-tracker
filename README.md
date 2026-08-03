# FIFA World Cup Tracker 2026

Eine Next.js-Webanwendung zum Verfolgen der Fußball-Weltmeisterschaft 2026: Gruppentabellen, Spielplan, K.-o.-Baum und Team-Details – live und offline nutzbar.

🇬🇧 [English README](README.en.md)

## Features

- **Gruppenphase-Tabellen** – aktuelle Standings pro Gruppe
- **Spielplan & Ergebnisse** – Spielkarten mit Zeitangaben
- **Visueller K.-o.-Baum** – Turnierverlauf von Achtelfinale bis Finale
- **Team-Details** – Modal mit Kader- und Team-Informationen
- **Fuzzy-Suche** – Teams schnell finden, auch bei Tippfehlern
- **Offline-fähig** – Service Worker für Nutzung ohne Internetverbindung
- **Mehrsprachig** – Übersetzungen für die Oberfläche

## Erste Schritte

Entwicklungsserver starten:

```bash
npm run dev
```

Anschließend [http://localhost:3000](http://localhost:3000) im Browser öffnen.

## Technologie

- [Next.js](https://nextjs.org) (App Router)
- TypeScript
- CSS Modules

## Projektstruktur

```
src/
  app/           # Next.js App Router, inkl. API-Routen (/api/matches)
  components/    # UI-Komponenten (Dashboard, GroupStandings, KnockoutBracket, ...)
  data/          # Statische Daten & Übersetzungen
  services/       # Datenzugriff & Hilfsfunktionen (Kalender, Datenservice)
  types/         # TypeScript-Typdefinitionen
```
