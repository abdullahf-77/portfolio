"""Split each eye of character-reference.webp into: a fixed patch (pupil replaced by
eye-white), a movable pupil (painted glint removed) and a socket mask (eye opening)."""
import sys, os
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

SRC = r"C:\Users\afs12\Desktop\Projects\neural-portfolio\assets\art\character-reference.webp"
OUT = r"C:\Users\afs12\Desktop\Projects\neural-portfolio\assets\art\eyes"
DBG = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
im = np.asarray(Image.open(SRC).convert("RGBA")).astype(np.float32)
rgb = im[..., :3]
lum = rgb @ np.array([0.3, 0.59, 0.11])

# (name, box x0,y0,x1,y1, seed point inside the pupil)
EYES = [("left", (300, 545, 500, 760), (400, 670)), ("right", (585, 505, 785, 725), (690, 640))]
# pupil ovals (cx, cy, rx, ry) measured from the artwork; the upper lid and hair stay out
OVAL = {"left": (403, 657, 50, 65), "right": (688, 624, 48, 73)}
report = {}
for name, (x0, y0, x1, y1), (sx, sy) in EYES:
    L = lum[y0:y1, x0:x1]; C = rgb[y0:y1, x0:x1]
    r, g, b = C[..., 0], C[..., 1], C[..., 2]
    core = L < 42
    near_core = ndi.uniform_filter(core.astype(np.float32), 15) > 0.45
    glint = near_core & ~core                               # painted highlight inside the pupil (bright spot + red halo)
    glint = ndi.binary_dilation(glint, iterations=2) & near_core
    dark = core | glint
    lab, _ = ndi.label(dark)
    pupil = lab == lab[sy - y0, sx - x0]
    pupil = ndi.binary_opening(pupil, iterations=2)          # cut thin lash / lid strands
    lab2, _ = ndi.label(pupil); pupil = lab2 == lab2[sy - y0, sx - x0]
    ocx, ocy, orx, ory = OVAL[name]
    yy, xx = np.mgrid[y0:y1, x0:x1]
    oval = ((xx - ocx) / orx) ** 2 + ((yy - ocy) / ory) ** 2 <= 1
    pupil = ndi.binary_fill_holes(pupil & oval)
    # eye-white: light pixels touching the pupil ring
    ring = ndi.binary_dilation(pupil, iterations=26) & ~pupil
    light = (L > 85) & (g > 0.45 * r) & ring                # eye-white: lighter and less saturated than skin
    lab3, n3 = ndi.label(light)
    sizes = ndi.sum(light, lab3, range(1, n3 + 1))
    sclera = np.isin(lab3, [i + 1 for i, s in enumerate(sizes) if s > 40])
    grown_oval = ((xx - ocx) / (orx + 3)) ** 2 + ((yy - ocy) / (ory + 2)) ** 2 <= 1
    socket = ndi.binary_closing(ndi.binary_dilation(pupil, iterations=2) | sclera, iterations=8)
    socket = ndi.binary_fill_holes(socket) & ndi.binary_dilation(pupil, iterations=24)
    # keep the upper lid out: above the pupil's centre the opening is the pupil oval itself
    socket &= (yy > ocy) | grown_oval | sclera
    # the moving layer is everything dark inside the opening: pupil plus its dark iris
    # edge, so nothing dark is left behind when it moves
    # widened sideways to take the iris edge; it stops just above the lower lid line
    # above the centre only a little extra width: the lid's shadow flap hangs there and must stay put
    tw = np.clip((yy - (ocy - 0.55 * ory)) / (0.5 * ory), 0, 1)
    wide_x = orx + 4 + 10 * tw * tw * (3 - 2 * tw)           # widens smoothly towards the middle
    wide_oval = (((xx - ocx) / wide_x) ** 2 + ((yy - ocy) / (ory + 6)) ** 2 <= 1) & \
                ((yy < ocy) | (((xx - ocx) / (orx + 2)) ** 2 + ((yy - ocy) / (ory + 1)) ** 2 <= 1))   # curved bottom
    socket |= wide_oval & ((L < 75) | glint) & ndi.binary_dilation(socket, iterations=16)
    socket = ndi.binary_fill_holes(socket)
    pupil = ndi.binary_fill_holes(((L < 75) | glint | pupil) & socket & wide_oval)
    disk = (lambda r: (np.add.outer(np.arange(-r, r + 1) ** 2, np.arange(-r, r + 1) ** 2) <= r * r))(8)
    pupil = ndi.binary_opening(pupil, structure=disk)       # round shape: thin flaps / lash strokes break off
    lab4, _ = ndi.label(pupil); pupil = lab4 == lab4[sy - y0, sx - x0]
    # the moving shape is a smooth ellipse fitted to the pupil body: medians of the
    # row extents ignore any shadow wedge stuck to one side
    rows = np.where(pupil.any(1))[0]; h = rows.max() - rows.min()
    mid = rows[(rows > rows.min() + h * 0.3) & (rows < rows.max() - h * 0.3)]
    lefts = np.array([np.where(pupil[r])[0].min() for r in mid]); rights = np.array([np.where(pupil[r])[0].max() for r in mid])
    ecx = x0 + (np.median(lefts) + np.median(rights)) / 2; erx = (np.median(rights) - np.median(lefts)) / 2 + 1
    ecy = y0 + (rows.min() + rows.max()) / 2; ery = h / 2 + 1
    ellipse = ((xx - ecx) / erx) ** 2 + ((yy - ecy) / ery) ** 2 <= 1
    # round off dents in the opening around the pupil's travel range (below the upper lid),
    # so the original drawing never peeks through beside the pupil
    big = (lambda r: (np.add.outer(np.arange(-r, r + 1) ** 2, np.arange(-r, r + 1) ** 2) <= r * r))(14)
    socket |= ndi.binary_closing(socket, structure=big, iterations=1) & ndi.binary_dilation(ellipse, iterations=14) & (yy > ecy - 0.35 * ery)
    socket = ndi.binary_fill_holes(socket)
    # smooth the opening's outline so its edges are clean curves, not pixel steps
    d6 = (lambda r: (np.add.outer(np.arange(-r, r + 1) ** 2, np.arange(-r, r + 1) ** 2) <= r * r))(6)
    dk = lambda r: (np.add.outer(np.arange(-r, r + 1) ** 2, np.arange(-r, r + 1) ** 2) <= r * r)
    socket = ndi.binary_fill_holes(ndi.binary_opening(ndi.binary_closing(socket, structure=dk(12)), structure=dk(10)))
    pupil = ellipse                                           # an exact smooth ellipse; the page's mask does the clipping
    pupil = ndi.binary_fill_holes(pupil)
    lab5, _ = ndi.label(pupil); pupil = lab5 == lab5[sy - y0, sx - x0]
    sclera &= ~pupil
    # the upper lid where it meets the pupil stays fixed, drawn over the moving pupil
    # a thin strip that follows the top edge of the eye opening, column by column
    has = socket.any(axis=0)
    top_edge = np.where(has, socket.argmax(axis=0), 10 ** 6)[None, :]
    depth = (yy - y0) - top_edge
    lid = (L < 75) & (depth >= -3) & (depth < 5) & has[None, :]
    lid_alpha = ndi.gaussian_filter(lid.astype(np.float32), 0.7) * np.clip((7 - depth) / 3, 0, 1)
    sc_col = np.median(C[sclera], axis=0) if sclera.any() else np.array([200, 160, 140])
    pu_col = np.median(C[pupil & ~glint & (L < 30)], axis=0)
    # patch: inside the opening, only clean eye-white pixels of the drawing are kept;
    # everything else (old pupil, iris edge, stray marks) is filled row by row from the
    # eye-white beside it, so nothing of the old pupil can ever show
    keep = sclera & ~ndi.binary_dilation((L < 110) | glint, iterations=2) & (L > 85)
    hole = socket & ~keep
    patch = im[y0:y1, x0:x1].copy()
    fill = np.broadcast_to(sc_col, C.shape).astype(np.float32).copy()
    xs_all = np.arange(C.shape[1])
    for y in range(C.shape[0]):
        if not hole[y].any():
            continue
        k = np.where(keep[y])[0]
        if len(k) >= 2:
            for ch in range(3):
                fill[y, :, ch] = np.interp(xs_all, k, C[y, k, ch])
        elif len(k) == 1:
            fill[y] = C[y, k[0]]
    fill = ndi.gaussian_filter(fill, (5, 3, 0))
    # soft shadow under the upper lid: darkest at the top of the opening
    has = socket.any(axis=0); top_s = np.where(has, socket.argmax(axis=0), 0)[None, :]
    dd = np.clip(((yy - y0) - top_s) / 28.0, 0, 1)[..., None]
    fill = fill * (0.62 + 0.38 * np.sqrt(dd))
    soft = ndi.gaussian_filter(hole.astype(np.float32), 1.0)[..., None]
    patch[..., :3] = patch[..., :3] * (1 - soft) + fill * soft
    # pupil layer: original dark pixels, glint painted out, soft 1px edge
    pu = im[y0:y1, x0:x1].copy()
    pu[..., :3] = np.where((glint | (L >= 60))[..., None], pu_col, pu[..., :3])   # light specks inside the ellipse take the pupil colour
    alpha = ndi.gaussian_filter(pupil.astype(np.float32), 0.6)   # only the dark pixels move, no light ring
    pu[..., 3] = alpha * 255
    lidimg = im[y0:y1, x0:x1].copy(); lidimg[..., 3] = lid_alpha * 255
    Image.fromarray(lidimg.astype(np.uint8), "RGBA").save(os.path.join(OUT, f"{name}-lid.png"), optimize=True)
    soft_socket = ndi.gaussian_filter(socket.astype(np.float32), 0.8)
    Image.fromarray(patch.astype(np.uint8), "RGBA").save(os.path.join(OUT, f"{name}-patch.png"), optimize=True)
    Image.fromarray(pu.astype(np.uint8), "RGBA").save(os.path.join(OUT, f"{name}-pupil.png"), optimize=True)
    m = np.zeros((y1 - y0, x1 - x0, 4), np.uint8); m[..., 3] = (soft_socket * 255).astype(np.uint8)
    Image.fromarray(m, "RGBA").save(os.path.join(OUT, f"{name}-socket.png"), optimize=True)
    # debug: pupil red, sclera green, socket outline blue
    dbg = im[y0:y1, x0:x1, :3].copy()
    dbg[pupil] = dbg[pupil] * 0.4 + np.array([255, 0, 0]) * 0.6
    dbg[sclera] = dbg[sclera] * 0.4 + np.array([0, 255, 0]) * 0.6
    edge = socket & ~ndi.binary_erosion(socket)
    dbg[edge] = [0, 120, 255]
    Image.fromarray(dbg.astype(np.uint8)).resize(((x1 - x0) * 2, (y1 - y0) * 2)).save(os.path.join(DBG, f"eye-{name}-dbg.png"))
    report[name] = dict(box=(x0, y0, x1, y1), pupil_px=int(pupil.sum()), sclera_px=int(sclera.sum()),
                        sclera=[int(v) for v in sc_col], glint_px=int((glint & hole).sum()))
print(report)
