// Wall U-value calculator on /tools/ (markup from uvalue_tool() in build.py).
// U = 1 / (Rsi + Σ d/λ + Rse); surface resistances for walls from ISO 6946. λ values are typical and editable.
(function () {
  "use strict";
  var box = document.getElementById("uv-layers");
  if (!box) return;
  var root = document.documentElement;
  var $ = function (id) { return document.getElementById(id); };
  var RSI = 0.13, RSE = 0.04;
  // materials come from content/materials.json (embedded by build.py), the same data as the properties table
  // k: conductivity λ in W/m·K (null for the air gap, which has a fixed R); c: drawing colour; ins: counts as insulation
  var MATS = {};
  JSON.parse(document.getElementById("uv-mats").textContent).forEach(function (m) {
    MATS[m.id] = { en: m.en, ar: m.ar, k: m.k, r: m.r, c: m.color, ins: !!m.insulation };
  });
  var PRESETS = {
    brick: [["plaster", 2], ["brick", 25], ["plaster", 2]],
    "brick-xps": [["plaster", 2], ["brick", 12], ["xps", 5], ["brick", 12], ["plaster", 2]],
    cavity: [["plaster", 2], ["brick", 12], ["air", 5], ["brick", 12], ["plaster", 2]],
    aac: [["plaster", 2], ["aac", 20], ["plaster", 2]],
    concrete: [["plaster", 2], ["concrete", 20], ["plaster", 2]]
  };
  var layers = [];

  function ar() { return root.dataset.lang === "ar"; }
  function t(en, a) { return ar() ? a : en; }
  function f2(v) { return (Math.round(v * 100) / 100).toFixed(2); }
  function f1(v) { return (Math.round(v * 10) / 10).toString(); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function load(name) {
    layers = PRESETS[name].map(function (p) { return { m: p[0], d: p[1], k: MATS[p[0]].k }; });
    Array.prototype.forEach.call(document.querySelectorAll("#uv-presets .chip"), function (c) {
      c.classList.toggle("on", c.getAttribute("data-preset") === name);
    });
    drawRows();
    render();
  }
  function layerR(l) { return MATS[l.m].r ? MATS[l.m].r : (l.d / 100) / (l.k > 0 ? l.k : 1e9); }
  function totals(ls) {
    var r = RSI + RSE;
    ls.forEach(function (l) { r += layerR(l); });
    return { R: r, U: 1 / r };
  }

  function drawRows() {
    var opts = function (sel) {
      return Object.keys(MATS).map(function (k) {
        return '<option value="' + k + '"' + (k === sel ? " selected" : "") + ">" + esc(t(MATS[k].en, MATS[k].ar)) + "</option>";
      }).join("");
    };
    box.innerHTML = '<p class="uv-side">' + t("Outside", "الخارج") + " ↓</p>" + layers.map(function (l, i) {
      var air = !!MATS[l.m].r;
      return '<div class="uv-row" data-i="' + i + '">' +
        '<span class="uv-num" style="background:' + MATS[l.m].c + '">' + (i + 1) + "</span>" +
        '<select class="input uv-m" aria-label="' + t("Material", "المادة") + '">' + opts(l.m) + "</select>" +
        '<label class="uv-mini"><span>' + t("Thickness cm", "السمك سم") + '</span><input class="input uv-d" type="number" inputmode="decimal" min="0.5" max="100" step="0.5" value="' + l.d + '"></label>' +
        '<label class="uv-mini"><span>λ W/m·K</span><input class="input uv-k" type="number" inputmode="decimal" min="0.01" max="5" step="0.01" value="' + (air ? "" : l.k) + '"' + (air ? " disabled placeholder=\"R 0.18\"" : "") + "></label>" +
        '<span class="uv-r" title="R = d/λ">R ' + f2(layerR(l)) + "</span>" +
        '<button type="button" class="uv-del" aria-label="' + t("Remove layer", "احذف الطبقة") + '"' + (layers.length < 2 ? " disabled" : "") + ">×</button></div>";
    }).join("") + '<p class="uv-side">↓ ' + t("Inside", "الداخل") + "</p>";
    $("uv-add").disabled = layers.length >= 8;
  }

  function stat(value, en, a) { return '<div class="metric"><b>' + value + "</b><span>" + t(en, a) + "</span></div>"; }

  function render() {
    var tot = totals(layers);
    var To = parseFloat($("uv-to").value), Ti = parseFloat($("uv-ti").value);
    if (!isFinite(To)) To = 40;
    if (!isFinite(Ti)) Ti = 24;
    var dT = Math.abs(To - Ti), thick = layers.reduce(function (s, l) { return s + l.d; }, 0);
    $("uv-stats").innerHTML =
      stat(f2(tot.U), "U-value (W/m²·K)", "معامل U (وات/م²·ك)") +
      stat(f2(tot.R), "total R (m²·K/W)", "المقاومة الكلية R (م²·ك/وات)") +
      stat(f1(tot.U * dT), "heat flow (W/m²) at ΔT " + f1(dT) + "°", "التدفق الحراري (وات/م²) عند فرق " + f1(dT) + "°") +
      stat(f1(thick), "wall thickness (cm)", "سمك الحائط (سم)");
    Array.prototype.forEach.call(box.querySelectorAll(".uv-row"), function (row) {
      row.querySelector(".uv-r").textContent = "R " + f2(layerR(layers[+row.getAttribute("data-i")]));
    });
    compare(tot);
    draw(To, Ti, tot);
  }

  // effect of the insulation: same wall without its insulation layers
  function compare(tot) {
    var bare = layers.filter(function (l) { return !MATS[l.m].ins; });
    var out = $("uv-compare");
    if (bare.length === layers.length) {
      out.innerHTML = '<p class="muted uv-tip">' + t("Tip: try the “Brick + 5 cm insulation” wall, or add an insulation layer (EPS, XPS, rock wool or polyurethane), to see how much less heat passes.",
        "جرّب حائط «طوب + عزل 5 سم» أو أضف طبقة عزل (EPS أو XPS أو صوف صخري أو بولي يوريثان) لترى كم يقل الحرارة المنتقلة.") + "</p>";
      return;
    }
    var u0 = totals(bare).U, cut = Math.round((1 - tot.U / u0) * 100), max = Math.max(u0, tot.U);
    var bar = function (u, en, a, cls) {
      return '<div class="uv-bar"><span class="uv-bl">' + t(en, a) + '</span><span class="uv-track"><i class="' + cls + '" style="width:' + (u / max * 100) + '%"></i></span><b>' + f2(u) + "</b></div>";
    };
    out.innerHTML = '<div class="uv-cmp">' + bar(u0, "Without insulation", "بدون العزل", "uv-b0") + bar(tot.U, "With insulation", "مع العزل", "uv-b1") +
      "<p>" + t("The insulation cuts the heat passing through the wall by about ", "العزل يقلل الحرارة المنتقلة خلال الحائط بنحو ") + "<b>" + cut + "%</b>.</p></div>";
  }

  // section: air | layers (width ∝ thickness, at least 14 px) | air, with the steady-state temperature line on top
  function draw(To, Ti, tot) {
    var svg = $("uv-svg"), W = 640, H = 300, airW = 78, top = 40, bot = 250;
    var wallW = W - 2 * airW, minW = 14;
    var sum = layers.reduce(function (s, l) { return s + l.d; }, 0) || 1;
    var widths = layers.map(function (l) { return Math.max(minW, l.d / sum * wallW); });
    var scale = wallW / widths.reduce(function (a, b) { return a + b; }, 0);
    widths = widths.map(function (w) { return w * scale; });
    var lo = Math.min(To, Ti), hi = Math.max(To, Ti), span = hi - lo || 1;
    var Y = function (temp) { return (bot - 20) - (temp - lo) / span * (bot - top - 40); };
    var out = [], x = airW, pts = [], r = RSE;
    var T = function (rc) { return To + (Ti - To) * rc / tot.R; };
    out.push('<rect x="0" y="' + top + '" width="' + airW + '" height="' + (bot - top) + '" class="uv-air-out"/>');
    out.push('<rect x="' + (W - airW) + '" y="' + top + '" width="' + airW + '" height="' + (bot - top) + '" class="uv-air-in"/>');
    pts.push([8, Y(To)], [airW, Y(T(r))]);
    var surfOut = T(r);
    layers.forEach(function (l, i) {
      var w = widths[i];
      out.push('<rect x="' + x.toFixed(1) + '" y="' + top + '" width="' + w.toFixed(1) + '" height="' + (bot - top) + '" fill="' + MATS[l.m].c + '" class="uv-layer"/>');
      if (MATS[l.m].ins) out.push('<path class="uv-ins" d="' + zigzag(x, w, top, bot) + '"/>');
      out.push('<text class="uv-n" x="' + (x + w / 2).toFixed(1) + '" y="' + (bot + 18) + '" text-anchor="middle">' + (i + 1) + "</text>");
      x += w;
      r += layerR(l);
      pts.push([x, Y(T(r))]);
    });
    var surfIn = T(r);
    pts.push([W - 8, Y(Ti)]);
    out.push('<polyline class="uv-temp" points="' + pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ") + '"/>');
    pts.slice(1, -1).forEach(function (p) { out.push('<circle class="uv-dot" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="3"/>'); });
    var lbl = function (xx, yy, txt, anchor, cls) {
      return '<text class="' + (cls || "uv-t") + '" x="' + xx + '" y="' + yy + '" text-anchor="' + anchor + '">' + txt + "</text>";
    };
    // the drawing is left-to-right, so Arabic labels put the number first to keep the degree sign beside it
    out.push(lbl(8, top - 10, t("Outside " + f1(To) + "°", f1(To) + "° الخارج"), "start"));
    out.push(lbl(W - 8, top - 10, t("Inside " + f1(Ti) + "°", f1(Ti) + "° الداخل"), "end"));
    out.push(lbl(airW + 4, Y(surfOut) + (To > Ti ? -8 : 16), f1(surfOut) + "°", "start", "uv-ts"));
    out.push(lbl(W - airW - 4, Y(surfIn) + (To > Ti ? 16 : -8), f1(surfIn) + "°", "end", "uv-ts"));
    var arrowY = bot - 8, hot2cold = To > Ti;
    out.push('<path class="uv-arrow" d="M' + (hot2cold ? 18 : W - 18) + " " + arrowY + "H" + (hot2cold ? airW - 10 : W - airW + 10) +
      (hot2cold ? "l-6 -4m6 4l-6 4" : "l6 -4m-6 4l6 4") + '"/>');
    out.push(lbl(hot2cold ? 14 : W - 14, arrowY - 8, t("heat", "حرارة"), hot2cold ? "start" : "end", "uv-ts"));
    svg.setAttribute("viewBox", "0 0 " + W + " " + (H - 20));
    svg.innerHTML = out.join("");
  }
  function zigzag(x, w, top, bot) {
    var d = "", step = 16, amp = Math.min(w / 2 - 2, 8), cx = x + w / 2;
    for (var y = top + 6, s = 1; y < bot - 6; y += step / 2, s = -s) d += (d ? "L" : "M") + (cx + s * amp).toFixed(1) + " " + y.toFixed(1);
    return d;
  }

  box.addEventListener("input", function (e) {
    var row = e.target.closest(".uv-row");
    if (!row) return;
    var l = layers[+row.getAttribute("data-i")], v = parseFloat(e.target.value);
    if (e.target.classList.contains("uv-d") && v > 0) l.d = Math.min(v, 100);
    if (e.target.classList.contains("uv-k") && v > 0) l.k = v;
    clearPreset();
    render();
  });
  box.addEventListener("change", function (e) {
    if (!e.target.classList.contains("uv-m")) return;
    var l = layers[+e.target.closest(".uv-row").getAttribute("data-i")];
    l.m = e.target.value;
    l.k = MATS[l.m].k;
    if (MATS[l.m].r && l.d < 2.5) l.d = 5;
    clearPreset();
    drawRows();
    render();
  });
  box.addEventListener("click", function (e) {
    var del = e.target.closest(".uv-del");
    if (!del || layers.length < 2) return;
    layers.splice(+del.closest(".uv-row").getAttribute("data-i"), 1);
    clearPreset();
    drawRows();
    render();
  });
  $("uv-add").addEventListener("click", function () {
    if (layers.length >= 8) return;
    layers.splice(Math.max(layers.length - 1, 0), 0, { m: "xps", d: 5, k: MATS.xps.k });
    clearPreset();
    drawRows();
    render();
  });
  $("uv-presets").addEventListener("click", function (e) {
    var c = e.target.closest("[data-preset]");
    if (c) load(c.getAttribute("data-preset"));
  });
  $("uv-to").addEventListener("input", render);
  $("uv-ti").addEventListener("input", render);
  function clearPreset() {
    Array.prototype.forEach.call(document.querySelectorAll("#uv-presets .chip"), function (c) { c.classList.remove("on"); });
  }
  document.addEventListener("langchange", function () { drawRows(); render(); });
  load("brick");
})();
