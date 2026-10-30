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

  // ---- motion: header shadow, scroll reveal, counting numbers ----
  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = document.querySelector(".site-header");
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // "9,153" -> counts 0..9153 keeping commas; "30.4%" keeps decimals and suffix; text without digits is left alone
  function countUp(el) {
    var m = el.textContent.match(/^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/);
    if (!m || still) return;
    var target = parseFloat(m[2].replace(/,/g, ""));
    var decimals = (m[2].split(".")[1] || "").length;
    var commas = m[2].indexOf(",") > -1;
    var start = null, dur = 1400;
    function fmt(v) {
      var s = v.toFixed(decimals);
      return commas ? Number(s).toLocaleString("en-US", { minimumFractionDigits: decimals }) : s;
    }
    function step(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1);
      el.textContent = m[1] + fmt(target * (1 - Math.pow(1 - p, 3))) + m[3];
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ---- paper detail pop-up: a click on a title opens its abstract card; ctrl/cmd-click still opens the full page ----
  var modal = document.getElementById("paper-modal");
  var modalBody = modal && modal.querySelector(".modal-body");
  function openPaper(card) {
    var tpl = card.querySelector("template.paper-detail");
    if (!modal || !tpl || typeof modal.showModal !== "function") return false;
    modalBody.innerHTML = "";
    modalBody.appendChild(tpl.content.cloneNode(true));
    Array.prototype.forEach.call(modalBody.querySelectorAll(".va-step"), function (s, i) { s.style.setProperty("--i", i); });
    modal.showModal();
    modalBody.scrollTop = 0;
    requestAnimationFrame(function () {
      Array.prototype.forEach.call(modalBody.querySelectorAll(".va"), function (va) { va.classList.add("in"); });
      Array.prototype.forEach.call(modalBody.querySelectorAll(".stat b"), countUp);
    });
    return true;
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a.open-paper");
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    var card = a.closest(".paper");
    if (card && openPaper(card)) e.preventDefault();
  });
  if (modal) {
    modal.querySelector(".modal-close").addEventListener("click", function () { modal.close(); });
    modal.addEventListener("click", function (e) { if (e.target === modal) modal.close(); });
  }

  var targets = document.querySelectorAll(
    ".metric, .paper, .pcard, section.wrap > h2, .tags, .filters, .va-full, .paper-page > h2, .paper-page > p, .paper-page pre, .timeline li, .about-grid, .lead");
  Array.prototype.forEach.call(document.querySelectorAll(".va"), function (va) {
    Array.prototype.forEach.call(va.querySelectorAll(".va-step"), function (s, i) { s.style.setProperty("--i", i); });
  });
  Array.prototype.forEach.call(document.querySelectorAll(".metrics .metric, .grid .paper, .pgrid .pcard"), function (el) {
    var i = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.style.setProperty("--delay", (i % 4) * 0.08 + "s");
  });

  function reveal(el) {
    el.classList.add("in");
    Array.prototype.forEach.call(el.querySelectorAll(".va"), function (va) { va.classList.add("in"); });
    if (el.classList.contains("va")) el.classList.add("in");
    Array.prototype.forEach.call(el.querySelectorAll(".metric b, .stat b"), countUp);
  }

  if ("IntersectionObserver" in window && !still) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    Array.prototype.forEach.call(targets, function (el) { el.classList.add("reveal"); io.observe(el); });
  } else {
    Array.prototype.forEach.call(targets, reveal);
  }
  window.__motionReady = true;

  applyLang(lang());
  filter();
})();
