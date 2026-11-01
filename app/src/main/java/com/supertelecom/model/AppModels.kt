package com.supertelecom.model

import android.graphics.drawable.Drawable
import android.net.Uri

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
    RECEIVE
}

// ──────────────────────────────────────────────
// SUPER RECOVER MODELS
// ──────────────────────────────────────────────
enum class RecoverCategory(val labelEn: String, val labelHi: String) {
    PHOTOS("Photos", "तस्वीरें"),
    VIDEOS("Videos", "वीडियो"),
    AUDIO("Audio & Recordings", "ऑडियो व रिकॉर्डिंग्स"),
    DOCUMENTS("Documents", "दस्तावेज़")
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
        "Recoverable Original Media",
        "मूल फ़ाइलें (हाई क्वालिटी)",
        "Found in MediaStore pending or system recycle bin",
        0xFF10B981 // Emerald
    ),
    HIDDEN_COPIES(
        2,
        "Existing Hidden Copies",
        "छुपी हुई प्रतियां (Hidden)",
        "Found in app cache folders and surviving subdirectories",
        0xFF06B6D4 // Cyan
    ),
    THUMBNAIL_PREVIEWS(
        3,
        "Low-Res Thumbnails & Previews",
        "थंबनेल व प्रीव्यू",
        "Generated thumbnail cache. Readable preview only",
        0xFFF59E0B // Amber
    ),
    BACKUP_RESTORATION(
        4,
        "External Backup Options",
        "एक्सटर्नल बैकअप विकल्प",
        "Requires cloud/account restoration or physical lab intervention",
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
    IOS_INSPIRED("Super iOS-Inspired", "सुपर iOS-स्टाइल", "Smooth rounded cards & grid styling"),
    PIXEL_INSPIRED("Super Pixel-Inspired", "सुपर पिक्सल-स्टाइल", "Material You accents & clean pill search"),
    CLASSIC("Super Classic", "सुपर क्लासिक", "Standard Android grid layout")
}
