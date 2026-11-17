"""Writes the Arabic and English calculator pages from one template, so they stay identical apart from text."""
import json
from pathlib import Path

OUT = Path(r"C:\academic-site\root\tools\paneled-beam")
SITE = "https://sayednagy81.github.io"
URL = {"ar": f"{SITE}/tools/paneled-beam/Paneled_Beam_Calculator_AR.html", "en": f"{SITE}/tools/paneled-beam/Paneled_Beam_Calculator_EN.html"}
FILE = {"ar": "Paneled_Beam_Calculator_AR.html", "en": "Paneled_Beam_Calculator_EN.html"}

TXT = {
    "en": {
        "title": "Paneled Beam Calculator: Crossed Beam Slab and Perimeter Columns | Dr. Sayed Marey Nagy",
        "h1": "Paneled beam calculator",
        "lead": "Preliminary sizing of a paneled-beam (crossed-beam) slab for a hall supported on perimeter columns: beam grid, slab and beam depths, loads for public buildings, column sections, a structural plan and two movable sections. For architectural education only, not a substitute for structural design.",
        "desc": "Free educational paneled beam (crossed beam) slab calculator for architecture students: beam grid, slab thickness, beam depths, loads, perimeter column sections, plan and sections A–A and B–B.",
        "kw": "paneled beam, crossed beam slab, grid slab, waffle beam, beam grid calculator, column sizing, architecture students, preliminary structural sizing, slab thickness, beam depth",
        "other": "العربية", "home": "Home", "tools": "Tools", "courses": "Courses",
        "noscript": "This calculator needs JavaScript.", "rights": "All rights reserved.", "name": "Dr. Sayed Marey Nagy",
        "locale": "en_US", "alt": "ar_AR",
    },
    "ar": {
        "title": "حاسبة البلاطات ذات الكمرات المتقاطعة Paneled Beam والأعمدة المحيطية | د. سيد مرعي",
        "h1": "حاسبة البلاطة ذات الكمرات المتقاطعة (Paneled Beam)",
        "lead": "تقدير مبدئي لبلاطة ذات كمرات متقاطعة في قاعة محمولة على أعمدة محيطية: شبكة الكمرات، وسمك البلاطة وأعماق الكمرات، وأحمال المباني العامة، وقطاعات الأعمدة، ومسقط إنشائي وقطاعان يمكن تحريكهما. للتعليم المعماري فقط، ولا تغني عن التصميم الإنشائي.",
        "desc": "حاسبة تعليمية مجانية لبلاطات الكمرات المتقاطعة Paneled Beam لطلاب العمارة: شبكة الكمرات وسمك البلاطة وأعماق الكمرات والأحمال وقطاعات الأعمدة المحيطية والمسقط والقطاعين A–A وB–B.",
        "kw": "بلاطة كمرات متقاطعة, Paneled Beam, بلاطات القاعات, شبكة الكمرات, حساب قطاع العمود, سمك البلاطة, عمق الكمرة, طلاب العمارة, إنشاء معماري, تصميم مبدئي",
        "other": "English", "home": "الرئيسية", "tools": "الأدوات", "courses": "المقررات",
        "noscript": "تحتاج هذه الحاسبة إلى تفعيل JavaScript.", "rights": "جميع الحقوق محفوظة.", "name": "د. سيد مرعي",
        "locale": "ar_AR", "alt": "en_US",
    },
}


def page(lang):
    t, other = TXT[lang], "en" if lang == "ar" else "ar"
    ld = {"@context": "https://schema.org", "@type": "WebApplication", "name": t["h1"], "url": URL[lang],
          "applicationCategory": "EducationalApplication", "operatingSystem": "Any", "inLanguage": lang,
          "isAccessibleForFree": True, "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
          "description": t["desc"], "author": {"@type": "Person", "name": "Sayed Marey Nagy", "url": SITE + "/"}}
    return f"""<!doctype html>
<html lang="{lang}" dir="{'rtl' if lang == 'ar' else 'ltr'}" data-lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{t['title']}</title>
<meta name="description" content="{t['desc']}">
<meta name="keywords" content="{t['kw']}">
<meta name="author" content="Dr. Sayed Marey Nagy">
<link rel="canonical" href="{URL[lang]}">
<link rel="alternate" hreflang="{lang}" href="{URL[lang]}">
<link rel="alternate" hreflang="{other}" href="{URL[other]}">
<meta property="og:type" content="website">
<meta property="og:title" content="{t['h1']}">
<meta property="og:description" content="{t['desc']}">
<meta property="og:url" content="{URL[lang]}">
<meta property="og:locale" content="{t['locale']}"><meta property="og:locale:alternate" content="{t['alt']}">
<link rel="icon" href="../../static/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600&family=Noto+Naskh+Arabic:wght@600;700&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&display=swap">
<link rel="stylesheet" href="../../static/style.css">
<link rel="stylesheet" href="pb.css">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head>
<body>
<header class="site-header"><div class="wrap bar">
  <a class="brand" href="../../">{t['name']}</a>
  <nav><a href="../../">{t['home']}</a><a href="../../courses/">{t['courses']}</a><a href="../" aria-current="page">{t['tools']}</a></nav>
  <a class="btn btn-sm" href="{FILE[other]}" hreflang="{other}" lang="{other}">{t['other']}</a>
</div></header>
<section class="pb-hero"><div class="wrap">
  <div class="pb-crumbs"><a href="../../">{t['home']}</a> / <a href="../">{t['tools']}</a></div>
  <h1>{t['h1']}</h1>
  <p>{t['lead']}</p>
  <a class="pb-lang" href="{FILE[other]}" hreflang="{other}" lang="{other}">{t['other']}</a>
</div></section>
<main id="pb-app" class="wrap">
<noscript><p class="pb-note pb-warn">{t['noscript']}</p></noscript>
</main>
<footer class="site-footer"><div class="wrap">© 2026 {t['name']} · {t['rights']}</div></footer>
<script src="pb.js"></script>
</body>
</html>
"""


for lang in ("ar", "en"):
    (OUT / FILE[lang]).write_text(page(lang), encoding="utf-8", newline="\n")

index = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Paneled Beam Calculator | حاسبة الكمرات المتقاطعة</title>
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="https://sayednagy81.github.io/tools/paneled-beam/Paneled_Beam_Calculator_EN.html">
<script>try{var l=localStorage.getItem("lang");location.replace(l==="ar"?"Paneled_Beam_Calculator_AR.html":"Paneled_Beam_Calculator_EN.html");}catch(e){location.replace("Paneled_Beam_Calculator_EN.html");}</script>
</head><body>
<p><a href="Paneled_Beam_Calculator_AR.html" lang="ar">حاسبة الكمرات المتقاطعة (العربية)</a> · <a href="Paneled_Beam_Calculator_EN.html">Paneled beam calculator (English)</a></p>
</body></html>
"""
(OUT / "index.html").write_text(index, encoding="utf-8", newline="\n")
print("written")
