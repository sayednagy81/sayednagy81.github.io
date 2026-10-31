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
    Array.prototype.forEach.call(document.querySelectorAll("[data-ph-en]"), function (el) {
      el.placeholder = el.getAttribute("data-ph-" + l);
    });
    Array.prototype.forEach.call(document.querySelectorAll("option[data-en]"), function (o) {
      o.textContent = o.getAttribute("data-" + l);
    });
    updateCount();
    document.dispatchEvent(new CustomEvent("langchange"));
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

  // ---- cite box: APA / IEEE / BibTeX tabs and copy (works on paper pages and inside the pop-up) ----
  function copyText(text, done) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () {});
      return;
    }
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    (document.querySelector("dialog[open]") || document.body).appendChild(ta);
    ta.select();
    try { if (document.execCommand("copy")) done(); } catch (e) {}
    ta.remove();
  }
  document.addEventListener("click", function (e) {
    var tab = e.target.closest && e.target.closest(".cite-tab");
    if (tab) {
      var box = tab.closest(".cite-box"), fmt = tab.getAttribute("data-fmt");
      Array.prototype.forEach.call(box.querySelectorAll(".cite-tab"), function (t) {
        var on = t === tab;
        t.classList.toggle("on", on);
        t.setAttribute("aria-pressed", on ? "true" : "false");
      });
      Array.prototype.forEach.call(box.querySelectorAll(".cite-text"), function (p) {
        p.hidden = p.getAttribute("data-fmt") !== fmt;
      });
      return;
    }
    var cp = e.target.closest && e.target.closest(".cite-copy");
    if (cp) {
      var pre = cp.closest(".cite-box").querySelector(".cite-text:not([hidden])");
      copyText(pre.textContent, function () {
        var old = cp.innerHTML;
        cp.textContent = "✓ " + cp.getAttribute("data-done-" + lang());
        setTimeout(function () { cp.innerHTML = old; }, 1600);
      });
    }
  });

  // ---- site search (Ctrl+K or /): loads search.json once, matches every word in English and Arabic ----
  var ss = document.getElementById("site-search");
  var ssQ = document.getElementById("ss-q");
  var ssList = document.getElementById("ss-list");
  var base = document.body.getAttribute("data-base") || "";
  var index = null, hits = [], sel = 0;

  function loadIndex() {
    if (index) return Promise.resolve(index);
    return fetch(base + "search.json").then(function (r) { return r.json(); }).then(function (d) { index = d; return d; });
  }
  function itemUrl(it) { return /^https?:/.test(it.u) ? it.u : base + it.u; }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function runSearch() {
    if (!index) return;
    var l = lang(), words = normalize(ssQ.value.trim()).split(/\s+/).filter(Boolean);
    if (!words.length) {
      hits = index.items.filter(function (it) { return it.k === "page" || it.k === "tool"; });
    } else {
      hits = index.items.map(function (it) {
        var title = normalize(it.en + " " + it.ar), score = 0;
        for (var i = 0; i < words.length; i++) {
          if (it.s.indexOf(words[i]) < 0) return null;
          score += title.indexOf(words[i]) > -1 ? 3 : 1;
        }
        return { it: it, score: score };
      }).filter(Boolean).sort(function (a, b) { return b.score - a.score; })
        .slice(0, 12).map(function (h) { return h.it; });
    }
    sel = 0;
    if (!hits.length) {
      ssList.innerHTML = '<li class="ss-empty">' + (l === "ar" ? "لا توجد نتائج" : "No results") + "</li>";
      return;
    }
    ssList.innerHTML = hits.map(function (it, i) {
      var title = (l === "ar" ? it.ar || it.en : it.en || it.ar);
      var ext = /^https?:/.test(it.u) ? ' target="_blank" rel="noopener"' : "";
      return '<li role="option" id="ss-' + i + '"' + (i === 0 ? ' aria-selected="true"' : "") + '><a href="' + esc(itemUrl(it)) + '"' + ext + ">" +
        '<span class="ss-kind ss-' + it.k + '">' + esc(index.kinds[it.k][l]) + "</span>" +
        '<span class="ss-title" dir="auto">' + esc(title) + "</span>" +
        (it.sub ? '<span class="ss-sub" dir="auto">' + esc(it.sub) + "</span>" : "") + "</a></li>";
    }).join("");
  }
  function mark(i) {
    var items = ssList.querySelectorAll("li[role=option]");
    if (!items.length) return;
    sel = (i + items.length) % items.length;
    Array.prototype.forEach.call(items, function (li, j) {
      if (j === sel) { li.setAttribute("aria-selected", "true"); li.scrollIntoView({ block: "nearest" }); }
      else li.removeAttribute("aria-selected");
    });
  }
  function openSearch() {
    if (!ss || typeof ss.showModal !== "function") return;
    if (!ss.open) ss.showModal();
    ssQ.select();
    loadIndex().then(runSearch, function () {
      ssList.innerHTML = '<li class="ss-empty">' + (lang() === "ar" ? "تعذّر تحميل البحث" : "Search could not load") + "</li>";
    });
  }
  var sb = document.getElementById("search-btn");
  if (sb) sb.addEventListener("click", openSearch);
  if (ss) {
    ssQ.addEventListener("input", runSearch);
    ssQ.addEventListener("keydown", function (e) {
      // a search field would only clear itself on Esc, so close the box explicitly
      if (e.key === "Escape") { e.preventDefault(); ss.close(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); mark(sel + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); mark(sel - 1); }
      else if (e.key === "Enter") {
        var a = ssList.querySelector('li[aria-selected="true"] a');
        if (a) { e.preventDefault(); a.click(); }
      }
    });
    ss.addEventListener("click", function (e) {
      if (e.target === ss) ss.close();
      else if (e.target.closest("a")) ss.close();
    });
    document.addEventListener("langchange", runSearch);
  }
  document.addEventListener("keydown", function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
    // e.code keeps Ctrl+K working on an Arabic keyboard layout
    if (((e.ctrlKey || e.metaKey) && (e.code === "KeyK" || e.key === "k")) || (e.key === "/" && !typing)) {
      e.preventDefault();
      openSearch();
    }
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

  // ---- videos: thumbnails until clicked, then the (privacy-friendly) YouTube player ----
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest(".vthumb[data-yt]");
    if (!t) return;
    var f = document.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + t.getAttribute("data-yt") + "?autoplay=1&rel=0";
    f.title = t.getAttribute("aria-label") || "YouTube video";
    f.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";
    f.allowFullscreen = true;
    f.className = "vframe";
    t.replaceWith(f);
  });

  // ---- video quizzes: questions from quizzes.json, options shuffled each try, best score kept on this device ----
  var qm = document.getElementById("quiz-modal");
  var qBody = qm && qm.querySelector(".quiz-body");
  var quizzes = null, quiz = null;
  function bil(v) {
    if (typeof v === "string") return esc(v);
    return '<span class="l-en" lang="en">' + esc(v.en || v.ar) + '</span><span class="l-ar" lang="ar">' + esc(v.ar || v.en) + "</span>";
  }
  function words(en, ar) { return bil({ en: en, ar: ar }); }
  function bestKey(id) { return "quiz-best:" + id; }
  function showBest() {
    Array.prototype.forEach.call(document.querySelectorAll(".quiz-open"), function (b) {
      var best = null;
      try { best = localStorage.getItem(bestKey(b.getAttribute("data-quiz"))); } catch (e) {}
      var tag = b.querySelector(".quiz-best");
      if (best && tag) { tag.hidden = false; tag.textContent = "✓ " + best; }
    });
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function askQuestion() {
    var q = quiz.items[quiz.i], n = quiz.items.length;
    var order = shuffle(q.options.map(function (_, k) { return k; }));
    qBody.innerHTML =
      '<p class="quiz-title" dir="auto">' + bil(quiz.title) + "</p>" +
      '<div class="quiz-progress" aria-hidden="true"><span style="width:' + (quiz.i / n * 100) + '%"></span></div>' +
      '<p class="muted">' + words("Question ", "السؤال ") + '<bdi dir="ltr">' + (quiz.i + 1) + " / " + n + "</bdi></p>" +
      '<h3 class="quiz-q">' + bil(q.q) + "</h3>" +
      '<div class="quiz-opts">' + order.map(function (k) {
        return '<button type="button" class="quiz-opt" data-k="' + k + '">' + bil(q.options[k]) + "</button>";
      }).join("") + "</div>" +
      '<div class="quiz-feedback" hidden></div>';
    var first = qBody.querySelector(".quiz-opt");
    if (first) first.focus();
  }
  function answer(btn) {
    var q = quiz.items[quiz.i], k = parseInt(btn.getAttribute("data-k"), 10), right = k === q.answer;
    if (right) quiz.score++;
    Array.prototype.forEach.call(qBody.querySelectorAll(".quiz-opt"), function (b) {
      b.disabled = true;
      var bk = parseInt(b.getAttribute("data-k"), 10);
      if (bk === q.answer) b.classList.add("right");
      else if (b === btn) b.classList.add("wrong");
    });
    var last = quiz.i === quiz.items.length - 1;
    var fb = qBody.querySelector(".quiz-feedback");
    fb.hidden = false;
    fb.className = "quiz-feedback " + (right ? "ok" : "no");
    fb.innerHTML = "<b>" + (right ? words("Correct ✓", "إجابة صحيحة ✓") : words("Not quite", "إجابة غير صحيحة")) + "</b>" +
      (q.explain ? "<p>" + bil(q.explain) + "</p>" : "") +
      '<button type="button" class="btn btn-primary quiz-next">' + (last ? words("See my result", "اعرض نتيجتي") : words("Next question", "السؤال التالي")) + "</button>";
    fb.querySelector(".quiz-next").focus();
  }
  function finish() {
    var n = quiz.items.length, s = quiz.score, pct = s / n;
    try {
      var old = localStorage.getItem(bestKey(quiz.id));
      if (!old || parseInt(old, 10) < s) localStorage.setItem(bestKey(quiz.id), s + "/" + n);
    } catch (e) {}
    showBest();
    var msg = pct === 1 ? words("Excellent, full marks!", "ممتاز، الدرجة النهائية!") :
      pct >= 0.6 ? words("Good work. Rewatch the parts you missed.", "أحسنت. راجع في الفيديو الأجزاء التي أخطأت فيها.") :
      words("Watch the lesson again, then retry.", "شاهد الدرس مرة أخرى ثم أعد المحاولة.");
    qBody.innerHTML =
      '<p class="quiz-title" dir="auto">' + bil(quiz.title) + "</p>" +
      '<div class="quiz-progress" aria-hidden="true"><span style="width:100%"></span></div>' +
      '<div class="quiz-result"><b>' + s + " / " + n + "</b><p>" + msg + "</p></div>" +
      '<div class="actions"><button type="button" class="btn btn-primary quiz-again">' + words("Try again", "أعد المحاولة") + "</button>" +
      '<a class="btn" href="https://www.youtube.com/watch?v=' + encodeURIComponent(quiz.id) + '" target="_blank" rel="noopener">' + words("Watch on YouTube", "شاهد على يوتيوب") + "</a></div>";
  }
  function startQuiz(id, title) {
    quiz = { id: id, title: title, items: quizzes[id] || [], i: 0, score: 0 };
    if (!quiz.items.length) return;
    askQuestion();
    if (!qm.open) qm.showModal();
  }
  if (qm) {
    document.addEventListener("click", function (e) {
      var open = e.target.closest && e.target.closest(".quiz-open");
      if (open) {
        if (typeof qm.showModal !== "function") return;
        var card = open.closest(".vcard"), h = card && card.querySelector("h3 a");
        var title = { en: "", ar: "" };
        if (h) {
          var en = h.querySelector(".l-en"), ar = h.querySelector(".l-ar");
          title = en ? { en: en.textContent, ar: ar.textContent } : h.textContent;
        }
        var id = open.getAttribute("data-quiz");
        if (quizzes) { startQuiz(id, title); return; }
        fetch(base + "quizzes.json").then(function (r) { return r.json(); })
          .then(function (d) { quizzes = d; startQuiz(id, title); }, function () {});
        return;
      }
      if (!qm.open) return;
      var opt = e.target.closest(".quiz-opt");
      if (opt && !opt.disabled) { answer(opt); return; }
      if (e.target.closest(".quiz-next")) {
        if (quiz.i < quiz.items.length - 1) { quiz.i++; askQuestion(); } else finish();
        return;
      }
      if (e.target.closest(".quiz-again")) { quiz.i = 0; quiz.score = 0; askQuestion(); return; }
      if (e.target === qm || e.target.closest(".modal-close")) qm.close();
    });
    showBest();
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
