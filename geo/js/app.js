/* Borderline – guess the country. Plain JS + d3 (vendored). */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var M = window.GeoMatch;

  // ---------- data ----------
  var topo = window.WORLD_TOPO;
  var features = topojson.feature(topo, topo.objects.countries).features;
  features.forEach(function (f) { f.props = f.properties; });
  var byId = {}; features.forEach(function (f) { byId[f.id] = f; });
  var INDEX = M.buildIndex(features.map(function (f) { return { id: f.id, n: f.props.n, a: f.props.a }; }));
  // borders shared between countries (drawn once, crisper)

  // ---------- config ----------
  var QUESTIONS = 10;
  var HARD_SECONDS = 20;
  var REGIONS = [
    { id: "europe", label: "Europe", em: "🏰", proj: function () { return d3.geoAzimuthalEqualArea().rotate([-15, -53]).clipAngle(60); }, box: [-25, 34, 50, 71] },
    { id: "africa", label: "Africa", em: "🦁", proj: function () { return d3.geoAzimuthalEqualArea().rotate([-18, -2]).clipAngle(70); }, box: [-26, -36, 58, 38] },
    { id: "asia", label: "Asia", em: "🏯", proj: function () { return d3.geoAzimuthalEqualArea().rotate([-90, -32]).clipAngle(90); }, box: [26, -11, 146, 56] },
    { id: "namerica", label: "North & Central America", em: "🗽", proj: function () { return d3.geoAzimuthalEqualArea().rotate([100, -45]).clipAngle(85); }, box: [-168, 7, -52, 72] },
    { id: "samerica", label: "South America", em: "🦜", proj: function () { return d3.geoAzimuthalEqualArea().rotate([60, 18]).clipAngle(70); }, box: [-82, -56, -34, 13] },
    { id: "oceania", label: "Oceania", em: "🏝️", proj: function () { return d3.geoAzimuthalEqualArea().rotate([-165, 15]).clipAngle(80); }, box: [112, -48, 192, 12] },
    { id: "world", label: "Whole world", em: "🌍", proj: function () { return d3.geoNaturalEarth1(); }, box: [-180, -58, 180, 84], world: true }
  ];
  var LEVELS = [
    { id: "easy", label: "Easy", em: "●", d: "Big, well-known countries", bullets: ["Map zooms to the country", "Name suggestions while typing", "Hint: pick from 4 options"] },
    { id: "medium", label: "Medium", em: "●●", d: "Most countries (no micro-states)", bullets: ["No suggestions – type it yourself", "Typos forgiven", "Hint: first letter & length"] },
    { id: "hard", label: "Hard", em: "●●●", d: "Every country, incl. tiny islands", bullets: [HARD_SECONDS + " s timer, speed bonus", "No zoom help, no hints", "Only 1 typo allowed (long names)"] }
  ];
  var regionById = {}; REGIONS.forEach(function (r) { regionById[r.id] = r; });

  function inRegion(f, rid) { return rid === "world" ? true : f.props.r.indexOf(rid) >= 0; }
  function playable(rid) { return features.filter(function (f) { return f.props.p && inRegion(f, rid); }); }
  function wellKnown(f) { return f.props.km2 >= 20000 && (f.props.lr <= 3 || f.props.pop >= 1e7 || f.props.km2 >= 5e5); }
  function poolFor(rid, lvl) {
    var all = playable(rid);
    if (lvl === "hard") return all;
    if (lvl === "medium") return all.filter(function (f) { return f.props.km2 >= 2500; });
    var easy = all.filter(wellKnown);
    if (easy.length < 8) { // small regions (Oceania): top up with the largest countries
      var rest = all.filter(function (f) { return easy.indexOf(f) < 0; }).sort(function (a, b) { return b.props.km2 - a.props.km2; });
      easy = easy.concat(rest.slice(0, 8 - easy.length));
    }
    return easy;
  }

  // ---------- state ----------
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem("geoquiz:" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("geoquiz:" + k, JSON.stringify(v)); } catch (e) {} }
  };
  var S = {
    region: store.get("region", "europe"), level: store.get("level", "medium"),
    queue: [], i: 0, score: 0, streak: 0, bestStreak: 0, log: [], answered: false, hintUsed: false,
    timer: null, timeLeft: 0, practice: null
  };
  if (!regionById[S.region]) S.region = "europe";

  // ---------- start screen ----------
  function renderStart() {
    var rg = $("regionGrid"); rg.innerHTML = "";
    REGIONS.forEach(function (r) {
      var b = document.createElement("button");
      b.className = "opt"; b.setAttribute("role", "radio"); b.dataset.region = r.id;
      b.setAttribute("aria-checked", String(S.region === r.id));
      var n = playable(r.id).length;
      b.innerHTML = '<span class="em">' + r.em + '</span><span class="t">' + r.label + '</span><span class="d">' + n + " countries</span>";
      b.onclick = function () { S.region = r.id; store.set("region", r.id); renderStart(); };
      rg.appendChild(b);
    });
    var lg = $("levelGrid"); lg.innerHTML = "";
    LEVELS.forEach(function (l) {
      var b = document.createElement("button");
      b.className = "opt lvl-" + l.id; b.setAttribute("role", "radio"); b.dataset.level = l.id;
      b.setAttribute("aria-checked", String(S.level === l.id));
      var best = store.get("best:" + S.region + ":" + l.id, null);
      b.innerHTML = '<span class="em">' + l.em + '</span><span class="t">' + l.label + '</span><span class="d">' + l.d + "</span><ul>" +
        l.bullets.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>" +
        (best ? '<span class="best-tag">Best here: ' + best + " pts</span>" : "");
      b.onclick = function () { S.level = l.id; store.set("level", l.id); renderStart(); };
      lg.appendChild(b);
    });
    var pool = poolFor(S.region, S.level);
    $("poolInfo").textContent = pool.length + " possible countries · " + Math.min(QUESTIONS, pool.length) + " questions per round";
  }

  function show(id) {
    ["screen-start", "screen-game", "screen-summary"].forEach(function (s) { $(s).classList.toggle("active", s === id); });
    window.scrollTo(0, 0);
  }

  // ---------- map ----------
  var svg = d3.select("#map"), gRoot, gLand, gMark, gLabel, path, proj, W = 0, H = 0, zoom, curK = 1, drawnRegion = null;

  function edgePoints(b) {
    var pts = [], x0 = b[0], y0 = b[1], x1 = b[2], y1 = b[3], i, n = 24;
    for (i = 0; i <= n; i++) {
      var x = x0 + (x1 - x0) * i / n, y = y0 + (y1 - y0) * i / n;
      pts.push([x, y0], [x, y1], [x0, y], [x1, y]);
    }
    return { type: "MultiPoint", coordinates: pts };
  }

  function drawMap(force) {
    var wrap = $("mapWrap");
    var w = wrap.clientWidth, h = wrap.clientHeight;
    if (!force && w === W && h === H && drawnRegion === S.region) return;
    W = w; H = h; drawnRegion = S.region;
    var R = regionById[S.region];
    proj = R.proj();
    proj.fitExtent([[12, 12], [W - 12, H - 12]], R.world ? { type: "Sphere" } : edgePoints(R.box));
    if (R.world) { // trim Antarctica-ish south band: refit to box but keep sphere outline
      proj.fitExtent([[12, 12], [W - 12, H - 12]], edgePoints(R.box));
    }
    path = d3.geoPath(proj);
    svg.attr("viewBox", "0 0 " + W + " " + H);
    svg.selectAll("*").remove();
    gRoot = svg.append("g");
    if (R.world) gRoot.append("path").attr("class", "sphere").attr("d", path({ type: "Sphere" }));
    gLand = gRoot.append("g");
    gLand.selectAll("path").data(features).join("path")
      .attr("class", function (f) { return "country" + (inRegion(f, S.region) ? " in" : ""); })
      .attr("data-id", function (f) { return f.id; })
      .attr("d", path);
    gMark = gRoot.append("g");
    gLabel = gRoot.append("g");
    zoom = d3.zoom().scaleExtent([1, 80]).translateExtent([[0, 0], [W, H]]).extent([[0, 0], [W, H]])
      .on("zoom", function (e) { curK = e.transform.k; gRoot.attr("transform", e.transform); updateMarkerScale(); });
    svg.call(zoom).on("dblclick.zoom", null);
    curK = 1;
  }

  function parts(f) {
    var g = f.geometry; if (!g) return [];
    if (g.type === "Polygon") return [{ type: "Polygon", coordinates: g.coordinates }];
    return g.coordinates.map(function (c) { return { type: "Polygon", coordinates: c }; });
  }
  // Geometry of a country as it appears in the current view (ignores far-away overseas parts).
  function visibleInfo(f) {
    var ps = parts(f).map(function (p) { return { b: path.bounds(p), a: path.area(p), p: p }; })
      .filter(function (o) { return isFinite(o.b[0][0]) && o.b[1][0] >= 0 && o.b[0][0] <= W && o.b[1][1] >= 0 && o.b[0][1] <= H; });
    if (!ps.length) return null;
    var main = ps.reduce(function (a, b) { return b.a > a.a ? b : a; });
    // keep parts reasonably close to the main part, for framing
    var mb = main.b, md = Math.max(mb[1][0] - mb[0][0], mb[1][1] - mb[0][1], 20);
    var near = ps.filter(function (o) {
      var cx = (o.b[0][0] + o.b[1][0]) / 2, cy = (o.b[0][1] + o.b[1][1]) / 2;
      var mx = (mb[0][0] + mb[1][0]) / 2, my = (mb[0][1] + mb[1][1]) / 2;
      return Math.hypot(cx - mx, cy - my) < md * 2.5 + 40;
    });
    var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    near.forEach(function (o) { x0 = Math.min(x0, o.b[0][0]); y0 = Math.min(y0, o.b[0][1]); x1 = Math.max(x1, o.b[1][0]); y1 = Math.max(y1, o.b[1][1]); });
    x0 = Math.max(0, x0); y0 = Math.max(0, y0); x1 = Math.min(W, x1); y1 = Math.min(H, y1);
    var c = path.centroid(main.p);
    if (!isFinite(c[0])) c = [(x0 + x1) / 2, (y0 + y1) / 2];
    // pull the label point inside the visible frame (e.g. Russia on the Europe map)
    if (c[0] < x0 || c[0] > x1 || c[1] < y0 || c[1] > y1) c = [(x0 + x1) / 2, (y0 + y1) / 2];
    return { bounds: [[x0, y0], [x1, y1]], center: c, size: Math.max(x1 - x0, y1 - y0) };
  }

  var markerInfo = null;
  function setMarker(info, cls) {
    gMark.selectAll("*").remove(); markerInfo = null;
    if (!info) return;
    markerInfo = { info: info, cls: cls || "" };
    gMark.append("circle").attr("class", "marker-pulse").attr("cx", info.center[0]).attr("cy", info.center[1]);
    gMark.append("circle").attr("class", "marker " + (cls || "")).attr("cx", info.center[0]).attr("cy", info.center[1]);
    updateMarkerScale();
  }
  function updateMarkerScale() {
    if (!markerInfo || !gMark) return;
    var visiblePx = markerInfo.info.size * curK;
    var show = visiblePx < 14;
    var r = Math.max(12, visiblePx / 2 + 8) / curK;
    gMark.selectAll("circle").attr("r", r).style("display", show ? null : "none");
    gLabel.selectAll("text").attr("font-size", 15 / curK).style("stroke-width", 4 / curK + "px")
      .attr("y", function () { return +this.dataset.cy + (show ? r + 16 / curK : 5 / curK); });
  }
  function zoomTo(b, maxK, frac, dur) {
    var dx = b[1][0] - b[0][0], dy = b[1][1] - b[0][1], cx = (b[0][0] + b[1][0]) / 2, cy = (b[0][1] + b[1][1]) / 2;
    var k = Math.max(1, Math.min(maxK, frac / Math.max(dx / W, dy / H, 1e-6)));
    var t = d3.zoomIdentity.translate(W / 2, H / 2).scale(k).translate(-cx, -cy);
    svg.transition().duration(dur == null ? 750 : dur).call(zoom.transform, t);
  }
  function resetZoom(dur) { svg.interrupt(); svg.transition().duration(dur == null ? 500 : dur).call(zoom.transform, d3.zoomIdentity); }

  // ---------- game ----------
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function startRound(practiceIds) {
    var pool = poolFor(S.region, S.level);
    S.practice = practiceIds || null;
    S.queue = practiceIds ? shuffle(practiceIds.map(function (id) { return byId[id]; })) : shuffle(pool).slice(0, Math.min(QUESTIONS, pool.length));
    S.i = 0; S.score = 0; S.streak = 0; S.bestStreak = 0; S.log = [];
    $("hudRegion").textContent = regionById[S.region].label + " · " + S.level[0].toUpperCase() + S.level.slice(1);
    $("hudTimerWrap").hidden = S.level !== "hard";
    $("suggest").hidden = true;
    show("screen-game");
    drawMap(true);
    ask();
  }

  function target() { return S.queue[S.i]; }

  function ask() {
    var f = target();
    S.answered = false; S.hintUsed = false;
    $("askBox").hidden = false; $("resultBox").hidden = true;
    $("hintBox").hidden = true; $("choices").hidden = true; $("choices").innerHTML = "";
    $("answerInput").value = ""; $("suggest").hidden = true;
    $("hintBtn").hidden = S.level === "hard"; $("hintBtn").disabled = false;
    $("answerInput").placeholder = S.level === "easy" ? "Start typing – suggestions will appear…" : "Type the country name…";
    updateHud();
    gLabel.selectAll("*").remove();
    gLand.selectAll("path").classed("target ok bad guess", false);
    var sel = gLand.select('path[data-id="' + f.id + '"]').classed("target", true);
    sel.raise();
    svg.interrupt(); svg.call(zoom.transform, d3.zoomIdentity); curK = 1;
    var info = visibleInfo(f);
    setMarker(info);
    if (info) {
      if (S.level === "easy") zoomTo(info.bounds, 10, 0.38);
      else if (S.level === "medium" && info.size < 14) zoomTo(info.bounds, 4, 0.1);
    }
    if (S.level === "hard") startTimer();
    if (!matchMedia("(pointer: coarse)").matches) setTimeout(function () { $("answerInput").focus(); }, 30);
  }

  function updateHud() {
    $("hudQ").textContent = Math.min(S.i + 1, S.queue.length) + "/" + S.queue.length;
    $("hudScore").textContent = S.score;
    $("hudStreak").textContent = S.streak + (S.streak >= 3 ? " 🔥" : "");
    $("progressBar").style.width = (100 * S.i / S.queue.length) + "%";
  }

  function startTimer() {
    stopTimer();
    S.timeLeft = HARD_SECONDS;
    var el = $("hudTimer"), wrap = $("hudTimerWrap");
    el.textContent = S.timeLeft; wrap.classList.remove("low");
    var t0 = Date.now();
    S.timer = setInterval(function () {
      S.timeLeft = Math.max(0, HARD_SECONDS - Math.floor((Date.now() - t0) / 1000));
      el.textContent = S.timeLeft; wrap.classList.toggle("low", S.timeLeft <= 5);
      if (S.timeLeft <= 0) { stopTimer(); submit($("answerInput").value, { timeout: true }); }
    }, 200);
  }
  function stopTimer() { if (S.timer) clearInterval(S.timer); S.timer = null; }

  function submit(text, opts) {
    if (S.answered) return;
    opts = opts || {};
    var f = target();
    var res = opts.skip ? { ok: false, empty: true } : M.check(text, f.id, INDEX, S.level);
    if (!opts.skip && !opts.timeout && res.empty) { $("answerInput").focus(); shake(); return; }
    S.answered = true; stopTimer(); $("suggest").hidden = true;
    var pts = 0;
    if (res.ok) {
      S.streak++; S.bestStreak = Math.max(S.bestStreak, S.streak);
      pts = 100 + 10 * Math.min(S.streak - 1, 5);
      if (S.level === "hard") pts += S.timeLeft * 5;
      if (S.hintUsed) pts = Math.round(pts / 2);
      S.score += pts;
    } else S.streak = 0;
    S.log.push({ id: f.id, name: f.props.n, given: opts.skip ? "" : String(text || "").trim(), ok: res.ok, typo: res.typo, pts: pts, timeout: !!opts.timeout && !res.ok });
    // map feedback
    var sel = gLand.select('path[data-id="' + f.id + '"]').classed(res.ok ? "ok" : "bad", true);
    if (!res.ok && res.matchedId && res.matchedId !== f.id && inRegion(byId[res.matchedId], S.region)) {
      gLand.select('path[data-id="' + res.matchedId + '"]').classed("guess", true);
    }
    var info = visibleInfo(f);
    if (markerInfo) gMark.select(".marker").classed(res.ok ? "ok" : "bad", true);
    gMark.select(".marker-pulse").remove();
    if (info) {
      gLabel.append("text").attr("class", "map-label").attr("x", info.center[0]).attr("data-cy", info.center[1]).text(f.props.n);
      updateMarkerScale();
    }
    // panel feedback
    var box = $("resultBox");
    box.className = "result " + (res.ok ? "ok" : "bad");
    var head, body;
    if (res.ok) {
      head = ["Correct! 🎉", "Nailed it! ✅", "Yes! 👏", "Spot on! 🎯"][Math.floor(Math.random() * 4)];
      body = '<div class="answer">' + esc(f.props.n) + "</div>" +
        (res.typo ? '<div class="meta">Close enough – the correct spelling is <b>' + esc(f.props.n) + "</b>.</div>" : "") +
        '<div class="meta">+' + pts + " points" + (S.hintUsed ? " (hint used, half points)" : "") + (S.streak >= 2 ? " · streak " + S.streak : "") + "</div>";
    } else {
      head = opts.timeout ? "Time's up ⏰" : opts.skip ? "No worries 🙂" : "Wrong ❌";
      var given = String(text || "").trim();
      body = '<div class="meta">The correct answer is</div><div class="answer">' + esc(f.props.n) + "</div>" +
        (given && !opts.skip ? '<div class="meta">You answered “' + esc(given) + "”" + (res.matchedName ? " – that's " + esc(res.matchedName) + (inRegion(byId[res.matchedId], S.region) ? " (shaded on the map)" : "") : "") + ".</div>" : "");
    }
    $("resultHead").textContent = head;
    $("resultBody").innerHTML = body;
    $("askBox").hidden = true; box.hidden = false;
    $("nextBtn").textContent = S.i + 1 >= S.queue.length ? "See results ▶" : "Next ▶";
    updateHud();
    $("progressBar").style.width = (100 * (S.i + 1) / S.queue.length) + "%";
    setTimeout(function () { $("nextBtn").focus(); }, 30);
    if (S.level === "easy" && info) zoomTo(info.bounds, 10, 0.38, 300);
  }

  function next() {
    if (!S.answered) return;
    S.i++;
    if (S.i >= S.queue.length) return summary();
    ask();
  }

  function summary() {
    stopTimer();
    var n = S.log.length, c = S.log.filter(function (l) { return l.ok; }).length, acc = n ? Math.round(100 * c / n) : 0;
    $("sumScore").textContent = S.score; $("sumCorrect").textContent = c + "/" + n; $("sumAcc").textContent = acc + "%"; $("sumStreak").textContent = S.bestStreak;
    $("sumEmoji").textContent = acc === 100 ? "🏆" : acc >= 70 ? "🥇" : acc >= 40 ? "🙂" : "📚";
    $("sumTitle").textContent = acc === 100 ? "Perfect round!" : acc >= 70 ? "Great job!" : acc >= 40 ? "Not bad!" : "Keep practising!";
    $("sumSub").textContent = regionById[S.region].label + " · " + S.level[0].toUpperCase() + S.level.slice(1) + (S.practice ? " · practice" : "");
    var key = "best:" + S.region + ":" + S.level, best = store.get(key, 0);
    if (!S.practice && S.score > best) { store.set(key, S.score); $("sumBest").textContent = best ? "New personal best! (previous " + best + ")" : "First score saved as your best!"; }
    else $("sumBest").textContent = best ? "Personal best: " + best + " pts" : "";
    $("sumRows").innerHTML = S.log.map(function (l, i) {
      return "<tr><td>" + (i + 1) + "</td><td><b>" + esc(l.name) + '</b></td><td class="you">' + (l.given ? esc(l.given) : l.timeout ? "<i>time's up</i>" : "<i>skipped</i>") +
        '</td><td class="' + (l.ok ? "ok" : "bad") + '">' + (l.ok ? "✓" : "✗") + "</td><td>" + l.pts + "</td></tr>";
    }).join("");
    var wrong = S.log.filter(function (l) { return !l.ok; }).map(function (l) { return l.id; });
    $("mistakesBtn").hidden = !wrong.length;
    $("mistakesBtn").onclick = function () { startRound(wrong); };
    show("screen-summary");
  }

  function hint() {
    if (S.answered || S.level === "hard") return;
    var f = target();
    S.hintUsed = true; $("hintBtn").disabled = true;
    if (S.level === "easy") {
      var others = shuffle(playable(S.region).filter(function (x) { return x.id !== f.id; })).slice(0, 3);
      var opts = shuffle(others.concat([f]));
      var box = $("choices"); box.innerHTML = ""; box.hidden = false;
      opts.forEach(function (o) {
        var b = document.createElement("button"); b.type = "button"; b.textContent = o.props.n;
        b.onclick = function () { $("answerInput").value = o.props.n; submit(o.props.n); };
        box.appendChild(b);
      });
    } else {
      var n = f.props.n, letters = n.replace(/[^A-Za-zÀ-ž]/g, "").length;
      $("hintBox").innerHTML = "Starts with <b>" + esc(n[0]) + "</b> · " + letters + " letters" + (/\s/.test(n) ? " · " + n.split(/\s+/).length + " words" : "") + " <span style='opacity:.7'>(half points)</span>";
      $("hintBox").hidden = false;
      $("answerInput").focus();
    }
  }

  function shake() { var el = $("answerInput"); el.animate([{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }], { duration: 220 }); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  // ---------- autocomplete (easy only) ----------
  var sugIdx = -1;
  function updateSuggest() {
    var ul = $("suggest");
    if (S.level !== "easy" || S.answered) { ul.hidden = true; return; }
    var q = M.norm($("answerInput").value);
    if (!q) { ul.hidden = true; return; }
    var names = playable(S.region).map(function (f) { return f.props.n; }).sort();
    var starts = names.filter(function (n) { return M.norm(n).indexOf(q) === 0; });
    var contains = names.filter(function (n) { return starts.indexOf(n) < 0 && M.norm(n).indexOf(q) > 0; });
    var list = starts.concat(contains).slice(0, 6);
    sugIdx = -1;
    ul.innerHTML = list.map(function (n) { return '<li role="option">' + esc(n) + "</li>"; }).join("");
    ul.hidden = !list.length;
    Array.prototype.forEach.call(ul.children, function (li) {
      li.onmousedown = function (e) { e.preventDefault(); $("answerInput").value = li.textContent; ul.hidden = true; submit(li.textContent); };
    });
  }
  $("answerInput").addEventListener("input", updateSuggest);
  $("answerInput").addEventListener("keydown", function (e) {
    var ul = $("suggest"); if (ul.hidden) return;
    var items = ul.children; if (!items.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      sugIdx = (sugIdx + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      Array.prototype.forEach.call(items, function (li, i) { li.classList.toggle("active", i === sugIdx); });
    } else if (e.key === "Enter" && sugIdx >= 0) {
      e.preventDefault(); $("answerInput").value = items[sugIdx].textContent; ul.hidden = true; submit(items[sugIdx].textContent);
    } else if (e.key === "Escape") ul.hidden = true;
  });
  $("answerInput").addEventListener("blur", function () { setTimeout(function () { $("suggest").hidden = true; }, 120); });

  // ---------- wiring ----------
  $("answerForm").addEventListener("submit", function (e) { e.preventDefault(); submit($("answerInput").value); });
  $("skipBtn").onclick = function () { submit("", { skip: true }); };
  $("hintBtn").onclick = hint;
  $("nextBtn").onclick = next;
  $("startBtn").onclick = function () { startRound(); };
  $("againBtn").onclick = function () { startRound(S.practice); };
  $("changeBtn").onclick = function () { renderStart(); show("screen-start"); };
  $("homeBtn").onclick = function () { stopTimer(); renderStart(); show("screen-start"); };
  $("zoomIn").onclick = function () { svg.transition().duration(250).call(zoom.scaleBy, 1.6); };
  $("zoomOut").onclick = function () { svg.transition().duration(250).call(zoom.scaleBy, 1 / 1.6); };
  $("zoomReset").onclick = function () { resetZoom(); };
  $("zoomFind").onclick = function () { var f = target(); var info = f && visibleInfo(f); if (info) zoomTo(info.bounds, 12, 0.3); };
  $("themeBtn").onclick = function () {
    var t = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = t; try { localStorage.setItem("geoquiz:theme", t); } catch (e) {}
  };
  document.addEventListener("keydown", function (e) {
    if (!$("screen-game").classList.contains("active")) return;
    if (e.key === "Enter" && S.answered && document.activeElement !== $("nextBtn")) { e.preventDefault(); next(); }
  });
  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      if (!$("screen-game").classList.contains("active")) return;
      var w = $("mapWrap").clientWidth, h = $("mapWrap").clientHeight;
      if (w === W && h === H) return;
      var wasAnswered = S.answered, f = target();
      drawMap(true);
      // restore highlight state without re-asking
      gLand.select('path[data-id="' + f.id + '"]').classed("target", true).raise();
      var info = visibleInfo(f); setMarker(info);
      if (wasAnswered) { var ok = S.log[S.log.length - 1].ok; gLand.select('path[data-id="' + f.id + '"]').classed(ok ? "ok" : "bad", true); gMark.select(".marker-pulse").remove(); gMark.select(".marker").classed(ok ? "ok" : "bad", true); if (info) { gLabel.append("text").attr("class", "map-label").attr("x", info.center[0]).attr("data-cy", info.center[1]).text(f.props.n); updateMarkerScale(); } }
    }, 200);
  });

  // test hook
  window.__geoquiz = { S: S, poolFor: poolFor, byId: byId, target: target, REGIONS: REGIONS,
    forceTarget: function (id) { stopTimer(); S.queue[S.i] = byId[id]; ask(); } };
  renderStart();
})();
