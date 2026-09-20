# Vocabulary image sourcing

Two keyless search helpers for finding openly-licensed images for vocabulary
items, plus the process for using them. See `public/vocab-images/CREDITS.md`
for the attribution ledger and accepted-sources policy (#41).

## Usage

```bash
python3 scripts/vocab-images/commons_search.py "<descriptive query>" [limit]
python3 scripts/vocab-images/openverse_search.py "<query>" [license_csv] [limit]
```

Both print one JSON object per candidate (title/license/URL/attribution) —
pipe through `python3 -m json.tool` or similar for readability.

## Process (see #74 for a worked example)

1. **Search Commons first.** Use a specific, descriptive phrase, not the bare
   vocabulary word — "water" surfaces unrelated art and diagrams; "glass of
   drinking water" surfaces the actual object. Fall back to Openverse only
   when Commons has nothing suitable (in practice Commons has been the
   stronger source so far — Openverse indexes much of Commons anyway, plus
   Flickr, and its relevance ranking has been noisier for this kind of
   query).
2. **The scripts already filter to open licenses** (`pd`, `cc0`, `cc-by-*`,
   `cc-by-sa-*` on Commons; whatever `license_csv` you pass to Openverse) —
   never use an unfiltered result.
3. **Visually verify every candidate before choosing — this is the step
   that actually matters.** A clean license is not the same as a
   pedagogically clear image. Real examples caught this way: a top-down
   carbonated-water photo that didn't read as "water" to a beginner; a file
   titled "bread" that was actually muffins; multiple "milk glass" results
   that were antique opaque glassware (a collectibles term), not the
   beverage. Download the candidate and look at it — don't trust the
   filename or title.
4. **Resize and convert.** Vocabulary images render at 96×96 (see
   `.vocab-item__image` in `[nodeId].astro`) — there's no reason to ship a
   multi-MB original. `sips -Z 240 in.jpg --out resized.jpg` then
   `cwebp -q 82 resized.jpg -o final.webp` gets most photos under 10KB.
5. **Record attribution in `public/vocab-images/CREDITS.md` before** setting
   `imageUrl`/`imageAlt` in the content YAML — not after, so it can't be
   forgotten.
6. **Skip abstract vocabulary.** Not every word benefits from an image —
   concrete nouns (food, animals, objects) are strong candidates; phrases,
   grammatical connectives, and abstract nouns (e.g. "tradição",
   "experiência") usually aren't worth forcing an image onto.
