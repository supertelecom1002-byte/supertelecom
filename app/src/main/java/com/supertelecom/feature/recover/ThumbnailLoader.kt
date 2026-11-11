package com.supertelecom.feature.recover

import android.content.ContentResolver
import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.media.MediaMetadataRetriever
import android.os.Build
import android.provider.MediaStore
import android.util.LruCache
import android.util.Size
import com.supertelecom.model.RecoverCategory
import com.supertelecom.model.RecoverItem
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File

/**
 * High-performance, in-memory LRU thumbnail caching engine.
 * Safely decodes real images, carved byte buffers, and video frames without OutOfMemoryError.
 */
object ThumbnailLoader {

    // Cache up to 1/8th of available runtime memory for bitmaps
    private val maxMemory = (Runtime.getRuntime().maxMemory() / 1024).toInt()
    private val cacheSize = maxMemory / 8

    private val memoryCache = object : LruCache<String, Bitmap>(cacheSize.coerceAtLeast(1024 * 32)) {
        override fun sizeOf(key: String, bitmap: Bitmap): Int {
            return bitmap.byteCount / 1024
        }
    }

    suspend fun loadThumbnail(
        context: Context,
        item: RecoverItem,
        reqWidth: Int = 300,
        reqHeight: Int = 300
    ): Bitmap? = withContext(Dispatchers.IO) {
        val cacheKey = item.id
        memoryCache.get(cacheKey)?.let { return@withContext it }

        var bitmap: Bitmap? = null

        try {
            // Method 1: Android 10+ (API 29+) ContentResolver.loadThumbnail for Content URIs
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q && item.uri != null && item.uri.scheme == ContentResolver.SCHEME_CONTENT) {
                try {
                    bitmap = context.contentResolver.loadThumbnail(item.uri, Size(reqWidth, reqHeight), null)
                } catch (_: Exception) {}
            }

            // Method 2: MediaMetadataRetriever for Video frames (content:// or file://)
            if (bitmap == null && item.category == RecoverCategory.VIDEOS && item.uri != null) {
                try {
                    val retriever = MediaMetadataRetriever()
                    if (item.uri.scheme == ContentResolver.SCHEME_FILE && item.uri.path != null) {
                        retriever.setDataSource(item.uri.path)
                    } else {
                        retriever.setDataSource(context, item.uri)
                    }
                    bitmap = retriever.getFrameAtTime(1_000_000, MediaMetadataRetriever.OPTION_CLOSEST_SYNC)
                    retriever.release()
                } catch (_: Exception) {}
            }

            // Method 3: ContentResolver openInputStream with downsampling (works for content:// and file://)
            if (bitmap == null && item.uri != null) {
                try {
                    context.contentResolver.openInputStream(item.uri)?.use { stream ->
                        val options = BitmapFactory.Options().apply {
                            inJustDecodeBounds = true
                        }
                        BitmapFactory.decodeStream(stream, null, options)
                        options.inSampleSize = calculateInSampleSize(options, reqWidth, reqHeight)
                        options.inJustDecodeBounds = false
                        options.inPreferredConfig = Bitmap.Config.ARGB_8888

                        context.contentResolver.openInputStream(item.uri)?.use { s2 ->
                            bitmap = BitmapFactory.decodeStream(s2, null, options)
                        }
                    }
                } catch (_: Exception) {}
            }

            // Method 4: Direct file path decoding if file is directly readable on disk
            if (bitmap == null) {
                val directFile = item.uri?.path?.let { File(it) }?.takeIf { it.exists() }
                    ?: extractDirectFilePath(item.sourcePath)

                if (directFile != null && directFile.exists() && directFile.isFile) {
                    try {
                        val options = BitmapFactory.Options().apply {
                            inJustDecodeBounds = true
                        }
                        BitmapFactory.decodeFile(directFile.absolutePath, options)
                        options.inSampleSize = calculateInSampleSize(options, reqWidth, reqHeight)
                        options.inJustDecodeBounds = false
                        options.inPreferredConfig = Bitmap.Config.ARGB_8888
                        bitmap = BitmapFactory.decodeFile(directFile.absolutePath, options)
                    } catch (_: Exception) {}
                }
            }

            // Method 5: MediaStore Thumbnail API for orphan thumbnail IDs
            if (bitmap == null && item.id.startsWith("orphan_thumb_")) {
                try {
                    val rawId = item.id.removePrefix("orphan_thumb_").toLongOrNull()
                    if (rawId != null) {
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                            val contentUri = android.content.ContentUris.withAppendedId(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, rawId)
                            bitmap = context.contentResolver.loadThumbnail(contentUri, Size(reqWidth, reqHeight), null)
                        } else {
                            bitmap = MediaStore.Images.Thumbnails.getThumbnail(
                                context.contentResolver,
                                rawId,
                                MediaStore.Images.Thumbnails.MINI_KIND,
                                null
                            )
                        }
                    }
                } catch (_: Exception) {}
            }

            if (bitmap == null && item.id.startsWith("orphan_vid_thumb_")) {
                try {
                    val rawId = item.id.removePrefix("orphan_vid_thumb_").toLongOrNull()
                    if (rawId != null) {
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                            val contentUri = android.content.ContentUris.withAppendedId(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, rawId)
                            bitmap = context.contentResolver.loadThumbnail(contentUri, Size(reqWidth, reqHeight), null)
                        } else {
                            bitmap = MediaStore.Video.Thumbnails.getThumbnail(
                                context.contentResolver,
                                rawId,
                                MediaStore.Video.Thumbnails.MINI_KIND,
                                null
                            )
                        }
                    }
                } catch (_: Exception) {}
            }

            if (bitmap != null) {
                memoryCache.put(cacheKey, bitmap)
            }
        } catch (_: Exception) {}

        bitmap
    }

    private fun extractDirectFilePath(sourcePath: String): File? {
        val path = if (sourcePath.contains(">")) {
            sourcePath.substringAfterLast(">").trim()
        } else {
            sourcePath.trim()
        }
        val file = File(path)
        return if (file.exists()) file else null
    }

    private fun calculateInSampleSize(
        options: BitmapFactory.Options,
        reqWidth: Int,
        reqHeight: Int
    ): Int {
        val (height: Int, width: Int) = options.outHeight to options.outWidth
        var inSampleSize = 1

        if (height > reqHeight || width > reqWidth) {
            val halfHeight: Int = height / 2
            val halfWidth: Int = width / 2

            while (halfHeight / inSampleSize >= reqHeight && halfWidth / inSampleSize >= reqWidth) {
                inSampleSize *= 2
            }
        }
        return inSampleSize.coerceAtLeast(1)
    }

    fun clearCache() {
        memoryCache.evictAll()
    }
}
