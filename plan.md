# geolater — Projektplan

> Ein GeoGuessr-ähnliches Browser-Spiel als „Editorial Travel Almanac".
> Komplett kostenlos, ohne Zahlungsdaten, ohne Konto, ohne Backend.
> Schülerprojekt von Michael Blaess. Live: https://michaelblaess.github.io/geolater/

---

## 1. Projektziel

Der Spieler sieht das Foto eines Wahrzeichens irgendwo auf der Welt und muss auf
einer Weltkarte raten, wo das Bild aufgenommen wurde. Punkte richten sich nach der
Distanz zwischen Tipp und echter Position.

**Inspiration:** GeoGuessr — aber kostenlos, ohne Account, ohne Backend,
ohne Paywall.

---

## 2. Harte Randbedingungen

- **Keine Kreditkarte / keine Zahlungsdaten** — Michael ist Schüler.
- **Keine kostenpflichtigen APIs.**
- **Kein Supabase, kein Vercel** — Anforderung von Michael (weniger Accounts).
- **Hosting: GitHub Pages** (öffentliches Repo, Auto-Deploy via Actions).
- **Verantwortlich (Impressum):** Stefan Waßmann, Quellweg 36A, 15345 Rehfelde,
  st.ar.wassmann@gmx.de — als ladungsfähige Kontaktperson, da Michael minderjährig.

---

## 3. Stack (final)

| Schicht         | Technologie                                  | Frei?              |
|-----------------|----------------------------------------------|--------------------|
| Build-Tool      | **Vite 7**                                   | ja, Open Source    |
| Frontend        | **React 19 + TypeScript**                    | ja, Open Source    |
| Routing         | **React Router 7** (HashRouter für GH Pages) | ja, Open Source    |
| Styling         | **Tailwind CSS 4** (`@theme`, klassischer Dark Mode) | ja, Open Source    |
| Schriften       | **Fraunces** (Display, Variable + Italic) + **Manrope** (Body) — selbst gehostet via `@fontsource-variable` | ja, OFL |
| Bildanzeige     | Plain `<img>` mit `onError`-Fallback         | ja                 |
| **Bildquelle**  | **Wikimedia Commons** Hotlinks (1280px Thumbs, via MediaWiki Pageimages-API ermittelt) | ja, CC-BY-SA |
| Rate-Karte      | **MapLibre GL JS** + **OpenFreeMap** Vektor-Tiles (Fallback: OSM-Raster) | ja, kein Key |
| Spieldaten      | **`localStorage`** (Highscores, Theme) + **`sessionStorage`** (laufende Reise) | ja |
| Hosting         | **GitHub Pages** (Public-Repo, Actions-Deploy) | ja |
| Musik (Phase 1.5) | **Suno**-AI-generierte MP3-Dateien         | ja (CC-BY-NC)      |

### Warum Wikimedia Commons statt Unsplash / Mapillary / Street View?

| Quelle              | Lizenz / Kosten        | Reliabilität        | Ergebnis           |
|---------------------|------------------------|---------------------|--------------------|
| Google Street View  | Kreditkarte ab Aufruf 5.001/Monat | sehr hoch | ❌ ausgeschlossen |
| Mapillary           | Token, kein KK; lückenhafte Coverage | mittel | ❌ verworfen      |
| Eigene SVG-Platzhalter | gratis, keine echten Bilder      | hoch  | ❌ kein Spiel     |
| Unsplash-Hotlinks   | gratis, aber instabil (URLs verschwinden, Inhalt passt nicht zum Label) | niedrig | ❌ verworfen |
| **Wikimedia Commons via Pageimages-API** | gratis, korrektes Motiv garantiert, stabile URLs | **hoch** | ✅ aktuell |

**Lessons learned:**
- **Wikipedia-Pageimages-API** (`/w/api.php?action=query&prop=pageimages&pithumbsize=1280`) liefert pro
  Wikipedia-Artikel **die offizielle Thumbnail-URL**, die garantiert in Wikimedias
  Cache liegt. Selbst gebastelte Thumb-URLs können 400 zurückgeben (Wikimedia generiert
  nicht alle Größen vor).
- **1280px** ist die Größe, die die API standardmäßig zurückliefert — funktioniert
  für alle Wahrzeichen. 1024px war für Taj Mahal nicht gecacht.

### Warum Vite + React statt Next.js?

GitHub Pages ist statisches Hosting → Vite buildet zu reinem HTML/CSS/JS, keine Server-
Komponenten nötig. Next.js wäre Overkill ohne Backend.

### Warum HashRouter?

GitHub Pages kann keine SPA-Routing-Fallbacks; ein Direktaufruf von `/highscore` würde
404. HashRouter packt die Route hinter `#`, der nicht zum Server geht. Saubere Lösung
ohne `404.html`-Trick.

---

## 4. Free-Tier-Limits (Stand 2026-05)

### GitHub Pages
- 100 GB Bandbreite / Monat (soft), max. 1 GB Repo-Größe
- 10 Builds / Stunde (Actions-basiert)
- Reicht für Schülerprojekt locker

### OpenFreeMap
- „Free Forever, No Limits" laut Anbieter (community-finanziert)
- Vektor-Tiles, kein Key, kein Account

### Wikimedia Commons
- Hotlinking erlaubt für moderate Nutzung
- Bei viel Traffic: lokales Hosten der Bilder (HEAD-Request-Caching auf GitHub-CDN)

### Suno (für später)
- Free-Plan: 50 Songs / Monat, **CC-BY-NC** — non-commercial only.

---

## 5. Phase 1 — MVP-Scope

### Entscheidungen (mit Michael abgestimmt)

| Frage                  | Antwort                                              |
|------------------------|------------------------------------------------------|
| Login?                 | Nein (kein Backend)                                  |
| Highscore?             | Lokal in `localStorage`, Top 10                      |
| Region?                | Weltweit (10 kuratierte Wahrzeichen)                 |
| UI-Sprache             | Deutsch                                              |
| Theme                  | Dark + Light, in `localStorage`                      |
| Bildquelle             | Wikimedia Commons Hotlinks                           |
| Rate-Karte             | MapLibre + OpenFreeMap                               |
| Hosting                | GitHub Pages                                         |
| Musik                  | Phase 1.5 (Suno, sobald Tracks da)                   |
| Pflicht-Seiten         | Datenschutz + Impressum                              |

### Features — alle erledigt ✓

- ✓ Startseite mit Hero, Compass-Rose, Nickname-Eingabe
- ✓ 5 Etappen pro Reise (römische Numerale I–V)
- ✓ Bild + MapLibre-Karte zum Tippen, mit Tipp/Wahrheits-Markern und Linie
- ✓ Haversine-Scoring, Etappenwertung mit „Weiter / Endergebnis"-Knopf
- ✓ Animierter Victory-Screen mit Count-up der Punktzahl + Etappenbuch
- ✓ Lokale Top-10-Tafel, sortiert, mit Reset-Button
- ✓ Datenschutz + Impressum (Wikimedia + OpenFreeMap + GitHub als Drittanbieter)
- ✓ Dark/Light-Toggle, Vor-Hydration-Skript gegen FOUC
- ✓ Debug-Mode (`?debug=1`): zeigt Wahrheits-Pin live, Skip-Button, mehr Logs
- ✓ Always-on Console-Logs für High-Level-Events (Spielstart, Tipp, Endscore)
- ✓ Wiederaufnahme der laufenden Reise via `sessionStorage` (Tafel/Datenschutz/
  Impressum verlieren keine Spielfortschritte)

### Bewusst NICHT in Phase 1
- Multiplayer / globales Leaderboard
- Login / Konten
- Mobile-optimiertes UI über das hinaus, was Tailwind eh liefert
- Schwierigkeitsgrade, Zeitlimit pro Etappe
- Custom Maps / eigene Location-Sets
- Musik (auf 1.5 verschoben)

---

## 6. Designsprache — Editorial Travel Almanac

Klare Abkehr vom Tech-Flat-Look. Inspiration: alte Reise-Almanache, Atlanten,
National-Geographic-Editorial.

**Palette (CSS-Tokens via Tailwind 4 `@theme`):**
- `--color-cream: #f5f1e8` — Papier
- `--color-ink: #1c1917` — Tinte
- `--color-rust: #b45309` — primärer Akzent (Buttons, Links, Marker-Tipp)
- `--color-moss: #3f6212` — Wahrheits-Marker auf der Karte
- `--color-gold: #ca8a04` — Erstplatzierter, Debug-Badge
- `--color-paper-rule: rgba(28, 25, 23, 0.10)` — Trennlinien

Dark Mode invertiert die Cream/Ink-Achse, die Akzente bleiben warm.

**Typografie:**
- **Fraunces** (Variable Serif mit `opsz` und Italic) — alle Überschriften, Numerals
- **Manrope** (Variable Sans) — Body, Buttons, Smallcaps
- **Smallcaps** (`font-variant-caps: all-small-caps`, weite Tracking) für UI-Marken

**Decorations:**
- Compass-Rose-SVG mit langsamer 90-s-Rotation auf Start
- Topografische Radialgradienten (Rust + Moss) als Hero-Hintergrund
- Subtiles SVG-Noise-Korn als fixer Body-Overlay (`paper-grain`)
- Editorial-Trennlinien mit Inline-Smallcaps-Label
- Etappen sind I, II, III, IV, V — keine arabischen Ziffern in Headlines
- Karten-Canvas im Dark Mode via CSS-Filter invertiert (Marker bleiben unberührt)

**Animations** (alle CSS-only, keine Lib):
- `rise`, `rise-1` … `rise-4` — staggered Fade-up beim Mount
- `pulse-soft` — pulsierender Punkt für „Reise läuft"-Pille
- `spin-slow` — 90 s/Umdrehung Compass-Rose
- Count-up der Endpunktzahl auf Victory (1.4 s ease-out)

---

## 7. Architektur

### Verzeichnisstruktur (aktuell)

```
geolater/
├── plan.md                     ← dieses Dokument
├── README.md
├── package.json
├── vite.config.ts              ← base: "/geolater/"
├── tsconfig.{json,app,node}.json
├── index.html                  ← Theme-Bootstrap, paper-grain class
├── .github/workflows/deploy.yml ← Auto-Deploy
├── public/
│   ├── favicon.svg
│   └── locations/
│       └── README.md           ← Anleitung Bilder
├── src/
│   ├── main.tsx                ← Debug-Init, Console-Banner
│   ├── App.tsx                 ← HashRouter, Routes
│   ├── index.css               ← @theme Tokens, Animations, paper-grain
│   ├── pages/
│   │   ├── Layout.tsx          ← Header (Logo, Tafel, Debug-Badge,
│   │   │                          „Reise läuft"-Pille, Theme-Toggle), Footer
│   │   ├── Start.tsx           ← Hero, Compass, Nickname-Form, Resume-Button
│   │   ├── Spiel.tsx           ← 5 Etappen, useState + sessionStorage-Resume
│   │   ├── Victory.tsx         ← Count-up, Etappenbuch, „Neue Reise"
│   │   ├── Highscore.tsx       ← Top-10-Tafel, Reset
│   │   ├── Datenschutz.tsx     ← Editorial-Sections (I–VI)
│   │   └── Impressum.tsx       ← Editorial-Sections (I–VI), Kolophon
│   ├── components/
│   │   ├── BildPanel.tsx       ← Bild + Etappen-Marke + Reveal + Fallback
│   │   ├── GuessMap.tsx        ← MapLibre, OpenFreeMap, Marker, Linie
│   │   ├── RoundResult.tsx     ← Etappenwertung-Karte
│   │   ├── ThemeToggle.tsx     ← Sonne/Mond-Icon
│   │   └── CompassRose.tsx     ← SVG-Kompass mit Strahlen + N/E/S/W
│   ├── lib/
│   │   ├── types.ts            ← Location, Round, GameResult, StoredScore
│   │   ├── locations.ts        ← Pool laden, zufällig ziehen, imageUrl()
│   │   ├── scoring.ts          ← Haversine, pointsFromDistance, formatDistance
│   │   ├── highscore.ts        ← localStorage-CRUD für Top-10
│   │   ├── theme.ts            ← Dark/Light-Toggle + Persistenz
│   │   ├── debug.ts            ← log() always, debugLog/Group/Table gated
│   │   └── gameSession.ts      ← sessionStorage-Resume der laufenden Reise
│   └── data/
│       └── locations.json      ← 10 Wahrzeichen mit Wikimedia-URL + Lat/Lng
└── (kein .env nötig — keine API-Keys)
```

### Datenmodell

**`localStorage`** (überlebt Tab-Schließen):
```ts
"geolater:scores"        // StoredScore[] — Top 10
"geolater:theme"         // "dark" | "light"
"geolater:lastNickname"  // string
"geolater:debug"         // "1" | "0"
```

**`sessionStorage`** (verschwindet beim Tab-Schließen):
```ts
"geolater:activeGame"  // ActiveGame — laufende Reise (Etappe, Tipp, Phase, …)
```

### Scoring-Formel

```ts
const points = Math.round(5000 * Math.exp(-distanceKm / 2000));
// 0 km → 5000, 1000 km → ~3032, 5000 km → ~410, 20000 km → ~0
// Maximum pro Reise: 25.000 Punkte
```

### Logging — zwei Ebenen

**Always-on (`log()`)**, sichtbar mit Rust-Badge `geolater`:
- App geladen
- Spielsession startet (Spieler, Anzahl Runden)
- Aktive Reise wiederhergestellt
- Etappe N läuft (ohne Stadtname → kein Spoiler)
- Etappe N: <Stadt> mit Tipp/Ziel/Distanz/Punkten (nach Tipp-Abgabe)
- Reise beendet (Gesamtpunkte)
- Highscore gespeichert
- `BildPanel` loggt onLoad (geladen) und onError (rote Warnung mit URL)

**Debug-only (`?debug=1`, Gold-Badge `debug`):**
- Wahre Position der aktuellen Etappe (Spoiler)
- Komplette Pool-Tabelle als `console.table`
- Skip-Runde-Aktion
- Genaues Lat/Lng des Tipps und Ziels

---

## 8. Aufgabenliste

| # | Aufgabe                                       | Status              |
|---|-----------------------------------------------|---------------------|
| 1 | Stack festlegen + Scaffold                    | ✓ erledigt          |
| 2 | Game-UI, Scoring, Rundenlogik                 | ✓ erledigt          |
| 3 | Lokale Highscore-Tafel                        | ✓ erledigt          |
| 4 | Victory-Screen + Count-up                     | ✓ erledigt          |
| 5 | Dark/Light-Mode                               | ✓ erledigt          |
| 6 | Datenschutz + Impressum                       | ✓ erledigt          |
| 7 | Debug-Mode + Console-Logging zweistufig       | ✓ erledigt          |
| 8 | OpenFreeMap statt OSM-Raster                  | ✓ erledigt          |
| 9 | Bilder: Wikimedia Commons via Pageimages-API  | ✓ erledigt          |
|10 | Editorial Redesign (Fraunces/Manrope, Cream)  | ✓ erledigt          |
|11 | Wiederaufnahme via `sessionStorage`           | ✓ erledigt          |
|12 | GitHub Pages Auto-Deploy                      | ✓ erledigt          |
|13 | Musik (Suno) einbinden                        | offen, Phase 1.5    |
|14 | PWA (Manifest + Service Worker)               | offen, Vorarbeit Stores |
|15 | Spenden-Link (Ko-fi/BMC)                      | offen, optional     |

---

## 9. Datenschutz / Impressum

### Was wird gespeichert?
- **Browser (`localStorage` + `sessionStorage`):** Nickname, Highscores, Theme,
  Debug-Flag, laufende Reise. Verlässt das Gerät nie.
- **Server-seitig:** nichts.
- **Cookies:** keine.

### Drittanbieter (verarbeiten IP)
- **GitHub Pages** — Hosting
- **OpenFreeMap** (`tiles.openfreemap.org`) — Karten-Tiles
- **OpenStreetMap** — Datenquelle (Fallback)
- **Wikimedia Commons** (`upload.wikimedia.org`) — Standortbilder

### Impressum (Schüler)
```
Stefan Waßmann · Quellweg 36A · 15345 Rehfelde · Deutschland
E-Mail: st.ar.wassmann@gmx.de
Privates Schülerprojekt, nicht kommerziell.
```

---

## 10. Phasen-Roadmap (nach MVP)

### Phase 1.5 — Politur & Begleitfeatures
- Suno-Tracks einbinden (Hintergrundmusik mit Mute/Volume, in `localStorage`)
- Optional: Spenden-Link im Footer (Ko-fi / Buy Me a Coffee, ohne Tracking-Skripte)
- Mehr Locations (z. B. 30+) und/oder Schwierigkeitsgrade

### Phase 2 — App-Tauglichkeit
- **PWA** — Manifest + Service Worker + Install-Prompt + Offline-Fallback
- Mobile-Polish (Touch-Map-Geste, größere Tap-Targets)
- Eigene Domain (optional)

### Phase 3 — Stores (falls gewünscht)
- **Google Play**: TWA via Bubblewrap/PWA Builder, 25 USD einmalig (Stefan)
- **Apple App Store**: Capacitor-Wrapper, 99 USD/Jahr (Stefan)
- Erfordert: kommerzielle Klarstellung im Impressum, ggf. Gewerbeanmeldung
- Bilder dann lokal hosten (Wikimedia-Hotlinks bei kommerziellem Maßstab unsauber)

### Phase 4 — Multiplayer (falls gewollt)
- WebRTC oder leichter WebSocket-Server (Cloudflare Workers Free + KV)
- Räume mit Code zum Beitreten

### Phase 5 — Custom Content
- Eigene Location-Sets (Themen, Regionen)
- Community-Sets teilen via JSON-Export

---

## 11. Offene Fragen / Risiken

- [ ] **Wikimedia-Hotlinking-Politur**: bei viralem Traffic sollten wir die Bilder
      ins Repo packen. Aktuell pro Bild ~150 KB hotgelinkt → bei 1.000 Spielsessions/Tag
      sind das ~750 MB Wikimedia-Traffic — vertretbar, aber nicht Ewigkeit-skalierbar.
- [ ] **Hobby-Plan auf GitHub Pages** ist offiziell „nicht für kommerzielle Zwecke";
      bei Monetarisierung (Phase 3) Hosting-Wechsel auf Cloudflare Pages prüfen.
- [ ] **Suno-Lizenz**: Free-Tier ist CC-BY-NC, also nicht für Monetarisierung erlaubt.
- [ ] **Anti-Cheat**: clientseitige Scores sind manipulierbar. Bewusst akzeptiert,
      weil kein Backend. Bei globalem Leaderboard (Phase 4) anders lösen.
- [ ] **Wikipedia-API-Limits**: Pageimages wird nur einmal beim Erstellen des
      Location-Pools angefragt (offline, durch uns) — der Spieler ruft sie nie auf.
      Daher kein Laufzeit-Risiko.

---

## 12. Designnotizen

> Dieser Abschnitt ist für Michael — füllen, wenn Mockups/Skizzen anstehen.

(Platzhalter — Logo-Varianten, mögliche Farb-Tweaks, Mobile-Layouts hier ergänzen)
