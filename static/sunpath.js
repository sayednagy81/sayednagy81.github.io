// Sun path and shadow calculator on /tools/sun-path/ (markup from sunpath_tool() in build.py).
// The solar position itself comes from static/solar.js (NOAA algorithm, checked against NREL SPA); this file is the page logic.
(function () {
  "use strict";
  var form = document.getElementById("sp-form");
  if (!form) return;
  var root = document.documentElement;
  var $ = function (id) { return document.getElementById(id); };
  var MSG = {
    lat: ["Latitude must be a number between -90 and 90.", "خط العرض يجب أن يكون رقمًا بين -90 و90."],
    lon: ["Longitude must be a number between -180 and 180 (east positive).", "خط الطول يجب أن يكون رقمًا بين -180 و180 (الشرق موجب)."],
    date: ["Enter a valid date.", "أدخل تاريخًا صحيحًا."],
    time: ["Enter a valid time.", "أدخل وقتًا صحيحًا."],
    utc: ["UTC offset must be between -12 and +14 hours.", "فرق التوقيت يجب أن يكون بين -12 و+14 ساعة."],
    height: ["Height must be a number of 0 or more.", "الارتفاع يجب أن يكون رقمًا لا يقل عن 0."]
  };
  var T = {
    below: ["Sun below horizon", "الشمس تحت الأفق"],
    nearH: ["The sun is within 5° of the horizon: shadow length is extremely sensitive to small errors (atmosphere, terrain, obstructions) and should not be relied on.",
      "الشمس على بعد أقل من 5° من الأفق: طول الظل شديد الحساسية لأي خطأ (الغلاف الجوي، التضاريس، العوائق) ولا يُعتمد عليه."],
    sketch: ["SCHEMATIC, not to scale", "رسم تخطيطي، غير مقيس"],
    clipped: ["The shadow extends beyond the diagram.", "الظل يمتد خارج حدود الرسم."],
    discAuto: ["Illustrative diagram only: shadow length is compressed to fit and is not to scale. Choose a fixed scale for a scaled drawing.",
      "رسم توضيحي فقط: طول الظل مضغوط ليلائم الرسم وهو غير مقيس. اختر مقياسًا ثابتًا للحصول على رسم مقيس."],
    discFix: ["Shadow drawn at the selected scale (the object symbol is not to scale).", "الظل مرسوم بالمقياس المختار (رمز الجسم غير مقيس)."],
    m: ["m", "م"],
    min: ["min", "دقيقة"],
    dirs: [["N", "S", "E", "W"], ["شمال", "جنوب", "شرق", "غرب"]]
  };
  function L(a) { return a[root.dataset.lang === "ar" ? 1 : 0]; }

  function parse() {
    var r = { err: {} };
    function num(id) { var s = $(id).value.trim(); return s === "" ? NaN : Number(s); }
    r.lat = num("lat"); r.lon = num("lon"); r.utc = num("utc"); r.h = num("height");
    if (!(r.lat >= -90 && r.lat <= 90)) r.err.lat = 1;
    if (!(r.lon >= -180 && r.lon <= 180)) r.err.lon = 1;
    if (!(r.utc >= -12 && r.utc <= 14)) r.err.utc = 1;
    if (!(r.h >= 0 && isFinite(r.h))) r.err.height = 1;
    var dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec($("date").value);
    if (dm) {
      var y = +dm[1], m = +dm[2], d = +dm[3], dt = new Date(Date.UTC(y, m - 1, d));
      if (dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d && y >= 1800 && y <= 2200) { r.y = y; r.m = m; r.d = d; }
      else r.err.date = 1;
    } else r.err.date = 1;
    var tm = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec($("time").value);
    if (tm && +tm[1] < 24 && +tm[2] < 60) r.hours = +tm[1] + tm[2] / 60 + (tm[3] ? +tm[3] / 3600 : 0);
    else r.err.time = 1;
    r.ok = Object.keys(r.err).length === 0;
    return r;
  }
  function showErrors(err) {
    ["lat", "lon", "date", "time", "utc", "height"].forEach(function (k) {
      $("e_" + k).textContent = err[k] ? L(MSG[k]) : "";
      if (err[k]) $(k).setAttribute("aria-invalid", "true"); else $(k).removeAttribute("aria-invalid");
    });
  }
  function niceLen(x) { var p = Math.pow(10, Math.floor(Math.log10(x))), f = x / p; return (f >= 5 ? 5 : f >= 2 ? 2 : 1) * p; }
  function f1(x) { return x.toFixed(1) + "°"; }
  function fmtLen(x) { return x >= 1000 ? x.toFixed(0) : x.toFixed(2); }
  function setRes(a, az, sh, dir, de, eo) {
    $("alt").textContent = a; $("azi").textContent = az; $("shadow").textContent = sh;
    $("direction").textContent = dir; $("decl").textContent = de; $("eot").textContent = eo;
  }

  function calc() {
    var p = parse();
    showErrors(p.err);
    var warn = $("warn");
    warn.hidden = true;
    var d4 = L(T.dirs);
    $("tN").textContent = d4[0]; $("tS").textContent = d4[1]; $("tE").textContent = d4[2]; $("tW").textContent = d4[3];
    if (!p.ok) {
      setRes("—", "—", "—", "—", "—", "—");
      $("shadowLine").setAttribute("x2", 300); $("shadowLine").setAttribute("y2", 200);
      $("sunLine").setAttribute("visibility", "hidden");
      $("beyond").setAttribute("visibility", "hidden");
      $("scaleBar").setAttribute("visibility", "hidden");
      return;
    }
    var s = window.SunCore.solarPosition(p.lat, p.lon, p.y, p.m, p.d, p.hours, p.utc);
    var up = s.alt > 0, bearing = (s.az + 180) % 360;
    var shadow = up ? window.SunCore.shadowLength(p.h, s.alt) : null;
    setRes(f1(s.alt), f1(s.az), up ? (p.h === 0 ? "0" : fmtLen(shadow)) + " " + L(T.m) : L(T.below), up ? f1(bearing) : "—",
      f1(s.decl), s.eot.toFixed(1) + " " + L(T.min));
    if (up && s.alt < 5) { warn.textContent = L(T.nearH); warn.hidden = false; }

    // plan diagram, north up: orange = toward the sun, grey = cast shadow
    var R = 150, sc = $("scale").value, len = 0, clipped = false, fixed = sc !== "auto";
    var sun = $("sunLine");
    if (up) {
      var a = s.az * Math.PI / 180;
      sun.setAttribute("visibility", "visible");
      sun.setAttribute("x2", 300 + 115 * Math.sin(a));
      sun.setAttribute("y2", 200 - 115 * Math.cos(a));
    } else sun.setAttribute("visibility", "hidden");
    if (shadow !== null && p.h > 0) {
      if (fixed) { len = shadow / Number(sc); if (len > R) { len = R; clipped = true; } }
      else { len = Math.min(R, Math.max(8, shadow * 8)); if (shadow * 8 > R) clipped = true; }
    }
    var rad = bearing * Math.PI / 180, sx = 300 + len * Math.sin(rad), sy = 200 - len * Math.cos(rad);
    $("shadowLine").setAttribute("x2", sx); $("shadowLine").setAttribute("y2", sy);
    var b = $("beyond");
    if (clipped) {
      b.setAttribute("d", "M" + sx + " " + sy + "L" + (300 + (R + 22) * Math.sin(rad)) + " " + (200 - (R + 22) * Math.cos(rad)));
      b.setAttribute("visibility", "visible");
    } else b.setAttribute("visibility", "hidden");
    var sb = $("scaleBar");
    if (fixed) {
      var nl = niceLen(100 * Number(sc)), px = nl / Number(sc);
      $("sbLine").setAttribute("x2", 40 + px);
      $("sbText").textContent = nl + " " + L(T.m);
      sb.setAttribute("visibility", "visible");
    } else sb.setAttribute("visibility", "hidden");
    $("sketch").textContent = fixed ? "" : L(T.sketch);
    $("disclaimer").textContent = L(fixed ? T.discFix : T.discAuto) + (clipped ? " " + L(T.clipped) : "");
  }

  form.addEventListener("input", calc);
  form.addEventListener("change", calc);
  document.addEventListener("langchange", calc);
  calc();
})();
