# Borderline: guess the country 🌍

This is a small geography game. A map shows only country borders, with no names and no labels. One country is highlighted, and you type its name.

**Play:** open `index.html` through any static web server, or deploy it to GitHub Pages from the repo root. Nothing needs to be built, and the site makes no CDN calls at runtime.

## How to play
1. Pick a map: Europe, Africa, Asia, North & Central America, South America, Oceania or the whole world.
2. Pick a level (see below) and press **Start round**.
3. A country turns orange. Type its name and press **Submit** or <kbd>Enter</kbd>.
4. The game tells you if you were right or wrong and shows the correct name on the map. Press **Next** or <kbd>Enter</kbd> to continue.
5. After 10 questions you get a summary that lists every answer. Press **Practise my mistakes** to replay only the countries you missed.

Drag to pan the map, and scroll or pinch to zoom. The map buttons are ＋ (zoom in), － (zoom out), ◎ (jump to the highlighted country) and ⤢ (reset the view). Very small countries get a pulsing ring so you can find them.

## Levels
| | Easy | Medium | Hard |
|---|---|---|---|
| Countries asked | Large or well-known ones only | Most countries; skips micro-states and tiny islands under 2,500 km² | Every country (197), including the Vatican, Monaco, Nauru, Tuvalu and so on |
| Map help | Zooms in to the country automatically | Zooms in a little, only for very small countries | No automatic zoom |
| Typing help | Name suggestions while you type | None | None |
| Hint | Pick from 4 options (half points) | First letter and length (half points) | No hints |
| Typo tolerance | 1–2 letters | 1–2 letters | 1 letter, and only for names of 7+ letters |
| Timer | – | – | 20 s per question, +5 pts for each second left |

**Scoring:** a correct answer is worth 100 points. A streak adds 10 points per correct answer in a row, up to +50. Your best score for each map and level is saved in `localStorage`.

## Answer matching
- Case, accents, punctuation, "the" and "St."/"Saint" don't matter.
- Common alternative names are accepted, for example USA / America / United States, UK / Great Britain / Britain, Czechia / Czech Republic, Ivory Coast / Côte d'Ivoire, Holland / Netherlands, DRC / Congo-Kinshasa, Turkey / Türkiye, Burma, Swaziland, East Timor and Macedonia.
- Small typos are forgiven, but only when the typo isn't closer to another country. "Slovakia" for Slovenia, "Niger" for Nigeria and "Iran" for Iraq all count as wrong.

## Files
```
index.html               markup
css/style.css            styles (light/dark theme)
js/app.js                game logic, map rendering (d3-geo + d3-zoom)
js/match.js              forgiving answer matching (also works in Node)
data/world.js            country shapes: TopoJSON, simplified Natural Earth 1:50m (~0.4 MB)
vendor/d3.min.js         d3 v7.9.0 (ISC)
vendor/topojson-client.min.js  topojson-client v3 (ISC)
tools/build-data.mjs     script that regenerated data/world.js
```

## Data and projections
- Shapes come from Natural Earth admin-0 countries at 1:50m (public domain). They were simplified with mapshaper, and the topology is kept, so neighbours share their borders.
- Northern Cyprus is merged into Cyprus, Somaliland into Somalia, and Åland into Finland.
- Russia appears on both the Europe and Asia maps. Türkiye, Cyprus, Georgia, Armenia and Azerbaijan do too.
- Territories such as Greenland, Puerto Rico, Western Sahara and Hong Kong are drawn on the map but never asked.
- Each continent uses its own Lambert azimuthal equal-area projection, fitted to that continent. Europe is cropped to Europe, so it isn't stretched by Siberia. The world map uses Natural Earth projection.

### Rebuilding the data (optional)
```
npm i mapshaper d3@7
curl -LO https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson
mv ne_50m_admin_0_countries.geojson ne50.geojson
npx mapshaper ne50.geojson -filter 'CONTINENT!="Antarctica"' \
  -each 'gid = ({CYN:"CYP",SOL:"SOM",ALD:"FIN"})[ADM0_A3] || ADM0_A3' -dissolve2 gid \
  -simplify 50% keep-shapes -o format=topojson quantization=100000 world_raw.json
node tools/build-data.mjs
```

## Deploying on GitHub Pages
Push these files to the root of a repository. Then go to Settings → Pages → *Deploy from a branch*, and choose `main` / `(root)`. The `.nojekyll` file is already included.
