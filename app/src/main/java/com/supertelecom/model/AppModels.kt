package com.supertelecom.model

import android.graphics.drawable.Drawable
import android.net.Uri

// ──────────────────────────────────────────────
// RECENT TASK HISTORY MODEL
// ──────────────────────────────────────────────
data class RecentTaskItem(
    val id: String,
    val title: String,
    val subtitle: String,
    val sizeBytes: Long,
    val timeAgo: String,
    val type: TaskType,
    val statusText: String,
    val isSuccess: Boolean = true
)

enum class TaskType {
    TRANSFER_SENT,
    TRANSFER_RECEIVED,
    RECOVERED_MEDIA
}

// ──────────────────────────────────────────────
// SUPER TRANSFER MODELS
// ──────────────────────────────────────────────
data class TransferFileItem(
    val id: String,
    val name: String,
    val sizeBytes: Long,
    val mimeType: String,
    val uri: Uri? = null,
    val sha256: String = "",
    val progress: Float = 0f,
    val status: TransferStatus = TransferStatus.PENDING,
    val errorMessage: String? = null
)

enum class TransferStatus {
    PENDING,
    WAITING_CONSENT,
    TRANSFERRING,
    PAUSED,
    COMPLETED,
    FAILED
}

enum class TransferDirection {
    SEND,
    RECEIVE,
    SCAN_CONNECT
}

data class TransferManifest(
    val senderDeviceName: String,
    val pairingToken: String,
    val fileCount: Int,
    val totalSizeBytes: Long,
    val files: List<TransferFileItem>
)

// ──────────────────────────────────────────────
// SUPER RECOVER 7-CATEGORY HONEST CLASSIFICATION
// ──────────────────────────────────────────────
enum class RecoverCategory(val labelEn: String, val labelHi: String, val extensions: String) {
    ALL_MEDIA("All Files", "सभी फाइलें", "All legitimately accessible media"),
    PHOTOS("Photos", "तस्वीरें", "JPG, PNG, HEIC, WEBP"),
    VIDEOS("Videos", "वीडियो", "MP4, MKV, MOV"),
    AUDIO_RECORDINGS("Audio", "ऑडियो व रिकॉर्डिंग", "M4A, AMR, WAV, MP3"),
    DOCUMENTS("Documents", "दस्तावेज़", "PDF, DOCX, XLSX, TXT, ZIP"),
    TRASH("Recycle Bin", "रीसायकल बिन", "Deleted & Trashed Files"),
    VAULT("Recovered Vault", "रिकवर की गई फाइलें", "Safely Restored Media")
}

data class StorageStats(
    val totalBytes: Long,
    val freeBytes: Long,
    val usedBytes: Long,
    val usedPercent: Float,
    val totalGbFormatted: String,
    val usedGbFormatted: String,
    val freeGbFormatted: String
)

enum class RecoverTier(
    val code: String,
    val titleEn: String,
    val titleHi: String,
    val descriptionEn: String,
    val badgeColorHex: Long
) {
    RESTORABLE_ORIGINAL(
        "A",
        "A. Restorable Original",
        "A. ओरिजिनल मीडिया",
        "Accessible original media in trash/pending/recycle directories",
        0xFF10B981 // Emerald
    ),
    HIDDEN_MEDIA(
        "B",
        "B. Hidden Media",
        "B. छुपी हुई मीडिया",
        "Files inside accessible .nomedia or dot-prefixed user directories",
        0xFF06B6D4 // Cyan
    ),
    DUPLICATE_OR_COPY(
        "C",
        "C. Duplicate / Copy",
        "C. बची हुई सेकंडरी कॉपी",
        "Surviving secondary copies in user-accessible storage folders",
        0xFF3B82F6 // Blue
    ),
    THUMBNAIL_PREVIEW(
        "D",
        "D. Thumbnail Preview",
        "D. थंबनेल व प्रीव्यू",
        "Low-resolution cached previews from accessible cache directories",
        0xFFF59E0B // Amber
    ),
    SYSTEM_TRASH(
        "E",
        "E. System Trash",
        "E. सिस्टम ट्रैश (Android 11+)",
        "MediaStore items where MediaColumns.IS_TRASHED == 1",
        0xFFEC4899 // Pink
    ),
    BACKUP_GUIDANCE(
        "F",
        "F. Backup Guidance",
        "F. बैकअप गाइडेंस",
        "Local backup archives or guidance for cloud/device backups",
        0xFF8B5CF6 // Purple
    ),
    UNAVAILABLE_SOURCE(
        "G",
        "G. Unavailable Source",
        "G. अनुपलब्ध फाइल",
        "Unreadable or permanently purged entries that cannot be restored",
        0xFF64748B // Slate
    ),
    POST_FORMAT_RAW(
        "P",
        "P. Post-Format Remnant",
        "P. फॉर्मेट के बाद की फाइल",
        "Raw unlinked cluster files carved from LOST.DIR, formatted partitions, and thumbdata",
        0xFF0EA5E9 // Sky Blue
    ),
    BYTE_CARVED(
        "H",
        "H. Byte Carved",
        "H. डीप बाइनरी कार्व्ड",
        "Forensically carved photos from .thumbdata and raw storage blocks",
        0xFF06B6D4 // Cyan
    )
}

data class RecoverSettings(
    val postFormatDeepScan: Boolean = true,
    val aggressiveByteCarving: Boolean = true,
    val autoSkipDuplicates: Boolean = true,
    val forceMediaScannerSync: Boolean = true,
    val gallerySaveDestination: String = "DCIM/SuperTelecom_Recovered",
    val minFileSizeBytes: Long = 1024L
)

data class RecoverItem(
    val id: String,
    val name: String,
    val sizeBytes: Long,
    val dateModified: String,
    val sourcePath: String,
    val category: RecoverCategory,
    val tier: RecoverTier,
    val uri: Uri? = null,
    val qualityTag: String = "Legitimate On-Device File",
    val isSelected: Boolean = false,
    val isRestorable: Boolean = true,
    val timestampMillis: Long = 0L
)

// ──────────────────────────────────────────────
// SUPER LAUNCHER MODELS
// ──────────────────────────────────────────────
data class AppItem(
    val label: String,
    val packageName: String,
    val activityName: String,
    val icon: Drawable?,
    val isGame: Boolean = false
)

enum class LauncherTheme(val titleEn: String, val titleHi: String, val subtitleEn: String) {
    MINIMAL("Super Minimal", "सुपर मिनिमल", "Monochrome focus with zero distractions"),
    IOS_INSPIRED("Super iOS-Inspired", "सुपर iOS-स्टाइल", "Smooth rounded cards, blur & bottom dock"),
    PIXEL_INSPIRED("Super Pixel-Inspired", "सुपर पिक्सल-स्टाइल", "Material You accents & clean pill search"),
    CLASSIC("Super Classic", "सुपर क्लासिक", "Traditional Android grid layout")
}
