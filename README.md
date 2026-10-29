# Radar

Osobná statická stránka pre Jica: sledované jazdené motorky z DoneDeal a nadchádzajúce koncerty. Žiadny build. GitHub Pages berie vetvu `main` z koreňa repozitára: [jicarosni.github.io/mr.pear](https://jicarosni.github.io/mr.pear/).

Súbor `.nojekyll` je v koreni naschvál, aby Pages nespracúvali stránku cez Jekyll.

## Denná aktualizácia

Stačí nahradiť `data/data.json`. Stránka ho načíta cez `fetch` pri každom otvorení. HTML, CSS ani JS netreba meniť.

Pri novom inzeráte ulož malú fotku (okolo 300 px na šírku) ako `img/bikes/<id>.jpg`, kde `<id>` je DoneDeal id z poľa `id`. DoneDeal fotky často odmietnu priame vkladanie, preto stránka používa lokálny súbor a `photo_url` len ako zálohu.

Lokálny náhľad:

```bash
python3 -m http.server
```

Potom otvor `http://localhost:8000/`. Otvorenie `index.html` priamo zo súboru nenačíta JSON.

## Formát `data/data.json`

Kódovanie UTF-8. Časy koncertov sú miestne časy konania, pole `updated` je časová pečiatka ISO-8601. Na stránke sa `updated` zobrazí v časovom pásme Europe/Dublin.

```json
{
  "updated": "2026-10-26T22:56:05+00:00",
  "bikes": [],
  "bikes_gone": [],
  "concerts": []
}
```

### `bikes`

Aktívne inzeráty.

| Pole | Význam |
| --- | --- |
| `id` | Id inzerátu. Názov súboru fotky `img/bikes/<id>.jpg`. |
| `model` | Filter: `trident`, `cb500` (CB500F/Hornet) alebo `cb650r`. |
| `title` | Názov inzerátu, odkaz na `url`. |
| `url` | Odkaz na DoneDeal. |
| `price_eur` | Aktuálna cena v eurách, číslo. |
| `previous_price_eur` | Predchádzajúca cena. Ak je vyššia ako `price_eur`, zobrazí sa prečiarknutá. |
| `year` | Rok výroby. |
| `km` | Najazdené kilometre, číslo. |
| `location` | Miesto. |
| `seller` | Predajca. Hodnota `private` sa zobrazí ako „súkromný“. |
| `status` | `for sale` → na predaj, `deposit taken` → záloha. |
| `change` | Krátky slovenský popis zmeny, napr. `bez zmeny`, `záloha`, `↓ z €7,600`, `NOVÉ`. Hodnota `NOVÉ` označí inzerát ako nový aj mimo 7-dňového okna. |
| `first_seen` | Dátum `RRRR-MM-DD` v Europe/Dublin, kedy sa inzerát prvýkrát objavil. Nový je, ak tento deň spadá do posledných 7 dní vrátane dňa z `updated`. |
| `photo_url` | Záložná adresa fotky, ak lokálny súbor chýba. |
| `photos` | Voliteľné. Stránka ho na zobrazenie nepotrebuje. |

### `bikes_gone`

Krátky zoznam stiahnutých inzerátov. Polia: `id`, `title`, `url`, `last_price_eur`, `seller`, `location`, `status`, `change`, `first_seen` (dátum `RRRR-MM-DD` v Europe/Dublin, kedy sa inzerát prvýkrát objavil).

### `concerts`

| Pole | Význam |
| --- | --- |
| `artist` | Hlavný interpret. |
| `support` | Pole mien predkapiel. Môže chýbať. |
| `date` | `RRRR-MM-DD`. Dátum starší ako dnešok v Europe/Dublin sa nezobrazí. |
| `first_seen` | Dátum `RRRR-MM-DD` v Europe/Dublin, kedy sa koncert prvýkrát objavil. Nový je, ak tento deň spadá do posledných 7 dní vrátane dňa z `updated`. |
| `time` | Voliteľný čas `HH:MM`. |
| `city`, `venue` | Mesto a miesto. |
| `region` | Filter: `IE` Írsko (vrátane Belfastu), `IT` Taliansko, `SK` Slovensko. |
| `country` | `IE`, `IT`, `SK` alebo `GB`. Pri `GB` sa k mestu pripojí „Severné Írsko“. |
| `price` | Text ceny tak, ako sa má zobraziť. Môže chýbať. |
| `on_sale` | `on sale` → v predaji, `predpredaj`, `vypredané`. Môže chýbať. |
| `ticket_url` | Odkaz na vstupenky. |
| `source_url` | Zdroj informácie. Stránka ho nezobrazuje. |
| `note` | Voliteľná poznámka pod koncertom. |
| `match` | Interpret zo zoznamu, ak zhoda nie je hlavná kapela. Spolu s `tribute` v názve alebo v `note` označí tribut, inak zhodu cez predkapelu. |

Nové položky sú v zozname vždy prvé. V rámci nových aj v rámci ostatných sa koncerty radia podľa dátumu a motorky podľa zvolenej ceny alebo kilometrov. Filtre modelu a krajiny sa kombinujú s prepínačom „Iba nové“.
