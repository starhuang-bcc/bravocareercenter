from pathlib import Path
from PIL import Image

source = Path('/home/ubuntu/upload/logo_工作區域1.webp')
output = Path('/home/ubuntu/webdev-static-assets/bravo-logo-icon.webp')
image = Image.open(source).convert('RGBA')
alpha = image.getchannel('A')
bbox = alpha.getbbox()
if bbox is None:
    raise RuntimeError('Logo contains no visible pixels')

cropped = image.crop(bbox)
# Keep transparent pixels and use a compact canvas for consistent object-contain rendering.
cropped.save(output, 'WEBP', lossless=True, method=6)
print({'output': str(output), 'source_size': image.size, 'crop_box': bbox, 'output_size': cropped.size})
