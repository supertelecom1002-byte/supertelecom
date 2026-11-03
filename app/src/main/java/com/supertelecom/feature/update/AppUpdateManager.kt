package com.supertelecom.feature.update

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Environment
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

data class UpdateMetadata(
    val appName: String,
    val versionName: String,
    val versionCode: Int,
    val fileSizeHuman: String,
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

    companion object {
        const val UPDATE_METADATA_URL = "https://www.supertelecom.shop/apk-release.json"
        const val BASE_URL = "https://www.supertelecom.shop"
    }

    /**
     * Checks if a newer versionCode is available on supertelecom.shop
     */
    fun checkForUpdates(onResult: (Boolean, UpdateMetadata?) -> Unit = { _, _ -> }) {
        if (_isChecking.value) return
        _isChecking.value = true

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val url = URL(UPDATE_METADATA_URL)
                val conn = (url.openConnection() as HttpURLConnection).apply {
                    connectTimeout = 8000
                    readTimeout = 8000
                    requestMethod = "GET"
                    setRequestProperty("User-Agent", "SuperTelecomAndroid/${BuildConfig.VERSION_NAME}")
                }

                if (conn.responseCode == 200) {
                    val jsonStr = conn.inputStream.bufferedReader().use { it.readText() }
                    val json = JSONObject(jsonStr)

                    val remoteVersionCode = json.optInt("versionCode", 0)
                    val remoteVersionName = json.optString("versionName", "")
                    val remoteFileSize = json.optString("fileSizeHuman", "")
                    val downloadPath = json.optString("downloadUrl", "/SuperTelecom.apk")
                    val releaseDate = json.optString("releaseDate", "")

                    val featuresList = mutableListOf<String>()
                    val featuresArray = json.optJSONArray("features")
                    if (featuresArray != null) {
                        for (i in 0 until featuresArray.length()) {
                            featuresList.add(featuresArray.getString(i))
                        }
                    }

                    val meta = UpdateMetadata(
                        appName = json.optString("appName", "Super Telecom"),
                        versionName = remoteVersionName,
                        versionCode = remoteVersionCode,
                        fileSizeHuman = remoteFileSize,
                        downloadUrl = if (downloadPath.startsWith("http")) downloadPath else "$BASE_URL$downloadPath",
                        releaseDate = releaseDate,
                        features = featuresList
                    )

                    withContext(Dispatchers.Main) {
                        val isUpdateAvailable = remoteVersionCode > BuildConfig.VERSION_CODE
                        if (isUpdateAvailable) {
                            _updateMetadata.value = meta
                        } else {
                            _updateMetadata.value = null
                        }
                        _isChecking.value = false
                        onResult(isUpdateAvailable, meta)
                    }
                } else {
                    withContext(Dispatchers.Main) {
                        _isChecking.value = false
                        onResult(false, null)
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    _isChecking.value = false
                    onResult(false, null)
                }
            }
        }
    }

    /**
     * Downloads update APK with chunked stream & triggers Android PackageInstaller in-place update
     */
    fun downloadAndInstallUpdate(metadata: UpdateMetadata, activity: Activity) {
        if (_isDownloading.value) return
        _isDownloading.value = true
        _downloadProgress.value = 0f
        _statusMessage.value = "Downloading update..."

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val url = URL(metadata.downloadUrl)
                val conn = (url.openConnection() as HttpURLConnection).apply {
                    connectTimeout = 15000
                    readTimeout = 30000
                    requestMethod = "GET"
                }

                val contentLength = conn.contentLength.coerceAtLeast(1)
                val destDir = context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS) ?: context.cacheDir
                val apkFile = File(destDir, "SuperTelecom-Update-v${metadata.versionName}.apk")
                if (apkFile.exists()) apkFile.delete()

                val inStream = BufferedInputStream(conn.inputStream)
                val outStream = FileOutputStream(apkFile)

                val buffer = ByteArray(32 * 1024)
                var bytesRead: Int
                var totalBytesRead = 0L

                while (inStream.read(buffer).also { bytesRead = it } != -1) {
                    outStream.write(buffer, 0, bytesRead)
                    totalBytesRead += bytesRead
                    val progress = (totalBytesRead.toFloat() / contentLength).coerceIn(0f, 1f)
                    _downloadProgress.value = progress
                }

                outStream.flush()
                outStream.close()
                inStream.close()

                withContext(Dispatchers.Main) {
                    _isDownloading.value = false
                    _downloadProgress.value = 1f
                    _statusMessage.value = "Ready to install update"

                    // Launch native Android PackageInstaller
                    triggerPackageInstaller(apkFile, activity)
                }

            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    _isDownloading.value = false
                    _statusMessage.value = "Download failed: ${e.localizedMessage}"
                }
            }
        }
    }

    private fun triggerPackageInstaller(apkFile: File, activity: Activity) {
        try {
            val apkUri: Uri = FileProvider.getUriForFile(
                activity,
                "com.supertelecom.app.fileprovider",
                apkFile
            )

            val installIntent = Intent(Intent.ACTION_VIEW).apply {
                setDataAndType(apkUri, "application/vnd.android.package-archive")
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_GRANT_READ_URI_PERMISSION
            }
            activity.startActivity(installIntent)
        } catch (e: Exception) {
            _statusMessage.value = "Installation error: ${e.localizedMessage}"
        }
    }
}
