from pathlib import Path
import re

root = Path(r"c:/Users/shadr.JARVIS/Desktop/WEBDEV/MILESTONE X/milestonex/app/dashboard")
files = [p for p in root.rglob("*.tsx") if p.name != "layout.tsx"]
modified = []
for p in files:
    text = p.read_text(encoding="utf-8")
    orig = text
    text = re.sub(r"import \{ SiteHeader \} from \"@/components/site-header\"\n", "", text)
    text = re.sub(r"^[ \t]*<SiteHeader[^>]*?/?>[ \t]*\n", "", text, flags=re.M)
    text = re.sub(r"\n{3,}", "\n\n", text)
    if text != orig:
        p.write_text(text, encoding="utf-8")
        modified.append(str(p.relative_to(root.parent)))
print("modified:")
for p in modified:
    print(p)
