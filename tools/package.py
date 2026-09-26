"""Zips module/pestilence into release/pestilence.zip for the manifest's download URL.

Uses forward-slash entry names (Windows PowerShell's Compress-Archive writes backslashes,
which breaks installs on Linux-hosted Foundry servers). module.json sits at the zip root.
"""
import json
import pathlib
import zipfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
MODULE = ROOT / "module" / "pestilence"
OUT = ROOT / "release" / "pestilence.zip"
SKIP = {"LOCK", "LOG", "LOG.old"}  # LevelDB runtime files; Foundry recreates them

version = json.loads((MODULE / "module.json").read_text(encoding="utf-8"))["version"]
OUT.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
    for f in sorted(MODULE.rglob("*")):
        if f.is_file() and f.name not in SKIP:
            z.write(f, f.relative_to(MODULE).as_posix())
print(f"packaged pestilence v{version} -> {OUT.relative_to(ROOT)} ({OUT.stat().st_size / 1e6:.1f} MB)")
