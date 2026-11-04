import json
import struct
import math
import os

def create_box(w, h, d, ox=0, oy=0, oz=0):
    hw, hh, hd = w / 2.0, h / 2.0, d / 2.0
    # 6 faces: +Z, -Z, +X, -X, +Y, -Y
    # each face has 4 vertices
    positions = [
        # +Z (Front)
        ox - hw, oy - hh, oz + hd,
        ox + hw, oy - hh, oz + hd,
        ox + hw, oy + hh, oz + hd,
        ox - hw, oy + hh, oz + hd,
        # -Z (Back)
        ox + hw, oy - hh, oz - hd,
        ox - hw, oy - hh, oz - hd,
        ox - hw, oy + hh, oz - hd,
        ox + hw, oy + hh, oz - hd,
        # +X (Right)
        ox + hw, oy - hh, oz + hd,
        ox + hw, oy - hh, oz - hd,
        ox + hw, oy + hh, oz - hd,
        ox + hw, oy + hh, oz + hd,
        # -X (Left)
        ox - hw, oy - hh, oz - hd,
        ox - hw, oy - hh, oz + hd,
        ox - hw, oy + hh, oz + hd,
        ox - hw, oy + hh, oz - hd,
        # +Y (Top)
        ox - hw, oy + hh, oz + hd,
        ox + hw, oy + hh, oz + hd,
        ox + hw, oy + hh, oz - hd,
        ox - hw, oy + hh, oz - hd,
        # -Y (Bottom)
        ox - hw, oy - hh, oz - hd,
        ox + hw, oy - hh, oz - hd,
        ox + hw, oy - hh, oz + hd,
        ox - hw, oy - hh, oz + hd,
    ]
    normals = [
        # +Z
        0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
        # -Z
        0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
        # +X
        1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
        # -X
        -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
        # +Y
        0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
        # -Y
        0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
    ]
    uvs = [
        0, 0, 1, 0, 1, 1, 0, 1,
        0, 0, 1, 0, 1, 1, 0, 1,
        0, 0, 1, 0, 1, 1, 0, 1,
        0, 0, 1, 0, 1, 1, 0, 1,
        0, 0, 1, 0, 1, 1, 0, 1,
        0, 0, 1, 0, 1, 1, 0, 1,
    ]
    indices = []
    for f in range(6):
        b = f * 4
        indices.extend([b, b + 1, b + 2, b, b + 2, b + 3])
    return positions, normals, uvs, indices

def create_cylinder(radius, height, segments=24, ox=0, oy=0, oz=0, axis='z'):
    positions = []
    normals = []
    uvs = []
    indices = []
    
    half_h = height / 2.0
    
    # Bottom circle center
    # Top circle center
    # We will build tube + top cap + bottom cap
    tube_start = len(positions) // 3
    for s in range(segments + 1):
        angle = 2.0 * math.pi * s / segments
        c = math.cos(angle)
        s_val = math.sin(angle)
        u = s / segments
        
        if axis == 'z':
            # Tube around Z axis: X, Y in circle, Z from -half_h to +half_h
            # Bottom vertex
            positions.extend([ox + radius * c, oy + radius * s_val, oz - half_h])
            normals.extend([c, s_val, 0])
            uvs.extend([u, 0])
            # Top vertex
            positions.extend([ox + radius * c, oy + radius * s_val, oz + half_h])
            normals.extend([c, s_val, 0])
            uvs.extend([u, 1])
        elif axis == 'y':
            # Tube around Y axis
            positions.extend([ox + radius * c, oy - half_h, oz + radius * s_val])
            normals.extend([c, 0, s_val])
            uvs.extend([u, 0])
            positions.extend([ox + radius * c, oy + half_h, oz + radius * s_val])
            normals.extend([c, 0, s_val])
            uvs.extend([u, 1])
        else: # axis == 'x'
            positions.extend([ox - half_h, oy + radius * c, oz + radius * s_val])
            normals.extend([0, c, s_val])
            uvs.extend([u, 0])
            positions.extend([ox + half_h, oy + radius * c, oz + radius * s_val])
            normals.extend([0, c, s_val])
            uvs.extend([u, 1])
            
    for s in range(segments):
        b = tube_start + s * 2
        indices.extend([b, b + 1, b + 2, b + 1, b + 3, b + 2])
        
    # Top cap
    cap_top_center = len(positions) // 3
    if axis == 'z':
        positions.extend([ox, oy, oz + half_h])
        normals.extend([0, 0, 1])
    elif axis == 'y':
        positions.extend([ox, oy + half_h, oz])
        normals.extend([0, 1, 0])
    else:
        positions.extend([ox + half_h, oy, oz])
        normals.extend([1, 0, 0])
    uvs.extend([0.5, 0.5])
    
    cap_top_ring = len(positions) // 3
    for s in range(segments + 1):
        angle = 2.0 * math.pi * s / segments
        c = math.cos(angle)
        s_val = math.sin(angle)
        if axis == 'z':
            positions.extend([ox + radius * c, oy + radius * s_val, oz + half_h])
            normals.extend([0, 0, 1])
        elif axis == 'y':
            positions.extend([ox + radius * c, oy + half_h, oz + radius * s_val])
            normals.extend([0, 1, 0])
        else:
            positions.extend([ox + half_h, oy + radius * c, oz + radius * s_val])
            normals.extend([1, 0, 0])
        uvs.extend([0.5 + 0.5 * c, 0.5 + 0.5 * s_val])
        
    for s in range(segments):
        indices.extend([cap_top_center, cap_top_ring + s, cap_top_ring + s + 1])
        
    # Bottom cap
    cap_bot_center = len(positions) // 3
    if axis == 'z':
        positions.extend([ox, oy, oz - half_h])
        normals.extend([0, 0, -1])
    elif axis == 'y':
        positions.extend([ox, oy - half_h, oz])
        normals.extend([0, -1, 0])
    else:
        positions.extend([ox - half_h, oy, oz])
        normals.extend([-1, 0, 0])
    uvs.extend([0.5, 0.5])
    
    cap_bot_ring = len(positions) // 3
    for s in range(segments + 1):
        angle = 2.0 * math.pi * s / segments
        c = math.cos(angle)
        s_val = math.sin(angle)
        if axis == 'z':
            positions.extend([ox + radius * c, oy + radius * s_val, oz - half_h])
            normals.extend([0, 0, -1])
        elif axis == 'y':
            positions.extend([ox + radius * c, oy - half_h, oz + radius * s_val])
            normals.extend([0, -1, 0])
        else:
            positions.extend([ox - half_h, oy + radius * c, oz + radius * s_val])
            normals.extend([-1, 0, 0])
        uvs.extend([0.5 + 0.5 * c, 0.5 + 0.5 * s_val])
        
    for s in range(segments):
        indices.extend([cap_bot_center, cap_bot_ring + s + 1, cap_bot_ring + s])
        
    return positions, normals, uvs, indices

def merge_geometries(geoms):
    pos_all, norm_all, uvs_all, ind_all = [], [], [], []
    v_offset = 0
    for pos, norm, uv, ind in geoms:
        pos_all.extend(pos)
        norm_all.extend(norm)
        uvs_all.extend(uv)
        for i in ind:
            ind_all.append(i + v_offset)
        v_offset += len(pos) // 3
    return pos_all, norm_all, uvs_all, ind_all

def create_torus(r_ring, r_tube, ring_segs=24, tube_segs=12, ox=0, oy=0, oz=0):
    positions, normals, uvs, indices = [], [], [], []
    for i in range(ring_segs):
        u = 2.0 * math.pi * i / ring_segs
        cu = math.cos(u)
        su = math.sin(u)
        for j in range(tube_segs):
            v = 2.0 * math.pi * j / tube_segs
            cv = math.cos(v)
            sv = math.sin(v)
            
            x = ox + (r_ring + r_tube * cv) * cu
            y = oy + (r_ring + r_tube * cv) * su
            z = oz + r_tube * sv
            
            nx = cv * cu
            ny = cv * su
            nz = sv
            
            positions.extend([x, y, z])
            normals.extend([nx, ny, nz])
            uvs.extend([i / ring_segs, j / tube_segs])
            
            next_i = (i + 1) % ring_segs
            next_j = (j + 1) % tube_segs
            
            idx0 = i * tube_segs + j
            idx1 = next_i * tube_segs + j
            idx2 = next_i * tube_segs + next_j
            idx3 = i * tube_segs + next_j
            indices.extend([idx0, idx1, idx2, idx0, idx2, idx3])
    return positions, normals, uvs, indices

def build_gltf_binary(node_definitions, output_path):
    binary_data = bytearray()
    buffer_views = []
    accessors = []
    meshes = []
    nodes = []
    materials = []
    
    mat_map = {}
    
    for item in node_definitions:
        name = item["name"]
        color = item["color"]
        metallic = item.get("metallic", 0.1)
        roughness = item.get("roughness", 0.5)
        transmission = item.get("transmission", 0.0)
        opacity = item.get("opacity", 1.0)
        alpha_mode = "BLEND" if opacity < 0.99 else "OPAQUE"
        
        mat_key = (tuple(color), metallic, roughness, opacity, alpha_mode)
        if mat_key not in mat_map:
            mat_idx = len(materials)
            pbr = {
                "baseColorFactor": [color[0], color[1], color[2], opacity],
                "metallicFactor": metallic,
                "roughnessFactor": roughness
            }
            mat_entry = {
                "name": f"Mat_{name}",
                "pbrMetallicRoughness": pbr,
                "alphaMode": alpha_mode,
                "doubleSided": True
            }
            materials.append(mat_entry)
            mat_map[mat_key] = mat_idx
        material_index = mat_map[mat_key]
        
        pos = item["positions"]
        norm = item["normals"]
        uvs = item["uvs"]
        indices = item["indices"]
        
        # 1. Position bufferView & accessor
        pos_bytes = struct.pack(f"<{len(pos)}f", *pos)
        pos_offset = len(binary_data)
        binary_data.extend(pos_bytes)
        # Pad to 4 bytes
        while len(binary_data) % 4 != 0:
            binary_data.append(0)
            
        pos_bv_idx = len(buffer_views)
        buffer_views.append({
            "buffer": 0,
            "byteOffset": pos_offset,
            "byteLength": len(pos_bytes),
            "target": 34962 # ARRAY_BUFFER
        })
        
        # Min/Max for positions
        x_coords = pos[0::3]
        y_coords = pos[1::3]
        z_coords = pos[2::3]
        pos_min = [min(x_coords), min(y_coords), min(z_coords)]
        pos_max = [max(x_coords), max(y_coords), max(z_coords)]
        
        pos_acc_idx = len(accessors)
        accessors.append({
            "bufferView": pos_bv_idx,
            "byteOffset": 0,
            "componentType": 5126, # FLOAT
            "count": len(pos) // 3,
            "type": "VEC3",
            "min": pos_min,
            "max": pos_max
        })
        
        # 2. Normal bufferView & accessor
        norm_bytes = struct.pack(f"<{len(norm)}f", *norm)
        norm_offset = len(binary_data)
        binary_data.extend(norm_bytes)
        while len(binary_data) % 4 != 0:
            binary_data.append(0)
            
        norm_bv_idx = len(buffer_views)
        buffer_views.append({
            "buffer": 0,
            "byteOffset": norm_offset,
            "byteLength": len(norm_bytes),
            "target": 34962
        })
        norm_acc_idx = len(accessors)
        accessors.append({
            "bufferView": norm_bv_idx,
            "byteOffset": 0,
            "componentType": 5126,
            "count": len(norm) // 3,
            "type": "VEC3"
        })
        
        # 3. UV bufferView & accessor
        uv_bytes = struct.pack(f"<{len(uvs)}f", *uvs)
        uv_offset = len(binary_data)
        binary_data.extend(uv_bytes)
        while len(binary_data) % 4 != 0:
            binary_data.append(0)
            
        uv_bv_idx = len(buffer_views)
        buffer_views.append({
            "buffer": 0,
            "byteOffset": uv_offset,
            "byteLength": len(uv_bytes),
            "target": 34962
        })
        uv_acc_idx = len(accessors)
        accessors.append({
            "bufferView": uv_bv_idx,
            "byteOffset": 0,
            "componentType": 5126,
            "count": len(uvs) // 2,
            "type": "VEC2"
        })
        
        # 4. Indices bufferView & accessor
        # Check if unsigned short is enough (< 65535)
        max_idx = max(indices) if indices else 0
        use_uint = max_idx > 65535
        if use_uint:
            ind_bytes = struct.pack(f"<{len(indices)}I", *indices)
            comp_type = 5125 # UNSIGNED_INT
        else:
            ind_bytes = struct.pack(f"<{len(indices)}H", *indices)
            comp_type = 5123 # UNSIGNED_SHORT
            
        ind_offset = len(binary_data)
        binary_data.extend(ind_bytes)
        while len(binary_data) % 4 != 0:
            binary_data.append(0)
            
        ind_bv_idx = len(buffer_views)
        buffer_views.append({
            "buffer": 0,
            "byteOffset": ind_offset,
            "byteLength": len(ind_bytes),
            "target": 34963 # ELEMENT_ARRAY_BUFFER
        })
        ind_acc_idx = len(accessors)
        accessors.append({
            "bufferView": ind_bv_idx,
            "byteOffset": 0,
            "componentType": comp_type,
            "count": len(indices),
            "type": "SCALAR"
        })
        
        # Mesh
        mesh_idx = len(meshes)
        meshes.append({
            "name": f"Mesh_{name}",
            "primitives": [{
                "attributes": {
                    "POSITION": pos_acc_idx,
                    "NORMAL": norm_acc_idx,
                    "TEXCOORD_0": uv_acc_idx
                },
                "indices": ind_acc_idx,
                "material": material_index
            }]
        })
        
        # Node
        node_idx = len(nodes)
        node_entry = {
            "name": name,
            "mesh": mesh_idx
        }
        if "translation" in item:
            node_entry["translation"] = item["translation"]
        nodes.append(node_entry)
        
    gltf_json = {
        "asset": {
            "version": "2.0",
            "generator": "SuperTelecom Smartphone 3D Engineering Generator v2.8.0"
        },
        "scene": 0,
        "scenes": [{
            "name": "SmartphoneScene",
            "nodes": list(range(len(nodes)))
        }],
        "nodes": nodes,
        "meshes": meshes,
        "materials": materials,
        "accessors": accessors,
        "bufferViews": buffer_views,
        "buffers": [{
            "byteLength": len(binary_data)
        }]
    }
    
    json_bytes = json.dumps(gltf_json, separators=(',', ':')).encode('utf-8')
    # Pad JSON to 4-byte alignment with space (0x20)
    while len(json_bytes) % 4 != 0:
        json_bytes += b' '
        
    # Header: 12 bytes
    # Chunk 0 (JSON): 8 bytes header + json_bytes
    # Chunk 1 (BIN): 8 bytes header + binary_data
    total_len = 12 + 8 + len(json_bytes) + 8 + len(binary_data)
    
    glb = bytearray()
    # 12-byte header
    glb.extend(struct.pack("<4sII", b"glTF", 2, total_len))
    
    # Chunk 0
    glb.extend(struct.pack("<II", len(json_bytes), 0x4E4F534A)) # JSON
    glb.extend(json_bytes)
    
    # Chunk 1
    glb.extend(struct.pack("<II", len(binary_data), 0x004E4942)) # BIN
    glb.extend(binary_data)
    
    with open(output_path, "wb") as f:
        f.write(glb)
        
    print(f"Successfully generated {output_path} ({len(glb)} bytes, {len(nodes)} nodes, {len(materials)} materials)")

def main():
    W, H, D = 2.8, 5.8, 0.32 # Dimensions: 72mm x 150mm x 8.2mm scaled to Three.js units
    
    nodes = []
    
    # 1. FrontGlass (Front crystal cover with rounded bevel edges)
    # Z ~ +0.165
    fg_g = create_box(W * 0.98, H * 0.98, 0.02, ox=0, oy=0, oz=0.165)
    nodes.append({
        "name": "FrontGlass",
        "positions": fg_g[0], "normals": fg_g[1], "uvs": fg_g[2], "indices": fg_g[3],
        "color": [0.75, 0.90, 1.0], "metallic": 0.1, "roughness": 0.05, "opacity": 0.45
    })
    
    # 2. TouchDigitizer (Capacitive grid matrix)
    # Z ~ +0.155
    td_g = create_box(W * 0.96, H * 0.96, 0.005, ox=0, oy=0, oz=0.155)
    nodes.append({
        "name": "TouchDigitizer",
        "positions": td_g[0], "normals": td_g[1], "uvs": td_g[2], "indices": td_g[3],
        "color": [0.0, 0.8, 0.9], "metallic": 0.4, "roughness": 0.3, "opacity": 0.3
    })
    
    # 3. OLEDDisplay (120Hz AMOLED Panel)
    # Z ~ +0.145
    oled_g = create_box(W * 0.95, H * 0.95, 0.015, ox=0, oy=0, oz=0.145)
    nodes.append({
        "name": "OLEDDisplay",
        "positions": oled_g[0], "normals": oled_g[1], "uvs": oled_g[2], "indices": oled_g[3],
        "color": [0.01, 0.02, 0.04], "metallic": 0.2, "roughness": 0.15, "opacity": 1.0
    })
    
    # 4. ChassisFrame (Anodized aerospace titanium/aluminum perimeter frame with internal ribs)
    # Middle frame at Z ~ 0.0
    # Outer frame + cross brackets
    f_parts = [
        # Left rail
        create_box(0.12, H, D, ox=-W/2 + 0.06, oy=0, oz=0),
        # Right rail
        create_box(0.12, H, D, ox=W/2 - 0.06, oy=0, oz=0),
        # Top rail
        create_box(W - 0.24, 0.12, D, ox=0, oy=H/2 - 0.06, oz=0),
        # Bottom rail
        create_box(W - 0.24, 0.12, D, ox=0, oy=-H/2 + 0.06, oz=0),
        # Midplate mid deck
        create_box(W - 0.30, H - 0.30, 0.04, ox=0, oy=0, oz=0),
    ]
    cf_g = merge_geometries(f_parts)
    nodes.append({
        "name": "ChassisFrame",
        "positions": cf_g[0], "normals": cf_g[1], "uvs": cf_g[2], "indices": cf_g[3],
        "color": [0.78, 0.80, 0.84], "metallic": 0.85, "roughness": 0.25, "opacity": 1.0
    })
    
    # 5. RearCover (Matte AG frosted glass rear panel with camera plateau)
    # Z ~ -0.165
    rc_parts = [
        # Main back panel
        create_box(W * 0.98, H * 0.98, 0.02, ox=0, oy=0, oz=-0.165),
        # Camera island plateau (top-left)
        create_box(1.0, 1.25, 0.04, ox=-W/2 + 0.65, oy=H/2 - 0.80, oz=-0.185),
    ]
    rc_g = merge_geometries(rc_parts)
    nodes.append({
        "name": "RearCover",
        "positions": rc_g[0], "normals": rc_g[1], "uvs": rc_g[2], "indices": rc_g[3],
        "color": [0.08, 0.11, 0.16], "metallic": 0.2, "roughness": 0.35, "opacity": 0.96
    })
    
    # 6. Battery (5,000mAh High-Density Li-Ion Pack with safety wrap and BMS tab)
    # Located in lower-middle right/center
    # ox=0.15, oy=-0.45, oz=-0.04, w=1.35, h=2.5, d=0.12
    bat_parts = [
        create_box(1.35, 2.50, 0.12, ox=0.15, oy=-0.45, oz=-0.04),
        # BMS ribbon connector
        create_box(0.20, 0.40, 0.02, ox=-0.40, oy=0.75, oz=-0.02),
        create_box(0.25, 0.10, 0.03, ox=-0.40, oy=0.92, oz=-0.01),
    ]
    bat_g = merge_geometries(bat_parts)
    nodes.append({
        "name": "Battery",
        "positions": bat_g[0], "normals": bat_g[1], "uvs": bat_g[2], "indices": bat_g[3],
        "color": [0.12, 0.13, 0.15], "metallic": 0.3, "roughness": 0.4, "opacity": 1.0
    })
    
    # 7. Motherboard (High-density multi-layer main logic board PCB)
    # Upper region: ox=0, oy=1.45, oz=-0.03, w=2.4, h=1.6, d=0.035
    mb_parts = [
        create_box(2.35, 1.55, 0.035, ox=0, oy=1.45, oz=-0.03),
        # Gold edge fingers and interconnect contacts
        create_box(0.4, 0.08, 0.045, ox=0.8, oy=0.72, oz=-0.03),
        create_box(0.4, 0.08, 0.045, ox=-0.8, oy=0.72, oz=-0.03),
    ]
    mb_g = merge_geometries(mb_parts)
    nodes.append({
        "name": "Motherboard",
        "positions": mb_g[0], "normals": mb_g[1], "uvs": mb_g[2], "indices": mb_g[3],
        "color": [0.03, 0.24, 0.14], "metallic": 0.25, "roughness": 0.5, "opacity": 1.0
    })
    
    # 8. ShieldCover (Perforated Nickel-Plated EMI/RF Shielding Can)
    # Above motherboard components: ox=0.35, oy=1.45, oz=-0.07, w=1.2, h=1.2, d=0.05
    shield_g = create_box(1.25, 1.25, 0.05, ox=0.35, oy=1.45, oz=-0.07)
    nodes.append({
        "name": "ShieldCover",
        "positions": shield_g[0], "normals": shield_g[1], "uvs": shield_g[2], "indices": shield_g[3],
        "color": [0.72, 0.74, 0.77], "metallic": 0.95, "roughness": 0.2, "opacity": 1.0
    })
    
    # 9. ProcessorSoC (Flagship Octa-Core Application Processor Silicon Die)
    # Under shield: ox=0.35, oy=1.45, oz=-0.045, w=0.55, h=0.55, d=0.02
    soc_g = create_box(0.55, 0.55, 0.02, ox=0.35, oy=1.45, oz=-0.045)
    nodes.append({
        "name": "ProcessorSoC",
        "positions": soc_g[0], "normals": soc_g[1], "uvs": soc_g[2], "indices": soc_g[3],
        "color": [0.18, 0.18, 0.20], "metallic": 0.6, "roughness": 0.3, "opacity": 1.0
    })
    
    # 10. PMIC (Power Management IC)
    # Near SoC: ox=0.35, oy=1.05, oz=-0.045, w=0.32, h=0.32, d=0.02
    pmic_g = create_box(0.32, 0.32, 0.02, ox=0.35, oy=1.05, oz=-0.045)
    nodes.append({
        "name": "PMIC",
        "positions": pmic_g[0], "normals": pmic_g[1], "uvs": pmic_g[2], "indices": pmic_g[3],
        "color": [0.10, 0.10, 0.12], "metallic": 0.7, "roughness": 0.25, "opacity": 1.0
    })
    
    # 11. RearCameraModule (Triple OIS Periscope Camera Block with metal housing & lenses)
    # Top left: ox=-0.70, oy=1.55, oz=-0.08
    cam_parts = [
        # Main housing
        create_box(0.85, 1.15, 0.14, ox=-0.70, oy=1.55, oz=-0.08),
        # Lens 1 (Main Wide 50MP)
        create_cylinder(0.18, 0.06, segments=20, ox=-0.70, oy=1.85, oz=-0.16, axis='z'),
        # Lens 2 (Ultra-wide 48MP)
        create_cylinder(0.16, 0.06, segments=20, ox=-0.70, oy=1.45, oz=-0.16, axis='z'),
        # Lens 3 (Periscope Telephoto)
        create_cylinder(0.15, 0.06, segments=20, ox=-0.70, oy=1.08, oz=-0.16, axis='z'),
        # Dual-tone LED Flash
        create_box(0.12, 0.20, 0.03, ox=-0.35, oy=1.70, oz=-0.15),
    ]
    cam_g = merge_geometries(cam_parts)
    nodes.append({
        "name": "RearCameraModule",
        "positions": cam_g[0], "normals": cam_g[1], "uvs": cam_g[2], "indices": cam_g[3],
        "color": [0.05, 0.05, 0.06], "metallic": 0.8, "roughness": 0.2, "opacity": 1.0
    })
    
    # 12. ChargingPort (Type-C reinforced sub-board & shield)
    # Bottom center: ox=0, oy=-2.65, oz=-0.02
    port_parts = [
        # Sub-board PCB
        create_box(1.2, 0.40, 0.03, ox=0, oy=-2.55, oz=-0.02),
        # Type-C metallic housing
        create_box(0.38, 0.16, 0.10, ox=0, oy=-2.78, oz=-0.02),
    ]
    port_g = merge_geometries(port_parts)
    nodes.append({
        "name": "ChargingPort",
        "positions": port_g[0], "normals": port_g[1], "uvs": port_g[2], "indices": port_g[3],
        "color": [0.65, 0.68, 0.72], "metallic": 0.9, "roughness": 0.25, "opacity": 1.0
    })
    
    # 13. USBPort (Internal connector block)
    usb_g = create_box(0.32, 0.12, 0.08, ox=0, oy=-2.77, oz=-0.02)
    nodes.append({
        "name": "USBPort",
        "positions": usb_g[0], "normals": usb_g[1], "uvs": usb_g[2], "indices": usb_g[3],
        "color": [0.2, 0.2, 0.2], "metallic": 0.4, "roughness": 0.4, "opacity": 1.0
    })
    
    # 14. ChargingFlex (Polyimide flexible printed ribbon connecting sub-board to logic board)
    # Long ribbon running up left side
    flex_parts = [
        create_box(0.18, 3.40, 0.008, ox=-0.80, oy=-0.50, oz=-0.01),
        create_box(0.40, 0.15, 0.015, ox=-0.70, oy=1.15, oz=-0.01),
        create_box(0.40, 0.15, 0.015, ox=-0.50, oy=-2.35, oz=-0.01),
    ]
    flex_g = merge_geometries(flex_parts)
    nodes.append({
        "name": "ChargingFlex",
        "positions": flex_g[0], "normals": flex_g[1], "uvs": flex_g[2], "indices": flex_g[3],
        "color": [0.88, 0.58, 0.12], "metallic": 0.1, "roughness": 0.4, "opacity": 1.0
    })
    
    # 15. Loudspeaker (Bottom acoustic cavity box with resonant chamber)
    # Bottom right: ox=0.65, oy=-2.45, oz=-0.03
    spk_parts = [
        create_box(0.95, 0.55, 0.12, ox=0.65, oy=-2.45, oz=-0.03),
        create_cylinder(0.18, 0.02, segments=16, ox=0.65, oy=-2.45, oz=0.04, axis='z')
    ]
    spk_g = merge_geometries(spk_parts)
    nodes.append({
        "name": "Loudspeaker",
        "positions": spk_g[0], "normals": spk_g[1], "uvs": spk_g[2], "indices": spk_g[3],
        "color": [0.12, 0.12, 0.14], "metallic": 0.4, "roughness": 0.4, "opacity": 1.0
    })
    
    # 16. Earpiece (Top acoustic receiver speaker module)
    # Top center: ox=0, oy=2.68, oz=0.08
    ear_g = create_box(0.60, 0.08, 0.05, ox=0, oy=2.68, oz=0.08)
    nodes.append({
        "name": "Earpiece",
        "positions": ear_g[0], "normals": ear_g[1], "uvs": ear_g[2], "indices": ear_g[3],
        "color": [0.18, 0.18, 0.20], "metallic": 0.5, "roughness": 0.35, "opacity": 1.0
    })
    
    # 17. VibrationMotor (Haptic Linear Resonant Actuator coin)
    # Bottom left: ox=-0.80, oy=-2.45, oz=-0.03
    vib_g = create_cylinder(0.22, 0.09, segments=20, ox=-0.80, oy=-2.45, oz=-0.03, axis='z')
    nodes.append({
        "name": "VibrationMotor",
        "positions": vib_g[0], "normals": vib_g[1], "uvs": vib_g[2], "indices": vib_g[3],
        "color": [0.70, 0.72, 0.76], "metallic": 0.9, "roughness": 0.2, "opacity": 1.0
    })
    
    # 18. WirelessCoil (Copper Qi2 Inductive Charging Loop with Ferrite backing)
    # Center over battery: ox=0.15, oy=-0.45, oz=-0.11
    coil_parts = [
        # Outer ferrite disc
        create_cylinder(0.70, 0.015, segments=28, ox=0.15, oy=-0.45, oz=-0.115, axis='z'),
        # Copper rings
        create_torus(0.55, 0.02, ring_segs=24, tube_segs=10, ox=0.15, oy=-0.45, oz=-0.105),
        create_torus(0.42, 0.02, ring_segs=24, tube_segs=10, ox=0.15, oy=-0.45, oz=-0.105),
        create_torus(0.28, 0.02, ring_segs=24, tube_segs=10, ox=0.15, oy=-0.45, oz=-0.105),
    ]
    coil_g = merge_geometries(coil_parts)
    nodes.append({
        "name": "WirelessCoil",
        "positions": coil_g[0], "normals": coil_g[1], "uvs": coil_g[2], "indices": coil_g[3],
        "color": [0.85, 0.45, 0.18], "metallic": 0.85, "roughness": 0.25, "opacity": 1.0
    })
    
    # 19. Screws (Micro Torx perimeter and motherboard fastener array)
    screw_coords = [
        (-1.1, 2.5), (1.1, 2.5),
        (-1.1, 0.8), (1.1, 0.8),
        (-1.1, -0.8), (1.1, -0.8),
        (-1.1, -2.5), (1.1, -2.5),
        (0.0, 2.2), (0.0, -2.2)
    ]
    screw_parts = []
    for sx, sy in screw_coords:
        screw_parts.append(create_cylinder(0.045, 0.04, segments=10, ox=sx, oy=sy, oz=0.03, axis='z'))
    screw_g = merge_geometries(screw_parts)
    nodes.append({
        "name": "Screws",
        "positions": screw_g[0], "normals": screw_g[1], "uvs": screw_g[2], "indices": screw_g[3],
        "color": [0.82, 0.85, 0.90], "metallic": 0.95, "roughness": 0.15, "opacity": 1.0
    })
    
    output_path = os.path.join("public", "models", "smartphone_teardown.glb")
    build_gltf_binary(nodes, output_path)

if __name__ == "__main__":
    main()
