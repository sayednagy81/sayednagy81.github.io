(function () {
  "use strict";
  var root = document.documentElement;

  // same rules as normalize() in build.py
  function normalize(s) {
    return String(s).toLowerCase()
      .replace(/[ً-ٰٟـ]/g, "")
      .replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه");
  }

  function lang() { return root.dataset.lang === "ar" ? "ar" : "en"; }

  function applyLang(l) {
    root.dataset.lang = l;
    root.lang = l;
    root.dir = l === "ar" ? "rtl" : "ltr";
    try { localStorage.setItem("lang", l); } catch (e) {}
    var q = document.getElementById("q");
    if (q) q.placeholder = q.getAttribute("data-ph-" + l);
    var y = document.querySelector("#year option[data-" + l + "]");
    if (y) y.textContent = y.getAttribute("data-" + l);
    var cb = document.getElementById("copy-bib");
    if (cb) cb.textContent = cb.getAttribute("data-" + l);
    updateCount();
  }

  var btn = document.getElementById("lang-btn");
  if (btn) btn.addEventListener("click", function () { applyLang(lang() === "ar" ? "en" : "ar"); });

  // ---- publication filtering ----
  var list = document.getElementById("papers");
  var cards = list ? Array.prototype.slice.call(list.querySelectorAll(".paper")) : [];
  var q = document.getElementById("q");
  var year = document.getElementById("year");
  var count = document.getElementById("count");
  var empty = document.getElementById("empty");
  var active = {};
  var shown = cards.length;

  function updateCount() {
    if (count) count.textContent = shown + " " + count.getAttribute("data-res-" + lang());
  }

  function filter() {
    var term = q ? normalize(q.value.trim()) : "";
    var yr = year ? year.value : "";
    var keys = Object.keys(active);
    shown = 0;
    cards.forEach(function (c) {
      var ok = (!term || c.getAttribute("data-search").indexOf(term) > -1) &&
               (!yr || c.getAttribute("data-year") === yr) &&
               keys.every(function (k) { return ("|" + c.getAttribute("data-kws") + "|").indexOf("|" + k + "|") > -1; });
      c.hidden = !ok;
      if (ok) shown++;
    });
    if (empty) empty.hidden = shown !== 0;
    updateCount();
  }

  function toggleChip(el) {
    var k = el.getAttribute("data-kw");
    if (active[k]) delete active[k]; else active[k] = true;
    document.querySelectorAll('.chip[data-kw="' + k + '"]').forEach(function (c) {
      c.classList.toggle("on", !!active[k]);
    });
    filter();
  }

  document.addEventListener("click", function (e) {
    var chip = e.target.closest && e.target.closest(".chip[data-kw]");
    if (chip && list) {
      toggleChip(chip);
      if (chip.closest(".paper")) document.getElementById("research").scrollIntoView({ behavior: "smooth" });
    }
  });
  if (q) q.addEventListener("input", filter);
  if (year) year.addEventListener("change", filter);

  // ---- copy BibTeX ----
  var copy = document.getElementById("copy-bib");
  if (copy) copy.addEventListener("click", function () {
    var text = document.getElementById("bib").textContent;
    var done = function () {
      var l = lang();
      copy.textContent = copy.getAttribute("data-done-" + l);
      setTimeout(function () { copy.textContent = copy.getAttribute("data-" + l); }, 1500);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
  });

  applyLang(lang());
  filter();
})();
