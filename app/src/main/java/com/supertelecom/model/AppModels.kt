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
    val status: TransferStatus = TransferStatus.PENDING
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

// ──────────────────────────────────────────────
// SUPER RECOVER MODELS
// ──────────────────────────────────────────────
enum class RecoverCategory(val labelEn: String, val labelHi: String, val extensions: String) {
    PHOTOS("Photos", "फोटो", "JPG, PNG, HEIC, WEBP"),
    VIDEOS("Videos", "वीडियो", "MP4, MKV, MOV"),
    AUDIO_RECORDINGS("Recordings", "कॉल व वॉइस रिकॉर्डिंग", "M4A, AMR, WAV"),
    MUSIC("Music", "म्यूजिक व गाने", "MP3, AAC, FLAC"),
    DOCUMENTS("Documents", "दस्तावेज़", "PDF, DOCX, XLSX, ZIP"),
    ALL_MEDIA("All Media", "सभी फाइलें", "All Recoverable")
}

enum class RecoverTier(
    val tierNumber: Int,
    val titleEn: String,
    val titleHi: String,
    val descriptionEn: String,
    val badgeColorHex: Long
) {
    ORIGINAL_MEDIA(
        1,
        "1. Recoverable Originals",
        "1. ओरिजिनल मीडिया",
        "Found in MediaStore recycle bin & system trash blocks",
        0xFF10B981 // Emerald
    ),
    HIDDEN_COPIES(
        2,
        "2. Hidden Copies",
        "2. छुपे हुए फोल्डर",
        "Found in app cache folders and surviving subdirectories",
        0xFF06B6D4 // Cyan
    ),
    THUMBNAIL_PREVIEWS(
        3,
        "3. Thumbnails & Previews",
        "3. थंबनेल व प्रीव्यू",
        "Reconstructed bitmap preview from system thumbnail databases",
        0xFFF59E0B // Amber
    ),
    BACKUP_RESTORATION(
        4,
        "4. Backup Sources",
        "4. बैकअप कॉपी",
        "Physical lab recovery required (Station Road Giridih)",
        0xFF8B5CF6 // Violet
    )
}

data class RecoverItem(
    val id: String,
    val name: String,
    val sizeBytes: Long,
    val dateModified: String,
    val sourcePath: String,
    val category: RecoverCategory,
    val tier: RecoverTier,
    val uri: Uri? = null,
    val qualityTag: String = "High Original",
    val isSelected: Boolean = false
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
