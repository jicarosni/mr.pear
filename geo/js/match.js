/* Forgiving answer matching for the country quiz. Works in the browser (window.GeoMatch) and Node. */
(function (root) {
  "use strict";

  function norm(s) {
    return String(s || "")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")   // strip accents
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/\bst\b\.?/g, "saint")                     // St. Lucia -> saint lucia
      .replace(/['’`´]/g, "")                             // Côte d'Ivoire -> cote divoire
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .replace(/^the\s+/, "")
      .replace(/\s+/g, " ");
  }
  // A few compact variants so "southkorea" or "bosniaherzegovina" also work.
  function variants(s) {
    var n = norm(s), out = [n];
    var squeezed = n.replace(/ /g, "");
    if (squeezed !== n) out.push(squeezed);
    var noAnd = n.replace(/ and /g, " ");
    if (noAnd !== n) out.push(noAnd);
    return out;
  }

  // Damerau-Levenshtein (optimal string alignment): swaps of adjacent letters count as one typo.
  function lev(a, b) {
    if (a === b) return 0;
    var m = a.length, n = b.length, i, j;
    if (!m) return n; if (!n) return m;
    var pp = null, prev = [], cur;
    for (j = 0; j <= n; j++) prev[j] = j;
    for (i = 1; i <= m; i++) {
      cur = [i];
      for (j = 1; j <= n; j++) {
        var c = a[i - 1] === b[j - 1] ? 0 : 1;
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + c);
        if (pp && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) cur[j] = Math.min(cur[j], pp[j - 2] + 1);
      }
      pp = prev; prev = cur;
    }
    return prev[n];
  }

  function tolerance(len, level) {
    if (level === "hard") return len >= 7 ? 1 : 0;
    if (len <= 4) return 0;
    if (len <= 7) return 1;
    return 2;
  }

  /**
   * Build an index: [{id, name, keys:[normalised names]}]
   * countries: [{id, n (canonical name), a (aliases)}]
   */
  function buildIndex(countries) {
    return countries.map(function (c) {
      var set = {};
      [c.n].concat(c.a || []).forEach(function (x) { variants(x).forEach(function (v) { if (v) set[v] = 1; }); });
      return { id: c.id, name: c.n, keys: Object.keys(set) };
    });
  }

  /**
   * Returns {ok, exact, typo, matchedId, matchedName}
   */
  function check(input, targetId, index, level) {
    var q = norm(input), qs = q.replace(/ /g, "");
    var res = { ok: false, exact: false, typo: false, matchedId: null, matchedName: null, empty: !q };
    if (!q) return res;
    var target = null, i, k;
    for (i = 0; i < index.length; i++) if (index[i].id === targetId) target = index[i];
    if (!target) return res;
    if (target.keys.indexOf(q) >= 0 || target.keys.indexOf(qs) >= 0) { res.ok = res.exact = true; res.matchedId = targetId; return res; }
    // exactly another country's name -> wrong
    for (i = 0; i < index.length; i++) {
      if (index[i].keys.indexOf(q) >= 0 || index[i].keys.indexOf(qs) >= 0) { res.matchedId = index[i].id; res.matchedName = index[i].name; return res; }
    }
    var tol = tolerance(q.length, level);
    var best = { d: 1e9, id: null, name: null }, dt = 1e9;
    for (i = 0; i < index.length; i++) {
      for (k = 0; k < index[i].keys.length; k++) {
        var key = index[i].keys[k];
        if (Math.abs(key.length - q.length) > 3) continue;
        var d = lev(q, key);
        if (index[i].id === targetId) { if (d < dt) dt = d; }
        else if (d < best.d) best = { d: d, id: index[i].id, name: index[i].name };
      }
    }
    if (dt <= tol && dt < best.d) { res.ok = res.typo = true; res.matchedId = targetId; return res; }
    if (best.d <= tolerance(q.length, "medium")) { res.matchedId = best.id; res.matchedName = best.name; }
    return res;
  }

  var api = { norm: norm, lev: lev, tolerance: tolerance, buildIndex: buildIndex, check: check };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.GeoMatch = api;
})(this);
