import os
import re

matches = []
for root, dirs, files in os.walk("src"):
    for f in files:
        if f.endswith((".tsx", ".ts")):
            p = os.path.join(root, f)
            with open(p, "r", encoding="utf-8", errors="ignore") as file:
                for idx, line in enumerate(file, 1):
                    if re.search(r'₹\s*\d+', line):
                        matches.append(f"{p}:{idx}: {line.strip()}")

print(f"Total price matches found: {len(matches)}")
for m in matches[:30]:
    print(m)
