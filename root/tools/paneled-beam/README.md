# Paneled beam calculator

Educational preliminary sizing of a paneled-beam (crossed-beam) slab for a rectangular hall on perimeter columns.
For architecture students only: it is not a structural analysis or a code-compliant design.

## Files

| File | Purpose |
|---|---|
| `Paneled_Beam_Calculator_AR.html` | Arabic page (right to left) |
| `Paneled_Beam_Calculator_EN.html` | English page (left to right) |
| `pb.js` | Shared engine, drawings and interface, so both languages run the same calculations |
| `pb.css` | Calculator styles, using the site colours from `/static/style.css` |
| `index.html` | Sends visitors to the Arabic or English page according to the site language they chose |

The two HTML pages are written by `tools/make_paneled_beam_pages.py`; edit that script, not the pages, and run it again.
Tests: `node tests/test_paneled_beam.js`.

## Installation

Nothing to install. The folder is static and works on GitHub Pages or any web server. `build.py` copies `root/` into `dist/`
unchanged, and the calculator is linked from `/tools/`, the home page, search, the sitemap and the links page.

## How it works

1. Hall geometry: length L (X) and width Ls (Y), between beam axes. One paneled slab should be 60–180 m².
   A hall over 180 m² is not rejected: it is split along L into equal slabs of 60–180 m² (the student picks how many). Two modes:
   - Separate: each slab is an independent hall with its own perimeter beams and four corner columns; the joint between slabs is widened until the twin columns do not overlap.
   - Continuous: neighbouring slabs share the dividing beam, treated as a perimeter beam with the perimeter-beam size of the larger slab; internal beams run continuously over it, and the columns at its ends take tributary area from both slabs. No extra columns are placed along the shared beam. The Ls rules are for the simple case, so this is a rough estimate (continuity gives a negative moment over the shared beam, needing top reinforcement).
   For split slabs the Ls rules use the shorter side of each slab.
2. Beam grid: internal beams spaced 2–4 m, panel area no more than 16 m², panel ratio no more than 4:3. All feasible grids are listed; if none exists a warning is shown and no internal beams are drawn.
3. Slab and beams from Ls: slab Ls/45 (rounded up to 1 cm), perimeter beam Ls/16 and internal beam Ls/24 overall depth (rounded up to 5 cm).
4. Loads: editable presets (school and offices D = 6, L = 3; public service and assembly D = 6, L = 5 kN/m²). D is either a superimposed load (slab and beam self-weight added automatically) or a total dead load. Service load w = D + L; factored load wu = γD·D + γL·L with editable factors (default 1.4 and 1.6). These are teaching assumptions, not verified code values.
5. Columns: four corner columns plus optional perimeter columns (4–24), never at internal beam intersections. Tributary area is shared along the perimeter by half the distance to each neighbouring column (a teaching approximation, not beam reactions). Required area = Pu / σ with σ = α·fcu + β·fy·ρ (defaults 0.35, 0.67, 25, 360, 1 %). The section search returns b and h in multiples of 5 cm, at least 25 cm, with h/b no more than 2, never below the required area, and picks the most balanced section within 10 % of the smallest area.
6. Plan and sections: true beam widths and column sizes, grid bubbles, dimension chains, and two section lines that can be dragged on the plan or moved with sliders. A section shows only the elements its line actually cuts; the vertical scale is exaggerated and the factor is printed on the drawing.
7. Summary, SVG downloads for the plan and both sections, and print.

## Limits

No check of bending, shear, deflection, punching, slenderness, column self-weight, reinforcement or detailing. A structural engineer must design the final members.
