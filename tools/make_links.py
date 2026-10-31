"""Writes one HTML page listing every link of the site: pages, papers, videos, articles, profiles and admin tools.

Usage:  python tools/make_links.py "<output.html>"
Run by tools/sync-onedrive.ps1 after every sync, so the list follows the site automatically.
"""
import html
import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import build  # noqa: E402  (reuses the site's own loaders)
import feeds  # noqa: E402

REPO = "sayednagy81/sayednagy81.github.io"


def esc(s):
    return html.escape(str(s or ""), quote=True)


def row(label, url, note=""):
    note = f' <span class="n">{esc(note)}</span>' if note else ""
    return f'<li><a href="{esc(url)}" target="_blank">{esc(label)}</a>{note}<br><code>{esc(url)}</code></li>'


def main(out):
    profile = build.load_json(build.ROOT / "content" / "profile.json")
    papers = build.load_json(build.ROOT / "content" / "papers.json")
    site = profile["site_url"].rstrip("/")
    videos = build.load_videos(profile)
    articles = feeds.blog_articles(profile.get("blog_feed", ""))

    sections = []
    pages = [("الرئيسية", "/"), ("نبذة", "/about/"), ("المنشورات", "/publications/"), ("الفيديو", "/videos/"),
             ("المقالات", "/articles/"), ("تواصل", "/contact/"), ("خريطة الموقع sitemap.xml", "/sitemap.xml")]
    sections.append(("صفحات الموقع", [row(l, site + p) for l, p in pages]))

    rows = []
    for p in sorted(papers, key=lambda p: -int(str(p["year"])[:4])):
        title = build.pick(p["title"], "ar") or build.pick(p["title"], "en")
        rows.append(row(f'{p["year"]} – {title}', f'{site}/papers/{p["id"]}/'))
        if p.get("doi"):
            rows.append(row("DOI", f'https://doi.org/{p["doi"]}'))
        rows.append(row("صورة الملخص المصور (PNG)", f'{site}/cards/{p["id"]}.png'))
    sections.append((f"الأبحاث ({len(papers)})", rows))

    sections.append((f"الفيديوهات المعروضة ({len(videos)})",
                     [row(build.pick(v["title_bi"], "ar"), f'https://www.youtube.com/watch?v={v["id"]}', v["date"]) for v in videos]))
    sections.append((f"المقالات ({len(articles)})",
                     [row(a["title"], f'{site}/articles/{a["slug"]}/', a["date"]) for a in articles] +
                     [row(f'الأصل على المدونة: {a["title"]}', a["link"]) for a in articles if a["link"]]))

    sections.append(("الصفحات البحثية والتواصل",
                     [row(build.PLATFORMS.get(l["platform"], (l["platform"],))[0], l["url"]) for l in profile.get("links", [])] +
                     ([row("البريد الإلكتروني", "mailto:" + profile["email"])] if profile.get("email") else [])))

    blog_admin = "https://www.blogger.com/blog/posts/6617844664612080540"
    sections.append(("لوحات الإدارة", [
        row("مستودع الموقع على GitHub", f"https://github.com/{REPO}"),
        row("تعديل الأبحاث papers.json", f"https://github.com/{REPO}/edit/main/content/papers.json"),
        row("تعديل البيانات profile.json", f"https://github.com/{REPO}/edit/main/content/profile.json"),
        row("تعديل نصوص الفيديو videos.json", f"https://github.com/{REPO}/edit/main/content/videos.json"),
        row("تحديث الموقع فورًا (Run workflow)", f"https://github.com/{REPO}/actions/workflows/deploy.yml"),
        row("إعدادات GitHub Pages", f"https://github.com/{REPO}/settings/pages"),
        row("Google Search Console", "https://search.google.com/search-console?resource_id=" + site + "/"),
        row("Search Console – خريطة الموقع", "https://search.google.com/search-console/sitemaps?resource_id=" + site + "/"),
        row("لوحة مدونة Blogger", blog_admin),
        row("إعدادات النشر بالبريد (العنوان السري هنا)", "https://www.blogger.com/blog/settings/6617844664612080540",
            "لا يُحفظ العنوان السري في أي ملف"),
        row("YouTube Studio", "https://studio.youtube.com/channel/" + profile.get("youtube_channel_id", "")),
    ]))

    body = "".join(f'<h2>{esc(t)}</h2><ol>{"".join(r)}</ol>' for t, r in sections)
    stamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    Path(out).write_text(f'''<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>جميع روابط الموقع الشخصي</title>
<style>body{{font-family:"Segoe UI",Tahoma,sans-serif;max-width:960px;margin:24px auto;padding:0 16px;line-height:1.7;color:#1b2433;background:#f8f6f1}}
h1{{color:#13294b}}h2{{color:#13294b;border-bottom:2px solid #a8822f;padding-bottom:4px;margin-top:32px}}
li{{margin:6px 0}}a{{color:#13294b;font-weight:600}}code{{font-size:.8rem;color:#5b6575;direction:ltr;display:inline-block}}.n{{color:#a8822f;font-size:.85rem}}</style>
</head><body><h1>جميع روابط الموقع الشخصي – د. سيد مرعي</h1><p>آخر تحديث: {stamp} · الموقع: <a href="{site}/">{site}</a></p>{body}</body></html>''',
                         encoding="utf-8")
    print(f"links: page written ({sum(len(r) for _, r in sections)} links)")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "links.html")
