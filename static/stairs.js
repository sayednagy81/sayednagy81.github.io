// Stair design calculator on /tools/ (markup from stairs_tool() in build.py).
// All sizes in cm. Values follow the Building Construction lessons on the channel: riser 15–18 (aim 15),
// tread 30 standard and down to 27, comfortable pitch about 27°–33°, an even riser count for two equal flights.
(function () {
  "use strict";
  var form = document.getElementById("st-form");
  if (!form) return;
  var root = document.documentElement;
  var $ = function (id) { return document.getElementById(id); };
  var LIMITS = {
    res: { rMin: 15, rMax: 18, rIdeal: 15, tMin: 27 },
    pub: { rMin: 15, rMax: 17, rIdeal: 15, tMin: 28 }
  };
  var T_STD = 30, COMFORT = 63, COMFORT_MIN = 60, COMFORT_MAX = 65, FLIGHT_MAX = 16;
  // the lessons quote 27°–33°; 15/30 itself is 26.6°, so the check allows half a degree either side
  var PITCH_MIN = 26.5, PITCH_MAX = 33.9;
  var manualN = null;

  function ar() { return root.dataset.lang === "ar"; }
  function t(en, a) { return ar() ? a : en; }
  function fmt(v) { return (Math.round(v * 10) / 10).toString(); }
  function num(id, fallback) { var v = parseFloat($(id).value); return isFinite(v) && v > 0 ? v : fallback; }

  function compute() {
    var H = Math.min(Math.max(num("st-h", 300), 50), 1000);
    var W = Math.min(Math.max(num("st-w", 120), 60), 400);
    var lim = LIMITS[$("st-use").value] || LIMITS.res;
    var flights = $("st-layout").value === "1" ? 1 : 2;
    var autoN = Math.max(Math.ceil(H / lim.rMax), Math.round(H / lim.rIdeal), 2);
    if (flights === 2 && autoN % 2) {
      // two equal flights need an even count: take the neighbour that keeps the riser in range, closest to the ideal
      var fits = [autoN - 1, autoN + 1].filter(function (c) { return H / c >= lim.rMin && H / c <= lim.rMax; });
      fits.sort(function (a, b) { return Math.abs(H / a - lim.rIdeal) - Math.abs(H / b - lim.rIdeal); });
      autoN = fits[0] || autoN + 1;
    }
    var n = manualN ? Math.min(Math.max(manualN, 2), 80) : autoN;
    var R = H / n;
    // standard tread 30 cm, reduced towards the minimum as the riser grows (2R + T ≈ 63)
    var T = Math.min(T_STD, Math.max(lim.tMin, Math.round((COMFORT - 2 * R) * 2) / 2));
    var n1 = flights === 2 ? Math.ceil(n / 2) : n, n2 = n - n1;
    var L1 = (n1 - 1) * T, L2 = flights === 2 ? (n2 - 1) * T : 0;
    var plan = flights === 2 ? Math.max(L1, L2) + W : L1;
    var planW = flights === 2 ? 2 * W + 10 : W;
    return { H: H, W: W, lim: lim, flights: flights, n: n, auto: !manualN, R: R, T: T, n1: n1, n2: n2,
             L1: L1, L2: L2, plan: plan, planW: planW, blondel: 2 * R + T, angle: Math.atan(R / T) * 180 / Math.PI };
  }

  function stat(value, en, a) { return '<div class="metric"><b>' + value + "</b><span>" + t(en, a) + "</span></div>"; }

  function render() {
    var s = compute();
    $("st-n").textContent = s.n + (s.auto ? "" : " ✎");
    $("st-stats").innerHTML =
      stat(s.n, "risers", "قائمة") +
      stat(fmt(s.R), "riser R (cm)", "القائمة ق (سم)") +
      stat(fmt(s.T), "tread T (cm)", "النائمة ن (سم)") +
      stat(fmt(s.blondel), "2R + T (cm)", "2ق + ن (سم)") +
      stat(fmt(s.angle) + "°", "pitch", "زاوية الميل") +
      stat(s.flights === 2 ? s.n1 + " + " + s.n2 : s.n, "risers per flight", "قوائم كل قلبة") +
      stat(fmt(s.plan / 100) + " × " + fmt(s.planW / 100), "plan size (m)", "أبعاد المسقط (م)");

    var checks = [
      [s.R >= s.lim.rMin && s.R <= s.lim.rMax, "Riser " + fmt(s.R) + " cm (allowed " + s.lim.rMin + "–" + s.lim.rMax + ")",
        "القائمة " + fmt(s.R) + " سم (المسموح " + s.lim.rMin + "–" + s.lim.rMax + ")"],
      [s.T >= s.lim.tMin, "Tread " + fmt(s.T) + " cm (minimum " + s.lim.tMin + ")", "النائمة " + fmt(s.T) + " سم (الحد الأدنى " + s.lim.tMin + ")"],
      [s.blondel >= COMFORT_MIN && s.blondel <= COMFORT_MAX, "Comfort rule 2R + T = " + fmt(s.blondel) + " cm (60–65)",
        "قاعدة الراحة 2ق + ن = " + fmt(s.blondel) + " سم (60–65)"],
      [Math.max(s.n1, s.n2) <= FLIGHT_MAX, "Longest flight " + Math.max(s.n1, s.n2) + " risers (at most " + FLIGHT_MAX + ")",
        "أطول قلبة " + Math.max(s.n1, s.n2) + " قائمة (بحد أقصى " + FLIGHT_MAX + ")"],
      [s.angle >= PITCH_MIN && s.angle <= PITCH_MAX, "Pitch " + fmt(s.angle) + "° (comfortable about 27°–33°)",
        "زاوية الميل " + fmt(s.angle) + "° (المريح تقريبًا 27°–33°)"]
    ];
    if (s.flights === 2) checks.push([s.n % 2 === 0, "Even number of risers for two equal flights (" + s.n + ")",
      "عدد درجات زوجي لقلبتين متساويتين (" + s.n + ")"]);
    if (s.flights === 2) checks.push([true, "Landing depth " + fmt(s.W) + " cm = stair width", "عمق البسطة " + fmt(s.W) + " سم = عرض القلبة"]);
    $("st-checks").innerHTML = checks.map(function (c) {
      return '<li class="' + (c[0] ? "ok" : "warn") + '"><span aria-hidden="true">' + (c[0] ? "✓" : "!") + "</span>" + t(c[1], c[2]) + "</li>";
    }).join("");
    draw(s);
  }

  // Scaled section: flight 1 cut (filled), flight 2 beyond (dashed), with H, R, T and plan-length dimensions.
  function draw(s) {
    var svg = $("st-svg"), VW = 640, VH = 340, pad = 40, padR = 110;
    var minX = s.flights === 2 ? Math.min(0, s.L1 - s.L2) - 60 : -60;
    var maxX = s.flights === 2 ? s.L1 + s.W : s.L1 + 80;
    var k = Math.min((VW - pad - padR) / (maxX - minX), (VH - 2 * pad) / s.H);
    var ox = pad + ((VW - pad - padR) - (maxX - minX) * k) / 2 - minX * k, oy = VH - pad;
    var X = function (x) { return (ox + x * k).toFixed(1); }, Y = function (y) { return (oy - y * k).toFixed(1); };
    var out = [];

    var f1 = ["M" + X(0) + " " + Y(0)];
    for (var i = 1; i <= s.n1; i++) {
      f1.push("L" + X((i - 1) * s.T) + " " + Y(i * s.R));
      if (i < s.n1) f1.push("L" + X(i * s.T) + " " + Y(i * s.R));
    }
    var landY = s.n1 * s.R;
    var endX = s.flights === 2 ? s.L1 + s.W : s.L1 + 80;
    f1.push("L" + X(endX) + " " + Y(landY));
    // waist slab: parallel to the nosing line y = R + x·R/T, 15 cm thick, meeting the landing slab and the floor
    var slab = 15, drop = slab / Math.cos(Math.atan(s.R / s.T));
    var xUnderLanding = (landY - slab - s.R + drop) * s.T / s.R, xFloor = Math.max(0, (drop - s.R) * s.T / s.R);
    var mass = f1.join(" ") + " L" + X(endX) + " " + Y(landY - slab) + " L" + X(Math.min(xUnderLanding, endX)) + " " + Y(landY - slab) +
      " L" + X(xFloor) + " " + Y(0) + " Z";

    out.push('<line class="st-floor" x1="' + X(minX) + '" y1="' + Y(0) + '" x2="' + X(maxX) + '" y2="' + Y(0) + '"/>');
    if (s.flights === 2) {
      var f2 = ["M" + X(s.L1) + " " + Y(landY)];
      for (var j = 1; j <= s.n2; j++) {
        var x = s.L1 - (j - 1) * s.T;
        f2.push("L" + X(x) + " " + Y(landY + j * s.R));
        if (j < s.n2) f2.push("L" + X(x - s.T) + " " + Y(landY + j * s.R));
      }
      out.push('<path class="st-back" d="' + f2.join(" ") + '"/>');
      var topX = s.L1 - s.L2;
      out.push('<line class="st-floor" x1="' + X(minX) + '" y1="' + Y(s.H) + '" x2="' + X(topX) + '" y2="' + Y(s.H) + '"/>');
    } else {
      out.push('<line class="st-floor" x1="' + X(s.L1) + '" y1="' + Y(s.H) + '" x2="' + X(maxX) + '" y2="' + Y(s.H) + '"/>');
    }
    out.push('<path class="st-mass" d="' + mass + '"/>');
    out.push('<path class="st-cut" d="' + f1.join(" ") + '"/>');

    var r = ar() ? "ق" : "R", tt = ar() ? "ن" : "T";
    // R and T on the first step
    out.push('<text class="st-lbl" x="' + (parseFloat(X(0)) - 6) + '" y="' + Y(s.R / 2) + '" text-anchor="end" dominant-baseline="middle">' + r + " " + fmt(s.R) + "</text>");
    out.push('<text class="st-lbl" x="' + X(s.T / 2) + '" y="' + (parseFloat(Y(s.R)) - 22) + '" text-anchor="middle">' + tt + " " + fmt(s.T) + "</text>");
    // height dimension
    var dx = parseFloat(X(maxX)) + 18;
    out.push('<path class="st-dim" d="M' + dx + " " + Y(0) + "V" + Y(s.H) + "M" + (dx - 5) + " " + Y(0) + "h10M" + (dx - 5) + " " + Y(s.H) + 'h10"/>');
    var cm = ar() ? " سم" : " cm";
    out.push('<text class="st-lbl" x="' + (dx + 8) + '" y="' + Y(s.H / 2) + '" text-anchor="start" dominant-baseline="middle">' +
      (ar() ? "ع " : "H ") + fmt(s.H) + cm + "</text>");
    // plan length dimension
    var dy = parseFloat(Y(0)) + 22, x0 = s.flights === 2 ? Math.min(0, s.L1 - s.L2) : 0, x1 = s.flights === 2 ? s.L1 + s.W : s.L1;
    out.push('<path class="st-dim" d="M' + X(x0) + " " + dy + "H" + X(x1) + "M" + X(x0) + " " + (dy - 5) + "v10M" + X(x1) + " " + (dy - 5) + 'v10"/>');
    out.push('<text class="st-lbl" x="' + ((parseFloat(X(x0)) + parseFloat(X(x1))) / 2) + '" y="' + (dy + 16) + '" text-anchor="middle">' + fmt(s.plan) + cm + "</text>");

    svg.setAttribute("viewBox", "0 0 " + VW + " " + (VH + 12));
    svg.innerHTML = out.join("");
  }

  form.addEventListener("input", function (e) {
    if (e.target.id === "st-h" || e.target.id === "st-use") manualN = null;
    render();
  });
  form.addEventListener("change", render);
  form.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    if (b.id === "st-auto") manualN = null;
    else if (b.hasAttribute("data-step")) manualN = compute().n + parseInt(b.getAttribute("data-step"), 10);
    render();
  });
  document.addEventListener("langchange", render);
  render();
})();
