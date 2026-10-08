"""Decode a complete video and create a contact sheet of its scene changes."""
import argparse
import json
import re
import subprocess
from pathlib import Path

import imageio_ffmpeg
from PIL import Image, ImageDraw

parser = argparse.ArgumentParser()
parser.add_argument("video", type=Path)
args = parser.parse_args()
stem = args.video.with_suffix("")
folder = stem.parent / (stem.name + "-frames")
folder.mkdir(exist_ok=True)
ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
subprocess.run([ffmpeg, "-y", "-ss", "1", "-i", str(args.video), "-frames:v", "1", "-q:v", "2", str(stem) + "-poster.jpg"], check=True, capture_output=True)
result = subprocess.run([ffmpeg, "-y", "-i", str(args.video), "-vf", r"select=gt(scene\,0.15),scale=640:-2,showinfo", "-fps_mode", "vfr", "-q:v", "3", str(folder / "scene-%03d.jpg")], check=True, capture_output=True, text=True)
log = result.stderr
Path(str(stem) + "-decode.log").write_text(log)
times = [float(t) for t in re.findall(r"pts_time:([\d.]+)", log)]
Path(str(stem) + "-scenes.json").write_text(json.dumps(times, indent=2) + "\n")
images = [Path(str(stem) + "-poster.jpg")] + sorted(folder.glob("scene-*.jpg"))
labels = ["Opening"] + [f"{int(t)//60:02}:{int(t)%60:02}" for t in times]
for offset in range(0, len(images), 12):
    group = images[offset:offset + 12]
    sheet = Image.new("RGB", (1280, ((len(group) + 1)//2)*390), "#fffdf7")
    draw = ImageDraw.Draw(sheet)
    for index, path in enumerate(group):
        frame = Image.open(path).convert("RGB")
        frame.thumbnail((630, 355))
        x, y = (index % 2)*640, (index//2)*390
        sheet.paste(frame, (x, y+25))
        draw.text((x+8, y+6), labels[offset+index], fill="#2d2439")
    sheet.save(str(stem) + f"-contact-{offset//12+1:02}.jpg", quality=85)
print(json.dumps({"video": str(args.video), "sceneChanges": len(times), "contactSheets": (len(images)+11)//12}))
