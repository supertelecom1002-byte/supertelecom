import json
import struct
import math
import os

def create_box(w, h, d, ox=0, oy=0, oz=0):
    hw, hh, hd = w / 2.0, h / 2.0, d / 2.0
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
        0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
        0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
        1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
        -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
        0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
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

def create_rounded_box(w, h, d, r=0.28, segs=8, ox=0, oy=0, oz=0):
    """
    Creates a high-precision rounded rectangular slab (flagship smartphone shape)
    with smooth squircle corners, realistic UV mapping, and smooth outward normals.
    """
    hw, hh, hd = w / 2.0 - r, h / 2.0 - r, d / 2.0
    
    # Generate 2D outline points & outward normals
    pts_2d = []
    norms_2d = []
    corners = [
        (hw, hh, 0.0),
        (-hw, hh, math.pi / 2.0),
        (-hw, -hh, math.pi),
        (hw, -hh, 3.0 * math.pi / 2.0)
    ]
    for cx, cy, start_angle in corners:
        for i in range(segs):
            angle = start_angle + (math.pi / 2.0) * (i / segs)
            c, s = math.cos(angle), math.sin(angle)
            pts_2d.append((cx + r * c, cy + r * s))
            norms_2d.append((c, s))
            
    num_pts = len(pts_2d)
    
    positions = []
    normals = []
    uvs = []
    indices = []
    
    # 1. Front Face (+Z)
    front_center_idx = len(positions) // 3
    positions.extend([ox, oy, oz + hd])
    normals.extend([0, 0, 1])
    uvs.extend([0.5, 0.5])
    
    front_start_idx = len(positions) // 3
    for x, y in pts_2d:
        positions.extend([ox + x, oy + y, oz + hd])
        normals.extend([0, 0, 1])
        # Normalized UVs across entire width and height [0, 1]
        u = (x + w / 2.0) / w
        v = (y + h / 2.0) / h
        uvs.extend([u, v])
        
    for i in range(num_pts):
        next_i = (i + 1) % num_pts
        indices.extend([front_center_idx, front_start_idx + i, front_start_idx + next_i])
        
    # 2. Back Face (-Z)
    back_center_idx = len(positions) // 3
    positions.extend([ox, oy, oz - hd])
    normals.extend([0, 0, -1])
    uvs.extend([0.5, 0.5])
    
    back_start_idx = len(positions) // 3
    for x, y in pts_2d:
        positions.extend([ox + x, oy + y, oz - hd])
        normals.extend([0, 0, -1])
        u = 1.0 - (x + w / 2.0) / w
        v = (y + h / 2.0) / h
        uvs.extend([u, v])
        
    for i in range(num_pts):
        next_i = (i + 1) % num_pts
        indices.extend([back_center_idx, back_start_idx + next_i, back_start_idx + i])
        
    # 3. Smooth Rounded Side Rails
    rail_start_idx = len(positions) // 3
    for i in range(num_pts):
        x, y = pts_2d[i]
        nx, ny = norms_2d[i]
        u = i / float(num_pts)
        
        # Front edge vertex
        positions.extend([ox + x, oy + y, oz + hd])
        normals.extend([nx, ny, 0])
        uvs.extend([u, 1.0])
        
        # Back edge vertex
        positions.extend([ox + x, oy + y, oz - hd])
        normals.extend([nx, ny, 0])
        uvs.extend([u, 0.0])
        
    for i in range(num_pts):
        next_i = (i + 1) % num_pts
        v0 = rail_start_idx + i * 2
        v1 = rail_start_idx + i * 2 + 1
        v2 = rail_start_idx + next_i * 2
        v3 = rail_start_idx + next_i * 2 + 1
        indices.extend([v0, v1, v2, v1, v3, v2])
        
    return positions, normals, uvs, indices

def create_cylinder(radius, height, segments=24, ox=0, oy=0, oz=0, axis='z'):
    positions, normals, uvs, indices = [], [], [], []
    half_h = height / 2.0
    tube_start = len(positions) // 3
    
    for s in range(segments + 1):
        angle = 2.0 * math.pi * s / segments
        c, s_val = math.cos(angle), math.sin(angle)
        u = s / segments
        
        if axis == 'z':
            positions.extend([ox + radius * c, oy + radius * s_val, oz - half_h])
            normals.extend([c, s_val, 0])
            uvs.extend([u, 0])
            positions.extend([ox + radius * c, oy + radius * s_val, oz + half_h])
            normals.extend([c, s_val, 0])
            uvs.extend([u, 1])
        elif axis == 'y':
            positions.extend([ox + radius * c, oy - half_h, oz + radius * s_val])
            normals.extend([c, 0, s_val])
            uvs.extend([u, 0])
            positions.extend([ox + radius * c, oy + half_h, oz + radius * s_val])
            normals.extend([c, 0, s_val])
            uvs.extend([u, 1])
        else: # 'x'
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
        c, s_val = math.cos(angle), math.sin(angle)
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
        c, s_val = math.cos(angle), math.sin(angle)
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

def create_torus(r_ring, r_tube, ring_segs=24, tube_segs=12, ox=0, oy=0, oz=0):
    positions, normals, uvs, indices = [], [], [], []
    for i in range(ring_segs):
        u = 2.0 * math.pi * i / ring_segs
        cu, su = math.cos(u), math.sin(u)
        for j in range(tube_segs):
            v = 2.0 * math.pi * j / tube_segs
            cv, sv = math.cos(v), math.sin(v)
            x = ox + (r_ring + r_tube * cv) * cu
            y = oy + (r_ring + r_tube * cv) * su
            z = oz + r_tube * sv
            nx, ny, nz = cv * cu, cv * su, sv
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
        
        # Position bufferView
        pos_bytes = struct.pack(f"<{len(pos)}f", *pos)
        pos_offset = len(binary_data)
        binary_data.extend(pos_bytes)
        while len(binary_data) % 4 != 0:
            binary_data.append(0)
            
        pos_bv_idx = len(buffer_views)
        buffer_views.append({
            "buffer": 0,
            "byteOffset": pos_offset,
            "byteLength": len(pos_bytes),
            "target": 34962
        })
        
        x_coords = pos[0::3]
        y_coords = pos[1::3]
        z_coords = pos[2::3]
        pos_min = [min(x_coords), min(y_coords), min(z_coords)]
        pos_max = [max(x_coords), max(y_coords), max(z_coords)]
        
        pos_acc_idx = len(accessors)
        accessors.append({
            "bufferView": pos_bv_idx,
            "byteOffset": 0,
            "componentType": 5126,
            "count": len(pos) // 3,
            "type": "VEC3",
            "min": pos_min,
            "max": pos_max
        })
        
        # Normal bufferView
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
        
        # UV bufferView
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
        
        # Indices bufferView
        max_idx = max(indices) if indices else 0
        use_uint = max_idx > 65535
        if use_uint:
            ind_bytes = struct.pack(f"<{len(indices)}I", *indices)
            comp_type = 5125
        else:
            ind_bytes = struct.pack(f"<{len(indices)}H", *indices)
            comp_type = 5123
            
        ind_offset = len(binary_data)
        binary_data.extend(ind_bytes)
        while len(binary_data) % 4 != 0:
            binary_data.append(0)
            
        ind_bv_idx = len(buffer_views)
        buffer_views.append({
            "buffer": 0,
            "byteOffset": ind_offset,
            "byteLength": len(ind_bytes),
            "target": 34963
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
        nodes.append(node_entry)
        
    gltf_json = {
        "asset": {
            "version": "2.0",
            "generator": "SuperTelecom Flagship Smartphone 3D CAD v3.0"
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
    while len(json_bytes) % 4 != 0:
        json_bytes += b' '
        
    total_len = 12 + 8 + len(json_bytes) + 8 + len(binary_data)
    
    glb = bytearray()
    glb.extend(struct.pack("<4sII", b"glTF", 2, total_len))
    glb.extend(struct.pack("<II", len(json_bytes), 0x4E4F534A))
    glb.extend(json_bytes)
    glb.extend(struct.pack("<II", len(binary_data), 0x004E4942))
    glb.extend(binary_data)
    
    with open(output_path, "wb") as f:
        f.write(glb)
        
    print(f"Generated flagship smartphone: {output_path} ({len(glb)} bytes, {len(nodes)} components)")

def main():
    # Dimensions: 74mm x 156mm x 8.4mm scaled to Three.js units
    W, H, D = 2.75, 5.75, 0.28
    CORNER_R = 0.30
    
    nodes = []
    
    # ─────────────────────────────────────────────────────────────────────────
    # 1. FrontGlass (Front Protective Ceramic Shield Crystal Glass)
    # ─────────────────────────────────────────────────────────────────────────
    fg_g = create_rounded_box(W * 0.985, H * 0.985, 0.015, r=CORNER_R * 0.98, segs=10, ox=0, oy=0, oz=0.148)
    nodes.append({
        "name": "FrontGlass",
        "positions": fg_g[0], "normals": fg_g[1], "uvs": fg_g[2], "indices": fg_g[3],
        "color": [0.85, 0.95, 1.0], "metallic": 0.08, "roughness": 0.05, "opacity": 0.22
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 2. TouchDigitizer (Sub-surface Capacitive Grid)
    # ─────────────────────────────────────────────────────────────────────────
    td_g = create_rounded_box(W * 0.97, H * 0.97, 0.006, r=CORNER_R * 0.95, segs=10, ox=0, oy=0, oz=0.140)
    nodes.append({
        "name": "TouchDigitizer",
        "positions": td_g[0], "normals": td_g[1], "uvs": td_g[2], "indices": td_g[3],
        "color": [0.02, 0.75, 0.95], "metallic": 0.3, "roughness": 0.2, "opacity": 0.18
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 3. OLEDDisplay (120Hz LTPO Super Retina AMOLED Screen)
    # ─────────────────────────────────────────────────────────────────────────
    # Clean single rounded slab for 100% distortion-free 2K canvas UV mapping
    oled_g = create_rounded_box(W * 0.96, H * 0.96, 0.012, r=CORNER_R * 0.92, segs=10, ox=0, oy=0, oz=0.132)
    nodes.append({
        "name": "OLEDDisplay",
        "positions": oled_g[0], "normals": oled_g[1], "uvs": oled_g[2], "indices": oled_g[3],
        "color": [0.02, 0.03, 0.06], "metallic": 0.25, "roughness": 0.18, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 4. ChassisFrame (Aerospace Brushed Titanium Chassis with Side Buttons)
    # ─────────────────────────────────────────────────────────────────────────
    frame_parts = [
        # Outer rounded squircle perimeter band
        create_rounded_box(W, H, D, r=CORNER_R, segs=12, ox=0, oy=0, oz=0),
        # Power button (Right rail)
        create_box(0.045, 0.65, 0.07, ox=W/2 + 0.01, oy=0.45, oz=0),
        # Volume Up (Left rail)
        create_box(0.045, 0.45, 0.07, ox=-W/2 - 0.01, oy=0.85, oz=0),
        # Volume Down (Left rail)
        create_box(0.045, 0.45, 0.07, ox=-W/2 - 0.01, oy=0.25, oz=0),
        # Action button (Left rail top)
        create_box(0.045, 0.25, 0.07, ox=-W/2 - 0.01, oy=1.35, oz=0),
        # USB-C port cutout (Bottom rail center)
        create_box(0.38, 0.03, 0.10, ox=0, oy=-H/2 - 0.005, oz=0),
    ]
    # Add bottom speaker holes
    for h_i in range(4):
        frame_parts.append(create_cylinder(0.022, 0.03, segments=8, ox=0.35 + h_i * 0.09, oy=-H/2 - 0.005, oz=0, axis='y'))
        frame_parts.append(create_cylinder(0.022, 0.03, segments=8, ox=-0.35 - h_i * 0.09, oy=-H/2 - 0.005, oz=0, axis='y'))
        
    cf_g = merge_geometries(frame_parts)
    nodes.append({
        "name": "ChassisFrame",
        "positions": cf_g[0], "normals": cf_g[1], "uvs": cf_g[2], "indices": cf_g[3],
        "color": [0.82, 0.84, 0.88], "metallic": 0.92, "roughness": 0.22, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 5. RearCover (Matte AG Frosted Ceramic Glass with Sculpted Camera Island)
    # ─────────────────────────────────────────────────────────────────────────
    rc_parts = [
        # Back panel glass
        create_rounded_box(W * 0.985, H * 0.985, 0.016, r=CORNER_R * 0.98, segs=10, ox=0, oy=0, oz=-0.148),
        # Sculpted camera bump plateau (Top-Left, perfectly enveloping all 3 lenses, flash and LiDAR)
        create_rounded_box(1.22, 1.48, 0.035, r=0.22, segs=8, ox=-0.60, oy=1.48, oz=-0.170),
    ]
    rc_g = merge_geometries(rc_parts)
    nodes.append({
        "name": "RearCover",
        "positions": rc_g[0], "normals": rc_g[1], "uvs": rc_g[2], "indices": rc_g[3],
        "color": [0.08, 0.12, 0.18], "metallic": 0.35, "roughness": 0.28, "opacity": 0.98
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 6. Battery (5,000mAh High-Density Li-Ion Pack with Safety Wrap & BMS Tab)
    # ─────────────────────────────────────────────────────────────────────────
    bat_parts = [
        create_rounded_box(1.35, 2.55, 0.11, r=0.08, segs=6, ox=0.18, oy=-0.42, oz=-0.03),
        # BMS ribbon connector
        create_box(0.22, 0.38, 0.02, ox=-0.42, oy=0.76, oz=-0.01),
        create_box(0.26, 0.10, 0.03, ox=-0.42, oy=0.92, oz=0.00),
    ]
    bat_g = merge_geometries(bat_parts)
    nodes.append({
        "name": "Battery",
        "positions": bat_g[0], "normals": bat_g[1], "uvs": bat_g[2], "indices": bat_g[3],
        "color": [0.12, 0.14, 0.17], "metallic": 0.40, "roughness": 0.35, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 7. Motherboard (High-Density Multi-Layer Logic Board with Gold Contacts)
    # ─────────────────────────────────────────────────────────────────────────
    mb_parts = [
        create_box(2.32, 1.58, 0.035, ox=0, oy=1.45, oz=-0.03),
        create_box(0.42, 0.09, 0.045, ox=0.82, oy=0.70, oz=-0.03),
        create_box(0.42, 0.09, 0.045, ox=-0.82, oy=0.70, oz=-0.03),
    ]
    mb_g = merge_geometries(mb_parts)
    nodes.append({
        "name": "Motherboard",
        "positions": mb_g[0], "normals": mb_g[1], "uvs": mb_g[2], "indices": mb_g[3],
        "color": [0.03, 0.28, 0.16], "metallic": 0.25, "roughness": 0.45, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 8. ShieldCover (Perforated Nickel EMI / Thermal Dissipation Can)
    # ─────────────────────────────────────────────────────────────────────────
    shield_g = create_box(1.22, 1.22, 0.045, ox=0.38, oy=1.45, oz=-0.07)
    nodes.append({
        "name": "ShieldCover",
        "positions": shield_g[0], "normals": shield_g[1], "uvs": shield_g[2], "indices": shield_g[3],
        "color": [0.75, 0.78, 0.82], "metallic": 0.95, "roughness": 0.20, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 9. ProcessorSoC (Flagship BGA Octa-Core Application Processor Silicon Die)
    # ─────────────────────────────────────────────────────────────────────────
    soc_g = create_box(0.56, 0.56, 0.025, ox=0.38, oy=1.45, oz=-0.045)
    nodes.append({
        "name": "ProcessorSoC",
        "positions": soc_g[0], "normals": soc_g[1], "uvs": soc_g[2], "indices": soc_g[3],
        "color": [0.18, 0.20, 0.22], "metallic": 0.65, "roughness": 0.30, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 10. PMIC (BGA Power Management IC)
    # ─────────────────────────────────────────────────────────────────────────
    pmic_g = create_box(0.34, 0.34, 0.022, ox=0.38, oy=1.04, oz=-0.045)
    nodes.append({
        "name": "PMIC",
        "positions": pmic_g[0], "normals": pmic_g[1], "uvs": pmic_g[2], "indices": pmic_g[3],
        "color": [0.10, 0.12, 0.14], "metallic": 0.70, "roughness": 0.25, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 11. RearCameraModule (Triple OIS Periscope Array with Knurled Lens Rings)
    # ─────────────────────────────────────────────────────────────────────────
    cam_parts = [
        # Main housing
        create_box(0.92, 1.22, 0.13, ox=-0.68, oy=1.52, oz=-0.08),
        # 3 Camera lens barrels with knurled metal rims & dark sapphire optics
        create_cylinder(0.18, 0.06, segments=24, ox=-0.68, oy=1.85, oz=-0.165, axis='z'),
        create_cylinder(0.14, 0.07, segments=20, ox=-0.68, oy=1.85, oz=-0.170, axis='z'),
        
        create_cylinder(0.16, 0.06, segments=24, ox=-0.68, oy=1.45, oz=-0.165, axis='z'),
        create_cylinder(0.12, 0.07, segments=20, ox=-0.68, oy=1.45, oz=-0.170, axis='z'),
        
        create_cylinder(0.15, 0.06, segments=24, ox=-0.68, oy=1.08, oz=-0.165, axis='z'),
        create_cylinder(0.11, 0.07, segments=20, ox=-0.68, oy=1.08, oz=-0.170, axis='z'),
        
        # Dual-tone LED Flash & LiDAR
        create_cylinder(0.08, 0.02, segments=16, ox=-0.32, oy=1.65, oz=-0.16, axis='z'),
        create_cylinder(0.06, 0.02, segments=16, ox=-0.32, oy=1.35, oz=-0.16, axis='z'),
    ]
    cam_g = merge_geometries(cam_parts)
    nodes.append({
        "name": "RearCameraModule",
        "positions": cam_g[0], "normals": cam_g[1], "uvs": cam_g[2], "indices": cam_g[3],
        "color": [0.06, 0.07, 0.09], "metallic": 0.85, "roughness": 0.18, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 12. ChargingPort (Reinforced Type-C Sub-Board)
    # ─────────────────────────────────────────────────────────────────────────
    port_parts = [
        create_box(1.25, 0.42, 0.03, ox=0, oy=-2.55, oz=-0.02),
        create_box(0.40, 0.16, 0.09, ox=0, oy=-2.77, oz=-0.02),
    ]
    port_g = merge_geometries(port_parts)
    nodes.append({
        "name": "ChargingPort",
        "positions": port_g[0], "normals": port_g[1], "uvs": port_g[2], "indices": port_g[3],
        "color": [0.70, 0.72, 0.76], "metallic": 0.92, "roughness": 0.22, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 13. USBPort (Internal Gold Contacts Dock)
    # ─────────────────────────────────────────────────────────────────────────
    usb_g = create_box(0.34, 0.12, 0.07, ox=0, oy=-2.77, oz=-0.02)
    nodes.append({
        "name": "USBPort",
        "positions": usb_g[0], "normals": usb_g[1], "uvs": usb_g[2], "indices": usb_g[3],
        "color": [0.18, 0.18, 0.20], "metallic": 0.45, "roughness": 0.40, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 14. ChargingFlex (Polyimide Interconnect Ribbon)
    # ─────────────────────────────────────────────────────────────────────────
    flex_parts = [
        create_box(0.18, 3.40, 0.008, ox=-0.80, oy=-0.50, oz=-0.01),
        create_box(0.42, 0.16, 0.015, ox=-0.70, oy=1.15, oz=-0.01),
        create_box(0.42, 0.16, 0.015, ox=-0.50, oy=-2.35, oz=-0.01),
    ]
    flex_g = merge_geometries(flex_parts)
    nodes.append({
        "name": "ChargingFlex",
        "positions": flex_g[0], "normals": flex_g[1], "uvs": flex_g[2], "indices": flex_g[3],
        "color": [0.88, 0.55, 0.12], "metallic": 0.15, "roughness": 0.35, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 15. Loudspeaker (Bottom Acoustic Cavity Box)
    # ─────────────────────────────────────────────────────────────────────────
    spk_parts = [
        create_box(0.96, 0.56, 0.12, ox=0.68, oy=-2.45, oz=-0.03),
        create_cylinder(0.18, 0.02, segments=16, ox=0.68, oy=-2.45, oz=0.04, axis='z')
    ]
    spk_g = merge_geometries(spk_parts)
    nodes.append({
        "name": "Loudspeaker",
        "positions": spk_g[0], "normals": spk_g[1], "uvs": spk_g[2], "indices": spk_g[3],
        "color": [0.12, 0.13, 0.15], "metallic": 0.45, "roughness": 0.40, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 16. Earpiece (Top Stereo Acoustic Transducer)
    # ─────────────────────────────────────────────────────────────────────────
    ear_g = create_box(0.62, 0.09, 0.05, ox=0, oy=2.68, oz=0.08)
    nodes.append({
        "name": "Earpiece",
        "positions": ear_g[0], "normals": ear_g[1], "uvs": ear_g[2], "indices": ear_g[3],
        "color": [0.18, 0.19, 0.22], "metallic": 0.50, "roughness": 0.35, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 17. VibrationMotor (Haptic Linear Resonant Actuator)
    # ─────────────────────────────────────────────────────────────────────────
    vib_g = create_cylinder(0.24, 0.09, segments=24, ox=-0.80, oy=-2.45, oz=-0.03, axis='z')
    nodes.append({
        "name": "VibrationMotor",
        "positions": vib_g[0], "normals": vib_g[1], "uvs": vib_g[2], "indices": vib_g[3],
        "color": [0.72, 0.74, 0.78], "metallic": 0.92, "roughness": 0.20, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 18. WirelessCoil (Copper Qi2 Inductive Fast-Charging Loop)
    # ─────────────────────────────────────────────────────────────────────────
    coil_parts = [
        create_cylinder(0.72, 0.015, segments=32, ox=0.18, oy=-0.42, oz=-0.115, axis='z'),
        create_torus(0.56, 0.022, ring_segs=28, tube_segs=10, ox=0.18, oy=-0.42, oz=-0.105),
        create_torus(0.44, 0.022, ring_segs=28, tube_segs=10, ox=0.18, oy=-0.42, oz=-0.105),
        create_torus(0.30, 0.022, ring_segs=28, tube_segs=10, ox=0.18, oy=-0.42, oz=-0.105),
    ]
    coil_g = merge_geometries(coil_parts)
    nodes.append({
        "name": "WirelessCoil",
        "positions": coil_g[0], "normals": coil_g[1], "uvs": coil_g[2], "indices": coil_g[3],
        "color": [0.88, 0.48, 0.16], "metallic": 0.88, "roughness": 0.22, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 19. Screws (Micro Torx Fastener Array)
    # ─────────────────────────────────────────────────────────────────────────
    screw_coords = [
        (-1.12, 2.52), (1.12, 2.52),
        (-1.12, 0.82), (1.12, 0.82),
        (-1.12, -0.82), (1.12, -0.82),
        (-1.12, -2.52), (1.12, -2.52),
        (0.0, 2.25), (0.0, -2.25)
    ]
    screw_parts = []
    for sx, sy in screw_coords:
        screw_parts.append(create_cylinder(0.045, 0.04, segments=12, ox=sx, oy=sy, oz=0.03, axis='z'))
    screw_g = merge_geometries(screw_parts)
    nodes.append({
        "name": "Screws",
        "positions": screw_g[0], "normals": screw_g[1], "uvs": screw_g[2], "indices": screw_g[3],
        "color": [0.85, 0.88, 0.92], "metallic": 0.96, "roughness": 0.15, "opacity": 1.0
    })
    
    output_path = os.path.join("public", "models", "smartphone_teardown.glb")
    build_gltf_binary(nodes, output_path)

if __name__ == "__main__":
    main()
