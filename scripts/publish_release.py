import hashlib
import json
import os
import shutil

def compute_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest().lower()

def human_size(bytes_len):
    mb = bytes_len / (1024 * 1024)
    return f"{mb:.2f} MB"

def main():
    apk_source = os.path.join("app", "build", "outputs", "apk", "debug", "app-debug.apk")
    if not os.path.exists(apk_source):
        print(f"Error: {apk_source} not found!")
        return False
        
    apk_dest = os.path.join("public", "SuperTelecom.apk")
    shutil.copy2(apk_source, apk_dest)
    
    file_size = os.path.getsize(apk_dest)
    sha256_hash = compute_sha256(apk_dest)
    size_human = human_size(file_size)
    
    print(f"Copied APK to {apk_dest}")
    print(f"File Size: {file_size} bytes ({size_human})")
    print(f"SHA-256: {sha256_hash}")
    
    # 1. Update public/apk-release.json
    release_json_path = os.path.join("public", "apk-release.json")
    with open(release_json_path, "r", encoding="utf-8") as f:
        rel_data = json.load(f)
        
    # Read version info from app/build.gradle.kts
    gradle_path = os.path.join("app", "build.gradle.kts")
    version_name = "3.13.0"
    version_code = 43
    if os.path.exists(gradle_path):
        import re
        with open(gradle_path, "r", encoding="utf-8") as gf:
            gc = gf.read()
            m_name = re.search(r'versionName\s*=\s*"([^"]+)"', gc)
            m_code = re.search(r'versionCode\s*=\s*(\d+)', gc)
            if m_name:
                version_name = m_name.group(1)
            if m_code:
                version_code = int(m_code.group(1))

    rel_data["versionName"] = version_name
    rel_data["versionCode"] = version_code
    rel_data["fileSize"] = file_size
    rel_data["fileSizeHuman"] = size_human
    rel_data["sha256"] = sha256_hash
    rel_data["releaseDate"] = "2026-11-12"
    rel_data["compliance"] = "Privacy & Your Data"
    
    with open(release_json_path, "w", encoding="utf-8") as f:
        json.dump(rel_data, f, indent=2)
    print(f"Updated {release_json_path}")
    
    # 2. Update src/utils/apkDownloadManager.ts
    manager_path = os.path.join("src", "utils", "apkDownloadManager.ts")
    with open(manager_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    import re
    content = re.sub(r'versionName:\s*"[^"]+"', f'versionName: "{version_name}"', content)
    content = re.sub(r'versionCode:\s*\d+', f'versionCode: {version_code}', content)
    content = re.sub(r'fileSize:\s*\d+', f'fileSize: {file_size}', content)
    content = re.sub(r'fileSizeHuman:\s*"[^"]+"', f'fileSizeHuman: "{size_human}"', content)
    content = re.sub(r'sha256:\s*"[^"]+"', f'sha256: "{sha256_hash}"', content)
    content = re.sub(r'releaseDate:\s*"[^"]+"', 'releaseDate: "2026-11-12"', content)
    
    with open(manager_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Updated {manager_path}")
    return True

if __name__ == "__main__":
    main()
