import os
from PIL import Image, ImageDraw

res_dir = os.path.abspath(r"app\src\main\res")
src_icon_path = os.path.abspath(r"public\icon-512.png")
src_logo_path = os.path.abspath(r"public\super-telecom-logo.png")
src_hero_path = os.path.abspath(r"src\assets\hero-repair.jpg")

print(f"Loading {src_icon_path}...")
src_icon = Image.open(src_icon_path).convert("RGBA")

# 1. Standard Mipmap densities
densities = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

for folder, size in densities.items():
    out_dir = os.path.join(res_dir, folder)
    os.makedirs(out_dir, exist_ok=True)
    
    # Standard square icon
    icon_resized = src_icon.resize((size, size), Image.Resampling.LANCZOS)
    icon_resized.save(os.path.join(out_dir, "ic_launcher.png"), "PNG")
    
    # Round icon with circular mask
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size, size), fill=255)
    round_icon = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    round_icon.paste(icon_resized, (0, 0), mask=mask)
    round_icon.save(os.path.join(out_dir, "ic_launcher_round.png"), "PNG")
    print(f"Generated {folder}/ic_launcher.png and ic_launcher_round.png ({size}x{size})")

# 2. Foreground for adaptive icons (108dp canvas with ~74dp centered icon)
fg_densities = {
    "drawable-mdpi": 108,
    "drawable-hdpi": 162,
    "drawable-xhdpi": 216,
    "drawable-xxhdpi": 324,
    "drawable-xxxhdpi": 432,
}

for folder, canvas_size in fg_densities.items():
    out_dir = os.path.join(res_dir, folder)
    os.makedirs(out_dir, exist_ok=True)
    
    icon_size = int(canvas_size * 0.72)
    offset = (canvas_size - icon_size) // 2
    
    fg_canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    fg_icon = src_icon.resize((icon_size, icon_size), Image.Resampling.LANCZOS)
    fg_canvas.paste(fg_icon, (offset, offset), mask=fg_icon)
    fg_canvas.save(os.path.join(out_dir, "ic_launcher_foreground.png"), "PNG")
    print(f"Generated {folder}/ic_launcher_foreground.png ({canvas_size}x{canvas_size})")

# 3. In-app drawables
drawable_dir = os.path.join(res_dir, "drawable")
os.makedirs(drawable_dir, exist_ok=True)

# Copy/save app icon
src_icon.save(os.path.join(drawable_dir, "super_telecom_icon.png"), "PNG")
print("Saved drawable/super_telecom_icon.png")

# Copy/save full logo
src_logo = Image.open(src_logo_path)
src_logo.save(os.path.join(drawable_dir, "super_telecom_logo.png"), "PNG")
print("Saved drawable/super_telecom_logo.png")

# Copy/save hero lab repair image
src_hero = Image.open(src_hero_path)
src_hero.save(os.path.join(drawable_dir, "hero_repair.jpg"), "JPEG", quality=90)
print("Saved drawable/hero_repair.jpg")

print("SUCCESS: All branding & designer assets successfully placed in app/src/main/res!")
