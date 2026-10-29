"""Assemble a deployable static site in ./dist.

Copies the landing page plus untouched copies of both portfolios:
    dist/index.html, css/, js/, assets/
    dist/version-a/   <- ./version-a
    dist/version-b/   <- ./version-b
Backup and checkpoint folders of the portfolios are left out. The copied HTML
pages (never the originals) get the "back to the yard" tab script, as serve.py does.

Usage: python build.py
"""
import os
import shutil
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from serve import inject_back_tab  # noqa: E402

DIST = os.path.join(HERE, "dist")
SKIP = shutil.ignore_patterns(".checkpoints", ".redesign-backup", ".git", "__pycache__", "*.md", "*.py")

if os.path.isdir(DIST):
    shutil.rmtree(DIST)
os.makedirs(DIST)
for item in ("index.html", "css", "js", "assets"):
    src = os.path.join(HERE, item)
    dst = os.path.join(DIST, item)
    shutil.copytree(src, dst) if os.path.isdir(src) else shutil.copy2(src, dst)
shutil.copytree(os.path.join(HERE, "version-a"), os.path.join(DIST, "version-a"), ignore=SKIP)
shutil.copytree(os.path.join(HERE, "version-b"), os.path.join(DIST, "version-b"), ignore=SKIP)
for version in ("version-a", "version-b"):
    for base, _, files in os.walk(os.path.join(DIST, version)):
        for name in files:
            if name.lower().endswith((".html", ".htm")):
                page = os.path.join(base, name)
                depth = os.path.relpath(page, DIST).count(os.sep)
                with open(page, "rb") as fh:
                    html = fh.read()
                with open(page, "wb") as fh:
                    fh.write(inject_back_tab(html, depth))
open(os.path.join(DIST, ".nojekyll"), "w").close()
print("Built", DIST)
