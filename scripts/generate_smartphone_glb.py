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
        0, 1, 1, 1, 1, 0, 0, 0,
        1, 1, 0, 1, 0, 0, 1, 0,
        0, 1, 1, 1, 1, 0, 0, 0,
        1, 1, 0, 1, 0, 0, 1, 0,
        0, 0, 1, 0, 1, 1, 0, 1,
        0, 1, 1, 1, 1, 0, 0, 0,
    ]
    indices = []
    for f in range(6):
        b = f * 4
        indices.extend([b, b + 1, b + 2, b, b + 2, b + 3])
    return positions, normals, uvs, indices

def create_squircle_plane(w, h, r, segs_x=28, segs_y=56, ox=0, oy=0, oz=0, normal_z=1.0):
    """
    Creates a mathematically flawless squircle rectangular plane
    with exact linear UV mapping: (0,0) top-left to (1,1) bottom-right.
    """
    hw, hh = w / 2.0 - r, h / 2.0 - r
    positions, normals, uvs, indices = [], [], [], []
    
    for j in range(segs_y + 1):
        v = j / float(segs_y)
        # raw_y goes from +h/2 (top) to -h/2 (bottom)
        raw_y = (h / 2.0) - v * h
        
        for i in range(segs_x + 1):
            u = i / float(segs_x)
            # raw_x goes from -w/2 (left) to +w/2 (right)
            raw_x = - (w / 2.0) + u * w
            
            x = raw_x
            y = raw_y
            
            # Corner clamping to smooth squircle arc
            if abs(raw_x) > hw and abs(raw_y) > hh:
                cx = hw if raw_x > 0 else -hw
                cy = hh if raw_y > 0 else -hh
                dx = raw_x - cx
                dy = raw_y - cy
                dist = math.sqrt(dx * dx + dy * dy)
                if dist > r:
                    scale = r / dist
                    x = cx + dx * scale
                    y = cy + dy * scale
                    
            positions.extend([ox + x, oy + y, oz])
            normals.extend([0, 0, normal_z])
            uvs.extend([u, v])
            
    for j in range(segs_y):
        for i in range(segs_x):
            i0 = j * (segs_x + 1) + i
            i1 = i0 + 1
            i2 = (j + 1) * (segs_x + 1) + i
            i3 = i2 + 1
            
            if normal_z > 0:
                indices.extend([i0, i2, i1, i1, i2, i3])
            else:
                indices.extend([i0, i1, i2, i1, i3, i2])
                
    return positions, normals, uvs, indices

def create_squircle_rail(w, h, d, r=0.30, segs_corner=14, ox=0, oy=0, oz=0):
    """
    Creates the outer rounded squircle side rail band (perimeter rim of phone)
    without solid faces covering the screen or the interior.
    """
    hw, hh, hd = w / 2.0 - r, h / 2.0 - r, d / 2.0
    pts_2d, norms_2d = [], []
    corners = [
        (hw, hh, 0.0),
        (-hw, hh, math.pi / 2.0),
        (-hw, -hh, math.pi),
        (hw, -hh, 3.0 * math.pi / 2.0)
    ]
    for cx, cy, start_angle in corners:
        for i in range(segs_corner):
            angle = start_angle + (math.pi / 2.0) * (i / float(segs_corner))
            c, s = math.cos(angle), math.sin(angle)
            pts_2d.append((cx + r * c, cy + r * s))
            norms_2d.append((c, s))
            
    num_pts = len(pts_2d)
    positions, normals, uvs, indices = [], [], [], []
    
    for i in range(num_pts):
        x, y = pts_2d[i]
        nx, ny = norms_2d[i]
        u = i / float(num_pts)
        
        # Front outer edge vertex
        positions.extend([ox + x, oy + y, oz + hd])
        normals.extend([nx, ny, 0])
        uvs.extend([u, 1.0])
        
        # Back outer edge vertex
        positions.extend([ox + x, oy + y, oz - hd])
        normals.extend([nx, ny, 0])
        uvs.extend([u, 0.0])
        
    for i in range(num_pts):
        next_i = (i + 1) % num_pts
        v0 = i * 2
        v1 = i * 2 + 1
        v2 = next_i * 2
        v3 = next_i * 2 + 1
        indices.extend([v0, v1, v2, v1, v3, v2])
        
    return positions, normals, uvs, indices

def create_squircle_rim_bezel(w_out, h_out, r_out, w_in, h_in, r_in, segs_corner=12, ox=0, oy=0, oz=0, normal_z=1.0):
    """
    Creates a hollow squircle border bezel ring (between outer frame and display).
    """
    hw_o, hh_o = w_out / 2.0 - r_out, h_out / 2.0 - r_out
    hw_i, hh_i = w_in / 2.0 - r_in, h_in / 2.0 - r_in
    
    pts_out = []
    pts_in = []
    corners = [
        (hw_o, hh_o, hw_i, hh_i, 0.0),
        (-hw_o, hh_o, -hw_i, hh_i, math.pi / 2.0),
        (-hw_o, -hh_o, -hw_i, -hh_i, math.pi),
        (hw_o, -hh_o, hw_i, -hh_i, 3.0 * math.pi / 2.0)
    ]
    for cx_o, cy_o, cx_i, cy_i, start_angle in corners:
        for i in range(segs_corner):
            angle = start_angle + (math.pi / 2.0) * (i / float(segs_corner))
            c, s = math.cos(angle), math.sin(angle)
            pts_out.append((cx_o + r_out * c, cy_o + r_out * s))
            pts_in.append((cx_i + r_in * c, cy_i + r_in * s))
            
    num_pts = len(pts_out)
    positions, normals, uvs, indices = [], [], [], []
    
    for i in range(num_pts):
        xo, yo = pts_out[i]
        xi, yi = pts_in[i]
        
        # Outer vertex
        positions.extend([ox + xo, oy + yo, oz])
        normals.extend([0, 0, normal_z])
        uvs.extend([(xo + w_out/2)/w_out, (h_out/2 - yo)/h_out])
        
        # Inner vertex
        positions.extend([ox + xi, oy + yi, oz])
        normals.extend([0, 0, normal_z])
        uvs.extend([(xi + w_out/2)/w_out, (h_out/2 - yi)/h_out])
        
    for i in range(num_pts):
        next_i = (i + 1) % num_pts
        v0 = i * 2
        v1 = i * 2 + 1
        v2 = next_i * 2
        v3 = next_i * 2 + 1
        if normal_z > 0:
            indices.extend([v0, v2, v1, v1, v2, v3])
        else:
            indices.extend([v0, v1, v2, v1, v3, v2])
            
    return positions, normals, uvs, indices

def create_cylinder(radius, height, segments=24, ox=0, oy=0, oz=0, axis='z'):
    positions, normals, uvs, indices = [], [], [], []
    half_h = height / 2.0
    tube_start = len(positions) // 3
    
    for s in range(segments + 1):
        angle = 2.0 * math.pi * s / segments
        c, s_val = math.cos(angle), math.sin(angle)
        u = s / float(segments)
        
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
        u = 2.0 * math.pi * i / float(ring_segs)
        cu, su = math.cos(u), math.sin(u)
        for j in range(tube_segs):
            v = 2.0 * math.pi * j / float(tube_segs)
            cv, sv = math.cos(v), math.sin(v)
            x = ox + (r_ring + r_tube * cv) * cu
            y = oy + (r_ring + r_tube * cv) * su
            z = oz + r_tube * sv
            nx, ny, nz = cv * cu, cv * su, sv
            positions.extend([x, y, z])
            normals.extend([nx, ny, nz])
            uvs.extend([i / float(ring_segs), j / float(tube_segs)])
            
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
        emissive = item.get("emissive", [0.0, 0.0, 0.0])
        alpha_mode = "BLEND" if opacity < 0.99 else "OPAQUE"
        
        mat_key = (tuple(color), metallic, roughness, opacity, tuple(emissive), alpha_mode)
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
            if emissive[0] > 0 or emissive[1] > 0 or emissive[2] > 0:
                mat_entry["emissiveFactor"] = emissive
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
            "generator": "SuperTelecom Master Flagship 3D CAD Engine v5.0"
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
        
    print(f"Generated flagship smartphone CAD: {output_path} ({len(glb)} bytes, {len(nodes)} components)")

def main():
    # Golden Ratio Flagship Smartphone Pro Dimensions (Apple iPhone 15/16 Pro / Galaxy S24 Ultra proportions):
    # Width: 2.45, Height: 5.15, Depth: 0.22 (Aspect ratio ~19.5:9, 75mm x 158mm x 7.8mm)
    W, H, D = 2.45, 5.15, 0.22
    CORNER_R = 0.32
    
    nodes = []
    
    # ─────────────────────────────────────────────────────────────────────────
    # 1. FrontGlass (Ceramic Shield 2.5D Crystal Clear Protective Front Glass)
    # ─────────────────────────────────────────────────────────────────────────
    fg_g = create_squircle_plane(W * 0.985, H * 0.985, CORNER_R * 0.97, segs_x=24, segs_y=48, ox=0, oy=0, oz=0.115, normal_z=1.0)
    nodes.append({
        "name": "FrontGlass",
        "positions": fg_g[0], "normals": fg_g[1], "uvs": fg_g[2], "indices": fg_g[3],
        "color": [0.95, 0.98, 1.0], "metallic": 0.05, "roughness": 0.02, "opacity": 0.08
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 2. TouchDigitizer (Micro-Capacitive Ribbon Connector Tail - Never blocks screen!)
    # ─────────────────────────────────────────────────────────────────────────
    td_parts = [
        # Ultra-thin perimeter border flex lip (outer perimeter only, completely open in center!)
        create_squircle_rim_bezel(W * 0.97, H * 0.97, CORNER_R * 0.96, W * 0.95, H * 0.95, CORNER_R * 0.94, segs_corner=12, ox=0, oy=0, oz=0.112, normal_z=1.0),
        # Bottom touch flex connector ribbon tail
        create_box(0.35, 0.24, 0.006, ox=-0.30, oy=-H/2 + 0.25, oz=0.108)
    ]
    td_g = merge_geometries(td_parts)
    nodes.append({
        "name": "TouchDigitizer",
        "positions": td_g[0], "normals": td_g[1], "uvs": td_g[2], "indices": td_g[3],
        "color": [0.06, 0.75, 0.92], "metallic": 0.65, "roughness": 0.25, "opacity": 0.75
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 3. OLEDDisplay (120Hz LTPO Super Retina AMOLED Flagship Screen Face)
    # ─────────────────────────────────────────────────────────────────────────
    oled_parts = [
        # Front active AMOLED face with exact UV mapping
        create_squircle_plane(W * 0.955, H * 0.955, CORNER_R * 0.94, segs_x=28, segs_y=56, ox=0, oy=0, oz=0.110, normal_z=1.0),
        # Thin rear copper heat-shield backing for OLED panel
        create_squircle_plane(W * 0.955, H * 0.955, CORNER_R * 0.94, segs_x=16, segs_y=32, ox=0, oy=0, oz=0.105, normal_z=-1.0),
        # Flexible OLED display ribbon cable looping to motherboard
        create_box(0.38, 0.35, 0.008, ox=0.45, oy=1.10, oz=0.075)
    ]
    oled_g = merge_geometries(oled_parts)
    nodes.append({
        "name": "OLEDDisplay",
        "positions": oled_g[0], "normals": oled_g[1], "uvs": oled_g[2], "indices": oled_g[3],
        "color": [1.0, 1.0, 1.0], "metallic": 0.10, "roughness": 0.15, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 4. ChassisFrame (Brushed Natural Titanium Chassis with Architectural Cutouts)
    # ─────────────────────────────────────────────────────────────────────────
    # NOTE: NOT a solid monolith wall! Has battery pocket and motherboard tray!
    frame_parts = [
        # Outer squircle perimeter side rails
        create_squircle_rail(W, H, D, r=CORNER_R, segs_corner=16, ox=0, oy=0, oz=0),
        # Front screen bezel border lip (narrow black titanium rim)
        create_squircle_rim_bezel(W, H, CORNER_R, W * 0.955, H * 0.955, CORNER_R * 0.94, segs_corner=14, ox=0, oy=0, oz=0.110, normal_z=1.0),
        # Rear back glass bezel border lip
        create_squircle_rim_bezel(W, H, CORNER_R, W * 0.965, H * 0.965, CORNER_R * 0.95, segs_corner=14, ox=0, oy=0, oz=-0.110, normal_z=-1.0),
        
        # Central titanium spine beam (structural backbone dividing components)
        create_box(0.24, H * 0.82, 0.018, ox=0, oy=0, oz=0),
        # Upper structural cross-beam (under motherboard)
        create_box(W * 0.88, 0.18, 0.018, ox=0, oy=0.72, oz=0),
        # Lower structural cross-beam (above speaker)
        create_box(W * 0.88, 0.18, 0.018, ox=0, oy=-1.95, oz=0),
        # Copper vapor chamber heat-pipe running along the central spine
        create_box(0.18, 3.20, 0.012, ox=-0.05, oy=-0.40, oz=0.012),
        
        # Power / Lock button (Right rail)
        create_box(0.045, 0.60, 0.065, ox=W/2 + 0.015, oy=0.45, oz=0),
        # Volume Up button (Left rail)
        create_box(0.045, 0.44, 0.065, ox=-W/2 - 0.015, oy=0.85, oz=0),
        # Volume Down button (Left rail)
        create_box(0.045, 0.44, 0.065, ox=-W/2 - 0.015, oy=0.30, oz=0),
        # Action button (Left rail top)
        create_box(0.045, 0.26, 0.065, ox=-W/2 - 0.015, oy=1.35, oz=0),
        
        # Antenna insulation bands
        create_box(0.025, 0.04, 0.22, ox=W/2 - 0.22, oy=H/2 + 0.002, oz=0),
        create_box(0.025, 0.04, 0.22, ox=-W/2 + 0.22, oy=H/2 + 0.002, oz=0),
        create_box(0.025, 0.04, 0.22, ox=W/2 - 0.22, oy=-H/2 - 0.002, oz=0),
        create_box(0.025, 0.04, 0.22, ox=-W/2 + 0.22, oy=-H/2 - 0.002, oz=0),
    ]
    # Bottom speaker acoustic holes
    for h_i in range(5):
        frame_parts.append(create_cylinder(0.018, 0.04, segments=10, ox=0.30 + h_i * 0.075, oy=-H/2 - 0.002, oz=0, axis='y'))
        frame_parts.append(create_cylinder(0.018, 0.04, segments=10, ox=-0.30 - h_i * 0.075, oy=-H/2 - 0.002, oz=0, axis='y'))
        
    cf_g = merge_geometries(frame_parts)
    nodes.append({
        "name": "ChassisFrame",
        "positions": cf_g[0], "normals": cf_g[1], "uvs": cf_g[2], "indices": cf_g[3],
        "color": [0.82, 0.84, 0.88], "metallic": 0.94, "roughness": 0.22, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 5. RearCover (Matte AG Frosted Ceramic Glass in Titanium Cosmic Slate)
    # ─────────────────────────────────────────────────────────────────────────
    rc_parts = [
        # Back panel glass
        create_squircle_plane(W * 0.965, H * 0.965, CORNER_R * 0.95, segs_x=24, segs_y=48, ox=0, oy=0, oz=-0.112, normal_z=-1.0),
        # Camera island plateau ramp (Top-Left rounded plateau)
        create_squircle_plane(1.10, 1.35, 0.20, segs_x=16, segs_y=20, ox=-0.52, oy=1.36, oz=-0.135, normal_z=-1.0),
        # Side bevel collar around camera bump
        create_squircle_rail(1.10, 1.35, 0.022, r=0.20, segs_corner=10, ox=-0.52, oy=1.36, oz=-0.124),
    ]
    rc_g = merge_geometries(rc_parts)
    nodes.append({
        "name": "RearCover",
        "positions": rc_g[0], "normals": rc_g[1], "uvs": rc_g[2], "indices": rc_g[3],
        "color": [1.0, 1.0, 1.0], "metallic": 0.38, "roughness": 0.28, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 6. Battery (5,000mAh High-Density Li-Ion Pouch Pack)
    # ─────────────────────────────────────────────────────────────────────────
    bat_parts = [
        # Battery pouch body
        create_box(1.22, 2.50, 0.085, ox=0.20, oy=-0.50, oz=-0.030),
        # Top nickel safety terminal tab
        create_box(0.25, 0.28, 0.015, ox=-0.35, oy=0.65, oz=-0.015),
        # Gold-plated BMS board connector
        create_box(0.26, 0.10, 0.025, ox=-0.35, oy=0.78, oz=-0.005),
    ]
    bat_g = merge_geometries(bat_parts)
    nodes.append({
        "name": "Battery",
        "positions": bat_g[0], "normals": bat_g[1], "uvs": bat_g[2], "indices": bat_g[3],
        "color": [0.12, 0.15, 0.18], "metallic": 0.35, "roughness": 0.38, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 7. Motherboard (High-Density Multi-Layer Logic Board with Gold Contacts)
    # ─────────────────────────────────────────────────────────────────────────
    mb_parts = [
        # Main upper logic PCB substrate
        create_box(2.15, 1.45, 0.030, ox=0, oy=1.38, oz=-0.025),
        # Interconnect side extensions
        create_box(0.35, 0.08, 0.038, ox=0.75, oy=0.68, oz=-0.025),
        create_box(0.35, 0.08, 0.038, ox=-0.75, oy=0.68, oz=-0.025),
    ]
    # SMT capacitor and inductor arrays
    for ci in range(6):
        mb_parts.append(create_box(0.035, 0.055, 0.018, ox=-0.90 + ci * 0.11, oy=0.80, oz=-0.005))
        mb_parts.append(create_box(0.035, 0.055, 0.018, ox=0.42 + ci * 0.10, oy=0.80, oz=-0.005))
        
    mb_g = merge_geometries(mb_parts)
    nodes.append({
        "name": "Motherboard",
        "positions": mb_g[0], "normals": mb_g[1], "uvs": mb_g[2], "indices": mb_g[3],
        "color": [0.04, 0.32, 0.19], "metallic": 0.30, "roughness": 0.42, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 8. ShieldCover (Perforated Nickel EMI / Thermal Shield Can)
    # ─────────────────────────────────────────────────────────────────────────
    shield_parts = [
        create_box(1.10, 1.10, 0.035, ox=0.35, oy=1.38, oz=-0.052),
    ]
    shield_g = merge_geometries(shield_parts)
    nodes.append({
        "name": "ShieldCover",
        "positions": shield_g[0], "normals": shield_g[1], "uvs": shield_g[2], "indices": shield_g[3],
        "color": [0.82, 0.84, 0.88], "metallic": 0.95, "roughness": 0.18, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 9. ProcessorSoC (Application Processor Silicon Die with 0.02mm Micro-Jumper)
    # ─────────────────────────────────────────────────────────────────────────
    soc_parts = [
        # Silicon die
        create_box(0.52, 0.52, 0.020, ox=0.35, oy=1.38, oz=-0.032),
        # 0.02mm microscopic copper micro-jumper wire!
        create_box(0.26, 0.012, 0.012, ox=0.35, oy=1.38, oz=-0.020),
    ]
    soc_g = merge_geometries(soc_parts)
    nodes.append({
        "name": "ProcessorSoC",
        "positions": soc_g[0], "normals": soc_g[1], "uvs": soc_g[2], "indices": soc_g[3],
        "color": [0.15, 0.18, 0.22], "metallic": 0.65, "roughness": 0.28, "opacity": 1.0,
        "emissive": [0.06, 0.72, 0.50]
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 10. PMIC (Power Management IC)
    # ─────────────────────────────────────────────────────────────────────────
    pmic_g = create_box(0.30, 0.30, 0.018, ox=0.35, oy=0.98, oz=-0.032)
    nodes.append({
        "name": "PMIC",
        "positions": pmic_g[0], "normals": pmic_g[1], "uvs": pmic_g[2], "indices": pmic_g[3],
        "color": [0.08, 0.10, 0.12], "metallic": 0.75, "roughness": 0.22, "opacity": 1.0,
        "emissive": [0.02, 0.45, 0.30]
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 11. RearCameraModule (Triple Periscope OIS Optics & Sapphire Lenses)
    # ─────────────────────────────────────────────────────────────────────────
    cam_parts = [
        # Main housing
        create_box(0.85, 1.15, 0.10, ox=-0.58, oy=1.42, oz=-0.065),
        
        # Camera 1 (Top Wide 200MP OIS Lens Barrel & Sapphire Disc)
        create_cylinder(0.17, 0.05, segments=24, ox=-0.58, oy=1.74, oz=-0.135, axis='z'),
        create_cylinder(0.13, 0.06, segments=20, ox=-0.58, oy=1.74, oz=-0.140, axis='z'),
        
        # Camera 2 (Middle Ultra-Wide Lens Barrel)
        create_cylinder(0.15, 0.05, segments=24, ox=-0.58, oy=1.38, oz=-0.135, axis='z'),
        create_cylinder(0.11, 0.06, segments=20, ox=-0.58, oy=1.38, oz=-0.140, axis='z'),
        
        # Camera 3 (Bottom Periscope Telephoto Lens Barrel)
        create_cylinder(0.14, 0.05, segments=24, ox=-0.58, oy=1.04, oz=-0.135, axis='z'),
        create_cylinder(0.10, 0.06, segments=20, ox=-0.58, oy=1.04, oz=-0.140, axis='z'),
        
        # Dual-tone True Tone LED Flash
        create_cylinder(0.070, 0.02, segments=16, ox=-0.26, oy=1.58, oz=-0.13, axis='z'),
        # LiDAR Scanner
        create_cylinder(0.050, 0.02, segments=16, ox=-0.26, oy=1.30, oz=-0.13, axis='z'),
    ]
    cam_g = merge_geometries(cam_parts)
    nodes.append({
        "name": "RearCameraModule",
        "positions": cam_g[0], "normals": cam_g[1], "uvs": cam_g[2], "indices": cam_g[3],
        "color": [0.07, 0.08, 0.10], "metallic": 0.88, "roughness": 0.16, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 12. ChargingPort (Reinforced Type-C Sub-Board)
    # ─────────────────────────────────────────────────────────────────────────
    port_parts = [
        create_box(1.15, 0.36, 0.026, ox=0, oy=-2.32, oz=-0.02),
        create_box(0.36, 0.14, 0.075, ox=0, oy=-2.50, oz=-0.02),
    ]
    port_g = merge_geometries(port_parts)
    nodes.append({
        "name": "ChargingPort",
        "positions": port_g[0], "normals": port_g[1], "uvs": port_g[2], "indices": port_g[3],
        "color": [0.75, 0.77, 0.82], "metallic": 0.92, "roughness": 0.20, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 13. USBPort (Internal Gold Contact Pins)
    # ─────────────────────────────────────────────────────────────────────────
    usb_parts = [
        create_box(0.30, 0.09, 0.055, ox=0, oy=-2.50, oz=-0.02),
    ]
    usb_g = merge_geometries(usb_parts)
    nodes.append({
        "name": "USBPort",
        "positions": usb_g[0], "normals": usb_g[1], "uvs": usb_g[2], "indices": usb_g[3],
        "color": [0.85, 0.65, 0.15], "metallic": 0.85, "roughness": 0.25, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 14. ChargingFlex (Polyimide Interconnect Ribbon)
    # ─────────────────────────────────────────────────────────────────────────
    flex_parts = [
        create_box(0.15, 2.95, 0.008, ox=-0.70, oy=-0.45, oz=-0.01),
        create_box(0.35, 0.14, 0.012, ox=-0.60, oy=1.05, oz=-0.01),
        create_box(0.35, 0.14, 0.012, ox=-0.45, oy=-2.15, oz=-0.01),
    ]
    flex_g = merge_geometries(flex_parts)
    nodes.append({
        "name": "ChargingFlex",
        "positions": flex_g[0], "normals": flex_g[1], "uvs": flex_g[2], "indices": flex_g[3],
        "color": [0.88, 0.52, 0.12], "metallic": 0.20, "roughness": 0.32, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 15. Loudspeaker (Bottom Acoustic Enclosure Box)
    # ─────────────────────────────────────────────────────────────────────────
    spk_parts = [
        create_box(0.88, 0.48, 0.10, ox=0.60, oy=-2.24, oz=-0.03),
        create_cylinder(0.15, 0.02, segments=16, ox=0.60, oy=-2.24, oz=0.035, axis='z')
    ]
    spk_g = merge_geometries(spk_parts)
    nodes.append({
        "name": "Loudspeaker",
        "positions": spk_g[0], "normals": spk_g[1], "uvs": spk_g[2], "indices": spk_g[3],
        "color": [0.11, 0.12, 0.14], "metallic": 0.45, "roughness": 0.42, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 16. Earpiece (Top Stereo Acoustic Transducer)
    # ─────────────────────────────────────────────────────────────────────────
    ear_g = create_box(0.54, 0.075, 0.040, ox=0, oy=2.45, oz=0.065)
    nodes.append({
        "name": "Earpiece",
        "positions": ear_g[0], "normals": ear_g[1], "uvs": ear_g[2], "indices": ear_g[3],
        "color": [0.18, 0.19, 0.22], "metallic": 0.52, "roughness": 0.35, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 17. VibrationMotor (Taptic Engine Linear Resonant Actuator)
    # ─────────────────────────────────────────────────────────────────────────
    vib_g = create_cylinder(0.20, 0.075, segments=24, ox=-0.70, oy=-2.24, oz=-0.03, axis='z')
    nodes.append({
        "name": "VibrationMotor",
        "positions": vib_g[0], "normals": vib_g[1], "uvs": vib_g[2], "indices": vib_g[3],
        "color": [0.75, 0.77, 0.80], "metallic": 0.92, "roughness": 0.20, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 18. WirelessCoil (Copper Qi2 Wireless Induction Charging Loop)
    # ─────────────────────────────────────────────────────────────────────────
    coil_parts = [
        # Magnetic back alignment ferrite disc
        create_cylinder(0.65, 0.012, segments=32, ox=0.20, oy=-0.45, oz=-0.090, axis='z'),
        # Concentric copper induction coils
        create_torus(0.52, 0.018, ring_segs=32, tube_segs=10, ox=0.20, oy=-0.45, oz=-0.080),
        create_torus(0.40, 0.018, ring_segs=28, tube_segs=10, ox=0.20, oy=-0.45, oz=-0.080),
        create_torus(0.28, 0.018, ring_segs=24, tube_segs=10, ox=0.20, oy=-0.45, oz=-0.080),
    ]
    coil_g = merge_geometries(coil_parts)
    nodes.append({
        "name": "WirelessCoil",
        "positions": coil_g[0], "normals": coil_g[1], "uvs": coil_g[2], "indices": coil_g[3],
        "color": [0.90, 0.52, 0.15], "metallic": 0.90, "roughness": 0.20, "opacity": 1.0
    })
    
    # ─────────────────────────────────────────────────────────────────────────
    # 19. Screws (Micro Torx Precision Fastener Array)
    # ─────────────────────────────────────────────────────────────────────────
    screw_coords = [
        (-1.00, 2.30), (1.00, 2.30),
        (-1.00, 0.75), (1.00, 0.75),
        (-1.00, -0.75), (1.00, -0.75),
        (-1.00, -2.30), (1.00, -2.30),
        (0.0, 2.05), (0.0, -2.05)
    ]
    screw_parts = []
    for sx, sy in screw_coords:
        screw_parts.append(create_cylinder(0.035, 0.030, segments=12, ox=sx, oy=sy, oz=0.022, axis='z'))
    screw_g = merge_geometries(screw_parts)
    nodes.append({
        "name": "Screws",
        "positions": screw_g[0], "normals": screw_g[1], "uvs": screw_g[2], "indices": screw_g[3],
        "color": [0.86, 0.88, 0.92], "metallic": 0.96, "roughness": 0.15, "opacity": 1.0
    })
    
    output_path = os.path.join("public", "models", "smartphone_teardown.glb")
    build_gltf_binary(nodes, output_path)
    
    # Also sync to .output/public/models/ if it exists
    dist_path = os.path.join(".output", "public", "models", "smartphone_teardown.glb")
    if os.path.exists(os.path.dirname(dist_path)):
        with open(output_path, "rb") as src_f:
            data = src_f.read()
        with open(dist_path, "wb") as dst_f:
            dst_f.write(data)
        print(f"Synced to dist: {dist_path}")

if __name__ == "__main__":
    main()
