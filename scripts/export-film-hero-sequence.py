import sys, av, json, hashlib
from fractions import Fraction
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
# Shots from the Cinematic Discovery catalogue (frame ranges in S01, end exclusive, 30 fps CFR).
shots = [('C06', 3054, 3136, 500), ('C03', 2777, 2846, 600), ('C02', 2530, 2647, 730), ('C09', 3448, 3615, 620)]
wanted = {}
for name, a, b, cx in shots:
    for f in range(a, b): wanted[f] = (name, cx)
last = max(b for _, _, b, _ in shots)
frames = {}
with av.open(src) as c:
    for i, fr in enumerate(c.decode(video=0)):
        if i in wanted: frames[i] = fr.to_image()
        if i >= last: break
order = [f for name, a, b, cx in shots for f in range(a, b)]
def encode(path, size, crop, crf):
    o = av.open(path, 'w', options={'movflags': 'faststart'})
    s = o.add_stream('libx264', rate=30, options={'crf': str(crf), 'preset': 'slow', 'g': '60', 'profile': 'high',
        'x264-params': 'colorprim=bt709:transfer=bt709:colormatrix=bt709'})
    s.width, s.height = size; s.pix_fmt = 'yuv420p'; s.codec_context.time_base = Fraction(1, 30)
    for k, f in enumerate(order):
        img = crop(frames[f], wanted[f][1]).resize(size, Image.LANCZOS)
        vf = av.VideoFrame.from_image(img); vf.pts = k; vf.time_base = Fraction(1, 30)
        for p in s.encode(vf): o.mux(p)
    for p in s.encode(): o.mux(p)
    o.close()
full = lambda im, cx: im
def square(im, cx):
    x0 = max(0, min(1280 - 720, cx - 360)); return im.crop((x0, 0, x0 + 720, 720))
encode(f'{out}/craft-desktop.mp4', (1280, 720), full, 22)
encode(f'{out}/craft-mobile.mp4', (640, 640), square, 23)
poster = 3094
full(frames[poster], 0).save(f'{out}/craft-poster.jpg', quality=84, optimize=True, progressive=True)
square(frames[poster], wanted[poster][1]).resize((640, 640), Image.LANCZOS).save(f'{out}/craft-poster-mobile.jpg', quality=84, optimize=True, progressive=True)
# Contact sheet for review: first/middle/last frame of every shot, desktop and mobile crops.
W = 240; rows = []
for name, a, b, cx in shots:
    picks = [a, (a + b) // 2, b - 1]
    row = Image.new('RGB', (W * 3 + 135 * 3, 135))
    for k, f in enumerate(picks):
        row.paste(frames[f].resize((W, 135)), (k * W, 0))
        row.paste(square(frames[f], cx).resize((135, 135)), (W * 3 + k * 135, 0))
    rows.append(row)
sheet = Image.new('RGB', (rows[0].width, 135 * len(rows)))
for i, r in enumerate(rows): sheet.paste(r, (0, i * 135))
sheet.save(f'{out}/../craft-sheet.jpg', quality=80)
info = {'source': 'S01 paton-interface-of-craft.mp4', 'shots': [{'id': n, 'in': a, 'out_exclusive': b, 'mobile_crop_centre_x': cx} for n, a, b, cx in shots],
        'frames': len(order), 'duration': round(len(order) / 30, 3), 'poster_frame': poster, 'exports': []}
for f in ('craft-desktop.mp4', 'craft-mobile.mp4', 'craft-poster.jpg', 'craft-poster-mobile.jpg'):
    data = open(f'{out}/{f}', 'rb').read(); info['exports'].append({'file': f, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()})
json.dump(info, open(f'{out}/../craft-info.json', 'w'), indent=2); print(json.dumps(info, indent=1))
