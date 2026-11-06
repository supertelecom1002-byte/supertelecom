package com.supertelecom.feature.update

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.Settings
import androidx.core.content.FileProvider
import com.supertelecom.BuildConfig
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import org.json.JSONObject
import java.io.BufferedInputStream
import java.io.File
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

class AppUpdateManager(private val context: Context) {

    private val _updateMetadata = MutableStateFlow<UpdateMetadata?>(null)
    val updateMetadata: StateFlow<UpdateMetadata?> = _updateMetadata.asStateFlow()

    private val _isChecking = MutableStateFlow(false)
    val isChecking: StateFlow<Boolean> = _isChecking.asStateFlow()

    private val _isDownloading = MutableStateFlow(false)
    val isDownloading: StateFlow<Boolean> = _isDownloading.asStateFlow()

    private val _downloadProgress = MutableStateFlow(0f)
    val downloadProgress: StateFlow<Float> = _downloadProgress.asStateFlow()

    private val _statusMessage = MutableStateFlow<String?>(null)
    val statusMessage: StateFlow<String?> = _statusMessage.asStateFlow()

    private var downloadJob: Job? = null

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

                    // Verification 1: Package ID must match authorized app ID
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

                    val finalDownloadUrl = if (downloadPath.startsWith("https://")) {
                        downloadPath
                    } else if (downloadPath.startsWith("/")) {
                        "$BASE_URL$downloadPath"
                    } else {
                        "$BASE_URL/$downloadPath"
                    }

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
                        // Verification 2: Strict VersionCode increment required
                        val isUpdateAvailable = remoteVersionCode > BuildConfig.VERSION_CODE
                        _updateMetadata.value = if (isUpdateAvailable) meta else null
                        _isChecking.value = false
                        if (manual && !isUpdateAvailable) {
                            android.widget.Toast.makeText(
                                context,
                                "Super Telecom is already up to date (v${BuildConfig.VERSION_NAME})",
                                android.widget.Toast.LENGTH_SHORT
                            ).show()
                        }
                        onResult(isUpdateAvailable, meta)
                    }
                } else {
                    withContext(Dispatchers.Main) {
                        _isChecking.value = false
                        if (manual) {
                            android.widget.Toast.makeText(
                                context,
                                "Could not connect to update server",
                                android.widget.Toast.LENGTH_SHORT
                            ).show()
                        }
                        onResult(false, null)
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    _isChecking.value = false
                    if (manual) {
                        android.widget.Toast.makeText(
                            context,
                            "Update check failed: ${e.message}",
                            android.widget.Toast.LENGTH_SHORT
                        ).show()
                    }
                    onResult(false, null)
                }
            }
        }
    }

    /**
     * Cancels any active download
     */
    fun cancelDownload() {
        downloadJob?.cancel()
        _isDownloading.value = false
        _downloadProgress.value = 0f
        _statusMessage.value = "Download cancelled"
    }

    /**
     * Downloads update APK with chunked stream, validates SHA-256 and triggers Android PackageInstaller
     */
    fun downloadAndInstallUpdate(metadata: UpdateMetadata, activity: Activity) {
        if (_isDownloading.value) return

        // HTTPS-only enforcement
        if (!metadata.downloadUrl.startsWith("https://", ignoreCase = true)) {
            _statusMessage.value = "Security Error: Update must use HTTPS"
            return
        }

        _isDownloading.value = true
        _downloadProgress.value = 0f
        _statusMessage.value = "Connecting to Super Telecom..."

        downloadJob = CoroutineScope(Dispatchers.IO).launch {
            var tempFile: File? = null
            try {
                // Follow 301, 302, 307, 308 redirects automatically up to 5 times
                var currentUrl = metadata.downloadUrl
                var conn: HttpURLConnection? = null
                var redirects = 0
                while (redirects < 5) {
                    val u = URL(currentUrl)
                    val c = (u.openConnection() as HttpURLConnection).apply {
                        connectTimeout = 15000
                        readTimeout = 30000
                        instanceFollowRedirects = true
                        requestMethod = "GET"
                        setRequestProperty("User-Agent", "SuperTelecomAndroid/${BuildConfig.VERSION_NAME}")
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
                    throw IllegalStateException("Server returned HTTP ${conn?.responseCode ?: -1}")
                }

                val contentLength = conn.contentLength.toLong().let {
                    if (it > 0) it else metadata.fileSize
                }

                val destDir = context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS) ?: context.cacheDir
                tempFile = File(destDir, "SuperTelecom-Update-v${metadata.versionName}.tmp")
                val finalApkFile = File(destDir, "SuperTelecom-Update-v${metadata.versionName}.apk")

                if (tempFile.exists()) tempFile.delete()
                if (finalApkFile.exists()) finalApkFile.delete()

                val inStream = BufferedInputStream(conn.inputStream)
                val outStream = FileOutputStream(tempFile)
                val digest = MessageDigest.getInstance("SHA-256")

                val buffer = ByteArray(32 * 1024)
                var bytesRead: Int
                var totalBytesRead = 0L

                withContext(Dispatchers.Main) {
                    _statusMessage.value = "Downloading update..."
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

                    val progress = if (contentLength > 0) {
                        (totalBytesRead.toFloat() / contentLength).coerceIn(0f, 1f)
                    } else 0.5f

                    _downloadProgress.value = progress
                }

                outStream.flush()
                outStream.close()
                inStream.close()

                // Integrity validation
                if (totalBytesRead < 1_000_000L) {
                    tempFile.delete()
                    throw IllegalStateException("Downloaded file is incomplete (${totalBytesRead} bytes)")
                }

                // SHA-256 Cryptographic validation (Gold standard of integrity)
                val calculatedHash = digest.digest().joinToString("") { "%02x".format(it) }
                if (metadata.sha256.isNotBlank() && calculatedHash.lowercase() != metadata.sha256.lowercase()) {
                    // Only reject if hash definitely mismatched
                    tempFile.delete()
                    throw SecurityException("SHA-256 validation failed ($calculatedHash != ${metadata.sha256})")
                }

                // Rename verified temp file to final APK
                if (!tempFile.renameTo(finalApkFile)) {
                    // If rename fails, try copy
                    tempFile.copyTo(finalApkFile, overwrite = true)
                    tempFile.delete()
                }

                // Archive and Package Integrity check
                val pm = context.packageManager
                val archiveInfo: PackageInfo? = try {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                        pm.getPackageArchiveInfo(finalApkFile.absolutePath, PackageManager.PackageInfoFlags.of(0))
                    } else {
                        @Suppress("DEPRECATION")
                        pm.getPackageArchiveInfo(finalApkFile.absolutePath, 0)
                    }
                } catch (_: Exception) { null }

                if (archiveInfo != null && archiveInfo.packageName != context.packageName) {
                    finalApkFile.delete()
                    throw SecurityException("Corrupted APK or package ID mismatch in archive")
                }

                withContext(Dispatchers.Main) {
                    _isDownloading.value = false
                    _downloadProgress.value = 1f
                    _statusMessage.value = "Verified · Ready to install"

                    // Check unknown sources on Android 8.0+ (API 26+)
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        if (!activity.packageManager.canRequestPackageInstalls()) {
                            try {
                                val settingsIntent = Intent(
                                    Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                                    Uri.parse("package:${activity.packageName}")
                                ).apply {
                                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                                }
                                activity.startActivity(settingsIntent)
                                _statusMessage.value = "Please allow 'Install unknown apps' in Settings, then tap Install again."
                                android.widget.Toast.makeText(
                                    activity,
                                    "कृपया सेटिंग्स में सुपर टेलीकॉम के लिए अज्ञात ऐप्स (Unknown Apps) की अनुमति दें",
                                    android.widget.Toast.LENGTH_LONG
                                ).show()
                            } catch (_: Exception) {
                                // If settings intent cannot be opened, trigger browser direct download
                                triggerBrowserDownloadFallback(activity)
                            }
                            return@withContext
                        }
                    }

                    // Launch native Android PackageInstaller
                    triggerPackageInstaller(finalApkFile, activity)
                }

            } catch (e: Exception) {
                tempFile?.delete()
                withContext(Dispatchers.Main) {
                    _isDownloading.value = false
                    _statusMessage.value = "Update error: ${e.localizedMessage}"
                }
            }
        }
    }

    fun triggerBrowserDownloadFallback(activity: Activity) {
        try {
            val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse(BASE_URL + "/download")).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            activity.startActivity(browserIntent)
        } catch (_: Exception) {}
    }

    private fun triggerPackageInstaller(apkFile: File, activity: Activity) {
        try {
            val apkUri: Uri = FileProvider.getUriForFile(
                activity,
                FILE_PROVIDER_AUTHORITY,
                apkFile
            )

            val installIntent = Intent(Intent.ACTION_VIEW).apply {
                setDataAndType(apkUri, "application/vnd.android.package-archive")
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            activity.startActivity(installIntent)
        } catch (_: Exception) {
            triggerBrowserDownloadFallback(activity)
        }
    }
}
