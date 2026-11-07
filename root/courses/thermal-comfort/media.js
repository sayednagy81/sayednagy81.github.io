/* Photos and charts for the thermal comfort course.
   Every number comes from the lecture text, except charts marked calc (simple arithmetic on those numbers). */
const COURSE_PHOTOS = {
  "assiut-main": { alt: "المبنى الرئيسي لجامعة أسيوط", caption: "المبنى الرئيسي لجامعة أسيوط", note: "صورة للجامعة، وليست صالات الرسم محل الدراسة.", credit: "Roland Unger", lic: "CC BY-SA 3.0", page: "https://commons.wikimedia.org/wiki/File:AsyutUniversityMainBldg.jpg" },
  "sohag-science": { alt: "مبنى كلية العلوم بجامعة سوهاج", caption: "كلية العلوم بجامعة سوهاج", note: "صورة للجامعة، وليست الفناءين محل الدراسة.", credit: "Ayman2017", lic: "CC BY-SA 3.0", page: "https://commons.wikimedia.org/wiki/File:Pic_of_Faculty_of_science_sohag_university.jpg" },
  "sultan-hassan": { alt: "صحن مدرسة السلطان حسن بالقاهرة", caption: "صحن مدرسة السلطان حسن وإيوانها، القاهرة", note: "", credit: "Basssant Meligy", lic: "CC BY-SA 4.0", page: "https://commons.wikimedia.org/wiki/File:Al_Sultan_Hassan_Mosque.jpg" },
  "ibn-tulun": { alt: "صحن جامع ابن طولون بالقاهرة", caption: "صحن جامع ابن طولون، القاهرة", note: "", credit: "Mark Fischer", lic: "CC BY-SA 2.0", page: "https://commons.wikimedia.org/wiki/File:Ibn_Tulun_Mosque_Courtyard_(28835589172).jpg" },
  "cairo-engineering": { alt: "مبنى كلية الهندسة بجامعة القاهرة", caption: "كلية الهندسة بجامعة القاهرة", note: "صورة للكلية، وليست مبنى قسم العمارة ذا الطوابق الثمانية نفسه.", credit: "Mohamed Ouda", lic: "CC BY-SA 3.0", page: "https://commons.wikimedia.org/wiki/File:Cairo_engineering.JPG" },
  "timisoara-rectorate": { alt: "قصر لويد مقر رئاسة جامعة تيميشوارا التقنية", caption: "مقر رئاسة جامعة تيميشوارا التقنية (قصر لويد)", note: "صورة لمقر الجامعة، وليست المدرجات محل الدراسة.", credit: "Turbojet", lic: "CC BY-SA 3.0", page: "https://commons.wikimedia.org/wiki/File:Universitatea_Politehnica_Timisoara_-_Rectorat.jpg" },
  "kielce-energis": { alt: "مباني جامعة كيلسي للتكنولوجيا ويظهر مبنى Energis في الخلفية", caption: "جامعة كيلسي للتكنولوجيا، ويظهر مبنى Energis في الخلفية", note: "", credit: "Jakub T. Jankiewicz", lic: "CC BY-SA 4.0", page: "https://commons.wikimedia.org/wiki/File:Budynki_Politechniki_%C5%9Awi%C4%99tokrzyskiej.jpg" },
  "ehu-architecture": { alt: "مدخل مدرسة العمارة بجامعة إقليم الباسك في سان سيباستيان", caption: "مدخل مدرسة العمارة بجامعة إقليم الباسك، سان سيباستيان", note: "", credit: "Joxemai", lic: "CC BY-SA 3.0", page: "https://commons.wikimedia.org/wiki/File:Arkitektura_eskola_ataria_001.JPG" },
  "nile-university": { alt: "واجهة جامعة النيل في مصر", caption: "جامعة النيل، مصر", note: "", credit: "Faris El-Gwely", lic: "CC BY-SA 4.0", page: "https://commons.wikimedia.org/wiki/File:Nile_University-2.JPG" }
};

// lecture number -> slide number -> photo names
const SLIDE_PHOTOS = {
  1: { 1: ["assiut-main"], 20: ["assiut-main"] },
  2: { 1: ["sohag-science"], 20: ["sohag-science"], 24: ["sultan-hassan", "ibn-tulun"] },
  5: { 24: ["cairo-engineering"] },
  6: { 24: ["timisoara-rectorate"] },
  9: { 1: ["cairo-engineering"], 20: ["cairo-engineering"], 22: ["kielce-energis"], 24: ["ehu-architecture"] },
  10: { 1: ["nile-university"], 20: ["nile-university"] }
};

const R = (label, from, to) => ({ label, from, to });
const B = (label, value, extra) => Object.assign({ label, value }, extra || {});
const REF = { ref: true };

// lecture number -> slide number -> chart
const SLIDE_CHARTS = {
  1: {
    3: { type: "range", title: "حصة التكييف والإضاءة من الطاقة", unit: "%", max: 100, rows: [R("طاقة التكييف بالمبنى التعليمي", 60, 80), R("استهلاك الإضاءة من القدرة الاسمية (أسيوط)", 50, 75)], source: "Abdallah, 2015 وأرقام المحاضرة" },
    5: { type: "line", title: "حرارة الراحة في النموذج التكيفي", formula: "T_comf = 0.31 · T_pma + 17.8", a: 0.31, b: 17.8, x0: 10, x1: 33, marks: [15, 25, 30], xLabel: "متوسط الحرارة الخارجية T_pma (°C)", source: "معادلة المحاضرة الأولى" },
    13: { type: "bar", title: "تراجع الأداء الإدراكي مع ارتفاع الحرارة", unit: "%", max: 12, calc: true, rows: [B("26°C", 2), B("27°C", 4), B("28°C", 6), B("29°C", 8), B("30°C", 10)], source: "حساب خطي من قاعدة المحاضرة: 2% لكل 1°C فوق 25°C" },
    21: { type: "bar", title: "نسبة عدم الراحة الحرارية في صالات الرسم", unit: "%", max: 100, rows: [B("6 صالات رسم، 269 طالبًا", 83)], source: "Abdallah, 2015" },
    23: { type: "bar", title: "التحسن الأكاديمي المرتبط بجودة البيئة الداخلية", unit: "%", max: 100, rows: [B("مراسم التصميم في الأردن", 77.4)], source: "Al-Jokhadar et al., 2023" }
  },
  2: {
    13: { type: "range", title: "مقدار التبريد في الفناء الهجين", unit: "°C", max: 30, rows: [R("خفض حرارة الهواء قبل دخول القاعات", 3, 4), R("خفض الحرارة الإشعاعية MRT", 15, 25)], source: "أرقام المحاضرة الثانية" },
    14: { type: "range", title: "تراجع كفاءة الحلول التراثية بحلول 2035", unit: "%", max: 50, rows: [R("بسبب الجزر الحرارية وتلوث PM2.5", 28, 35)], source: "Heritage, 2026" },
    21: { type: "bar", title: "نسبة الارتفاع إلى العرض H/W في الفناءين", unit: "", max: 1.5, rows: [B("فناء كلية الزراعة (مكشوف)", 0.7, REF), B("فناء كلية التربية (الأفضل حراريًا)", 1.2)], source: "Abdallah, 2019" },
    23: { type: "range", title: "خفض مؤشر PET في البدائل الهجينة", unit: "°C", max: 24, rows: [R("التشجير مع البرجولات", 11.1, 13.9)], note: "وخفضت طاقة المبنى الكلية 30%.", source: "Abdallah & Mahmoud, 2025" }
  },
  3: {
    3: { type: "bar", title: "معامل الانتقال الحراري U لعناصر الغلاف", unit: "W/m²K", max: 2.9, rows: [B("السقف القائم", 2.264, REF), B("الحائط القائم", 1.924, REF), B("السقف المطور (الحد الأقصى)", 0.35, { disp: "≤ 0.35" }), B("الغلاف الفائق Passivhaus", 0.138)], source: "Sustainability, 2026 وأرقام المحاضرة" },
    21: { type: "bar", title: "السقف قبل التطوير وبعده", unit: "W/m²K", max: 2.9, rows: [B("قبل التطوير", 2.264, REF), B("بعد التطوير (الحد الأقصى)", 0.35, { disp: "≤ 0.35" })], note: "الفرق 85% تقريبًا (حساب من الرقمين).", source: "Sustainability, 2026" },
    23: { type: "bar", title: "فرق الحرارة صيفًا بين المبنيين", unit: "°C", max: 4, rows: [B("الكتلة المتوسطة أبرد من الخفيفة بمقدار", 2.7)], note: "من تحليل 2990 استبيانًا طلابيًا.", source: "Teli et al., 2014" },
    24: { type: "bar", title: "سيناريوها الاحترار في الدراسة", unit: "°C", max: 4.5, rows: [B("السيناريو الأول", 1.5, { disp: "+1.5" }), B("السيناريو الثاني", 3.5, { disp: "+3.5" })], source: "Moazzen et al., 2023" }
  },
  4: {
    21: { type: "bar", title: "خفض ساعات عدم الراحة بطبقة PCM", unit: "%", max: 12, rows: [B("طبقة 40mm RT25HC جهة الخارج", 7.65)], source: "ELTanany et al., 2026" },
    23: { type: "bar", title: "نتائج التحسين متعدد الأهداف", unit: "%", max: 30, rows: [B("خفض الطاقة", 24), B("خفض الحر", 16.5)], source: "NSGA-II & Monte Carlo، أستراليا" }
  },
  5: {
    5: { type: "bar", title: "مؤشر انتقائية الزجاج LSG = VLT / SHGC", unit: "", max: 2.6, calc: true, rows: [B("الحد المطلوب", 1.6, Object.assign({ disp: "> 1.6" }, REF)), B("زجاج Low-E مزدوج (0.60 / 0.28)", 2.14)], source: "حساب من قيم الزجاج في المحاضرة الخامسة" },
    13: { type: "range", title: "وفر كهرباء الإضاءة بحساسات التعتيم النهاري", unit: "%", max: 100, rows: [R("مصابيح LED مع Daylight Dimming", 50, 75)], source: "أرقام المحاضرة الخامسة" },
    21: { type: "bar", title: "قوة ارتباط مساحة النافذة بأداء القاعة (R²)", unit: "", max: 1.2, rows: [B("الحرارة", 0.93), B("الإضاءة", 0.92)], source: "Elbellahy, 2026" },
    23: { type: "range", title: "أثر زيادة 1°C على الإحساس الحراري TSV", unit: "", max: 0.6, rows: [R("حرارة الكرة الإشعاعية Tg", 0.35, 0.5), R("حرارة الهواء", 0.1, 0.18)], source: "Luo et al., 2026" }
  },
  6: {
    3: { type: "range", title: "نسبة الوقت الذي تتحقق فيه الراحة", unit: "%", max: 100, rows: [R("تهوية متقاطعة", 40, 70), R("تهوية أحادية الجانب", 1, 2)], source: "أرقام المحاضرة السادسة" },
    6: { type: "bar", title: "تركيز CO2 في مدرجات تيميشوارا", unit: "ppm", max: 3200, rows: [B("نوافذ مغلقة", 2400, REF), B("بعد فتح النوافذ يدويًا", 1500)], source: "Sarbu & Pacurar, 2015" },
    7: { type: "bar", title: "نسبة غير الراضين PPD في مدرجات تيميشوارا", unit: "%", max: 28, rows: [B("قبل الدمج الهجين", 21, REF), B("بعد الدمج الهجين", 7.4)], source: "Sarbu & Pacurar, 2015" },
    13: { type: "bar", title: "فقد الأداء الإدراكي للطلاب", unit: "%", max: 30, rows: [B("قبل التهوية", 23, REF), B("بعد التهوية", 10, { disp: "< 10" })], source: "أرقام المحاضرة السادسة" },
    23: { type: "range", title: "أثر التهوية الهجينة والطبيعية", unit: "%", max: 60, rows: [R("خفض الاحترار بالتهوية الهجينة", 42, 48), R("وفر الطاقة الأولية السنوية", 18, 33)], source: "Tavakoli et al., 2026 وأرقام المحاضرة" }
  },
  7: {
    13: { type: "range", title: "وفر الطاقة بضبط درجات الحرارة", unit: "%", max: 40, rows: [R("ضبط ديناميكي 25–26°C مع مراوح السقف", 20, 30), R("رفع الضبط 1°C مع المراوح", 7, 10)], source: "أرقام المحاضرة السابعة" },
    21: { type: "bar", title: "مساحة المبنى والمساحة المكيفة", unit: "m²", max: 8500, rows: [B("المساحة الكلية", 6020, REF), B("المساحة المكيفة", 3848.24)], source: "Sustainability, 2026" },
    23: { type: "range", title: "ثبات الحرارة الفعالة في القاعة", unit: "°C", min: 20, max: 28, rows: [R("TABS مع طبقة PCM", 23.5, 24.8)], note: "مع PMV ضمن ±0.5 و PPD أقل من 10%.", source: "أرقام المحاضرة السابعة" }
  },
  8: {
    21: { type: "bar", title: "كثافة استهلاك الطاقة قبل التأهيل وبعده", unit: "kWh/m²", max: 80, rows: [B("قبل التأهيل", 57.53, REF), B("بعد التأهيل", 18.41)], note: "وفر 68%، على مساحة 1563.89 m².", source: "Danial, Mahmoud & Tawfik, 2023" },
    24: { type: "bar", title: "حجم بيانات خريطة كفاءة الطاقة", unit: "", max: 150000, rows: [B("شهادات الأداء الطاقي EPC", 111000, Object.assign({ disp: "> 111,000" }, REF)), B("مضلعات المباني", 41010, { disp: "41,010" })], source: "Energies, 2020" }
  },
  9: {
    5: { type: "bar", title: "الهرم المعكوس للوصول إلى nZEB", unit: "%", max: 55, calc: true, rows: [B("خفض الحمل سلبيًا بالغلاف والفناء", 40), B("رفع كفاءة الإضاءة والتكييف", 25), B("الباقي تغطيه الخلايا الشمسية", 35, REF)], source: "أرقام المحاضرة التاسعة؛ الباقي بالطرح من 100" },
    13: { type: "range", title: "وفر الطاقة حسب مستوى إعادة التأهيل", unit: "%", max: 130, rows: [R("سطحي", 10, 20), R("متوسط", 25, 45), R("عميق و nZEB", 68, 100)], source: "أرقام المحاضرة التاسعة" },
    21: { type: "bar", title: "استعمالات الأرض في حرم جامعة القاهرة", unit: "%", max: 60, rows: [B("مبانٍ", 46, REF), B("أسفلت أسود", 26, REF), B("مناطق خضراء", 4)], source: "Aboulnaga & Moustafa, 2016" },
    23: { type: "range", title: "نطاق الحرارة في صور FLIR لمبنى Energis", unit: "°C", min: 10, max: 36, rows: [R("قاعتا المحاضرات 4.09 و1.14", 14.7, 28.2)], source: "Majewski et al., 2020" }
  },
  10: {
    13: { type: "range", title: "مدى التنبؤ بالحمل الحراري قبل حدوثه", unit: "ساعة", max: 9, rows: [R("AI مع BMS", 3, 6)], source: "أرقام المحاضرة العاشرة" },
    23: { type: "range", title: "وزن جودة البيئة الداخلية في GPRS-Uni", unit: "%", max: 40, rows: [R("IEQ", 22, 25)], note: "ووزن الطاقة مع IEQ أكثر من 50% من التقييم.", source: "Arafat et al., 2023" },
    24: { type: "range", title: "نطاق الحرارة الأمثل في NSGA-II", unit: "°C", min: 20, max: 28, rows: [R("الحرارة الداخلية", 22.6, 24.8)], note: "مع مستوى صوت 45 dBA.", source: "أرقام المحاضرة العاشرة" }
  }
};

const INK = "#0F172A", MUTED = "#475569", GRID = "#E2E8F0", MAIN = "#047857", BASE = "#64748B";
const svgEsc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fmt = v => { const n = Number(v); return Number.isInteger(n) ? n.toLocaleString("en-US") : String(n); };
function wrapLabel(s, n) {
  const out = [""];
  String(s).split(" ").forEach(w => {
    const l = out.length - 1;
    if ((out[l] + " " + w).trim().length > n && out[l]) out.push(w); else out[l] = (out[l] + " " + w).trim();
  });
  return out.slice(0, 3);
}

function chartSVG(c) {
  const W = 600, H = 378;
  const FONT = 'font-family="Cairo, Tajawal, Tahoma, Arial, sans-serif"';
  const wrapSvg = g => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="1190" height="750" role="img" aria-label="${svgEsc(c.title)}" ${FONT}>${g}</svg>`;
  let g = `<rect width="${W}" height="${H}" fill="#FFFFFF"/>`;
  g += `<text x="${W - 16}" y="32" text-anchor="start" direction="rtl" font-size="17" font-weight="800" fill="${INK}">${svgEsc(c.title)}</text>`;
  const foot = [c.note, (c.calc ? "" : "المصدر: ") + c.source].filter(Boolean);
  foot.forEach((t, i) => {
    g += `<text x="${W - 16}" y="${H - 14 - (foot.length - 1 - i) * 21}" text-anchor="start" direction="rtl" font-size="12" fill="${MUTED}">${svgEsc(t)}</text>`;
  });

  if (c.type === "line") {
    const L = 58, Rr = W - 24, T = 74, Bt = H - 96;
    const y0 = c.a * c.x0 + c.b, y1 = c.a * c.x1 + c.b;
    const lo = Math.floor(y0) - 1, hi = Math.ceil(y1) + 1;
    const sx = x => L + (x - c.x0) / (c.x1 - c.x0) * (Rr - L), sy = y => Bt - (y - lo) / (hi - lo) * (Bt - T);
    g += `<text x="${W - 16}" y="54" text-anchor="end" font-size="13" fill="${MUTED}" direction="ltr">${svgEsc(c.formula)}</text>`;
    for (let y = Math.ceil(lo / 2) * 2; y <= hi; y += 2) {
      g += `<line x1="${L}" x2="${Rr}" y1="${sy(y)}" y2="${sy(y)}" stroke="${GRID}"/><text x="${L - 8}" y="${sy(y) + 4}" text-anchor="end" font-size="12" fill="${MUTED}">${y}</text>`;
    }
    for (let x = 10; x <= c.x1; x += 5) g += `<text x="${sx(x)}" y="${Bt + 18}" text-anchor="middle" font-size="12" fill="${MUTED}">${x}</text>`;
    g += `<text x="${(L + Rr) / 2}" y="${Bt + 44}" text-anchor="middle" direction="rtl" font-size="12" fill="${MUTED}">${svgEsc(c.xLabel)}</text>`;
    g += `<line x1="${sx(c.x0)}" y1="${sy(y0)}" x2="${sx(c.x1)}" y2="${sy(y1)}" stroke="${MAIN}" stroke-width="2.5" stroke-linecap="round"/>`;
    c.marks.forEach(x => {
      const y = c.a * x + c.b;
      g += `<g><title>عند ${x}°C: حرارة الراحة ${y.toFixed(1)}°C</title><circle cx="${sx(x)}" cy="${sy(y)}" r="12" fill="transparent"/><circle cx="${sx(x)}" cy="${sy(y)}" r="5" fill="${MAIN}" stroke="#FFFFFF" stroke-width="2"/><text x="${sx(x)}" y="${sy(y) - 12}" text-anchor="middle" font-size="13" font-weight="700" fill="${INK}">${y.toFixed(1)}°C</text></g>`;
    });
    return wrapSvg(g);
  }

  // Horizontal marks that grow from the right, to match Arabic reading order
  const rows = c.rows, top = 58, bottom = H - 36 - foot.length * 21;
  const axisR = 352, axisL = 28, min = c.min || 0, max = c.max;
  const sc = v => axisR - (v - min) / (max - min) * (axisR - axisL);
  const band = (bottom - top) / rows.length, th = Math.min(26, band * 0.5);
  [min, (min + max) / 2, max].forEach(t => {
    g += `<line x1="${sc(t)}" x2="${sc(t)}" y1="${top}" y2="${bottom}" stroke="${GRID}"/><text x="${sc(t)}" y="${bottom + 15}" text-anchor="middle" font-size="11" fill="${MUTED}">${fmt(+t.toFixed(2))}</text>`;
  });
  rows.forEach((r, i) => {
    const cy = top + band * (i + .5), y = cy - th / 2, ranged = c.type === "range";
    const hi = ranged ? r.to : r.value, lo = ranged ? r.from : min;
    const x = sc(hi), w = Math.max(3, sc(lo) - sc(hi));
    const text = ranged ? `${fmt(r.from)}–${fmt(r.to)}` : (r.disp || fmt(r.value));
    const full = `${text}${c.unit ? " " + c.unit : ""}`;
    const lines = wrapLabel(r.label, 30);
    lines.forEach((t, k) => {
      g += `<text x="${W - 16}" y="${cy + 5 + (k - (lines.length - 1) / 2) * 20}" text-anchor="start" direction="rtl" font-size="13.5" font-weight="600" fill="${INK}">${svgEsc(t)}</text>`;
    });
    g += `<g><title>${svgEsc(r.label)}: ${svgEsc(full)}</title><rect x="${axisL}" y="${cy - band / 2}" width="${axisR - axisL}" height="${band}" fill="transparent"/><rect x="${x}" y="${y}" width="${w}" height="${th}" rx="4" fill="${r.ref ? BASE : MAIN}"/></g>`;
    g += `<text x="${x - 8}" y="${cy + 5}" text-anchor="end" direction="ltr" font-size="14" font-weight="800" fill="${INK}">${svgEsc(full)}</text>`;
  });
  g += `<line x1="${axisR}" x2="${axisR}" y1="${top}" y2="${bottom}" stroke="${BASE}"/>`;
  return wrapSvg(g);
}

function photoFigure(name, compact) {
  const p = COURSE_PHOTOS[name];
  return `<figure class="m-0 flex flex-col min-w-0">
    <img src="img/${name}.jpg" alt="${svgEsc(p.alt)}" loading="lazy" class="w-full ${compact ? "h-36 md:h-44" : "h-44 md:h-56"} object-cover rounded-xl border border-slate-200">
    <figcaption class="text-[11px] leading-5 text-slate-700 mt-1.5"><b>${svgEsc(p.caption)}</b>${p.note ? ` <span class="text-amber-800">${svgEsc(p.note)}</span>` : ""}
      <a class="block text-slate-500 underline" href="${p.page}" target="_blank" rel="noopener" dir="ltr">Photo: ${svgEsc(p.credit)}, ${p.lic}, Wikimedia Commons</a></figcaption>
  </figure>`;
}

function slideMediaHTML(slide, lecNum) {
  const photos = (SLIDE_PHOTOS[lecNum] || {})[slide.num];
  if (photos) {
    return `<div class="bg-white border-2 border-slate-200 rounded-2xl p-3 h-full shadow-sm grid gap-3 ${photos.length > 1 ? "grid-cols-2" : "grid-cols-1"}">${photos.map(n => photoFigure(n, photos.length > 1)).join("")}</div>`;
  }
  const chart = (SLIDE_CHARTS[lecNum] || {})[slide.num];
  if (chart) return `<div class="bg-white border-2 border-slate-200 rounded-2xl p-2 h-full shadow-sm course-chart">${chartSVG(chart)}</div>`;
  return "";
}

// Prepares the images used in the PowerPoint export
const mediaCache = {};
const CW = 1190, CH = 750;
const loadImg = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
function drawCover(ctx, img, x, y, w, h) {
  const s = Math.max(w / img.width, h / img.height), sw = w / s, sh = h / s;
  ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x, y, w, h);
}
async function mediaDataURL(lecNum, slideNum) {
  const cv = document.createElement("canvas");
  cv.width = CW; cv.height = CH;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, CW, CH);
  const photos = (SLIDE_PHOTOS[lecNum] || {})[slideNum];
  if (photos) {
    const band = 120, w = CW / photos.length;
    for (let i = 0; i < photos.length; i++) {
      const p = COURSE_PHOTOS[photos[i]], x = CW - w * (i + 1);
      drawCover(ctx, await loadImg(`img/${photos[i]}.jpg`), x + 6, 6, w - 12, CH - band - 12);
      ctx.direction = "rtl"; ctx.textAlign = "right"; ctx.fillStyle = INK; ctx.font = "bold 24px Cairo, Tahoma, Arial";
      ctx.fillText(p.caption, x + w - 10, CH - band + 30, w - 20);
      ctx.fillStyle = "#92400E"; ctx.font = "20px Cairo, Tahoma, Arial";
      if (p.note) ctx.fillText(p.note, x + w - 10, CH - band + 62, w - 20);
      ctx.direction = "ltr"; ctx.textAlign = "left"; ctx.fillStyle = MUTED; ctx.font = "18px Arial";
      ctx.fillText(`Photo: ${p.credit}, ${p.lic}, Wikimedia Commons`, x + 10, CH - 14, w - 20);
    }
    return cv.toDataURL("image/jpeg", 0.86);
  }
  const svg = chartSVG(SLIDE_CHARTS[lecNum][slideNum]);
  ctx.drawImage(await loadImg("data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg)), 0, 0, CW, CH);
  return cv.toDataURL("image/png");
}
async function prepareLectureMedia(lecIdx) {
  const n = lecIdx + 1;
  const nums = new Set([...Object.keys(SLIDE_PHOTOS[n] || {}), ...Object.keys(SLIDE_CHARTS[n] || {})]);
  for (const s of nums) {
    const key = `${n}_${s}`;
    if (!mediaCache[key]) {
      try { mediaCache[key] = await mediaDataURL(n, +s); } catch (e) { console.warn("media", key, e); }
    }
  }
}
