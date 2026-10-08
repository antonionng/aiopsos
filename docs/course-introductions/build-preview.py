"""Build the private review page and development media register from saved files."""
import html
import json
import shutil
from pathlib import Path

root = Path(__file__).resolve().parents[2]
output = root / "output/course-introductions"
production = json.loads((root / "docs/course-introductions/production.json").read_text())
catalogue = {c["slug"]: c for c in json.loads((root / "lib/course-introductions/catalogue.json").read_text())}
register_path = root / "lib/course-introductions/media.json"
register = json.loads(register_path.read_text())
cards = []
escape = html.escape

for job in [production["academy"], *production["courses"]]:
    if not job.get("output"):
        continue
    slug = job.get("slug", "academy-overview")
    media = root / job["output"]
    stem = media.stem
    files = {"src": media.name, "poster": stem + "-poster.jpg",
             "captions": stem + ".captions-draft.vtt", "transcript": stem + ".transcript-draft.txt"}
    if not all((output / name).exists() for name in files.values()):
        raise RuntimeError("Missing review files for " + slug)
    if not job.get("durationLabel"):
        seconds = round(job["durationSeconds"])
        job["durationLabel"] = f"{seconds//60}:{seconds%60:02}"
    if not register.get(slug, {}).get("reviewed"):
        register[slug] = {**{k: "/courses/media/" + name for k, name in files.items()},
                          "durationLabel": job["durationLabel"], "reviewed": False}
    course = catalogue.get(slug)
    title = course["title"] if course else "Welcome to Experrt Academy"
    description = course["learn"] if course else "How the Academy’s learning, practice and assessments work."
    source = root / job["source"]
    source_name = slug + ".source.md"
    shutil.copy2(source, output / source_name)
    issues = "".join("<li>" + escape(issue) + "</li>" for issue in job.get("issues", []))
    notes = '<details><summary>Known corrections needed</summary><ul>' + issues + '</ul></details>' if issues else ''
    status = "Approved recording" if job.get("reviewed") else "Needs corrections" if job["status"] == "needs-revision" else "Listening and caption checks pending"
    cards.append(f'''<article><p class="eyebrow">PRIVATE REVIEW · {escape(job['durationLabel'])}</p>
      <h2>{escape(title)}</h2><p>{escape(description)}</p><p><strong>{escape(status)}</strong></p>
      <video controls playsinline preload="none" poster="{escape(files['poster'])}" aria-label="{escape(title)}">
      <source src="{escape(files['src'])}" type="video/mp4"><track kind="captions" src="{escape(files['captions'])}" srclang="en-GB" label="English draft" default></video>
      <p class="links"><a href="{escape(files['transcript'])}">Transcript draft</a><a href="{escape(files['captions'])}" download>Caption draft</a><a href="{escape(source_name)}">Course source</a><a href="{escape(files['src'])}" download>Download video</a></p>{notes}</article>''')

register_path.write_text(json.dumps(register, indent=2) + "\n")
page = '''<!doctype html><html lang="en-GB"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Experrt Academy | Private course video review</title>
<style>body{margin:0;background:#fffcf7;color:#2d2439;font:16px/1.7 system-ui,sans-serif}main{max-width:1150px;margin:auto;padding:40px 24px}header{max-width:850px;margin-bottom:36px}.brand{font-size:26px;font-weight:800;color:#7044b2}h1{font-size:clamp(28px,4vw,42px);line-height:1.2}h2{font-size:22px;line-height:1.3}p{color:#6b6077}.notice{background:#eee7fa;padding:18px 24px;border-radius:14px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}article{background:#fff;border:1px solid #dfd3ef;border-radius:20px;padding:22px;min-width:0}video{width:100%;aspect-ratio:16/9;background:#2d2439;border-radius:12px}.eyebrow{font-size:11px;letter-spacing:.1em;color:#7044b2;font-weight:700}.links{display:flex;flex-wrap:wrap;gap:10px 20px;font-size:13px}a{color:#7044b2;text-underline-offset:4px}summary{cursor:pointer;color:#7044b2;font-weight:600}li{font-size:14px}a:focus-visible,video:focus-visible,summary:focus-visible{outline:3px solid #926fc2;outline-offset:4px}@media(max-width:720px){.grid{grid-template-columns:1fr}main{padding:24px 16px}}</style>
<main><header><div class="brand">Experrt Academy</div><h1>Review the course introduction videos</h1><p>Watch an overview of each course’s audience, practical work and assessment. These are private review copies, with machine transcript and caption drafts.</p><p class="notice">Generation is not approval. Some recordings need factual or wording corrections. Complete listening, pronunciation and caption checks remain outstanding. The recordings are not published in paid courses.</p><p><a href="http://127.0.0.1:3001/#academy-introduction">Preview the homepage section</a> · <a href="http://127.0.0.1:3033/">Open the original lesson and podcast pilot</a></p></header><section class="grid">'''
downloaded = len(cards)
missing = len(production["courses"]) + 1 - downloaded
revision = sum(j.get("status") == "needs-revision" for j in [production["academy"], *production["courses"]])
approved = sum(j.get("reviewed") is True and register.get(j["slug"], {}).get("reviewed") is True for j in [production["academy"], *production["courses"]])
summary = f'<p class="notice"><strong>{downloaded} overviews downloaded</strong> · {missing} still need generation or a retry · {revision} have corrections recorded · {approved} approved for publication.</p>'
page = page.replace('<section class="grid">', summary + '<section class="grid">')
page += "\n".join(cards) + '</section></main></html>'
(output / "index.html").write_text(page)
print(f"Prepared {len(cards)} private video cards; {approved} overviews approved for production.")
