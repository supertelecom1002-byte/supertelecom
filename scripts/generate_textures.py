import os
import math
from PIL import Image, ImageDraw, ImageFont

def generate_screen_texture():
    W, H = 1024, 2048
    img = Image.new("RGBA", (W, H), (2, 6, 23, 255))
    draw = ImageDraw.Draw(img)

    # 1. Background gradient (Deep Midnight Cosmic Slate to Indigo)
    for y in range(H):
        t = y / H
        r = int(2 + 8 * math.sin(t * math.pi))
        g = int(6 + 22 * math.sin(t * math.pi))
        b = int(23 + 45 * math.sin(t * math.pi))
        draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

    # 2. Glowing circuit waves
    for i in range(16):
        y_base = 320 + i * 85
        color = (6, 182, 212, 55) if i % 2 == 0 else (59, 130, 246, 45)
        points = []
        for x in range(0, W + 20, 20):
            y = y_base + int(math.sin(x * 0.008 + i * 0.4) * 50)
            points.append((x, y))
        draw.line(points, fill=color, width=3)

    # 3. Dynamic Island (Top center pill)
    island_w, island_h = 320, 72
    ix0 = (W - island_w) // 2
    iy0 = 60
    draw.rounded_rectangle([ix0, iy0, ix0 + island_w, iy0 + island_h], radius=36, fill=(0, 0, 0, 255), outline=(30, 41, 59, 255), width=2)
    # Camera lens & sensor
    draw.ellipse([ix0 + 38, iy0 + 22, ix0 + 66, iy0 + 50], fill=(15, 23, 42, 255), outline=(56, 189, 248, 180), width=2)
    draw.ellipse([ix0 + 48, iy0 + 32, ix0 + 56, iy0 + 40], fill=(6, 182, 212, 255))
    # Face ID dot
    draw.ellipse([ix0 + island_w - 60, iy0 + 28, ix0 + island_w - 44, iy0 + 44], fill=(15, 23, 42, 255), outline=(16, 185, 129, 180), width=1)

    # 4. Status Bar
    # Time 09:41
    try:
        font_large = ImageFont.truetype("arialbd.ttf", 52)
        font_med = ImageFont.truetype("arial.ttf", 36)
        font_bold = ImageFont.truetype("arialbd.ttf", 36)
        font_small = ImageFont.truetype("arial.ttf", 26)
        font_badge = ImageFont.truetype("arialbd.ttf", 24)
    except:
        font_large = font_med = font_bold = font_small = font_badge = ImageFont.load_default()

    draw.text((70, 70), "09:41", fill=(255, 255, 255, 240), font=font_large)
    draw.text((W - 250, 76), "5G", fill=(255, 255, 255, 220), font=font_bold)
    
    # Battery icon (100%)
    bx0, by0 = W - 140, 78
    draw.rounded_rectangle([bx0, by0, bx0 + 64, by0 + 32], radius=6, outline=(255, 255, 255, 220), width=2)
    draw.rectangle([bx0 + 66, by0 + 8, bx0 + 70, by0 + 24], fill=(255, 255, 255, 180))
    draw.rounded_rectangle([bx0 + 4, by0 + 4, bx0 + 60, by0 + 28], radius=4, fill=(16, 185, 129, 255)) # Green battery

    # 5. Super Telecom Center Crest
    cx, cy = W // 2, 620
    # Ambient radial glow
    for r in range(240, 40, -10):
        alpha = int(25 * (1 - r / 240))
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(6, 182, 212, alpha), width=3)
    
    # Central shield crest
    shield_pts = [
        (cx, cy - 110),
        (cx + 90, cy - 60),
        (cx + 70, cy + 60),
        (cx, cy + 120),
        (cx - 70, cy + 60),
        (cx - 90, cy - 60)
    ]
    draw.polygon(shield_pts, fill=(15, 23, 42, 230), outline=(6, 182, 212, 255))
    draw.text((cx - 18, cy - 35), "⚡", fill=(6, 182, 212, 255), font=font_large)
    
    # Lab branding title
    draw.text((cx - 210, cy + 145), "SUPER TELECOM LAB", fill=(255, 255, 255, 255), font=font_bold)
    draw.text((cx - 165, cy + 195), "PRECISION HARDWARE ENGINE", fill=(6, 182, 212, 230), font=font_badge)

    # 6. Live Telemetry Widget Card
    card_x0, card_y0 = 80, 940
    card_w, card_h = W - 160, 310
    draw.rounded_rectangle([card_x0, card_y0, card_x0 + card_w, card_y0 + card_h], radius=28, fill=(15, 23, 42, 220), outline=(30, 41, 59, 255), width=2)
    
    # Card Header
    draw.text((card_x0 + 36, card_y0 + 30), "LAB BENCH TELEMETRY", fill=(148, 163, 184, 255), font=font_badge)
    draw.ellipse([card_x0 + card_w - 60, card_y0 + 32, card_x0 + card_w - 44, card_y0 + 48], fill=(16, 185, 129, 255)) # Green pulse
    draw.text((card_x0 + card_w - 130, card_y0 + 30), "LIVE", fill=(16, 185, 129, 255), font=font_badge)
    
    # Metric 1: Display
    draw.text((card_x0 + 36, card_y0 + 90), "AMOLED Panel", fill=(255, 255, 255, 240), font=font_med)
    draw.text((card_x0 + 36, card_y0 + 130), "120Hz LTPO · OCA Cleanroom Bonded", fill=(6, 182, 212, 240), font=font_small)

    # Metric 2: Double-Decker CPU
    draw.text((card_x0 + 36, card_y0 + 180), "Motherboard Logic", fill=(255, 255, 255, 240), font=font_med)
    draw.text((card_x0 + 36, card_y0 + 220), "0.02mm Micro-Jumper · 350°C BGA Verified", fill=(16, 185, 129, 240), font=font_small)

    # 7. Bottom App Grid (4 Flagship Icons)
    app_y = 1580
    apps = [
        {"name": "Recover", "icon": "♻️", "color": (16, 185, 129, 255)},
        {"name": "Transfer", "icon": "⚡", "color": (6, 182, 212, 255)},
        {"name": "Launcher", "icon": "🚀", "color": (168, 85, 247, 255)},
        {"name": "Diagnostics", "icon": "🛠️", "color": (245, 158, 11, 255)},
    ]
    slot_w = W // 4
    for idx, app in enumerate(apps):
        app_cx = idx * slot_w + slot_w // 2
        # Icon squircle background
        box_r = 58
        draw.rounded_rectangle(
            [app_cx - box_r, app_y - box_r, app_cx + box_r, app_y + box_r],
            radius=26,
            fill=(15, 23, 42, 240),
            outline=app["color"],
            width=2
        )
        draw.text((app_cx - 24, app_y - 32), app["icon"], fill=app["color"], font=font_large)
        draw.text((app_cx - len(app["name"]) * 8, app_y + box_r + 16), app["name"], fill=(255, 255, 255, 220), font=font_badge)

    # 8. Home Swipe Bar (White horizontal pill at bottom)
    bar_w, bar_h = 280, 10
    bx = (W - bar_w) // 2
    by = H - 50
    draw.rounded_rectangle([bx, by, bx + bar_w, by + bar_h], radius=5, fill=(255, 255, 255, 220))

    img.save("public/textures/smartphone_screen_display.png", "PNG")
    print("Generated public/textures/smartphone_screen_display.png successfully.")

def generate_back_texture():
    W, H = 1024, 2048
    img = Image.new("RGBA", (W, H), (15, 23, 42, 255))
    draw = ImageDraw.Draw(img)

    # Subtle AG frosted titanium gradient
    for y in range(H):
        t = y / H
        val = int(15 + 14 * math.sin(t * math.pi))
        draw.line([(0, y), (W, y)], fill=(val, val + 4, val + 12, 255))

    # Titanium grain micro-lines
    for x in range(0, W, 8):
        draw.line([(x, 0), (x, H)], fill=(255, 255, 255, 3), width=1)

    # Wireless Charging Qi2 Coil Guide Circle
    cx, cy = W // 2, H // 2 + 80
    draw.ellipse([cx - 220, cy - 220, cx + 220, cy + 220], outline=(255, 255, 255, 18), width=3)
    draw.ellipse([cx - 235, cy - 235, cx + 235, cy + 235], outline=(6, 182, 212, 25), width=1)

    try:
        font_title = ImageFont.truetype("arialbd.ttf", 46)
        font_sub = ImageFont.truetype("arial.ttf", 26)
        font_tiny = ImageFont.truetype("arial.ttf", 22)
    except:
        font_title = font_sub = font_tiny = ImageFont.load_default()

    # Laser-etched logo
    draw.text((cx - 175, H - 340), "SUPER TELECOM", fill=(255, 255, 255, 180), font=font_title)
    draw.text((cx - 190, H - 280), "DESIGNED BY SUPER TELECOM LAB", fill=(148, 163, 184, 150), font=font_sub)
    draw.text((cx - 145, H - 240), "GIRIDIH, JHARKHAND · 5G CE", fill=(100, 116, 139, 130), font=font_tiny)

    img.save("public/textures/smartphone_back_cover.png", "PNG")
    print("Generated public/textures/smartphone_back_cover.png successfully.")

if __name__ == "__main__":
    generate_screen_texture()
    generate_back_texture()
