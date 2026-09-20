#!/usr/bin/env python3
"""Search Openverse for image candidates with clean license metadata.
Usage: python3 openverse_search.py "search query" [license_csv] [limit]
license_csv default prefers no-attribution licenses first: cc0,pdm
"""
import sys
import json
import urllib.request
import urllib.parse

def search(query, licenses="cc0,pdm,by", limit=8):
    params = {"q": query, "license": licenses, "page_size": limit, "mature": "false"}
    url = "https://api.openverse.org/v1/images/?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": "learn-languages-content-research/1.0"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.load(resp)
    out = []
    for r in data.get("results", []):
        out.append({
            "title": r.get("title"),
            "creator": r.get("creator"),
            "license": r.get("license"),
            "license_version": r.get("license_version"),
            "attribution": r.get("attribution"),
            "url": r.get("url"),
            "width": r.get("width"),
            "height": r.get("height"),
            "foreign_landing_url": r.get("foreign_landing_url"),
        })
    return out

if __name__ == "__main__":
    query = sys.argv[1]
    licenses = sys.argv[2] if len(sys.argv) > 2 else "cc0,pdm,by"
    limit = int(sys.argv[3]) if len(sys.argv) > 3 else 8
    for r in search(query, licenses, limit):
        print(json.dumps(r, ensure_ascii=False))
