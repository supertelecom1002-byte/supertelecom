package com.supertelecom.feature.update

import android.app.Activity
import android.app.DownloadManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.os.SystemClock
import android.provider.Settings
import android.widget.Toast
import androidx.core.content.FileProvider
import com.supertelecom.BuildConfig
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import org.json.JSONObject
import java.io.BufferedInputStream
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest

data class UpdateMetadata(
    val appName: String,
    val versionName: String,
    val versionCode: Int,
    val packageId: String,
    val fileSize: Long,
    val fileSizeHuman: String,
    val sha256: String,
    val downloadUrl: String,
    val releaseDate: String,
    val features: List<String>
)

sealed class UpdateInstallState {
    object Idle : UpdateInstallState()
    data class Downloading(val progress: Float, val speedMbps: Float, val totalBytes: Long) : UpdateInstallState()
    data class ReadyToInstall(val apkFile: File, val metadata: UpdateMetadata) : UpdateInstallState()
    data class Error(val message: String) : UpdateInstallState()
}

class AppUpdateManager(private val context: Context) {

    private val _updateMetadata = MutableStateFlow<UpdateMetadata?>(null)
    val updateMetadata: StateFlow<UpdateMetadata?> = _updateMetadata.asStateFlow()

    private val _installState = MutableStateFlow<UpdateInstallState>(UpdateInstallState.Idle)
    val installState: StateFlow<UpdateInstallState> = _installState.asStateFlow()

    private val _isChecking = MutableStateFlow(false)
    val isChecking: StateFlow<Boolean> = _isChecking.asStateFlow()

    private val _isDownloading = MutableStateFlow(false)
    val isDownloading: StateFlow<Boolean> = _isDownloading.asStateFlow()

    private val _downloadProgress = MutableStateFlow(0f)
    val downloadProgress: StateFlow<Float> = _downloadProgress.asStateFlow()

    private val _statusMessage = MutableStateFlow<String?>(null)
    val statusMessage: StateFlow<String?> = _statusMessage.asStateFlow()

    private var downloadJob: Job? = null
    var pendingInstallFile: File? = null
        private set

    companion object {
        const val UPDATE_METADATA_URL = "https://www.supertelecom.shop/apk-release.json"
        const val BASE_URL = "https://www.supertelecom.shop"
        const val FILE_PROVIDER_AUTHORITY = "com.supertelecom.app.fileprovider"

        @Volatile
        private var instance: AppUpdateManager? = null

        fun getInstance(context: Context): AppUpdateManager {
            return instance ?: synchronized(this) {
                instance ?: AppUpdateManager(context.applicationContext).also { instance = it }
            }
        }

        /**
         * Computes SHA-256 hexadecimal hash of any local file
         */
        fun calculateFileSha256(file: File): String {
            if (!file.exists() || !file.canRead() || file.length() < 1000L) return ""
            return try {
                val digest = MessageDigest.getInstance("SHA-256")
                FileInputStream(file).use { fis ->
                    val buffer = ByteArray(64 * 1024)
                    var n: Int
                    while (fis.read(buffer).also { n = it } != -1) {
                        digest.update(buffer, 0, n)
                    }
                }
                digest.digest().joinToString("") { "%02x".format(it) }
            } catch (_: Exception) {
                ""
            }
        }
    }

    /**
     * Checks if an authorized newer versionCode exists with cryptographic metadata
     */
    fun checkForUpdates(
        manual: Boolean = false,
        onResult: (Boolean, UpdateMetadata?) -> Unit = { _, _ -> }
    ) {
        if (_isChecking.value) return
        _isChecking.value = true

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val url = URL("$UPDATE_METADATA_URL?_t=${System.currentTimeMillis()}")
                val conn = (url.openConnection() as HttpURLConnection).apply {
                    connectTimeout = 8000
                    readTimeout = 8000
                    instanceFollowRedirects = true
                    requestMethod = "GET"
                    setRequestProperty("User-Agent", "SuperTelecomAndroid/${BuildConfig.VERSION_NAME}")
                    setRequestProperty("Cache-Control", "no-cache, no-store")
                    setRequestProperty("Pragma", "no-cache")
                }

                if (conn.responseCode == 200) {
                    val jsonStr = conn.inputStream.bufferedReader().use { it.readText() }
                    val json = JSONObject(jsonStr)

                    val remotePackageId = json.optString("packageId", "com.supertelecom.app")
                    val remoteVersionCode = json.optInt("versionCode", 0)
                    val remoteVersionName = json.optString("versionName", "")
                    val remoteFileSize = json.optLong("fileSize", 0L)
                    val remoteFileSizeHuman = json.optString("fileSizeHuman", "")
                    val remoteSha256 = json.optString("sha256", "").trim().lowercase()
                    val downloadPath = json.optString("downloadUrl", "/SuperTelecom.apk")
                    val releaseDate = json.optString("releaseDate", "")

                    if (remotePackageId != context.packageName) {
                        withContext(Dispatchers.Main) {
                            _isChecking.value = false
                            _statusMessage.value = "Package ID mismatch: update ignored"
                            onResult(false, null)
                        }
                        return@launch
                    }

                    val featuresList = mutableListOf<String>()
                    val featuresArray = json.optJSONArray("features")
                    if (featuresArray != null) {
                        for (i in 0 until featuresArray.length()) {
                            featuresList.add(featuresArray.getString(i))
                        }
                    }

                    var finalDownloadUrl = if (downloadPath.startsWith("https://") || downloadPath.startsWith("http://")) {
                        downloadPath
                    } else if (downloadPath.startsWith("/")) {
                        "$BASE_URL$downloadPath"
                    } else {
                        "$BASE_URL/$downloadPath"
                    }

                    // Append cache-busting query parameter so CDNs and mobile proxies never serve stale cached APK
                    val separator = if (finalDownloadUrl.contains("?")) "&" else "?"
                    finalDownloadUrl = "$finalDownloadUrl${separator}v=$remoteVersionCode&_t=${System.currentTimeMillis()}"

                    val meta = UpdateMetadata(
                        appName = json.optString("appName", "Super Telecom"),
                        versionName = remoteVersionName,
                        versionCode = remoteVersionCode,
                        packageId = remotePackageId,
                        fileSize = remoteFileSize,
                        fileSizeHuman = remoteFileSizeHuman,
                        sha256 = remoteSha256,
                        downloadUrl = finalDownloadUrl,
                        releaseDate = releaseDate,
                        features = featuresList
                    )

                    withContext(Dispatchers.Main) {
                        val isUpdateAvailable = remoteVersionCode > BuildConfig.VERSION_CODE
                        _updateMetadata.value = if (isUpdateAvailable) meta else null
                        _isChecking.value = false

                        // Check if we already have this exact APK downloaded and verified
                        if (isUpdateAvailable) {
                            val cachedApk = getTargetApkFile(meta)
                            if (cachedApk.exists() && cachedApk.length() > 1_000_000L) {
                                val existingHash = calculateFileSha256(cachedApk)
                                if (meta.sha256.isBlank() || existingHash.equals(meta.sha256, ignoreCase = true)) {
                                    _installState.value = UpdateInstallState.ReadyToInstall(cachedApk, meta)
                                    _downloadProgress.value = 1f
                                    _statusMessage.value = "Verified · Ready to install"
                                } else {
                                    // Stale or corrupted file from previous failed run: purge it!
                                    cachedApk.delete()
                                    _installState.value = UpdateInstallState.Idle
                                }
                            }
                        }

                        if (manual && !isUpdateAvailable) {
                            Toast.makeText(
                                context,
                                "सुपर टेलीकॉम पहले से नवीनतम वर्शन पर है (v${BuildConfig.VERSION_NAME})",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                        onResult(isUpdateAvailable, meta)
                    }
                } else {
                    withContext(Dispatchers.Main) {
                        _isChecking.value = false
                        if (manual) {
                            Toast.makeText(
                                context,
                                "अपडेट सर्वर से संपर्क नहीं हो सका (HTTP ${conn.responseCode})",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                        onResult(false, null)
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    _isChecking.value = false
                    if (manual) {
                        Toast.makeText(
                            context,
                            "अपडेट जांच असफल: ${e.message}",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                    onResult(false, null)
                }
            }
        }
    }

    /**
     * Target APK file stored in internal cache directory (never blocked by Android 11+ Scoped Storage)
     */
    private fun getTargetApkFile(metadata: UpdateMetadata): File {
        val updateDir = File(context.cacheDir, "apk_updates")
        if (!updateDir.exists()) updateDir.mkdirs()
        return File(updateDir, "SuperTelecom-v${metadata.versionName}.apk")
    }

    /**
     * Cancels any active download
     */
    fun cancelDownload() {
        downloadJob?.cancel()
        _isDownloading.value = false
        _downloadProgress.value = 0f
        _statusMessage.value = "डाउनलोड रद्द किया गया"
        _installState.value = UpdateInstallState.Idle
    }

    /**
     * Automatically resumes installation if user returned from Settings Unknown Apps screen
     */
    fun onActivityResume(activity: Activity) {
        val pending = pendingInstallFile ?: return
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            if (activity.packageManager.canRequestPackageInstalls()) {
                pendingInstallFile = null
                triggerPackageInstaller(pending, activity)
            }
        } else {
            pendingInstallFile = null
            triggerPackageInstaller(pending, activity)
        }
    }

    /**
     * Downloads update APK directly into internal cache, verifies SHA-256, and launches PackageInstaller
     */
    fun downloadAndInstallUpdate(metadata: UpdateMetadata, activity: Activity) {
        val targetApk = getTargetApkFile(metadata)

        // If file is already downloaded and verified, launch immediately without re-downloading!
        if (targetApk.exists() && targetApk.length() > 1_000_000L) {
            val existingHash = calculateFileSha256(targetApk)
            if (metadata.sha256.isBlank() || existingHash.equals(metadata.sha256, ignoreCase = true)) {
                _installState.value = UpdateInstallState.ReadyToInstall(targetApk, metadata)
                launchInstallationFlow(targetApk, activity)
                return
            } else {
                targetApk.delete()
            }
        }

        if (_isDownloading.value) return

        _isDownloading.value = true
        _downloadProgress.value = 0f
        _statusMessage.value = "अपडेट सर्वर से जुड़ रहा है..."
        _installState.value = UpdateInstallState.Downloading(0f, 0f, metadata.fileSize)

        downloadJob = CoroutineScope(Dispatchers.IO).launch {
            var tempFile: File? = null
            try {
                var currentUrl = metadata.downloadUrl
                var conn: HttpURLConnection? = null
                var redirects = 0

                while (redirects < 5) {
                    val u = URL(currentUrl)
                    val c = (u.openConnection() as HttpURLConnection).apply {
                        connectTimeout = 15000
                        readTimeout = 40000
                        instanceFollowRedirects = true
                        requestMethod = "GET"
                        setRequestProperty("User-Agent", "SuperTelecomAndroid/${BuildConfig.VERSION_NAME}")
                        setRequestProperty("Accept-Encoding", "identity")
                        setRequestProperty("Cache-Control", "no-cache, no-store")
                        setRequestProperty("Pragma", "no-cache")
                    }
                    val code = c.responseCode
                    if (code in listOf(301, 302, 303, 307, 308)) {
                        val newLocation = c.getHeaderField("Location") ?: break
                        currentUrl = if (newLocation.startsWith("http")) newLocation else URL(u, newLocation).toString()
                        c.disconnect()
                        redirects++
                    } else {
                        conn = c
                        break
                    }
                }

                if (conn == null || conn.responseCode != 200) {
                    throw IllegalStateException("सर्वर त्रुटि: HTTP ${conn?.responseCode ?: -1}")
                }

                val headerLength = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                    conn.contentLengthLong
                } else {
                    conn.contentLength.toLong()
                }
                val contentLength = if (headerLength > 0) headerLength else metadata.fileSize

                val updateDir = File(context.cacheDir, "apk_updates")
                if (!updateDir.exists()) updateDir.mkdirs()

                tempFile = File(updateDir, "SuperTelecom-v${metadata.versionName}.tmp")
                val finalApkFile = File(updateDir, "SuperTelecom-v${metadata.versionName}.apk")

                if (tempFile.exists()) tempFile.delete()
                if (finalApkFile.exists()) finalApkFile.delete()

                val inStream = BufferedInputStream(conn.inputStream)
                val outStream = FileOutputStream(tempFile)
                val digest = MessageDigest.getInstance("SHA-256")

                val buffer = ByteArray(64 * 1024)
                var bytesRead: Int
                var totalBytesRead = 0L
                var lastTime = SystemClock.elapsedRealtime()
                var bytesSinceLast = 0L
                var speedMbps = 0f

                withContext(Dispatchers.Main) {
                    _statusMessage.value = "अपडेट डाउनलोड हो रहा है..."
                }

                while (inStream.read(buffer).also { bytesRead = it } != -1) {
                    if (!isActive) {
                        outStream.close()
                        inStream.close()
                        tempFile.delete()
                        return@launch
                    }

                    outStream.write(buffer, 0, bytesRead)
                    digest.update(buffer, 0, bytesRead)
                    totalBytesRead += bytesRead
                    bytesSinceLast += bytesRead

                    val now = SystemClock.elapsedRealtime()
                    if (now - lastTime >= 400) {
                        val dt = (now - lastTime) / 1000f
                        speedMbps = if (dt > 0) (bytesSinceLast * 8f / 1_000_000f) / dt else 0f
                        lastTime = now
                        bytesSinceLast = 0L

                        val progress = if (contentLength > 0) {
                            (totalBytesRead.toFloat() / contentLength).coerceIn(0f, 1f)
                        } else 0.5f

                        val readMb = totalBytesRead / (1024f * 1024f)
                        val totalMb = contentLength / (1024f * 1024f)
                        val statusText = "डाउनलोड: %.1f MB / %.1f MB (%.1f Mbps)".format(readMb, totalMb, speedMbps)

                        withContext(Dispatchers.Main) {
                            _downloadProgress.value = progress
                            _statusMessage.value = statusText
                            _installState.value = UpdateInstallState.Downloading(progress, speedMbps, totalBytesRead)
                        }
                    }
                }

                outStream.flush()
                outStream.close()
                inStream.close()

                if (totalBytesRead < 1_000_000L) {
                    tempFile.delete()
                    throw IllegalStateException("डाउनलोड अधूरा रह गया (${totalBytesRead} बाइट्स प्राप्त हुए)")
                }

                val calculatedHash = digest.digest().joinToString("") { "%02x".format(it) }
                if (metadata.sha256.isNotBlank() && !calculatedHash.equals(metadata.sha256, ignoreCase = true)) {
                    tempFile.delete()
                    throw SecurityException("सुरक्षा सत्यापन असफल: SHA-256 मेल नहीं खाया (${calculatedHash.take(8)} != ${metadata.sha256.take(8)})")
                }

                if (!tempFile.renameTo(finalApkFile)) {
                    tempFile.copyTo(finalApkFile, overwrite = true)
                    tempFile.delete()
                }

                withContext(Dispatchers.Main) {
                    _isDownloading.value = false
                    _downloadProgress.value = 1f
                    _statusMessage.value = "सत्यापित · इंस्टॉल करने के लिए तैयार"
                    _installState.value = UpdateInstallState.ReadyToInstall(finalApkFile, metadata)

                    launchInstallationFlow(finalApkFile, activity)
                }

            } catch (e: Exception) {
                tempFile?.delete()
                withContext(Dispatchers.Main) {
                    _isDownloading.value = false
                    val errorMsg = e.localizedMessage ?: "डाउनलोड असफल रहा"
                    _statusMessage.value = "अपडेट त्रुटि: $errorMsg"
                    _installState.value = UpdateInstallState.Error(errorMsg)
                }
            }
        }
    }

    /**
     * Checks unknown sources permission and triggers native PackageInstaller
     */
    private fun launchInstallationFlow(apkFile: File, activity: Activity) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            if (!activity.packageManager.canRequestPackageInstalls()) {
                pendingInstallFile = apkFile
                try {
                    val settingsIntent = Intent(
                        Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                        Uri.parse("package:${activity.packageName}")
                    ).apply {
                        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    }
                    activity.startActivity(settingsIntent)
                    _statusMessage.value = "कृपया 'Allow from this source' चालू करें और वापस आएं"
                    Toast.makeText(
                        activity,
                        "कृपया सुपर टेलीकॉम के लिए अज्ञात ऐप्स (Unknown Apps) की अनुमति दें",
                        Toast.LENGTH_LONG
                    ).show()
                } catch (_: Exception) {
                    triggerPackageInstaller(apkFile, activity)
                }
                return
            }
        }

        triggerPackageInstaller(apkFile, activity)
    }

    /**
     * Launches native Android PackageInstaller with complete multi-package URI permissions
     */
    fun triggerPackageInstaller(apkFile: File, activity: Activity) {
        try {
            if (!apkFile.exists() || apkFile.length() < 1_000_000L) {
                _statusMessage.value = "APK फाइल अमान्य है। कृपया पुनः डाउनलोड करें।"
                _installState.value = UpdateInstallState.Error("APK फाइल अमान्य है। कृपया पुनः डाउनलोड करें।")
                return
            }

            val apkUri: Uri = FileProvider.getUriForFile(
                activity,
                FILE_PROVIDER_AUTHORITY,
                apkFile
            )

            val installIntent = Intent(Intent.ACTION_VIEW).apply {
                setDataAndType(apkUri, "application/vnd.android.package-archive")
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION)
            }

            // Explicitly grant read/write URI permission to every resolving package installer component
            val resolveInfoList = activity.packageManager.queryIntentActivities(installIntent, PackageManager.MATCH_DEFAULT_ONLY)
            for (resolveInfo in resolveInfoList) {
                val packageName = resolveInfo.activityInfo.packageName
                activity.grantUriPermission(
                    packageName,
                    apkUri,
                    Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_GRANT_WRITE_URI_PERMISSION
                )
            }

            activity.startActivity(installIntent)
        } catch (e: Exception) {
            Toast.makeText(activity, "पैकेज इंस्टॉलर शुरू नहीं हो सका: ${e.message}", Toast.LENGTH_LONG).show()
            triggerBrowserDownloadFallback(activity)
        }
    }

    /**
     * Fallback to system DownloadManager (runs in Android OS background with permanent notification)
     */
    fun downloadViaSystemDownloadManager(metadata: UpdateMetadata) {
        try {
            val dm = context.getSystemService(Context.DOWNLOAD_SERVICE) as? DownloadManager ?: return
            val downloadUrl = if (metadata.downloadUrl.contains("?")) {
                "${metadata.downloadUrl}&t=${System.currentTimeMillis()}"
            } else {
                "${metadata.downloadUrl}?t=${System.currentTimeMillis()}"
            }
            val request = DownloadManager.Request(Uri.parse(downloadUrl)).apply {
                setTitle("Super Telecom v${metadata.versionName}")
                setDescription("Official Native Update (${metadata.fileSizeHuman})")
                setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, "SuperTelecom-Release-v${metadata.versionName}.apk")
                setMimeType("application/vnd.android.package-archive")
                setAllowedOverMetered(true)
                setAllowedOverRoaming(true)
            }
            dm.enqueue(request)
            Toast.makeText(context, "डाउनलोड शुरू हो गया है। नोटिफिकेशन बार में देखें।", Toast.LENGTH_LONG).show()
        } catch (e: Exception) {
            _statusMessage.value = "DownloadManager error: ${e.localizedMessage}"
        }
    }

    /**
     * Direct browser download fallback
     */
    fun triggerBrowserDownloadFallback(activity: Activity) {
        try {
            val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse(BASE_URL + "/SuperTelecom.apk?t=" + System.currentTimeMillis())).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            activity.startActivity(browserIntent)
        } catch (_: Exception) {}
    }
}
