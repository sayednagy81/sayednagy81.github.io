"""Builds root/courses/building-construction-ii/ (index.html, style.css, vendor/) from the course markup and the Tailwind config here.
Run: python make.py   (needs `npm install` once in this folder; original-stripped.html is the supplied course page without its images)"""
import shutil
import subprocess
from pathlib import Path

HERE = Path(__file__).parent
D = HERE.parent.parent / 'root' / 'courses' / 'building-construction-ii'
src = (HERE / 'original-stripped.html').read_text(encoding='utf-8')
hs = src.index('<header class="sticky')
he = src.index('</header>', hs) + len('</header>')
bs = src.index('<main id="appRoot"')
be = src.index('</main>', bs) + len('</main>')
header, mid, main = src[hs:he], src[he:bs], src[bs:be]   # mid = toast + lightbox markup

# the same colour mapping as in app.js (original palette -> site palette)
import re
MAP = {'16243d': '13294b', 'c85a32': 'a8822f', '0f766e': '2c6a96', 'b45309': '8a6a22', 'e2e8f0': 'e4dfd3', '334155': '4a5465',
       '94a3b8': '9aa4b5', 'b04b27': '8a6a22', '64748b': '5b6575', 'f59e0b': 'd2b06a', 'f0ede6': 'f3efe6', 'e5e0d5': 'e4dfd3'}
recolor = lambda t: re.sub(r'#([0-9a-fA-F]{6})\b', lambda m: '#' + MAP.get(m.group(1).lower(), m.group(1)), t)
header, mid, main = recolor(header), recolor(mid), recolor(main)

FONTS = ("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Noto+Naskh+Arabic:wght@600;700"
         "&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&display=swap")
URL = 'https://sayednagy81.github.io/courses/building-construction-ii/'
TITLE = 'مقرر إنشاء مباني 2: الأنظمة الإنشائية الخرسانية | د. سيد مرعي'
DESC = ('سبع محاضرات تفاعلية في الأنظمة الإنشائية الخرسانية (الكمرات البسيطة، اللاكمرية، الهوردي، الوافل، الكمرات المتقاطعة، الإطارات) '
        'مع مختبر للمقارنة و170 صورة وبنك اختبارات. Interactive Building Construction II course: concrete structural systems.')
SITE_TOP = '''<div class="site-top">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-5 flex-wrap" style="min-height:58px">
    <a href="/" class="site-brand">د. سيد مرعي · Sayed Marey Nagy</a>
    <nav class="site-nav ms-auto" aria-label="موقع">
      <a href="/">الرئيسية</a><a href="/about/">نبذة</a><a href="/publications/">المنشورات</a><a href="/videos/">الفيديو</a><a href="/articles/">المقالات</a><a href="/tools/">الأدوات</a><a href="/courses/">المقررات</a><a href="/contact/">تواصل</a>
    </nav>
  </div>
  <div class="site-crumb"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5"><a href="/">د. سيد مرعي</a> &nbsp;/&nbsp; <a href="/courses/">المقررات</a> &nbsp;/&nbsp; مقرر إنشاء مباني 2</div></div>
</div>'''
FOOT = '''<footer class="site-footer mt-12">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">© 2026 د. سيد مرعي · Sayed Marey Nagy</div>
</footer>'''
LD = ('{"@context":"https://schema.org","@type":"Course","name":"مقرر إنشاء مباني 2: الأنظمة الإنشائية الخرسانية","alternateName":"Building Construction II",'
      '"description":"سبع محاضرات تفاعلية في الأنظمة الإنشائية الخرسانية لطلاب العمارة.","inLanguage":"ar","isAccessibleForFree":true,'
      '"url":"' + URL + '","provider":{"@type":"Person","name":"Sayed Marey Nagy","url":"https://sayednagy81.github.io/"}}')
KW = ('إنشاء مباني, الأنظمة الإنشائية, البلاطات اللاكمرية, الوافل, السقف الهوردي, الكمرات المتقاطعة, الإطارات الخرسانية, محاضرات عمارة, '
      'Building Construction, flat slab, waffle slab, paneled beam, concrete frames')

html = f'''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{TITLE}</title>
  <meta name="description" content="{DESC}">
  <meta name="keywords" content="{KW}">
  <link rel="canonical" href="{URL}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <meta property="og:type" content="website"><meta property="og:locale" content="ar_AR">
  <meta property="og:title" content="مقرر إنشاء مباني 2: الأنظمة الإنشائية الخرسانية"><meta property="og:url" content="{URL}">
  <meta property="og:description" content="{DESC}">
  <meta property="og:image" content="{URL}img/isometric.jpg">
  <script type="application/ld+json">{LD}</script>
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="{FONTS}" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
  <script src="vendor/chart.umd.js"></script>
  <script src="vendor/lucide.min.js"></script>
</head>
<body class="blueprint-bg min-h-screen flex flex-col">
{SITE_TOP}
  {header}
{mid}
  {main}
{FOOT}
<script src="app.js"></script>
</body>
</html>
'''
(D / 'index.html').write_text(html, encoding='utf-8', newline='\n')
(D / 'vendor').mkdir(exist_ok=True)
shutil.copy(HERE / 'node_modules/chart.js/dist/chart.umd.js', D / 'vendor/chart.umd.js')
shutil.copy(HERE / 'node_modules/lucide/dist/umd/lucide.min.js', D / 'vendor/lucide.min.js')
npx = shutil.which('npx.cmd') or shutil.which('npx')
subprocess.run([npx, 'tailwindcss', '-c', 'tailwind.config.js', '-i', 'input.css', '-o', str(D / 'style.css'), '--minify'], cwd=HERE, check=True)
print('built', D)
