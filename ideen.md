# Feature-Ideen für Best of Games

## 1. Kuratoren-Listen (Curator Lists)

**Status:** Geplant

Kuratierte Sammlungen wie "Top 10 Cozy Games", "Beste Roguelikes unter 15€", "Hidden Gems 2024".

### Konzept

- **Dynamische Listen**: Nur Kriterien werden gespeichert, Spiele werden zur Laufzeit abgefragt
- Neue Spiele erscheinen automatisch in passenden Listen
- Kein Cron-Job nötig für Listen-Updates

### Datenbank-Schema

```typescript
export const curatorLists = pgTable('curator_lists', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  title: jsonb('title').$type<LocalizedField>().notNull(),
  description: jsonb('description').$type<LocalizedField>(),
  criteria: jsonb('criteria').$type<ListCriteria>().notNull(),
  coverImage: text('cover_image'),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
```

### Kriterien-Typ

```typescript
type ListCriteria = {
  // Tag-Filter
  tags?: string[];
  
  // Score-Filter
  minScore?: number;
  maxScore?: number;
  
  // Preis-Filter (in Cents)
  maxPrice?: number;
  minDiscount?: number;
  onSale?: boolean;
  
  // Zeit-Filter (relativ - immer aktuell!)
  publishedWithinDays?: number;
  releasedWithinDays?: number;
  
  // Zeit-Filter (absolut)
  year?: number;
  
  // Sortierung
  orderBy?: 'score' | 'publishedAt' | 'releaseDate' | 'title';
  orderDirection?: 'asc' | 'desc';
  
  // Limit
  limit?: number;
};
```

### Beispiel-Listen

| Slug | Kriterien | Beschreibung |
|------|-----------|--------------|
| `top-roguelike-games` | `{ tags: ["Roguelike"], limit: 10 }` | Top Roguelikes nach Score |
| `best-this-week` | `{ publishedWithinDays: 7, orderBy: "score" }` | Beste neue Reviews dieser Woche |
| `best-cozy-games` | `{ tags: ["Cozy"], limit: 10 }` | Entspannte Spiele |
| `games-under-10-euros` | `{ maxPrice: 1000, minScore: 7 }` | Budget-freundlich |
| `best-of-2024` | `{ year: 2024, orderBy: "score" }` | Jahres-Highlights |

### Benötigte Dateien

| Aktion | Datei |
|--------|-------|
| Neu | `src/lib/schema.ts` (curatorLists Tabelle) |
| Neu | `src/drizzle/0005_*.sql` (Migration) |
| Ändern | `src/lib/queries.ts` (4 neue Funktionen) |
| Ändern | `src/lib/structured-data.ts` (ItemList für Listen) |
| Neu | `src/app/[lang]/lists/page.tsx` |
| Neu | `src/app/[lang]/lists/[slug]/page.tsx` |
| Ändern | `src/app/[lang]/page.tsx` (Featured Lists Sektion) |
| Neu | `src/components/ListCard.tsx` |
| Ändern | `src/app/sitemap.ts` (Listen-URLs) |
| Ändern | `src/dictionaries/en.json` + `de.json` |

### Query-Funktionen

- `getCuratorLists()` - Alle aktiven Listen
- `getFeaturedLists()` - Listen mit `isFeatured=true` (für Homepage)
- `getCuratorListBySlug(slug)` - Einzelne Liste laden
- `getGamesForList(criteria)` - Spiele basierend auf Kriterien abfragen

### SEO-Vorteile

- Eigene URLs pro Liste (`/lists/top-roguelike-games`)
- Long-Tail Keywords ("beste roguelikes unter 15 euro")
- ItemList Structured Data
- In Sitemap aufgenommen

### Geschätzter Aufwand

~4-5 Stunden

---

## Weitere Ideen

(Platz für zukünftige Feature-Ideen)

