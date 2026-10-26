"use strict";

const DUBLIN = "Europe/Dublin";
const pluralRules = new Intl.PluralRules("sk");
const euro = new Intl.NumberFormat("sk-SK", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const integer = new Intl.NumberFormat("sk-SK");

const STATUS_SK = {
  "for sale": "na predaj",
  "deposit taken": "záloha",
  removed: "stiahnutý",
  sold: "predané",
};

const SALE_SK = {
  "on sale": "v predaji",
  predpredaj: "predpredaj",
  "vypredané": "vypredané",
  "sold out": "vypredané",
};

const WEEKDAYS = ["ne", "po", "ut", "st", "št", "pi", "so"];

const state = {
  data: null,
  model: "all",
  sort: "price-asc",
  region: "all",
};

function el(tag, options = {}) {
  const node = document.createElement(tag);
  if (options.className) node.className = options.className;
  if (options.attrs) {
    for (const [key, value] of Object.entries(options.attrs)) {
      if (value != null) node.setAttribute(key, String(value));
    }
  }
  if (options.text != null) node.append(document.createTextNode(options.text));
  for (const child of options.children || []) {
    if (child != null) node.append(child);
  }
  return node;
}

function safeUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value, window.location.href);
    if (url.protocol === "https:" || url.protocol === "http:") return url.href;
  } catch {
    return null;
  }
  return null;
}

function externalLink(url, className, text) {
  const href = safeUrl(url);
  if (!href) return el("span", { className, text });
  return el("a", {
    className,
    text,
    attrs: {
      href,
      target: "_blank",
      rel: "noopener noreferrer",
    },
    children: [el("span", { className: "sr-only", text: " (nové okno)" })],
  });
}

function asNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const number = Number(value);
    if (Number.isFinite(number)) return number;
  }
  return null;
}

function countPhrase(count, forms) {
  const word = forms[pluralRules.select(count)] || forms.other;
  return `${count} ${word}`;
}

function dublinToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: DUBLIN,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function formatUpdated(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "neznámy čas";
  const day = new Intl.DateTimeFormat("sk-SK", {
    timeZone: DUBLIN,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  const time = new Intl.DateTimeFormat("sk-SK", {
    timeZone: DUBLIN,
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
  return `${day} o ${time}`;
}

function formatKm(km) {
  const number = asNumber(km);
  if (number == null) return null;
  return `${integer.format(number)} km`;
}

function formatEuro(value) {
  const number = asNumber(value);
  if (number == null) return null;
  return euro.format(number);
}

function sellerLabel(seller) {
  if (!seller) return null;
  if (String(seller).toLowerCase() === "private") return "súkromný";
  return String(seller);
}

function statusLabel(status) {
  if (!status) return "";
  const key = String(status).toLowerCase();
  return STATUS_SK[key] || String(status);
}

function statusClass(status) {
  const key = String(status || "").toLowerCase();
  if (key === "deposit taken") return "badge badge-hold";
  if (key === "removed" || key === "sold") return "badge badge-sold";
  if (key === "for sale") return "badge badge-sale";
  return "badge";
}

function saleLabel(value) {
  if (!value) return "";
  const key = String(value).toLowerCase();
  return SALE_SK[key] || String(value);
}

function saleClass(value) {
  const key = String(value || "").toLowerCase();
  if (key === "vypredané" || key === "sold out") return "badge badge-sold";
  if (key === "predpredaj") return "badge badge-hold";
  if (key === "on sale") return "badge badge-sale";
  return "badge";
}

function priceDropped(item, previousKey, currentKey) {
  const previous = asNumber(item[previousKey]);
  const current = asNumber(item[currentKey]);
  return previous != null && current != null && previous > current;
}

function isUpcoming(date, today) {
  return typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= today;
}

function compareBikes(a, b, sort) {
  const [key, direction] = sort.split("-");
  const sign = direction === "desc" ? -1 : 1;
  const aValue = asNumber(key === "km" ? a.km : a.price_eur);
  const bValue = asNumber(key === "km" ? b.km : b.price_eur);
  if (aValue == null && bValue == null) return String(a.title || "").localeCompare(String(b.title || ""), "sk");
  if (aValue == null) return 1;
  if (bValue == null) return -1;
  if (aValue !== bValue) return (aValue - bValue) * sign;
  const priceDelta = (asNumber(a.price_eur) || 0) - (asNumber(b.price_eur) || 0);
  if (priceDelta !== 0) return priceDelta;
  return String(a.title || "").localeCompare(String(b.title || ""), "sk");
}

function bikePhoto(bike, href) {
  const link = el("a", {
    className: "photo",
    attrs: href ? { href, target: "_blank", rel: "noopener noreferrer" } : null,
  });
  if (!bike.id && !bike.photo_url) {
    link.classList.add("is-missing");
    link.textContent = "bez fotky";
    return link;
  }
  const image = el("img", {
    attrs: {
      alt: bike.title ? `Fotka: ${bike.title}` : "",
      width: "300",
      height: "225",
      decoding: "async",
      loading: "lazy",
    },
  });
  const local = bike.id ? `img/bikes/${encodeURIComponent(bike.id)}.jpg` : "";
  const remote = safeUrl(bike.photo_url);
  image.src = local || remote || "";
  image.addEventListener("error", () => {
    if (remote && image.dataset.fallback !== "1" && image.src !== remote) {
      image.dataset.fallback = "1";
      image.src = remote;
      return;
    }
    link.classList.add("is-missing");
    link.textContent = "bez fotky";
  });
  link.append(image);
  return link;
}

function renderBikes() {
  const list = document.getElementById("bike-list");
  const gone = document.getElementById("bike-gone");
  const count = document.getElementById("bike-count");
  const bikes = (state.data.bikes || []).filter((bike) => state.model === "all" || bike.model === state.model);
  bikes.sort((a, b) => compareBikes(a, b, state.sort));

  count.textContent = countPhrase(bikes.length, {
    one: "inzerát",
    few: "inzeráty",
    many: "inzerátov",
    other: "inzerátov",
  });

  list.replaceChildren();
  if (!bikes.length) {
    list.append(el("p", { className: "empty", text: "Žiadne inzeráty v tomto filtri." }));
  } else {
    for (const bike of bikes) {
      const href = safeUrl(bike.url);
      const dropped = priceDropped(bike, "previous_price_eur", "price_eur");
      const price = formatEuro(bike.price_eur) || "cena neuvedená";
      const previous = dropped ? formatEuro(bike.previous_price_eur) : null;
      const meta = [bike.year ? String(bike.year) : null, formatKm(bike.km), bike.location || null]
        .filter(Boolean)
        .join(" · ");
      const seller = sellerLabel(bike.seller);
      const status = statusLabel(bike.status);
      const change = bike.change ? String(bike.change) : "";
      const showChange = change && change.toLowerCase() !== status.toLowerCase();
      let changeClass = "change";
      if (/↓|zľav|kles/i.test(change) || (dropped && change && change.toLowerCase() !== "bez zmeny")) {
        changeClass = "change change-drop";
      } else if (/záloh/i.test(change)) {
        changeClass = "change change-hold";
      }

      const priceBlock = el("div", {
        className: "bike-price",
        children: [
          el("p", { className: "now", text: price }),
          previous
            ? el("p", {
                className: "was",
                children: [
                  el("s", {
                    children: [
                      el("span", { className: "sr-only", text: "pôvodná cena " }),
                      previous,
                    ],
                  }),
                ],
              })
            : null,
        ],
      });

      list.append(
        el("article", {
          className: "bike",
          children: [
            bikePhoto(bike, href),
            el("div", {
              className: "bike-body",
              children: [
                el("div", {
                  className: "bike-top",
                  children: [externalLink(bike.url, "bike-title", bike.title || "Inzerát"), priceBlock],
                }),
                meta ? el("p", { className: "meta", text: meta }) : null,
                el("p", {
                  className: "sub",
                  children: [
                    seller ? el("span", { className: "seller", text: seller }) : null,
                    status ? el("span", { className: statusClass(bike.status), text: status }) : null,
                    showChange ? el("span", { className: changeClass, text: change }) : null,
                  ],
                }),
              ],
            }),
          ],
        })
      );
    }
  }

  gone.replaceChildren();
  const removed = state.data.bikes_gone || [];
  if (!removed.length) return;

  const items = removed.map((bike) => {
    const bits = [formatEuro(bike.last_price_eur), sellerLabel(bike.seller), bike.location || null].filter(Boolean);
    return el("li", {
      children: [
        externalLink(bike.url, null, bike.title || "Inzerát"),
        bits.length ? el("p", { text: bits.join(" · ") }) : null,
        bike.change ? el("p", { text: String(bike.change) }) : null,
      ],
    });
  });

  gone.append(
    el("div", {
      className: "gone-block",
      children: [
        el("h3", { text: "Stiahnuté inzeráty" }),
        el("ul", { className: "gone", children: items }),
      ],
    })
  );
}

function monthLabel(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("sk-SK", { month: "long", year: "numeric" }).format(new Date(year, month - 1, day));
}

function supportLine(support) {
  if (!Array.isArray(support) || !support.length) return "";
  const names = support.map((name) => String(name)).filter(Boolean);
  if (!names.length) return "";
  const label = names.length === 1 ? "Predkapela" : "Predkapely";
  return `${label}: ${names.join(", ")}`;
}

function matchMark(concert) {
  const note = String(concert.note || "").trim();
  const artist = String(concert.artist || "");
  const tribute = /tribute/i.test(artist) || /^tribute$/i.test(note);
  if (tribute) return `tribut · ${concert.match || artist}`;
  if (concert.match && concert.match !== artist) return `cez predkapelu · ${concert.match}`;
  return "";
}

function usefulNote(concert) {
  const note = String(concert.note || "").trim();
  if (!note || /^tribute$/i.test(note)) return "";
  if (concert.match && note.toLowerCase() === String(concert.match).toLowerCase()) return "";
  return note;
}

function whereLine(concert) {
  const city = concert.country === "GB" && concert.city ? `${concert.city} (Severné Írsko)` : concert.city;
  return [city, concert.venue].filter(Boolean).join(" · ");
}

function renderConcerts() {
  const list = document.getElementById("gig-list");
  const count = document.getElementById("gig-count");
  const today = dublinToday();
  const concerts = (state.data.concerts || [])
    .filter((concert) => isUpcoming(concert.date, today))
    .filter((concert) => state.region === "all" || concert.region === state.region)
    .sort((a, b) => {
      const byDate = String(a.date).localeCompare(String(b.date));
      if (byDate !== 0) return byDate;
      const byTime = String(a.time || "99:99").localeCompare(String(b.time || "99:99"));
      if (byTime !== 0) return byTime;
      return String(a.city || "").localeCompare(String(b.city || ""), "sk");
    });

  count.textContent = countPhrase(concerts.length, {
    one: "koncert",
    few: "koncerty",
    many: "koncertov",
    other: "koncertov",
  });

  list.replaceChildren();
  if (!concerts.length) {
    list.append(el("p", { className: "empty", text: "Žiadne nadchádzajúce koncerty." }));
    return;
  }

  let month = "";
  for (const concert of concerts) {
    if (concert.date.slice(0, 7) !== month) {
      month = concert.date.slice(0, 7);
      list.append(el("h3", { className: "month", text: monthLabel(concert.date) }));
    }
    const [year, monthNumber, day] = concert.date.split("-").map(Number);
    const weekday = WEEKDAYS[new Date(year, monthNumber - 1, day).getDay()];
    const mark = matchMark(concert);
    const note = usefulNote(concert);
    const lineup = supportLine(concert.support);
    const sale = saleLabel(concert.on_sale);

    list.append(
      el("article", {
        className: "gig",
        children: [
          el("time", {
            className: "gig-date",
            attrs: { datetime: concert.time ? `${concert.date}T${concert.time}` : concert.date },
            children: [
              el("span", { className: "wd", text: weekday }),
              el("span", { className: "day", text: `${day}. ${monthNumber}.` }),
              el("span", { className: "year", text: String(year) }),
              concert.time ? el("span", { className: "time", text: concert.time }) : null,
            ],
          }),
          el("div", {
            className: "gig-main",
            children: [
              el("p", { className: "artist", text: concert.artist || "Koncert" }),
              el("p", { className: "where", text: whereLine(concert) }),
              lineup ? el("p", { className: "support", text: lineup }) : null,
              note ? el("p", { className: "note", text: note }) : null,
              mark || sale
                ? el("div", {
                    className: "gig-tags",
                    children: [
                      mark ? el("span", { className: "badge badge-mark", text: mark }) : null,
                      sale ? el("span", { className: saleClass(concert.on_sale), text: sale }) : null,
                    ],
                  })
                : null,
            ],
          }),
          el("div", {
            className: "gig-side",
            children: [
              concert.price ? el("p", { className: "gig-price", text: String(concert.price) }) : null,
              concert.ticket_url ? externalLink(concert.ticket_url, "ticket", "Vstupenky") : null,
            ],
          }),
        ],
      })
    );
  }
}

function showError() {
  const message = "Dáta sa nepodarilo načítať. Skús obnoviť stránku.";
  document.getElementById("updated").textContent = "neznámy čas";
  document.getElementById("bike-list").replaceChildren(el("p", { className: "error", attrs: { role: "alert" }, text: message }));
  document.getElementById("gig-list").replaceChildren();
  document.getElementById("bike-count").textContent = "";
  document.getElementById("gig-count").textContent = "";
}

function render() {
  const updated = document.getElementById("updated");
  const iso = state.data.updated;
  updated.dateTime = iso || "";
  updated.textContent = iso ? formatUpdated(iso) : "neznámy čas";
  renderBikes();
  renderConcerts();
}

function bindControls() {
  document.querySelectorAll("[data-model]").forEach((button) => {
    button.addEventListener("click", () => {
      state.model = button.dataset.model;
      document.querySelectorAll("[data-model]").forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });
      renderBikes();
    });
  });

  document.getElementById("bike-sort").addEventListener("change", (event) => {
    state.sort = event.target.value;
    renderBikes();
  });

  document.querySelectorAll("[data-region]").forEach((button) => {
    button.addEventListener("click", () => {
      state.region = button.dataset.region;
      document.querySelectorAll("[data-region]").forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });
      renderConcerts();
    });
  });
}

async function init() {
  bindControls();
  try {
    const response = await fetch(new URL("data/data.json", document.baseURI), { cache: "no-cache" });
    if (!response.ok) throw new Error(String(response.status));
    state.data = await response.json();
    render();
  } catch {
    showError();
  }
}

init();
