#!/usr/bin/env python3
"""Builds the personal research site from content/*.json into dist/.

Run locally:  python build.py   (then open dist/index.html)
On GitHub it runs automatically after every change (see .github/workflows).
"""
import html
import json
import re
import shutil
import subprocess
import sys
import tempfile
from datetime import date
from pathlib import Path

import feeds

ROOT = Path(__file__).parent
OUT = ROOT / "dist"

FONTS = ("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600"
         "&family=Noto+Naskh+Arabic:wght@600;700&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&display=swap")

UI = {
    "about": ("About", "نبذة"),
    "research": ("Research", "الأبحاث"),
    "profiles": ("Profiles", "الصفحات البحثية"),
    "contact": ("Contact", "تواصل"),
    "interests": ("Research interests", "الاهتمامات البحثية"),
    "search": ("Search title, keyword, author…", "ابحث بالعنوان أو الكلمة المفتاحية أو المؤلف…"),
    "all_years": ("All years", "كل السنوات"),
    "results": ("results", "نتيجة"),
    "no_results": ("No matching papers.", "لا توجد أبحاث مطابقة."),
    "problem": ("Problem", "المشكلة"),
    "method": ("Method", "المنهج"),
    "findings": ("Key results", "أهم النتائج"),
    "conclusion": ("Conclusion", "الخلاصة"),
    "abstract": ("Abstract", "المستخلص"),
    "details": ("Details", "التفاصيل"),
    "summary": ("In brief", "باختصار"),
    "keywords": ("Keywords", "الكلمات المفتاحية"),
    "cite": ("Cite this paper (BibTeX)", "اقتبس هذا البحث (BibTeX)"),
    "copy": ("Copy", "نسخ"),
    "copied": ("Copied", "تم النسخ"),
    "read": ("Read paper", "اقرأ البحث"),
    "pdf": ("PDF", "PDF"),
    "card": ("Download visual abstract", "تحميل الملخص المصور"),
    "back": ("← All publications", "→ كل الأبحاث"),
    "home": ("Home", "الرئيسية"),
    "publications": ("Publications", "المنشورات"),
    "full_page": ("Full paper page", "صفحة البحث الكاملة"),
    "all_pubs": ("All publications →", "كل المنشورات ←"),
    "more_about": ("More about me →", "المزيد عني ←"),
    "selected": ("Selected publications", "أبحاث مختارة"),
    "positions": ("Academic positions", "المسار الأكاديمي"),
    "education": ("Education", "التعليم"),
    "find_me": ("Find my work on", "تجد أعمالي على"),
    "videos": ("Videos", "الفيديو"),
    "articles": ("Articles", "المقالات"),
    "latest_videos": ("Latest videos", "أحدث الفيديوهات"),
    "latest_articles": ("Latest articles", "أحدث المقالات"),
    "all_videos": ("All videos →", "كل الفيديوهات ←"),
    "all_articles": ("All articles →", "كل المقالات ←"),
    "subscribe": ("Subscribe on YouTube", "اشترك في القناة على يوتيوب"),
    "views": ("views", "مشاهدة"),
    "watch_yt": ("Watch on YouTube", "شاهد على يوتيوب"),
    "read_more": ("Read article", "اقرأ المقال"),
    "back_articles": ("← All articles", "→ كل المقالات"),
    "on_blog": ("Also published on the blog", "منشور أيضًا على المدونة"),
    "no_articles": ("New articles are on the way.", "مقالات جديدة قريبًا."),
    "videos_lead": ("Lectures, construction exercises and short explainers on architecture and sustainable building.",
                    "محاضرات وتمارين إنشاء وشروحات قصيرة في العمارة والبناء المستدام."),
    "articles_lead": ("Short scientific articles on sustainable architecture, building materials and energy.",
                      "مقالات علمية قصيرة في العمارة المستدامة ومواد البناء والطاقة."),
    "contact_lead": ("For research collaboration, supervision or speaking invitations, I would be glad to hear from you.",
                     "للتعاون البحثي أو الإشراف أو دعوات المحاضرات، يسعدني تواصلكم."),
    "featured": ("Featured", "مميز"),
    "pubs": ("Publications", "المنشورات"),
    "email": ("Email", "البريد الإلكتروني"),
    "other_lang": ("العربية", "English"),
    "rights": ("All rights reserved.", "جميع الحقوق محفوظة."),
}

PLATFORMS = {
    "googlescholar": ("Google Scholar", "GS", "#4285f4"),
    "researchgate": ("ResearchGate", "RG", "#00a596"),
    "orcid": ("ORCID", "iD", "#84a832"),
    "scopus": ("Scopus", "Sc", "#e9711c"),
    "wos": ("Web of Science", "WoS", "#5e33bf"),
    "academia": ("Academia.edu", "Ac", "#41454a"),
    "semanticscholar": ("Semantic Scholar", "SS", "#1857b6"),
    "linkedin": ("LinkedIn", "in", "#0a66c2"),
    "facebook": ("Facebook", "f", "#1877f2"),
    "x": ("X / Twitter", "X", "#111111"),
    "twitter": ("X / Twitter", "X", "#111111"),
    "instagram": ("Instagram", "Ig", "#c13584"),
    "youtube": ("YouTube", "YT", "#e00000"),
    "telegram": ("Telegram", "Tg", "#229ed9"),
    "whatsapp": ("WhatsApp", "Wa", "#1da851"),
    "github": ("GitHub", "GH", "#24292f"),
    "website": ("Website", "Web", "#555555"),
    "blogger": ("Build2Wise Blog", "B", "#e8710a"),
}

# Line icons on a 24x24 grid; "c:x,y,r" entries are circles.
ICONS = {
    "energy": ["c:12,12,4", "M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"],
    "wind": ["M3 8h10a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7"],
    "water": ["M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z", "M9 15a3 3 0 0 0 3 3"],
    "nano": ["M12 2l8.66 5v10L12 22l-8.66-5V7z", "c:12,12,2.5", "M12 2v7.5M12 14.5V22M3.34 7l6.5 3.75M14.16 13.25L20.66 17"],
    "bio": ["M12 22V12", "M12 12c0-5 3-9 8-10-1 5-3 8-8 10z", "M12 15c0-4-3-7-8-8 1 4 3 7 8 8z"],
    "recycle": ["M20 12a8 8 0 0 1-14 5.3M4 12a8 8 0 0 1 14-5.3", "M18 3v4h-4M6 21v-4h4"],
    "facade": ["M3 3h18v18H3z", "M3 9h18M3 15h18M9 3v18M15 3v18"],
    "container": ["M2 8h20v11H2z", "M6 8v11M10 8v11M14 8v11M18 8v11", "M2 8l3-3h14l3 3"],
    "book": ["M4 4h6a3 3 0 0 1 2 1 3 3 0 0 1 2-1h6v15h-6a2 2 0 0 0-2 2 2 2 0 0 0-2-2H4z", "M12 5v16"],
    "building": ["M4 21V5l8-3v19", "M12 9h8v12", "M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2M2 21h20"],
    "problem": ["c:12,12,9", "M12 7.5v5.5M12 16.5h.01"],
    "method": ["M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3", "M7.5 15h9"],
    "findings": ["M4 20V11M10 20V5M16 20v-7M2 20h20"],
    "conclusion": ["M9 18h6M10 21h4", "M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z"],
}

# topic: (label, colour, keywords that select it). Order matters: first match wins.
TOPICS = {
    "container": (("Container buildings", "مباني الحاويات"), "#9c4421", ["container"]),
    "wind": (("Wind energy", "طاقة الرياح"), "#2c6a96", ["wind"]),
    "water": (("Water", "المياه"), "#136f8f", ["water", "drainage"]),
    "nano": (("Nanomaterials", "مواد النانو"), "#5b3f94", ["nano"]),
    "bio": (("Biomimicry", "المحاكاة الحيوية"), "#2d6e45", ["biomim"]),
    "recycle": (("Circular design", "التصميم الدائري"), "#56701f", ["reuse", "deconstruct", "recycl", "circular"]),
    "facade": (("Building envelopes", "أغلفة المباني"), "#13294b", ["envelope", "facade", "façade"]),
    "energy": (("Energy", "الطاقة"), "#a35a10", ["energy", "solar", "renewable"]),
    "book": (("Book", "كتاب"), "#6e5326", []),
    "building": (("Architecture", "العمارة"), "#34495e", []),
}


def fail(msg):
    print("\nERROR / خطأ:", msg, file=sys.stderr)
    sys.exit(1)


def load_json(path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        fail(f"{path.name} line {e.lineno}, column {e.colno}: {e.msg}\n"
             f"   (usually a missing comma or quote near that line / "
             f"غالبًا فاصلة أو علامة اقتباس ناقصة قرب هذا السطر)")
    except FileNotFoundError:
        fail(f"missing file {path}")


# ---------- text helpers ----------
def esc(s):
    return html.escape(str(s if s is not None else ""), quote=True)


def pick(v, lang):
    """v may be a plain string (same in both languages) or {"en":..,"ar":..}."""
    if isinstance(v, dict):
        return v.get(lang) or v.get("en") or next((x for x in v.values() if x), "")
    return v or ""


def bi(v):
    en, ar = pick(v, "en"), pick(v, "ar")
    if not en and not ar:
        return ""
    if en == ar:
        return esc(en)
    return (f'<span class="l-en" lang="en">{esc(en)}</span>'
            f'<span class="l-ar" lang="ar">{esc(ar)}</span>')


def ui(key):
    en, ar = UI[key]
    return bi({"en": en, "ar": ar})


def keywords(p, lang):
    k = p.get("keywords", [])
    if isinstance(k, dict):
        return k.get(lang) or k.get("en") or []
    return k


def normalize(s):
    """Same rules as normalize() in static/app.js so Arabic search is forgiving."""
    s = str(s).lower()
    s = re.sub(r"[\u064B-\u065F\u0670\u0640]", "", s)
    s = re.sub(r"[أإآ]", "ا", s)
    return s.replace("ى", "ي").replace("ة", "ه")


def ext_url(path, base):
    if not path:
        return ""
    return path if re.match(r"^(https?:)?//", path) else base + path


def icon(name, cls="ic"):
    parts = []
    for d in ICONS.get(name, ICONS["building"]):
        if d.startswith("c:"):
            x, y, r = d[2:].split(",")
            parts.append(f'<circle cx="{x}" cy="{y}" r="{r}"/>')
        else:
            parts.append(f'<path d="{d}"/>')
    return (f'<svg class="{cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{"".join(parts)}</svg>')


def topic_of(p):
    if p.get("topic") in TOPICS:
        return p["topic"]
    if p.get("type") == "book":
        return "book"
    text = (" ".join(keywords(p, "en")) + " " + pick(p["title"], "en")).lower()
    for name, (_, _, words) in TOPICS.items():
        if any(w in text for w in words):
            return name
    return "building"


# ---------- visual abstract ----------
def va_steps(v, lang=None):
    """Yields (key, inner_html) for each step present. lang=None means bilingual spans."""
    tx = (lambda x: bi(x)) if lang is None else (lambda x: esc(pick(x, lang)))
    for key in ("problem", "method"):
        if v.get(key):
            yield key, f"<p>{tx(v[key])}</p>"
    if v.get("findings"):
        stats = "".join(f'<div class="stat"><b>{esc(f.get("value", ""))}</b><span>{tx(f.get("label", ""))}</span></div>'
                        for f in v["findings"])
        yield "findings", f'<div class="stats">{stats}</div>'
    if v.get("conclusion"):
        yield "conclusion", f"<p>{tx(v['conclusion'])}</p>"


def visual_abstract(p, base, compact):
    t = topic_of(p)
    label, color, _ = TOPICS[t]
    head = (f'<div class="va-head"><span class="va-icon">{icon(t)}</span>'
            f'<span class="va-topic">{bi({"en": label[0], "ar": label[1]})}</span>'
            f'<span class="va-year">{esc(p.get("year", ""))}</span></div>')
    if p.get("image"):
        body = (f'<img loading="lazy" src="{esc(ext_url(p["image"], base))}" '
                f'alt="{esc(pick(p["title"], "en"))}: visual abstract">')
    elif p.get("visual"):
        steps = "".join(f'<div class="va-step va-{k}"><div class="va-step-h">{icon(k)}<h4>{ui(k)}</h4></div>{inner}</div>'
                        for k, inner in va_steps(p["visual"]))
        body = f'<div class="va-flow">{steps}</div>'
    else:
        body = f'<p class="va-summary">{bi(p.get("summary") or p.get("abstract", ""))}</p>'
    mode = "va-compact" if compact else "va-full"
    return f'<div class="va {mode}" style="--topic:{color}">{head}<div class="va-body">{body}</div></div>'


def share_card_html(profile, p):
    """A 1200x630 page that is screenshotted into cards/<id>.png (English, for social media)."""
    t = topic_of(p)
    label, color, _ = TOPICS[t]
    if p.get("visual"):
        steps = "".join(f'<div class="step"><h4>{icon(k)}{esc(UI[k][0])}</h4>{inner}</div>'
                        for k, inner in va_steps(p["visual"], "en"))
        middle = f'<div class="flow">{steps}</div>'
    else:
        kws = "".join(f"<span>{esc(k)}</span>" for k in keywords(p, "en")[:6])
        middle = (f'<div class="lead-box"><span class="art">{icon(t)}</span>'
                  f'<p class="summary">{esc(pick(p.get("summary", ""), "en"))}</p></div><div class="kws">{kws}</div>')
    venue = esc(" · ".join(x for x in (p.get("journal", ""), str(p.get("year", ""))) if x))
    right = f'doi.org/{esc(p["doi"])}' if p.get("doi") else esc(profile.get("site_url", "").replace("https://", ""))
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex">
<link href="{FONTS}" rel="stylesheet"><style>
*{{box-sizing:border-box;margin:0}}
html,body{{width:1200px;height:630px;overflow:hidden}}
body{{font-family:"IBM Plex Sans Arabic","Segoe UI",Arial,sans-serif;background:#f8f6f1;color:#1b2433;display:flex;--topic:{color}}}
.side{{width:24px;background:var(--topic)}}
.main{{flex:1;padding:40px 54px 30px;display:flex;flex-direction:column;gap:20px;min-width:0}}
.top{{display:flex;align-items:center;gap:14px;font-size:19px;color:#5b6575}}
.chip{{display:inline-flex;align-items:center;gap:9px;background:var(--topic);color:#fff;padding:7px 16px 7px 12px;border-radius:999px;font-weight:600}}
.chip svg{{width:24px;height:24px}}
h1{{font-family:"Source Serif 4",Georgia,serif;font-size:40px;line-height:1.2;color:#13294b;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}}
.flow{{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:18px;flex:1;min-height:0}}
.step{{position:relative;background:#fff;border:1px solid #e4dfd3;border-top:5px solid var(--topic);border-radius:12px;padding:14px 16px}}
.step:not(:last-child)::after{{content:"→";position:absolute;right:-16px;top:42%;color:var(--topic);font-size:20px;font-weight:700}}
.step h4{{display:flex;align-items:center;gap:8px;font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:var(--topic);margin-bottom:8px}}
.step h4 svg{{width:20px;height:20px}}
.step p{{font-size:20px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:7;-webkit-box-orient:vertical;overflow:hidden}}
.stats{{display:flex;flex-direction:column;gap:8px}}
.stat b{{display:block;font-family:"Source Serif 4",Georgia,serif;font-size:40px;line-height:1.05;color:#13294b}}
.stat span{{font-size:17px;color:#5b6575}}
.lead-box{{flex:1;display:flex;align-items:center;gap:40px;min-height:0}}
.art{{flex:none;display:grid;place-items:center;width:190px;height:190px;border-radius:28px;color:var(--topic);
  background:color-mix(in srgb,var(--topic) 9%,#fff);border:1px solid color-mix(in srgb,var(--topic) 22%,#fff)}}
.art svg{{width:120px;height:120px;stroke-width:1.3}}
.summary{{font-size:28px;line-height:1.45;border-left:5px solid var(--topic);padding-left:24px}}
.kws{{display:flex;gap:8px;flex-wrap:wrap}}
.kws span{{border:1px solid #d9d2c1;border-radius:999px;padding:4px 13px;font-size:16px;color:#5b6575}}
.foot{{display:flex;justify-content:space-between;gap:20px;font-size:17px;color:#5b6575;border-top:1px solid #e4dfd3;padding-top:12px}}
.foot b{{color:#13294b}}
</style></head><body><div class="side"></div><div class="main">
<div class="top"><span class="chip">{icon(t)}{esc(label[0])}</span><span>{venue}</span></div>
<h1>{esc(pick(p["title"], "en"))}</h1>
{middle}
<div class="foot"><span><b>{esc(pick(profile["name"], "en"))}</b> · {esc(pick(profile.get("affiliation", ""), "en"))}</span><span>{right}</span></div>
</div></body></html>'''


def find_browser():
    for name in ("google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "chrome", "msedge"):
        found = shutil.which(name)
        if found:
            return found
    for path in (r"C:\Program Files\Google\Chrome\Application\chrome.exe",
                 r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
                 r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
                 r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"):
        if Path(path).exists():
            return path
    return None


def render_png(browser, page, png, profile_dir):
    cmd = [browser, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox", "--no-first-run",
           f"--user-data-dir={profile_dir}", "--force-device-scale-factor=1", "--window-size=1200,630",
           "--virtual-time-budget=6000", f"--screenshot={png}", page.resolve().as_uri()]
    try:
        subprocess.run(cmd, timeout=90, capture_output=True)
    except (OSError, subprocess.TimeoutExpired):
        return False
    return png.exists()


def build_cards(profile, papers):
    """Returns the set of paper ids that got a PNG card."""
    browser = find_browser()
    if not browser:
        print("note: no Chrome/Edge found, skipping PNG visual-abstract cards")
        return set()
    d = OUT / "cards"
    d.mkdir()
    done = set()
    profile_dir = tempfile.mkdtemp(prefix="cards-")
    for p in papers:
        page = d / f'{p["id"]}.html'
        page.write_text(share_card_html(profile, p), encoding="utf-8")
        if render_png(browser, page, d / f'{p["id"]}.png', profile_dir):
            done.add(p["id"])
        page.unlink()
    shutil.rmtree(profile_dir, ignore_errors=True)
    print(f"cards: {len(done)}/{len(papers)} PNG visual abstracts")
    return done


# ---------- other pieces ----------
def link_buttons(p, base):
    out = []
    if p.get("doi"):
        out.append(f'<a class="btn btn-sm" href="https://doi.org/{esc(p["doi"])}" target="_blank" rel="noopener">DOI</a>')
    if p.get("pdf"):
        out.append(f'<a class="btn btn-sm" href="{esc(ext_url(p["pdf"], base))}" target="_blank" rel="noopener">{ui("pdf")}</a>')
    if p.get("url"):
        out.append(f'<a class="btn btn-sm" href="{esc(p["url"])}" target="_blank" rel="noopener">{ui("read")}</a>')
    return "".join(out)


def venue_line(p):
    parts = [p.get("journal", "")]
    if p.get("volume"):
        parts.append(f'{p["volume"]}' + (f'({p["issue"]})' if p.get("issue") else ""))
    if p.get("pages"):
        parts.append(f'pp. {p["pages"]}')
    parts.append(str(p.get("year", "")))
    return esc(", ".join(x for x in parts if x))


def search_blob(p):
    bits = []
    for f in ("title", "abstract", "summary"):
        bits += [pick(p.get(f, ""), "en"), pick(p.get(f, ""), "ar")]
    bits += keywords(p, "en") + keywords(p, "ar") + p.get("authors", [])
    bits += [p.get("journal", ""), str(p.get("year", "")), p.get("doi", "")]
    return normalize(" ".join(bits))


def kw_chips(p, tag="button"):
    ar = keywords(p, "ar")
    out = []
    for i, k in enumerate(keywords(p, "en")):
        label = bi({"en": k, "ar": ar[i] if i < len(ar) else k})
        if tag == "button":
            out.append(f'<button type="button" class="chip" data-kw="{esc(normalize(k))}">{label}</button>')
        else:
            out.append(f'<span class="chip chip-static">{label}</span>')
    return "".join(out)


def paper_detail(p, base, has_card):
    """Content of the pop-up card shown when a paper title is clicked (copied into #paper-modal by app.js)."""
    link = f'{base}papers/{esc(p["id"])}/'
    card_btn = (f'<a class="btn btn-sm" href="{base}cards/{esc(p["id"])}.png" download>{ui("card")}</a>' if has_card else "")
    # without "visual" or "image" the visual abstract already shows the summary, so don't repeat it
    shows_summary = not (p.get("visual") or p.get("image"))
    summary = (f'<h3>{ui("summary")}</h3><p class="lead">{bi(p["summary"])}</p>'
               if p.get("summary") and not shows_summary else "")
    abstract = f'<h3>{ui("abstract")}</h3><p class="modal-abstract">{bi(p["abstract"])}</p>' if p.get("abstract") else ""
    return f'''<div class="meta"><span>{venue_line(p)}</span></div>
<h2 class="modal-title">{bi(p["title"])}</h2>
<p class="authors">{esc(", ".join(p.get("authors", [])))}</p>
{visual_abstract(p, base, False)}
{summary}{abstract}
<h3>{ui("keywords")}</h3><div class="chips">{kw_chips(p, "span")}</div>
<div class="actions modal-actions"><a class="btn btn-sm btn-primary" href="{link}">{ui("full_page")}</a>{link_buttons(p, base)}{card_btn}</div>'''


def paper_card(p, base, has_card, filterable=True):
    kws = keywords(p, "en") + keywords(p, "ar")
    feat = f'<span class="badge">{ui("featured")}</span>' if p.get("featured") else ""
    link = f'{base}papers/{esc(p["id"])}/'
    return f'''
<article class="card paper" data-year="{esc(p.get("year", ""))}" data-search="{esc(search_blob(p))}" data-kws="{esc("|".join(normalize(k) for k in kws))}">
  {visual_abstract(p, base, True)}
  <div class="card-body">
    <div class="meta">{feat}<span>{venue_line(p)}</span></div>
    <h3><a class="open-paper" href="{link}">{bi(p["title"])}</a></h3>
    <p class="authors">{esc(", ".join(p.get("authors", [])))}</p>
    <div class="chips">{kw_chips(p, "button" if filterable else "span")}</div>
    <div class="actions"><a class="btn btn-sm btn-primary open-paper" href="{link}">{ui("abstract")}</a>{link_buttons(p, base)}</div>
  </div>
  <template class="paper-detail">{paper_detail(p, base, has_card)}</template>
</article>'''


def bibtex(p):
    entry = {"conference": "inproceedings", "book": "book"}.get(p.get("type"), "article")
    lines = [f'@{entry}{{{p["id"]},',
             f'  author  = {{{" and ".join(p.get("authors", []))}}},',
             f'  title   = {{{pick(p["title"], "en")}}},']
    key = "booktitle" if p.get("type") == "conference" else "journal"
    if p.get("journal"):
        lines.append(f'  {key} = {{{p["journal"]}}},')
    lines.append(f'  year    = {{{p.get("year", "")}}},')
    for f, k in (("volume", "volume"), ("issue", "number"), ("pages", "pages"), ("doi", "doi")):
        if p.get(f):
            lines.append(f'  {k} = {{{p[f]}}},')
    lines.append("}")
    return "\n".join(lines)


# ---------- page shell ----------
PAGES = [("home", ""), ("about", "about/"), ("publications", "publications/"), ("videos", "videos/"),
         ("articles", "articles/"), ("contact", "contact/")]
NAV = list(PAGES)  # main() drops Videos/Articles when they are not configured


def layout(profile, title, desc, body, base, canonical="", head_extra="", image="", active=""):
    default_lang = profile.get("default_lang", "en")
    name_en = pick(profile["name"], "en")
    nav = "".join(f'<a href="{base}{path}"{" class=on aria-current=page" if key == active else ""}>{ui(key)}</a>'
                  for key, path in NAV)
    can = f'<link rel="canonical" href="{esc(canonical)}">' if canonical else ""
    img = (f'<meta property="og:image" content="{esc(image)}"><meta property="og:image:width" content="1200">'
           f'<meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">'
           if image else "")
    return f'''<!doctype html>
<html lang="{default_lang}" dir="{"rtl" if default_lang == "ar" else "ltr"}" data-lang="{default_lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<meta name="author" content="{esc(name_en)}">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:type" content="website">
{img}
{can}
<link rel="icon" href="{base}static/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{FONTS}">
<link rel="stylesheet" href="{base}static/style.css">
{head_extra}
<script>document.documentElement.classList.add("js");setTimeout(function(){{if(!window.__motionReady)document.documentElement.classList.remove("js")}},3000);</script>
<script>try{{var l=localStorage.getItem("lang");if(l==="ar"||l==="en"){{var d=document.documentElement;d.dataset.lang=l;d.lang=l;d.dir=l==="ar"?"rtl":"ltr";}}}}catch(e){{}}</script>
</head>
<body>
<header class="site-header"><div class="wrap bar">
  <a class="brand" href="{base}">{bi(profile["name"])}</a>
  <nav>{nav}</nav>
  <button id="lang-btn" class="btn btn-sm" type="button" aria-label="Language / اللغة"><span class="l-en">{esc(UI["other_lang"][0])}</span><span class="l-ar">{esc(UI["other_lang"][1])}</span></button>
</div></header>
{body}
<dialog id="paper-modal" aria-label="Paper details / تفاصيل البحث"><button class="modal-close" type="button" aria-label="Close / إغلاق">×</button><div class="modal-body"></div></dialog>
<footer class="site-footer"><div class="wrap">© {date.today().year} {bi(profile["name"])} · {ui("rights")}</div></footer>
<script src="{base}static/app.js" defer></script>
</body></html>'''


def hero_art():
    """Line drawing of a building elevation that 'draws itself' behind the hero (see .hero-art in style.css)."""
    paths = [
        "M10 280H390",                                   # ground
        "M60 280V110H220V280", "M220 280V60H320V280",    # two volumes
        "M50 110L140 70L230 110",                        # roof
        "M130 280V245H150V280",                          # door
        "M60 296H320", "M60 290V302", "M320 290V302",    # dimension line
        "M345 60V280", "M339 60H351", "M339 280H351",
        "M368 34a14 14 0 1 0 0.1 0", "M368 12v6M368 50v6M346 34h6M384 34h6",  # sun
    ]
    for y in (140, 180, 220):
        paths += [f"M{x} {y}h20v24h-20z" for x in (80, 120, 170)]
    for y in range(86, 250, 34):
        paths += [f"M{x} {y}h22v18h-22z" for x in (240, 280)]
    body = "".join(f'<path pathLength="1" style="--d:{i}" d="{d}"/>' for i, d in enumerate(paths))
    return f'<svg class="hero-art" viewBox="0 0 400 310" aria-hidden="true">{body}</svg>'


def photo_html(profile, base):
    name_en = pick(profile["name"], "en")
    if profile.get("photo"):
        return f'<img class="photo" src="{esc(ext_url(profile["photo"], base))}" alt="{esc(name_en)}">'
    initials = "".join(w[0] for w in name_en.replace("Dr.", "").split()[:2]).upper() or "?"
    return f'<div class="photo photo-initials" aria-hidden="true">{esc(initials)}</div>'


def link_html(profile):
    """Returns (hero buttons, profile cards, sameAs urls) for the profile links."""
    btns, cards, same_as = "", "", []
    for link in profile.get("links", []):
        label, abbr, color = PLATFORMS.get(link["platform"].lower(), (link["platform"], link["platform"][:2].title(), "#555"))
        same_as.append(link["url"])
        shown = re.sub(r"^https?://(www\.)?", "", link["url"])[:48]
        badge = f'<span class="pbadge" style="background:{color}">{esc(abbr)}</span>'
        btns += f'<a class="btn" href="{esc(link["url"])}" target="_blank" rel="noopener me">{badge}{esc(label)}</a>'
        cards += (f'<a class="card pcard" href="{esc(link["url"])}" target="_blank" rel="noopener me">{badge}'
                  f'<span><b>{esc(label)}</b><small>{esc(shown)}</small></span></a>')
    return btns, cards, same_as


def metrics_html(profile, papers):
    extra = "".join(f'<div class="metric"><b>{esc(m["value"])}</b><span>{bi(m["label"])}</span></div>'
                    for m in profile.get("metrics", []))
    return f'<div class="metrics"><div class="metric"><b>{len(papers)}</b><span>{ui("pubs")}</span></div>{extra}</div>'


def timeline(items):
    rows = "".join(f'<li><span class="tl-when">{bi(it.get("years", ""))}</span>'
                   f'<div><b>{bi(it.get("title", ""))}</b><span class="tl-where">{bi(it.get("place", ""))}</span></div></li>'
                   for it in items)
    return f'<ol class="timeline">{rows}</ol>'


def page_hero(key):
    return f'<section class="page-hero"><div class="wrap"><h1>{ui(key)}</h1></div></section>'


def person_ld(profile, same_as):
    site = profile.get("site_url", "").rstrip("/")
    ld = {"@context": "https://schema.org", "@type": "Person", "name": pick(profile["name"], "en"),
          "jobTitle": pick(profile.get("title", ""), "en"),
          "affiliation": {"@type": "Organization", "name": pick(profile.get("affiliation", ""), "en")},
          "url": site + "/", "sameAs": same_as,
          "knowsAbout": [pick(i, "en") for i in profile.get("interests", [])]}
    if profile.get("email"):
        ld["email"] = profile["email"]
    return f'<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>'


def write_page(rel, html_text):
    d = OUT / rel
    d.mkdir(parents=True, exist_ok=True)
    (d / "index.html").write_text(html_text, encoding="utf-8")


def build_pages(profile, papers, cards):
    """Home, About, Publications and Contact. Returns their absolute URLs for the sitemap."""
    site = profile.get("site_url", "").rstrip("/")
    name_en = pick(profile["name"], "en")
    title_en = pick(profile.get("title", ""), "en")
    btns, profile_cards, same_as = link_html(profile)
    ld = person_ld(profile, same_as)
    featured_card = next((p for p in papers if p.get("featured") and p["id"] in cards), None)
    image = f'{site}/cards/{featured_card["id"]}.png' if featured_card else ""
    desc = (f'{name_en}, {title_en}, {pick(profile.get("affiliation", ""), "en")}. '
            f'{pick(profile.get("bio", ""), "en")}')[:300]
    interests = "".join(f'<li>{bi(i)}</li>' for i in profile.get("interests", []))

    # Home
    selected = [p for p in papers if p.get("featured")][:4] or papers[:4]
    home = f'''
<main>
<section class="hero">{hero_art()}<div class="wrap hero-grid">
  {photo_html(profile, "")}
  <div>
    <h1>{bi(profile["name"])}</h1>
    <p class="role">{bi(profile.get("title", ""))}<br>{bi(profile.get("affiliation", ""))}</p>
    <p class="bio">{bi(profile.get("bio", ""))}</p>
    <div class="btn-row">{btns}</div>
  </div>
</div></section>
<section class="wrap strip">
  {metrics_html(profile, papers)}
  <div><h2 class="h-sm">{ui("interests")}</h2><ul class="tags">{interests}</ul></div>
  <p><a class="btn" href="about/">{ui("more_about")}</a></p>
</section>
<section class="wrap">
  <h2>{ui("selected")}</h2>
  <div class="grid">{"".join(paper_card(p, "", p["id"] in cards, False) for p in selected)}</div>
  <p class="center-row"><a class="btn btn-primary" href="publications/">{ui("all_pubs")}</a></p>
</section>
{home_media(profile)}
</main>'''
    write_page("", layout(profile, f"{name_en} | {title_en}", desc, home, "", site + "/", ld, image, "home"))

    # About
    career = ""
    if profile.get("positions"):
        career += f'<section class="wrap"><h2>{ui("positions")}</h2>{timeline(profile["positions"])}</section>'
    if profile.get("education"):
        career += f'<section class="wrap"><h2>{ui("education")}</h2>{timeline(profile["education"])}</section>'
    about = f'''
<main>
{page_hero("about")}
<section class="wrap about-grid">
  {photo_html(profile, "../")}
  <div>
    <h2 class="about-name">{bi(profile["name"])}</h2>
    <p class="role">{bi(profile.get("title", ""))}<br>{bi(profile.get("affiliation", ""))}</p>
    <p class="lead">{bi(profile.get("bio", ""))}</p>
  </div>
</section>
<section class="wrap">{metrics_html(profile, papers)}</section>
{career}
<section class="wrap"><h2>{ui("interests")}</h2><ul class="tags">{interests}</ul></section>
</main>'''
    write_page("about", layout(profile, f'{ui_en("about")} | {name_en}', desc, about, "../", site + "/about/", ld, image, "about"))

    # Publications
    years = sorted({str(p.get("year", "")) for p in papers}, reverse=True)
    freq, label_of = {}, {}
    for p in papers:
        ar = keywords(p, "ar")
        for i, k in enumerate(keywords(p, "en")):
            nk = normalize(k)
            freq[nk] = freq.get(nk, 0) + 1
            label_of[nk] = {"en": k, "ar": ar[i] if i < len(ar) else k}
    top_kws = sorted(freq, key=lambda k: (-freq[k], k))[:20]
    kw_filter = "".join(f'<button type="button" class="chip" data-kw="{esc(k)}">{bi(label_of[k])}</button>' for k in top_kws)
    year_opts = "".join(f'<option value="{esc(y)}">{esc(y)}</option>' for y in years)
    cards_html = "".join(paper_card(p, "../", p["id"] in cards) for p in papers)

    pubs = f'''
<main>
{page_hero("publications")}
<section id="research" class="wrap">
  <div class="filters">
    <input id="q" type="search" class="input" placeholder="{esc(UI["search"][0])}" data-ph-en="{esc(UI["search"][0])}" data-ph-ar="{esc(UI["search"][1])}">
    <select id="year" class="input"><option value="" data-en="{esc(UI["all_years"][0])}" data-ar="{esc(UI["all_years"][1])}">{esc(UI["all_years"][0])}</option>{year_opts}</select>
  </div>
  <div class="chips chips-filter" id="kwfilter">{kw_filter}</div>
  <p id="count" class="muted" data-res-en="{UI["results"][0]}" data-res-ar="{UI["results"][1]}"></p>
  <div class="grid" id="papers">{cards_html}</div>
  <p id="empty" class="muted" hidden>{ui("no_results")}</p>
</section>
</main>'''
    pubs_desc = f'Publications of {name_en}: ' + "; ".join(pick(p["title"], "en") for p in papers[:6])
    write_page("publications", layout(profile, f'{ui_en("publications")} | {name_en}', pubs_desc[:300], pubs, "../",
                                      site + "/publications/", ld, image, "publications"))

    # Contact
    email = (f'<p><a class="btn btn-primary" href="mailto:{esc(profile["email"])}">{ui("email")}: {esc(profile["email"])}</a></p>'
             if profile.get("email") else "")
    contact = f'''
<main>
{page_hero("contact")}
<section class="wrap">
  <p class="lead">{ui("contact_lead")}</p>
  {email}
</section>
<section class="wrap">
  <h2>{ui("find_me")}</h2>
  <div class="pgrid">{profile_cards}</div>
</section>
</main>'''
    write_page("contact", layout(profile, f'{ui_en("contact")} | {name_en}', desc, contact, "../", site + "/contact/", ld, image, "contact"))

    return [site + "/" + path for key, path in NAV if key not in ("videos", "articles")]


def ui_en(key):
    return UI[key][0]


# ---------- videos & articles ----------
VIDEOS, ARTICLES = [], []  # filled by main() from the YouTube and blog feeds


def channel_url(profile):
    return next((l["url"] for l in profile.get("links", []) if l["platform"].lower() == "youtube"), "")


def load_videos(profile):
    """Channel feed merged with content/videos.json (better titles, summaries, keywords, hidden flags)."""
    texts = load_json(ROOT / "content" / "videos.json") if (ROOT / "content" / "videos.json").exists() else {}
    out = []
    for v in feeds.youtube_videos(profile.get("youtube_channel_id", "")):
        extra = texts.get(v["id"], {})
        if extra.get("hidden"):
            continue
        v["title_bi"] = extra.get("title") or v["title"]
        v["summary"] = extra.get("summary") or v["description"][:240]
        v["keywords"] = extra.get("keywords") or {}
        out.append(v)
    return out


def video_card(v):
    vid = esc(v["id"])
    title_en = pick(v["title_bi"], "en")
    kw = v["keywords"]
    tags = ""
    if kw:
        en, ar = (kw.get("en", []), kw.get("ar", [])) if isinstance(kw, dict) else (kw, kw)
        tags = (f'<div class="chips vtags"><span class="l-en">{" ".join(f"<span class=chip>{esc(k)}</span>" for k in en)}</span>'
                f'<span class="l-ar">{" ".join(f"<span class=chip>{esc(k)}</span>" for k in ar)}</span></div>')
    views = f'<span>{v["views"]:,} {ui("views")}</span>' if v.get("views") else ""
    return f'''
<article class="card vcard">
  <button type="button" class="vthumb" data-yt="{vid}" aria-label="Play: {esc(title_en)}">
    <img loading="lazy" src="https://i.ytimg.com/vi/{vid}/hqdefault.jpg" alt="{esc(title_en)}"><span class="vplay" aria-hidden="true"></span>
  </button>
  <div class="card-body">
    <div class="meta"><span>{esc(v["date"])}</span>{views}</div>
    <h3><a href="https://www.youtube.com/watch?v={vid}" target="_blank" rel="noopener">{bi(v["title_bi"])}</a></h3>
    <p class="vdesc">{bi(v["summary"])}</p>
    {tags}
  </div>
</article>'''


def article_card(a, base):
    link = f'{base}articles/{esc(a["slug"])}/'
    cover = f'<a class="acover" href="{link}" tabindex="-1"><img loading="lazy" src="{esc(a["image"])}" alt=""></a>' if a["image"] else ""
    excerpt = a["text"][:220] + ("…" if len(a["text"]) > 220 else "")
    tags = "".join(f'<span class="chip chip-static">{esc(t)}</span>' for t in a["tags"][:5])
    return f'''
<article class="card acard">{cover}
  <div class="card-body">
    <div class="meta"><span>{esc(a["date"])}</span></div>
    <h3 dir="auto"><a href="{link}">{esc(a["title"])}</a></h3>
    <p class="aexcerpt" dir="auto">{esc(excerpt)}</p>
    <div class="chips">{tags}</div>
    <div class="actions"><a class="btn btn-sm btn-primary" href="{link}">{ui("read_more")}</a></div>
  </div>
</article>'''


def home_media(profile):
    out = ""
    if VIDEOS:
        out += (f'<section class="wrap"><h2>{ui("latest_videos")}</h2><div class="vgrid">{"".join(video_card(v) for v in VIDEOS[:3])}</div>'
                f'<p class="center-row"><a class="btn btn-primary" href="videos/">{ui("all_videos")}</a></p></section>')
    if ARTICLES:
        out += (f'<section class="wrap"><h2>{ui("latest_articles")}</h2><div class="agrid">{"".join(article_card(a, "") for a in ARTICLES[:3])}</div>'
                f'<p class="center-row"><a class="btn btn-primary" href="articles/">{ui("all_articles")}</a></p></section>')
    return out


def build_media_pages(profile):
    """Videos page, Articles index and one page per article. Returns URLs for the sitemap."""
    site = profile.get("site_url", "").rstrip("/")
    name_en = pick(profile["name"], "en")
    urls = []
    nav_keys = [k for k, _ in NAV]

    if "videos" in nav_keys:
        chan = channel_url(profile)
        sub = f'<a class="btn btn-primary" href="{esc(chan)}?sub_confirmation=1" target="_blank" rel="noopener">{ui("subscribe")}</a>' if chan else ""
        grid = "".join(video_card(v) for v in VIDEOS) or f'<p><a class="btn" href="{esc(chan)}" target="_blank" rel="noopener">{ui("watch_yt")}</a></p>'
        ld = {"@context": "https://schema.org", "@type": "ItemList", "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "item": {
                "@type": "VideoObject", "name": pick(v["title_bi"], "en"), "description": pick(v["summary"], "en") or pick(v["title_bi"], "en"),
                "thumbnailUrl": f'https://i.ytimg.com/vi/{v["id"]}/hqdefault.jpg', "uploadDate": v["date"],
                "embedUrl": f'https://www.youtube.com/embed/{v["id"]}', "contentUrl": f'https://www.youtube.com/watch?v={v["id"]}',
                "keywords": ", ".join(k.lstrip("#") for k in (v["keywords"].get("en", []) if isinstance(v["keywords"], dict) else v["keywords"]))}}
            for i, v in enumerate(VIDEOS)]}
        body = f'''
<main>
{page_hero("videos")}
<section class="wrap"><p class="lead">{ui("videos_lead")}</p><p>{sub}</p><div class="vgrid">{grid}</div></section>
</main>'''
        head = f'<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>'
        write_page("videos", layout(profile, f'{ui_en("videos")} | {name_en}', UI["videos_lead"][0], body, "../",
                                    site + "/videos/", head, "", "videos"))
        urls.append(site + "/videos/")

    if "articles" in nav_keys:
        grid = "".join(article_card(a, "../") for a in ARTICLES) or f'<p class="muted">{ui("no_articles")}</p>'
        body = f'''
<main>
{page_hero("articles")}
<section class="wrap"><p class="lead">{ui("articles_lead")}</p><div class="agrid">{grid}</div></section>
</main>'''
        write_page("articles", layout(profile, f'{ui_en("articles")} | {name_en}', UI["articles_lead"][0], body, "../",
                                      site + "/articles/", "", "", "articles"))
        urls.append(site + "/articles/")
        for a in ARTICLES:
            base = "../../"
            ld = {"@context": "https://schema.org", "@type": "BlogPosting", "headline": a["title"], "datePublished": a["date"],
                  "dateModified": a["updated"] or a["date"], "author": {"@type": "Person", "name": name_en},
                  "keywords": ", ".join(a["tags"]), "mainEntityOfPage": a["link"] or f'{site}/articles/{a["slug"]}/'}
            if a["image"]:
                ld["image"] = a["image"]
            tags = "".join(f'<span class="chip chip-static">{esc(t)}</span>' for t in a["tags"])
            orig = f'<p class="muted"><a href="{esc(a["link"])}" target="_blank" rel="noopener">{ui("on_blog")}</a></p>' if a["link"] else ""
            body = f'''
<main class="wrap article-page">
  <p><a href="{base}articles/">{ui("back_articles")}</a></p>
  <div class="meta"><span>{esc(a["date"])}</span></div>
  <h1 dir="auto">{esc(a["title"])}</h1>
  <div class="chips">{tags}</div>
  <div class="prose" dir="auto">{a["html"]}</div>
  {orig}
</main>'''
            # the blog keeps the original copy, so point search engines there to avoid duplicate content
            write_page(f'articles/{a["slug"]}', layout(profile, f'{a["title"]} | {name_en}', a["text"][:300], body, base,
                                                      a["link"] or f'{site}/articles/{a["slug"]}/',
                                                      f'<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>',
                                                      a["image"], "articles"))
    return urls


def build_paper(profile, p, has_card):
    site = profile.get("site_url", "").rstrip("/")
    base = "../../"
    url = f'{site}/papers/{p["id"]}/'
    title_en = pick(p["title"], "en")
    abstract_en = pick(p.get("abstract", ""), "en")
    authors = p.get("authors", [])

    meta = [("citation_title", title_en)]
    meta += [("citation_author", a) for a in authors]
    meta += [("citation_publication_date", p.get("year", "")),
             ("citation_journal_title" if p.get("type") != "conference" else "citation_conference_title", p.get("journal", ""))]
    for k in ("volume", "issue"):
        if p.get(k):
            meta.append((f"citation_{k}", p[k]))
    if p.get("pages"):
        fp, _, lp = str(p["pages"]).partition("-")
        meta.append(("citation_firstpage", fp.strip()))
        if lp:
            meta.append(("citation_lastpage", lp.strip()))
    if p.get("doi"):
        meta.append(("citation_doi", p["doi"]))
    if p.get("pdf"):
        meta.append(("citation_pdf_url", ext_url(p["pdf"], site + "/")))
    meta.append(("citation_abstract_html_url", url))
    meta += [("citation_keywords", k) for k in keywords(p, "en")]
    meta.append(("citation_language", "en"))
    meta += [("DC.title", title_en), ("DC.description", abstract_en), ("DC.date", p.get("year", "")),
             ("DC.type", "Text.Article")]
    meta += [("DC.creator", a) for a in authors]
    meta += [("DC.subject", k) for k in keywords(p, "en")]
    if p.get("doi"):
        meta.append(("DC.identifier", f'doi:{p["doi"]}'))
    head = "\n".join(f'<meta name="{k}" content="{esc(v)}">' for k, v in meta if v != "")

    ld = {"@context": "https://schema.org", "@type": "Book" if p.get("type") == "book" else "ScholarlyArticle",
          "headline": title_en, "name": title_en, "abstract": abstract_en, "datePublished": str(p.get("year", "")),
          "author": [{"@type": "Person", "name": a} for a in authors],
          "keywords": ", ".join(keywords(p, "en")), "url": url, "inLanguage": "en"}
    if p.get("journal"):
        ld["isPartOf"] = {"@type": "Periodical", "name": p["journal"]}
    if p.get("doi"):
        ld["identifier"] = {"@type": "PropertyValue", "propertyID": "DOI", "value": p["doi"]}
        ld["sameAs"] = f'https://doi.org/{p["doi"]}'
    if has_card:
        ld["image"] = f'{site}/cards/{p["id"]}.png'
    head += f'\n<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>'

    card_btn = (f'<a class="btn btn-sm" href="{base}cards/{esc(p["id"])}.png" download>{ui("card")}</a>' if has_card else "")
    abstract_block = f'<h2>{ui("abstract")}</h2><p>{bi(p["abstract"])}</p>' if p.get("abstract") else ""
    summary_block = (f'<h2>{ui("summary")}</h2><p class="lead">{bi(p["summary"])}</p>'
                     if p.get("summary") and (p.get("visual") or p.get("image")) else "")
    body = f'''
<main class="wrap paper-page">
  <p><a href="{base}publications/">{ui("back")}</a></p>
  <div class="meta"><span>{venue_line(p)}</span></div>
  <h1>{bi(p["title"])}</h1>
  <p class="authors">{esc(", ".join(authors))}</p>
  <div class="actions">{link_buttons(p, base)}{card_btn}</div>
  {visual_abstract(p, base, False)}
  {summary_block}
  {abstract_block}
  <h2>{ui("keywords")}</h2><div class="chips">{kw_chips(p, "span")}</div>
  <h2>{ui("cite")}</h2>
  <pre id="bib" dir="ltr">{esc(bibtex(p))}</pre>
  <button class="btn btn-sm" type="button" id="copy-bib" data-en="{esc(UI["copy"][0])}" data-ar="{esc(UI["copy"][1])}" data-done-en="{esc(UI["copied"][0])}" data-done-ar="{esc(UI["copied"][1])}">{esc(UI["copy"][0])}</button>
</main>'''
    image = f'{site}/cards/{p["id"]}.png' if has_card else ""
    page = layout(profile, f'{title_en} | {pick(profile["name"], "en")}',
                  (pick(p.get("summary", ""), "en") or abstract_en)[:300], body, base, url, head, image, "publications")
    d = OUT / "papers" / p["id"]
    d.mkdir(parents=True, exist_ok=True)
    (d / "index.html").write_text(page, encoding="utf-8")
    return url


def main():
    profile = load_json(ROOT / "content" / "profile.json")
    papers = load_json(ROOT / "content" / "papers.json")
    if not isinstance(papers, list):
        fail("papers.json must start with [ and end with ]")

    seen = set()
    for i, p in enumerate(papers, 1):
        for req in ("id", "title", "year"):
            if not p.get(req):
                fail(f'paper #{i} is missing "{req}" / البحث رقم {i} ينقصه الحقل "{req}"')
        if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", p["id"]):
            fail(f'paper id "{p["id"]}" must use only lowercase English letters, digits and hyphens / '
                 f'المعرّف يجب أن يكون حروفًا إنجليزية صغيرة وأرقامًا وشرطات فقط')
        if p["id"] in seen:
            fail(f'duplicate id "{p["id"]}" / معرّف مكرر')
        seen.add(p["id"])
    papers.sort(key=lambda p: (-int(str(p["year"])[:4]), not p.get("featured", False)))

    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    shutil.copytree(ROOT / "static", OUT / "static")
    for extra in ("images", "files"):
        if (ROOT / extra).exists():
            shutil.copytree(ROOT / extra, OUT / extra)
    # root/ holds files that must sit at the site root, e.g. Google Search Console verification
    if (ROOT / "root").exists():
        shutil.copytree(ROOT / "root", OUT, dirs_exist_ok=True)

    cards = set() if "--no-cards" in sys.argv else build_cards(profile, papers)
    global VIDEOS, ARTICLES
    VIDEOS = load_videos(profile)
    ARTICLES = feeds.blog_articles(profile.get("blog_feed", ""))
    NAV[:] = [(k, p) for k, p in PAGES
              if not (k == "videos" and not profile.get("youtube_channel_id"))
              and not (k == "articles" and not profile.get("blog_feed"))]
    print(f"feeds: {len(VIDEOS)} videos, {len(ARTICLES)} articles")

    urls = build_pages(profile, papers, cards)
    urls += build_media_pages(profile)
    urls += [build_paper(profile, p, p["id"] in cards) for p in papers]

    site = profile.get("site_url", "").rstrip("/")
    today = date.today().isoformat()
    sm = "".join(f"<url><loc>{esc(u)}</loc><lastmod>{today}</lastmod></url>" for u in urls)
    (OUT / "sitemap.xml").write_text(
        f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{sm}</urlset>',
        encoding="utf-8")
    (OUT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {site}/sitemap.xml\n", encoding="utf-8")
    print(f"OK: built {len(papers)} paper page(s) into {OUT}")


if __name__ == "__main__":
    main()
