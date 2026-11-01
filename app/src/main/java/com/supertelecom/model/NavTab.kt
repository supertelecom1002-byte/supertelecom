package com.supertelecom.model

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.filled.Restore
import androidx.compose.material.icons.filled.Smartphone
import androidx.compose.ui.graphics.vector.ImageVector

enum class NavTab(
    val titleEn: String,
    val titleHi: String,
    val icon: ImageVector
) {
    HOME("Home", "होम", Icons.Default.Home),
    TRANSFER("Transfer", "डेटा ट्रांसफर", Icons.Default.Send),
    RECOVER("Recover", "डेटा रिकवर", Icons.Default.Restore),
    LAUNCHER("Launcher", "सुपर लॉन्चर", Icons.Default.Smartphone)
}
