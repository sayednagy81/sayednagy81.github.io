# Claude Integration Prompt — Waffle Slab Calculator

انسخ النص التالي إلى Claude مع إرفاق ملفَّي HTML، أو فكّ الحزمة وأرفق المجلد الذي يحتوي عليهما. استخدمه داخل سياق مستودع موقع الأدوات المعمارية والهندسية.

---

You are working in my existing architectural and engineering tools website repository. Integrate the two supplied standalone Waffle Slab calculators as bilingual tools.

## Files

- `Waffle_Slab_Calculator_AR.html` — Arabic, RTL
- `Waffle_Slab_Calculator_EN.html` — English, LTR

## Implementation

1. Inspect the repository structure, existing tools index, navigation, site base path, and deployment setup. Identify the existing public directory. Use the established tool directory and retain both filenames and their case. If there is no convention, place both files in `tools/waffle-slab/` under the site’s public root.
2. Keep both HTML files in the same directory and retain the relative language-switch links between them. Make all paths from the website index work under the GitHub Pages project base path, including when the site is served under a repository subdirectory.
3. Add a tool card or navigation entry named «حاسبة البلاطة الوافل» in Arabic and “Waffle Slab Calculator” in English, using the site’s existing patterns. For a single bilingual index, provide both links. Use the description “توزيع القوالب وحصر الخرسانة وعرض المسقط والقطاعات” / “Mould layout, concrete quantities, plan and sections.”
4. Preserve the calculation model, example inputs, preset dimensions, 5° and 7° taper choices, warnings, units, SVG and CSV exports, and print layout. The calculators use inline styles and scripts and work as standalone documents. If a site policy prevents inline execution, use the repository’s existing asset or hash strategy for these tools. Preserve the behavior and keep the supplied originals available for standalone use.
5. Follow the repository’s normal validation workflow and inspect the final changes. Show the paths changed, the two preview URLs or their URL patterns, and the verification results. Carry out repository or deployment changes within the scope of the current instructions.

## Acceptance checks

- Open each tool directly and through its tool card under the configured site base path. Switch languages in both directions and check that URLs resolve.
- Verify Arabic RTL, English LTR, narrow-screen layout, and numeric parity for the same inputs.
- Check the presets 60 × 60 × 20, 75 × 75 × 25, 90 × 90 × 45, 105 × 105 × 50, and 105 × 105 × 60 cm. The bottom rib values are 10, 12, 15, 20, and 20 cm respectively.
- Keep 5° as default and 7° as the only other option. Confirm the mould narrows upward and the rib widens upward. For 90 × 90 × 45 cm at 5°, expect a top opening of about 82.13 × 82.13 cm and a top rib width of about 22.87 cm.
- With the bundled 12 × 10 m example, check that both languages show 74 moulds and roughly 38.918 m³ net concrete. Confirm that changing the solid-zone size affects the layout and quantities.
- Switch between A–A and B–B, export the SVG and CSV, and check print preview.
- Confirm the preliminary scope and the punching-shear warning remain visible. These calculators are intended for takeoff and preliminary estimates.

