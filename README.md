## Best of Games

Eine schlanke Next.js‑App, die kuratierte Spiele‑Reviews präsentiert. Startseite mit den neuesten Reviews und Detailseiten pro Spiel.

### Tech‑Stack
- **Framework**: Next.js 15 (App Router) mit React 19
- **Datenbank**: PostgreSQL via drizzle‑orm und postgres‑js
- **Styles**: Tailwind CSS 4
- **Analytics**: Optional Plausible (nur in Production geladen)

### Features
- **Übersicht**: Neueste Reviews mit Titel, Kurzbeschreibung und Score
- **Detailseite**: `/games/[slug]` mit SEO‑Metadata
- **ISR**: Startseite revalidiert stündlich, Detailseiten täglich

## Schnellstart

### Voraussetzungen
- Node.js 18.18+ (empfohlen 20+)
- PostgreSQL Instanz (lokal oder z. B. Neon/Supabase)

### Installation
```bash
npm install
```

### Umgebungsvariablen
Lege eine Datei `.env.local` im Projektwurzelverzeichnis an und setze die Datenbank‑URL (SSL wird erzwungen):
```bash
DATABASE_URL=postgres://user:password@host:port/dbname
```

### Datenbank einrichten (Drizzle)
Es gibt zwei gängige Wege – nimm den, der besser zu deinem Workflow passt:

1) Direkt pushen (schnell für lokale Entwicklung):
```bash
npm run db:push
```

2) Migrationen generieren und ausführen:
```bash
npm run db:generate
npm run db:migrate
```

### Seed‑Daten einspielen
Ein kleines Seed‑Script legt ein Beispielspiel samt Review an:
```bash
npx tsx src/scripts/seed.ts
```

### Entwicklung starten
```bash
npm run dev
# http://localhost:3000
```

## Wichtige Skripte
- `dev`: Development‑Server (Turbopack)
- `build`: Production‑Build (Turbopack)
- `start`: Production‑Server starten
- `lint`: ESLint ausführen
- `db:generate`: Drizzle‑Migrationen aus dem Schema erzeugen
- `db:migrate`: Drizzle‑Migrationen anwenden
- `db:push`: Schema direkt gegen die DB synchronisieren

## Projektstruktur (Auszug)
- `src/app/page.tsx`: Startseite mit Liste der neuesten Reviews
- `src/app/games/[slug]/page.tsx`: Detailseite zum Spiel
- `src/lib/schema.ts`: Drizzle‑Schema (`games`, `reviews`)
- `src/lib/queries.ts`: Abfragen für Listen‑ und Detailseite
- `src/scripts/seed.ts`: Seed‑Script für Beispielinhalt

## Hinweise & Architektur
- **Schema**: Ein `review` pro `game` (Unique‑Constraint auf `reviews.game_id`).
- **SEO**: Dynamische `generateMetadata` für Spielseiten, inkl. Open‑Graph.
- **ISR**: `revalidate` auf Start‑ und Detailseiten konfiguriert.
- **Plausible**: Wird nur in `NODE_ENV=production` geladen. Domain in `src/app/layout.tsx` anpassbar.

## Deployment
- Ideal über Vercel. Setze `DATABASE_URL` als Projekt‑Environment‑Variable.
- Stelle sicher, dass deine Datenbank SSL unterstützt (Standard in vielen Cloud‑Anbietern).

Viel Spaß beim Ausprobieren und Erweitern!
