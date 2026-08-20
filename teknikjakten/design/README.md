# Designunderlag

Originalbilderna som appens utseende bygger på. De ligger **utanför `public/`**
med flit: allt i `public/` kopieras rakt in i bygget och plockas upp av PWA:ns
precache. En 2 MB PNG här fällde produktionsbygget en gång, eftersom
`vite-plugin-pwa` gör "filen är för stor för precache" till ett hårt fel.

Lägg alltså aldrig råa designfiler i `public/`. Gör i stället en optimerad
variant och spara den där:

```bash
python3 -c "
from PIL import Image
im = Image.open('design/rymdstation bakgrund.png').convert('RGB')
w = 1600; h = round(im.height * w / im.width)
im = im.resize((w, h), Image.LANCZOS)
im.save('public/rymd-bakgrund.webp', 'WEBP', quality=82, method=6)
im.save('public/rymd-bakgrund.jpg', 'JPEG', quality=80, optimize=True, progressive=True)
"
```

| Fil | Används till |
|---|---|
| `rymdstation bakgrund.png` | Källa till `public/rymd-bakgrund.webp` och `.jpg` – startsidans bakgrund |
| `Teknikjakten bakgrund.png` | Oanvänd i appen. Sparad som alternativ. |
