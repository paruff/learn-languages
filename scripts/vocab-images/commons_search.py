#!/usr/bin/env python3
"""Search Wikimedia Commons for image candidates with clean license metadata.
Usage: python3 commons_search.py "search query" [limit]
"""
import sys
import json
import urllib.request
import urllib.parse

ACCEPTABLE_LICENSES = {"pd", "cc0", "cc-by-2.0", "cc-by-3.0", "cc-by-4.0", "cc-by-sa-3.0", "cc-by-sa-4.0"}
IMAGE_MIME_PREFIXES = ("image/jpeg", "image/png", "image/webp")

def search(query, limit=8):
    params = {
        "action": "query",
        "generator": "search",
        "gsrsearch": query,
        "gsrnamespace": 6,
        "gsrlimit": limit,
        "prop": "imageinfo",
        "iiprop": "url|extmetadata|size|mime",
        "iiurlwidth": 300,
        "format": "json",
    }
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": "learn-languages-content-research/1.0"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.load(resp)

    pages = data.get("query", {}).get("pages", {})
    results = []
    for page in pages.values():
        info = (page.get("imageinfo") or [None])[0]
        if not info:
            continue
        mime = info.get("mime", "")
        if not mime.startswith(IMAGE_MIME_PREFIXES):
            continue
        meta = info.get("extmetadata", {})
        license_id = (meta.get("License", {}) or {}).get("value", "").lower()
        if license_id not in ACCEPTABLE_LICENSES:
            continue
        results.append({
            "title": page.get("title"),
            "width": info.get("width"),
            "height": info.get("height"),
            "thumburl": info.get("thumburl"),
            "descriptionurl": info.get("descriptionurl"),
            "license": license_id,
            "license_name": (meta.get("LicenseShortName", {}) or {}).get("value", ""),
            "artist": (meta.get("Artist", {}) or {}).get("value", "")[:80],
            "attribution_required": (meta.get("AttributionRequired", {}) or {}).get("value", ""),
        })
    return results

if __name__ == "__main__":
    query = sys.argv[1]
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else 8
    for r in search(query, limit):
        print(json.dumps(r, ensure_ascii=False))
