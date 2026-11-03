import subprocess
import hashlib
import zlib
import os
import sys

def stage_large_file(rel_path):
    print(f"Reading {rel_path}...", flush=True)
    with open(rel_path, 'rb') as f:
        data = f.read()
    size = len(data)
    header = f'blob {size}\0'.encode('ascii')
    full_blob = header + data
    sha = hashlib.sha1(full_blob).hexdigest()
    
    obj_dir = os.path.join('.git', 'objects', sha[:2])
    obj_path = os.path.join(obj_dir, sha[2:])
    os.makedirs(obj_dir, exist_ok=True)
    if not os.path.exists(obj_path):
        print(f"Compressing blob {sha}...", flush=True)
        compressed = zlib.compress(full_blob, 1)
        with open(obj_path, 'wb') as f:
            f.write(compressed)
            
    subprocess.run(['git', 'update-index', '--add', '--cacheinfo', '100644', sha, rel_path], check=True)
    print(f"Staged large file {rel_path} as blob {sha}", flush=True)

if __name__ == '__main__':
    stage_large_file('public/SuperTelecom.apk')

    print("Staging config, src, and script files...", flush=True)
    subprocess.run(['git', 'add', 'index.html', 'vercel.json', 'src/', 'public/apk-release.json', 'scripts/'], check=True)

    print("Staging Android Kotlin code & resources...", flush=True)
    subprocess.run(['git', 'add', 'app/src/main/res/', 'app/src/main/java/'], check=True)

    print("Done! All files successfully staged.", flush=True)
