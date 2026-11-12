#!/usr/bin/env python3
"""Copy partials/header.html and partials/footer.html into every page.

Run from the repo root after editing either partial:
    python3 scripts/sync-partials.py

Each page keeps the markers <!-- header:start --> ... <!-- header:end --> and
<!-- footer:start --> ... <!-- footer:end -->; everything between them is
replaced. The current page's nav link gets aria-current="page".
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
HEADER = (ROOT / "partials/header.html").read_text().strip()
FOOTER = (ROOT / "partials/footer.html").read_text().strip()


def url_for(path: pathlib.Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    if rel == "index.html":
        return "/"
    if rel.endswith("/index.html"):
        return "/" + rel[: -len("index.html")]
    return "/" + rel


def mark_current(html: str, url: str) -> str:
    # Exact page link -> aria-current="page"
    html = html.replace(f'<a href="{url}">', f'<a href="{url}" aria-current="page">')
    # Parent dropdown button gets an active style when a child page is open
    for section, dd in (("/platform/", "dd-platform"), ("/solutions/", "dd-solutions")):
        if url.startswith(section):
            html = html.replace('<li class="has-dropdown">\n          <button type="button" aria-expanded="false" aria-controls="%s">' % dd,
                                '<li class="has-dropdown is-active">\n          <button type="button" aria-expanded="false" aria-controls="%s">' % dd)
    return html


def sync(path: pathlib.Path) -> bool:
    src = path.read_text()
    url = url_for(path)
    out = re.sub(r"<!-- header:start -->.*?<!-- header:end -->",
                 lambda m: "<!-- header:start -->\n" + mark_current(HEADER, url) + "\n<!-- header:end -->", src, flags=re.S)
    out = re.sub(r"<!-- footer:start -->.*?<!-- footer:end -->",
                 lambda m: "<!-- footer:start -->\n" + mark_current(FOOTER, url) + "\n<!-- footer:end -->", out, flags=re.S)
    if out != src:
        path.write_text(out)
        return True
    return False


if __name__ == "__main__":
    for page in sorted(ROOT.rglob("*.html")):
        if "partials" in page.parts:
            continue
        if sync(page):
            print("synced", page.relative_to(ROOT))
