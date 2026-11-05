import * as THREE from "three";

/**
 * Generates an ultra-high-definition (1024x2048) photorealistic flagship smartphone display texture.
 * Features:
 * - Dynamic Island with front camera lens and face-scanner sensors
 * - Sleek iOS/Android flagship status bar (09:41, 5G, Wi-Fi, 100% battery)
 * - Super Telecom Laboratory wallpaper with glowing cyan/emerald circuit traces
 * - Live lab diagnostic telemetry card
 * - High-tech holographic precision visualizer ring
 * - 4 Flagship App icons (Super Transfer, Super Recover, Super Launcher, Diagnostics)
 * - Home swipe indicator bar
 * - Strictly flipY = false for glTF 2.0 texture alignment
 */
export function createSmartphoneScreenTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const width = 1024;
  const height = 2048;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // 1. Deep Midnight Cosmic Black Base
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, "#020617");
  bgGrad.addColorStop(0.25, "#040d21");
  bgGrad.addColorStop(0.55, "#03142e");
  bgGrad.addColorStop(0.85, "#06132b");
  bgGrad.addColorStop(1, "#020617");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. High-Tech Cybernetic Circuit Wave Background
  ctx.save();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "rgba(6, 182, 212, 0.22)";
  for (let i = 0; i < 20; i++) {
    const y = 280 + i * 80;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(
      width * 0.35,
      y + Math.sin(i * 0.45) * 75,
      width * 0.65,
      y - Math.cos(i * 0.45) * 85,
      width,
      y + 35
    );
    ctx.stroke();
  }
  ctx.restore();

  // Glowing circuit grid dots
  ctx.fillStyle = "rgba(16, 185, 129, 0.35)";
  for (let x = 60; x < width; x += 90) {
    for (let y = 350; y < height - 350; y += 90) {
      if ((x + y) % 180 === 0) {
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // 3. Central Ambient Glowing Hologram (Super Telecom Lab Crest)
  const crestGrad = ctx.createRadialGradient(
    width / 2,
    height * 0.45,
    30,
    width / 2,
    height * 0.45,
    420
  );
  crestGrad.addColorStop(0, "rgba(6, 182, 212, 0.35)");
  crestGrad.addColorStop(0.5, "rgba(16, 185, 129, 0.15)");
  crestGrad.addColorStop(1, "transparent");
  ctx.fillStyle = crestGrad;
  ctx.fillRect(0, height * 0.2, width, height * 0.5);

  // 4. Top Status Bar (Apple / Android Flagship Telemetry)
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 56px -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("09:41", 85, 125);

  // Status Bar Right: 5G, Wi-Fi, 100% Battery
  ctx.textAlign = "right";
  ctx.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Inter', monospace";
  ctx.fillText("5G", width - 250, 123);

  // Wi-Fi 3-bar arcs
  ctx.save();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(width - 210, 127, 20, Math.PI * 1.2, Math.PI * 1.8);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(width - 210, 127, 12, Math.PI * 1.2, Math.PI * 1.8);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(width - 210, 127, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.restore();

  // Battery Outline + 100% Green Fill + Bolt
  const batX = width - 145;
  const batY = 88;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
  ctx.lineWidth = 4;
  ctx.strokeRect(batX, batY, 68, 36);
  ctx.fillRect(batX + 68, batY + 11, 5, 14); // Battery tip
  ctx.fillStyle = "#10b981"; // 100% Emerald Green
  ctx.fillRect(batX + 5, batY + 5, 58, 26);

  // 5. Dynamic Island / Punch Hole (Top Center)
  const pillW = 240;
  const pillH = 68;
  const pillX = (width - pillW) / 2;
  const pillY = 80;
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, 34);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Camera lens reflections inside Dynamic Island
  ctx.fillStyle = "#0a192f";
  ctx.beginPath();
  ctx.arc(pillX + 52, pillY + 34, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#00f0ff";
  ctx.beginPath();
  ctx.arc(pillX + 50, pillY + 32, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#022c22";
  ctx.beginPath();
  ctx.arc(pillX + pillW - 52, pillY + 34, 12, 0, Math.PI * 2);
  ctx.fill();

  // 6. Super Telecom Lab Diagnostic Telemetry Widget Card (Upper Mid-Screen)
  const cardW = 870;
  const cardH = 490;
  const cardX = (width - cardW) / 2;
  const cardY = 220;

  ctx.save();
  ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 44);
  ctx.fill();
  ctx.strokeStyle = "rgba(6, 182, 212, 0.45)";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Card Header Tag
  ctx.fillStyle = "rgba(6, 182, 212, 0.22)";
  ctx.beginPath();
  ctx.roundRect(cardX + 40, cardY + 38, 330, 52, 26);
  ctx.fill();
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 26px monospace";
  ctx.textAlign = "left";
  ctx.fillText("● LAB BENCH ACTIVE", cardX + 65, cardY + 73);

  // Branding Title
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 64px -apple-system, BlinkMacSystemFont, 'Inter', sans-serif";
  ctx.fillText("SUPER TELECOM", cardX + 40, cardY + 170);

  ctx.fillStyle = "#06b6d4";
  ctx.font = "bold 34px -apple-system, BlinkMacSystemFont, 'Inter', sans-serif";
  ctx.fillText("BARGANDA ROAD CHIP-LEVEL LAB", cardX + 40, cardY + 220);

  // Divider Line
  ctx.strokeStyle = "rgba(51, 65, 85, 0.8)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cardX + 40, cardY + 260);
  ctx.lineTo(cardX + cardW - 40, cardY + 260);
  ctx.stroke();

  // Diagnostic Readout Metrics
  const metrics = [
    { label: "AMOLED REFRESH", val: "120Hz LTPO", col: "#38bdf8" },
    { label: "LOGIC PMIC BENCH", val: "350°C BGA", col: "#10b981" },
    { label: "DISPLAY MATRIX", val: "OCA VACUUM", col: "#f59e0b" },
  ];
  metrics.forEach((m, idx) => {
    const mx = cardX + 40 + idx * 270;
    const my = cardY + 325;
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 22px monospace";
    ctx.fillText(m.label, mx, my);
    ctx.fillStyle = m.col;
    ctx.font = "900 36px monospace";
    ctx.fillText(m.val, mx, my + 50);
  });
  ctx.restore();

  // 7. Middle Screen Diagnostic Holographic Visualizer Ring
  const ringX = width / 2;
  const ringY = height * 0.53;
  ctx.save();
  ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
  ctx.lineWidth = 4;
  ctx.setLineDash([16, 12]);
  ctx.beginPath();
  ctx.arc(ringX, ringY, 170, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(16, 185, 129, 0.6)";
  ctx.lineWidth = 6;
  ctx.setLineDash([32, 24]);
  ctx.beginPath();
  ctx.arc(ringX, ringY, 120, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Center Chip Icon
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "bold 30px monospace";
  ctx.fillText("0.02mm JUMPER", ringX, ringY - 12);
  ctx.fillStyle = "#10b981";
  ctx.font = "900 38px monospace";
  ctx.fillText("READY", ringX, ringY + 35);
  ctx.restore();

  // 8. Bottom App Grid (4 Flagship Super Telecom Suite Apps)
  const dockW = 880;
  const dockH = 200;
  const dockX = (width - dockW) / 2;
  const dockY = height - 370;

  ctx.save();
  ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
  ctx.beginPath();
  ctx.roundRect(dockX, dockY, dockW, dockH, 54);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  const apps = [
    { label: "Transfer", bg: "#0284c7", icon: "⚡" },
    { label: "Recover", bg: "#7c3aed", icon: "🛡️" },
    { label: "Launcher", bg: "#059669", icon: "🚀" },
    { label: "Consult", bg: "#d97706", icon: "🔧" },
  ];

  apps.forEach((app, idx) => {
    const ax = dockX + 50 + idx * 205;
    const ay = dockY + 28;
    const aSize = 110;

    // App Icon Squircle
    ctx.fillStyle = app.bg;
    ctx.beginPath();
    ctx.roundRect(ax, ay, aSize, aSize, 28);
    ctx.fill();

    // Icon emoji/symbol
    ctx.font = "52px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(app.icon, ax + aSize / 2, ay + 72);

    // Label below
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "bold 20px -apple-system, sans-serif";
    ctx.fillText(app.label, ax + aSize / 2, ay + 135);
  });
  ctx.restore();

  // 9. Home Swipe Indicator Bar (Bottom Center)
  ctx.fillStyle = "rgba(255, 255, 255, 0.80)";
  ctx.beginPath();
  ctx.roundRect((width - 320) / 2, height - 70, 320, 10, 5);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = false; // MUST be false for correct GLTF 2.0 UV alignment!
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates an ultra-premium matte frosted AG back cover texture with
 * precision laser-etched Super Telecom Lab branding and specs.
 */
export function createSmartphoneBackTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const width = 1024;
  const height = 2048;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Deep Cosmic Titanium / Midnight Slate Matte Finish
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, "#0b1222");
  bgGrad.addColorStop(0.5, "#0f172a");
  bgGrad.addColorStop(1, "#070c18");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle frosted glass micro-noise
  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  for (let x = 0; x < width; x += 16) {
    for (let y = 0; y < height; y += 16) {
      if ((x * 13 + y * 7) % 5 === 0) {
        ctx.fillRect(x, y, 4, 4);
      }
    }
  }

  // Camera Island Plateau Outline at Top-Left
  ctx.fillStyle = "rgba(30, 41, 59, 0.6)";
  ctx.beginPath();
  ctx.roundRect(80, 140, 460, 560, 70);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Subtle Center Laser-Etched Emblem
  const midX = width / 2;
  const midY = height * 0.52;

  ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(midX, midY, 90, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 48px -apple-system, BlinkMacSystemFont, 'Inter', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("ST", midX, midY + 16);

  // Bottom Laser Engraving
  ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
  ctx.font = "bold 24px monospace";
  ctx.fillText("SUPER TELECOM • FLAGSHIP CHIP-LEVEL LAB", midX, height - 220);
  ctx.font = "18px monospace";
  ctx.fillText("BARGANDA ROAD, GIRIDIH, JHARKHAND • MODEL ST-PRO", midX, height - 180);

  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = false; // MUST be false for correct GLTF 2.0 UV alignment!
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}
