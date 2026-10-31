"""Fetches the YouTube channel feed and the blog (Blogger) feed at build time.

Both are plain Atom feeds, so no API keys are needed. If a feed can't be fetched the
build still succeeds; that section is simply left empty until the next run.
"""
import html
import re
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

NS = {"a": "http://www.w3.org/2005/Atom", "media": "http://search.yahoo.com/mrss/",
      "yt": "http://www.youtube.com/xml/schemas/2015"}


def _get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (site build)"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def youtube_videos(channel_id):
    if not channel_id:
        return []
    try:
        root = ET.fromstring(_get(f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"))
    except Exception as e:  # network or parse problem: keep building without videos
        print(f"note: YouTube feed unavailable ({e})")
        return []
    out = []
    for e in root.findall("a:entry", NS):
        vid = e.findtext("yt:videoId", "", NS)
        group = e.find("media:group", NS)
        stats = group.find("media:community/media:statistics", NS) if group is not None else None
        out.append({
            "id": vid,
            "title": e.findtext("a:title", "", NS),
            "date": e.findtext("a:published", "", NS)[:10],
            "description": (group.findtext("media:description", "", NS) if group is not None else "").strip(),
            "views": int(stats.get("views", 0)) if stats is not None else 0,
        })
    return [v for v in out if v["id"]]


# ---------- blog articles ----------
ALLOWED = {"p", "br", "b", "strong", "i", "em", "u", "a", "img", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li",
           "blockquote", "table", "thead", "tbody", "tr", "td", "th", "figure", "figcaption", "span", "div", "pre",
           "code", "hr", "sup", "sub", "iframe"}
VOID = {"br", "img", "hr"}
ATTRS = {"a": {"href", "title"}, "img": {"src", "alt", "width", "height"}, "td": {"colspan", "rowspan"},
         "th": {"colspan", "rowspan"}, "iframe": {"src", "width", "height", "allowfullscreen"}}
SAFE_URL = re.compile(r"^(https?:)?//|^mailto:", re.I)
VIDEO_URL = re.compile(r"^(https?:)?//(www\.)?(youtube(-nocookie)?\.com/embed/|player\.vimeo\.com/video/)", re.I)


class _Sanitizer(HTMLParser):
    """Keeps a whitelist of formatting tags so an emailed article can't inject scripts into the site."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out, self.skip, self.dropped_iframes = [], 0, 0

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style", "noscript"):
            self.skip += 1
            return
        if self.skip or tag not in ALLOWED:
            return
        keep = []
        for k, v in attrs:
            if k not in ATTRS.get(tag, ()):
                continue
            v = v or ""
            if k in ("href", "src") and not SAFE_URL.match(v):
                continue
            if tag == "iframe" and k == "src" and not VIDEO_URL.match(v):
                self.dropped_iframes += 1
                return
            keep.append(f' {k}="{html.escape(v, quote=True)}"' if v else f" {k}")
        if tag == "a":
            keep.append(' target="_blank" rel="noopener"')
        if tag == "img":
            keep.append(' loading="lazy"')
        self.out.append(f"<{tag}{''.join(keep)}>")

    def handle_endtag(self, tag):
        if tag in ("script", "style", "noscript"):
            self.skip = max(0, self.skip - 1)
            return
        if tag == "iframe" and self.dropped_iframes:
            self.dropped_iframes -= 1
            return
        if not self.skip and tag in ALLOWED and tag not in VOID:
            self.out.append(f"</{tag}>")

    def handle_data(self, data):
        if not self.skip:
            self.out.append(html.escape(data, quote=False))


def sanitize(fragment):
    s = _Sanitizer()
    s.feed(fragment or "")
    s.close()
    return "".join(s.out)


def plain_text(fragment):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", fragment or ""))).strip()


def blog_articles(feed_url):
    if not feed_url:
        return []
    url = feed_url + ("&" if "?" in feed_url else "?") + "max-results=150"
    try:
        root = ET.fromstring(_get(url))
    except Exception as e:
        print(f"note: blog feed unavailable ({e})")
        return []
    out, used = [], set()
    for e in root.findall("a:entry", NS):
        link = next((l.get("href") for l in e.findall("a:link", NS) if l.get("rel") == "alternate"), "")
        raw = e.findtext("a:content", "", NS) or e.findtext("a:summary", "", NS)
        m = re.search(r"/([A-Za-z0-9_-]+)\.html$", link)
        slug = (m.group(1) if m else "") or "article"
        eid = re.sub(r"\D", "", e.findtext("a:id", "", NS))[-6:]
        if slug in used or slug.startswith("blog-post"):
            slug = f"{slug}-{eid}"
        used.add(slug)
        thumb = e.find("media:thumbnail", NS)
        image = thumb.get("url", "") if thumb is not None else ""
        if not image:
            im = re.search(r'<img[^>]+src="([^"]+)"', raw or "")
            image = im.group(1) if im else ""
        image = re.sub(r"/s72(-c)?/", "/s800/", image)  # Blogger thumbnails are 72px; ask for a bigger copy
        out.append({
            "slug": slug.lower(),
            "title": e.findtext("a:title", "", NS) or "Untitled",
            "date": (e.findtext("a:published", "", NS) or "")[:10],
            "updated": (e.findtext("a:updated", "", NS) or "")[:10],
            "html": sanitize(raw),
            "text": plain_text(raw),
            "tags": [c.get("term") for c in e.findall("a:category", NS) if c.get("term")],
            "image": image,
            "link": link,
        })
    return out
