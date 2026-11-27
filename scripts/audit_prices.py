#!/usr/bin/env python3
"""
Super Telecom Zero Public Rates Auditor
Scans all public customer-facing files in src/ (excluding admin) and public/ GEO endpoints
for currency symbols or public rate leaks (₹, Rs., INR, starting at, minPrice, maxPrice).
Exits non-zero if any leak is detected.
"""
import os
import re
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PUBLIC_GEO_FILES = [
    os.path.join(ROOT_DIR, "public", "llms.txt"),
    os.path.join(ROOT_DIR, "public", ".well-known", "ai.txt"),
    os.path.join(ROOT_DIR, "public", "feed.xml"),
]
AI_JSON_DIR = os.path.join(ROOT_DIR, "public", "ai")

# Case-insensitive & exact patterns for public rate/currency leaks
PATTERNS = [
    ("INR_SYMBOL", re.compile(r"₹")),
    ("RS_CURRENCY", re.compile(r"\bRs\.?\s*[0-9]", re.IGNORECASE)),
    ("INR_CODE", re.compile(r"\bINR\b")),
    ("STARTING_AT", re.compile(r"\bstarting\s+at\b", re.IGNORECASE)),
    ("SCHEMA_MIN_MAX", re.compile(r"\b(minPrice|maxPrice|priceSpecification)\b")),
]


def is_excluded_src_path(path: str) -> bool:
    norm = path.replace("\\", "/")
    if "/src/components/admin/" in norm or norm.endswith("/src/components/admin"):
        return True
    if "/src/routes/admin" in norm:
        return True
    base = os.path.basename(norm)
    if base.startswith("admin.") or base == "admin.tsx":
        return True
    return False


def collect_target_files() -> list[str]:
    targets: list[str] = []
    src_dir = os.path.join(ROOT_DIR, "src")
    for root, dirs, files in os.walk(src_dir):
        norm_root = root.replace("\\", "/")
        if "/src/components/admin" in norm_root:
            dirs[:] = []
            continue
        for f in sorted(files):
            if f.endswith((".ts", ".tsx")):
                full = os.path.join(root, f)
                if not is_excluded_src_path(full):
                    targets.append(full)

    for p in PUBLIC_GEO_FILES:
        if os.path.exists(p):
            targets.append(p)

    if os.path.isdir(AI_JSON_DIR):
        for f in sorted(os.listdir(AI_JSON_DIR)):
            if f.endswith(".json"):
                targets.append(os.path.join(AI_JSON_DIR, f))

    return targets


def main() -> int:
    targets = collect_target_files()
    leaks: list[str] = []

    for path in targets:
        rel = os.path.relpath(path, ROOT_DIR).replace("\\", "/")
        try:
            with open(path, "r", encoding="utf-8", errors="ignore") as fh:
                for line_no, raw_line in enumerate(fh, 1):
                    line = raw_line.strip()
                    if not line:
                        continue
                    for tag, regex in PATTERNS:
                        if regex.search(line):
                            leaks.append(f"[{tag}] {rel}:{line_no}: {line[:140]}")
        except OSError as exc:
            leaks.append(f"[READ_ERROR] {rel}: {exc}")

    print(f"Scanned {len(targets)} public source and GEO files.")
    print(f"Total public price leaks found: {len(leaks)}")
    for leak in leaks:
        print("  LEAK:", leak)

    if leaks:
        return 1
    print("PASS: Zero public price or currency leaks detected.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
