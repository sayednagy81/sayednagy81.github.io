"""Builds the published waffle slab calculator pages from the supplied originals.

Originals (unchanged, kept for standalone use): tools/waffle-src/Waffle_Slab_Calculator_AR.html and _EN.html
Output: root/tools/waffle-slab/ (copied to dist by build.py).
Changes made here, the same way in both languages:
  1. column sections: minimum side 25 cm, a width-to-length ratio, the required area and clickable section options
     (with a 30 cm wide option always offered), instead of square-only sizes with no minimum;
  2. drawing labels use Latin units (m, cm) in left-to-right text, so Arabic pages do not scramble them;
  3. the ACI 318 reference checks are shown as reference notes with their numbers, apart from real warnings;
  4. a load-combination choice: 1.4D + 1.6L (default, as in the paneled beam calculator) or the ACI combination;
  5. site integration: description, keywords, canonical, hreflang, icon and a link back to the site.
Run: python tools/make_waffle_pages.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "tools" / "waffle-src"
OUT = ROOT / "root" / "tools" / "waffle-slab"
SITE = "https://sayednagy81.github.io"
FILE = {"ar": "Waffle_Slab_Calculator_AR.html", "en": "Waffle_Slab_Calculator_EN.html"}
URL = {k: f"{SITE}/tools/waffle-slab/{v}" for k, v in FILE.items()}

TXT = {
    "en": {
        "title": "Waffle Slab Calculator: Mould Layout, Concrete Quantities and Sections | Dr. Sayed Marey Nagy",
        "desc": "Free waffle slab calculator for architecture students: mould layout, concrete quantities, plan and sections, preliminary loads and column section options.",
        "kw": "waffle slab, waffle slab calculator, waffle mould, ribbed slab, two-way joist, concrete quantity takeoff, slab section, column sizing, architecture students",
        "home": "Home", "tools": "Tools", "name": "Dr. Sayed Marey Nagy", "locale": "en_US",
        "combo": "Load combination", "comboEcp": "1.4D + 1.6L (common in Egyptian practice)", "comboAci": "ACI 318: greater of 1.4D and 1.2D + 1.6L",
        "colRatio": "Column side ratio (width : length)", "colOptions": "Column section options",
        "optNote": "Every option has at least the required area, with sides in multiples of 5 cm and at least 25 cm. ★ marks the option closest to the chosen ratio; a 30 cm wide option is always offered. Click an option to use it.",
        "oldColumnScope": "Square-column estimates use tributary area under a uniform average load and round up to 5 cm. Structural analysis is required for actual loading, moments, slenderness, code dimensions and reinforcement.",
        "columnScope": "Column sections use tributary area under a uniform average load: required area = factored axial load ÷ assumed stress. Both sides are multiples of 5 cm and at least 25 cm. Structural analysis is required for actual loading, moments, slenderness, punching shear, code dimensions and reinforcement.",
        "oldScope": "Factored gravity load is the greater of 1.4D and 1.2D + 1.6L.",
        "scope": "Factored gravity load uses the selected combination: 1.4D + 1.6L (common in Egyptian practice) or the ACI 318 greater of 1.4D and 1.2D + 1.6L.",
        "T": {
            "cm2": "cm²", "reqArea": "Required area", "wallOpt": "width 30 cm (fits a 30 cm wall)",
            "refHead": "Reference notes (ACI 318-19 §9.8; not errors in your inputs):",
            "codeRib": "Bottom rib width is below the 10.16 cm minimum for joist construction.",
            "codeDepth": "Overall depth {H} cm is more than 3.5 × the bottom rib width ({L} cm); a wider rib or a shallower mould keeps within this joist limit.",
            "codeClear": "Moulds wider than 76.2 cm are beyond the clear-spacing limit for ACI joist construction, so the slab is treated as a two-way ribbed (waffle) slab without the joist allowances. This is normal for 90 cm and larger moulds.",
            "codeTop": "Topping is thinner than the calculated reference minimum.",
        },
    },
    "ar": {
        "title": "حاسبة البلاطة الوافل Waffle Slab: توزيع القوالب وحصر الخرسانة والقطاعات | د. سيد مرعي",
        "desc": "حاسبة مجانية للبلاطة الوافل لطلاب العمارة: توزيع القوالب وحصر الخرسانة وعرض المسقط والقطاعات، مع تقدير أولي للأحمال واختيارات قطاع العمود.",
        "kw": "بلاطة وافل, Waffle Slab, قوالب الوافل, بلاطة معصبة في اتجاهين, حصر الخرسانة, قطاع البلاطة, قطاع العمود, طلاب العمارة, إنشاء معماري",
        "home": "الرئيسية", "tools": "الأدوات", "name": "د. سيد مرعي", "locale": "ar_AR",
        "combo": "توليفة الأحمال", "comboEcp": "1.4D + 1.6L (الشائعة في التصميم بمصر)", "comboAci": "ACI 318: الأكبر من 1.4D و1.2D + 1.6L",
        "colRatio": "نسبة ضلعي العمود (العرض : الطول)", "colOptions": "اختيارات قطاع العمود",
        "optNote": "كل اختيار مساحته لا تقل عن المطلوبة، وضلعاه من مضاعفات 5 سم ولا يقلان عن 25 سم. العلامة ★ على الاختيار الأقرب للنسبة المختارة، ويظهر دائمًا اختيار بعرض 30 سم. اضغط أي اختيار لاستخدامه.",
        "oldColumnScope": "التقدير للأعمدة المربعة بطريقة مساحة التأثير تحت حمل موزّع متوسط، مع التقريب للأعلى إلى 5 سم. يلزم تحليل إنشائي للتحقق من الأحمال الفعلية والعزوم والنحافة ومتطلبات الكود والتسليح.",
        "columnScope": "تُقدَّر قطاعات الأعمدة بطريقة مساحة التأثير تحت حمل موزّع متوسط: المساحة المطلوبة = الحمل المحوري المضاعف ÷ الإجهاد الافتراضي. ضلعا العمود من مضاعفات 5 سم ولا يقلان عن 25 سم. يلزم تحليل إنشائي للتحقق من الأحمال الفعلية والعزوم والنحافة والقص الثاقب ومتطلبات الكود والتسليح.",
        "oldScope": "الحمل الرأسي المضاعف هو الأكبر من 1.4D و1.2D + 1.6L.",
        "scope": "الحمل الرأسي المضاعف حسب التوليفة المختارة: 1.4D + 1.6L (الشائعة في التصميم بمصر) أو الأكبر من 1.4D و1.2D + 1.6L وفق ACI 318.",
        "T": {
            "cm2": "سم²", "reqArea": "المساحة المطلوبة", "wallOpt": "بعرض 30 سم (يناسب حائط 30 سم)",
            "refHead": "ملاحظات مرجعية (ACI 318-19 §9.8، وليست أخطاء في المدخلات):",
            "codeRib": "عرض العصب السفلي أقل من الحد الأدنى 10.16 سم للبلاطات المعصّبة.",
            "codeDepth": "العمق الكلي {H} سم أكبر من 3.5 × عرض العصب السفلي ({L} سم)؛ عصب أعرض أو قالب أقل عمقًا يحقق هذا الحد.",
            "codeClear": "القوالب الأعرض من 76.2 سم تتجاوز حد التباعد الصافي للبلاطات المعصّبة في ACI، فتُعامَل البلاطة كبلاطة وافل معصّبة في اتجاهين دون تسهيلات البلاطات المعصّبة. وهذا طبيعي مع قوالب 90 سم وأكبر.",
            "codeTop": "الطبقة العلوية أقل من السمك المرجعي المحسوب.",
        },
    },
}

ENGINE = r"""
// Column sections: b, h multiples of 5 cm, at least 25 cm, h/b up to 3, area not more than 30 % above the smallest,
// plus one 30 cm wide section in every case. Sorted from square to elongated.
function sectionOptions(req) {
  const out=[];
  const bMax=Math.max(25,Math.ceil(Math.sqrt(Math.max(req,0))/5-1e-7)*5)+10;
  for(let b=25;b<=bMax;b+=5){
    const h=Math.max(b,Math.ceil(req/b/5-1e-7)*5);
    if(h/b>3+EPS) continue;
    out.push({b,h,area:b*h,ratio:h/b});
  }
  const minA=Math.min(...out.map(c=>c.area));
  const opts=out.filter(c=>c.area<=minA*1.3+EPS);
  if(!opts.some(c=>c.b===30||c.h===30)){const h=Math.max(30,Math.ceil(req/30/5-1e-7)*5);opts.push({b:30,h,area:30*h,ratio:h/30,wall:true});}
  const seen=new Set();
  return opts.sort((p,q)=>p.ratio-q.ratio||p.area-q.area).filter(c=>{const k=c.ratio.toFixed(3);if(seen.has(k)&&!c.wall)return false;seen.add(k);return true;});
}
function recommendSection(options,ratio){return options.slice().sort((p,q)=>Math.abs(p.ratio-ratio)-Math.abs(q.ratio-ratio)||p.area-q.area)[0];}
function renderColumnOptions(v){
  const box=$('colOptions');box.replaceChildren();
  for(const g of v.groups){
    const wrap=document.createElement('div');wrap.className='colgroup';
    const p=document.createElement('p');p.textContent=T[g.key]+' ('+g.number+') — '+T.reqArea+': '+fmt(g.req,0)+' '+T.cm2;
    const chips=document.createElement('div');chips.className='chips';chips.setAttribute('role','group');chips.setAttribute('aria-label',T[g.key]);
    for(const o of g.options){
      const b=document.createElement('button');b.type='button';b.className='chip';b.dataset.group=g.key;b.dataset.sec=o.b+'x'+o.h;
      b.setAttribute('aria-pressed',String(o===g.chosen));
      const s=document.createElement('strong');s.dir='ltr';s.textContent=o.b+' × '+o.h+(o===g.rec?' ★':'');
      const sm=document.createElement('small');sm.dir='ltr';sm.textContent=fmt(o.area,0)+' '+T.cm2+' · 1 : '+fmt(o.ratio);
      b.append(s,sm);
      if(o.wall){const w=document.createElement('small');w.textContent=T.wallOpt;b.append(w);}
      chips.append(b);
    }
    wrap.append(p,chips);box.append(wrap);
  }
}
"""

CSS = """
.site-strip{background:#0b2536;color:#cfe3ec;font-size:.85rem}.site-strip .wrap{display:flex;gap:1rem;justify-content:space-between;padding-top:.45rem;padding-bottom:.45rem}.site-strip a{color:#fff}
.chips{display:flex;flex-wrap:wrap;gap:.45rem}.chip{display:flex;flex-direction:column;align-items:center;min-width:92px;padding:.35rem .6rem}.chip small{font-size:.74rem;opacity:.85}.colgroup{margin-top:.7rem}.colgroup p{margin:0 0 .35rem}#refs{background:#eef5f7;padding:.55rem .8rem;border-radius:.5rem}
"""


def R(s, a, b, n=1):
    assert s.count(a) == n, (s.count(a), a[:90])
    return s.replace(a, b)


def build(lang):
    t, other = TXT[lang], "en" if lang == "ar" else "ar"
    s = (SRC / FILE[lang]).read_text(encoding="utf-8")
    # 5. head and site link
    ld = {"@context": "https://schema.org", "@type": "WebApplication", "name": t["title"].split(" | ")[0], "url": URL[lang],
          "applicationCategory": "EducationalApplication", "operatingSystem": "Any", "inLanguage": lang, "isAccessibleForFree": True,
          "description": t["desc"], "author": {"@type": "Person", "name": "Sayed Marey Nagy", "url": SITE + "/"}}
    head = (f'<title>{t["title"]}</title>\n<meta name="description" content="{t["desc"]}">\n<meta name="keywords" content="{t["kw"]}">\n'
            f'<meta name="author" content="Dr. Sayed Marey Nagy">\n<link rel="canonical" href="{URL[lang]}">\n'
            f'<link rel="alternate" hreflang="{lang}" href="{URL[lang]}">\n<link rel="alternate" hreflang="{other}" href="{URL[other]}">\n'
            f'<meta property="og:type" content="website">\n<meta property="og:title" content="{t["title"].split(" | ")[0]}">\n'
            f'<meta property="og:description" content="{t["desc"]}">\n<meta property="og:url" content="{URL[lang]}">\n<meta property="og:locale" content="{t["locale"]}">\n'
            f'<link rel="icon" href="../../static/favicon.svg" type="image/svg+xml">\n'
            f'<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>')
    a = s.index("<title>"); b = s.index("</title>") + len("</title>")
    s = s[:a] + head + s[b:]
    s = R(s, "</style>", CSS + "</style>")
    s = R(s, "<body>\n<header>", f'<body>\n<nav class="site-strip hide-print" aria-label="{t["name"]}"><div class="wrap"><span><a href="../../">{t["name"]}</a> / <a href="../">{t["tools"]}</a></span><a href="../../">{t["home"]}</a></div></nav>\n<header>')
    # 4. load combination; 1. column ratio
    s = R(s, '<input id="live" type="number" min="0" step="any" value="2"></label></div>',
          f'<input id="live" type="number" min="0" step="any" value="2"></label></div>\n    <label class="space">{t["combo"]}<select id="combo"><option value="1">{t["comboEcp"]}</option><option value="2">{t["comboAci"]}</option></select></label>')
    s = R(s, '<input id="stress" type="number" min="0.1" step="any" value="5"></label>',
          f'<input id="stress" type="number" min="0.1" step="any" value="5"></label>\n    <label class="space">{t["colRatio"]}<select id="colRatio"><option value="1">1 : 1</option><option value="1.25">1 : 1.25</option><option value="1.5">1 : 1.5</option><option value="2">1 : 2</option><option value="2.5">1 : 2.5</option><option value="3">1 : 3</option></select></label>')
    s = R(s, '<tbody id="supportTable"></tbody></table></div></div>',
          f'<tbody id="supportTable"></tbody></table></div></div><h3 class="space">{t["colOptions"]}</h3><div id="colOptions"></div><p class="hint space">{t["optNote"]}</p>')
    s = R(s, t["oldColumnScope"], t["columnScope"], 2)
    s = R(s, t["oldScope"], t["scope"], 2)
    s = R(s, '<p id="notice" role="status" hidden></p>', '<p id="notice" role="status" hidden></p><p id="refs" class="hint" hidden></p>')
    # extra texts
    s = R(s, "\nconst PRESETS", "\nObject.assign(T, " + json.dumps(t["T"], ensure_ascii=False) + ");\nconst PRESETS")
    # engine
    s = R(s, "'baysX','baysY','pad','storeys','stress'];", "'baysX','baysY','pad','storeys','stress','combo','colRatio'];")
    s = R(s, "let current = null;\n", "let current = null;\nlet colChoice = {};\n")
    s = R(s, "function solve(raw) {", ENGINE + "\nfunction solve(raw, choice) {")
    s = R(s, "  const ultimate=Math.max(1.4*D,1.2*D+1.6*raw.live);",
          "  const ultimate=raw.combo===2?Math.max(1.4*D,1.2*D+1.6*raw.live):1.4*D+1.6*raw.live;")
    s = R(s, """    const side=Math.ceil((Math.sqrt(demand/(1000*raw.stress))*100-EPS)/5)*5;
    groups.push({key,number,trib,demand,side});""",
          """    const req=demand*10/raw.stress; // cm2: kN / MPa
    const options=sectionOptions(req), rec=recommendSection(options,raw.colRatio);
    const chosen=options.find(o=>o.b+'x'+o.h===(choice||{})[key])||rec;
    groups.push({key,number,trib,demand,req,options,rec,chosen,side:chosen.b});""")
    s = R(s, "units(g.demand,T.kn),pairs(g.side,g.side)+' '+lengthCm])",
          "units(g.demand,T.kn),units(g.req,T.cm2,0),pairs(g.chosen.b,g.chosen.h,0)+' '+lengthCm])")
    s = R(s, "renderRows('supportHead',[[T.support,T.number,T.trib,T.axial,T.columnSize]]);",
          "renderRows('supportHead',[[T.support,T.number,T.trib,T.axial,T.reqArea,T.columnSize]]);")
    s = R(s, "[T.support,T.number,T.trib,T.axial,T.columnSize],...r.groups", "[T.support,T.number,T.trib,T.axial,T.reqArea,T.columnSize],...r.groups")
    s = R(s, "renderRows('supportTable',rows.groups);", "renderRows('supportTable',rows.groups);\n  renderColumnOptions(v);")
    s = R(s, "current=solve(readInputs());", "current=solve(readInputs(),colChoice);")
    # 3. reference notes apart from warnings
    s = R(s, """  if(v.raw.rib+EPS<10.16) notes.push(T.codeRib);
  if((v.h+v.t)>3.5*v.r+EPS) notes.push(T.codeDepth);
  if(Math.max(v.raw.baseX,v.raw.baseY)>76.2+EPS) notes.push(T.codeClear);
  if(v.raw.topping+EPS<v.toppingMin) notes.push(T.codeTop);
  notes.push(T.punch);
  $('notice').textContent=notes.join(' ');
  $('notice').hidden=false;""", """  const refs=[];
  if(v.raw.rib+EPS<10.16) refs.push(T.codeRib);
  if((v.h+v.t)>3.5*v.r+EPS) refs.push(T.codeDepth.replace('{H}',fmt((v.h+v.t)*100,1)).replace('{L}',fmt(3.5*v.r*100,1)));
  if(Math.max(v.raw.baseX,v.raw.baseY)>76.2+EPS) refs.push(T.codeClear);
  if(v.raw.topping+EPS<v.toppingMin) refs.push(T.codeTop);
  notes.push(T.punch);
  $('notice').textContent=notes.join(' ');
  $('notice').hidden=false;
  $('refs').textContent=refs.length?T.refHead+' '+refs.join(' '):'';
  $('refs').hidden=!refs.length;""")
    s = R(s, "  $('notice').hidden=true;\n  if(!current) return;", "  $('notice').hidden=true;\n  $('refs').hidden=true;\n  if(!current) return;")
    # 2. drawing labels in Latin units, left to right
    s = R(s, "plan+=label(210,278,'X = '+units(L,T.m)) + label(210,294,'Y = '+units(W,T.m));",
          "plan+=label(210,278,'X = '+fmt(L)+' m','direction=\"ltr\"') + label(210,294,'Y = '+fmt(W)+' m','direction=\"ltr\"');")
    s = R(s, "section+=label(210,32,cut+'–'+cut+' · '+units(clear,T.m));", "section+=label(210,32,cut+'–'+cut+' · '+fmt(clear)+' m','direction=\"ltr\"');")
    s = R(s, "section+=label(210,226,'H = '+units((h+t)*100,T.cm)+'   ·   h = '+units(h*100,T.cm)+'   ·   t = '+units(t*100,T.cm));",
          "section+=label(210,226,'H = '+fmt((h+t)*100)+' cm   ·   h = '+fmt(h*100)+' cm   ·   t = '+fmt(t*100)+' cm','direction=\"ltr\"');")
    s = R(s, "section+=label(210,247,'b₀ = '+units(v.r*100,T.cm)+'   →   b₁ = '+units(v.heel*100,T.cm)+'   ·   θ = '+v.raw.angle+'°');",
          "section+=label(210,247,'b₀ = '+fmt(v.r*100)+' cm   →   b₁ = '+fmt(v.heel*100)+' cm   ·   θ = '+v.raw.angle+'°','direction=\"ltr\"');")
    # events
    s = R(s, "    if(e.target.id==='live') $('use').value='custom';", "    if(e.target.id==='live') $('use').value='custom';\n    if(e.target.id==='colRatio') colChoice={};")
    s = R(s, "$('reset').addEventListener('click',()=>{$('form').reset();", "$('reset').addEventListener('click',()=>{colChoice={};$('form').reset();")
    s = R(s, "  $('csv').addEventListener('click',csvExport);",
          "  $('colOptions').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;colChoice={...colChoice,[b.dataset.group]:b.dataset.sec};update();});\n  $('csv').addEventListener('click',csvExport);")
    (OUT / FILE[lang]).write_text(s, encoding="utf-8", newline="\n")


OUT.mkdir(parents=True, exist_ok=True)
for lang in ("ar", "en"):
    build(lang)
(OUT / "index.html").write_text("""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Waffle Slab Calculator | حاسبة البلاطة الوافل</title>
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="https://sayednagy81.github.io/tools/waffle-slab/Waffle_Slab_Calculator_EN.html">
<script>try{var l=localStorage.getItem("lang");location.replace(l==="ar"?"Waffle_Slab_Calculator_AR.html":"Waffle_Slab_Calculator_EN.html");}catch(e){location.replace("Waffle_Slab_Calculator_EN.html");}</script>
</head><body>
<p><a href="Waffle_Slab_Calculator_AR.html" lang="ar">حاسبة البلاطة الوافل (العربية)</a> · <a href="Waffle_Slab_Calculator_EN.html">Waffle Slab Calculator (English)</a></p>
</body></html>
""", encoding="utf-8", newline="\n")
print("written", [p.name for p in OUT.iterdir()])
