"""
One-off asset pipeline: resize oversized rasters and re-encode them as WebP.

The source images were full-resolution screenshots and logo downloads — 9 MB for a
card rendered at 370x192 CSS pixels. Each image is capped at roughly 2x its largest
on-screen size and written as WebP next to the original.

Run:  python scripts/optimize-images.py [--apply]
Without --apply it only reports what it would do.
"""
from __future__ import annotations

import argparse
import os
import sys

from PIL import Image

ASSETS = os.path.join("src", "assets")

# stem -> (output name, max width, max height)
# Project cards render at ~370x192 CSS px in a 3-column 1200px grid; 800px wide
# covers a 2x display with room to spare.
PROJECT_BOX = (800, 500)
# Skill chips render at 24-32 CSS px.
ICON_BOX = (96, 96)
# Timeline medallions render at 44-64 CSS px.
LOGO_BOX = (160, 160)

PROJECTS = [
    "mockmate.png", "arch.png", "codeassist.webp", "pharmacy.webp", "social.png",
    "restro.png", "blog.png", "newstool.png", "travelplan.png", "DocumentRag.png",
    "facemask1.png", "spam.png", "portfolio.png",
]

ICONS = [
    "express-js.png", "nest .png", "cv.jpg", "nlp.png", "ml.png", "scikit.png",
    "dnn.png", "datavis.png", "datapre.png", "threejs.png", "colab.png",
    "excel.png", "spyder.png", "springtool.jpeg", "Jupyter_logo.svg.png",
    "weaviate.png", "chroma.webp",
]

LOGOS = ["risidio_logo.jpeg", "Accenture-Logo.png", "cardiff.png", "cdac.png", "sing.jpeg"]

# A few names are awkward to import (spaces, doubled extensions); normalise them.
RENAMES = {
    "nest .png": "nest",
    "Jupyter_logo.svg.png": "jupyter",
    "Accenture-Logo.png": "accenture",
    "risidio_logo.jpeg": "risidio",
    "sing.jpeg": "skn",
    "express-js.png": "expressjs",
    "facemask1.png": "facemask",
}


def out_name(filename: str) -> str:
    stem = RENAMES.get(filename) or os.path.splitext(filename)[0]
    return stem + ".webp"


def convert(filename: str, box: tuple[int, int], quality: int, apply: bool) -> tuple[int, int]:
    src = os.path.join(ASSETS, filename)
    if not os.path.exists(src):
        print(f"  !! missing {filename}")
        return (0, 0)

    before = os.path.getsize(src)
    dst = os.path.join(ASSETS, out_name(filename))

    with Image.open(src) as im:
        im.load()
        # Drop any alpha channel that is fully opaque so the encoder can use the
        # cheaper no-alpha path.
        if im.mode in ("RGBA", "LA", "P"):
            im = im.convert("RGBA")
            if im.getchannel("A").getextrema() == (255, 255):
                im = im.convert("RGB")
        elif im.mode != "RGB":
            im = im.convert("RGB")

        im.thumbnail(box, Image.LANCZOS)

        if apply:
            im.save(dst, "WEBP", quality=quality, method=6)

    after = os.path.getsize(dst) if apply and os.path.exists(dst) else 0
    pct = (1 - after / before) * 100 if after else 0
    print(f"  {filename:28s} {before/1024:9.1f} KB -> {after/1024:7.1f} KB  ({pct:5.1f}% smaller)")
    return (before, after)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="actually write files")
    args = parser.parse_args()

    total_before = total_after = 0
    for label, names, box, quality in (
        ("PROJECT CARDS", PROJECTS, PROJECT_BOX, 80),
        ("SKILL ICONS", ICONS, ICON_BOX, 88),
        ("TIMELINE LOGOS", LOGOS, LOGO_BOX, 88),
    ):
        print(f"\n{label}")
        for name in names:
            before, after = convert(name, box, quality, args.apply)
            total_before += before
            total_after += after

    print(f"\nTOTAL  {total_before/1024/1024:.2f} MB -> {total_after/1024/1024:.2f} MB")
    if not args.apply:
        print("(dry run — pass --apply to write)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
