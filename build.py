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
    "cite": ("Cite this paper", "استشهد بهذا البحث"),
    "ris": ("Download RIS (EndNote, Zotero, Mendeley)", "تنزيل RIS (EndNote وZotero وMendeley)"),
    "bib_file": ("Download .bib", "تنزيل ‎.bib"),
    "site_search": ("Search the site", "ابحث في الموقع"),
    "search_ph": ("Search papers, videos, articles…", "ابحث في الأبحاث والفيديوهات والمقالات…"),
    "search_hint": ("↑↓ to move · Enter to open · Esc to close", "↑↓ للتنقل · Enter للفتح · Esc للإغلاق"),
    "tools": ("Tools", "أدوات"),
    "quiz": ("Test yourself", "اختبر نفسك"),
    "questions": ("questions", "أسئلة"),
    "quiz_lead": ("Lessons with a quiz button have a short test built from the video, with the answer explained after each question.",
                  "الدروس التي عليها زر «اختبر نفسك» لها اختبار قصير مأخوذ من الفيديو، مع شرح الإجابة بعد كل سؤال."),
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
<h3>{ui("cite")}</h3>{cite_block(p, base)}
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


def _initials(given):
    return " ".join(w[0] + "." for w in given.replace(".", " ").split())


def _split_name(name):
    parts = name.split()
    return (parts[-1], " ".join(parts[:-1])) if len(parts) > 1 else (name, "")


def apa(p):
    names = []
    for a in p.get("authors", []):
        last, given = _split_name(a)
        names.append(f"{last}, {_initials(given)}".rstrip(", "))
    if len(names) > 1:
        authors = ", ".join(names[:-1]) + ", & " + names[-1]
    else:
        authors = "".join(names)
    out = f'{authors} ({p.get("year", "")}). {pick(p["title"], "en")}.'
    if p.get("journal"):
        out += f' {p["journal"]}'
        if p.get("volume"):
            out += f', {p["volume"]}' + (f'({p["issue"]})' if p.get("issue") else "")
        if p.get("pages"):
            out += f', {p["pages"]}'
        out += "."
    if p.get("doi"):
        out += f' https://doi.org/{p["doi"]}'
    return out


def ieee(p):
    names = []
    for a in p.get("authors", []):
        last, given = _split_name(a)
        names.append(f"{_initials(given)} {last}".strip())
    if len(names) > 2:
        authors = ", ".join(names[:-1]) + ", and " + names[-1]
    else:
        authors = " and ".join(names)
    title = pick(p["title"], "en")
    if p.get("type") == "book":
        return f'{authors}, {title}. {p.get("year", "")}.'
    bits = [f'{authors}, "{title},"']
    if p.get("journal"):
        bits.append(("in " if p.get("type") == "conference" else "") + p["journal"] + ",")
    if p.get("volume"):
        bits.append(f'vol. {p["volume"]},')
    if p.get("issue"):
        bits.append(f'no. {p["issue"]},')
    if p.get("pages"):
        bits.append(f'pp. {p["pages"]},' if "-" in str(p["pages"]) else f'Art. no. {p["pages"]},')
    bits.append(f'{p.get("year", "")}' + (f', doi: {p["doi"]}.' if p.get("doi") else "."))
    return " ".join(bits)


def ris(p):
    ty = {"conference": "CPAPER", "book": "BOOK"}.get(p.get("type"), "JOUR")
    rows = [("TY", ty)] + [("AU", a) for a in p.get("authors", [])]
    rows += [("TI", pick(p["title"], "en")), ("PY", p.get("year", ""))]
    if p.get("journal"):
        rows.append(("T2", p["journal"]))
    for f, tag in (("volume", "VL"), ("issue", "IS")):
        if p.get(f):
            rows.append((tag, p[f]))
    if p.get("pages"):
        sp, _, ep = str(p["pages"]).partition("-")
        rows.append(("SP", sp.strip()))
        if ep:
            rows.append(("EP", ep.strip()))
    if p.get("doi"):
        rows += [("DO", p["doi"]), ("UR", f'https://doi.org/{p["doi"]}')]
    if p.get("abstract"):
        rows.append(("AB", pick(p["abstract"], "en")))
    rows += [("KW", k) for k in keywords(p, "en")]
    rows.append(("ER", ""))
    return "\r\n".join(f"{t}  - {v}" for t, v in rows) + "\r\n"


def cite_block(p, base):
    """Tabs with APA / IEEE / BibTeX, a copy button and RIS/BibTeX downloads (handled by app.js, class-based so it
    also works inside the pop-up)."""
    folder = f'{base}papers/{esc(p["id"])}/'
    fmts = [("apa", "APA", apa(p)), ("ieee", "IEEE", ieee(p)), ("bibtex", "BibTeX", bibtex(p))]
    tabs = "".join(f'<button type="button" class="cite-tab{" on" if i == 0 else ""}" data-fmt="{k}" aria-pressed="{"true" if i == 0 else "false"}">{lbl}</button>'
                   for i, (k, lbl, _) in enumerate(fmts))
    panes = "".join(f'<pre class="cite-text" data-fmt="{k}" dir="ltr"{"" if i == 0 else " hidden"}>{esc(t)}</pre>'
                    for i, (k, _, t) in enumerate(fmts))
    return f'''<div class="cite-box">
  <div class="cite-tabs" role="group" aria-label="Citation style">{tabs}</div>
  {panes}
  <div class="actions"><button type="button" class="btn btn-sm btn-primary cite-copy" data-done-en="{esc(UI["copied"][0])}" data-done-ar="{esc(UI["copied"][1])}">{ui("copy")}</button>
  <a class="btn btn-sm" href="{folder}cite.ris" download="{esc(p["id"])}.ris">{ui("ris")}</a>
  <a class="btn btn-sm" href="{folder}cite.bib" download="{esc(p["id"])}.bib">{ui("bib_file")}</a></div>
</div>'''


# ---------- page shell ----------
PAGES = [("home", ""), ("about", "about/"), ("publications", "publications/"), ("videos", "videos/"),
         ("articles", "articles/"), ("tools", "tools/"), ("contact", "contact/")]
NAV = list(PAGES)  # main() drops Videos/Articles when they are not configured


def layout(profile, title, desc, body, base, canonical="", head_extra="", image="", active="", keywords=()):
    default_lang = profile.get("default_lang", "en")
    name_en = pick(profile["name"], "en")
    nav = "".join(f'<a href="{base}{path}"{" class=on aria-current=page" if key == active else ""}>{ui(key)}</a>'
                  for key, path in NAV)
    can = f'<link rel="canonical" href="{esc(canonical)}">' if canonical else ""
    if image:
        img = (f'<meta property="og:image" content="{esc(image)}"><meta property="og:image:width" content="1200">'
               f'<meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">')
    elif profile.get("photo") and profile.get("site_url"):
        # pages without a share card still get a picture in link previews (WhatsApp, Facebook, LinkedIn)
        photo = ext_url(profile["photo"], profile["site_url"].rstrip("/") + "/")
        img = f'<meta property="og:image" content="{esc(photo)}"><meta name="twitter:card" content="summary">'
    else:
        img = ""
    img += ('<meta property="og:locale" content="en_US"><meta property="og:locale:alternate" content="ar_EG">'
            f'<meta property="og:site_name" content="{esc(name_en)}">')
    if canonical:
        img += f'<meta property="og:url" content="{esc(canonical)}">'
    if keywords:
        img += f'<meta name="keywords" content="{esc(", ".join(keywords))}">'
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
<body data-base="{base}">
<header class="site-header"><div class="wrap bar">
  <a class="brand" href="{base}">{bi(profile["name"])}</a>
  <nav>{nav}</nav>
  <button id="search-btn" class="btn btn-sm" type="button" aria-label="Search / بحث" aria-keyshortcuts="Control+K"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><span class="kbd">Ctrl K</span></button>
  <button id="lang-btn" class="btn btn-sm" type="button" aria-label="Language / اللغة"><span class="l-en">{esc(UI["other_lang"][0])}</span><span class="l-ar">{esc(UI["other_lang"][1])}</span></button>
</div></header>
{body}
<dialog id="paper-modal" aria-label="Paper details / تفاصيل البحث"><button class="modal-close" type="button" aria-label="Close / إغلاق">×</button><div class="modal-body"></div></dialog>
<dialog id="quiz-modal" aria-label="Quiz / اختبار"><button class="modal-close" type="button" aria-label="Close / إغلاق">×</button><div class="quiz-body"></div></dialog>
<dialog id="site-search" aria-label="Search / بحث"><div class="ss-box">
  <input id="ss-q" class="input" type="search" autocomplete="off" placeholder="{esc(UI["search_ph"][0])}" data-ph-en="{esc(UI["search_ph"][0])}" data-ph-ar="{esc(UI["search_ph"][1])}" aria-controls="ss-list">
  <ul id="ss-list" role="listbox"></ul>
  <p class="ss-hint muted">{ui("search_hint")}</p>
</div></dialog>
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


def home_tools():
    if "tools" not in [k for k, _ in NAV]:
        return ""
    cards = [("tools/u-value/", "U", "#2c6a96", {"en": "Wall U-value calculator", "ar": "حاسبة معامل U والعزل الحراري"},
              {"en": "Thermal insulation of walls, with a materials table", "ar": "العزل الحراري للحوائط مع جدول خصائص المواد"}),
             ("tools/sun-path/", "☀", "#a35a10", {"en": "Sun path and shadow calculator", "ar": "حاسبة مسار الشمس والظلال"},
              {"en": "Solar angles and shadow length for any place and time", "ar": "زوايا الشمس وطول الظل لأي مكان ووقت"}),
             ("tools/stairs/", "≡", "#a8822f", {"en": "Stair design calculator", "ar": "حاسبة تصميم السلالم"},
              {"en": "Risers, treads, flights and a scaled section", "ar": "القوائم والنوائم والقلبات وقطاع بمقياس رسم"})]
    items = "".join(f'<a class="card pcard" href="{h}"><span class="pbadge" style="background:{c}">{s}</span>'
                    f'<span><b>{bi(t)}</b><small>{bi(d)}</small></span></a>' for h, s, c, t, d in cards)
    return f'<section class="wrap"><h2>{bi({"en": "Free tools for students", "ar": "أدوات مجانية للطلاب"})}</h2><div class="pgrid">{items}</div></section>'


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
{home_tools()}
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

    return [site + "/" + path for key, path in NAV if key not in ("videos", "articles", "tools")]


def ui_en(key):
    return UI[key][0]


# ---------- videos & articles ----------
VIDEOS, ARTICLES = [], []  # filled by main() from the YouTube and blog feeds
QUIZZES = {}  # video id -> questions, from content/quizzes.json


def load_quizzes():
    """content/quizzes.json: {"<video id>": [{"q", "options", "answer", "explain"}, ...]}, checked so a typo fails clearly."""
    path = ROOT / "content" / "quizzes.json"
    data = load_json(path) if path.exists() else {}
    for vid, qs in data.items():
        for i, q in enumerate(qs, 1):
            where = f'quizzes.json, video {vid}, question {i} / السؤال {i}'
            opts = q.get("options", [])
            if not q.get("q") or len(opts) < 2:
                fail(f'{where}: needs "q" and at least 2 "options" / يلزم نص السؤال وخياران على الأقل')
            if not isinstance(q.get("answer"), int) or not 0 <= q["answer"] < len(opts):
                fail(f'{where}: "answer" must be the number of the right option, counting from 0 / '
                     f'"answer" رقم الخيار الصحيح بدءًا من 0')
    return data


def channel_url(profile):
    return next((l["url"] for l in profile.get("links", []) if l["platform"].lower() == "youtube"), "")


def load_videos(profile):
    """Channel feed merged with content/videos.json (better titles, summaries, keywords, hidden flags)."""
    texts = load_json(ROOT / "content" / "videos.json") if (ROOT / "content" / "videos.json").exists() else {}
    feed = feeds.youtube_videos(profile.get("youtube_channel_id", ""))
    # the feed only lists the newest 15 uploads; entries marked "add" bring in older ones
    seen = {v["id"] for v in feed}
    feed += [{"id": vid, "title": pick(e.get("title", ""), "en"), "date": e.get("date", ""), "description": "", "views": 0}
             for vid, e in texts.items() if isinstance(e, dict) and e.get("add") and vid not in seen]
    out = []
    for v in feed:
        extra = texts.get(v["id"], {})
        if extra.get("hidden"):
            continue
        v["title_bi"] = extra.get("title") or v["title"]
        v["summary"] = extra.get("summary") or v["description"][:240]
        v["keywords"] = extra.get("keywords") or {}
        out.append(v)
    return sorted(out, key=lambda v: v["date"], reverse=True)


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
    n = len(QUIZZES.get(v["id"], []))
    quiz = (f'<div class="actions"><button type="button" class="btn btn-sm btn-primary quiz-open" data-quiz="{vid}">'
            f'{ui("quiz")} · {n} {ui("questions")}<span class="quiz-best" hidden></span></button></div>' if n else "")
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
    {quiz}
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
<section class="wrap"><p class="lead">{ui("videos_lead")}</p>{f'<p class="muted">{ui("quiz_lead")}</p>' if QUIZZES else ""}<p>{sub}</p><div class="vgrid">{grid}</div></section>
</main>'''
        head = f'<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>'
        # each quiz as schema.org Quiz, so search engines can show it as practice questions
        quiz_ld = []
        for v in VIDEOS:
            qs = QUIZZES.get(v["id"])
            if not qs:
                continue
            quiz_ld.append({
                "@type": "Quiz", "name": "Quiz: " + pick(v["title_bi"], "en"), "alternateName": "اختبار: " + pick(v["title_bi"], "ar"),
                "about": {"@type": "Thing", "name": pick(v["title_bi"], "en")}, "inLanguage": ["en", "ar"],
                "educationalAlignment": {"@type": "AlignmentObject", "alignmentType": "educationalSubject", "targetName": "Architecture"},
                "isBasedOn": f'https://www.youtube.com/watch?v={v["id"]}', "author": {"@type": "Person", "name": name_en},
                "hasPart": [{"@type": "Question", "eduQuestionType": "Multiple choice", "text": pick(q["q"], "en"),
                             "acceptedAnswer": {"@type": "Answer", "text": pick(q["options"][q["answer"]], "en"),
                                                "answerExplanation": {"@type": "Comment", "text": pick(q.get("explain", ""), "en")}},
                             "suggestedAnswer": [{"@type": "Answer", "text": pick(o, "en")}
                                                 for i, o in enumerate(q["options"]) if i != q["answer"]]} for q in qs]})
        if quiz_ld:
            head += f'<script type="application/ld+json">{json.dumps({"@context": "https://schema.org", "@graph": quiz_ld}, ensure_ascii=False)}</script>'
        vkws = ["architecture lectures", "building construction", "construction drawings", "stair design", "suspended ceilings",
                "electrical installations drawings", "passive house", "architecture quiz",
                "محاضرات عمارة", "تشييد المباني", "رسومات تنفيذية", "تصميم السلالم", "الأسقف المعلقة", "التركيبات الكهربائية",
                "البيوت الموفرة للطاقة", "اختبارات عمارة", "Build2Wise"]
        vdesc = (UI["videos_lead"][0] + " Short quizzes after each lesson. | " + UI["videos_lead"][1] + " مع اختبارات قصيرة بعد كل درس.")
        write_page("videos", layout(profile, f'Architecture Video Lessons & Quizzes | {name_en}', vdesc, body, "../",
                                    site + "/videos/", head, "", "videos", vkws))
        urls.append(site + "/videos/")

    if "articles" in nav_keys:
        grid = "".join(article_card(a, "../") for a in ARTICLES) or f'<p class="muted">{ui("no_articles")}</p>'
        body = f'''
<main>
{page_hero("articles")}
<section class="wrap"><p class="lead">{ui("articles_lead")}</p><div class="agrid">{grid}</div></section>
</main>'''
        akws = ["sustainable architecture articles", "building materials", "energy efficient buildings", "smart glass",
                "مقالات عمارة", "العمارة المستدامة", "مواد البناء", "كفاءة الطاقة في المباني"] + \
               sorted({t for a in ARTICLES for t in a["tags"]})
        write_page("articles", layout(profile, f'Scientific Articles on Sustainable Architecture | {name_en}',
                                      UI["articles_lead"][0] + " | " + UI["articles_lead"][1], body, "../",
                                      site + "/articles/", "", "", "articles", akws))
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
                                                      a["image"], "articles", a["tags"]))
    return urls


# ---------- tools (interactive calculators) ----------
def stairs_tool(heading=True):
    """Stair calculator markup; the arithmetic and drawing live in static/stairs.js."""
    def field(fid, label, inner):
        return f'<label class="calc-field" for="{fid}"><span>{bi(label)}</span>{inner}</label>'
    num = lambda fid, val, lo, hi, step: (f'<input id="{fid}" class="input" type="number" inputmode="decimal" '
                                          f'value="{val}" min="{lo}" max="{hi}" step="{step}">')
    use = ('<select id="st-use" class="input">'
           '<option value="res" data-en="Residential / private" data-ar="سكني / خاص">Residential / private</option>'
           '<option value="pub" data-en="Public building" data-ar="مبنى عام">Public building</option></select>')
    layout_sel = ('<select id="st-layout" class="input">'
                  '<option value="2" data-en="Two flights with a landing (dog-leg)" data-ar="قلبتان بينهما بسطة">Two flights with a landing (dog-leg)</option>'
                  '<option value="1" data-en="One straight flight" data-ar="قلبة واحدة مستقيمة">One straight flight</option></select>')
    stepper = ('<div class="stepper"><button type="button" class="btn btn-sm" data-step="-1" aria-label="fewer risers / قوائم أقل">−</button>'
               '<output id="st-n">–</output><button type="button" class="btn btn-sm" data-step="1" aria-label="more risers / قوائم أكثر">+</button>'
               '<button type="button" class="btn btn-sm" id="st-auto">' + bi({"en": "Auto", "ar": "تلقائي"}) + '</button></div>')
    video = next((v for v in VIDEOS if v["id"] == "OUYDQhrRlPA"), None)
    video_link = (f'<p class="muted">{bi({"en": "Explained step by step in the lesson:", "ar": "الشرح خطوة بخطوة في درس:"})} '
                  f'<a href="https://www.youtube.com/watch?v=OUYDQhrRlPA" target="_blank" rel="noopener">{bi(video["title_bi"])}</a></p>'
                  if video else "")
    h2 = f'<h2>{bi({"en": "Stair design calculator", "ar": "حاسبة تصميم السلالم"})}</h2>' if heading else ""
    return f'''
<section class="wrap" id="stairs">
  {h2}
  <p class="lead">{bi({"en": "Enter the floor-to-floor height to get the number of risers, the riser and tread sizes, the plan length of the stair and a scaled section. Change the number of risers with − / + to compare options.",
                       "ar": "أدخل ارتفاع الدور (من منسوب أرضية إلى التي تليها) لتحصل على عدد القوائم ومقاس القائمة والنائمة وطول السلم في المسقط وقطاعًا بمقياس رسم. غيّر عدد القوائم بزر − / + لتقارن البدائل."})}</p>
  {video_link}
  <div class="calc">
    <form class="calc-in" id="st-form" onsubmit="return false">
      {field("st-h", {"en": "Floor-to-floor height (cm)", "ar": "ارتفاع الدور (سم)"}, num("st-h", 300, 50, 1000, 1))}
      {field("st-use", {"en": "Building type", "ar": "نوع المبنى"}, use)}
      {field("st-layout", {"en": "Stair layout", "ar": "شكل السلم"}, layout_sel)}
      {field("st-w", {"en": "Stair width (cm)", "ar": "عرض القلبة (سم)"}, num("st-w", 120, 60, 400, 5))}
      <div class="calc-field"><span>{bi({"en": "Number of risers", "ar": "عدد القوائم"})}</span>{stepper}</div>
    </form>
    <div class="calc-out" aria-live="polite">
      <div class="calc-stats" id="st-stats"></div>
      <svg id="st-svg" class="calc-svg" role="img" aria-label="Stair section / قطاع السلم"></svg>
      <ul class="calc-checks" id="st-checks"></ul>
    </div>
  </div>
  <p class="muted calc-note">{bi({"en": "Checks follow the values taught in the Building Construction lessons: riser 15–18 cm (aim for 15), tread 30 cm standard and down to 27 cm, comfortable pitch about 27°–33°, an even number of risers for two equal flights, and the comfort rule 2R + T = 60–65 cm. Public buildings use a riser of at most 17 cm and a tread of at least 28 cm; a flight has at most 16 risers and the landing is at least as deep as the stair is wide. They are a learning aid: always confirm against the building code that applies to your project.",
                                  "ar": "الفحوص تتبع القيم المشروحة في دروس تشييد المباني: القائمة 15–18 سم (والأفضل 15)، والنائمة 30 سم ويمكن أن تقل حتى 27 سم، وزاوية الميل المريحة تقريبًا 27°–33°، وعدد الدرجات زوجي في السلم ذي القلبتين المتساويتين، وقاعدة الراحة 2ق + ن = 60–65 سم. وفي المباني العامة لا تزيد القائمة على 17 سم ولا تقل النائمة عن 28 سم، ولا تزيد القلبة الواحدة على 16 قائمة، وعمق البسطة لا يقل عن عرض القلبة. الحاسبة أداة تعليمية، فراجع دائمًا الكود المعمول به في مشروعك."})}</p>
</section>'''


def load_materials():
    data = load_json(ROOT / "content" / "materials.json")
    groups = {g["id"] for g in data["groups"]}
    for m in data["materials"]:
        if m.get("group") not in groups:
            fail(f'materials.json: "{m.get("id")}" has an unknown group / مجموعة غير معروفة')
        if not m.get("r") and not (isinstance(m.get("k"), (int, float)) and m["k"] > 0):
            fail(f'materials.json: "{m.get("id")}" needs a positive "k" (λ) / يلزم معامل توصيل موجب')
    return data


def materials_table(data):
    """Physical properties table (density, λ, R for a typical thickness), grouped; same data the calculator uses."""
    def num(v, digits):
        return "—" if v is None else (f"{v:.{digits}f}".rstrip("0").rstrip(".") if isinstance(v, float) else str(v))
    rows = ""
    for g in data["groups"]:
        rows += f'<tr class="mt-group"><th colspan="5" scope="colgroup">{bi(g)}</th></tr>'
        for m in (x for x in data["materials"] if x["group"] == g["id"]):
            r = m.get("r") or (m["d"] / 100 / m["k"] if m.get("d") else None)
            star = '<sup class="mt-star" aria-label="varies">*</sup>' if m.get("varies") else ""
            k = m.get("k")
            k_txt = "—" if not k else (f"{k:.3f}" if k < 0.1 else f"{k:.2f}" if k < 10 else f"{k:g}")
            rows += (f'<tr><th scope="row">{bi(m)}{star}</th><td>{num(m.get("density"), 0)}</td>'
                     f'<td>{k_txt}</td><td>{num(m.get("d"), 2)}</td>'
                     f'<td>{f"{r:.2f}" if r is not None else "—"}</td></tr>')
    head = "".join(f'<th scope="col">{bi(h)}</th>' for h in (
        {"en": "Material", "ar": "المادة"}, {"en": "Density ρ (kg/m³)", "ar": "الكثافة ρ (كجم/م³)"},
        {"en": "Thermal conductivity λ (W/m·K)", "ar": "معامل التوصيل الحراري λ (وات/م·ك)"},
        {"en": "Typical thickness (cm)", "ar": "السمك الشائع (سم)"},
        {"en": "Thermal resistance R = d/λ (m²·K/W)", "ar": "المقاومة الحرارية R = d/λ (م²·ك/وات)"}))
    return f'''
<section class="wrap" id="materials">
  <h2>{bi({"en": "Thermal properties of common building materials in Egypt and the Arab world", "ar": "الخصائص الحرارية لأهم مواد البناء في مصر والوطن العربي"})}</h2>
  <p class="lead">{bi({"en": "Density, thermal conductivity (λ) and thermal resistance (R) for the typical thickness of each material. A lower λ means a better insulator; a higher R means more resistance to heat flow. The calculator above uses these same values.",
                       "ar": "الكثافة ومعامل التوصيل الحراري (λ) والمقاومة الحرارية (R) للسمك الشائع لكل مادة. كلما قل λ كانت المادة أفضل عزلًا، وكلما زادت R زادت مقاومة الطبقة لانتقال الحرارة. الحاسبة أعلاه تستخدم نفس هذه القيم."})}</p>
  <div class="mt-wrap"><table class="mt">
    <thead><tr>{head}</tr></thead>
    <tbody>{rows}</tbody>
  </table></div>
  <p class="muted calc-note"><sup>*</sup> {bi({"en": "Depends strongly on the hole pattern, mix and manufacturer.", "ar": "تختلف كثيرًا حسب شكل التفريغ والخلطة والمصنّع."})}
  {bi(data["note"])}</p>
</section>'''


def uvalue_tool(data, heading=True):
    """Wall U-value calculator markup; layers, arithmetic and drawing live in static/uvalue.js."""
    calc_mats = [{k: m[k] for k in ("id", "en", "ar", "k", "r", "color", "insulation") if k in m}
                 for m in data["materials"] if not m.get("table_only")]
    mats_json = json.dumps(calc_mats, ensure_ascii=False).replace("</", "<\\/")
    num = lambda fid, val, lo, hi: (f'<input id="{fid}" class="input" type="number" inputmode="decimal" '
                                    f'value="{val}" min="{lo}" max="{hi}" step="1">')
    presets = [("brick", {"en": "Brick wall 25 cm", "ar": "حائط طوب 25 سم"}),
               ("brick-xps", {"en": "Brick + 5 cm insulation", "ar": "طوب + عزل 5 سم"}),
               ("cavity", {"en": "Double brick wall with air gap", "ar": "حائط طوب مزدوج بفراغ هوائي"}),
               ("aac", {"en": "AAC block 20 cm", "ar": "طوب خفيف (AAC) 20 سم"}),
               ("concrete", {"en": "Concrete wall 20 cm", "ar": "حائط خرسانة 20 سم"})]
    preset_btns = "".join(f'<button type="button" class="chip" data-preset="{k}">{bi(lbl)}</button>' for k, lbl in presets)
    h2 = f'<h2>{bi({"en": "Wall U-value calculator", "ar": "حاسبة العزل الحراري للحائط (معامل U)"})}</h2>' if heading else ""
    return f'''
<section class="wrap" id="uvalue">
  {h2}
  <p class="lead">{bi({"en": "Build a wall layer by layer, from outside to inside, and see its thermal resistance, its U-value and how the temperature falls through it. Start from a ready wall or add your own layers.",
                       "ar": "كوّن الحائط طبقة بطبقة من الخارج إلى الداخل، فتظهر مقاومته الحرارية ومعامل الانتقال الحراري U وكيف تتغير درجة الحرارة داخله. ابدأ من حائط جاهز أو أضف طبقاتك."})}</p>
  <script type="application/json" id="uv-mats">{mats_json}</script>
  <div class="chips chips-filter" id="uv-presets">{preset_btns}</div>
  <div class="calc">
    <div class="calc-in">
      <div class="uv-layers" id="uv-layers"></div>
      <button type="button" class="btn btn-sm" id="uv-add">+ {bi({"en": "Add layer", "ar": "أضف طبقة"})}</button>
      <div class="uv-temps">
        <label class="calc-field" for="uv-to"><span>{bi({"en": "Outside temperature (°C)", "ar": "حرارة الخارج (°م)"})}</span>{num("uv-to", 40, -30, 60)}</label>
        <label class="calc-field" for="uv-ti"><span>{bi({"en": "Inside temperature (°C)", "ar": "حرارة الداخل (°م)"})}</span>{num("uv-ti", 24, -10, 40)}</label>
      </div>
    </div>
    <div class="calc-out" aria-live="polite">
      <div class="calc-stats" id="uv-stats"></div>
      <svg id="uv-svg" class="calc-svg" role="img" aria-label="Wall section and temperature / قطاع الحائط ودرجة الحرارة"></svg>
      <div id="uv-compare"></div>
    </div>
  </div>
  <p class="muted calc-note">{bi({"en": "Method: U = 1 / (Rsi + Σ d/λ + Rse), with surface resistances Rsi = 0.13 and Rse = 0.04 m²·K/W for walls (ISO 6946) and 0.18 m²·K/W for a still air gap of 25 mm or more. The λ values come from the properties table below and you can edit them; use the manufacturer's value when you have it. Thermal bridges such as columns and beams are not included, so a real wall performs somewhat worse.",
                                  "ar": "طريقة الحساب: U = 1 / (Rsi + مجموع d/λ + Rse)، مع مقاومة السطح الداخلي Rsi = 0.13 والخارجي Rse = 0.04 م²·ك/وات للحوائط (ISO 6946)، و0.18 م²·ك/وات لفراغ هوائي ساكن سمكه 25 مم فأكثر. قيم λ مأخوذة من جدول الخصائص أدناه ويمكنك تعديلها، واستخدم قيمة المصنّع إن توفرت. الجسور الحرارية مثل الأعمدة والكمرات غير محسوبة، فأداء الحائط الفعلي أقل قليلًا."})}</p>
</section>'''


UVALUE_FAQ = [
    ({"en": "What is the U-value of a wall?", "ar": "ما معامل الانتقال الحراري U للحائط؟"},
     {"en": "The U-value (thermal transmittance) is the heat that passes through one square metre of wall for each degree of temperature difference between inside and outside, in W/m²·K. The lower the U-value, the better the wall insulates.",
      "ar": "معامل الانتقال الحراري U هو كمية الحرارة التي تنتقل خلال متر مربع واحد من الحائط لكل درجة فرق في الحرارة بين الداخل والخارج، ووحدته وات/م²·ك. كلما قل معامل U كان الحائط أفضل عزلًا."}),
    ({"en": "What is the difference between λ, R and U?", "ar": "ما الفرق بين λ وR وU؟"},
     {"en": "λ (thermal conductivity) is a property of the material. R = d/λ is the thermal resistance of one layer of thickness d. The wall's total resistance adds the layers and the two surface resistances, and U = 1 / total R.",
      "ar": "λ (معامل التوصيل الحراري) خاصية للمادة نفسها. وR = d/λ هي المقاومة الحرارية لطبقة سمكها d. والمقاومة الكلية للحائط مجموع مقاومات الطبقات ومقاومتي السطحين، ثم U = 1 ÷ المقاومة الكلية."}),
    ({"en": "How can I lower the U-value of a brick wall?", "ar": "كيف أقلل معامل U لحائط من الطوب؟"},
     {"en": "Add a layer of insulation such as XPS, EPS, rock wool or polyurethane, or build with lighter blocks such as AAC. In this calculator, adding 5 cm of XPS to a double brick wall lowers U from about 1.9 to about 0.5 W/m²·K, roughly 74% less heat through the wall.",
      "ar": "أضف طبقة عزل مثل XPS أو EPS أو الصوف الصخري أو البولي يوريثان، أو استخدم طوبًا أخف مثل الخرسانة الخلوية AAC. في هذه الحاسبة، إضافة 5 سم من XPS إلى حائط طوب مزدوج تخفض U من نحو 1.9 إلى نحو 0.5 وات/م²·ك، أي حرارة أقل بنحو 74%."}),
    ({"en": "What U-value does the building code require?", "ar": "ما قيمة U التي يشترطها الكود؟"},
     {"en": "It depends on the country, the climate zone and the building type. Check the code that applies: in Egypt the Energy Efficiency Code ECP 306, in Saudi Arabia the Saudi Building Code SBC 601/602, and the local green building regulations elsewhere in the region.",
      "ar": "تختلف حسب الدولة والمنطقة المناخية ونوع المبنى. راجع الكود المعمول به: في مصر كود تحسين كفاءة الطاقة في المباني ECP 306، وفي السعودية كود البناء السعودي SBC 601/602، ولوائح المباني الخضراء المحلية في باقي دول المنطقة."}),
    ({"en": "Does the calculator include thermal bridges?", "ar": "هل تحسب الحاسبة الجسور الحرارية؟"},
     {"en": "No. Columns, beams and slab edges conduct more heat than the wall around them, so a real wall performs somewhat worse than the result shown.",
      "ar": "لا. الأعمدة والكمرات وأطراف البلاطات توصل حرارة أكثر من الحائط حولها، فأداء الحائط الفعلي أقل قليلًا من النتيجة المعروضة."}),
    ({"en": "Can I use it for roofs?", "ar": "هل تصلح لحساب الأسقف؟"},
     {"en": "It is set up for walls (horizontal heat flow, Rsi = 0.13). For roofs ISO 6946 uses Rsi = 0.10 for upward and 0.17 for downward heat flow, so treat roof results as an approximation.",
      "ar": "الحاسبة مضبوطة للحوائط (انتقال أفقي للحرارة، Rsi = 0.13). أما الأسقف فتستخدم ISO 6946 فيها Rsi = 0.10 للانتقال لأعلى و0.17 للانتقال لأسفل، فاعتبر نتيجة السقف تقريبية."}),
]


def uvalue_example(mats):
    """Worked example computed from materials.json, so its numbers always match the calculator."""
    by_id = {m["id"]: m for m in mats["materials"]}
    layers = [("plaster", 2), ("brick", 12), ("xps", 5), ("brick", 12), ("plaster", 2)]
    rows, total = "", 0.13 + 0.04
    rows += f'<tr><th scope="row">{bi({"en": "Outside surface Rse", "ar": "السطح الخارجي Rse"})}</th><td>—</td><td>—</td><td>0.04</td></tr>'
    for mid, d in layers:
        m = by_id[mid]
        r = d / 100 / m["k"]
        total += r
        rows += f'<tr><th scope="row">{bi(m)}</th><td>{d:g}</td><td>{m["k"]:g}</td><td>{d / 100:g} ÷ {m["k"]:g} = {r:.3f}</td></tr>'
    rows += f'<tr><th scope="row">{bi({"en": "Inside surface Rsi", "ar": "السطح الداخلي Rsi"})}</th><td>—</td><td>—</td><td>0.13</td></tr>'
    rows += (f'<tr class="mt-group"><th scope="row">{bi({"en": "Total R", "ar": "المقاومة الكلية R"})}</th><td></td><td></td>'
             f'<td><b>{total:.2f}</b></td></tr>')
    u = 1 / total
    head = "".join(f'<th scope="col">{bi(h)}</th>' for h in (
        {"en": "Layer (outside → inside)", "ar": "الطبقة (من الخارج للداخل)"}, {"en": "d (cm)", "ar": "السمك d (سم)"},
        {"en": "λ (W/m·K)", "ar": "λ (وات/م·ك)"}, {"en": "R = d/λ (m²·K/W)", "ar": "R = d/λ (م²·ك/وات)"}))
    return f'''
<section class="wrap" id="example">
  <h2>{bi({"en": "How to calculate the U-value of a wall: worked example", "ar": "طريقة حساب معامل U للحائط: مثال محلول"})}</h2>
  <ol class="uv-steps">
    <li>{bi({"en": "List the layers from outside to inside with the thickness d of each, in metres.", "ar": "اكتب طبقات الحائط من الخارج إلى الداخل وسمك كل طبقة d بالمتر."})}</li>
    <li>{bi({"en": "Take the thermal conductivity λ of each material from the table below or the product data sheet.", "ar": "خذ معامل التوصيل الحراري λ لكل مادة من الجدول أدناه أو من النشرة الفنية للمنتج."})}</li>
    <li>{bi({"en": "Work out each layer's resistance R = d / λ.", "ar": "احسب مقاومة كل طبقة R = d ÷ λ."})}</li>
    <li>{bi({"en": "Add the layers and the surface resistances Rsi = 0.13 and Rse = 0.04 m²·K/W.", "ar": "اجمع مقاومات الطبقات مع مقاومتي السطحين Rsi = 0.13 وRse = 0.04 م²·ك/وات."})}</li>
    <li>{bi({"en": "U = 1 / total R.", "ar": "معامل U = 1 ÷ المقاومة الكلية."})}</li>
  </ol>
  <p>{bi({"en": "Example: a double brick wall (12 + 12 cm) with 5 cm of XPS insulation and cement plaster on both faces.", "ar": "مثال: حائط طوب مزدوج (12 + 12 سم) بينهما 5 سم عزل XPS، مع بياض أسمنتي على الوجهين."})}</p>
  <div class="mt-wrap"><table class="mt"><thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table></div>
  <p class="uv-answer">U = 1 ÷ {total:.2f} = <b>{u:.2f} W/m²·K</b></p>
</section>'''


def uvalue_share_card(profile):
    """1200x630 link-preview image for /tools/u-value/ (rendered like the paper cards)."""
    bars = "".join(f'<i style="background:{c};flex:{w}"></i>' for c, w in
                   (("#cfc8bb", 2), ("#b5583a", 12), ("#9cc7e8", 5), ("#b5583a", 12), ("#cfc8bb", 2)))
    return f'''<!doctype html><html><head><meta charset="utf-8"><link href="{FONTS}" rel="stylesheet"><style>
*{{box-sizing:border-box;margin:0}}html,body{{width:1200px;height:630px;overflow:hidden}}
body{{font-family:"IBM Plex Sans Arabic","Segoe UI",Arial,sans-serif;background:#13294b;color:#fff;padding:56px 64px;display:flex;gap:56px;align-items:center;
background-image:linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px);background-size:28px 28px}}
.txt{{flex:1}}h1{{font-family:"Source Serif 4",Georgia,serif;font-size:58px;line-height:1.1}}
.ar{{font-family:"Noto Naskh Arabic",serif;font-size:46px;direction:rtl;margin-top:18px;color:#f3ecdb}}
p{{font-size:24px;margin-top:22px;color:#dfe5ef}}.u{{color:#d2b06a;font-weight:700}}
.wall{{width:300px;height:420px;display:flex;border:3px solid #d2b06a;border-radius:10px;overflow:hidden;position:relative}}
.wall i{{display:block}}.foot{{margin-top:30px;font-size:20px;color:#d2b06a}}
</style></head><body><div class="txt"><h1>Wall U-value Calculator</h1><div class="ar">حاسبة معامل U والعزل الحراري للحوائط</div>
<p>Layers → R → <span class="u">U (W/m²·K)</span> · temperature profile · materials table</p>
<div class="foot">{esc(profile.get("site_url", "").replace("https://", ""))}/tools/u-value/</div></div>
<div class="wall">{bars}</div></body></html>'''


def build_uvalue_page(profile, mats):
    site = profile.get("site_url", "").rstrip("/")
    name_en = pick(profile["name"], "en")
    base = "../../"
    url = site + "/tools/u-value/"
    image = render_share_card(profile, "u-value", uvalue_share_card(profile))
    intro = {"en": "Calculate the U-value (thermal transmittance) and thermal resistance of any wall online, free. Choose materials used in Egypt and the Arab world, such as red brick, cement brick, AAC, concrete, XPS, EPS and rock wool, enter the thickness of each layer and see straight away how much heat the wall lets through, how the temperature falls inside it, and how much an insulation layer saves.",
             "ar": "احسب معامل الانتقال الحراري U والمقاومة الحرارية لأي حائط أونلاين ومجانًا. اختر مواد البناء المستخدمة في مصر والوطن العربي، مثل الطوب الأحمر والطوب الأسمنتي والطوب الخفيف AAC والخرسانة وألواح العزل XPS وEPS والصوف الصخري، وأدخل سمك كل طبقة، فترى فورًا كم يمرر الحائط من حرارة، وكيف تتغير درجة الحرارة داخله، وكم توفر طبقة العزل."}
    related = [
        (f'{base}tools/stairs/', {"en": "Stair design calculator", "ar": "حاسبة تصميم السلالم"}),
        (f'{base}videos/', {"en": "Video: the science behind Passive Houses (with a quiz)", "ar": "فيديو: العلم وراء البيوت الموفرة للطاقة (مع اختبار)"}),
        (f'{base}papers/nanomaterials-thermal-efficiency-envelopes-2023/', {"en": "Research: nanomaterials and the thermal efficiency of building envelopes", "ar": "بحث: مواد النانو والكفاءة الحرارية لأغلفة المباني"}),
        (f'{base}papers/adaptive-envelopes-administrative-2026/', {"en": "Research: adaptive building envelopes in hot-arid climates", "ar": "بحث: الأغلفة المتكيفة للمباني الإدارية في المناخ الحار الجاف"}),
    ]
    rel = "".join(f'<li><a href="{h}">{bi(t)}</a></li>' for h, t in related)
    body = f'''
<main>
{tool_hero(base, {"en": "Wall U-value Calculator: Thermal Insulation Online", "ar": "حاسبة معامل U والعزل الحراري للحوائط أونلاين"})}
<section class="wrap"><p class="lead">{bi(intro)}</p>
  <p class="btn-row"><a class="btn" href="#example">{bi({"en": "Worked example", "ar": "مثال محلول"})}</a>
  <a class="btn" href="#materials">{bi({"en": "Material properties table", "ar": "جدول خصائص المواد"})}</a>
  <a class="btn" href="#faq">{bi({"en": "FAQ", "ar": "أسئلة شائعة"})}</a></p></section>
{uvalue_tool(mats, heading=False)}
{uvalue_example(mats)}
{materials_table(mats)}
{faq_section(UVALUE_FAQ, {"en": "Frequently asked questions about U-value and wall insulation", "ar": "أسئلة شائعة عن معامل U والعزل الحراري للحوائط"})}
<section class="wrap"><h2>{bi({"en": "Related", "ar": "روابط ذات صلة"})}</h2><ul class="uv-related">{rel}</ul></section>
</main>'''
    author = {"@type": "Person", "name": name_en, "url": site + "/", "jobTitle": pick(profile.get("title", ""), "en")}
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "WebApplication", "name": "Wall U-value calculator", "alternateName": "حاسبة معامل U والعزل الحراري للحوائط",
         "url": url, "applicationCategory": "EducationalApplication", "operatingSystem": "Any", "isAccessibleForFree": True,
         "inLanguage": ["en", "ar"], "description": intro["en"], "image": image or None,
         "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}, "author": author,
         "featureList": ["Layer-by-layer wall builder", "Thermal resistance and U-value", "Temperature profile through the wall",
                         "Comparison with and without insulation", "Thermal properties table of building materials"]},
        {"@type": "Dataset", "name": "Thermal properties of common building materials in Egypt and the Arab world",
         "alternateName": "الخصائص الحرارية لأهم مواد البناء في مصر والوطن العربي", "url": url + "#materials",
         "description": pick(mats["note"], "en"), "creator": author, "isAccessibleForFree": True, "inLanguage": ["en", "ar"],
         "variableMeasured": ["Density (kg/m3)", "Thermal conductivity λ (W/m·K)", "Thermal resistance R (m2·K/W)"]},
        faq_ld(UVALUE_FAQ),
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": site + "/"},
            {"@type": "ListItem", "position": 2, "name": "Tools", "item": site + "/tools/"},
            {"@type": "ListItem", "position": 3, "name": "Wall U-value calculator", "item": url}]}]}
    ld["@graph"][0] = {k: v for k, v in ld["@graph"][0].items() if v is not None}
    head = (f'<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>'
            f'<script src="{base}static/uvalue.js" defer></script>')
    desc = ("Free wall U-value calculator: add layers, get thermal resistance, U-value and the temperature profile, with a table "
            "of building-material conductivities. | حاسبة مجانية لمعامل U والعزل الحراري للحوائط وجدول خصائص مواد البناء.")
    kws = ["U-value calculator", "wall U-value calculator", "thermal transmittance calculator", "thermal insulation calculator",
           "R-value calculator", "how to calculate U-value", "thermal resistance of a wall", "thermal conductivity of building materials",
           "insulation thickness", "brick wall U-value", "XPS insulation", "AAC block U-value", "building envelope", "energy efficient buildings",
           "حاسبة معامل U", "حساب معامل الانتقال الحراري", "حساب العزل الحراري للحوائط", "حاسبة العزل الحراري", "حساب المقاومة الحرارية للجدار",
           "معامل التوصيل الحراري لمواد البناء", "سمك العزل الحراري", "العزل الحراري للمباني", "العزل الحراري في مصر", "العزل الحراري في السعودية",
           "كود العزل الحراري", "قيمة U للجدران", "العزل الحراري للطوب الأحمر", "عزل الفوم", "الصوف الصخري", "الطوب الخفيف"]
    write_page("tools/u-value", layout(profile, "U-Value Calculator for Walls | حاسبة معامل U والعزل الحراري", desc, body, base,
                                       url, head, image, "tools", kws))
    return url


STAIRS_FAQ = [
    ({"en": "How do I calculate the number of stair risers?", "ar": "كيف أحسب عدد درجات السلم (القوائم)؟"},
     {"en": "Divide the floor-to-floor height by the riser height, aiming for 15 cm and never more than 18 cm. For a 3.00 m floor: 300 ÷ 15 = 20 risers.",
      "ar": "اقسم ارتفاع الدور على ارتفاع القائمة، والأفضل 15 سم ولا تزيد على 18 سم. لدور ارتفاعه 3.00 م: 300 ÷ 15 = 20 قائمة."}),
    ({"en": "What are the standard riser and tread sizes?", "ar": "ما المقاسات القياسية للقائمة والنائمة؟"},
     {"en": "Riser 15–18 cm (15 is preferred) and tread 30 cm, which can be reduced to 27 cm as the riser grows. In public buildings the riser is at most 17 cm and the tread at least 28 cm.",
      "ar": "القائمة 15–18 سم (والأفضل 15)، والنائمة 30 سم ويمكن أن تقل حتى 27 سم كلما زادت القائمة. وفي المباني العامة لا تزيد القائمة على 17 سم ولا تقل النائمة عن 28 سم."}),
    ({"en": "What is the 2R + T rule?", "ar": "ما قاعدة 2ق + ن؟"},
     {"en": "Twice the riser plus the tread should fall between 60 and 65 cm, matching a comfortable walking stride. For example 2 × 15 + 30 = 60 cm.",
      "ar": "ضعف القائمة مضافًا إليه النائمة يجب أن يكون بين 60 و65 سم، وهو ما يناسب خطوة الإنسان المريحة. مثلًا 2 × 15 + 30 = 60 سم."}),
    ({"en": "Why should a two-flight stair have an even number of risers?", "ar": "لماذا يكون عدد الدرجات زوجيًا في السلم ذي القلبتين؟"},
     {"en": "So the two flights are equal and the landing sits at mid-height: 9 + 9 = 18, 10 + 10 = 20, 11 + 11 = 22.",
      "ar": "حتى تتساوى القلبتان وتكون البسطة في منتصف الارتفاع: 9 + 9 = 18، و10 + 10 = 20، و11 + 11 = 22."}),
    ({"en": "What is a comfortable stair pitch?", "ar": "ما زاوية الميل المريحة للسلم؟"},
     {"en": "About 27° to 33°. A steeper stair is tiring and unsafe; a flatter one wastes floor area.",
      "ar": "تقريبًا من 27° إلى 33°. السلم الأشد ميلًا متعب وغير آمن، والأقل ميلًا يهدر مساحة."}),
    ({"en": "How long is the stair in plan?", "ar": "كم يكون طول السلم في المسقط الأفقي؟"},
     {"en": "Each flight's going is (risers in the flight − 1) × tread, plus a landing at least as deep as the stair is wide. For 10 + 10 risers with a 30 cm tread and a 1.20 m wide stair: 9 × 30 = 2.70 m + 1.20 m = 3.90 m.",
      "ar": "طول كل قلبة = (عدد قوائمها − 1) × النائمة، مضافًا إليه بسطة لا يقل عمقها عن عرض القلبة. لسلم 10 + 10 قوائم بنائمة 30 سم وعرض 1.20 م: 9 × 30 = 2.70 م + 1.20 م = 3.90 م."}),
]


def faq_section(faq, title):
    items = "".join(f'<details class="faq"><summary>{bi(q)}</summary><p>{bi(a)}</p></details>' for q, a in faq)
    return f'<section class="wrap" id="faq"><h2>{bi(title)}</h2>{items}</section>'


def faq_ld(faq):
    return {"@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": pick(q, lang), "acceptedAnswer": {"@type": "Answer", "text": pick(a, lang)}}
        for lang in ("en", "ar") for q, a in faq]}


def tool_hero(base, title):
    return (f'<section class="page-hero"><div class="wrap"><p class="crumbs"><a href="{base}">{ui("home")}</a> › '
            f'<a href="{base}tools/">{ui("tools")}</a></p><h1>{bi(title)}</h1></div></section>')


def render_share_card(profile, slug, html_text):
    """Renders cards/<slug>.png for a tool page; returns its absolute URL, or "" without a browser or with --no-cards."""
    browser = find_browser() if "--no-cards" not in sys.argv else None
    if not browser:
        return ""
    d = OUT / "cards"
    d.mkdir(exist_ok=True)
    page = d / f"{slug}.html"
    page.write_text(html_text, encoding="utf-8")
    if render_png(browser, page, d / f"{slug}.png", tempfile.mkdtemp(prefix="cards-")):
        return profile.get("site_url", "").rstrip("/") + f"/cards/{slug}.png"
    return ""


def stairs_share_card(profile):
    steps = "".join(f'<path d="M{20 + i * 34} {380 - i * 34}h34v-34"/>' for i in range(10))
    return f'''<!doctype html><html><head><meta charset="utf-8"><link href="{FONTS}" rel="stylesheet"><style>
*{{box-sizing:border-box;margin:0}}html,body{{width:1200px;height:630px;overflow:hidden}}
body{{font-family:"IBM Plex Sans Arabic","Segoe UI",Arial,sans-serif;background:#13294b;color:#fff;padding:56px 64px;display:flex;gap:40px;align-items:center;
background-image:linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px);background-size:28px 28px}}
.txt{{flex:1}}h1{{font-family:"Source Serif 4",Georgia,serif;font-size:60px;line-height:1.1}}
.ar{{font-family:"Noto Naskh Arabic",serif;font-size:48px;direction:rtl;margin-top:18px;color:#f3ecdb}}
p{{font-size:24px;margin-top:22px;color:#dfe5ef}}.u{{color:#d2b06a;font-weight:700}}.foot{{margin-top:30px;font-size:20px;color:#d2b06a}}
svg{{width:420px;height:420px}}path{{fill:none;stroke:#d2b06a;stroke-width:5;stroke-linejoin:round}}
</style></head><body><div class="txt"><h1>Stair Design Calculator</h1><div class="ar">حاسبة تصميم السلالم</div>
<p>Risers · treads · <span class="u">2R + T</span> · flights · scaled section</p>
<div class="foot">{esc(profile.get("site_url", "").replace("https://", ""))}/tools/stairs/</div></div>
<svg viewBox="0 0 400 400"><path d="M10 380H390" style="stroke:#fff;stroke-width:4"/>{steps}</svg></body></html>'''


def build_stairs_page(profile):
    site = profile.get("site_url", "").rstrip("/")
    name_en = pick(profile["name"], "en")
    base = "../../"
    url = site + "/tools/stairs/"
    image = render_share_card(profile, "stairs", stairs_share_card(profile))
    intro = {"en": "Design a staircase online, free: enter the floor-to-floor height and get the number of risers, the riser and tread dimensions, the 2R + T comfort check, the pitch, the plan length with the landing and a scaled section of the stair. The values follow the Building Construction lessons on the Build2Wise channel, for architecture and civil engineering students.",
             "ar": "صمّم السلم أونلاين ومجانًا: أدخل ارتفاع الدور فتحصل على عدد القوائم، ومقاس القائمة والنائمة، وفحص قاعدة 2ق + ن، وزاوية الميل، وطول السلم في المسقط مع البسطة، وقطاع للسلم بمقياس رسم. القيم مأخوذة من دروس تشييد المباني على قناة Build2Wise، لطلاب العمارة والهندسة المدنية."}
    example = f'''
<section class="wrap" id="example">
  <h2>{bi({"en": "How to design a stair: worked example", "ar": "طريقة تصميم السلم: مثال محلول"})}</h2>
  <p>{bi({"en": "A two-flight stair for a floor height of 3.00 m, 1.20 m wide:", "ar": "سلم من قلبتين لدور ارتفاعه 3.00 م وعرض القلبة 1.20 م:"})}</p>
  <ol class="uv-steps">
    <li>{bi({"en": "Number of risers = 300 ÷ 15 = 20 (even, so 10 + 10).", "ar": "عدد القوائم = 300 ÷ 15 = 20 (عدد زوجي، أي 10 + 10)."})}</li>
    <li>{bi({"en": "Riser = 300 ÷ 20 = 15 cm; tread = 30 cm.", "ar": "القائمة = 300 ÷ 20 = 15 سم، والنائمة = 30 سم."})}</li>
    <li>{bi({"en": "Check: 2 × 15 + 30 = 60 cm, within 60–65.", "ar": "الفحص: 2 × 15 + 30 = 60 سم، أي ضمن 60–65."})}</li>
    <li>{bi({"en": "Each flight: (10 − 1) × 30 = 2.70 m; with a 1.20 m landing the stair is 3.90 m long in plan.", "ar": "طول كل قلبة: (10 − 1) × 30 = 2.70 م، ومع بسطة 1.20 م يصبح طول السلم في المسقط 3.90 م."})}</li>
    <li>{bi({"en": "Landing level = 10 × 15 = +1.50 m.", "ar": "منسوب البسطة = 10 × 15 = ‎+1.50 م."})}</li>
  </ol>
</section>'''
    related = [
        (f'{base}tools/u-value/', {"en": "Wall U-value and thermal insulation calculator", "ar": "حاسبة معامل U والعزل الحراري للحوائط"}),
        ("https://www.youtube.com/watch?v=OUYDQhrRlPA", {"en": "Video lesson: Stairs Design", "ar": "درس فيديو: تصميم السلالم"}),
        (f'{base}videos/', {"en": "Video: review of concrete staircase drawings (with a quiz)", "ar": "فيديو: تعقيب على لوحات السلالم الخرسانية (مع اختبار)"}),
    ]
    rel = "".join(f'<li><a href="{h}">{bi(t)}</a></li>' for h, t in related)
    body = f'''
<main>
{tool_hero(base, {"en": "Stair Design Calculator: Risers, Treads and Section", "ar": "حاسبة تصميم السلالم: القوائم والنوائم والقطاع"})}
<section class="wrap"><p class="lead">{bi(intro)}</p>
  <p class="btn-row"><a class="btn" href="#example">{bi({"en": "Worked example", "ar": "مثال محلول"})}</a>
  <a class="btn" href="#faq">{bi({"en": "FAQ", "ar": "أسئلة شائعة"})}</a></p></section>
{stairs_tool(heading=False)}
{example}
{faq_section(STAIRS_FAQ, {"en": "Frequently asked questions about stair design", "ar": "أسئلة شائعة عن تصميم السلالم"})}
<section class="wrap"><h2>{bi({"en": "Related", "ar": "روابط ذات صلة"})}</h2><ul class="uv-related">{rel}</ul></section>
</main>'''
    author = {"@type": "Person", "name": name_en, "url": site + "/", "jobTitle": pick(profile.get("title", ""), "en")}
    app = {"@type": "WebApplication", "name": "Stair design calculator", "alternateName": "حاسبة تصميم السلالم", "url": url,
           "applicationCategory": "EducationalApplication", "operatingSystem": "Any", "isAccessibleForFree": True,
           "inLanguage": ["en", "ar"], "description": intro["en"], "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
           "author": author, "featureList": ["Number of risers", "Riser and tread sizes", "2R+T comfort rule", "Pitch",
                                             "Plan length and landing", "Scaled section drawing"]}
    if image:
        app["image"] = image
    ld = {"@context": "https://schema.org", "@graph": [app, faq_ld(STAIRS_FAQ), {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": site + "/"},
        {"@type": "ListItem", "position": 2, "name": "Tools", "item": site + "/tools/"},
        {"@type": "ListItem", "position": 3, "name": "Stair design calculator", "item": url}]}]}
    head = (f'<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>'
            f'<script src="{base}static/stairs.js" defer></script>')
    desc = ("Free stair design calculator: number of risers, riser and tread, 2R+T check, pitch, plan length and a scaled section. "
            "| حاسبة مجانية لتصميم السلالم: عدد القوائم والقائمة والنائمة وقاعدة 2ق+ن وطول السلم وقطاع بمقياس رسم.")
    kws = ["stair design calculator", "staircase calculator", "stair riser and tread calculator", "how to design a staircase",
           "number of stair steps", "2R+T rule", "Blondel formula", "dog-leg stair", "stair landing", "stair pitch",
           "حاسبة تصميم السلالم", "تصميم السلالم", "حساب عدد درجات السلم", "القائمة والنائمة", "مقاسات درجات السلم",
           "قاعدة 2ق+ن", "تصميم سلم قلبتين", "بسطة السلم", "زاوية ميل السلم", "طول السلم في المسقط", "تشييد المباني"]
    write_page("tools/stairs", layout(profile, "Stair Design Calculator | حاسبة تصميم السلالم: القائمة والنائمة", desc, body,
                                      base, url, head, image, "tools", kws))
    return url


SUNPATH_FAQ = [
    ({"en": "How do I calculate the length of a shadow?", "ar": "كيف أحسب طول الظل؟"},
     {"en": "Shadow length = object height ÷ tan(solar altitude). A 10 m object with the sun at 36.5° casts a shadow of about 13.5 m on level ground.",
      "ar": "طول الظل = ارتفاع الجسم ÷ ظل زاوية ارتفاع الشمس (tan). جسم ارتفاعه 10 م والشمس على ارتفاع 36.5° يلقي ظلًا طوله نحو 13.5 م على أرض مستوية."}),
    ({"en": "What is the difference between solar altitude and azimuth?", "ar": "ما الفرق بين ارتفاع الشمس وسمت الشمس؟"},
     {"en": "Altitude is the angle of the sun above the horizon. Azimuth is its compass direction, measured clockwise from true north: 90° is east, 180° south and 270° west.",
      "ar": "ارتفاع الشمس هو زاويتها فوق الأفق. والسمت هو اتجاهها على البوصلة مقيسًا مع عقارب الساعة من الشمال الحقيقي: 90° شرق، و180° جنوب، و270° غرب."}),
    ({"en": "How high does the sun get in Cairo?", "ar": "ما أقصى ارتفاع للشمس في القاهرة؟"},
     {"en": "At solar noon in Cairo the sun reaches about 83.4° at the June solstice, 59.9° at the March equinox and 36.5° at the December solstice. That is why shading that works in June may not stop low winter sun.",
      "ar": "عند الظهر الشمسي في القاهرة تصل الشمس إلى نحو 83.4° في انقلاب يونيو، و59.9° في اعتدال مارس، و36.5° في انقلاب ديسمبر. ولهذا قد لا يحجب التظليل المناسب في يونيو شمس الشتاء المنخفضة."}),
    ({"en": "Why is the sun not due south at exactly 12:00?", "ar": "لماذا لا تكون الشمس جنوبًا تمامًا عند الساعة 12:00؟"},
     {"en": "Clock time differs from solar time because of the site's longitude, the equation of time and daylight saving. In Cairo on 21 December solar noon falls at about 11:53.",
      "ar": "يختلف توقيت الساعة عن التوقيت الشمسي بسبب خط طول الموقع ومعادلة الزمن والتوقيت الصيفي. في القاهرة يوم 21 ديسمبر يقع الظهر الشمسي نحو الساعة 11:53."}),
    ({"en": "Which UTC offset should I enter for Egypt?", "ar": "ما فرق التوقيت الذي أدخله لمصر؟"},
     {"en": "Enter the offset in force on the chosen date: +2 in winter and +3 during daylight saving time. The calculator has no time zone database, so check the current rules.",
      "ar": "أدخل الفرق المعمول به في التاريخ المختار: +2 شتاءً و+3 في التوقيت الصيفي. لا تحتوي الحاسبة على قاعدة بيانات للمناطق الزمنية، فراجع القواعد الحالية."}),
    ({"en": "Can I use the results for a whole building?", "ar": "هل تصلح النتائج لمبنى كامل؟"},
     {"en": "They are for preliminary design. The tool models one vertical object on level ground, not a 3D building, and leaves out terrain, neighbouring buildings and refraction. Directions are from true north, not magnetic north.",
      "ar": "النتائج للتصميم المبدئي. تحسب الأداة جسمًا رأسيًا واحدًا على أرض مستوية وليس مبنى ثلاثي الأبعاد، ولا تشمل التضاريس والمباني المجاورة والانكسار الجوي. والاتجاهات من الشمال الحقيقي لا المغناطيسي."}),
]


def sunpath_tool():
    """Sun path calculator markup; page logic in static/sunpath.js, solar position in static/solar.js."""
    def field(fid, label, inner):
        return (f'<div class="calc-field"><label for="{fid}">{bi(label)}</label>{inner}'
                f'<p class="sp-err" id="e_{fid}" role="alert"></p></div>')

    def num(fid, val, step, extra=""):
        return (f'<input id="{fid}" class="input" type="number" step="{step}" inputmode="decimal" value="{val}" '
                f'aria-describedby="e_{fid}"{extra}>')

    metric = lambda mid, label: f'<div class="metric"><b id="{mid}">—</b><span>{bi(label)}</span></div>'
    # the left-to-right mark keeps this text in order inside an Arabic page
    scales = "".join(f'<option value="{v}">‎1 px = {v} m</option>' for v in ("0.1", "0.5", "1", "2", "5"))
    return f'''
<section class="wrap" id="calculator">
  <div class="calc">
    <form class="calc-in" id="sp-form" novalidate autocomplete="off" onsubmit="return false">
      {field("lat", {"en": "Latitude (°, north +)", "ar": "خط العرض (°، الشمال +)"}, num("lat", "30.0444", "any"))}
      {field("lon", {"en": "Longitude (°, east +)", "ar": "خط الطول (°، الشرق +)"}, num("lon", "31.2357", "any"))}
      {field("date", {"en": "Date", "ar": "التاريخ"}, '<input id="date" class="input" type="date" value="2026-06-21" aria-describedby="e_date">')}
      {field("time", {"en": "Local clock time", "ar": "التوقيت المحلي (الساعة)"}, '<input id="time" class="input" type="time" value="12:00" aria-describedby="e_time">')}
      {field("utc", {"en": "UTC offset on this date (h)", "ar": "فرق التوقيت عن UTC في هذا التاريخ (ساعة)"}, num("utc", "3", "0.25"))}
      {field("height", {"en": "Object height (m)", "ar": "ارتفاع الجسم (م)"}, num("height", "10", "any", ' min="0"'))}
      <div class="calc-field"><label for="scale">{bi({"en": "Diagram scale", "ar": "مقياس الرسم"})}</label>
        <select id="scale" class="input"><option value="auto" data-en="Auto-fit (not to scale)" data-ar="ملاءمة تلقائية (غير مقيس)">Auto-fit (not to scale)</option>{scales}</select></div>
      <p class="muted sp-note">{bi({"en": "Default: Cairo. Enter the UTC offset in force on the chosen date, including daylight saving (Cairo: +2 in winter, +3 during DST; check the current rules).",
                                    "ar": "القيم الافتراضية للقاهرة. أدخل فرق التوقيت المعمول به في التاريخ المختار شاملًا التوقيت الصيفي (القاهرة: +2 شتاءً و+3 في التوقيت الصيفي؛ راجع القواعد الحالية)."})}</p>
    </form>
    <div class="calc-out" aria-live="polite">
      <div class="calc-stats sp-stats">
        {metric("alt", {"en": "solar altitude", "ar": "ارتفاع الشمس"})}
        {metric("azi", {"en": "solar azimuth (from true north)", "ar": "سمت الشمس (من الشمال الحقيقي)"})}
        {metric("shadow", {"en": "shadow length (flat ground)", "ar": "طول الظل (أرض مستوية)"})}
        {metric("direction", {"en": "shadow bearing (from true north)", "ar": "اتجاه الظل (من الشمال الحقيقي)"})}
        {metric("decl", {"en": "solar declination", "ar": "ميل الشمس"})}
        {metric("eot", {"en": "equation of time", "ar": "معادلة الزمن"})}
      </div>
      <p class="sp-warn" id="warn" hidden></p>
      <svg id="drawing" class="calc-svg" viewBox="0 0 600 420" role="img" aria-label="Plan-view shadow diagram, north up / مخطط الظل في المسقط، الشمال لأعلى">
        <defs><marker id="sp-arrow" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" class="sp-sunfill"/></marker></defs>
        <circle cx="300" cy="200" r="150" class="sp-ring"/>
        <path d="M300 35V365M135 200H465" class="sp-axis"/>
        <text x="300" y="26" text-anchor="middle" class="sp-t" id="tN">N</text>
        <text x="300" y="386" text-anchor="middle" class="sp-t" id="tS">S</text>
        <text x="476" y="205" class="sp-t" id="tE">E</text>
        <text x="124" y="205" text-anchor="end" class="sp-t" id="tW">W</text>
        <line id="shadowLine" x1="300" y1="200" x2="300" y2="200" class="sp-shadow"/>
        <path id="beyond" d="" class="sp-beyond" visibility="hidden"/>
        <line id="sunLine" x1="300" y1="200" x2="300" y2="80" class="sp-sun" marker-end="url(#sp-arrow)"/>
        <rect x="290" y="190" width="20" height="20" class="sp-obj"/>
        <g id="scaleBar" visibility="hidden"><line id="sbLine" x1="40" y1="405" x2="140" y2="405" class="sp-bar"/><text id="sbText" x="40" y="398" class="sp-s"></text></g>
        <text id="sketch" x="560" y="405" text-anchor="end" class="sp-sk"></text>
      </svg>
      <p class="muted" id="disclaimer"></p>
    </div>
  </div>
  <p class="muted calc-note">{bi({"en": "Method: NOAA Solar Calculator algorithm (after Meeus, Astronomical Algorithms), checked against NREL SPA to within about 0.01° in altitude and 0.03° in azimuth. Altitude is geometric, without atmospheric refraction. For preliminary design only, not for survey, regulatory or high-precision engineering use.",
                                  "ar": "الطريقة: خوارزمية NOAA لحساب موضع الشمس (وفق Meeus)، وقد قورنت بنموذج NREL SPA بفارق نحو 0.01° في الارتفاع و0.03° في السمت. الارتفاع هندسي دون الانكسار الجوي. النتائج للتصميم المبدئي فقط، وليست للمسح أو الاعتماد التنظيمي أو الهندسة عالية الدقة."})}</p>
</section>'''


def sunpath_share_card(profile):
    return f'''<!doctype html><html><head><meta charset="utf-8"><link href="{FONTS}" rel="stylesheet"><style>
*{{box-sizing:border-box;margin:0}}html,body{{width:1200px;height:630px;overflow:hidden}}
body{{font-family:"IBM Plex Sans Arabic","Segoe UI",Arial,sans-serif;background:#13294b;color:#fff;padding:56px 64px;display:flex;gap:40px;align-items:center;
background-image:linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px);background-size:28px 28px}}
.txt{{flex:1}}h1{{font-family:"Source Serif 4",Georgia,serif;font-size:56px;line-height:1.1}}
.ar{{font-family:"Noto Naskh Arabic",serif;font-size:46px;direction:rtl;margin-top:18px;color:#f3ecdb}}
p{{font-size:24px;margin-top:22px;color:#dfe5ef}}.u{{color:#d2b06a;font-weight:700}}.foot{{margin-top:30px;font-size:20px;color:#d2b06a}}
svg{{width:420px;height:300px}}path{{fill:none;stroke:#d2b06a;stroke-width:3;stroke-dasharray:6 8}}
.arc{{stroke:#fff;stroke-width:4;stroke-dasharray:none}}circle{{fill:#d2b06a}}.g{{stroke:#fff;stroke-width:5;stroke-dasharray:none}}.s{{stroke:#8ea3bd;stroke-width:14;stroke-dasharray:none;stroke-linecap:round}}
</style></head><body><div class="txt"><h1>Sun Path &amp; Shadow Calculator</h1><div class="ar">حاسبة مسار الشمس والظلال</div>
<p>Altitude · azimuth · <span class="u">shadow length</span> · plan diagram</p>
<div class="foot">{esc(profile.get("site_url", "").replace("https://", ""))}/tools/sun-path/</div></div>
<svg viewBox="0 0 420 300"><path d="M90 230L312 82"/><path class="arc" d="M30 230 A180 180 0 0 1 390 230"/><circle cx="312" cy="82" r="24"/><path class="g" d="M10 230H410"/><path class="s" d="M210 230H90"/><path class="g" d="M210 230V150"/></svg></body></html>'''


def build_sunpath_page(profile):
    site = profile.get("site_url", "").rstrip("/")
    name_en = pick(profile["name"], "en")
    base = "../../"
    url = site + "/tools/sun-path/"
    image = render_share_card(profile, "sun-path", sunpath_share_card(profile))
    intro = {"en": "Find the position of the sun and the length of a shadow for any place, date and time, free and online. Enter the site, the date, the clock time and the object height to get solar altitude, azimuth, shadow length and direction, with a plan diagram. It helps architects and students study building orientation, shading and overshadowing, in Egypt and anywhere else.",
             "ar": "احسب موضع الشمس وطول الظل لأي مكان وتاريخ ووقت، مجانًا وأونلاين. أدخل الموقع والتاريخ والساعة وارتفاع الجسم، فتحصل على ارتفاع الشمس وسمتها وطول الظل واتجاهه مع مخطط في المسقط. تساعد الأداة المعماريين والطلاب على دراسة توجيه المباني والتظليل والظلال المتبادلة، في مصر وأي مكان آخر."}
    example = f'''
<section class="wrap" id="example">
  <h2>{bi({"en": "How to calculate a shadow: worked example", "ar": "طريقة حساب الظل: مثال محلول"})}</h2>
  <p>{bi({"en": "A 10 m high object in Cairo (30.04° N, 31.24° E) on 21 December at 12:00, UTC +2:", "ar": "جسم ارتفاعه 10 م في القاهرة (30.04° شمالًا، 31.24° شرقًا) يوم 21 ديسمبر الساعة 12:00، بفرق توقيت +2:"})}</p>
  <ol class="uv-steps">
    <li>{bi({"en": "The calculator gives a solar altitude of 36.5° and an azimuth of 182.0°, so the sun is almost due south.", "ar": "تعطي الحاسبة ارتفاعًا للشمس قدره 36.5° وسمتًا قدره 182.0°، أي أن الشمس جنوبًا تقريبًا."})}</li>
    <li>{bi({"en": "Shadow length = height ÷ tan(altitude) = 10 ÷ tan(36.5°) ≈ 13.5 m.", "ar": "طول الظل = الارتفاع ÷ tan(الارتفاع الشمسي) = 10 ÷ tan(36.5°) ≈ 13.5 م."})}</li>
    <li>{bi({"en": "Shadow bearing = azimuth + 180° = 2.0°, so the shadow falls almost due north.", "ar": "اتجاه الظل = السمت + 180° = 2.0°، أي أن الظل يقع شمالًا تقريبًا."})}</li>
  </ol>
  <p>{bi({"en": "At midday on 21 June the same object casts a much shorter shadow, so test both the summer and winter dates when you study spacing and shading.", "ar": "وظهر يوم 21 يونيو يلقي الجسم نفسه ظلًا أقصر بكثير، فاختبر تاريخي الصيف والشتاء عند دراسة التباعد والتظليل."})}</p>
</section>'''
    related = [
        (f'{base}tools/u-value/', {"en": "Wall U-value and thermal insulation calculator", "ar": "حاسبة معامل U والعزل الحراري للحوائط"}),
        (f'{base}tools/stairs/', {"en": "Stair design calculator", "ar": "حاسبة تصميم السلالم"}),
        (f'{base}articles/', {"en": "Articles on sustainable architecture", "ar": "مقالات في العمارة المستدامة"}),
        (f'{base}papers/adaptive-envelopes-administrative-2026/', {"en": "Research: adaptive building envelopes in hot-arid climates", "ar": "بحث: الأغلفة المتكيفة للمباني الإدارية في المناخ الحار الجاف"}),
    ]
    rel = "".join(f'<li><a href="{h}">{bi(t)}</a></li>' for h, t in related)
    body = f'''
<main>
{tool_hero(base, {"en": "Sun Path & Shadow Calculator for Architects", "ar": "حاسبة مسار الشمس والظلال للمعماريين"})}
<section class="wrap"><p class="lead">{bi(intro)}</p>
  <p class="btn-row"><a class="btn" href="#example">{bi({"en": "Worked example", "ar": "مثال محلول"})}</a>
  <a class="btn" href="#faq">{bi({"en": "FAQ", "ar": "أسئلة شائعة"})}</a></p></section>
{sunpath_tool()}
{example}
{faq_section(SUNPATH_FAQ, {"en": "Frequently asked questions about sun path and shadows", "ar": "أسئلة شائعة عن مسار الشمس والظلال"})}
<section class="wrap"><h2>{bi({"en": "Related", "ar": "روابط ذات صلة"})}</h2><ul class="uv-related">{rel}</ul></section>
</main>'''
    author = {"@type": "Person", "name": name_en, "url": site + "/", "jobTitle": pick(profile.get("title", ""), "en")}
    app = {"@type": "WebApplication", "name": "Sun path and shadow calculator", "alternateName": "حاسبة مسار الشمس والظلال", "url": url,
           "applicationCategory": "EducationalApplication", "operatingSystem": "Any", "isAccessibleForFree": True,
           "inLanguage": ["en", "ar"], "description": intro["en"], "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
           "author": author, "featureList": ["Solar altitude and azimuth", "Shadow length and bearing", "Solar declination and equation of time",
                                             "Plan-view shadow diagram with scale"]}
    if image:
        app["image"] = image
    ld = {"@context": "https://schema.org", "@graph": [app, faq_ld(SUNPATH_FAQ), {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": site + "/"},
        {"@type": "ListItem", "position": 2, "name": "Tools", "item": site + "/tools/"},
        {"@type": "ListItem", "position": 3, "name": "Sun path and shadow calculator", "item": url}]}]}
    head = (f'<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>'
            f'<script src="{base}static/solar.js" defer></script><script src="{base}static/sunpath.js" defer></script>')
    desc = ("Free sun path and shadow calculator: solar altitude, azimuth, shadow length and direction for any place and time, with a plan diagram. "
            "| حاسبة مجانية لمسار الشمس وطول الظل واتجاهه لأي مكان ووقت.")
    kws = ["sun path calculator", "shadow length calculator", "solar altitude and azimuth", "sun position calculator", "shadow calculator for buildings",
           "how to calculate shadow length", "building orientation", "solar angle calculator", "sun path Cairo", "shading design",
           "حاسبة مسار الشمس", "حساب طول الظل", "زاوية ارتفاع الشمس", "سمت الشمس", "حساب موضع الشمس", "مسار الشمس في القاهرة",
           "توجيه المباني", "التظليل المعماري", "ظلال المباني", "حاسبة الظل"]
    write_page("tools/sun-path", layout(profile, "Sun Path & Shadow Calculator | حاسبة مسار الشمس والظلال", desc, body,
                                        base, url, head, image, "tools", kws))
    return url


def build_tools(profile):
    if "tools" not in [k for k, _ in NAV]:
        return []
    site = profile.get("site_url", "").rstrip("/")
    name_en = pick(profile["name"], "en")
    lead = {"en": "Interactive calculators for architecture and building construction students.",
            "ar": "حاسبات تفاعلية لطلاب العمارة والإنشاء المعماري."}
    mats = load_materials()
    u_url = build_uvalue_page(profile, mats)
    s_url = build_stairs_page(profile)
    p_url = build_sunpath_page(profile)
    wall = ('<span class="tool-art tool-wall" aria-hidden="true"><i style="background:#cfc8bb;flex:2"></i><i style="background:#b5583a;flex:12"></i>'
            '<i style="background:#9cc7e8;flex:5"></i><i style="background:#b5583a;flex:12"></i><i style="background:#cfc8bb;flex:2"></i></span>')
    stair = ('<span class="tool-art" aria-hidden="true"><svg viewBox="0 0 100 100"><path d="M6 94H94" class="ta-floor"/>'
             + "".join(f'<path d="M{8 + i * 10} {92 - i * 10}h10v-10"/>' for i in range(8)) + '</svg></span>')
    table = ('<span class="tool-art tool-table" aria-hidden="true">' + "".join("<i></i>" for _ in range(12)) + '</span>')
    sun = ('<span class="tool-art" aria-hidden="true"><svg viewBox="0 0 100 100"><path d="M8 74 A42 42 0 0 1 92 74"/>'
           '<circle cx="68" cy="42" r="9"/><path d="M6 80H94" class="ta-floor"/></svg></span>')
    tools = [
        ("sun-path/", sun, {"en": "Sun path and shadow calculator", "ar": "حاسبة مسار الشمس والظلال"},
         {"en": "Solar altitude, azimuth, shadow length and direction for any place and time, with a plan diagram.",
          "ar": "ارتفاع الشمس وسمتها وطول الظل واتجاهه لأي مكان ووقت، مع مخطط في المسقط."}),
        ("stairs/", stair, {"en": "Stair design calculator", "ar": "حاسبة تصميم السلالم"},
         {"en": "Number of risers, riser and tread, 2R + T check, pitch, plan length with the landing and a scaled section.",
          "ar": "عدد القوائم، والقائمة والنائمة، وفحص 2ق + ن، وزاوية الميل، وطول السلم مع البسطة، وقطاع بمقياس رسم."}),
        ("u-value/", wall, {"en": "Wall U-value and thermal insulation calculator", "ar": "حاسبة معامل U والعزل الحراري للحوائط"},
         {"en": "Build a wall layer by layer and see its thermal resistance, U-value, temperature profile and the saving from insulation.",
          "ar": "كوّن الحائط طبقة بطبقة، وشاهد مقاومته الحرارية ومعامل U وتغير الحرارة داخله والتوفير الناتج عن العزل."}),
        ("u-value/#materials", table, {"en": "Thermal properties of building materials", "ar": "الخصائص الحرارية لمواد البناء"},
         {"en": "Density, thermal conductivity and thermal resistance of the main building materials in Egypt and the Arab world.",
          "ar": "الكثافة ومعامل التوصيل الحراري والمقاومة الحرارية لأهم مواد البناء في مصر والوطن العربي."}),
    ]
    cards = "".join(f'''<a class="card tool-card" href="{h}">{art}<span><b>{bi(t)}</b><small>{bi(d)}</small>
    <span class="btn btn-sm btn-primary">{bi({"en": "Open →", "ar": "افتح ←"})}</span></span></a>''' for h, art, t, d in tools)
    # links shared before the split pointed at sections of this page; send them to the new pages
    redirect = ('<script>(function(){var m={"#stairs":"stairs/","#uvalue":"u-value/","#materials":"u-value/#materials"};'
                'var t=m[location.hash];if(t)location.replace(t);})();</script>')
    body = f'''
<main>
{page_hero("tools")}
<section class="wrap"><p class="lead">{bi(lead)}</p><div class="tool-grid">{cards}</div></section>
</main>'''
    author = {"@type": "Person", "name": name_en, "url": site + "/"}
    ld = {"@context": "https://schema.org", "@type": "ItemList", "name": "Free tools for architecture students",
          "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": u, "name": n} for i, (u, n) in enumerate(
              [(p_url, "Sun path and shadow calculator"), (s_url, "Stair design calculator"), (u_url, "Wall U-value calculator"),
               (u_url + "#materials", "Thermal properties of building materials")])], "author": author}
    head = redirect + f'<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>'
    desc = ("Free sun path, stair design and wall U-value calculators for architecture students, with a table of the thermal "
            "properties of building materials. | حاسبات مسار الشمس وتصميم السلالم والعزل الحراري ومعامل U، وجدول خصائص مواد البناء.")
    kws = ["sun path calculator", "shadow calculator", "حاسبة مسار الشمس", "stair design calculator", "staircase riser tread", "U-value calculator", "wall thermal insulation",
           "thermal conductivity of building materials", "building materials Egypt", "architecture students",
           "حاسبة تصميم السلالم", "القائمة والنائمة", "حساب معامل U", "العزل الحراري للحوائط", "معامل التوصيل الحراري",
           "خصائص مواد البناء", "مواد البناء في مصر", "طلاب العمارة"]
    write_page("tools", layout(profile, f'Free Tools for Architecture Students: Sun Path, Stair & U-value Calculators | {name_en}', desc,
                               body, "../", site + "/tools/", head, "", "tools", kws))
    return [site + "/tools/", p_url, s_url, u_url]


def write_search_index(profile, papers):
    """dist/search.json: one small entry per page, paper, video, article and tool for the Ctrl+K search box."""
    kinds = {"page": ("Page", "صفحة"), "paper": ("Paper", "بحث"), "video": ("Video", "فيديو"),
             "article": ("Article", "مقال"), "tool": ("Tool", "أداة")}
    items = []

    def add(kind, url, title, extra, sub=""):
        en, ar = pick(title, "en"), pick(title, "ar")
        items.append({"k": kind, "u": url, "en": en, "ar": ar, "sub": sub,
                      "s": normalize(" ".join([en, ar] + [x for x in extra if x]))})

    for key, path in NAV:
        add("page", path, {"en": UI[key][0], "ar": UI[key][1]}, [key])
    for p in papers:
        extra = [pick(p.get("summary", ""), "en"), pick(p.get("summary", ""), "ar"), pick(p.get("abstract", ""), "en"),
                 p.get("journal", ""), str(p.get("year", "")), p.get("doi", "")]
        add("paper", f'papers/{p["id"]}/', p["title"], extra + keywords(p, "en") + keywords(p, "ar") + p.get("authors", []),
            f'{p.get("journal", "")} {p.get("year", "")}'.strip())
    for v in VIDEOS:
        kw = v["keywords"]
        kws = (kw.get("en", []) + kw.get("ar", [])) if isinstance(kw, dict) else list(kw)
        add("video", f'https://www.youtube.com/watch?v={v["id"]}', v["title_bi"],
            [pick(v["summary"], "en"), pick(v["summary"], "ar")] + kws, v["date"])
    for a in ARTICLES:
        add("article", f'articles/{a["slug"]}/', a["title"], [a["text"][:1500]] + a["tags"], a["date"])
    if "tools" in [k for k, _ in NAV]:
        add("tool", "tools/sun-path/", {"en": "Sun path and shadow calculator", "ar": "حاسبة مسار الشمس والظلال"},
            ["sun", "solar altitude", "azimuth", "shadow length", "orientation", "shading", "شمس", "ظل", "ظلال", "ارتفاع الشمس",
             "سمت", "توجيه المباني", "التظليل"])
        add("tool", "tools/stairs/", {"en": "Stair design calculator", "ar": "حاسبة تصميم السلالم"},
            ["stairs", "staircase", "riser", "tread", "سلم", "سلالم", "درج", "قائمة", "نائمة", "بسطة"])
        add("tool", "tools/u-value/", {"en": "Wall U-value calculator", "ar": "حاسبة العزل الحراري للحائط (معامل U)"},
            ["u-value", "thermal insulation", "thermal resistance", "wall", "insulation", "عزل حراري", "معامل انتقال حراري",
             "مقاومة حرارية", "حائط", "جدار", "عزل"])
        add("tool", "tools/u-value/#materials", {"en": "Thermal properties of building materials", "ar": "جدول الخصائص الحرارية لمواد البناء"},
            ["density", "thermal conductivity", "lambda", "brick", "concrete", "كثافة", "معامل التوصيل الحراري", "طوب", "خرسانة",
             "مواد البناء", "فوم", "صوف صخري"])
    data = {"kinds": {k: {"en": en, "ar": ar} for k, (en, ar) in kinds.items()}, "items": items}
    (OUT / "search.json").write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


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
  {cite_block(p, base)}
</main>'''
    image = f'{site}/cards/{p["id"]}.png' if has_card else ""
    page = layout(profile, f'{title_en} | {pick(profile["name"], "en")}',
                  (pick(p.get("summary", ""), "en") or abstract_en)[:300], body, base, url, head, image, "publications")
    d = OUT / "papers" / p["id"]
    d.mkdir(parents=True, exist_ok=True)
    (d / "index.html").write_text(page, encoding="utf-8")
    (d / "cite.ris").write_text(ris(p), encoding="utf-8", newline="")
    (d / "cite.bib").write_text(bibtex(p) + "\n", encoding="utf-8")
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
    global VIDEOS, ARTICLES, QUIZZES
    QUIZZES = load_quizzes()
    VIDEOS = load_videos(profile)
    shown = {v["id"] for v in VIDEOS}
    (OUT / "quizzes.json").write_text(json.dumps({k: q for k, q in QUIZZES.items() if k in shown},
                                                 ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    ARTICLES = feeds.blog_articles(profile.get("blog_feed", ""))
    NAV[:] = [(k, p) for k, p in PAGES
              if not (k == "videos" and not profile.get("youtube_channel_id"))
              and not (k == "articles" and not profile.get("blog_feed"))]
    print(f"feeds: {len(VIDEOS)} videos, {len(ARTICLES)} articles")

    urls = build_pages(profile, papers, cards)
    urls += build_media_pages(profile)
    urls += [build_paper(profile, p, p["id"] in cards) for p in papers]

    urls += build_tools(profile)
    write_search_index(profile, papers)

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
