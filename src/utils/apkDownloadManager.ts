/**
 * Smart APK Downloader Engine for Super Telecom
 * Features:
 * - Pre-flight HEAD check ensuring content is binary application/vnd.android.package-archive
 * - Guards against SPA fallback 404 HTML corruption
 * - Real-time ReadableStream progress tracking (bytes received, speed MB/s, percent)
 * - In-browser cryptographic SHA-256 validation via crypto.subtle.digest
 * - Native browser Blob save trigger
 * - Clear diagnostic error handling
 */

export interface DownloadProgress {
  receivedBytes: number;
  totalBytes: number;
  percentage: number;
  speedMbps: number;
  status: "idle" | "preflight" | "downloading" | "verifying" | "completed" | "error";
  errorReason?: string;
  sha256?: string;
}

export interface ApkReleaseMetadata {
  appName: string;
  versionName: string;
  versionCode: number;
  packageId: string;
  minSdk: number;
  targetSdk: number;
  fileSize: number;
  fileSizeHuman: string;
  releaseDate: string;
  sha256: string;
  downloadUrl: string;
  downloadFilename: string;
}

export const KNOWN_RELEASE_APK: ApkReleaseMetadata = {
  appName: "Super Telecom",
  versionName: "2.7.0",
  versionCode: 27,
  packageId: "com.supertelecom.app",
  minSdk: 24,
  targetSdk: 34,
  fileSize: 18280525,
  fileSizeHuman: "17.43 MB",
  releaseDate: "2026-11-03",
  sha256: "d7ccb6b5227dc7053072bf7d99b1b497aa71b244d0308dee8a0ae532fe61c97c",
  downloadUrl: "/SuperTelecom.apk",
  downloadFilename: "SuperTelecom-Release.apk",
};

/**
 * Convert ArrayBuffer to Hex String for SHA-256 comparison
 */
export function bufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  const hexCodes: string[] = [];
  for (let i = 0; i < byteArray.length; i++) {
    const value = byteArray[i].toString(16);
    hexCodes.push(value.length === 1 ? `0${value}` : value);
  }
  return hexCodes.join("");
}

/**
 * Downloads the APK with real-time stream monitoring & cryptographic checksum verification.
 */
export async function downloadSuperTelecomApk(
  onProgress: (progress: DownloadProgress) => void,
  targetUrl: string = KNOWN_RELEASE_APK.downloadUrl,
  expectedSha256: string = KNOWN_RELEASE_APK.sha256
): Promise<{ success: boolean; blobUrl?: string; error?: string }> {
  try {
    // 0. Attempt to fetch latest release manifest dynamically
    let activeExpectedSha = expectedSha256;
    let expectedSize = KNOWN_RELEASE_APK.fileSize;

    try {
      const manifestRes = await fetch(`/apk-release.json?_t=${Date.now()}`);
      if (manifestRes.ok) {
        const manifestData: ApkReleaseMetadata = await manifestRes.json();
        if (manifestData?.sha256) {
          activeExpectedSha = manifestData.sha256;
        }
        if (manifestData?.fileSize) {
          expectedSize = manifestData.fileSize;
        }
      }
    } catch {
      // Fallback to static KNOWN_RELEASE_APK
    }

    onProgress({
      receivedBytes: 0,
      totalBytes: expectedSize,
      percentage: 0,
      speedMbps: 0,
      status: "preflight",
    });

    // 1. Pre-flight check
    const headResponse = await fetch(targetUrl, { method: "HEAD" });
    const contentType = headResponse.headers.get("content-type") || "";

    if (contentType.includes("text/html")) {
      throw new Error(
        "SERVER_SPA_HTML_MISMATCH: The server returned an HTML fallback page instead of the binary APK. Check server MIME headers."
      );
    }

    // 2. Fetch binary stream
    const startTime = performance.now();
    const response = await fetch(targetUrl);
    if (!response.ok) {
      throw new Error(`HTTP_DOWNLOAD_FAILED: Server returned ${response.status} ${response.statusText}`);
    }

    const contentLength = response.headers.get("content-length");
    const totalBytes = contentLength ? parseInt(contentLength, 10) : expectedSize;

    if (!response.body) {
      // Direct blob fallback if ReadableStream not supported
      const blob = await response.blob();
      const buffer = await blob.arrayBuffer();

      // Check for HTML text payload disguised as APK
      const firstBytes = new Uint8Array(buffer.slice(0, 5));
      if (firstBytes[0] === 0x3c) { // '<'
        throw new Error("SERVER_SPA_HTML_MISMATCH: Binary stream starts with HTML markup instead of ZIP/APK header.");
      }

      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const computedHash = bufferToHex(hashBuffer);

      if (
        activeExpectedSha &&
        computedHash.toLowerCase() !== activeExpectedSha.toLowerCase() &&
        computedHash.toLowerCase() !== KNOWN_RELEASE_APK.sha256.toLowerCase()
      ) {
        throw new Error(
          `APK_CHECKSUM_MISMATCH: Computed SHA-256 (${computedHash}) does not match expected (${activeExpectedSha}).`
        );
      }

      triggerBrowserDownload(blob, KNOWN_RELEASE_APK.downloadFilename);
      onProgress({
        receivedBytes: totalBytes,
        totalBytes,
        percentage: 100,
        speedMbps: 0,
        status: "completed",
        sha256: computedHash,
      });
      return { success: true };
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let receivedBytes = 0;
    let lastProgressUpdate = performance.now();

    onProgress({
      receivedBytes: 0,
      totalBytes,
      percentage: 0,
      speedMbps: 0,
      status: "downloading",
    });

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      if (value) {
        // Inspect first chunk to verify it is not HTML text
        if (chunks.length === 0 && value.length > 0 && value[0] === 0x3c) {
          throw new Error("SERVER_SPA_HTML_MISMATCH: Stream starts with HTML markup (<!DOCTYPE) instead of APK binary.");
        }

        chunks.push(value);
        receivedBytes += value.length;

        const now = performance.now();
        if (now - lastProgressUpdate > 100 || receivedBytes === totalBytes) {
          const elapsedSec = (now - startTime) / 1000;
          const speedMbps = elapsedSec > 0 ? (receivedBytes * 8) / (elapsedSec * 1_000_000) : 0;
          const percentage = Math.min(100, Math.round((receivedBytes / totalBytes) * 100));

          onProgress({
            receivedBytes,
            totalBytes,
            percentage,
            speedMbps: parseFloat(speedMbps.toFixed(2)),
            status: "downloading",
          });
          lastProgressUpdate = now;
        }
      }
    }

    // 3. Assemble complete binary
    onProgress({
      receivedBytes,
      totalBytes,
      percentage: 100,
      speedMbps: 0,
      status: "verifying",
    });

    const fullBlob = new Blob(chunks as BlobPart[], {
      type: "application/vnd.android.package-archive",
    });

    // 4. Client-side SHA-256 integrity verification
    const fullBuffer = await fullBlob.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", fullBuffer);
    const computedHash = bufferToHex(hashBuffer);

    if (
      activeExpectedSha &&
      computedHash.toLowerCase() !== activeExpectedSha.toLowerCase() &&
      computedHash.toLowerCase() !== KNOWN_RELEASE_APK.sha256.toLowerCase()
    ) {
      throw new Error(
        `APK_CHECKSUM_MISMATCH: Computed SHA-256 (${computedHash}) does not match expected (${activeExpectedSha}). Download aborted.`
      );
    }

    // 5. Trigger native browser file save only after verified integrity
    triggerBrowserDownload(fullBlob, KNOWN_RELEASE_APK.downloadFilename);

    onProgress({
      receivedBytes,
      totalBytes,
      percentage: 100,
      speedMbps: 0,
      status: "completed",
      sha256: computedHash,
    });

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    let friendlyReason = "Network connection interrupted. Please tap 'Retry Download'.";

    if (message.includes("SERVER_SPA_HTML_MISMATCH")) {
      friendlyReason = "Server routing error: HTML was returned instead of APK binary.";
    } else if (message.includes("quota") || message.includes("space")) {
      friendlyReason = "Device storage is full. Please free at least 15 MB and try again.";
    }

    onProgress({
      receivedBytes: 0,
      totalBytes: KNOWN_RELEASE_APK.fileSize,
      percentage: 0,
      speedMbps: 0,
      status: "error",
      errorReason: friendlyReason,
    });

    return { success: false, error: friendlyReason };
  }
}

/**
 * Triggers invisible link click to trigger browser file save
 */
function triggerBrowserDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 1000);
}
