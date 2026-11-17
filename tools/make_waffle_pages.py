"""Builds the published waffle slab calculator pages from the supplied originals.

Originals (unchanged, kept for standalone use): tools/waffle-src/Waffle_Slab_Calculator_AR.html and _EN.html
Output: root/tools/waffle-slab/ (copied to dist by build.py).
Changes made here, the same way in both languages:
  1. column sections: minimum side 25 cm, a width-to-length ratio, the required area and clickable section options
     (with a 30 cm wide option always offered), instead of square-only sizes with no minimum;
  2. drawing labels use Latin units (m, cm) in left-to-right text, so Arabic pages do not scramble them;
  3. the ACI 318 reference checks are shown as reference notes with their numbers, apart from real warnings;
  4. a load-combination choice: 1.4D + 1.6L (default, as in the paneled beam calculator) or the ACI combination;
  5. site integration: description, keywords, canonical, hreflang, icon and a link back to the site;
  6. perimeter columns only, with the paneled beam calculator's column rules, a movable section line and
     drawings that scroll instead of shrinking on phones;
  7. loads built in and hidden (architectural tool), column stress from the Egyptian short-column form (11.16 N/mm2).
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
        "columnScope": "Column sections use tributary area under a uniform average load: required area = factored axial load ÷ σ (0.35 fcu + 0.67 fy ρ). Both sides are multiples of 5 cm and at least 25 cm. Structural analysis is required for actual loading, moments, slenderness, punching shear, code dimensions and reinforcement.",
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
        "columnScope": "تُقدَّر قطاعات الأعمدة بطريقة مساحة التأثير تحت حمل موزّع متوسط: المساحة المطلوبة = الحمل المحوري المضاعف ÷ σ (0.35 fcu + 0.67 fy ρ). ضلعا العمود من مضاعفات 5 سم ولا يقلان عن 25 سم. يلزم تحليل إنشائي للتحقق من الأحمال الفعلية والعزوم والنحافة والقص الثاقب ومتطلبات الكود والتسليح.",
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
    s = extend(s, lang)
    (OUT / FILE[lang]).write_text(s, encoding="utf-8", newline="\n")


# ---------------------------------------------------------------------------------------------
# 6. Same column rules as the paneled beam calculator: perimeter columns only (no columns inside
#    the hall), 4 corner columns plus extra columns on the perimeter, tributary area shared along the
#    perimeter, hall area 60-180 m2 note. Also a movable section line and readable drawings on phones.
# ---------------------------------------------------------------------------------------------
EXT = {
    "en": {
        "legend": "Perimeter columns", "colCount": "Perimeter columns (4–24)", "dist": "Extra columns go",
        "dists": ["Balanced around the perimeter", "On the long sides first", "On the short sides first"],
        "oldSupport": "Solid zones are centred on the support grid. Any mould intersecting a zone is omitted in full. Enter zero to disable zones.",
        "support": "Columns stand on the perimeter only: four corner columns plus any extra columns, never inside the hall. A solid zone is centred on each column; any mould that intersects a zone is omitted in full. Enter zero to disable zones.",
        "cutLabel": "Section line position (you can also drag it on the plan)", "center": "Centre on a mould row",
        "colTitle": "Preliminary column sizes",
        "builtIn": "This is an architectural sizing aid, so the loads are built in and not shown, as in the paneled beam calculator: slab self-weight, finishes 1.5 kN/m², live load 2 kN/m², factored 1.4D + 1.6L. Column loads are increased by 25 % for edge columns and 50 % for corner columns to allow for bending, and column capacity uses the short tied-column form of the Egyptian code, σ = 0.35 fcu + 0.67 fy ρ = 11.16 N/mm² (fcu 25, fy 360, ρ 1 %).",
        "T": {"supports": "Perimeter columns", "spans": "Column spacing X × Y",
              "planHelp": "Columns stand on the perimeter only, drawn at their chosen size; dashed outlines mark their solid zones. Drag the section line or use the slider under the section; a cut through a rib shows solid concrete.",
              "hallArea": "The slab area is outside the 60–180 m² range used for one slab in the paneled beam calculator."},
    },
    "ar": {
        "legend": "الأعمدة المحيطية", "colCount": "عدد الأعمدة المحيطية (4–24)", "dist": "توزيع الأعمدة الإضافية",
        "dists": ["متوازن على محيط القاعة", "على الضلعين الطويلين أولًا", "على الضلعين القصيرين أولًا"],
        "oldSupport": "المناطق المصمتة متمركزة حول نقاط الأعمدة. يُستبعد القالب بالكامل عند تداخله معها. القيمة صفر تلغي هذه المناطق.",
        "support": "الأعمدة على المحيط فقط: أربعة أعمدة ركنية ومعها ما يُضاف من أعمدة، ولا أعمدة داخل القاعة. حول كل عمود منطقة مصمتة، ويُستبعد القالب بالكامل عند تداخله معها. القيمة صفر تلغي هذه المناطق.",
        "cutLabel": "موضع خط القطاع (ويمكن سحبه على المسقط)", "center": "توسيط على صف القوالب",
        "colTitle": "التقدير الأولي لقطاعات الأعمدة",
        "builtIn": "هذه أداة للتصميم المعماري، لذلك الأحمال ثابتة داخليًا ولا تظهر، كما في حاسبة الكمرات المتقاطعة: الوزن الذاتي للبلاطة، وتشطيبات 1.5 كيلونيوتن/م²، وحمل حي 2 كيلونيوتن/م²، والحمل المضاعف 1.4D + 1.6L. وتُزاد أحمال الأعمدة الطرفية 25% والركنية 50% لتمثيل أثر العزوم، وقدرة العمود بصيغة الأعمدة القصيرة ذات الكانات في الكود المصري: σ = 0.35 fcu + 0.67 fy ρ = 11.16 نيوتن/مم² (fcu 25، fy 360، ρ 1%).",
        "T": {"supports": "الأعمدة المحيطية", "spans": "التباعد بين الأعمدة X × Y",
              "planHelp": "الأعمدة على المحيط فقط ومرسومة بمقاسها المختار، والخطوط المتقطعة حدود مناطقها المصمتة. اسحب خط القطاع أو استخدم المؤشر أسفل القطاع؛ القطع داخل عصب يظهر خرسانة مصمتة.",
              "hallArea": "مساحة البلاطة خارج المدى 60–180 م² المعتمد للبلاطة الواحدة في حاسبة الكمرات المتقاطعة."},
    },
}

COLUMNS_JS = r"""
// Perimeter columns as in the paneled beam calculator: four corners plus extra columns on the sides.
// dist: 0 balanced, 1 long sides first, 2 short sides first. Tributary area: half the distance to each
// neighbouring column along the perimeter (a teaching approximation, not beam reactions).
function columnLayout(L,W,count,dist){
  count=Math.max(4,Math.min(24,Math.round(count)));
  const len=[L,W,L,W],k=[0,0,0,0],longX=L>=W;
  const pref=j=>{const isX=j%2===0;if(dist===1)return isX===longX?1000:1;if(dist===2)return isX!==longX?1000:1;return 1;};
  for(let e=count-4;e>0;e--){let best=-1,bs=-Infinity;for(let j=0;j<4;j++){let sc=len[j]/(k[j]+1)*pref(j);if(len[j]/(k[j]+2)<2-EPS)sc/=1e6;if(sc>bs+1e-9){bs=sc;best=j;}}k[best]++;}
  let pts=[{x:0,y:0},{x:L,y:0},{x:L,y:W},{x:0,y:W}];
  for(let j=0;j<4;j++)for(let i=1;i<=k[j];i++){const t=i/(k[j]+1);pts.push(j===0?{x:t*L,y:0}:j===1?{x:L,y:t*W}:j===2?{x:(1-t)*L,y:W}:{x:0,y:(1-t)*W});}
  const per=2*(L+W),u=p=>p.y===0?p.x:p.x===L?L+p.y:p.y===W?L+W+(L-p.x):2*L+W+(W-p.y);
  pts=pts.map(p=>({...p,u:u(p)})).sort((a,b)=>a.u-b.u);
  return pts.map((p,i)=>{const prev=pts[(i+pts.length-1)%pts.length].u,next=pts[(i+1)%pts.length].u;
    const zone=(((p.u-prev+per)%per)+((next-p.u+per)%per))/2,corner=(p.x===0||p.x===L)&&(p.y===0||p.y===W);
    return {id:i+1,x:p.x,y:p.y,corner,side:corner?'corner':(p.y===0||p.y===W)?'X':'Y',At:L*W*zone/per};});
}
"""

EXT_CSS = """
.cutctl{display:flex;flex-wrap:wrap;align-items:end;gap:.5rem;padding:0 .65rem .55rem}.cutctl label{flex:1 1 200px;font-weight:normal;font-size:.85rem}.cutctl input{padding:0}
#plan{touch-action:none}
@media(max-width:690px){.drawing svg{min-width:520px}.drawing .svgscroll{overflow-x:auto;direction:ltr}}
"""


def extend(s, lang):
    e = EXT[lang]
    # unused canvas rules from the original stylesheet
    for rule in (".drawing canvas{display:block;width:100%;height:285px}", ".drawing canvas{height:255px}", ".drawing canvas{height:240px}"):
        s = R(s, rule, "")
    s = R(s, "</style>", EXT_CSS + "</style>")
    # inputs: perimeter column count and distribution instead of bays
    s = R(s, f"<legend>{'Column grid' if lang == 'en' else 'شبكة الأعمدة'}</legend>", f"<legend>{e['legend']}</legend>")
    a = s.index('<label>', s.index(f"<legend>{e['legend']}</legend>")); b = s.index('</label>', s.index('id="baysY"')) + len('</label>')
    s = s[:a] + (f'<label>{e["colCount"]}<input id="colCount" type="number" min="4" max="24" step="1" value="4"></label>'
                 f'<label>{e["dist"]}<select id="dist">' + "".join(f'<option value="{i}">{t}</option>' for i, t in enumerate(e["dists"])) + '</select></label>') + s[b:]
    s = R(s, e["oldSupport"], e["support"], 2)
    s = R(s, "\nconst PRESETS", "\nObject.assign(T, " + json.dumps(e["T"], ensure_ascii=False) + ");\nconst PRESETS")
    s = R(s, "'baysX','baysY','pad','storeys','stress','combo','colRatio'];", "'colCount','dist','pad','storeys','stress','combo','colRatio'];")
    # engine: perimeter columns and per-mould exclusion around each column
    s = R(s, "function sectionOptions(req) {", COLUMNS_JS + "function sectionOptions(req) {")
    s = R(s, "const x=layoutAxis(L,a,r,edge,raw.baysX,pad), y=layoutAxis(W,b,r,edge,raw.baysY,pad);",
          "const x=layoutAxis(L,a,r,edge,1,0), y=layoutAxis(W,b,r,edge,1,0);\n  x.openings.forEach((o,i)=>{o.i=i;});y.openings.forEach((o,i)=>{o.i=i;});")
    s = R(s, """  const xReserved=x.openings.filter(o=>o.nearSupport).length;
  const yReserved=y.openings.filter(o=>o.nearSupport).length;
  const removed=xReserved*yReserved;""", """  // perimeter columns only (no columns inside the hall), as in the paneled beam calculator
  const cols=columnLayout(L,W,raw.colCount,raw.dist);
  const skip=new Set();
  if(pad>0) for(const c of cols) {
    const zx0=c.x-pad/2, zx1=c.x+pad/2, zy0=c.y-pad/2, zy1=c.y+pad/2;
    for(const mx of x.openings) if(mx.start<zx1-EPS && mx.start+a>zx0+EPS)
      for(const my of y.openings) if(my.start<zy1-EPS && my.start+b>zy0+EPS) skip.add(mx.i+','+my.i);
  }
  const removed=skip.size;""")
    s = R(s, """  const boundaryCounts=[['corner',4,0.25],['edgeColumn',2*(raw.baysX+raw.baysY-2),0.5],['interior',(raw.baysX-1)*(raw.baysY-1),1]];
  for(const [key,number,fraction] of boundaryCounts) {
    if(!number) continue;
    const trib=x.step*y.step*fraction;""", """  for(const key of ['corner','edgeColumn']) {
    const members=cols.filter(c=>(key==='corner')===c.corner);
    const number=members.length;
    if(!number) continue;
    const trib=Math.max(...members.map(c=>c.At));""")
    s = R(s, "  return {raw,L,W,a,b,h,t,r,pad,topX,", """  for(const c of cols) c.sec=groups.find(g=>g.key===(c.corner?'corner':'edgeColumn')).chosen;
  const gaps=arr=>{const v=[...arr].sort((p,q)=>p-q),d=[];for(let i=0;i+1<v.length;i++)d.push(v[i+1]-v[i]);return d;};
  const spacing={x:gaps(cols.filter(c=>Math.abs(c.y)<EPS).map(c=>c.x)),y:gaps(cols.filter(c=>Math.abs(c.x)<EPS).map(c=>c.y))};
  return {cols,skip,spacing,raw,L,W,a,b,h,t,r,pad,topX,""")
    s = R(s, "[T.spans,pairs(v.x.step,v.y.step)+' '+T.m]",
          "[T.spans,[...new Set(v.spacing.x.map(d=>fmt(d)))].join(' / ')+' × '+[...new Set(v.spacing.y.map(d=>fmt(d)))].join(' / ')+' '+T.m]")
    s = R(s, "  if(!v.count) notes.push(T.noMould);", "  if(!v.count) notes.push(T.noMould);\n  if(v.area<60-EPS||v.area>180+EPS) notes.push(T.hallArea);")
    # drawing: moulds skipped around columns, columns at their chosen size, movable section line
    s = R(s, "      if(row.nearSupport && col.nearSupport) continue;", "      if(v.skip.has(col.i+','+row.i)) continue;")
    a = s.index("  for(const sy of y.supports) for(const sx of x.supports) {"); b = s.index("  const horizontal=cut==='A';")
    s = s[:a] + """  for(const c of v.cols) {
    const sx=c.x, sy=c.y;
    if(pad>0) {
      const left=Math.max(0,sx-pad/2), top=Math.max(0,sy-pad/2);
      const right=Math.min(L,sx+pad/2), bottom=Math.min(W,sy+pad/2);
      plan+=rect(ox+left*scale,oy+top*scale,(right-left)*scale,(bottom-top)*scale,'none','stroke="#f4c671" stroke-opacity=".8" stroke-dasharray="3 3"');
    }
    const alongX=c.side==='X'||(c.corner&&L>=W);
    const cw=Math.max(4,(alongX?c.sec.h:c.sec.b)/100*scale), ch=Math.max(4,(alongX?c.sec.b:c.sec.h)/100*scale);
    plan+=rect(ox+sx*scale-cw/2,oy+sy*scale-ch/2,cw,ch,color.support,'stroke="'+color.ink+'" stroke-width=".5"');
  }
""" + s[b:]
    s = R(s, "  const ax=sectionLine(x,L), ay=sectionLine(y,W);",
          "  const ax=cutPos.B!==null?cutPos.B*L:sectionLine(x,L), ay=cutPos.A!==null?cutPos.A*W:sectionLine(y,W);\n  planGeo={ox,oy,scale,L,W};")
    s = R(s, "plan+=line(ox-7,py,ox+L*scale+7,py,color.line,lineExtra)",
          "plan+=line(ox-7,py,ox+L*scale+7,py,color.line,lineExtra)+line(ox-7,py,ox+L*scale+7,py,'transparent','stroke-width=\"16\" class=\"cuthit\" style=\"cursor:ns-resize\"')")
    s = R(s, "plan+=line(px,oy-7,px,oy+W*scale+7,color.line,lineExtra)",
          "plan+=line(px,oy-7,px,oy+W*scale+7,color.line,lineExtra)+line(px,oy-7,px,oy+W*scale+7,'transparent','stroke-width=\"16\" class=\"cuthit\" style=\"cursor:ew-resize\"')")
    s = R(s, "      if(through.nearSupport && o.nearSupport) continue;", "      if(v.skip.has(horizontal?o.i+','+through.i:through.i+','+o.i)) continue;")
    s = R(s, "section+=label(210,32,cut+'–'+cut+' · '+fmt(clear)+' m','direction=\"ltr\"');",
          "section+=label(210,32,cut+'–'+cut+' · '+fmt(clear)+' m · @ '+fmt(cross)+' m','direction=\"ltr\"');")
    s = R(s, "  $('cutA').setAttribute('aria-pressed',String(horizontal));",
          "  $('cutPos').value=String(Math.round((horizontal?ay/W:ax/L)*1000)/10);\n  $('cutPosOut').textContent=fmt(horizontal?ay:ax)+' m';\n  $('cutA').setAttribute('aria-pressed',String(horizontal));")
    s = R(s, "let colChoice = {};\n", "let colChoice = {};\nlet cutPos = {A:null,B:null};\nlet planGeo = null, dragCut = false;\n")
    # markup: slider under the section, horizontal scrolling on phones
    for sid in ("plan", "section"):
        a = s.index(f'<svg id="{sid}"'); b = s.index('</svg>', a) + len('</svg>')
        s = s[:a] + '<div class="svgscroll">' + s[a:b] + '</div>' + s[b:]
    a = s.index('<div class="svgscroll"><svg id="section"'); b = s.index('</svg></div>', a) + len('</svg></div>')
    s = s[:a + (b - a)] + (f'<div class="cutctl hide-print"><label>{e["cutLabel"]}: <output id="cutPosOut" dir="ltr"></output>'
                           f'<input id="cutPos" type="range" min="0" max="100" step="0.5"></label><button type="button" id="cutCenter">{e["center"]}</button></div>') + s[b:]
    # events
    s = R(s, "  $('cutA').addEventListener('click',()=>setCut('A'));", """  $('cutPos').addEventListener('input',e=>{cutPos[cut]=Number(e.target.value)/100;if(current)draw(current);});
  $('cutCenter').addEventListener('click',()=>{cutPos[cut]=null;if(current)draw(current);});
  $('plan').addEventListener('pointerdown',e=>{if(!e.target.classList||!e.target.classList.contains('cuthit'))return;dragCut=true;$('plan').setPointerCapture(e.pointerId);e.preventDefault();});
  $('plan').addEventListener('pointermove',e=>{
    if(!dragCut||!planGeo||!current)return;
    const pt=$('plan').createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;
    const p=pt.matrixTransform($('plan').getScreenCTM().inverse());
    const f=cut==='A'?(p.y-planGeo.oy)/(planGeo.W*planGeo.scale):(p.x-planGeo.ox)/(planGeo.L*planGeo.scale);
    cutPos[cut]=Math.min(1,Math.max(0,Math.round(f*200)/200));draw(current);
  });
  for(const ev of ['pointerup','pointercancel']) $('plan').addEventListener(ev,()=>{dragCut=false;});
  $('cutA').addEventListener('click',()=>setCut('A'));""")
    s = R(s, "$('reset').addEventListener('click',()=>{colChoice={};", "$('reset').addEventListener('click',()=>{colChoice={};cutPos={A:null,B:null};")
    # 7. architectural tool, not structural design: loads are built in and hidden, as in the paneled beam
    #    calculator; column capacity uses the short tied-column form of the Egyptian code,
    #    sigma = 0.35 fcu + 0.67 fy rho = 0.35*25 + 0.67*360*0.01 = 11.162 N/mm2 (same as the paneled beam tool)
    ar = lang == "ar"
    # edge band: at least 25 cm, in steps of 5 cm (25, 30, 35 ...)
    s = R(s, '<input id="edge" type="number" min="0" step="any" value="20" required>', '<input id="edge" type="number" min="25" step="5" value="25" required>')
    # extra mould presets requested by the user: 60 and 75 cm moulds, 30 and 40 cm deep
    # (bottom rib 12 cm for 30 cm depth and 15 cm for 40 cm depth, so the depth stays near 3.5 x the rib width)
    s = R(s, "const PRESETS = {60:[60,60,20,10],75:[75,75,25,12],", "const PRESETS = {60:[60,60,20,10],6030:[60,60,30,12],6040:[60,60,40,15],75:[75,75,25,12],7530:[75,75,30,12],7540:[75,75,40,15],")
    u = "سم" if ar else "cm"
    s = R(s, '<option value="60">60 × 60 × 20 ' + u + '</option>', '<option value="60">60 × 60 × 20 ' + u + '</option><option value="6030">60 × 60 × 30 ' + u + '</option><option value="6040">60 × 60 × 40 ' + u + '</option>')
    s = R(s, '<option value="75">75 × 75 × 25 ' + u + '</option>', '<option value="75">75 × 75 × 25 ' + u + '</option><option value="7530">75 × 75 × 30 ' + u + '</option><option value="7540">75 × 75 × 40 ' + u + '</option>')
    # bug in the original: the button id "reset" hides form.reset(), so "Reset example" threw an error
    s = R(s, "$('form').reset();", "HTMLFormElement.prototype.reset.call($('form'));")
    # medium sections: perimeter columns carry bending, so their loads are increased (edge +25 %, corner +50 %)
    s = R(s, "    const demand=ultimate*trib*raw.storeys;", "    const demand=ultimate*trib*raw.storeys*(key==='corner'?1.5:1.25);")
    s = R(s, f"<fieldset><legend>{'الأحمال الرأسية' if ar else 'Gravity loads'}</legend>", f"<fieldset hidden><legend>{'الأحمال الرأسية' if ar else 'Gravity loads'}</legend>")
    stress_label = "إجهاد محوري افتراضي (ميغاباسكال)" if ar else "Assumed axial stress (MPa)"
    s = R(s, f'<label class="space">{stress_label}<input id="stress" type="number" min="0.1" step="any" value="5"></label>',
          f'<label class="space" hidden>{stress_label}<input id="stress" type="number" min="0.1" step="any" value="11.162"></label>'
          f'<p class="hint space">{e["builtIn"]}</p>')
    loads_aria = "الأحمال والتقدير الأولي للأعمدة" if ar else "Loads and preliminary column sizes"
    s = R(s, f'<div class="tablewrap"><table aria-label="{loads_aria}"><tbody id="loadTable">', f'<div class="tablewrap" hidden><table aria-label="{loads_aria}"><tbody id="loadTable">')
    s = R(s, f'<section class="card" id="loadDetails"><h2>{loads_aria}</h2>', f'<section class="card" id="loadDetails"><h2>{e["colTitle"]}</h2>')
    return s


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
