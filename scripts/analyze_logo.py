from pathlib import Path
from PIL import Image

source = Path('/home/ubuntu/upload/logo_工作區域1.webp')
image = Image.open(source).convert('RGBA')
alpha = image.getchannel('A')
nontransparent = alpha.getbbox()
colors = image.convert('RGB').getcolors(maxcolors=10_000_000) or []
colors.sort(key=lambda item: item[0], reverse=True)
print({
    'size': image.size,
    'mode': image.mode,
    'alpha_extrema': alpha.getextrema(),
    'nontransparent_bbox': nontransparent,
    'dominant_colors': colors[:8],
})
